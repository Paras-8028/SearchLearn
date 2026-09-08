import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "@/components/layout/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SmartLearn — AI-Powered Learning Platform",
    template: "%s | SmartLearn",
  },
  description:
    "SmartLearn is an AI-powered intelligent learning platform that helps students search, understand, and learn from courses, lessons, documents, and educational content.",
  applicationName: "SmartLearn",
  keywords: [
    "SmartLearn",
    "AI learning",
    "Semantic search",
    "Course curriculum",
    "Vector search",
    "Interactive lessons",
  ],
  authors: [{ name: "SmartLearn Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://smartlearn.app",
    title: "SmartLearn — AI-Powered Learning Platform",
    description:
      "Find concepts instantly using natural language semantic search and study with an integrated AI tutor.",
    siteName: "SmartLearn",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className="min-h-screen bg-background text-foreground antialiased selection:bg-amber-500/30 selection:text-amber-200">
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}