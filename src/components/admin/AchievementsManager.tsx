"use client";

import React, { useState } from "react";
import { createAchievement, updateAchievement, deleteAchievement } from "@/actions/achievements";
import { Plus, Edit, Trash2, X, Save, Loader2, Trophy } from "lucide-react";

interface AchievementItem {
  _id: string;
  title: string;
  description: string;
  icon: string;
  date: string;
}

interface AchievementsManagerProps {
  initialAchievements: AchievementItem[];
}

export default function AchievementsManager({ initialAchievements }: AchievementsManagerProps) {
  const [achievements, setAchievements] = useState<AchievementItem[]>(initialAchievements);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAch, setCurrentAch] = useState<Partial<AchievementItem> | null>(null);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("Trophy");
  const [date, setDate] = useState("");

  const openAddModal = () => {
    setCurrentAch(null);
    setTitle("");
    setDescription("");
    setIcon("Trophy");
    setDate("");
    setIsEditing(true);
  };

  const openEditModal = (ach: AchievementItem) => {
    setCurrentAch(ach);
    setTitle(ach.title);
    setDescription(ach.description);
    setIcon(ach.icon);
    setDate(ach.date);
    setIsEditing(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete achievement: "${title}"?`)) return;

    setActionLoading(id);
    const result = await deleteAchievement(id);
    if (result.success) {
      setAchievements(achievements.filter((a) => a._id !== id));
    } else {
      alert(result.error || "Failed to delete achievement");
    }
    setActionLoading(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = { title, description, icon, date };

    if (currentAch?._id) {
      const result = await updateAchievement(currentAch._id, payload);
      if (result.success && result.data) {
        setAchievements(
          achievements.map((a) => (a._id === currentAch._id ? (result.data as AchievementItem) : a))
        );
        setIsEditing(false);
      } else {
        setError(result.error || "Failed to update achievement");
      }
    } else {
      const result = await createAchievement(payload);
      if (result.success && result.data) {
        setAchievements([...achievements, result.data as AchievementItem]);
        setIsEditing(false);
      } else {
        setError(result.error || "Failed to create achievement");
      }
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Key Achievements</h1>
          <p className="text-xs text-[#94A3B8] font-light">Showcase specific milestones, metrics, and honors.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-violet-500 hover:from-sky-500 hover:to-violet-600 text-white font-semibold text-xs transition-all shadow-lg shadow-sky-500/10 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Achievement
        </button>
      </div>

      {achievements.length === 0 ? (
        <div className="bg-white/[0.01] border border-white/5 p-12 text-center rounded-2xl">
          <Trophy className="w-8 h-8 mx-auto mb-3 text-[#64748B]" />
          <p className="text-sm text-[#94A3B8]">No achievements added yet.</p>
          <button
            onClick={openAddModal}
            className="text-xs text-sky-400 hover:underline mt-2 font-semibold"
          >
            Create your first entry
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {achievements.map((ach) => (
            <div
              key={ach._id}
              className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-start justify-between gap-4 group animate-fade-in"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0 mt-1">
                  <Trophy className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h3 className="font-semibold text-sm text-[#F8FAFC]">{ach.title}</h3>
                    <span className="text-[10px] text-[#64748B] font-mono">({ach.date})</span>
                  </div>
                  <p className="text-xs text-[#94A3B8] font-light leading-relaxed pt-2">
                    {ach.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-start">
                <button
                  onClick={() => openEditModal(ach)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.03] text-xs font-semibold text-sky-400 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(ach._id, ach.title)}
                  disabled={actionLoading === ach._id}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  {actionLoading === ach._id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsEditing(false)} />
          
          <div className="bg-[#0B0F1E] border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col">
            <div className="h-14 flex items-center justify-between px-6 border-b border-white/5 bg-[#090D18]">
              <h2 className="font-bold text-sm text-[#F8FAFC]">
                {currentAch ? "Edit Achievement details" : "Add Achievement Entry"}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Title / Metric</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. LeetCode Solving"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-xs py-2 px-3 rounded-lg text-[#F8FAFC] outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Date / Season</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2025"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-xs py-2 px-3 rounded-lg text-[#F8FAFC] outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Lucide Icon Name</label>
                <input
                  type="text"
                  value={icon}
                  placeholder="e.g. Trophy, Award, Zap, Code"
                  onChange={(e) => setIcon(e.target.value)}
                  className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-xs py-2 px-3 rounded-lg text-[#F8FAFC] outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Description Details</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your accomplishment, numbers, impact, etc."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-xs py-2 px-3 rounded-lg text-[#F8FAFC] outline-none resize-none leading-relaxed"
                />
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
                  <span>{currentAch ? "Save Changes" : "Create Entry"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
