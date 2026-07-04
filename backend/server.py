from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import re
import csv
import io
import json
import logging
import uuid
import shutil
import asyncio
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from urllib.parse import quote

import httplib2
import requests
import firebase_admin
from firebase_admin import credentials as fb_credentials, auth as fb_auth, storage as fb_storage
from fastapi import FastAPI, APIRouter, Depends, HTTPException, Request, UploadFile, File, Query
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr

# ---------- Logging ----------
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ---------- DB ----------
mongo_url = os.environ['MONGO_URL']
MONGO_TIMEOUT_MS = int(os.environ.get("MONGO_TIMEOUT_MS", "3000"))
client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=MONGO_TIMEOUT_MS)
db = client[os.environ['DB_NAME']]

FIREBASE_WEB_API_KEY = os.environ.get('FIREBASE_WEB_API_KEY')
FIREBASE_STORAGE_BUCKET = os.environ.get('FIREBASE_STORAGE_BUCKET')

# ---------- Firebase Admin ----------
sa_path = os.environ.get('FIREBASE_SA_PATH')
fb_project = os.environ.get('FIREBASE_PROJECT_ID')
try:
    if sa_path:
        # Support two modes:
        # 1) FIREBASE_SA_PATH contains a filesystem path (absolute or relative to backend/)
        # 2) FIREBASE_SA_PATH contains the raw JSON content of the service account
        cred_obj = None
        if sa_path.strip().startswith('{'):
            try:
                cred_json = json.loads(sa_path)
                cred_obj = fb_credentials.Certificate(cred_json)
            except Exception as e:
                raise RuntimeError(f"FIREBASE_SA_PATH appears to contain JSON but failed to parse: {e}")
        else:
            # Resolve relative paths against the backend root directory
            sa_candidate = sa_path
            if not os.path.isabs(sa_candidate):
                sa_candidate = str(ROOT_DIR / sa_candidate)
            if not os.path.exists(sa_candidate):
                raise FileNotFoundError(f"Firebase service account file not found: {sa_candidate}")
            cred_obj = fb_credentials.Certificate(sa_candidate)

        if cred_obj and not firebase_admin._apps:
            options = {"storageBucket": FIREBASE_STORAGE_BUCKET} if FIREBASE_STORAGE_BUCKET else None
            firebase_admin.initialize_app(cred_obj, options)
            logger.info(f"Firebase Admin initialised for project {fb_project}")
    else:
        logger.warning("FIREBASE_SA_PATH not set; Firebase Admin not initialised.")
except Exception as e:
    logger.error(f"Failed to initialise Firebase Admin: {e}")

# ---------- App ----------
app = FastAPI(title="Carry Fast Corporation API")
api_router = APIRouter(prefix="/api")

# ---------- Uploads ----------
UPLOAD_DIR = Path(os.environ['UPLOAD_DIR'])
if not UPLOAD_DIR.is_absolute():
    UPLOAD_DIR = ROOT_DIR / UPLOAD_DIR
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
PUBLIC_BASE_URL = os.environ.get('PUBLIC_BASE_URL', '').rstrip('/')
UPLOAD_STORAGE_BACKEND = os.environ.get('UPLOAD_STORAGE_BACKEND', 'firebase').lower()
UPLOAD_MAX_BYTES = 8 * 1024 * 1024
UPLOAD_ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
UPLOAD_ALLOWED_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}

# ---------- Helpers ----------
bearer = HTTPBearer(auto_error=False)

def firebase_storage_available() -> bool:
    return bool(
        UPLOAD_STORAGE_BACKEND == "firebase"
        and FIREBASE_STORAGE_BUCKET
        and firebase_admin._apps
    )


def firebase_download_url(bucket_name: str, object_path: str, token: str) -> str:
    encoded_path = quote(object_path, safe="")
    return f"https://firebasestorage.googleapis.com/v0/b/{bucket_name}/o/{encoded_path}?alt=media&token={token}"


async def upload_to_firebase_storage(name: str, content: bytes, content_type: str) -> str:
    bucket = fb_storage.bucket(FIREBASE_STORAGE_BUCKET)
    object_path = f"admin-uploads/{name}"
    token = uuid.uuid4().hex
    blob = bucket.blob(object_path)
    blob.cache_control = "public, max-age=31536000, immutable"
    blob.metadata = {"firebaseStorageDownloadTokens": token}

    await asyncio.to_thread(blob.upload_from_string, content, content_type=content_type)
    await asyncio.to_thread(blob.patch)
    return firebase_download_url(bucket.name, object_path, token)

def slugify(value: str) -> str:
    value = value.lower().strip()
    value = re.sub(r"[^a-z0-9\s-]", "", value)
    value = re.sub(r"[\s_-]+", "-", value)
    return value.strip("-")


async def is_db_available() -> bool:
    try:
        await client.admin.command("ping")
        return True
    except Exception as e:
        logger.error(f"MongoDB unavailable: {e}")
        return False


