"use client";

import React, { useState } from "react";
import { markMessageAsRead, deleteMessage } from "@/actions/messages";
import { Search, Mail, MailOpen, Trash2, Calendar, User, Clock, Inbox, Filter } from "lucide-react";

interface MessageItem {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface MessagesInboxProps {
  initialMessages: MessageItem[];
}

export default function MessagesInbox({ initialMessages }: MessagesInboxProps) {
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [selectedMessage, setSelectedMessage] = useState<MessageItem | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleSelect = async (msg: MessageItem) => {
    setSelectedMessage(msg);

    if (!msg.read) {
      setActionLoading(msg._id);
      const result = await markMessageAsRead(msg._id);
      if (result.success) {
        const updated = messages.map((m) =>
          m._id === msg._id ? { ...m, read: true } : m
        );
        setMessages(updated);
        // Sync selected message too
        setSelectedMessage({ ...msg, read: true });
      }
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to delete the message from "${name}"?`)) return;

    setActionLoading(id);
    const result = await deleteMessage(id);
    if (result.success) {
      setMessages(messages.filter((m) => m._id !== id));
      if (selectedMessage?._id === id) {
        setSelectedMessage(null);
      }
    } else {
      alert(result.error || "Failed to delete message");
    }
    setActionLoading(null);
  };

  // Filter messages
  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.name.toLowerCase().includes(search.toLowerCase()) ||
      msg.email.toLowerCase().includes(search.toLowerCase()) ||
      msg.subject.toLowerCase().includes(search.toLowerCase()) ||
      msg.message.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filter === "all" ? true : filter === "read" ? msg.read : !msg.read;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Messages Inbox</h1>
        <p className="text-xs text-[#94A3B8] font-light">
          Review and respond to messages submitted by visitors on your website contact form.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List Pane */}
        <div className="lg:col-span-5 space-y-4">
          {/* Controls Bar */}
          <div className="bg-white/[0.01] border border-white/5 p-3.5 rounded-2xl flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
              <input
                type="text"
                placeholder="Search inbox..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 focus:border-sky-400 text-xs py-2 pl-9 pr-3.5 rounded-xl text-[#F8FAFC] outline-none transition-all placeholder:text-[#64748B]"
              />
            </div>
            <div className="flex items-center gap-1.5 bg-white/[0.02] border border-white/10 px-2 rounded-xl">
              <Filter className="w-3 h-3 text-[#64748B]" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="bg-transparent border-none text-xs py-1.5 pr-2 pl-1 text-[#F8FAFC] outline-none cursor-pointer"
              >
                <option value="all" className="bg-[#0B0F1E]">All Messages</option>
                <option value="unread" className="bg-[#0B0F1E]">Unread</option>
                <option value="read" className="bg-[#0B0F1E]">Read</option>
              </select>
            </div>
          </div>

          {/* List Wrapper */}
          <div className="bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5 max-h-[600px] overflow-y-auto custom-scrollbar">
            {filteredMessages.length === 0 ? (
              <div className="py-16 text-center text-xs text-[#64748B] font-light space-y-2">
                <Inbox className="w-8 h-8 mx-auto mb-2 text-[#475569]" />
                <p>No messages found in your inbox.</p>
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isSelected = selectedMessage?._id === msg._id;
                return (
                  <div
                    key={msg._id}
                    onClick={() => handleSelect(msg)}
                    className={`p-4 transition-all cursor-pointer flex justify-between gap-3 relative ${
                      isSelected
                        ? "bg-sky-500/[0.04]"
                        : "hover:bg-white/[0.02] bg-transparent"
                    }`}
                  >
                    {!msg.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 absolute left-1.5 top-1/2 -translate-y-1/2" />
                    )}

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-[#F8FAFC] truncate">
                          {msg.name}
                        </span>
                        <span className="text-[10px] text-[#64748B] font-light flex items-center gap-1 flex-shrink-0">
                          <Clock className="w-2.5 h-2.5" />
                          {new Date(msg.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <h4 className={`text-xs truncate ${!msg.read ? "font-bold text-sky-300" : "text-[#94A3B8] font-normal"}`}>
                        {msg.subject}
                      </h4>
                      <p className="text-[11px] text-[#64748B] truncate font-light">
                        {msg.message}
                      </p>
                    </div>

                    <button
                      onClick={(e) => handleDelete(msg._id, msg.name, e)}
                      disabled={actionLoading === msg._id}
                      className="opacity-0 group-hover:opacity-100 lg:opacity-100 p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer self-center transition-all flex-shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Detail Pane */}
        <div className="lg:col-span-7 bg-white/[0.01] border border-white/5 rounded-2xl p-6 min-h-[450px] flex flex-col">
          {selectedMessage ? (
            <div className="flex-1 flex flex-col space-y-6">
              {/* Sender Details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#94A3B8]">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-[#F8FAFC]">{selectedMessage.name}</h3>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-xs text-sky-400 hover:underline"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-[#94A3B8] font-light">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                      selectedMessage.read
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : "bg-sky-500/10 border-sky-500/20 text-sky-400"
                    }`}
                  >
                    {selectedMessage.read ? "Read" : "Unread"}
                  </span>
                </div>
              </div>

              {/* Subject */}
              <div>
                <span className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider block mb-1">
                  Subject
                </span>
                <h2 className="text-sm font-semibold text-[#F8FAFC]">{selectedMessage.subject}</h2>
              </div>

              {/* Body */}
              <div className="flex-1 bg-white/[0.01] border border-white/5 p-4 rounded-xl text-xs text-[#E2E8F0] font-light whitespace-pre-wrap leading-relaxed">
                {selectedMessage.message}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-violet-500 hover:from-sky-500 hover:to-violet-600 text-white font-semibold text-xs transition-all shadow-lg shadow-sky-500/10 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" /> Reply by Email
                </a>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-[#64748B] font-light py-12">
              <MailOpen className="w-10 h-10 mb-3 text-[#475569]" />
              <p className="text-sm">Select a message from the list to display details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
