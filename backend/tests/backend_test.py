"""Backend API tests for Carry Fast Forwarders Corporation."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "http://localhost:8001").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@carryfast.com"
ADMIN_PASSWORD = "Admin@123"


@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def admin_token(session):
    r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    data = r.json()
    assert "token" in data and data["user"]["role"] == "admin"
    return data["token"]


@pytest.fixture(scope="session")
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}


# ---------- Health & Auth ----------
class TestHealthAuth:
    def test_root(self, session):
        r = session.get(f"{API}/")
        assert r.status_code == 200
        assert r.json().get("ok") is True

    def test_login_bad_password(self, session):
        r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"})
        assert r.status_code == 401

    def test_me_no_token(self, session):
        r = session.get(f"{API}/auth/me")
        assert r.status_code == 401

    def test_me_with_token(self, session, auth_headers):
        r = session.get(f"{API}/auth/me", headers=auth_headers)
        assert r.status_code == 200
        body = r.json()
        assert body["email"] == ADMIN_EMAIL
        assert body["role"] == "admin"

    def test_admin_endpoints_require_auth(self, session):
        for path in ["/admin/blog", "/admin/leads", "/admin/quotes", "/admin/analytics"]:
            r = session.get(f"{API}{path}")
            assert r.status_code == 401, f"{path} not protected"


# ---------- Public Blog ----------
class TestPublicBlog:
    def test_list_blog_seeded(self, session):
        r = session.get(f"{API}/blog")
        assert r.status_code == 200
        posts = r.json()
        assert isinstance(posts, list)
        assert len(posts) >= 3, f"Expected >=3 seeded posts, got {len(posts)}"
        for p in posts:
            assert "slug" in p
            assert "title" in p

    def test_india_customs_seed_content(self, session):
        """New India-customs blog seed must be present and old generic posts gone."""
        posts = session.get(f"{API}/blog").json()
        titles = [p["title"] for p in posts]
        expected = [
            "AEO Certification: What Indian Importers Should Know in 2026",
            "Bill of Entry Filing: A Step-by-Step Operational Guide",
            "DGFT Policy Updates: What Changed in the Latest FTP Review",
        ]
        for t in expected:
            assert t in titles, f"Missing seed post: {t}; got {titles}"
        forbidden = [
            "5 Trends Reshaping Global Freight",
            "Why Last-Mile Delivery Will Define Your Brand",
        ]
        for t in forbidden:
            assert t not in titles, f"Old generic post still present: {t}"

    def test_contact_form_packed_lead(self, session, auth_headers):
        """ContactForm packs designation + enquiry_type into message field of POST /api/leads."""
        packed_message = (
            "Designation: Logistics Head\n"
            "Enquiry Type: Import\n\n"
            "TEST contact form packed message body."
        )
        payload = {
            "name": "TEST_Contact Packed",
            "email": "test_contact_packed@example.com",
            "phone": "+919000000000",
            "company": "TEST CFC Co",
            "message": packed_message,
            "source": "contact",
        }
        r = session.post(f"{API}/leads", json=payload)
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["ok"] is True
        lid = body["id"]
        # admin retrieval
        all_leads = session.get(f"{API}/admin/leads", headers=auth_headers).json()
        found = next((l for l in all_leads if l["id"] == lid), None)
        assert found is not None
        assert "Designation: Logistics Head" in found["message"]
        assert "Enquiry Type: Import" in found["message"]
        # cleanup
        session.delete(f"{API}/admin/leads/{lid}", headers=auth_headers)

    def test_get_blog_detail_and_view_increment(self, session):
        listing = session.get(f"{API}/blog").json()
        slug = listing[0]["slug"]
        r1 = session.get(f"{API}/blog/{slug}")
        assert r1.status_code == 200
        post1 = r1.json()
        views1 = post1.get("views", 0)
        assert "content" in post1 and post1["content"]
        r2 = session.get(f"{API}/blog/{slug}")
        views2 = r2.json().get("views", 0)
        assert views2 == views1 + 1, f"views did not increment: {views1} -> {views2}"

    def test_get_blog_404(self, session):
        r = session.get(f"{API}/blog/nonexistent-slug-xyz")
        assert r.status_code == 404


# ---------- Public Leads/Quotes ----------
class TestPublicForms:
    def test_create_lead_persists(self, session, auth_headers):
        payload = {
            "name": "TEST_Lead User",
            "email": "test_lead@example.com",
            "phone": "+1234567890",
            "company": "TEST Co",
            "message": "TEST lead message",
            "source": "contact",
        }
        r = session.post(f"{API}/leads", json=payload)
        assert r.status_code == 200
        body = r.json()
        assert body["ok"] is True and "id" in body
        lead_id = body["id"]
        # Verify via admin GET
        rl = session.get(f"{API}/admin/leads", headers=auth_headers)
        assert rl.status_code == 200
        ids = [l["id"] for l in rl.json()]
        assert lead_id in ids

    def test_create_quote_persists(self, session, auth_headers):
        payload = {
            "name": "TEST_Quote User",
            "email": "test_quote@example.com",
            "phone": "+1234567890",
            "company": "TEST Co",
            "service_type": "freight",
            "origin": "Shanghai",
            "destination": "Los Angeles",
            "cargo_details": "20ft container",
            "message": "TEST quote",
        }
        r = session.post(f"{API}/quotes", json=payload)
        assert r.status_code == 200
        body = r.json()
        assert body["ok"] is True
        quote_id = body["id"]
        rq = session.get(f"{API}/admin/quotes", headers=auth_headers)
        assert rq.status_code == 200
        ids = [q["id"] for q in rq.json()]
        assert quote_id in ids

    def test_create_lead_invalid_email(self, session):
        r = session.post(f"{API}/leads", json={"name": "x", "email": "not-an-email", "message": "m"})
        assert r.status_code in (400, 422)


# ---------- Admin Blog CMS ----------
class TestAdminBlog:
    def test_blog_crud_lifecycle(self, session, auth_headers):
        # Create
        payload = {
            "title": "TEST_Blog Post Title",
            "excerpt": "TEST excerpt",
            "content": "## TEST content body",
            "tags": ["test"],
            "meta_title": "TEST meta title",
            "meta_description": "TEST meta desc",
            "meta_keywords": "test",
            "status": "draft",
        }
        r = session.post(f"{API}/admin/blog", headers=auth_headers, json=payload)
        assert r.status_code == 200, r.text
        created = r.json()
        post_id = created["id"]
        assert created["status"] == "draft"
        assert "blog-post-title" in created["slug"]

        # Draft should NOT appear in public listing
        public = session.get(f"{API}/blog").json()
        assert created["slug"] not in [p["slug"] for p in public]

        # Get by id (admin)
        rg = session.get(f"{API}/admin/blog/{post_id}", headers=auth_headers)
        assert rg.status_code == 200
        assert rg.json()["title"] == payload["title"]

        # Update to published
        upd = {**payload, "title": "TEST_Blog Post Updated", "status": "published"}
        ru = session.put(f"{API}/admin/blog/{post_id}", headers=auth_headers, json=upd)
        assert ru.status_code == 200

        # Verify update & public visibility
        rg2 = session.get(f"{API}/admin/blog/{post_id}", headers=auth_headers).json()
        assert rg2["title"] == "TEST_Blog Post Updated"
        assert rg2["status"] == "published"
        assert rg2.get("published_at")
        public2 = session.get(f"{API}/blog").json()
        assert rg2["slug"] in [p["slug"] for p in public2]

        # Delete
        rd = session.delete(f"{API}/admin/blog/{post_id}", headers=auth_headers)
        assert rd.status_code == 200
        rg3 = session.get(f"{API}/admin/blog/{post_id}", headers=auth_headers)
        assert rg3.status_code == 404


# ---------- Admin Leads/Quotes management ----------
class TestAdminLeadsQuotes:
    def test_update_and_delete_lead(self, session, auth_headers):
        # create a lead
        create = session.post(f"{API}/leads", json={
            "name": "TEST_Mgmt", "email": "tm@example.com", "message": "msg"
        }).json()
        lid = create["id"]
        # update status
        ru = session.put(f"{API}/admin/leads/{lid}", headers=auth_headers, json={"status": "contacted", "notes": "called"})
        assert ru.status_code == 200
        all_leads = session.get(f"{API}/admin/leads", headers=auth_headers).json()
        found = next((l for l in all_leads if l["id"] == lid), None)
        assert found and found["status"] == "contacted" and found["notes"] == "called"
        # delete
        rd = session.delete(f"{API}/admin/leads/{lid}", headers=auth_headers)
        assert rd.status_code == 200
        all_leads2 = session.get(f"{API}/admin/leads", headers=auth_headers).json()
        assert lid not in [l["id"] for l in all_leads2]

    def test_update_and_delete_quote(self, session, auth_headers):
        create = session.post(f"{API}/quotes", json={
            "name": "TEST_Mgmt Q", "email": "tmq@example.com", "service_type": "freight"
        }).json()
        qid = create["id"]
        ru = session.put(f"{API}/admin/quotes/{qid}", headers=auth_headers, json={"status": "quoted"})
        assert ru.status_code == 200
        all_q = session.get(f"{API}/admin/quotes", headers=auth_headers).json()
        found = next((q for q in all_q if q["id"] == qid), None)
        assert found and found["status"] == "quoted"
        rd = session.delete(f"{API}/admin/quotes/{qid}", headers=auth_headers)
        assert rd.status_code == 200


# ---------- Admin Analytics ----------
class TestAdminAnalytics:
    def test_analytics_shape(self, session, auth_headers):
        r = session.get(f"{API}/admin/analytics", headers=auth_headers)
        assert r.status_code == 200
        data = r.json()
        assert "kpis" in data and "timeline" in data
        kpis = data["kpis"]
        for k in ["leads_total", "leads_new", "quotes_total", "quotes_new",
                  "posts_total", "posts_published", "blog_views"]:
            assert k in kpis
        assert isinstance(data["timeline"], list) and len(data["timeline"]) == 14
        assert "recent_leads" in data and "recent_quotes" in data
