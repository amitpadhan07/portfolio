"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  User,
  FolderGit2,
  Cpu,
  GraduationCap,
  Award,
  Trophy,
  FileText,
  Share2,
  Mail,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  UserCheck,
} from "lucide-react";

interface SidebarLink {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links: SidebarLink[] = [
    { name: "Overview", href: "/admin/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "Profile", href: "/admin/dashboard/profile", icon: <User className="w-4 h-4" /> },
    { name: "Projects", href: "/admin/dashboard/projects", icon: <FolderGit2 className="w-4 h-4" /> },
    { name: "Skills", href: "/admin/dashboard/skills", icon: <Cpu className="w-4 h-4" /> },
    { name: "Education", href: "/admin/dashboard/education", icon: <GraduationCap className="w-4 h-4" /> },
    { name: "Certifications", href: "/admin/dashboard/certifications", icon: <Award className="w-4 h-4" /> },
    { name: "Achievements", href: "/admin/dashboard/achievements", icon: <Trophy className="w-4 h-4" /> },
    { name: "Resume", href: "/admin/dashboard/resume", icon: <FileText className="w-4 h-4" /> },
    { name: "Social Links", href: "/admin/dashboard/social-links", icon: <Share2 className="w-4 h-4" /> },
    { name: "Contact Info", href: "/admin/dashboard/contact", icon: <Mail className="w-4 h-4" /> },
    { name: "Blog Posts", href: "/admin/dashboard/blog", icon: <BookOpen className="w-4 h-4" /> },
    { name: "Messages", href: "/admin/dashboard/messages", icon: <Mail className="w-4 h-4" /> },
    { name: "Settings", href: "/admin/dashboard/settings", icon: <Settings className="w-4 h-4" /> },
  ];

  const handleLogout = async () => {
    if (confirm("Are you sure you want to sign out?")) {
      await signOut({ redirect: false });
      router.push("/admin/login");
      router.refresh();
    }
  };

  // Render a loading state during auth status lookup
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090D1A] text-[#F8FAFC] flex relative">
      {/* 1. Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-all"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 2. Sidebar Navigation Component */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-[#0B0F1E] border-r border-white/5 z-50 transform lg:translate-x-0 lg:static lg:flex lg:flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Branding */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-[#0A0D18]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-400 to-violet-500 flex items-center justify-center font-bold font-mono text-white text-xs">
              AP
            </div>
            <span className="text-sm font-bold tracking-wider uppercase font-mono bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-violet-400">
              CMS Panel
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-[#94A3B8] hover:text-[#F8FAFC] p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Scrollable Menu Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1 scrollbar-thin">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-sky-500/10 to-violet-500/5 border border-sky-500/20 text-[#38BDF8] font-medium"
                    : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/[0.02]"
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer User & Logout Control */}
        <div className="p-4 border-t border-white/5 bg-[#090D18]">
          {session?.user && (
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.01] border border-white/5 mb-3">
              <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 text-sm font-semibold">
                {session.user.name?.charAt(0) || "A"}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-semibold truncate text-[#F8FAFC]">
                  {session.user.name}
                </span>
                <span className="text-[10px] text-[#94A3B8] truncate flex items-center gap-1 font-mono">
                  <UserCheck className="w-2.5 h-2.5 text-emerald-400" /> Admin
                </span>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all font-medium cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 3. Main Page Body Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Main Header / Topbar Navigation */}
        <header className="h-16 border-b border-white/5 bg-[#0B0F1E] flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-[#94A3B8] hover:text-[#F8FAFC] p-1.5 rounded-xl border border-white/10 bg-[#0C1222]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex flex-col gap-0.5">
              <h2 className="text-sm font-semibold text-[#F8FAFC]">Portfolio Dashboard</h2>
              <span className="text-[10px] text-[#94A3B8] font-mono">
                Running in Next.js Serverless Environment
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              className="px-3.5 py-1.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/[0.01] hover:bg-white/[0.03] text-xs font-medium text-[#F8FAFC] transition-all"
            >
              View Live Website
            </a>
          </div>
        </header>

        {/* Dynamic Content Viewport */}
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
