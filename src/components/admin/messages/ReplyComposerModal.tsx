"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  X,
  Send,
  Save,
  Eye,
  ChevronDown,
  FileText,
} from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import AttachmentUpload, { getTotalAttachmentSize } from "./AttachmentUpload";
import EmailPreviewModal from "./EmailPreviewModal";
import SendConfirmationModal from "./SendConfirmationModal";
import { REPLY_TEMPLATES } from "@/constants/reply-templates";
import {
  replyToMessage,
  saveReplyDraft,
  previewReplyEmail,
} from "@/actions/messages";
import { uploadImageAction } from "@/actions/media";
import { useToast } from "./ToastNotifications";
import type { InboxMessage, ReplyAttachment } from "@/types/message";

interface ReplyComposerModalProps {
  open: boolean;
  message: InboxMessage;
  onClose: () => void;
  onSent: (updated: InboxMessage) => void;
}

function formatReplySubject(subject: string): string {
  const trimmed = subject.trim();
  if (trimmed.toLowerCase().startsWith("re:")) return trimmed;
  return `Re: ${trimmed}`;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ReplyComposerModal({
  open,
  message,
  onClose,
  onSent,
}: ReplyComposerModalProps) {
  const { addToast } = useToast();
  const [subject, setSubject] = useState(formatReplySubject(message.subject));
  const [body, setBody] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [attachments, setAttachments] = useState<ReplyAttachment[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewPlain, setPreviewPlain] = useState("");
  const [sending, setSending] = useState(false);
  const [draftSaving, setDraftSaving] = useState(false);
  const autoSaveRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastDraftRef = useRef("");

  useEffect(() => {
    if (!open) return;

    const draft = message.draft;
    setSubject(draft?.subject || formatReplySubject(message.subject));
    setBody(draft?.body || "");
    setCc(draft?.cc || "");
    setBcc(draft?.bcc || "");
    setAttachments(draft?.attachments || []);
    lastDraftRef.current = JSON.stringify({ subject: draft?.subject, body: draft?.body });
  }, [open, message]);

  const persistDraft = useCallback(async () => {
    const payload = JSON.stringify({ subject, body, cc, bcc, attachments });
    if (payload === lastDraftRef.current) return;
    if (!body.trim() && !subject.trim()) return;

    setDraftSaving(true);
    const result = await saveReplyDraft({
      messageId: message._id,
      subject,
      body,
      cc,
      bcc,
      attachments,
    });
    setDraftSaving(false);

    if (result.success) {
      lastDraftRef.current = payload;
    }
  }, [subject, body, cc, bcc, attachments, message._id]);

  useEffect(() => {
    if (!open) return;

    autoSaveRef.current = setInterval(() => {
      persistDraft();
    }, 20_000);

    return () => {
      if (autoSaveRef.current) clearInterval(autoSaveRef.current);
    };
  }, [open, persistDraft]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (!body.replace(/<[^>]+>/g, "").trim()) return;
        setConfirmOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, body]);

  const handleImageUpload = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "email_inline");
    const result = await uploadImageAction(formData);
    return result.success && result.url ? result.url : null;
  };

  const applyTemplate = (templateId: string) => {
    const template = REPLY_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;
    setSubject(formatReplySubject(message.subject));
    setBody(template.body);
    setShowTemplates(false);
  };

  const handleSaveDraft = async () => {
    setDraftSaving(true);
    const result = await saveReplyDraft({
      messageId: message._id,
      subject,
      body,
      cc,
      bcc,
      attachments,
    });
    setDraftSaving(false);

    if (result.success) {
      lastDraftRef.current = JSON.stringify({ subject, body, cc, bcc, attachments });
      addToast({ type: "success", title: "Draft saved" });
    } else {
      addToast({ type: "error", title: "Failed to save draft", message: result.error });
    }
  };

  const handlePreview = async () => {
    const result = await previewReplyEmail({
      messageId: message._id,
      subject,
      body,
      attachments,
    });
    if (result.success && result.data) {
      setPreviewHtml(result.data.html);
      setPreviewPlain(result.data.plainText);
      setPreviewOpen(true);
    } else {
      addToast({ type: "error", title: "Preview failed", message: result.error });
    }
  };

  const handleSendClick = () => {
    if (!body.replace(/<[^>]+>/g, "").trim()) {
      addToast({ type: "error", title: "Reply body is empty" });
      return;
    }
    setConfirmOpen(true);
  };

  const handleConfirmSend = async () => {
    setSending(true);
    const result = await replyToMessage({
      messageId: message._id,
      subject,
      body,
      cc,
      bcc,
      attachments,
    });
    setSending(false);
    setConfirmOpen(false);

    if (result.success && result.data) {
      addToast({ type: "success", title: "Reply sent", message: `Email sent to ${message.email}` });
      onSent(result.data);
      onClose();
    } else {
      addToast({
        type: "error",
        title: "Email failed",
        message: result.error,
        action: { label: "Retry", onClick: () => setConfirmOpen(true) },
      });
    }
  };

  if (!open) return null;

  const totalSize = getTotalAttachmentSize(attachments);

  return (
    <>
      <div
        className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-label="Reply composer"
      >
        <div className="bg-[#0B0F1E] border border-white/10 rounded-t-2xl sm:rounded-2xl w-full max-w-3xl max-h-[95vh] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/5">
            <div>
              <h3 className="text-sm font-bold text-[#F8FAFC]">Compose Reply</h3>
              {draftSaving && (
                <p className="text-[10px] text-sky-400 animate-pulse">Auto-saving...</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#64748B] hover:text-[#F8FAFC] hover:bg-white/5 cursor-pointer"
              aria-label="Close composer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* To */}
            <div>
              <label className="text-[10px] font-mono text-[#64748B] uppercase block mb-1">To</label>
              <input
                readOnly
                value={`${message.name} <${message.email}>`}
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-3 py-2 text-xs text-[#94A3B8] cursor-not-allowed"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="text-[10px] font-mono text-[#64748B] uppercase block mb-1">Subject</label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 focus:border-sky-400 rounded-xl px-3 py-2 text-xs text-[#F8FAFC] outline-none transition-colors"
              />
            </div>

            {/* CC / BCC toggle */}
            <button
              type="button"
              onClick={() => setShowCcBcc(!showCcBcc)}
              className="text-[10px] text-sky-400 hover:text-sky-300 cursor-pointer"
            >
              {showCcBcc ? "Hide CC/BCC" : "Show CC/BCC"}
            </button>

            {showCcBcc && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-[#64748B] uppercase block mb-1">CC</label>
                  <input
                    value={cc}
                    onChange={(e) => setCc(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full bg-white/[0.02] border border-white/10 focus:border-sky-400 rounded-xl px-3 py-2 text-xs text-[#F8FAFC] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-[#64748B] uppercase block mb-1">BCC</label>
                  <input
                    value={bcc}
                    onChange={(e) => setBcc(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full bg-white/[0.02] border border-white/10 focus:border-sky-400 rounded-xl px-3 py-2 text-xs text-[#F8FAFC] outline-none"
                  />
                </div>
              </div>
            )}

            {/* Templates */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowTemplates(!showTemplates)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                Quick Templates
                <ChevronDown className={`w-3 h-3 transition-transform ${showTemplates ? "rotate-180" : ""}`} />
              </button>
              {showTemplates && (
                <div className="absolute top-full left-0 mt-1 z-10 w-56 bg-[#0B0F1E] border border-white/10 rounded-xl shadow-xl overflow-hidden">
                  {REPLY_TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => applyTemplate(t.id)}
                      className="w-full text-left px-3 py-2 text-xs text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 cursor-pointer"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Editor */}
            <RichTextEditor
              content={body}
              onChange={setBody}
              onImageUpload={handleImageUpload}
            />

            {/* Attachments */}
            <AttachmentUpload attachments={attachments} onChange={setAttachments} />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 p-4 border-t border-white/5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={draftSaving}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-xs text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                Save Draft
              </button>
              <button
                type="button"
                onClick={handlePreview}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-xs text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                Preview
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#64748B] hidden sm:inline">Ctrl+Enter to send</span>
              <button
                type="button"
                onClick={handleSendClick}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-violet-500 text-white text-xs font-semibold hover:from-sky-500 hover:to-violet-600 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Send Reply
              </button>
            </div>
          </div>
        </div>
      </div>

      <EmailPreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        html={previewHtml}
        plainText={previewPlain}
      />

      <SendConfirmationModal
        open={confirmOpen}
        onClose={() => !sending && setConfirmOpen(false)}
        onConfirm={handleConfirmSend}
        recipient={`${message.name} <${message.email}>`}
        subject={subject}
        attachmentCount={attachments.length}
        estimatedSize={formatSize(totalSize)}
        sending={sending}
      />
    </>
  );
}
