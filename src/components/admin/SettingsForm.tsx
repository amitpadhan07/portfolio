"use client";

import React, { useState } from "react";
import { updateSettings, changeAdminPassword } from "@/actions/settings";
import { Save, Lock, Loader2, Globe, KeyRound, AlertTriangle } from "lucide-react";

interface SettingsFormProps {
  initialSettings: {
    siteTitle: string;
    metaDescription: string;
    keywords: string[];
    favicon: string;
    analyticsId: string;
    maintenanceMode: boolean;
  } | null;
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  // Settings Form Fields
  const [siteTitle, setSiteTitle] = useState(initialSettings?.siteTitle || "");
  const [metaDescription, setMetaDescription] = useState(initialSettings?.metaDescription || "");
  const [keywordsInput, setKeywordsInput] = useState((initialSettings?.keywords || []).join(", "));
  const [favicon, setFavicon] = useState(initialSettings?.favicon || "");
  const [analyticsId, setAnalyticsId] = useState(initialSettings?.analyticsId || "");
  const [maintenanceMode, setMaintenanceMode] = useState(initialSettings?.maintenanceMode || false);

  // Settings Loading/Status States
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<{ success: boolean; text: string } | null>(null);

  // Password Change Fields
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password Loading/Status States
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ success: boolean; text: string } | null>(null);

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsLoading(true);
    setSettingsMessage(null);

    const keywords = keywordsInput
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    const result = await updateSettings({
      siteTitle,
      metaDescription,
      keywords,
      favicon,
      analyticsId,
      maintenanceMode,
    });

    if (result.success) {
      setSettingsMessage({ success: true, text: "SEO and site configurations saved!" });
    } else {
      setSettingsMessage({ success: false, text: result.error || "Failed to update configurations." });
    }
    setSettingsLoading(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ success: false, text: "New passwords do not match." });
      return;
    }

    setPasswordLoading(true);
    setPasswordMessage(null);

    const result = await changeAdminPassword({
      oldPassword,
      newPassword,
      confirmPassword,
    });

    if (result.success) {
      setPasswordMessage({ success: true, text: "Security credentials updated successfully!" });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setPasswordMessage({ success: false, text: result.error || "Failed to update security credentials." });
    }
    setPasswordLoading(false);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Global Configurations</h1>
        <p className="text-xs text-[#94A3B8] font-light">
          Configure search visibility settings, meta descriptions, key phrases, and security details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* SEO Settings form */}
        <form onSubmit={handleUpdateSettings} className="lg:col-span-7 space-y-6">
          <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-5">
            <h3 className="text-sm font-semibold text-[#F8FAFC] flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-400" /> SEO & Meta Data
            </h3>

            {settingsMessage && (
              <div
                className={`p-3.5 rounded-xl text-xs text-center border font-light ${
                  settingsMessage.success
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                }`}
              >
                {settingsMessage.text}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Website Global Title</label>
              <input
                type="text"
                required
                placeholder="e.g. John Doe | Senior Full-Stack Engineer"
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
                className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-xs py-2 px-3.5 rounded-xl text-[#F8FAFC] outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Meta Description</label>
              <textarea
                required
                rows={3}
                placeholder="Brief description for Google search rankings..."
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-xs py-2 px-3.5 rounded-xl text-[#F8FAFC] outline-none transition-all resize-none leading-relaxed"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Search Keywords (Comma separated)</label>
              <input
                type="text"
                placeholder="e.g. fullstack, portfolio, react, nextjs"
                value={keywordsInput}
                onChange={(e) => setKeywordsInput(e.target.value)}
                className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-xs py-2 px-3.5 rounded-xl text-[#F8FAFC] outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Favicon URL</label>
                <input
                  type="text"
                  placeholder="e.g. /favicon.ico"
                  value={favicon}
                  onChange={(e) => setFavicon(e.target.value)}
                  className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-xs py-2 px-3.5 rounded-xl text-[#F8FAFC] outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Google Analytics ID</label>
                <input
                  type="text"
                  placeholder="e.g. G-XXXXXXXXXX"
                  value={analyticsId}
                  onChange={(e) => setAnalyticsId(e.target.value)}
                  className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-xs py-2 px-3.5 rounded-xl text-[#F8FAFC] outline-none transition-all"
                />
              </div>
            </div>

            {/* Maintenance Mode */}
            <div className="border-t border-white/5 pt-5 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-[#F8FAFC]">Maintenance Mode</h4>
                  <p className="text-[10px] text-[#94A3B8]">
                    Temprorily disable public visitors access and display a splash maintenance page.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                id="maintenanceMode"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="rounded border-white/10 bg-white/[0.02] text-sky-500 w-4.5 h-4.5 accent-sky-500 cursor-pointer"
              />
            </div>

            <div className="border-t border-white/5 pt-5 flex justify-end">
              <button
                type="submit"
                disabled={settingsLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-violet-500 hover:from-sky-500 hover:to-violet-600 text-white font-semibold text-xs transition-all shadow-lg shadow-sky-500/10 cursor-pointer disabled:opacity-50"
              >
                {settingsLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Save Configurations</span>
              </button>
            </div>
          </div>
        </form>

        {/* Change password card */}
        <form onSubmit={handlePasswordChange} className="lg:col-span-5 space-y-6">
          <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-5">
            <h3 className="text-sm font-semibold text-[#F8FAFC] flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-violet-400" /> Administrative Security
            </h3>

            {passwordMessage && (
              <div
                className={`p-3.5 rounded-xl text-xs text-center border font-light ${
                  passwordMessage.success
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                }`}
              >
                {passwordMessage.text}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Current Password</label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-xs py-2 px-3.5 rounded-xl text-[#F8FAFC] outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-xs py-2 px-3.5 rounded-xl text-[#F8FAFC] outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-xs py-2 px-3.5 rounded-xl text-[#F8FAFC] outline-none transition-all"
              />
            </div>

            <div className="border-t border-white/5 pt-5 flex justify-end">
              <button
                type="submit"
                disabled={passwordLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-violet-500 hover:from-sky-500 hover:to-violet-600 text-white font-semibold text-xs transition-all shadow-lg shadow-sky-500/10 cursor-pointer disabled:opacity-50"
              >
                {passwordLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                <span>Update Credentials</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
