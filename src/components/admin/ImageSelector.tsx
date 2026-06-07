"use client";

import React, { useState, useRef } from "react";
import { uploadImageAction } from "@/actions/media";
import { Image, Upload, Loader2, X } from "lucide-react";

interface ImageSelectorProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export default function ImageSelector({ value, onChange, folder = "portfolio_cms", label = "Select Image" }: ImageSelectorProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File is too large. Max size is 5MB.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const result = await uploadImageAction(formData);

      if (result.success && result.url) {
        onChange(result.url);
      } else {
        setError(result.error || "Failed to upload image.");
      }
    } catch (err) {
      setError("An unexpected error occurred during upload.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">{label}</span>
      
      {value ? (
        <div className="relative w-full max-w-[200px] h-32 rounded-xl overflow-hidden border border-white/10 group bg-slate-950/40">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 hover:bg-rose-500/90 text-white transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full max-w-[200px] h-32 rounded-xl border border-dashed border-white/10 hover:border-sky-500/50 bg-white/[0.01] hover:bg-white/[0.02] flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 text-sky-400 animate-spin" />
              <span className="text-[10px] text-[#94A3B8] font-mono">Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 text-[#64748B] group-hover:text-sky-400 transition-colors" />
              <span className="text-[10px] text-[#94A3B8] font-mono group-hover:text-[#F8FAFC]">Upload Asset</span>
            </>
          )}
        </div>
      )}

      {error && <span className="text-[10px] text-rose-400 font-light mt-1">{error}</span>}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
