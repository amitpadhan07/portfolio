"use client";

import React, { useState } from "react";
import { updateProfile } from "@/actions/profile";
import ImageSelector from "./ImageSelector";
import { Save, Plus, Trash2, Loader2 } from "lucide-react";

interface StatItem {
  label: string;
  value: number;
  suffix: string;
  subtext: string;
}

interface ProfileFormProps {
  initialProfile: {
    name: string;
    title: string;
    heroHeading: string;
    heroDescription: string;
    aboutMe: string;
    profilePicture: string;
    heroImage: string;
    stats: StatItem[];
  } | null;
}

export default function ProfileForm({ initialProfile }: ProfileFormProps) {
  const [name, setName] = useState(initialProfile?.name || "");
  const [title, setTitle] = useState(initialProfile?.title || "");
  const [heroHeading, setHeroHeading] = useState(initialProfile?.heroHeading || "");
  const [heroDescription, setHeroDescription] = useState(initialProfile?.heroDescription || "");
  const [aboutMe, setAboutMe] = useState(initialProfile?.aboutMe || "");
  const [profilePicture, setProfilePicture] = useState(initialProfile?.profilePicture || "");
  const [heroImage, setHeroImage] = useState(initialProfile?.heroImage || "");
  const [stats, setStats] = useState<StatItem[]>(initialProfile?.stats || []);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ success: boolean; text: string } | null>(null);

  const handleAddStat = () => {
    setStats([...stats, { label: "", value: 0, suffix: "", subtext: "" }]);
  };

  const handleRemoveStat = (index: number) => {
    setStats(stats.filter((_, idx) => idx !== index));
  };

  const handleStatChange = (index: number, field: keyof StatItem, value: any) => {
    const updated = [...stats];
    updated[index] = {
      ...updated[index],
      [field]: field === "value" ? Number(value) : value,
    };
    setStats(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const result = await updateProfile({
      name,
      title,
      heroHeading,
      heroDescription,
      aboutMe,
      profilePicture,
      heroImage,
      stats,
    });

    if (result.success) {
      setMessage({ success: true, text: "Profile details updated successfully!" });
    } else {
      setMessage({ success: false, text: result.error || "Failed to update profile." });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {message && (
        <div
          className={`p-4 rounded-xl text-xs text-center border font-light ${
            message.success
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-rose-500/10 border-rose-500/20 text-rose-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Header and Save Button */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Edit Profile Info</h1>
          <p className="text-xs text-[#94A3B8] font-light">Update your professional bio, pictures, and homepage counters.</p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-violet-500 hover:from-sky-500 hover:to-violet-600 text-white font-semibold text-xs transition-all shadow-lg shadow-sky-500/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>Save Changes</span>
        </button>
      </div>

      {/* Picture Uploaders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.01] border border-white/5 p-6 rounded-2xl">
        <ImageSelector
          value={profilePicture}
          onChange={setProfilePicture}
          label="Profile Avatar (Suit Photo)"
          folder="profile"
        />
        <ImageSelector
          value={heroImage}
          onChange={setHeroImage}
          label="Hero Background Image (Cartoon Avatar)"
          folder="profile"
        />
      </div>

      {/* Core Details Card */}
      <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-6">
        <h3 className="text-sm font-semibold text-[#F8FAFC]">Homepage Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-sm py-2 px-3.5 rounded-xl text-[#F8FAFC] outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Job Title / Specialty</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-sm py-2 px-3.5 rounded-xl text-[#F8FAFC] outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Hero Main Heading</label>
          <input
            type="text"
            required
            value={heroHeading}
            onChange={(e) => setHeroHeading(e.target.value)}
            className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-sm py-2 px-3.5 rounded-xl text-[#F8FAFC] outline-none transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Hero Description</label>
          <textarea
            required
            rows={3}
            value={heroDescription}
            onChange={(e) => setHeroDescription(e.target.value)}
            className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-sm py-2 px-3.5 rounded-xl text-[#F8FAFC] outline-none transition-all resize-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">About Me (Bio text)</label>
          <textarea
            required
            rows={5}
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
            className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-sm py-2.5 px-3.5 rounded-xl text-[#F8FAFC] outline-none transition-all resize-none leading-relaxed"
          />
        </div>
      </div>

      {/* Stats Counter Array Card */}
      <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-sm font-semibold text-[#F8FAFC]">Homepage Statistics</h3>
          <button
            type="button"
            onClick={handleAddStat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/[0.01] hover:bg-white/[0.03] text-xs font-medium text-[#F8FAFC] transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-sky-400" /> Add Metric
          </button>
        </div>

        {stats.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#64748B] font-light">
            No statistics metrics configured yet. Click "Add Metric" to define some.
          </div>
        ) : (
          <div className="space-y-4">
            {stats.map((stat, index) => (
              <div key={index} className="flex gap-4 items-end bg-slate-950/20 border border-white/5 p-4 rounded-xl relative">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 flex-1">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-[#94A3B8]">LABEL</span>
                    <input
                      type="text"
                      required
                      value={stat.label}
                      placeholder="e.g. DSA Solved"
                      onChange={(e) => handleStatChange(index, "label", e.target.value)}
                      className="bg-white/[0.02] border border-white/10 text-xs py-1.5 px-2.5 rounded-lg text-[#F8FAFC] outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-[#94A3B8]">VALUE</span>
                    <input
                      type="number"
                      required
                      value={stat.value}
                      placeholder="e.g. 200"
                      onChange={(e) => handleStatChange(index, "value", e.target.value)}
                      className="bg-white/[0.02] border border-white/10 text-xs py-1.5 px-2.5 rounded-lg text-[#F8FAFC] outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-[#94A3B8]">SUFFIX</span>
                    <input
                      type="text"
                      value={stat.suffix}
                      placeholder="e.g. +"
                      onChange={(e) => handleStatChange(index, "suffix", e.target.value)}
                      className="bg-white/[0.02] border border-white/10 text-xs py-1.5 px-2.5 rounded-lg text-[#F8FAFC] outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-[#94A3B8]">SUBTEXT</span>
                    <input
                      type="text"
                      value={stat.subtext}
                      placeholder="e.g. LeetCode problems"
                      onChange={(e) => handleStatChange(index, "subtext", e.target.value)}
                      className="bg-white/[0.02] border border-white/10 text-xs py-1.5 px-2.5 rounded-lg text-[#F8FAFC] outline-none"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveStat(index)}
                  className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all cursor-pointer flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  );
}
