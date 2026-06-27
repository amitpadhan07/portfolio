"use client";

import React, { useCallback, useState } from "react";
import { Upload, X, FileText, Image as ImageIcon } from "lucide-react";
import { uploadImageAction } from "@/actions/media";
import type { ReplyAttachment } from "@/types/message";

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/zip",
  "application/x-zip-compressed",
];

interface AttachmentUploadProps {
  attachments: ReplyAttachment[];
  onChange: (attachments: ReplyAttachment[]) => void;
  maxFiles?: number;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileIcon({ mimeType }: { mimeType: string }) {
  if (mimeType.startsWith("image/")) return <ImageIcon className="w-4 h-4 text-sky-400" />;
  return <FileText className="w-4 h-4 text-violet-400" />;
}

export default function AttachmentUpload({
  attachments,
  onChange,
  maxFiles = 5,
}: AttachmentUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      if (attachments.length + fileArray.length > maxFiles) {
        alert(`Maximum ${maxFiles} attachments allowed`);
        return;
      }

      setUploading(true);
      const newAttachments: ReplyAttachment[] = [];

      for (const file of fileArray) {
        if (file.size > MAX_SIZE) {
          alert(`${file.name} exceeds 10MB limit`);
          continue;
        }
        if (!ALLOWED_TYPES.includes(file.type)) {
          alert(`${file.name}: unsupported file type`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "support_attachments");

        const result = await uploadImageAction(formData);
        if (result.success && result.url) {
          newAttachments.push({
            filename: result.filename || file.name,
            url: result.url,
            mimeType: result.mimeType || file.type,
            size: result.size || file.size,
          });
        } else {
          alert(result.error || `Failed to upload ${file.name}`);
        }
      }

      if (newAttachments.length > 0) {
        onChange([...attachments, ...newAttachments]);
      }
      setUploading(false);
    },
    [attachments, maxFiles, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles]
  );

  const removeAttachment = (index: number) => {
    onChange(attachments.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
          dragOver
            ? "border-sky-400 bg-sky-500/5"
            : "border-white/10 hover:border-white/20 bg-white/[0.01]"
        }`}
      >
        <Upload className="w-6 h-6 mx-auto mb-2 text-[#64748B]" />
        <p className="text-xs text-[#94A3B8] mb-2">
          Drag & drop files or{" "}
          <label className="text-sky-400 hover:text-sky-300 cursor-pointer font-medium">
            browse
            <input
              type="file"
              multiple
              accept=".pdf,.docx,.png,.jpg,.jpeg,.zip"
              className="hidden"
              disabled={uploading}
              onChange={(e) => e.target.files && processFiles(e.target.files)}
            />
          </label>
        </p>
        <p className="text-[10px] text-[#64748B]">PDF, DOCX, PNG, JPEG, ZIP — max 10MB each</p>
        {uploading && (
          <p className="text-xs text-sky-400 mt-2 animate-pulse">Uploading...</p>
        )}
      </div>

      {attachments.length > 0 && (
        <div className="space-y-2">
          {attachments.map((att, i) => (
            <div
              key={`${att.url}-${i}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5"
            >
              <FileIcon mimeType={att.mimeType} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[#F8FAFC] truncate">{att.filename}</p>
                <p className="text-[10px] text-[#64748B]">{formatSize(att.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => removeAttachment(i)}
                className="p-1 rounded-lg text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                aria-label={`Remove ${att.filename}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function getTotalAttachmentSize(attachments: ReplyAttachment[]): number {
  return attachments.reduce((sum, a) => sum + a.size, 0);
}