GA4_PROPERTY_ID = os.environ.get("GA4_PROPERTY_ID")
GA4_SA_PATH = os.environ.get("GA4_SA_PATH", sa_path)
GA4_SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"]
GA4_TIMEOUT_SECONDS = int(os.environ.get("GA4_TIMEOUT_SECONDS", "5"))

CORS_ORIGINS = [o.strip() for o in os.environ.get('CORS_ORIGINS', 'http://localhost:3000').split(',') if o.strip()]
if not CORS_ORIGINS:
    CORS_ORIGINS = ["http://localhost:3000"]
    logger.warning("CORS_ORIGINS was empty; defaulting to http://localhost:3000")


def get_ga4_credentials() -> Optional[service_account.Credentials]:
    if not GA4_PROPERTY_ID or not GA4_SA_PATH:
        return None
    try:
        if GA4_SA_PATH.strip().startswith("{"):
            cred_info = json.loads(GA4_SA_PATH)
            return service_account.Credentials.from_service_account_info(
                cred_info,
                scopes=GA4_SCOPES,
            )
        sa_candidate = GA4_SA_PATH
        if not os.path.isabs(sa_candidate):
            sa_candidate = str(ROOT_DIR / sa_candidate)
        return service_account.Credentials.from_service_account_file(sa_candidate, scopes=GA4_SCOPES)
    except Exception as e:
        logger.warning(f"GA4 credentials could not be loaded: {e}")
        return None


def fetch_ga4_report(days: int = 7) -> Optional[dict]:
    if not GA4_PROPERTY_ID:
        return None
    creds = get_ga4_credentials()
    if not creds:
        return None

    try:
        analytics = build("analyticsdata", "v1beta", credentials=creds, cache_discovery=False)
        property_name = f"properties/{GA4_PROPERTY_ID}"
        body = {
            "dateRanges": [{"startDate": f"{days}daysAgo", "endDate": "today"}],
            "dimensions": [{"name": "date"}],
            "metrics": [
                {"name": "activeUsers"},
                {"name": "newUsers"},
                {"name": "sessions"},
                {"name": "engagedSessions"},
            ],
            "limit": days,
        }
        http = httplib2.Http(timeout=GA4_TIMEOUT_SECONDS)
        response = analytics.properties().runReport(property=property_name, body=body).execute(http=http)
        rows = response.get("rows", [])
        if not rows:
            return {"metrics": {}, "timeline": []}

        metrics = {"activeUsers": 0, "newUsers": 0, "sessions": 0, "engagedSessions": 0}
        timeline = []
        for row in rows:
            date = row["dimensionValues"][0]["value"]
            active_users = int(float(row["metricValues"][0]["value"]))
            new_users = int(float(row["metricValues"][1]["value"]))
            sessions = int(float(row["metricValues"][2]["value"]))
            engaged_sessions = int(float(row["metricValues"][3]["value"]))
            metrics["activeUsers"] += active_users
            metrics["newUsers"] += new_users
            metrics["sessions"] += sessions
            metrics["engagedSessions"] += engaged_sessions
            timeline.append({
                "date": date,
                "activeUsers": active_users,
                "newUsers": new_users,
                "sessions": sessions,
                "engagedSessions": engaged_sessions,
            })
        return {"metrics": metrics, "timeline": timeline}
    except HttpError as e:
        logger.warning(f"GA4 API request failed: {e}")
        return None
    except Exception as e:
        logger.warning(f"GA4 API request failed: {e}")
        return None


async def get_current_admin(
    creds: Optional[HTTPAuthorizationCredentials] = Depends(bearer),
) -> dict:
    if not creds or not creds.credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        decoded = fb_auth.verify_id_token(creds.credentials)
    except fb_auth.ExpiredIdTokenError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {type(e).__name__}")
    uid = decoded.get("uid")
    if not uid:
        raise HTTPException(status_code=401, detail="No UID in token")
    user = await db.users.find_one({"uid": uid}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=403, detail="No user record — contact administrator")
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    if user.get("disabled"):
        raise HTTPException(status_code=403, detail="Account disabled")
    return user


