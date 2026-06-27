"use client";

import React from "react";
import {
  ArrowDown,
  Mail,
  Send,
  CheckCircle2,
  Eye,
  MousePointerClick,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import type { InboxMessage, ReplyHistoryItem } from "@/types/message";
import { sanitizeHtml } from "@/lib/sanitize";

interface ConversationTimelineProps {
  message: InboxMessage;
}

const STATUS_CONFIG: Record<
  ReplyHistoryItem["deliveryStatus"],
  { label: string; color: string; icon: React.ReactNode }
> = {
  sent: { label: "Sent", color: "text-sky-400 bg-sky-500/10 border-sky-500/20", icon: <Send className="w-3 h-3" /> },
  delivered: { label: "Delivered", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", icon: <CheckCircle2 className="w-3 h-3" /> },
  opened: { label: "Opened", color: "text-violet-400 bg-violet-500/10 border-violet-500/20", icon: <Eye className="w-3 h-3" /> },
  clicked: { label: "Clicked", color: "text-amber-400 bg-amber-500/10 border-amber-500/20", icon: <MousePointerClick className="w-3 h-3" /> },
  bounced: { label: "Bounced", color: "text-orange-400 bg-orange-500/10 border-orange-500/20", icon: <AlertTriangle className="w-3 h-3" /> },
  failed: { label: "Failed", color: "text-rose-400 bg-rose-500/10 border-rose-500/20", icon: <XCircle className="w-3 h-3" /> },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function ConversationTimeline({ message }: ConversationTimelineProps) {
  const items: { type: "incoming" | "reply"; data: InboxMessage | ReplyHistoryItem; date: string }[] = [
    { type: "incoming", data: message, date: message.createdAt },
    ...message.replyHistory.map((r) => ({ type: "reply" as const, data: r, date: r.sentAt })),
  ];

  return (
    <div className="space-y-0">
      <h4 className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider mb-4">
        Conversation Timeline
      </h4>
      {items.map((item, index) => (
        <div key={index} className="relative">
          {index > 0 && (
            <div className="flex justify-center py-2">
              <ArrowDown className="w-4 h-4 text-[#475569]" />
            </div>
          )}

          {item.type === "incoming" ? (
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-sky-500/10">
                  <Mail className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#F8FAFC]">
                    Incoming — {message.name}
                  </p>
                  <p className="text-[10px] text-[#64748B]">{formatDate(message.createdAt)}</p>
                </div>
              </div>
              <p className="text-[10px] font-mono text-[#64748B] uppercase mb-1">Subject</p>
              <p className="text-sm font-medium text-[#E2E8F0] mb-3">{message.subject}</p>
              <div className="text-xs text-[#CBD5E1] whitespace-pre-wrap leading-relaxed bg-white/[0.01] rounded-lg p-3 border border-white/5">
                {message.message}
              </div>
            </div>
          ) : (
            <ReplyBubble reply={item.data as ReplyHistoryItem} />
          )}
        </div>
      ))}
    </div>
  );
}

function ReplyBubble({ reply }: { reply: ReplyHistoryItem }) {
  const status = STATUS_CONFIG[reply.deliveryStatus];

  return (
    <div className="rounded-xl border border-violet-500/10 bg-violet-500/[0.03] p-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-violet-500/10">
            <Send className="w-3.5 h-3.5 text-violet-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#F8FAFC]">Admin Reply</p>
            <p className="text-[10px] text-[#64748B]">{formatDate(reply.sentAt)}</p>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${status.color}`}
        >
          {status.icon}
          {status.label}
        </span>
      </div>
      <p className="text-[10px] font-mono text-[#64748B] uppercase mb-1">Subject</p>
      <p className="text-sm font-medium text-[#E2E8F0] mb-3">{reply.subject}</p>
      <div
        className="text-xs text-[#CBD5E1] leading-relaxed bg-white/[0.01] rounded-lg p-3 border border-white/5 prose prose-invert prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(reply.body) }}
      />
      {reply.attachments.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {reply.attachments.map((att, i) => (
            <a
              key={i}
              href={att.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-sky-400 hover:bg-white/10"
            >
              📎 {att.filename}
            </a>
          ))}
        </div>
      )}
      {reply.tracking?.openedAt && (
        <p className="text-[10px] text-[#64748B] mt-2">
          Opened: {formatDate(reply.tracking.openedAt)}
        </p>
      )}
    </div>
  );
}
