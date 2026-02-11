import "./globals.css";
import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600", "700"]
});

const body = Poppins({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"]
});

export const metadata: Metadata = {
  title: "Meor & Yin Wedding Guestbook",
  description: "Leave your love, photos, and wishes in a modern QR guestbook."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} font-body`}>{children}</body>
    </html>
  );
}
