import type {
  InboxMessage,
  InboxFilter,
  InboxDateFilter,
  InboxSort,
} from "@/types/message";

export function filterMessages(
  messages: InboxMessage[],
  search: string,
  filter: InboxFilter,
  dateFilter: InboxDateFilter
): InboxMessage[] {
  const q = search.toLowerCase().trim();

  return messages.filter((msg) => {
    const matchesSearch =
      !q ||
      msg.name.toLowerCase().includes(q) ||
      msg.email.toLowerCase().includes(q) ||
      msg.subject.toLowerCase().includes(q) ||
      msg.message.toLowerCase().includes(q) ||
      msg.replyHistory.some(
        (r) =>
          r.subject.toLowerCase().includes(q) ||
          r.body.toLowerCase().includes(q)
      );

    const matchesFilter =
      filter === "all"
        ? msg.status !== "archived"
        : filter === "unread"
          ? msg.status === "unread" || !msg.read
          : filter === "read"
            ? msg.status === "read"
            : filter === "replied"
              ? msg.status === "replied" || msg.replyHistory.length > 0
              : filter === "archived"
                ? msg.status === "archived"
                : true;

    const matchesDate = matchesDateFilter(msg.createdAt, dateFilter);

    return matchesSearch && matchesFilter && matchesDate;
  });
}

function matchesDateFilter(createdAt: string, dateFilter: InboxDateFilter): boolean {
  if (dateFilter === "all") return true;

  const date = new Date(createdAt);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (dateFilter === "today") {
    return date >= startOfToday;
  }

  if (dateFilter === "week") {
    const weekAgo = new Date(startOfToday);
    weekAgo.setDate(weekAgo.getDate() - 7);
    return date >= weekAgo;
  }

  if (dateFilter === "month") {
    const monthAgo = new Date(startOfToday);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return date >= monthAgo;
  }

  return true;
}

export function sortMessages(messages: InboxMessage[], sort: InboxSort): InboxMessage[] {
  const sorted = [...messages];

  switch (sort) {
    case "newest":
      return sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "oldest":
      return sorted.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    case "recently_replied":
      return sorted.sort((a, b) => {
        const aReply = a.replyHistory[a.replyHistory.length - 1]?.sentAt || a.createdAt;
        const bReply = b.replyHistory[b.replyHistory.length - 1]?.sentAt || b.createdAt;
        return new Date(bReply).getTime() - new Date(aReply).getTime();
      });
    case "unread_first":
      return sorted.sort((a, b) => {
        const aUnread = a.status === "unread" || !a.read ? 0 : 1;
        const bUnread = b.status === "unread" || !b.read ? 0 : 1;
        if (aUnread !== bUnread) return aUnread - bUnread;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    default:
      return sorted;
  }
}

export function getStatusBadge(status: InboxMessage["status"], read: boolean) {
  if (status === "archived") return { label: "Archived", className: "bg-slate-500/10 border-slate-500/20 text-slate-400" };
  if (status === "replied") return { label: "Replied", className: "bg-violet-500/10 border-violet-500/20 text-violet-400" };
  if (status === "unread" || !read) return { label: "Unread", className: "bg-sky-500/10 border-sky-500/20 text-sky-400" };
  return { label: "Read", className: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" };
}

export function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