# ---------- Models ----------
class LeadIn(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    company: Optional[str] = ""
    designation: Optional[str] = ""
    enquiry_type: Optional[str] = "General"
    message: str
    source: str = "contact"


class BlogIn(BaseModel):
    title: str
    excerpt: str
    content: str
    cover_image: Optional[str] = ""
    og_image: Optional[str] = ""
    custom_slug: Optional[str] = ""
    tags: List[str] = []
    meta_title: Optional[str] = ""
    meta_description: Optional[str] = ""
    meta_keywords: Optional[str] = ""
    status: str = "published"  # draft | published


class SiteConfigIn(BaseModel):
    company: dict = {}
    contact: dict = {}
    stats: List[dict] = []
    hero_slides: List[dict] = []
    testimonials: dict = {}
    policies: dict = {}
    footer: dict = {}
    social: dict = {}


class NewAdminIn(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = ""


# ---------- Default Site Config ----------
DEFAULT_SITE_CONFIG = {
    "company": {
        "name": "Carry Fast Corporation",
        "short": "Carry Fast",
        "tagline": "Custom Broker · Est. 1995",
        "logo_url": "/CFC_Logo-removebg-preview.png",
    },
    "contact": {
        "phone_primary": "+91 731 2524079",
        "phone_secondary": "+91 731 4006969",
        "phone_direct": "+91 9300077025",
        "phone_urgent": "+91 9300077018",
        "whatsapp_number": "919300077018",
        "email": "info@carryfastcorp.com",
        "address_line_1": "502, A Block, Corporate House",
        "address_line_2": "169 R.N.T. Marg, Indore — 452 001",
        "address_line_3": "Madhya Pradesh, India",
        "working_hours": "Monday – Saturday · 10:30 AM – 6:30 PM",
        "map_query": "Corporate House 169 RNT Marg Indore",
    },
    "stats": [
        {"value": 30, "suffix": "+", "label": "Years of Experience", "sub": "Handling customs clearance across changing regulations, port procedures, and trade policy since 1995."},
        {"value": 12000, "suffix": "+", "label": "Containers & Shipments Annually", "sub": "High-volume capability across air and sea cargo, covering diverse industries and cargo categories."},
        {"value": 99.5, "suffix": "%", "label": "On-Time Clearance Rate", "sub": "Documentation accuracy and procedural knowledge translate directly to clearances that do not get held up."},
    ],
    "hero_slides": [
        {"image": "/logos/Logistics-in-India.jpg", "overline": "Customs Clearance · Since 1995", "title_lines": ["Customs Clearance.", "Backed by 30 Years"], "title_span": "of Operations.", "subtitle": "India's import and export procedures are detailed, time-sensitive, and constantly evolving. Carry Fast Corporation has managed this process for Indian businesses since 1995."},
        {"image": "/logos/logistic1.jpg", "overline": "AEO Certified · Indian Customs", "title_lines": ["The Only AEO-Certified", "Customs Intermediary"], "title_span": "in Madhya Pradesh.", "subtitle": "AEO certification by Indian Customs — audited for compliance, financial soundness and operational reliability. Our clients work with a partner whose standards are independently verified."},
        {"image": "/logos/logistic3.jpg", "overline": "12,000+ Shipments · 99.5% On-Time", "title_lines": ["Cargo clears.", "Operations"], "title_span": "never wait.", "subtitle": "Bill of Entry filed the same day. Examination handled at the port by our team. Documentation pre-validated before submission. A 99.5% on-time rate maintained year after year."},
        {"image": "/logos/logistic4.jpg", "overline": "CONCOR Best Customs Broker · Since 1997", "title_lines": ["Recognised by CONCOR", "every year"], "title_span": "since 1997.", "subtitle": "An unbroken record of recognition across nearly three decades — awarded annually by Container Corporation of India for consistent operational performance."},
    ],
    "testimonials": {
        "heading": "What Our Clients Say",
        "subtitle": "Client feedback from importers and exporters who rely on Carry Fast for customs clearance and trade compliance.",
        "items": [
            {"quote": "We have worked with Carry Fast for several years across imports of machinery and industrial equipment. Their team understands customs requirements thoroughly and consistently delivers timely clearances.", "author": "— Client Name", "company": "Company"},
            {"quote": "Carry Fast has been a dependable customs partner for our business. Documentation is handled accurately, communication is prompt, and shipment status is always clear.", "author": "— Client Name", "company": "Company"},
            {"quote": "Their knowledge of customs procedures has helped us avoid unnecessary delays on multiple shipments. We value their practical approach and responsiveness.", "author": "— Client Name", "company": "Company"},
            {"quote": "We handle regular imports through multiple ports, and Carry Fast has consistently maintained the same level of service and attention to detail across every shipment.", "author": "— Client Name", "company": "Company"},
            {"quote": "The team understands the urgency of commercial cargo. Whenever issues arise, they work quickly to resolve them and keep the clearance process moving.", "author": "— Client Name", "company": "Company"},
            {"quote": "Carry Fast combines experience with accountability. Their guidance on documentation and compliance has been valuable to our import operations.", "author": "— Client Name", "company": "Company"},
            {"quote": "Professional, responsive, and reliable. Their team has supported our customs clearance requirements efficiently and continues to be a trusted logistics partner.", "author": "— Client Name", "company": "Company"},
        ],
    },
    "footer": {
        "tagline": "Customs clearance, trade compliance, and documentation support for manufacturers, traders, and industrial businesses across India.",
        "since": "Serving Indian Trade Since 1995",
    },
    "policies": {},
    "social": {
        "linkedin": "",
        "facebook": "",
        "twitter": "",
        "instagram": "",
    },
}


# ---------- Public: Site Config ----------
@api_router.get("/site-config")
async def get_site_config():
    try:
        cfg = await db.site_config.find_one({"_id": "singleton"}, {"_id": 0})
        if not cfg:
            return DEFAULT_SITE_CONFIG
        return cfg
    except Exception as e:
        logger.warning(f"Returning default site config because MongoDB is unavailable: {e}")
        return DEFAULT_SITE_CONFIG


# ---------- Public Blog ----------
@api_router.get("/blog")
async def list_blog(limit: int = 50, tag: Optional[str] = None):
    q = {"status": "published"}
    if tag:
        q["tags"] = tag
    posts = await db.blog_posts.find(q, {"_id": 0, "content": 0}).sort("published_at", -1).to_list(limit)
    return posts


@api_router.get("/blog/{slug}")
async def get_blog(slug: str):
    post = await db.blog_posts.find_one({"slug": slug, "status": "published"}, {"_id": 0})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    await db.blog_posts.update_one({"slug": slug}, {"$inc": {"views": 1}})
    return post


# ---------- Public Leads ----------
@api_router.post("/leads")
async def create_lead(body: LeadIn):
    doc = body.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    doc["status"] = "new"
    doc["read"] = False
    await db.leads.insert_one(doc)
    return {"ok": True, "id": doc["id"]}


class LoginIn(BaseModel):
    email: EmailStr
    password: str


def _firebase_sign_in(email: str, password: str) -> dict:
    if not FIREBASE_WEB_API_KEY:
        raise RuntimeError("FIREBASE_WEB_API_KEY is required for backend auth login.")
    url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_WEB_API_KEY}"
    resp = requests.post(url, json={"email": email, "password": password, "returnSecureToken": True}, timeout=10)
    if resp.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return resp.json()


@api_router.post("/auth/login")
async def login(body: LoginIn):
    try:
        data = await asyncio.to_thread(_firebase_sign_in, body.email, body.password)
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Firebase login failed: {exc}")
        raise HTTPException(status_code=500, detail="Authentication service unavailable")

    id_token = data.get("idToken")
    if not id_token:
        raise HTTPException(status_code=500, detail="Authentication service did not return a token")

    try:
        decoded = fb_auth.verify_id_token(id_token)
    except Exception as exc:
        logger.error(f"Failed to verify Firebase ID token: {exc}")
        raise HTTPException(status_code=401, detail="Invalid authentication token")

    uid = decoded.get("uid")
    if not uid:
        raise HTTPException(status_code=401, detail="Invalid authentication token")

    user = await db.users.find_one({"uid": uid}, {"_id": 0})
    if not user or user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    return {"token": id_token, "user": user}


# ---------- Auth ----------
@api_router.get("/auth/me")
async def me(current=Depends(get_current_admin)):
    return current


# ---------- Admin: Site Config ----------
@api_router.get("/admin/site-config")
async def admin_get_site_config(current=Depends(get_current_admin)):
    cfg = await db.site_config.find_one({"_id": "singleton"}, {"_id": 0})
    return cfg or DEFAULT_SITE_CONFIG


@api_router.put("/admin/site-config")
async def admin_update_site_config(body: SiteConfigIn, current=Depends(get_current_admin)):
    update = body.model_dump()
    update["updated_at"] = datetime.now(timezone.utc).isoformat()
    update["updated_by"] = current.get("email")
    await db.site_config.update_one({"_id": "singleton"}, {"$set": update}, upsert=True)
    return {"ok": True}


# ---------- Admin: Uploads ----------
@api_router.post("/admin/upload")
async def admin_upload(request: Request, file: UploadFile = File(...), current=Depends(get_current_admin)):
    if file.content_type not in UPLOAD_ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail=f"Unsupported type. Allowed: {sorted(UPLOAD_ALLOWED_TYPES)}")

    ext = Path(file.filename or "").suffix.lower() or ".jpg"
    safe_ext = ext if ext in UPLOAD_ALLOWED_EXTS else ".jpg"
    name = f"{uuid.uuid4().hex}{safe_ext}"
    content = await file.read(UPLOAD_MAX_BYTES + 1)
    size = len(content)
    if size > UPLOAD_MAX_BYTES:
        raise HTTPException(status_code=413, detail="File exceeds 8MB limit")

    if firebase_storage_available():
        try:
            public_url = await upload_to_firebase_storage(name, content, file.content_type)
            return {"ok": True, "url": public_url, "filename": name, "size": size, "storage": "firebase"}
        except Exception as e:
            logger.error(f"Firebase Storage upload failed; falling back to local upload: {e}")

    dest = UPLOAD_DIR / name
    dest.write_bytes(content)
    public_url = f"{PUBLIC_BASE_URL}/uploads/{name}" if PUBLIC_BASE_URL else str(request.url_for("uploads", path=name))
    return {"ok": True, "url": public_url, "filename": name, "size": size, "storage": "local"}


