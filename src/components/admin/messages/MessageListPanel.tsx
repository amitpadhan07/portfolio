"use client";

import React from "react";
import { Clock, Mail } from "lucide-react";
import type { InboxMessage } from "@/types/message";
import { formatRelativeTime, getStatusBadge } from "@/lib/inbox-utils";

interface MessageListPanelProps {
  messages: InboxMessage[];
  selectedId: string | null;
  onSelect: (msg: InboxMessage) => void;
  loading?: boolean;
}

function MessageSkeleton() {
  return (
    <div className="p-4 animate-pulse">
      <div className="flex justify-between mb-2">
        <div className="h-3 bg-white/5 rounded w-24" />
        <div className="h-3 bg-white/5 rounded w-12" />
      </div>
      <div className="h-3 bg-white/5 rounded w-full mb-2" />
      <div className="h-2 bg-white/5 rounded w-3/4" />
    </div>
  );
}

export default function MessageListPanel({
  messages,
  selectedId,
  onSelect,
  loading,
}: MessageListPanelProps) {
  if (loading) {
    return (
      <div className="divide-y divide-white/5">
        {Array.from({ length: 5 }).map((_, i) => (
          <MessageSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="py-16 text-center text-xs text-[#64748B] font-light space-y-2">
        <Mail className="w-8 h-8 mx-auto mb-2 text-[#475569]" />
        <p>No messages match your filters.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-white/5">
      {messages.map((msg) => {
        const isSelected = selectedId === msg._id;
        const isUnread = msg.status === "unread" || !msg.read;
        const badge = getStatusBadge(msg.status, msg.read);

        return (
          <div
            key={msg._id}
            onClick={() => onSelect(msg)}
            onKeyDown={(e) => e.key === "Enter" && onSelect(msg)}
            role="button"
            tabIndex={0}
            className={`p-4 transition-all cursor-pointer relative group ${
              isSelected
                ? "bg-sky-500/[0.06] border-l-2 border-l-sky-400"
                : "hover:bg-white/[0.03] border-l-2 border-l-transparent"
            }`}
          >
            {isUnread && (
              <span className="w-2 h-2 rounded-full bg-sky-400 absolute left-2 top-1/2 -translate-y-1/2 shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
            )}

            <div className={`min-w-0 space-y-1.5 ${isUnread ? "pl-3" : ""}`}>
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-xs truncate ${
                    isUnread ? "font-bold text-[#F8FAFC]" : "font-medium text-[#CBD5E1]"
                  }`}
                >
                  {msg.name}
                </span>
                <span className="text-[10px] text-[#64748B] flex items-center gap-1 flex-shrink-0">
                  <Clock className="w-2.5 h-2.5" />
                  {formatRelativeTime(msg.createdAt)}
                </span>
              </div>

              <p className="text-[10px] text-[#64748B] truncate">{msg.email}</p>

              <h4
                className={`text-xs truncate ${
                  isUnread ? "font-semibold text-sky-300" : "text-[#94A3B8]"
                }`}
              >
                {msg.subject}
              </h4>

              <p className="text-[11px] text-[#64748B] truncate font-light leading-relaxed">
                {msg.message}
              </p>

              <div className="flex items-center gap-2 pt-0.5">
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-semibold border ${badge.className}`}
                >
                  {badge.label}
                </span>
                {msg.replyHistory.length > 0 && (
                  <span className="text-[9px] text-[#64748B]">
                    {msg.replyHistory.length} repl{msg.replyHistory.length === 1 ? "y" : "ies"}
                  </span>
                )}
                {msg.draft && (
                  <span className="text-[9px] text-amber-400 font-medium">Draft</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
