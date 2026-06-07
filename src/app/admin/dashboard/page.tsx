import React from "react";
import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import { Project } from "@/models/Project";
import { Skill } from "@/models/Skill";
import { Certification } from "@/models/Certification";
import { Message } from "@/models/Message";
import { Resume } from "@/models/Resume";
import { Analytics } from "@/models/Analytics";
import { ActivityLog } from "@/models/ActivityLog";
import AnalyticsChart from "@/components/admin/AnalyticsChart";
import {
  FolderGit2,
  Cpu,
  Award,
  Users,
  Download,
  Mail,
  Plus,
  BookOpen,
  User,
  Settings,
  ArrowRight,
  Clock,
  Terminal,
} from "lucide-react";

export const revalidate = 0; // Disable server caching to load fresh stats

export default async function AdminDashboardOverview() {
  await connectToDatabase();

  // 1. Fetch Overview Statistics
  const totalProjects = await Project.countDocuments();
  const totalSkills = await Skill.countDocuments();
  const totalCerts = await Certification.countDocuments();
  const unreadMessages = await Message.countDocuments({ read: false });

  // Get total resume downloads
  const resume = await Resume.findOne();
  const totalDownloads = resume?.downloadCount || 0;

  // 2. Fetch last 7 days of analytics
  const rawAnalytics = await Analytics.find()
    .sort({ date: 1 })
    .limit(7)
    .lean();

  // Convert mongoose document dates to plain serializable array
  const analyticsData = rawAnalytics.map((item: any) => ({
    date: item.date,
    visitors: item.visitors || 0,
    pageViews: item.pageViews || 0,
    resumeDownloads: item.resumeDownloads || 0,
    formSubmissions: item.formSubmissions || 0,
  }));

  // Calculate aggregate pageviews & visitors
  const totalVisitors = analyticsData.reduce((sum, item) => sum + item.visitors, 0);

  // 3. Fetch Recent Activity Logs
  const rawLogs = await ActivityLog.find()
    .sort({ timestamp: -1 })
    .limit(5)
    .lean();

  const activityLogs = rawLogs.map((log: any) => ({
    id: log._id.toString(),
    action: log.action,
    adminUser: log.adminUser,
    timestamp: log.timestamp.toISOString(),
    ipAddress: log.ipAddress || "127.0.0.1",
  }));

  const statCards = [
    { name: "Total Projects", value: totalProjects, icon: <FolderGit2 className="w-5 h-5" />, color: "text-sky-400" },
    { name: "Total Skills", value: totalSkills, icon: <Cpu className="w-5 h-5" />, color: "text-violet-400" },
    { name: "Certifications", value: totalCerts, icon: <Award className="w-5 h-5" />, color: "text-emerald-400" },
    { name: "Portfolio Visitors", value: totalVisitors, icon: <Users className="w-5 h-5" />, color: "text-amber-400" },
    { name: "Resume Downloads", value: totalDownloads, icon: <Download className="w-5 h-5" />, color: "text-rose-400" },
    { name: "Contact Messages", value: unreadMessages, icon: <Mail className="w-5 h-5" />, color: "text-blue-400", badge: unreadMessages > 0 ? `${unreadMessages} new` : null },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Overview Dashboard</h1>
          <p className="text-xs text-[#94A3B8] mt-1 font-light">
            Real-time analytics and quick controls for your portfolio.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/dashboard/projects"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-violet-500 hover:from-sky-500 hover:to-violet-600 text-white font-semibold text-xs transition-all shadow-lg shadow-sky-500/10 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Project
          </Link>
          <Link
            href="/admin/dashboard/blog"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-[#F8FAFC] font-semibold text-xs transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#94A3B8]" /> Write Article
          </Link>
        </div>
      </div>

      {/* Overview Statistics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex flex-col justify-between relative overflow-hidden"
          >
            <div className="flex items-center justify-between gap-2 text-[#94A3B8] mb-3">
              <span className="text-[10px] font-mono uppercase tracking-wider">{card.name}</span>
              <div className={card.color}>{card.icon}</div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tracking-tight">{card.value}</span>
              {card.badge && (
                <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[8px] font-semibold uppercase font-mono">
                  {card.badge}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Charts Component */}
      <AnalyticsChart data={analyticsData} />

      {/* Activity Log Feed & Quick Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Center: Recent Activity Log Feed */}
        <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-[#F8FAFC]">System Activity Feed</h3>
              <p className="text-[10px] text-[#94A3B8] font-light">Recent administrator panel actions</p>
            </div>
            <Clock className="w-4 h-4 text-[#94A3B8]" />
          </div>

          <div className="space-y-4">
            {activityLogs.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#64748B] font-light">
                No system activity recorded yet.
              </div>
            ) : (
              activityLogs.map((log) => {
                const date = new Date(log.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                });
                const day = new Date(log.timestamp).toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                });
                return (
                  <div key={log.id} className="flex gap-4 items-start pb-4 border-b border-white/5 last:border-b-0 last:pb-0">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#94A3B8] flex-shrink-0 mt-0.5">
                      <Terminal className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#F8FAFC] leading-relaxed font-light">
                        {log.action}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[9px] text-[#64748B] font-mono">
                        <span className="text-[#94A3B8]">{log.adminUser}</span>
                        <span>•</span>
                        <span>IP: {log.ipAddress}</span>
                      </div>
                    </div>
                    <div className="text-right text-[9px] font-mono text-[#64748B] flex-shrink-0">
                      <div>{day}</div>
                      <div>{date}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
          <h3 className="text-sm font-semibold text-[#F8FAFC] mb-5">Quick Admin Actions</h3>
          <div className="flex flex-col gap-2.5">
            <Link
              href="/admin/dashboard/profile"
              className="flex items-center justify-between p-3 rounded-xl border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.03] text-xs text-[#94A3B8] hover:text-[#F8FAFC] transition-all group"
            >
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-sky-400" />
                <span className="font-medium">Edit Bio Info & Stats</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/admin/dashboard/messages"
              className="flex items-center justify-between p-3 rounded-xl border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.03] text-xs text-[#94A3B8] hover:text-[#F8FAFC] transition-all group"
            >
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-400" />
                <span className="font-medium">Inquire Messages Inbox</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/admin/dashboard/resume"
              className="flex items-center justify-between p-3 rounded-xl border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.03] text-xs text-[#94A3B8] hover:text-[#F8FAFC] transition-all group"
            >
              <div className="flex items-center gap-3">
                <Download className="w-4 h-4 text-rose-400" />
                <span className="font-medium">Manage Resume PDF</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/admin/dashboard/settings"
              className="flex items-center justify-between p-3 rounded-xl border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.03] text-xs text-[#94A3B8] hover:text-[#F8FAFC] transition-all group"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-emerald-400" />
                <span className="font-medium">Global Site SEO Configs</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