# ---------- Admin: Blog CMS ----------
@api_router.get("/admin/blog")
async def admin_list_blog(current=Depends(get_current_admin)):
    return await db.blog_posts.find({}, {"_id": 0, "content": 0}).sort("created_at", -1).to_list(500)


@api_router.get("/admin/blog/{post_id}")
async def admin_get_blog(post_id: str, current=Depends(get_current_admin)):
    post = await db.blog_posts.find_one({"id": post_id}, {"_id": 0})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


async def _resolve_slug(custom: str, fallback_title: str) -> str:
    base = slugify(custom or fallback_title) or uuid.uuid4().hex[:8]
    slug = base
    i = 2
    while await db.blog_posts.find_one({"slug": slug}):
        slug = f"{base}-{i}"
        i += 1
    return slug


@api_router.post("/admin/blog")
async def admin_create_blog(body: BlogIn, current=Depends(get_current_admin)):
    now = datetime.now(timezone.utc).isoformat()
    slug = await _resolve_slug(body.custom_slug, body.title)
    doc = body.model_dump()
    doc.update({
        "id": str(uuid.uuid4()),
        "slug": slug,
        "author": current.get("name", "Admin"),
        "views": 0,
        "created_at": now,
        "updated_at": now,
        "published_at": now if body.status == "published" else None,
    })
    await db.blog_posts.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.put("/admin/blog/{post_id}")
