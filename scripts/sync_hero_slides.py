#!/usr/bin/env python3
"""
Sync hero slides from backend default to MongoDB
"""
import sys
import asyncio
from pathlib import Path
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

# Load env from backend
backend_dir = Path(__file__).parent.parent / "backend"
load_dotenv(backend_dir / ".env")

mongo_url = os.environ.get('MONGO_URL')
db_name = os.environ.get('DB_NAME')

if not mongo_url or not db_name:
    print("❌ MONGO_URL or DB_NAME not set in backend/.env")
    sys.exit(1)

# Hero slides from backend/server.py DEFAULT_SITE_CONFIG
HERO_SLIDES = [
    {"image": "/logos/Logistics-in-India.jpg", "overline": "Customs Clearance · Since 1995", "title_lines": ["Customs Clearance.", "Backed by 30 Years"], "title_span": "of Operations.", "subtitle": "India's import and export procedures are detailed, time-sensitive, and constantly evolving. Carry Fast Corporation has managed this process for Indian businesses since 1995."},
    {"image": "/logos/logistic1.jpg", "overline": "AEO Certified · Indian Customs", "title_lines": ["The Only AEO-Certified", "Customs Intermediary"], "title_span": "in Madhya Pradesh.", "subtitle": "AEO certification by Indian Customs — audited for compliance, financial soundness and operational reliability. Our clients work with a partner whose standards are independently verified."},
    {"image": "/logos/logistic3.jpg", "overline": "12,000+ Shipments · 99.5% On-Time", "title_lines": ["Cargo clears.", "Operations"], "title_span": "never wait.", "subtitle": "Bill of Entry filed the same day. Examination handled at the port by our team. Documentation pre-validated before submission. A 99.5% on-time rate maintained year after year."},
    {"image": "/logos/logistic4.jpg", "overline": "CONCOR Best Customs Broker · Since 1997", "title_lines": ["Recognised by CONCOR", "every year"], "title_span": "since 1997.", "subtitle": "An unbroken record of recognition across nearly three decades — awarded annually by Container Corporation of India for consistent operational performance."},
]

async def sync_hero_slides():
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    try:
        # Update site config with hero slides
        result = await db.site_config.update_one(
            {"_id": "singleton"},
            {"$set": {"hero_slides": HERO_SLIDES}},
            upsert=True
        )
        
        if result.matched_count > 0 or result.upserted_id:
            print("✅ Hero slides synced successfully!")
            print(f"   - Updated/inserted: 1 document")
            print(f"   - Total hero slides: {len(HERO_SLIDES)}")
            return True
        else:
            print("❌ Failed to sync hero slides")
            return False
    except Exception as e:
        print(f"❌ Error syncing hero slides: {e}")
        return False
    finally:
        client.close()

if __name__ == "__main__":
    success = asyncio.run(sync_hero_slides())
    sys.exit(0 if success else 1)
