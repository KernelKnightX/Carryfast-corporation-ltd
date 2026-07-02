#!/usr/bin/env python3
"""
Render deployment guide for FastAPI backend
"""

# Key points for Render deployment:
# 1. Render's free tier has ephemeral storage (files don't persist)
# 2. Paid tier allows persistent disks for uploads
# 3. Or: Use Render + AWS S3 for better reliability

# OPTION 1: Using Render's Persistent Disk (Recommended for small uploads)
# - Costs: $7/month for 10GB persistent disk
# - Files uploaded via admin panel will be stored permanently
# - Good for: Hero images, blog covers, small media

# OPTION 2: Using AWS S3 (Production-grade)
# - Costs: ~$1/month for modest usage
# - Highly reliable, scalable
# - Good for: Any size uploads, better CDN integration

print("""
╔════════════════════════════════════════════════════════════╗
║           RENDER DEPLOYMENT GUIDE (FastAPI)                ║
╚════════════════════════════════════════════════════════════╝

STEP 1: Create render.yaml in project root
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

services:
  - type: web
    name: cfc-api
    runtime: python
    buildCommand: pip install -r backend/requirements.txt
    startCommand: cd backend && uvicorn server:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: ENVIRONMENT
        value: production
      - key: PYTHON_VERSION
        value: 3.11
    persistentDisk:
      name: uploads
      mountPath: /var/app/uploads
      sizeGB: 10


STEP 2: Set Environment Variables on Render Dashboard
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/cfc
DB_NAME=cfc
FIREBASE_SA_PATH={...your JSON...}
FIREBASE_PROJECT_ID=cfcorp
FIREBASE_WEB_API_KEY=your-api-key
UPLOAD_DIR=/var/app/uploads
PUBLIC_BASE_URL=https://your-backend.onrender.com
CORS_ORIGINS=https://your-frontend.vercel.app,https://www.carryfastcorp.com


STEP 3: Connect to GitHub & Deploy
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Go to dashboard.render.com
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Select repository and branch
5. Click "Create Web Service"
6. Add the environment variables (Step 2)
7. Render will auto-deploy on push


STEP 4: After Deployment
━━━━━━━━━━━━━━━━━━━━━━━━

Your backend URL will be: https://your-backend.onrender.com

Update your frontend to use:
REACT_APP_API_URL=https://your-backend.onrender.com/api

Upload flow will work:
✅ Admin uploads image
✅ Saved to /var/app/uploads (persistent disk)
✅ Returns: https://your-backend.onrender.com/uploads/abc123.jpg
✅ Frontend fetches & displays


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TROUBLESHOOTING:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Q: Uploads not persisting?
A: Free tier doesn't have persistent storage. Upgrade to paid tier
   with persistent disk, or use S3.

Q: Backend keeps restarting?
A: Check logs on Render dashboard. Usually due to missing env vars
   or database connection issues.

Q: CORS errors?
A: Add your Vercel frontend URL to CORS_ORIGINS in environment vars.

Q: "Module not found" errors?
A: Ensure requirements.txt is in backend/ folder and includes all deps.
""")
