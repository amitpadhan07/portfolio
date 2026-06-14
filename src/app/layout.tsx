import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/ui/CustomCursor";
import ScrollProgress from "@/components/ui/ScrollProgress";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { connectToDatabase } from "@/lib/db";
import { Settings } from "@/models/Settings";
import { SocialLink } from "@/models/SocialLink";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const defaultBaseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  
  try {
    await connectToDatabase();
    const settings = await Settings.findOne().lean();
    if (settings) {
      return {
        metadataBase: new URL(defaultBaseUrl),
        title: settings.siteTitle,
        description: settings.metaDescription,
        keywords: settings.keywords || [],
        authors: [{ name: "Amit Padhan" }],
        creator: "Amit Padhan",
        openGraph: {
          type: "website",
          locale: "en_US",
          url: "https://github.com/amitpadhan07",
          title: settings.siteTitle,
          description: settings.metaDescription,
          siteName: "Amit Padhan Portfolio",
          images: [
            {
              url: "/legacy/assets/images/Amit.jpg",
              width: 800,
              height: 800,
              alt: "Amit Padhan Profile",
            },
          ],
        },
        twitter: {
          card: "summary_large_image",
          title: settings.siteTitle,
          description: settings.metaDescription,
        },
      };
    }
  } catch (err) {
    console.error("Error generating dynamic metadata:", err);
  }

  // Fallback metadata if DB settings are empty or failed to load
  return {
    metadataBase: new URL(defaultBaseUrl),
    title: "Amit Padhan | AI Full Stack Developer & Software Engineer",
    description: "Portfolio of Amit Padhan, an AI Full Stack Developer & Software Engineer sophomore. Specializing in React, Next.js, Node.js, databases, and AI/Machine Learning integrations.",
    keywords: [
      "Amit Padhan",
      "AI Full Stack Developer",
      "Software Engineer Portfolio",
      "Graphic Era Hill University",
      "React Developer",
      "Next.js Developer",
      "Machine Learning Enthusiast",
    ],
    authors: [{ name: "Amit Padhan" }],
    creator: "Amit Padhan",
  };
}

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let socialLinks: any[] = [];
  try {
    await connectToDatabase();
    const docs = await SocialLink.find({ active: true }).sort({ order: 1 }).lean();
    socialLinks = docs.map((d: any) => ({
      platform: d.platform,
      url: d.url,
      icon: d.icon,
    }));
  } catch (err) {
    console.error("Failed to load active social links for footer:", err);
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth`}
    >
      <body className="bg-bg-dark text-text-primary min-h-screen flex flex-col antialiased">
        <ScrollProgress />
        <CustomCursor />
        <AnalyticsTracker />
        <Navbar />
        {/* Main Content Area */}
        <main className="flex-grow">
          {children}
        </main>
        <Footer socialLinks={socialLinks} />
      </body>
    </html>
  );
}
