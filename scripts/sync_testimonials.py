#!/usr/bin/env python3
"""
Sync testimonials from frontend to backend MongoDB
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

# Testimonials from frontend/src/pages/Home.jsx
TESTIMONIALS = {
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
}

async def sync_testimonials():
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    try:
        # Update site config with testimonials
        result = await db.site_config.update_one(
            {"_id": "singleton"},
            {"$set": {"testimonials": TESTIMONIALS}},
            upsert=True
        )
        
        if result.matched_count > 0 or result.upserted_id:
            print("✅ Testimonials synced successfully!")
            print(f"   - Updated/inserted: 1 document")
            print(f"   - Total testimonials: {len(TESTIMONIALS['items'])}")
            return True
        else:
            print("❌ Failed to sync testimonials")
            return False
    except Exception as e:
        print(f"❌ Error syncing testimonials: {e}")
        return False
    finally:
        client.close()

if __name__ == "__main__":
    success = asyncio.run(sync_testimonials())
    sys.exit(0 if success else 1)
