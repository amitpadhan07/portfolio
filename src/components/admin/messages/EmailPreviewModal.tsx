"use client";

import React, { useState } from "react";
import { X, Monitor, Smartphone, Code, FileText } from "lucide-react";

interface EmailPreviewModalProps {
  open: boolean;
  onClose: () => void;
  html: string;
  plainText: string;
}

type PreviewTab = "desktop" | "mobile" | "html" | "plain";

export default function EmailPreviewModal({
  open,
  onClose,
  html,
  plainText,
}: EmailPreviewModalProps) {
  const [tab, setTab] = useState<PreviewTab>("desktop");

  if (!open) return null;

  const tabs: { id: PreviewTab; label: string; icon: React.ReactNode }[] = [
    { id: "desktop", label: "Desktop", icon: <Monitor className="w-3.5 h-3.5" /> },
    { id: "mobile", label: "Mobile", icon: <Smartphone className="w-3.5 h-3.5" /> },
    { id: "html", label: "Raw HTML", icon: <Code className="w-3.5 h-3.5" /> },
    { id: "plain", label: "Plain Text", icon: <FileText className="w-3.5 h-3.5" /> },
  ];

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Email preview"
    >
      <div
        className="bg-[#0B0F1E] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <h3 className="text-sm font-bold text-[#F8FAFC]">Email Preview</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#F8FAFC] hover:bg-white/5 cursor-pointer"
            aria-label="Close preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-1 p-3 border-b border-white/5">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                tab === t.id
                  ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                  : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-auto p-4">
          {tab === "desktop" && (
            <div className="mx-auto" style={{ maxWidth: 600 }}>
              <iframe
                srcDoc={html}
                title="Desktop email preview"
                className="w-full min-h-[500px] rounded-xl border border-white/10 bg-white"
                sandbox=""
              />
            </div>
          )}
          {tab === "mobile" && (
            <div className="mx-auto" style={{ maxWidth: 375 }}>
              <iframe
                srcDoc={html}
                title="Mobile email preview"
                className="w-full min-h-[600px] rounded-xl border border-white/10 bg-white"
                sandbox=""
              />
            </div>
          )}
          {tab === "html" && (
            <pre className="text-[11px] text-[#94A3B8] font-mono whitespace-pre-wrap break-all bg-black/30 rounded-xl p-4 border border-white/5 max-h-[60vh] overflow-auto">
              {html}
            </pre>
          )}
          {tab === "plain" && (
            <pre className="text-xs text-[#CBD5E1] whitespace-pre-wrap bg-black/30 rounded-xl p-4 border border-white/5 max-h-[60vh] overflow-auto">
              {plainText}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
