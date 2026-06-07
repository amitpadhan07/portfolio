"use client";

import React, { useState, useRef } from "react";
import { updateResume } from "@/actions/resume";
import { uploadImageAction } from "@/actions/media";
import { FileText, Download, Upload, Loader2, Save, CheckCircle } from "lucide-react";

interface ResumeManagerProps {
  initialResume: {
    pdfUrl: string;
    downloadCount: number;
  } | null;
}

export default function ResumeManager({ initialResume }: ResumeManagerProps) {
  const [pdfUrl, setPdfUrl] = useState(initialResume?.pdfUrl || "");
  const [downloadCount, setDownloadCount] = useState(initialResume?.downloadCount || 0);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ success: boolean; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      alert("File is too large. Maximum size is 8MB.");
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "resume");

      // Upload file using our action
      const result = await uploadImageAction(formData);

      if (result.success && result.url) {
        setPdfUrl(result.url);
        setMessage({ success: true, text: "Resume file uploaded to storage! Click 'Save Settings' to apply changes." });
      } else {
        setMessage({ success: false, text: result.error || "Failed to upload PDF." });
      }
    } catch (err) {
      setMessage({ success: false, text: "An error occurred during file upload." });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfUrl) return;

    setLoading(true);
    setMessage(null);

    const result = await updateResume(pdfUrl);

    if (result.success) {
      setMessage({ success: true, text: "Resume configuration saved and published successfully!" });
    } else {
      setMessage({ success: false, text: result.error || "Failed to update resume settings." });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Resume Management</h1>
        <p className="text-xs text-[#94A3B8] font-light">Upload, view download metrics, and replace your resume PDF.</p>
      </div>

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

      {/* Summary Card with Download Count */}
      <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 flex-shrink-0">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-[#F8FAFC]">Resume Downloads</h3>
            <p className="text-xs text-[#94A3B8] font-light">Total successful unique click hits</p>
          </div>
        </div>
        <span className="text-2xl font-bold font-mono tracking-tight text-rose-400">
          {downloadCount}
        </span>
      </div>

      {/* Upload & Setup Card */}
      <form onSubmit={handleSubmit} className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-6">
        <h3 className="text-sm font-semibold text-[#F8FAFC]">Resume Document</h3>

        {pdfUrl ? (
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950/20 border border-white/5">
            <FileText className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#F8FAFC] truncate">Resume PDF Document</p>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-sky-400 hover:underline truncate block"
              >
                View PDF File
              </a>
            </div>
            <button
              type="button"
              onClick={handleUploadClick}
              disabled={uploading}
              className="text-[10px] px-2.5 py-1.5 rounded bg-white/5 border border-white/10 hover:border-white/20 text-[#F8FAFC] font-semibold transition-all cursor-pointer disabled:opacity-50"
            >
              Replace
            </button>
          </div>
        ) : (
          <div
            onClick={handleUploadClick}
            className="border-2 border-dashed border-white/10 hover:border-sky-500/50 rounded-xl p-8 text-center bg-white/[0.01] hover:bg-white/[0.02] transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group"
          >
            {uploading ? (
              <>
                <Loader2 className="w-6 h-6 text-sky-400 animate-spin" />
                <span className="text-xs font-mono text-[#94A3B8]">Uploading file buffer...</span>
              </>
            ) : (
              <>
                <Upload className="w-6 h-6 text-[#64748B] group-hover:text-sky-400 transition-colors" />
                <span className="text-xs font-semibold text-[#94A3B8] group-hover:text-[#F8FAFC]">Upload Resume PDF</span>
                <span className="text-[10px] text-[#64748B] font-light">Max size 8MB (PDF formats only)</span>
              </>
            )}
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="application/pdf"
          className="hidden"
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Manual File/Asset URL</label>
          <input
            type="text"
            required
            placeholder="https://res.cloudinary.com/..."
            value={pdfUrl}
            onChange={(e) => setPdfUrl(e.target.value)}
            className="bg-white/[0.02] border border-white/10 focus:border-sky-400 text-xs py-2 px-3.5 rounded-xl text-[#F8FAFC] outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !pdfUrl}
          className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-gradient-to-r from-sky-400 to-violet-500 hover:from-sky-500 hover:to-violet-600 text-white font-semibold text-xs transition-all shadow-lg shadow-sky-500/10 cursor-pointer disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>Save Resume Settings</span>
        </button>
      </form>
    </div>
  );
}
