"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

interface AnalyticsData {
  date: string;
  visitors: number;
  pageViews: number;
  resumeDownloads: number;
  formSubmissions: number;
}

interface AnalyticsChartProps {
  data: AnalyticsData[];
}

export default function AnalyticsChart({ data }: AnalyticsChartProps) {
  // Format dates for display (e.g. "Jun 08")
  const chartData = data.map((item) => {
    try {
      const dateObj = new Date(item.date);
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = dateObj.toLocaleString("default", { month: "short" });
      return {
        ...item,
        displayDate: `${month} ${day}`,
      };
    } catch {
      return {
        ...item,
        displayDate: item.date,
      };
    }
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Page Views & Visitors Area Chart */}
      <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-[#F8FAFC]">Traffic Analytics</h3>
          <p className="text-[10px] text-[#94A3B8] font-light">Daily page views vs. unique visitors</p>
        </div>
        <div className="h-64 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="displayDate" stroke="#475569" tickLine={false} />
              <YAxis stroke="#475569" tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0B0F1E",
                  borderColor: "rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "#F8FAFC",
                }}
              />
              <Legend wrapperStyle={{ paddingTop: "10px" }} />
              <Area
                type="monotone"
                dataKey="pageViews"
                name="Page Views"
                stroke="#38BDF8"
                fillOpacity={1}
                fill="url(#colorViews)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="visitors"
                name="Unique Visitors"
                stroke="#8B5CF6"
                fillOpacity={1}
                fill="url(#colorVisitors)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Form Submissions & Resume Downloads Bar Chart */}
      <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-[#F8FAFC]">Engagement Analytics</h3>
          <p className="text-[10px] text-[#94A3B8] font-light">Daily resume downloads and message submissions</p>
        </div>
        <div className="h-64 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="displayDate" stroke="#475569" tickLine={false} />
              <YAxis stroke="#475569" tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0B0F1E",
                  borderColor: "rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "#F8FAFC",
                }}
              />
              <Legend wrapperStyle={{ paddingTop: "10px" }} />
              <Bar dataKey="resumeDownloads" name="Resume Downloads" fill="#F43F5E" radius={[4, 4, 0, 0]} />
              <Bar dataKey="formSubmissions" name="Form Messages" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
