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
  // Primary Title
  title: {
    default: "Zikre Kitab | Book Reviews, Urdu Literature & Biographies",
    template: "%s | Zikre Kitab"
  },
  
  // SEO Description (English + Urdu integrated for Google)
  description: "Explore Zikrekitab: Your premier digital destination for insightful book reviews, exclusive literary interviews, and inspiring life stories. اردو کتابوں کے بہترین تبصرے اور ادبی شخصیات کے انٹرویوز کے لیے وزٹ کریں۔",
  
  // Comprehensive Keywords list
  keywords: [
    "Zikrekitab", "Book Reviews", "Urdu Literature", "Literary Interviews", 
    "Life Stories", "Biographies", "Reading Habits", "Urdu Book Reviews", 
    "اردو کتابی تبصرے", "Author Interviews", "Literary Blog Pakistan", 
    "Best Urdu Novels", "Literary Heritage", "Book Recommendations"
  ],
  
  authors: [{ name: "Tasnim Farouqi" }],

  // Favicon and Icons Fix
  icons: {
    icon: "/kitab.png",
    shortcut: "/kitab.png",
    apple: "/kitab.png",
  },

  // Social Media Sharing (Open Graph)
  openGraph: {
    title: "Zikre Kitab | Promoting Reading Culture & Urdu Literature",
    description: "Discover your next great read and dive into the biographies of influential thinkers today.",
    url: "https://zikrekitab.com",
    siteName: "Zikre Kitab",
    images: [
      {
        url: "/kitab.png",
        width: 1200,
        height: 630,
        alt: "Zikre Kitab - Literary Hub",
      },
    ],
    locale: "ur_PK",
    type: "website",
  },

  // Twitter/X Cards
  twitter: {
    card: "summary_large_image",
    title: "Zikre Kitab | Urdu Literary Destination",
    description: "Dedicated to promoting reading habits and preserving Urdu literature.",
    images: ["/kitab.png"],
  },

  // Search Engine Bot Instructions
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ur">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}