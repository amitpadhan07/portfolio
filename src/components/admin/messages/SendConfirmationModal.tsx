"use client";

import React from "react";
import { Send, X, Paperclip } from "lucide-react";

interface SendConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  recipient: string;
  subject: string;
  attachmentCount: number;
  estimatedSize: string;
  sending: boolean;
}

export default function SendConfirmationModal({
  open,
  onClose,
  onConfirm,
  recipient,
  subject,
  attachmentCount,
  estimatedSize,
  sending,
}: SendConfirmationModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && !sending && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Confirm send email"
    >
      <div
        className="bg-[#0B0F1E] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-400/20 to-violet-500/20 border border-sky-500/20 flex items-center justify-center mx-auto mb-4">
            <Send className="w-6 h-6 text-sky-400" />
          </div>
          <h3 className="text-lg font-bold text-[#F8FAFC] mb-1">Send Email?</h3>
          <p className="text-xs text-[#94A3B8] mb-6">
            This will send a professional HTML email to the recipient.
          </p>

          <div className="text-left space-y-3 mb-6 bg-white/[0.02] rounded-xl p-4 border border-white/5">
            <div>
              <p className="text-[10px] font-mono text-[#64748B] uppercase">Recipient</p>
              <p className="text-sm text-[#F8FAFC] truncate">{recipient}</p>
            </div>
            <div>
              <p className="text-[10px] font-mono text-[#64748B] uppercase">Subject</p>
              <p className="text-sm text-[#F8FAFC] truncate">{subject}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
                <Paperclip className="w-3.5 h-3.5" />
                {attachmentCount} attachment{attachmentCount !== 1 ? "s" : ""}
              </div>
              <span className="text-[10px] text-[#64748B] font-mono">{estimatedSize}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={sending}
              className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-sm text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={sending}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-violet-500 text-white text-sm font-semibold hover:from-sky-500 hover:to-violet-600 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {sending ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
