# Carry Fast Forwarders Corporation — PRD

## Original Problem Statement
Corporate logistics & supply-chain marketing website for "Carry Fast Forwarders Corporation" — premium, trustworthy, fast-moving freight & logistics provider. Solutions: freight, warehousing, customs, last-mile. 7 public pages (Home with hero slider, About, Services, Expertise, Clients, Blog, Contact) + admin backend with CMS dashboard, analytics, lead capture, get-a-quote form, floating WhatsApp button. Rich SEO with metadata, sitemap, robots.txt + Google Analytics & Meta Pixel placeholders.

## User Choices (from clarification round)
- Brand palette: deep navy + accent orange + white (premium logistics)
- Logo: no logo yet — bordered "CFF" placeholder box until uploaded
- Admin auth: JWT-based default admin (Firebase deferred for later)
- WhatsApp number: placeholder `12345677890`
- GA / Meta Pixel: placeholder IDs in index.html
- Leads/quotes: stored in MongoDB only (email notifications via Resend/SendGrid deferred — no key shared yet)

## Architecture
- Frontend: React 19, react-router 7, Tailwind, Cabinet Grotesk + IBM Plex Sans, recharts, sonner, lucide
- Backend: FastAPI + Motor + bcrypt + PyJWT
- DB: MongoDB (collections: users, blog_posts, leads, quotes)
- Auth: JWT Bearer (12h), admin role, seeded on startup
- All API routes prefixed `/api`; admin routes under `/api/admin/*` require Bearer token

## What's Been Implemented (Feb 2026 — MVP)
- 7 public marketing pages with cinematic hero slider, stats bar, service grid, why-us section, inline quote form, client marquee, recent insights teaser, sticky navbar, premium footer
- Admin CMS: dashboard with KPIs + 14-day activity line chart, blog manager (list/create/edit/delete + draft/publish), lead pipeline, quote pipeline (status changes + deletion)
- SEO: per-page `<SEO>` component (title/description/keywords/og:image/canonical), robots.txt, sitemap.xml, GA + Meta Pixel snippet placeholders in index.html
- Floating WhatsApp button on all public pages
- 3 seeded SEO blog posts on first startup
- 15/15 backend tests passing, all critical frontend flows verified

## Personas
- **Enterprise procurement / supply chain leader** — wants trust signals, case studies, fast quote turnaround
- **SMB importer** — wants quick quote form + WhatsApp access
- **Internal admin/marketing team** — publishes SEO blogs, manages leads & quote pipeline, reviews analytics

## Backlog (Next phases)
### P0 — should follow soon
- Wire real GA4 + Meta Pixel IDs (already placeholder-ready in index.html)
- Email notifications on new lead/quote (Resend or SendGrid — needs API key from user)
- Upload company logo (replace CFF placeholder box)

### P1
- Migrate auth to Firebase (per user's later preference)
- Rich-text WYSIWYG editor for blog (currently Markdown textarea)
- Blog categories + tag filtering on /blog
- Image upload for blog covers (object storage)
- Client logo upload section managed from admin
- Contact page Google Map embed

### P2
- Multilingual support (EN / AR / HI)
- Track-and-trace shipment widget on home
- Case study detail pages (currently summary list on /clients)
- Live chat handoff from WhatsApp button
- Brute-force lockout on admin login

## Next Action Items
- Share logo asset + WhatsApp number + GA4/Pixel IDs to plug in
- Choose email provider (Resend recommended) and share API key
- Decide on Firebase migration timing
