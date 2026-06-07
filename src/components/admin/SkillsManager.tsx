"use client";

import React, { useState } from "react";
import { createSkill, updateSkill, deleteSkill, reorderSkills } from "@/actions/skills";
import { Plus, Edit, Trash2, ArrowUp, ArrowDown, X, Save, Loader2, Sparkles, Cpu } from "lucide-react";

interface SkillItem {
  _id: string;
  name: string;
  icon: string;
  category: "Frontend" | "Backend" | "Database" | "Programming" | "AI/ML" | "Cloud";
  level: "Advanced" | "Intermediate" | "Familiar";
  order: number;
}

interface SkillsManagerProps {
  initialSkills: SkillItem[];
}

export default function SkillsManager({ initialSkills }: SkillsManagerProps) {
  const [skills, setSkills] = useState<SkillItem[]>(initialSkills);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<Partial<SkillItem> | null>(null);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("Code");
  const [category, setCategory] = useState<SkillItem["category"]>("Frontend");
  const [level, setLevel] = useState<SkillItem["level"]>("Intermediate");

  const categories: SkillItem["category"][] = ["Frontend", "Backend", "Database", "Programming", "AI/ML", "Cloud"];

  const openAddModal = (cat?: SkillItem["category"]) => {
    setCurrentSkill(null);
    setName("");
    setIcon("Code");
    setCategory(cat || "Frontend");
    setLevel("Intermediate");
    setIsEditing(true);
  };

  const openEditModal = (skill: SkillItem) => {
    setCurrentSkill(skill);
    setName(skill.name);
    setIcon(skill.icon);
    setCategory(skill.category);
    setLevel(skill.level);
    setIsEditing(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete skill: "${name}"?`)) return;

    setActionLoading(id);
    const result = await deleteSkill(id);
    if (result.success) {
      setSkills(skills.filter((s) => s._id !== id));
    } else {
      alert(result.error || "Failed to delete skill");
    }
    setActionLoading(null);
  };

  const handleMove = async (category: SkillItem["category"], index: number, direction: "up" | "down") => {
    const categorySkills = skills.filter((s) => s.category === category);
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= categorySkills.length) return;

    const currentItem = categorySkills[index];
    const targetItem = categorySkills[targetIdx];

    // Swap order values in local array
    const updatedSkills = skills.map((s) => {
      if (s._id === currentItem._id) {
        return { ...s, order: targetItem.order };
      }
      if (s._id === targetItem._id) {
        return { ...s, order: currentItem.order };
      }
      return s;
    });

    // Sort by order value locally
    const reorderedList = [...updatedSkills].sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return a.order - b.order;
    });

    setSkills(reorderedList);

    // Save ordering state
    const categoryIds = reorderedList.filter((s) => s.category === category).map((s) => s._id);
    await reorderSkills(categoryIds);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = { name, icon, category, level };

    if (currentSkill?._id) {
      // Edit
      const result = await updateSkill(currentSkill._id, payload);
      if (result.success && result.data) {
        setSkills(
          skills.map((s) => (s._id === currentSkill._id ? (result.data as SkillItem) : s))
        );
        setIsEditing(false);
      } else {
        setError(result.error || "Failed to update skill");
      }
    } else {
      // Add
      const result = await createSkill(payload);
      if (result.success && result.data) {
        setSkills([...skills, result.data as SkillItem]);
        setIsEditing(false);
      } else {
        setError(result.error || "Failed to create skill");
      }
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Skills Catalog</h1>
          <p className="text-xs text-[#94A3B8] font-light">Structure your technical competencies by category.</p>
        </div>
        <button
          onClick={() => openAddModal()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-violet-500 hover:from-sky-500 hover:to-violet-600 text-white font-semibold text-xs transition-all shadow-lg shadow-sky-500/10 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Skill
        </button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => {
          const categorySkills = skills
            .filter((s) => s.category === cat)
            .sort((a, b) => a.order - b.order);

          return (
            <div key={cat} className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-4 mb-5 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#F8FAFC]">{cat}</span>
                    <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] text-[#94A3B8] font-mono">
                      {categorySkills.length}
                    </span>
                  </div>
                  <button
                    onClick={() => openAddModal(cat)}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-sky-400 text-xs transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {categorySkills.length === 0 ? (
                  <div className="py-6 text-center text-xs text-[#64748B] font-light italic">
                    No skills added in this category.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {categorySkills.map((skill, idx) => (
                      <div
                        key={skill._id}
                        className="flex items-center justify-between gap-4 p-2.5 rounded-xl bg-white/[0.01] border border-white/5 group hover:border-white/10 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-medium text-[#F8FAFC]">{skill.name}</span>
                          <span className="px-1.5 py-0.5 rounded bg-[#0A0F1D] border border-white/5 text-[8px] font-mono text-[#94A3B8]">
                            {skill.level}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleMove(cat, idx, "up")}
                            disabled={idx === 0}
                            className="p-1 rounded border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.03] text-[#94A3B8] disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleMove(cat, idx, "down")}
                            disabled={idx === categorySkills.length - 1}
                            className="p-1 rounded border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.03] text-[#94A3B8] disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => openEditModal(skill)}
                            className="p-1 rounded hover:bg-white/5 text-sky-400 cursor-pointer"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(skill._id, skill.name)}
                            disabled={actionLoading === skill._id}
                            className="p-1 rounded hover:bg-rose-500/10 text-rose-400 cursor-pointer disabled:opacity-50"
                          >
                            {actionLoading === skill._id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Trash2 className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Editor Modal Dialog (Glassmorphic) */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsEditing(false)} />
          
          <div className="bg-[#0B0F1E] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col">
            <div className="h-14 flex items-center justify-between px-6 border-b border-white/5 bg-[#090D18]">
              <h2 className="font-bold text-sm text-[#F8FAFC]">
                {currentSkill ? "Edit Skill Details" : "Add New Skill"}
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
                <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Skill Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  placeholder="e.g. Next.js"
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-xs py-2 px-3 rounded-lg text-[#F8FAFC] outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Lucide Icon Name</label>
                <input
                  type="text"
                  value={icon}
                  placeholder="e.g. Monitor, Server, Database, Terminal, Cpu"
                  onChange={(e) => setIcon(e.target.value)}
                  className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-xs py-2 px-3 rounded-lg text-[#F8FAFC] outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as SkillItem["category"])}
                    className="bg-[#0c1222] border border-white/10 focus:border-sky-400 text-xs py-2 px-3 rounded-lg text-[#F8FAFC] outline-none transition-all cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Competency Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as SkillItem["level"])}
                    className="bg-[#0c1222] border border-white/10 focus:border-sky-400 text-xs py-2 px-3 rounded-lg text-[#F8FAFC] outline-none transition-all cursor-pointer"
                  >
                    <option value="Advanced">Advanced</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Familiar">Familiar</option>
                  </select>
                </div>
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
                  <span>{currentSkill ? "Save Changes" : "Create Skill"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