async def admin_update_blog(post_id: str, body: BlogIn, current=Depends(get_current_admin)):
    existing = await db.blog_posts.find_one({"id": post_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Post not found")
    update = body.model_dump()
    # honour custom slug change (re-unique if changed)
    if body.custom_slug:
        desired = slugify(body.custom_slug)
        if desired and desired != existing.get("slug"):
            conflict = await db.blog_posts.find_one({"slug": desired, "id": {"$ne": post_id}})
            if not conflict:
                update["slug"] = desired
    update["updated_at"] = datetime.now(timezone.utc).isoformat()
    if body.status == "published" and not existing.get("published_at"):
        update["published_at"] = update["updated_at"]
    await db.blog_posts.update_one({"id": post_id}, {"$set": update})
    return {"ok": True}


@api_router.delete("/admin/blog/{post_id}")
async def admin_delete_blog(post_id: str, current=Depends(get_current_admin)):
    await db.blog_posts.delete_one({"id": post_id})
    return {"ok": True}


# ---------- Admin: Leads (filter/search/export) ----------
@api_router.get("/admin/leads")
async def admin_list_leads(
    current=Depends(get_current_admin),
    status: Optional[str] = None,
    enquiry_type: Optional[str] = None,
    q: Optional[str] = None,
    limit: int = 1000,
):
    query: dict = {}
    if status:
        query["status"] = status
    if enquiry_type:
        query["enquiry_type"] = enquiry_type
    if q:
        rx = {"$regex": q, "$options": "i"}
        query["$or"] = [{"name": rx}, {"email": rx}, {"company": rx}, {"message": rx}, {"phone": rx}]
    return await db.leads.find(query, {"_id": 0}).sort("created_at", -1).to_list(limit)


@api_router.get("/admin/leads/unread-count")
async def admin_unread_leads(current=Depends(get_current_admin)):
    n = await db.leads.count_documents({"read": False})
    return {"count": n}


@api_router.post("/admin/leads/mark-all-read")
async def admin_mark_all_read(current=Depends(get_current_admin)):
    res = await db.leads.update_many({"read": False}, {"$set": {"read": True}})
    return {"ok": True, "modified": res.modified_count}


@api_router.put("/admin/leads/{lead_id}")
async def admin_update_lead(lead_id: str, body: dict, current=Depends(get_current_admin)):
    allowed = {k: v for k, v in body.items() if k in {"status", "notes", "read"}}
    await db.leads.update_one({"id": lead_id}, {"$set": allowed})
    return {"ok": True}


@api_router.delete("/admin/leads/{lead_id}")
async def admin_delete_lead(lead_id: str, current=Depends(get_current_admin)):
    await db.leads.delete_one({"id": lead_id})
    return {"ok": True}


@api_router.get("/admin/leads/export.csv")
async def admin_export_leads_csv(
    current=Depends(get_current_admin),
    status: Optional[str] = None,
    enquiry_type: Optional[str] = None,
    q: Optional[str] = None,
):
    query: dict = {}
    if status:
        query["status"] = status
    if enquiry_type:
        query["enquiry_type"] = enquiry_type
    if q:
        rx = {"$regex": q, "$options": "i"}
        query["$or"] = [{"name": rx}, {"email": rx}, {"company": rx}, {"message": rx}]
    leads = await db.leads.find(query, {"_id": 0}).sort("created_at", -1).to_list(10000)

    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(["Created At", "Name", "Email", "Phone", "Company", "Designation", "Enquiry Type", "Status", "Message", "ID"])
    for l in leads:
        writer.writerow([
            l.get("created_at", ""), l.get("name", ""), l.get("email", ""),
            l.get("phone", ""), l.get("company", ""), l.get("designation", ""),
            l.get("enquiry_type", ""), l.get("status", ""),
            (l.get("message", "") or "").replace("\n", " | "), l.get("id", ""),
        ])
    buf.seek(0)
    filename = f"carry-fast-leads-{datetime.now().strftime('%Y%m%d-%H%M')}.csv"
    return StreamingResponse(
        iter([buf.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


# ---------- Admin: Users ----------
@api_router.get("/admin/users")
async def admin_list_users(current=Depends(get_current_admin)):
    return await db.users.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)


@api_router.post("/admin/users")
async def admin_create_user(body: NewAdminIn, current=Depends(get_current_admin)):
    email = body.email.lower()
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    try:
        fb_user = fb_auth.create_user(email=email, password=body.password, display_name=body.name or "")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Firebase error: {e}")
    doc = {
        "uid": fb_user.uid,
        "email": email,
        "name": body.name or "",
        "role": "admin",
        "disabled": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "created_by": current.get("email"),
    }
    await db.users.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api_router.delete("/admin/users/{uid}")
async def admin_delete_user(uid: str, current=Depends(get_current_admin)):
    if current.get("uid") == uid:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
    try:
        fb_auth.delete_user(uid)
    except fb_auth.UserNotFoundError:
        pass
    await db.users.delete_one({"uid": uid})
    return {"ok": True}


# ---------- Admin: Analytics ----------
@api_router.get("/admin/analytics")
async def admin_analytics(current=Depends(get_current_admin)):
    leads_total = await db.leads.count_documents({})
    leads_new = await db.leads.count_documents({"status": "new"})
    leads_unread = await db.leads.count_documents({"read": False})
    posts_total = await db.blog_posts.count_documents({})
    posts_published = await db.blog_posts.count_documents({"status": "published"})

    pipeline = [{"$group": {"_id": None, "total": {"$sum": "$views"}}}]
    cursor = db.blog_posts.aggregate(pipeline)
    views_doc = await cursor.to_list(1)
    total_views = views_doc[0]["total"] if views_doc else 0

    fourteen_days_ago = (datetime.now(timezone.utc) - timedelta(days=14)).isoformat()
    recent_leads = await db.leads.find({"created_at": {"$gte": fourteen_days_ago}}, {"_id": 0}).sort("created_at", -1).to_list(500)

    by_day = {}
    for l in recent_leads:
        d = l["created_at"][:10]
        by_day[d] = by_day.get(d, 0) + 1
    days = []
    for i in range(13, -1, -1):
        d = (datetime.now(timezone.utc) - timedelta(days=i)).date().isoformat()
        days.append({"date": d, "leads": by_day.get(d, 0)})

    by_type = {}
    for l in recent_leads:
        t = l.get("enquiry_type") or "General"
        by_type[t] = by_type.get(t, 0) + 1
    enquiry_breakdown = [{"type": k, "count": v} for k, v in sorted(by_type.items(), key=lambda x: -x[1])]

    ga4_data = await asyncio.to_thread(fetch_ga4_report)
    return {
        "kpis": {
            "leads_total": leads_total,
            "leads_new": leads_new,
            "leads_unread": leads_unread,
            "posts_total": posts_total,
            "posts_published": posts_published,
            "blog_views": total_views,
        },
        "timeline": days,
        "enquiry_breakdown": enquiry_breakdown,
        "recent_leads": recent_leads[:8],
        "ga4": ga4_data,
    }


# ---------- Health ----------
@api_router.get("/")
async def root():
    return {"service": "Carry Fast Corporation API", "ok": True}


app.include_router(api_router)
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_security_and_cache_headers(request: Request, call_next):
    response = await call_next(request)

    # Strong security defaults for all backend responses
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.setdefault("Permissions-Policy", "interest-cohort=()")
    response.headers.setdefault("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")
    response.headers.setdefault("Cross-Origin-Opener-Policy", "same-origin")
    response.headers.setdefault("Cross-Origin-Embedder-Policy", "unsafe-none")
    response.headers.setdefault("X-Permitted-Cross-Domain-Policies", "none")
    response.headers.setdefault("X-Download-Options", "noopen")
    response.headers.setdefault(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net; connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://fonts.googleapis.com https://fonts.gstatic.com https://connect.facebook.net https://www.facebook.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://www.google-analytics.com https://www.facebook.com; font-src 'self' https://fonts.gstatic.com data:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';",
    )

    # Cache immutable uploads, but keep dynamic/admin API responses fresh.
    if request.url.path.startswith("/uploads"):
        response.headers["Cache-Control"] = "public, max-age=31536000, immutable"
    elif request.url.path.startswith("/api/admin/") or request.url.path == "/api/site-config":
        response.headers["Cache-Control"] = "no-store"
    elif request.method == "GET" and request.url.path.startswith("/api/"):
        response.headers["Cache-Control"] = "public, max-age=30, stale-while-revalidate=60"

    return response


# ---------- Seed Data ----------
SEED_BLOGS = [
    {
        "title": "AEO Certification: What Indian Importers Should Know in 2026",
        "excerpt": "Authorised Economic Operator status is now a recognised compliance differentiator. Here is what AEO means in practice — and how it affects clearance timelines for importers.",
        "tags": ["cbic", "aeo", "compliance"],
        "content": "## Why AEO matters more than ever\n\nThe Authorised Economic Operator (AEO) programme run by Indian Customs is no longer a niche certification. For importers handling regular consignments, working with an AEO-certified customs broker can materially reduce examination frequency, documentation queries, and overall clearance time.\n\n### What AEO actually verifies\nAEO certification is granted only after a detailed audit covering:\n\n- Financial soundness of the entity\n- Three-year customs compliance record\n- Internal control systems for record-keeping\n- Operational reliability and security protocols\n- Procedural discipline in handling consignments\n\n### The practical benefit for importers\nAt Carry Fast Corporation — the only AEO-certified customs intermediary in Madhya Pradesh — clients see three measurable benefits:\n\n1. **Reduced physical examination rates** on routine consignments\n2. **Faster Bill of Entry assessment** turnaround\n3. **Direct credibility** with port and customs officers who recognise the AEO mark\n\nIf you are evaluating customs brokers in 2026, AEO status should be a baseline filter — not a nice-to-have.",
        "cover_image": "/logos/Logistics-in-India.jpg",
        "meta_title": "AEO Certification Guide for Indian Importers 2026 | Carry Fast",
        "meta_description": "Understand what AEO certification means for Indian importers, the audit process, and the practical benefits of working with an AEO-certified customs broker.",
        "meta_keywords": "AEO certification India, authorised economic operator, customs broker AEO, Indian customs AEO benefits",
    },
    {
        "title": "Bill of Entry Filing: A Step-by-Step Operational Guide",
        "excerpt": "From document collection to out-of-charge, here is the complete sequence of a clean Bill of Entry filing in India — including the most common pitfalls importers face.",
        "tags": ["icegate", "procedures", "bill-of-entry"],
        "content": "## The Bill of Entry process, end-to-end\n\nA Bill of Entry (BoE) is the core import declaration filed on ICEGATE. The accuracy of the BoE determines whether a consignment clears cleanly or gets pulled for query, examination, or re-assessment.\n\n### The 7 sequential stages\n\n1. **Pre-arrival document collection** — Commercial invoice, packing list, BL/AWB, COO, import licences\n2. **HSN classification** — Eight-digit code aligned with current Customs Tariff\n3. **ICEGATE filing** — Pre-filing where possible to compress timelines\n4. **Risk Management System** routing — Green, Yellow, or Red channel\n5. **Assessment** — Duty computation and licence verification\n6. **Examination** — Physical inspection if RMS calls for it\n7. **Out-of-Charge** — Final release after duty payment\n\n### Top 5 reasons BoEs get held up\n\n- HSN code mismatch between invoice and filing\n- Country of origin discrepancies\n- Missing licence references for restricted items\n- Valuation outliers triggering SVB review\n- BIS / FSSAI compliance gaps\n\n### How Carry Fast handles this differently\nFor every BoE, our team runs a pre-filing checklist covering classification, duty rates, applicable import conditions, and licensing references. This single discipline is why our 99.5% on-time clearance rate is consistent across cargo categories.",
        "cover_image": "/logos/Logistics-in-India.jpg",
        "meta_title": "Bill of Entry Filing Guide India 2026 | Step-by-Step | Carry Fast",
        "meta_description": "Complete operational guide to filing Bills of Entry on ICEGATE — process, common pitfalls and best practices for Indian importers.",
        "meta_keywords": "Bill of Entry filing India, ICEGATE BoE process, customs clearance procedure, HSN classification India",
    },
    {
        "title": "DGFT Policy Updates: What Changed in the Latest FTP Review",
        "excerpt": "A practical operational summary of the latest Foreign Trade Policy updates from DGFT — including changes that affect EPCG, advance authorisation, and RodTEP claims.",
        "tags": ["dgft", "ftp", "policy"],
        "content": "## DGFT moves continue to reshape import-export operations\n\nThe Foreign Trade Policy review introduces several practical changes that directly affect importers and exporters claiming benefits under DGFT schemes.\n\n### Key changes operations teams should track\n\n### 1. EPCG Scheme Adjustments\nUpdates to export obligation periods and capital-goods value caps now affect project cargo planning. Importers under EPCG must re-confirm obligation discharge timelines against the revised policy.\n\n### 2. Advance Authorisation Compliance\nMinor amendments to input-output norms (SION) for several product categories. Manufacturer-exporters should reverify SION applicability on next consignments.\n\n### 3. RodTEP Scheme Continuity\nThe Remission of Duties and Taxes on Exported Products scheme continues with revised rates for specific tariff lines — particularly relevant for engineering goods exporters.\n\n### 4. ITC(HSN) Code Reclassifications\nA handful of HSN codes have been reclassified between Free, Restricted, and Prohibited lists. Importers should re-verify status before placing fresh orders.\n\n### How to stay current\nDGFT issues Policy Circulars, Trade Notices, and Public Notices at a frequency that operations teams cannot reasonably track manually. Carry Fast monitors these centrally and advises clients of any change that affects their import or export programmes — before the consignment is booked.",
        "cover_image": "/logos/Logistics-in-India.jpg",
        "meta_title": "DGFT Foreign Trade Policy Updates 2026 | Carry Fast",
        "meta_description": "Operational summary of the latest DGFT Foreign Trade Policy updates affecting EPCG, advance authorisation, RodTEP and HSN classification.",
        "meta_keywords": "DGFT updates India, Foreign Trade Policy 2026, EPCG scheme, advance authorisation, RodTEP, ITC HSN classification",
    },
]


@app.on_event("startup")
async def on_startup():
    if not await is_db_available():
        logger.error("Starting API without MongoDB. Public defaults are available; DB-backed routes will fail until MongoDB is reachable.")
        return

    # Indexes
    try:
        await db.users.create_index("email", unique=True)
        await db.users.create_index("uid", unique=True)
        await db.blog_posts.create_index("slug", unique=True)
        await db.blog_posts.create_index("status")
        await db.leads.create_index("created_at")
    except Exception as e:
        logger.warning(f"Index creation issue: {e}")

    # Clear old (pre-Firebase) users — they used password_hash + JWT
    await db.users.delete_many({"password_hash": {"$exists": True}})

    # Seed first admin in Firebase + MongoDB (idempotent)
    admin_email = os.environ.get("ADMIN_SEED_EMAIL", "admin@carryfastcorp.com").lower()
    admin_password = os.environ.get("ADMIN_SEED_PASSWORD")
    admin_name = os.environ.get("ADMIN_SEED_NAME", "Admin")

    fb_user = None
    try:
        fb_user = await asyncio.wait_for(
            asyncio.to_thread(fb_auth.get_user_by_email, admin_email),
            timeout=5,
        )
    except fb_auth.UserNotFoundError:
        if not admin_password:
            logger.warning("ADMIN_SEED_PASSWORD is not set; skipping Firebase admin seed.")
            return
        try:
            fb_user = await asyncio.wait_for(
                asyncio.to_thread(
                    fb_auth.create_user,
                    email=admin_email,
                    password=admin_password,
                    display_name=admin_name,
                ),
                timeout=5,
            )
            logger.info(f"Seeded Firebase admin user: {admin_email} (uid={fb_user.uid})")
        except asyncio.TimeoutError:
            logger.warning("Firebase create_user timed out. Skipping admin seed.")
        except Exception as e:
            logger.error(f"Failed to create Firebase user: {e}")
    except asyncio.TimeoutError:
        logger.warning("Firebase Auth lookup timed out (startup). Skipping admin seed.")
    except Exception as e:
        # Most likely the Email/Password auth provider isn't enabled yet in Firebase Console.
        # Log and continue — the server stays up, we re-attempt on the next restart.
        logger.warning(
            "Firebase Auth lookup failed (likely Email/Password provider not enabled in Firebase console). "
            f"Skipping admin seed. Error: {e}"
        )

    if fb_user:
        existing = await db.users.find_one({"uid": fb_user.uid})
        if not existing:
            await db.users.insert_one({
                "uid": fb_user.uid,
                "email": admin_email,
                "name": admin_name,
                "role": "admin",
                "disabled": False,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "created_by": "system-seed",
            })
            logger.info(f"Created MongoDB user record for {admin_email}")

    # Seed site config if missing
    if not await db.site_config.find_one({"_id": "singleton"}):
        await db.site_config.insert_one({"_id": "singleton", **DEFAULT_SITE_CONFIG, "updated_at": datetime.now(timezone.utc).isoformat()})
        logger.info("Seeded default site config")

    # Seed / refresh blog posts
    has_cbic = await db.blog_posts.find_one({"tags": "cbic"})
    if not has_cbic:
        await db.blog_posts.delete_many({"tags": {"$in": ["freight", "last-mile", "supply-chain", "customs", "compliance", "guide", "ecommerce"]}})
        await db.blog_posts.delete_many({"title": {"$regex": "^TEST_"}})
    count = await db.blog_posts.count_documents({})
    if count == 0:
        now = datetime.now(timezone.utc).isoformat()
        for b in SEED_BLOGS:
            slug = slugify(b["title"])
            doc = {
                **b,
                "id": str(uuid.uuid4()),
                "slug": slug,
                "og_image": "",
                "custom_slug": "",
                "status": "published",
                "author": "Admin",
                "views": 0,
                "created_at": now,
                "updated_at": now,
                "published_at": now,
            }
            await db.blog_posts.insert_one(doc)
        logger.info(f"Seeded {len(SEED_BLOGS)} blog posts")


@app.on_event("shutdown")
async def on_shutdown():
    client.close()


if __name__ == "__main__":
    # Allow running the app directly for simple deployments or testing.
    # Respect environment vars when present; default to 0.0.0.0:8001
    import uvicorn

    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", "8001"))
    # Use CLI workers in production (gunicorn + uvicorn workers recommended).
    uvicorn.run("server:app", host=host, port=port, log_level="info")
