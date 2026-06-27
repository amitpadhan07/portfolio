"use client";

import React from "react";
import {
  User,
  Calendar,
  Mail,
  MailOpen,
  Archive,
  ArchiveRestore,
  Trash2,
  Reply,
} from "lucide-react";
import ConversationTimeline from "./ConversationTimeline";
import type { InboxMessage } from "@/types/message";
import { getStatusBadge } from "@/lib/inbox-utils";

interface MessageDetailPanelProps {
  message: InboxMessage | null;
  actionLoading: boolean;
  onMarkRead: () => void;
  onMarkUnread: () => void;
  onArchive: () => void;
  onUnarchive: () => void;
  onDelete: () => void;
  onReply: () => void;
}

export default function MessageDetailPanel({
  message,
  actionLoading,
  onMarkRead,
  onMarkUnread,
  onArchive,
  onUnarchive,
  onDelete,
  onReply,
}: MessageDetailPanelProps) {
  if (!message) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center text-[#64748B] font-light py-12">
        <Mail className="w-10 h-10 mb-3 text-[#475569]" />
        <p className="text-sm">Select a message to view details</p>
        <p className="text-xs mt-1 text-[#475569]">Use filters and search to find conversations</p>
      </div>
    );
  }

  const badge = getStatusBadge(message.status, message.read);
  const isUnread = message.status === "unread" || !message.read;
  const isArchived = message.status === "archived";

  return (
    <div className="flex-1 flex flex-col space-y-5 min-h-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-400/10 to-violet-500/10 border border-white/10 flex items-center justify-center">
            <User className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-[#F8FAFC]">{message.name}</h3>
            <a
              href={`mailto:${message.email}`}
              className="text-xs text-sky-400 hover:underline"
            >
              {message.email}
            </a>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-[10px] text-[#64748B]">
            <Calendar className="w-3 h-3" />
            {new Date(message.createdAt).toLocaleString()}
          </span>
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${badge.className}`}
          >
            {badge.label}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2">
        {isUnread ? (
          <ActionButton
            icon={<MailOpen className="w-3.5 h-3.5" />}
            label="Mark Read"
            onClick={onMarkRead}
            disabled={actionLoading}
          />
        ) : (
          <ActionButton
            icon={<Mail className="w-3.5 h-3.5" />}
            label="Mark Unread"
            onClick={onMarkUnread}
            disabled={actionLoading}
          />
        )}
        {isArchived ? (
          <ActionButton
            icon={<ArchiveRestore className="w-3.5 h-3.5" />}
            label="Unarchive"
            onClick={onUnarchive}
            disabled={actionLoading}
          />
        ) : (
          <ActionButton
            icon={<Archive className="w-3.5 h-3.5" />}
            label="Archive"
            onClick={onArchive}
            disabled={actionLoading}
          />
        )}
        <ActionButton
          icon={<Trash2 className="w-3.5 h-3.5" />}
          label="Delete"
          onClick={onDelete}
          disabled={actionLoading}
          variant="danger"
        />
        <button
          onClick={onReply}
          className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-violet-500 hover:from-sky-500 hover:to-violet-600 text-white font-semibold text-xs transition-all shadow-lg shadow-sky-500/10 cursor-pointer"
        >
          <Reply className="w-3.5 h-3.5" />
          Reply
          {message.draft && (
            <span className="ml-1 px-1.5 py-0.5 rounded bg-white/20 text-[9px]">Draft</span>
          )}
        </button>
      </div>

      {/* Conversation */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
        <ConversationTimeline message={message} />
      </div>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  disabled,
  variant = "default",
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "danger";
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer disabled:opacity-50 ${
        variant === "danger"
          ? "border-rose-500/20 text-rose-400 hover:bg-rose-500/10"
          : "border-white/10 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
