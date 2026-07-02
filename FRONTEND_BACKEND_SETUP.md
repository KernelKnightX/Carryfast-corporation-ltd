# Frontend Configuration for Render Backend

## Update Your Frontend `.env.local` (Development)

```env
REACT_APP_API_URL=http://localhost:8001/api
```

## Update Your Frontend `.env.production` (Vercel)

```env
REACT_APP_API_URL=https://cfc-api.onrender.com/api
```

## Update Your API Configuration

If you have `frontend/src/lib/api.js`, ensure it uses the environment variable:

```javascript
export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8001/api'
});
```

## Deployment Timeline

### Local Testing (Your Machine)
```bash
# Terminal 1: Backend
cd backend && python server.py
# Backend runs on http://localhost:8001

# Terminal 2: Frontend  
cd frontend && npm start
# Frontend runs on http://localhost:3000
```

✅ Uploads work locally → stored in `backend/uploads/`

---

### Production (Vercel + Render)
1. Deploy backend to Render first
2. Get your Render URL: `https://cfc-api.onrender.com`
3. Update frontend `.env.production` with that URL
4. Push to GitHub
5. Vercel auto-deploys frontend
6. Frontend calls Render API
7. Uploads stored in Render persistent disk

✅ Uploads work in production → stored in `/var/app/uploads/`

---

## Testing Upload Flow in Production

1. Go to `https://your-site.vercel.app/admin`
2. Login with admin credentials
3. Go to "Hero Slides" tab
4. Click "Upload image file"
5. Select an image
6. Should see: `https://cfc-api.onrender.com/uploads/abc123.jpg`
7. Image displays on hero section immediately

## Troubleshooting Production Issues

**Issue:** "Failed to upload - 401 Unauthorized"
- Solution: Make sure you're logged in and token is valid

**Issue:** "Image URL returned but not displaying"
- Solution: Check CORS_ORIGINS includes your Vercel domain

**Issue:** "Render backend keeps crashing"
- Solution: Check Render logs, likely missing env var or DB connection

**Issue:** "Upload works but image disappears after restart"
- Solution: Make sure persistent disk is configured on Render
