# 📸 Live Wedding Gallery & Digital Guestbook

A modern, interactive, and high-performance web application designed for wedding events. Guests can upload photos and leave heart-warming messages in real-time, creating a live digital memory wall.

## ✨ Key Features

- **Live Polaroid Feed**: Real-time updates using Supabase subscriptions—new photos appear instantly without refreshing.
- **Smart Image Compression**: Client-side compression using `browser-image-compression` ensures fast uploads and saves server storage.
- **Interactive "Like" System**: Guests can "heart" their favorite memories (limited to 1 per device).
- **Secret Admin Mode**: A hidden moderation panel (triggered by a secret tap sequence) to delete inappropriate content.
- **Batch Download**: Admin can download all images and a text file of all guest greetings in a single ZIP file.
- **Atmospheric BGM**: Lightweight background music player with auto-looping.
- **Premium UX**: Includes skeleton loaders (shimmer effect), confetti celebrations, and a professional Polaroid-style lightbox.
- **Optimized for Mobile**: Fully responsive design with a "Mobile-First" approach for wedding guests.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database & Realtime**: [Supabase](https://supabase.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Utilities**: JSZip, FileSaver, Canvas-Confetti, Browser-Image-Compression.

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/repository-name.git](https://github.com/your-username/repository-name.git)
Install dependencies:

Bash
npm install
Set up Environment Variables: Create a .env.local file and add your Supabase credentials:

Code snippet
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
Run the development server:

Bash
npm run dev
🛡️ Admin Access
Access the hidden admin panel by tapping the event logo 5 times.

Enter the pre-defined PIN to enable moderation tools and batch downloads.

📜 License
Personal use only for wedding events.


---