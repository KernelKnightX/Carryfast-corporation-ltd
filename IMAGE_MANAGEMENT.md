# Image Management Guide

## Local Development (Works Fine)
- Backend serves `/uploads/` directly via FastAPI
- Uploaded images work immediately
- No additional setup needed

## Production (Currently Broken)
The uploaded images fail because the web server doesn't know where to serve `/uploads/` from.

### Solution: Configure Your Web Server

#### For Nginx:
```nginx
server {
    listen 80;
    server_name api.carryfastcorp.com;

    # Serve uploaded files
    location /uploads/ {
        alias /var/app/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Proxy API requests to FastAPI backend
    location /api/ {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
    }
}
```

#### For Apache:
```apache
<Directory /var/app/uploads>
    Options FollowSymLinks
    AllowOverride All
    Allow from all
</Directory>

Alias /uploads /var/app/uploads

ProxyPass /api http://localhost:8001/api
ProxyPassReverse /api http://localhost:8001/api
```

### Environment Configuration:
In production `.env`, set:
```env
UPLOAD_DIR=/var/app/uploads
PUBLIC_BASE_URL=https://api.carryfastcorp.com
```

The backend will then return URLs like:
- `https://api.carryfastcorp.com/uploads/abc123.jpg` ✅ (works)
- Instead of: `/uploads/abc123.jpg` ❌ (breaks in production)

## Best Practice:

**Git-committed images:**
- Default/fallback hero slides
- Company logos
- Static design assets
- Location: `/frontend/public/logos/`

**Admin-uploaded images:**
- Client testimonials (if adding photos)
- Blog post cover images
- Dynamic hero slides
- Location: Backend `/uploads/` (served via web server)

## Current Setup:

### Static Images (in Git):
- `/logos/Logistics-in-India.jpg` ✅ Always works
- `/logos/logistic1.jpg` ✅ Always works

### Dynamic Images (Upload via Admin):
- Should appear as `/uploads/xyz123.jpg` 
- **Requires web server configuration in production**
