"use client";

import React, { useState } from "react";
import { createBlogPost, updateBlogPost, deleteBlogPost } from "@/actions/blog";
import ImageSelector from "./ImageSelector";
import { Plus, Edit, Trash2, X, Save, Loader2, BookOpen, Eye, EyeOff, Tag } from "lucide-react";

interface BlogPostItem {
  _id: string;
  title: string;
  slug: string;
  content: string;
  featuredImage: string;
  tags: string[];
  category: string;
  publishedStatus: "draft" | "published";
  createdAt: string;
}

interface BlogManagerProps {
  initialPosts: BlogPostItem[];
}

export default function BlogManager({ initialPosts }: BlogManagerProps) {
  const [posts, setPosts] = useState<BlogPostItem[]>(initialPosts);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPostItem | null>(null);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [category, setCategory] = useState("Tech");
  const [tagsInput, setTagsInput] = useState("");
  const [publishedStatus, setPublishedStatus] = useState<"draft" | "published">("draft");

  const generateSlug = (val: string) => {
    return val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // remove special chars
      .replace(/[\s_]+/g, "-") // replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ""); // trim hyphens
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!currentPost) {
      setSlug(generateSlug(val));
    }
  };

  const openAddModal = () => {
    setCurrentPost(null);
    setTitle("");
    setSlug("");
    setContent("");
    setFeaturedImage("");
    setCategory("Tech");
    setTagsInput("");
    setPublishedStatus("draft");
    setError(null);
    setIsEditing(true);
  };

  const openEditModal = (post: BlogPostItem) => {
    setCurrentPost(post);
    setTitle(post.title);
    setSlug(post.slug);
    setContent(post.content);
    setFeaturedImage(post.featuredImage || "");
    setCategory(post.category || "Tech");
    setTagsInput((post.tags || []).join(", "));
    setPublishedStatus(post.publishedStatus);
    setError(null);
    setIsEditing(true);
  };

  const handleDelete = async (id: string, postTitle: string) => {
    if (!confirm(`Are you sure you want to delete the blog post: "${postTitle}"?`)) return;

    setActionLoading(id);
    const result = await deleteBlogPost(id);
    if (result.success) {
      setPosts(posts.filter((p) => p._id !== id));
    } else {
      alert(result.error || "Failed to delete blog post");
    }
    setActionLoading(null);
  };

  const handleToggleStatus = async (post: BlogPostItem) => {
    setActionLoading(post._id);
    const newStatus = post.publishedStatus === "published" ? "draft" : "published";
    
    // We send tags input parsed
    const result = await updateBlogPost(post._id, {
      title: post.title,
      slug: post.slug,
      content: post.content,
      featuredImage: post.featuredImage,
      category: post.category,
      tags: post.tags,
      publishedStatus: newStatus,
    });

    if (result.success && result.data) {
      setPosts(posts.map((p) => (p._id === post._id ? (result.data as BlogPostItem) : p)));
    } else {
      alert(result.error || "Failed to update blog status");
    }
    setActionLoading(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      title,
      slug,
      content,
      featuredImage,
      category,
      tags,
      publishedStatus,
    };

    if (currentPost) {
      const result = await updateBlogPost(currentPost._id, payload);
      if (result.success && result.data) {
        setPosts(posts.map((p) => (p._id === currentPost._id ? (result.data as BlogPostItem) : p)));
        setIsEditing(false);
      } else {
        setError(result.error || "Failed to update blog post");
      }
    } else {
      const result = await createBlogPost(payload);
      if (result.success && result.data) {
        setPosts([result.data as BlogPostItem, ...posts]);
        setIsEditing(false);
      } else {
        setError(result.error || "Failed to create blog post");
      }
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Blog CMS</h1>
          <p className="text-xs text-[#94A3B8] font-light">
            Compose articles, manage slugs, categories, tags, and instantly toggle draft/published status.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-violet-500 hover:from-sky-500 hover:to-violet-600 text-white font-semibold text-xs transition-all shadow-lg shadow-sky-500/10 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Compose Article
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white/[0.01] border border-white/5 p-12 text-center rounded-2xl">
          <BookOpen className="w-8 h-8 mx-auto mb-3 text-[#64748B]" />
          <p className="text-sm text-[#94A3B8]">No blog posts found.</p>
          <button
            onClick={openAddModal}
            className="text-xs text-sky-400 hover:underline mt-2 font-semibold"
          >
            Create your first article
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 hover:border-white/10"
            >
              {/* Featured Image placeholder / thumbnail */}
              {post.featuredImage ? (
                <div className="h-40 w-full overflow-hidden border-b border-white/5 relative">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-slate-950/70 border border-white/10 backdrop-blur-md text-[10px] text-sky-400 px-2 py-0.5 rounded-md font-mono">
                    {post.category}
                  </span>
                </div>
              ) : (
                <div className="h-40 w-full bg-slate-900 border-b border-white/5 flex items-center justify-center relative">
                  <BookOpen className="w-8 h-8 text-slate-700" />
                  <span className="absolute top-3 left-3 bg-slate-950/70 border border-white/10 backdrop-blur-md text-[10px] text-sky-400 px-2 py-0.5 rounded-md font-mono">
                    {post.category}
                  </span>
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-[#64748B] font-mono">
                      {new Date(post.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <button
                      onClick={() => handleToggleStatus(post)}
                      disabled={actionLoading === post._id}
                      className={`flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border transition-all ${
                        post.publishedStatus === "published"
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                      }`}
                    >
                      {post.publishedStatus === "published" ? (
                        <>
                          <Eye className="w-2.5 h-2.5" /> Published
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-2.5 h-2.5" /> Draft
                        </>
                      )}
                    </button>
                  </div>

                  <h3 className="font-bold text-sm text-[#F8FAFC] line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-[11px] text-[#94A3B8] font-mono font-light truncate">
                    /{post.slug}
                  </p>

                  {/* Tags list */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center gap-0.5 text-[10px] bg-white/5 border border-white/10 text-[#94A3B8] px-1.5 py-0.5 rounded-md"
                        >
                          <Tag className="w-2 h-2 text-sky-400" /> {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                  <button
                    onClick={() => openEditModal(post)}
                    className="p-1.5 rounded-lg border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.03] text-sky-400 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(post._id, post.title)}
                    disabled={actionLoading === post._id}
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

      {/* Write/Edit Article Drawer/Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsEditing(false)} />
          
          <div className="bg-[#0B0F1E] border border-white/10 w-full max-w-4xl h-[90vh] rounded-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col">
            <div className="h-14 flex items-center justify-between px-6 border-b border-white/5 bg-[#090D18]">
              <h2 className="font-bold text-sm text-[#F8FAFC]">
                {currentPost ? "Edit Article" : "Compose New Article"}
              </h2>
              <button onClick={() => setIsEditing(false)} className="text-[#94A3B8] hover:text-[#F8FAFC] p-1.5 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
              {error && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-light">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Forms (Metadata) */}
                <div className="md:col-span-1 space-y-5">
                  <ImageSelector
                    value={featuredImage}
                    onChange={setFeaturedImage}
                    label="Featured Image (Cloudinary)"
                    folder="blog"
                  />

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Title</label>
                    <input
                      type="text"
                      required
                      placeholder="Article title..."
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-xs py-2 px-3 rounded-lg text-[#F8FAFC] outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Slug URL</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. dynamic-portfolio-cms"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-xs py-2 px-3 rounded-lg text-[#F8FAFC] outline-none font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Category</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tech, Design"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-xs py-2 px-3 rounded-lg text-[#F8FAFC] outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Status</label>
                      <select
                        value={publishedStatus}
                        onChange={(e) => setPublishedStatus(e.target.value as any)}
                        className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-xs py-2 px-3 rounded-lg text-[#F8FAFC] outline-none cursor-pointer"
                      >
                        <option value="draft" className="bg-[#0B0F1E]">Draft</option>
                        <option value="published" className="bg-[#0B0F1E]">Published</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Tags (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="nextjs, tailwind, mongodb"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-xs py-2 px-3 rounded-lg text-[#F8FAFC] outline-none"
                    />
                  </div>
                </div>

                {/* Right Body Content editor */}
                <div className="md:col-span-2 flex flex-col gap-1.5 h-full min-h-[300px]">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Content (Supports Markdown)</label>
                  <textarea
                    required
                    placeholder="# Hello World&#10;&#10;Write your markdown content here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full flex-1 bg-white/[0.02] border border-white/10 focus:border-sky-400 text-xs p-4 rounded-lg text-[#F8FAFC] outline-none resize-none font-mono leading-relaxed"
                  />
                </div>
              </div>

              <div className="h-16 flex items-center justify-end gap-3 border-t border-white/5 pt-5 flex-shrink-0">
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
                  <span>{currentPost ? "Save Changes" : "Publish Article"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
