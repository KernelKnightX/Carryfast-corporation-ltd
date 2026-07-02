# Render Deployment Checklist

## Pre-Deployment ✅

- [ ] Push code to GitHub (if not already)
- [ ] Have MongoDB connection string ready
- [ ] Have Firebase credentials ready
- [ ] Know your Vercel frontend URL

## Render Setup Steps

### 1. Create Render Account
- Go to [render.com](https://dashboard.render.com)
- Sign up with GitHub

### 2. Create Web Service
- Dashboard → "New" → "Web Service"
- Connect repository
- Select branch (main/master)

### 3. Configure Environment Variables
Add these on the Render dashboard:

```
ENVIRONMENT=production
MONGO_URL=mongodb+srv://user:password@cluster.mongodb.net/cfc
DB_NAME=cfc
FIREBASE_SA_PATH={"type":"service_account",...}
FIREBASE_PROJECT_ID=cfcorp
FIREBASE_WEB_API_KEY=your-api-key
UPLOAD_DIR=/var/app/uploads
PUBLIC_BASE_URL=https://cfc-api.onrender.com
CORS_ORIGINS=https://your-site.vercel.app,https://www.carryfastcorp.com
ADMIN_SEED_EMAIL=admin@carryfastcorp.com
ADMIN_SEED_PASSWORD=strong-password-here
```

### 4. Persistent Disk
- Go to "Disks" tab in Render dashboard
- Create disk: name=`uploads`, size=`10GB`
- Mount path: `/var/app/uploads`

### 5. Deploy
- Render will auto-deploy after setup
- Check logs in dashboard

## Post-Deployment ✅

- [ ] Test API: `https://your-backend.onrender.com/api/site-config`
- [ ] Update frontend `.env` with backend URL
- [ ] Test admin login
- [ ] Test image upload (should persist)

## Your Deployment URLs

**Backend API:** `https://cfc-api.onrender.com` (replace with your actual URL)
**Database:** MongoDB Atlas (your existing connection)
**Uploads:** `/var/app/uploads` → served at `/uploads/` endpoint

## Cost Breakdown

- **Render Web Service:** Free tier (with limitations) or $7+/month
- **Persistent Disk:** $7/month for 10GB
- **MongoDB Atlas:** Free tier (512MB) or paid
- **Total:** ~$14/month for reliable setup

## Next Steps

1. Push this code to GitHub
2. Go to Render dashboard
3. Create new Web Service
4. Follow the steps above
5. Test uploads in production

Questions? Check Render docs: https://render.com/docs
