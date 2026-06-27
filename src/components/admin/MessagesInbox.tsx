"use client";

import React, { useCallback, useMemo, useState } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  Headphones,
} from "lucide-react";
import MessageListPanel from "./messages/MessageListPanel";
import MessageDetailPanel from "./messages/MessageDetailPanel";
import ReplyComposerModal from "./messages/ReplyComposerModal";
import { ToastProvider, useToast } from "./messages/ToastNotifications";
import {
  markMessageAsRead,
  markMessageAsUnread,
  archiveMessage,
  unarchiveMessage,
  deleteMessage,
} from "@/actions/messages";
import { filterMessages, sortMessages } from "@/lib/inbox-utils";
import type {
  InboxMessage,
  InboxFilter,
  InboxDateFilter,
  InboxSort,
} from "@/types/message";

interface MessagesInboxProps {
  initialMessages: InboxMessage[];
}

function MessagesInboxInner({ initialMessages }: MessagesInboxProps) {
  const { addToast } = useToast();
  const [messages, setMessages] = useState<InboxMessage[]>(initialMessages);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<InboxFilter>("all");
  const [dateFilter, setDateFilter] = useState<InboxDateFilter>("all");
  const [sort, setSort] = useState<InboxSort>("newest");
  const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const filteredSorted = useMemo(() => {
    const filtered = filterMessages(messages, search, filter, dateFilter);
    return sortMessages(filtered, sort);
  }, [messages, search, filter, dateFilter, sort]);

  const updateMessageInList = useCallback((updated: InboxMessage) => {
    setMessages((prev) => prev.map((m) => (m._id === updated._id ? updated : m)));
    setSelectedMessage(updated);
  }, []);

  const handleSelect = useCallback(
    async (msg: InboxMessage) => {
      setSelectedMessage(msg);

      if (msg.status === "unread" || !msg.read) {
        setActionLoading(true);
        const result = await markMessageAsRead(msg._id);
        if (result.success && result.data) {
          updateMessageInList(result.data);
        }
        setActionLoading(false);
      }
    },
    [updateMessageInList]
  );

  const handleMarkRead = async () => {
    if (!selectedMessage) return;
    setActionLoading(true);
    const result = await markMessageAsRead(selectedMessage._id);
    if (result.success && result.data) {
      updateMessageInList(result.data);
      addToast({ type: "success", title: "Marked as read" });
    }
    setActionLoading(false);
  };

  const handleMarkUnread = async () => {
    if (!selectedMessage) return;
    setActionLoading(true);
    const result = await markMessageAsUnread(selectedMessage._id);
    if (result.success && result.data) {
      updateMessageInList(result.data);
      addToast({ type: "info", title: "Marked as unread" });
    }
    setActionLoading(false);
  };

  const handleArchive = async () => {
    if (!selectedMessage) return;
    setActionLoading(true);
    const result = await archiveMessage(selectedMessage._id);
    if (result.success && result.data) {
      updateMessageInList(result.data);
      addToast({ type: "success", title: "Message archived" });
    }
    setActionLoading(false);
  };

  const handleUnarchive = async () => {
    if (!selectedMessage) return;
    setActionLoading(true);
    const result = await unarchiveMessage(selectedMessage._id);
    if (result.success && result.data) {
      updateMessageInList(result.data);
      addToast({ type: "success", title: "Message restored" });
    }
    setActionLoading(false);
  };

  const handleDelete = async () => {
    if (!selectedMessage) return;
    if (!confirm(`Delete message from "${selectedMessage.name}"?`)) return;

    setActionLoading(true);
    const result = await deleteMessage(selectedMessage._id);
    if (result.success) {
      setMessages((prev) => prev.filter((m) => m._id !== selectedMessage._id));
      setSelectedMessage(null);
      addToast({ type: "success", title: "Message deleted" });
    } else {
      addToast({ type: "error", title: "Delete failed", message: result.error });
    }
    setActionLoading(false);
  };

  const unreadCount = messages.filter((m) => m.status === "unread" || !m.read).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Headphones className="w-5 h-5 text-sky-400" />
            <h1 className="text-xl font-bold tracking-tight text-[#F8FAFC]">Support Inbox</h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 text-[10px] font-bold border border-sky-500/30">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-xs text-[#94A3B8] font-light">
            Professional customer support — reply, track, and manage conversations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Panel */}
        <div className="lg:col-span-5 space-y-3">
          {/* Search & Controls */}
          <div className="bg-white/[0.01] border border-white/5 p-3.5 rounded-2xl space-y-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
              <input
                type="text"
                placeholder="Search name, email, subject, message, replies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 focus:border-sky-400 text-xs py-2 pl-9 pr-3.5 rounded-xl text-[#F8FAFC] outline-none transition-all placeholder:text-[#64748B]"
                aria-label="Search messages"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <SelectControl
                icon={<Filter className="w-3 h-3" />}
                value={filter}
                onChange={(v) => setFilter(v as InboxFilter)}
                options={[
                  { value: "all", label: "All" },
                  { value: "unread", label: "Unread" },
                  { value: "read", label: "Read" },
                  { value: "replied", label: "Replied" },
                  { value: "archived", label: "Archived" },
                ]}
              />
              <SelectControl
                value={dateFilter}
                onChange={(v) => setDateFilter(v as InboxDateFilter)}
                options={[
                  { value: "all", label: "All Time" },
                  { value: "today", label: "Today" },
                  { value: "week", label: "This Week" },
                  { value: "month", label: "This Month" },
                ]}
              />
              <SelectControl
                icon={<ArrowUpDown className="w-3 h-3" />}
                value={sort}
                onChange={(v) => setSort(v as InboxSort)}
                options={[
                  { value: "newest", label: "Newest" },
                  { value: "oldest", label: "Oldest" },
                  { value: "recently_replied", label: "Recently Replied" },
                  { value: "unread_first", label: "Unread First" },
                ]}
              />
            </div>
          </div>

          {/* Message List */}
          <div className="bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar">
            <MessageListPanel
              messages={filteredSorted}
              selectedId={selectedMessage?._id || null}
              onSelect={handleSelect}
            />
          </div>

          <p className="text-[10px] text-[#64748B] text-center">
            {filteredSorted.length} of {messages.length} messages
          </p>
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-7 bg-white/[0.01] border border-white/5 rounded-2xl p-5 sm:p-6 min-h-[500px] max-h-[calc(100vh-180px)] flex flex-col">
          <MessageDetailPanel
            message={selectedMessage}
            actionLoading={actionLoading}
            onMarkRead={handleMarkRead}
            onMarkUnread={handleMarkUnread}
            onArchive={handleArchive}
            onUnarchive={handleUnarchive}
            onDelete={handleDelete}
            onReply={() => setComposerOpen(true)}
          />
        </div>
      </div>

      {selectedMessage && (
        <ReplyComposerModal
          open={composerOpen}
          message={selectedMessage}
          onClose={() => setComposerOpen(false)}
          onSent={(updated) => {
            updateMessageInList(updated);
            setMessages((prev) =>
              prev.map((m) => (m._id === updated._id ? updated : m))
            );
          }}
        />
      )}
    </div>
  );
}

function SelectControl({
  icon,
  value,
  onChange,
  options,
}: {
  icon?: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex items-center gap-1 bg-white/[0.02] border border-white/10 px-2 rounded-xl">
      {icon && <span className="text-[#64748B]">{icon}</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent border-none text-[11px] py-1.5 pr-1 pl-0.5 text-[#F8FAFC] outline-none cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#0B0F1E]">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function MessagesInbox(props: MessagesInboxProps) {
  return (
    <ToastProvider>
      <MessagesInboxInner {...props} />
    </ToastProvider>
  );
}
