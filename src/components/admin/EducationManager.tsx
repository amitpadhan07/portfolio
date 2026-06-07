"use client";

import React, { useState } from "react";
import { createEducation, updateEducation, deleteEducation } from "@/actions/education";
import { Plus, Edit, Trash2, X, Save, Loader2, GraduationCap } from "lucide-react";

interface EducationItem {
  _id: string;
  institution: string;
  degree: string;
  duration: string;
  description: string;
  grade: string;
}

interface EducationManagerProps {
  initialEducation: EducationItem[];
}

export default function EducationManager({ initialEducation }: EducationManagerProps) {
  const [education, setEducation] = useState<EducationItem[]>(initialEducation);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEdu, setCurrentEdu] = useState<Partial<EducationItem> | null>(null);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [institution, setInstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [grade, setGrade] = useState("");

  const openAddModal = () => {
    setCurrentEdu(null);
    setInstitution("");
    setDegree("");
    setDuration("");
    setDescription("");
    setGrade("");
    setIsEditing(true);
  };

  const openEditModal = (edu: EducationItem) => {
    setCurrentEdu(edu);
    setInstitution(edu.institution);
    setDegree(edu.degree);
    setDuration(edu.duration);
    setDescription(edu.description || "");
    setGrade(edu.grade || "");
    setIsEditing(true);
  };

  const handleDelete = async (id: string, degree: string) => {
    if (!confirm(`Are you sure you want to delete education: "${degree}"?`)) return;

    setActionLoading(id);
    const result = await deleteEducation(id);
    if (result.success) {
      setEducation(education.filter((e) => e._id !== id));
    } else {
      alert(result.error || "Failed to delete education");
    }
    setActionLoading(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = { institution, degree, duration, description, grade };

    if (currentEdu?._id) {
      const result = await updateEducation(currentEdu._id, payload);
      if (result.success && result.data) {
        setEducation(
          education.map((e) => (e._id === currentEdu._id ? (result.data as EducationItem) : e))
        );
        setIsEditing(false);
      } else {
        setError(result.error || "Failed to update education record");
      }
    } else {
      const result = await createEducation(payload);
      if (result.success && result.data) {
        setEducation([...education, result.data as EducationItem]);
        setIsEditing(false);
      } else {
        setError(result.error || "Failed to create education record");
      }
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Education Journey</h1>
          <p className="text-xs text-[#94A3B8] font-light">Manage your academic history and degree milestones.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-violet-500 hover:from-sky-500 hover:to-violet-600 text-white font-semibold text-xs transition-all shadow-lg shadow-sky-500/10 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Education
        </button>
      </div>

      {education.length === 0 ? (
        <div className="bg-white/[0.01] border border-white/5 p-12 text-center rounded-2xl">
          <GraduationCap className="w-8 h-8 mx-auto mb-3 text-[#64748B]" />
          <p className="text-sm text-[#94A3B8]">No education logs added yet.</p>
          <button
            onClick={openAddModal}
            className="text-xs text-sky-400 hover:underline mt-2 font-semibold"
          >
            Create your first entry
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {education.map((edu) => (
            <div
              key={edu._id}
              className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-start justify-between gap-4 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 flex-shrink-0 mt-1">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm text-[#F8FAFC]">{edu.degree}</h3>
                  <p className="text-xs text-[#94A3B8] font-light">{edu.institution} | {edu.duration}</p>
                  {edu.grade && (
                    <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-mono font-semibold uppercase mt-1">
                      Grade: {edu.grade}
                    </span>
                  )}
                  {edu.description && (
                    <p className="text-xs text-[#64748B] font-light mt-3 leading-relaxed border-t border-white/5 pt-3">
                      {edu.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-start">
                <button
                  onClick={() => openEditModal(edu)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.03] text-xs font-semibold text-sky-400 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(edu._id, edu.degree)}
                  disabled={actionLoading === edu._id}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  {actionLoading === edu._id ? (
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
                {currentEdu ? "Edit Education Record" : "Add Education Entry"}
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

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Institution / School</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Graphic Era Hill University"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-xs py-2 px-3 rounded-lg text-[#F8FAFC] outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Degree / Course</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B.Tech Computer Science Engineering"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-xs py-2 px-3 rounded-lg text-[#F8FAFC] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Duration</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2024 — Present"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-xs py-2 px-3 rounded-lg text-[#F8FAFC] outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Grade / GPA</label>
                  <input
                    type="text"
                    placeholder="e.g. 9.2 GPA"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-xs py-2 px-3 rounded-lg text-[#F8FAFC] outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Description / Highlights</label>
                <textarea
                  rows={4}
                  placeholder="Details of coursework, key milestones, etc."
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
                  <span>{currentEdu ? "Save Changes" : "Create Entry"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
