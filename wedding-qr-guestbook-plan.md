# Wedding QR Guestbook Platform — Complete Project Plan (Baby Blue Modern Theme)

> **Goal:** Build a QR-based guestbook platform for a wedding where guests can upload photos/videos and write wishes. Everything is stored centrally and accessible to the couple after the event. The UI/UX must be **premium, modern, and wedding-themed** (baby blue palette), **never looking cheap**.

---

## 1) Product Summary

**Core Idea:**
A web-based guestbook platform where guests scan a QR code, upload photos/videos + write messages. After the event, the couple accesses a beautiful, organized memory gallery.

**Extra Level-Up Features (must include):**
- Personalized landing page with wedding theme + couple intro.
- Smart prompts for guests (e.g., “Best memory with the couple?”).
- Automatic video montage creation option.
- Domain + custom QR design for a premium look.

---

## 2) UX/UI Vision (Baby Blue + Modern Elegant)

### 2.1 Visual Style
- **Primary Color:** Baby Blue (#AFCBFF / #B3D4FC range)
- **Accent:** Soft white (#FFFFFF), Warm ivory (#FFF8F2), muted silver (#D9E2EC)
- **Typography:**
  - Headings: *Playfair Display* (or equivalent elegant serif)
  - Body: *Inter* or *Poppins* (clean sans)
- **Style Keywords:** Soft, elegant, premium, airy, minimal, modern.
- **Avoid:** Harsh gradients, cartoon fonts, clutter.

### 2.2 Layout Principles
- Plenty of spacing (luxury feel).
- Use card-based sections with subtle shadow (very light).
- Use rounded corners (12–16px).
- Smooth scroll + micro animations (fade in, slow scale).

### 2.3 UI Pages
**A) Guest Landing (via QR):**
- Hero section: “Leave your love for Meor & Yin 💙”
- CTA: Upload + Message (single button)
- Optional: short intro of the couple (max 3 lines)

**B) Upload Page:**
- File upload with drag & drop.
- Preview + progress bar.
- Message input box (max 300–500 chars).
- Optional tags: “memory”, “advice”, “funny”, “blessing”.

**C) Gallery for Couple (Admin View):**
- Timeline grid (photos + video thumbnails).
- Search by guest name.
- Filter by tags.
- Download all as ZIP.

---

## 3) Core Features

### Guest Flow
1. Scan QR → landing page
2. Fill: Name (optional; allow “Anonymous”) + short message + upload media
3. Submit → confirmation (“Terima kasih! 💙”)

### Admin Flow (Couple)
1. Login
2. View gallery (photos/videos/messages)
3. Filter + export
4. Generate montage (optional)
5. Optional: create read-only access for photographer/viewer role

---

## 4) Tech Stack (Recommended)

### Frontend
- **Framework:** Next.js (fast, modern, SEO)
- **Styling:** TailwindCSS + custom theme
- **Animations:** Framer Motion

### Backend
- **Supabase**
  - Auth for admin login
  - Storage for photos/videos
  - PostgreSQL table for messages/metadata

### QR Code
- Generate custom QR with logo + baby blue styling
- Design guideline: white border, small center logo, high-res 600x600 for clean print

---

## 5) Database Schema (Supabase)

### Table: `guest_entries`
| Field | Type | Notes |
|------|------|------|
| id | uuid | primary key |
| guest_name | text | required |
| message | text | required |
| tags | text[] | optional |
| media_url | text | required |
| media_type | text | image/video |
| created_at | timestamp | default now() |

### Storage Bucket
- Bucket: `wedding_memories`
- Folder structure: `/YYYY/MM/DD/guest-name-media`

---

## 6) Implementation Steps (Detailed)

### Step 1: Supabase Setup
1. Create project (name: `meor-yin-wedding`)
2. Create `guest_entries` table
3. Create storage bucket `wedding_memories`
4. Generate service keys and set in `.env`

### Step 2: Frontend Setup
1. `npx create-next-app@latest wedding-guestbook`
2. Install dependencies:
   - `tailwindcss`
   - `framer-motion`
   - `@supabase/supabase-js`
3. Setup Tailwind theme with baby blue palette

### Step 3: Guest Upload Flow
1. Build form (name, message, tag, upload)
2. On submit:
   - Upload media to Supabase storage
   - Insert record into `guest_entries`
3. Show success state (animation + thanks message)

### Step 4: Admin Dashboard
1. Auth protected route `/admin`
2. List & filter entries
3. Download all media (ZIP function)

### Step 5: Montage Feature (Optional)
- Use ffmpeg server script or external service
- Combine videos + images into 1 video

---

## 7) UI/UX Details (Premium Look)

- Use **soft shadows**: `shadow-[0_4px_20px_rgba(0,0,0,0.08)]`
- Use **glass-like cards** for elegance.
- Buttons: rounded full + subtle hover glow.
- Loading screen: subtle animated hearts in baby blue.

---

## 8) Deployment

- **Frontend:** Vercel
- **Backend:** Supabase
- Domain: `meorandyin.com` (example)
- QR Code printed on table cards

---

## 9) Security & Reliability

- Limit file size (e.g., max 50MB each)
- Auto compress images for speed
- Rate limit guest submissions
- Validate file types (image/video only)

---

## 10) Final Checklist

✅ Landing page built
✅ Upload flow complete
✅ Supabase integration working
✅ Admin dashboard ready
✅ QR code ready
✅ Theme aesthetic premium

---

## 11) Future Add-Ons

- Guestbook live wall (during majlis)
- AI message summarizer
- Slideshow display for reception

---

**Done.**
This plan is structured so an AI or developer can follow it step-by-step with minimal errors.
