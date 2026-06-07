"use client";

import React, { useState } from "react";
import { createSocialLink, updateSocialLink, deleteSocialLink, reorderSocialLinks } from "@/actions/social-links";
import { Plus, Edit, Trash2, ArrowUp, ArrowDown, X, Save, Loader2, Link2 } from "lucide-react";

interface SocialLinkItem {
  _id: string;
  platform: string;
  url: string;
  icon: string;
  active: boolean;
  order: number;
}

interface SocialLinksManagerProps {
  initialLinks: SocialLinkItem[];
}

export default function SocialLinksManager({ initialLinks }: SocialLinksManagerProps) {
  const [links, setLinks] = useState<SocialLinkItem[]>(initialLinks);
  const [isEditing, setIsEditing] = useState(false);
  const [currentLink, setCurrentLink] = useState<Partial<SocialLinkItem> | null>(null);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [icon, setIcon] = useState("Link2");
  const [active, setActive] = useState(true);

  const openAddModal = () => {
    setCurrentLink(null);
    setPlatform("");
    setUrl("");
    setIcon("Link2");
    setActive(true);
    setIsEditing(true);
  };

  const openEditModal = (link: SocialLinkItem) => {
    setCurrentLink(link);
    setPlatform(link.platform);
    setUrl(link.url);
    setIcon(link.icon);
    setActive(link.active);
    setIsEditing(true);
  };

  const handleDelete = async (id: string, platform: string) => {
    if (!confirm(`Are you sure you want to delete link for: "${platform}"?`)) return;

    setActionLoading(id);
    const result = await deleteSocialLink(id);
    if (result.success) {
      setLinks(links.filter((l) => l._id !== id));
    } else {
      alert(result.error || "Failed to delete link");
    }
    setActionLoading(null);
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= links.length) return;

    const list = [...links];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    setLinks(list);

    const ids = list.map((l) => l._id);
    await reorderSocialLinks(ids);
  };

  const handleToggleActive = async (link: SocialLinkItem) => {
    setActionLoading(link._id);
    const updatedPayload = {
      platform: link.platform,
      url: link.url,
      icon: link.icon,
      active: !link.active,
      order: link.order,
    };
    const result = await updateSocialLink(link._id, updatedPayload);
    if (result.success && result.data) {
      setLinks(links.map((l) => (l._id === link._id ? (result.data as SocialLinkItem) : l)));
    }
    setActionLoading(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = { platform, url, icon, active };

    if (currentLink?._id) {
      const result = await updateSocialLink(currentLink._id, payload);
      if (result.success && result.data) {
        setLinks(
          links.map((l) => (l._id === currentLink._id ? (result.data as SocialLinkItem) : l))
        );
        setIsEditing(false);
      } else {
        setError(result.error || "Failed to update social link");
      }
    } else {
      const result = await createSocialLink(payload);
      if (result.success && result.data) {
        setLinks([...links, result.data as SocialLinkItem]);
        setIsEditing(false);
      } else {
        setError(result.error || "Failed to create social link");
      }
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Social Profile Links</h1>
          <p className="text-xs text-[#94A3B8] font-light">Manage your social networks links displayed in header and footer.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-violet-500 hover:from-sky-500 hover:to-violet-600 text-white font-semibold text-xs transition-all shadow-lg shadow-sky-500/10 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Link
        </button>
      </div>

      {links.length === 0 ? (
        <div className="bg-white/[0.01] border border-white/5 p-12 text-center rounded-2xl">
          <Link2 className="w-8 h-8 mx-auto mb-3 text-[#64748B]" />
          <p className="text-sm text-[#94A3B8]">No social links added yet.</p>
          <button
            onClick={openAddModal}
            className="text-xs text-sky-400 hover:underline mt-2 font-semibold"
          >
            Add your first link
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {links.map((link, idx) => (
            <div
              key={link._id}
              className="bg-white/[0.01] border border-white/5 p-4 rounded-2xl flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <button
                  onClick={() => handleToggleActive(link)}
                  disabled={actionLoading === link._id}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-semibold border transition-all ${
                    link.active
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      : "bg-white/5 border-white/10 text-[#94A3B8]"
                  }`}
                  title={link.active ? "Click to Disable" : "Click to Enable"}
                >
                  {link.platform.charAt(0)}
                </button>
                <div className="min-w-0">
                  <h3 className="font-semibold text-xs text-[#F8FAFC]">{link.platform}</h3>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-sky-400 hover:underline truncate block"
                  >
                    {link.url}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleMove(idx, "up")}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.03] text-[#94A3B8] disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(idx, "down")}
                    disabled={idx === links.length - 1}
                    className="p-1.5 rounded-lg border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.03] text-[#94A3B8] disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(link)}
                    className="p-1.5 rounded-lg border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.03] text-sky-400 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(link._id, link.platform)}
                    disabled={actionLoading === link._id}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsEditing(false)} />
          
          <div className="bg-[#0B0F1E] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col">
            <div className="h-14 flex items-center justify-between px-6 border-b border-white/5 bg-[#090D18]">
              <h2 className="font-bold text-sm text-[#F8FAFC]">
                {currentLink ? "Edit Social Link" : "Add Social Link"}
              </h2>
              <button onClick={() => setIsEditing(false)} className="text-[#94A3B8] hover:text-[#F8FAFC] p-1.5 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-light">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Platform</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GitHub, LinkedIn"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-xs py-2 px-3 rounded-lg text-[#F8FAFC] outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Lucide Icon Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Github, Linkedin, Send"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-xs py-2 px-3 rounded-lg text-[#F8FAFC] outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Profile URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-xs py-2 px-3 rounded-lg text-[#F8FAFC] outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="rounded border-white/10 bg-white/[0.02] text-sky-500 w-4 h-4 accent-sky-500"
                />
                <label htmlFor="activeCheck" className="text-xs text-[#94A3B8] cursor-pointer">
                  Activate link (display in frontend)
                </label>
              </div>

              <div className="h-14 flex items-center justify-end gap-3 border-t border-white/5 pt-5 mt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-lg border border-white/10 text-xs font-semibold text-[#F8FAFC] hover:bg-white/5 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-sky-400 to-violet-500 hover:from-sky-500 hover:to-violet-600 text-white font-semibold text-xs transition-all shadow-lg shadow-sky-500/10 cursor-pointer disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{currentLink ? "Save Changes" : "Create Link"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
