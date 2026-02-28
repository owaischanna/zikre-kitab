import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Zikre Kitab | Authentic Islamic Knowledge & Library",
    template: "%s | Zikre Kitab"
  },
  description: "Zikre Kitab ek digital platform hai jahan aap Islamic kitabein, azkar, aur deeni malomat asani se parh sakte hain. Explore our collection of authentic Islamic literature.",
  keywords: ["Zikre Kitab", "Islamic Books", "Quran", "Hadith", "Islamic Library Pakistan", "Digital Azkar"],
  authors: [{ name: "Tasnim Farouqi" }],
  // Favicon aur Icons
  icons: {
    icon: "/kitab.png",
    apple: "/kitab.png",
  },
  openGraph: {
    title: "Zikre Kitab | Authentic Islamic Knowledge",
    description: "Read and explore authentic Islamic books and daily azkar online.",
    url: "https://zikrekitab.com",
    siteName: "Zikre Kitab",
    images: [
      {
        url: "/kitab.png", // WhatsApp/Facebook preview ke liye
        width: 800,
        height: 600,
        alt: "Zikre Kitab Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zikre Kitab",
    description: "Digital Library for Islamic Knowledge",
    images: ["/kitab.png"], // Twitter preview ke liye
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}