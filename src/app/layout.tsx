import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/ui/CustomCursor";
import ScrollProgress from "@/components/ui/ScrollProgress";

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

export const metadata: Metadata = {
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://github.com/amitpadhan07",
    title: "Amit Padhan | AI Full Stack Developer & Software Engineer",
    description: "Explore the academic milestones, achievements, skills, and full-stack projects of Amit Padhan.",
    siteName: "Amit Padhan Portfolio",
    images: [
      {
        url: "/legacy/assets/images/Amit.jpg", // fallback to original avatar image in legacy folder if served
        width: 800,
        height: 800,
        alt: "Amit Padhan Profile",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Amit Padhan | AI Full Stack Developer",
    description: "Explore the projects and skills of Amit Padhan, AI Full Stack Developer & CSE Student.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth`}
    >
      <body className="bg-bg-dark text-text-primary min-h-screen flex flex-col antialiased">
        <ScrollProgress />
        <CustomCursor />
        <Navbar />
        {/* Main Content Area */}
        <main className="flex-grow z-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
