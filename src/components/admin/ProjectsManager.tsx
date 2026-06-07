"use client";

import React, { useState } from "react";
import { createProject, updateProject, deleteProject, reorderProjects } from "@/actions/projects";
import ImageSelector from "./ImageSelector";
import { Plus, Edit, Trash2, ArrowUp, ArrowDown, ExternalLink, X, Save, Loader2, Sparkles } from "lucide-react";

interface ProjectItem {
  _id: string;
  name: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  image: string;
  category: string;
  featured: boolean;
  status: "active" | "draft";
  order: number;
}

interface ProjectsManagerProps {
  initialProjects: ProjectItem[];
}

export default function ProjectsManager({ initialProjects }: ProjectsManagerProps) {
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<ProjectItem> | null>(null);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [technologiesText, setTechnologiesText] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<"active" | "draft">("active");

  const openAddModal = () => {
    setCurrentProject(null);
    setName("");
    setDescription("");
    setTechnologiesText("");
    setGithubUrl("");
    setLiveUrl("");
    setImage("");
    setCategory("");
    setFeatured(false);
    setStatus("active");
    setIsEditing(true);
  };

  const openEditModal = (project: ProjectItem) => {
    setCurrentProject(project);
    setName(project.name);
    setDescription(project.description);
    setTechnologiesText(project.technologies.join(", "));
    setGithubUrl(project.githubUrl || "");
    setLiveUrl(project.liveUrl || "");
    setImage(project.image || "");
    setCategory(project.category);
    setFeatured(project.featured);
    setStatus(project.status);
    setIsEditing(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete project: "${name}"?`)) return;

    setActionLoading(id);
    const result = await deleteProject(id);
    if (result.success) {
      setProjects(projects.filter((p) => p._id !== id));
    } else {
      alert(result.error || "Failed to delete project");
    }
    setActionLoading(null);
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= projects.length) return;

    const list = [...projects];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    // Local update
    setProjects(list);

    // Persist order to database
    const ids = list.map((p) => p._id);
    await reorderProjects(ids);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const techArray = technologiesText
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      name,
      description,
      technologies: techArray,
      githubUrl,
      liveUrl,
      image,
      category,
      featured,
      status,
    };

    if (currentProject?._id) {
      // Edit
      const result = await updateProject(currentProject._id, payload);
      if (result.success && result.data) {
        setProjects(
          projects.map((p) => (p._id === currentProject._id ? (result.data as ProjectItem) : p))
        );
        setIsEditing(false);
      } else {
        setError(result.error || "Failed to update project");
      }
    } else {
      // Add
      const result = await createProject(payload);
      if (result.success && result.data) {
        setProjects([...projects, result.data as ProjectItem]);
        setIsEditing(false);
      } else {
        setError(result.error || "Failed to create project");
      }
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Project Portfolio</h1>
          <p className="text-xs text-[#94A3B8] font-light">Create, edit, and drag-reorder showcase modules.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-violet-500 hover:from-sky-500 hover:to-violet-600 text-white font-semibold text-xs transition-all shadow-lg shadow-sky-500/10 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Project
        </button>
      </div>

      {/* Projects List Layout */}
      {projects.length === 0 ? (
        <div className="bg-white/[0.01] border border-white/5 p-12 text-center rounded-2xl">
          <Sparkles className="w-8 h-8 mx-auto mb-3 text-[#64748B]" />
          <p className="text-sm text-[#94A3B8]">No projects added yet.</p>
          <button
            onClick={openAddModal}
            className="text-xs text-sky-400 hover:underline mt-2 font-semibold"
          >
            Create your first project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, idx) => (
            <div
              key={project._id}
              className="bg-white/[0.01] border border-white/5 p-5 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-all relative group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-semibold text-sm text-[#F8FAFC]">{project.name}</h3>
                    <span className="text-[10px] text-sky-400 font-mono">{project.category}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {project.featured && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[8px] font-semibold uppercase font-mono">
                        Featured
                      </span>
                    )}
                    <span
                      className={`px-1.5 py-0.5 rounded text-[8px] font-semibold uppercase font-mono ${
                        project.status === "active"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-white/5 text-[#94A3B8]"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#94A3B8] font-light leading-relaxed mb-4 line-clamp-2">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {project.technologies.map((t, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] text-[#94A3B8]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-white/5 gap-4">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleMove(idx, "up")}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.03] text-[#94A3B8] disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(idx, "down")}
                    disabled={idx === projects.length - 1}
                    className="p-1.5 rounded-lg border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.03] text-[#94A3B8] disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(project)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.03] text-xs font-semibold text-sky-400 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project._id, project.name)}
                    disabled={actionLoading === project._id}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold cursor-pointer disabled:opacity-50"
                  >
                    {actionLoading === project._id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal Dialog (Glassmorphic) */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsEditing(false)} />
          
          <div className="bg-[#0B0F1E] border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="h-14 flex items-center justify-between px-6 border-b border-white/5 bg-[#090D18]">
              <h2 className="font-bold text-sm text-[#F8FAFC]">
                {currentProject ? "Edit Project Details" : "Add Project to Portfolio"}
              </h2>
              <button onClick={() => setIsEditing(false)} className="text-[#94A3B8] hover:text-[#F8FAFC] p-1.5 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin">
              {error && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-light">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Project Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-xs py-2 px-3 rounded-lg text-[#F8FAFC] outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Category / Area</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Full Stack App"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-xs py-2 px-3 rounded-lg text-[#F8FAFC] outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Description</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-xs py-2 px-3 rounded-lg text-[#F8FAFC] outline-none transition-all resize-none leading-relaxed"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Technologies (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Next.js, TypeScript, Tailwind CSS"
                  value={technologiesText}
                  onChange={(e) => setTechnologiesText(e.target.value)}
                  className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-xs py-2 px-3 rounded-lg text-[#F8FAFC] outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">GitHub URL</label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-xs py-2 px-3 rounded-lg text-[#F8FAFC] outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Live Demo URL</label>
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-xs py-2 px-3 rounded-lg text-[#F8FAFC] outline-none transition-all"
                  />
                </div>
              </div>

              <ImageSelector
                value={image}
                onChange={setImage}
                label="Project Image/Thumbnail"
                folder="projects"
              />

              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <label className="flex items-center gap-2 text-xs text-[#94A3B8] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded border-white/10 bg-white/[0.02] text-sky-500 accent-sky-500"
                  />
                  <span>Feature project in homepage spotlights</span>
                </label>

                <div className="flex items-center gap-1">
                  <span className="text-xs text-[#94A3B8] mr-2">Status:</span>
                  <button
                    type="button"
                    onClick={() => setStatus("active")}
                    className={`px-3 py-1 rounded-l-lg border text-xs font-semibold ${
                      status === "active"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "border-white/5 text-[#94A3B8]"
                    }`}
                  >
                    Active
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus("draft")}
                    className={`px-3 py-1 rounded-r-lg border border-l-0 text-xs font-semibold ${
                      status === "draft"
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                        : "border-white/5 text-[#94A3B8]"
                    }`}
                  >
                    Draft
                  </button>
                </div>
              </div>

              <div className="h-14 flex items-center justify-end gap-3 border-t border-white/5 pt-5">
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
                  <span>{currentProject ? "Save Changes" : "Create Project"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
