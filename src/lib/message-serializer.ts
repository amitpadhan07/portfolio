import type { IMessage } from "@/models/Message";
import type { InboxMessage, ReplyHistoryItem, ReplyDraft } from "@/types/message";

function serializeReplyHistory(
  history: IMessage["replyHistory"]
): ReplyHistoryItem[] {
  return (history || []).map((r) => ({
    replyId: r.replyId,
    subject: r.subject,
    body: r.body,
    sentBy: r.sentBy,
    sentAt: r.sentAt.toISOString(),
    brevoMessageId: r.brevoMessageId,
    deliveryStatus: r.deliveryStatus,
    attachments: (r.attachments || []).map((a) => ({
      filename: a.filename,
      url: a.url,
      mimeType: a.mimeType,
      size: a.size,
    })),
    cc: r.cc,
    bcc: r.bcc,
    tracking: r.tracking
      ? {
          openedAt: r.tracking.openedAt?.toISOString(),
          clickedAt: r.tracking.clickedAt?.toISOString(),
          clickedLinks: r.tracking.clickedLinks,
        }
      : undefined,
  }));
}

function serializeDraft(draft: IMessage["draft"]): ReplyDraft | undefined {
  if (!draft) return undefined;
  return {
    subject: draft.subject,
    body: draft.body,
    cc: draft.cc,
    bcc: draft.bcc,
    attachments: (draft.attachments || []).map((a) => ({
      filename: a.filename,
      url: a.url,
      mimeType: a.mimeType,
      size: a.size,
    })),
    updatedAt: draft.updatedAt.toISOString(),
  };
}

export function serializeMessage(doc: IMessage | Record<string, unknown>): InboxMessage {
  const m = doc as IMessage & { _id: { toString(): string }; createdAt: Date; updatedAt: Date };
  const read = Boolean(m.read);
  const replyHistory = serializeReplyHistory(m.replyHistory || []);
  let status = (m.status as InboxMessage["status"]) || (read ? "read" : "unread");
  if (!m.status && replyHistory.length > 0) {
    status = "replied";
  }

  return {
    _id: m._id.toString(),
    name: m.name,
    email: m.email,
    subject: m.subject || "General Inquiry",
    message: m.message,
    read,
    status,
    replyHistory,
    draft: serializeDraft(m.draft),
    createdAt: m.createdAt.toISOString(),
    updatedAt: m.updatedAt.toISOString(),
  };
}

export function serializeMessages(docs: (IMessage | Record<string, unknown>)[]): InboxMessage[] {
  return docs.map(serializeMessage);
}
