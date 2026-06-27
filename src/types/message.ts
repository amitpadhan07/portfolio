export type MessageStatus = "unread" | "read" | "replied" | "archived";

export type DeliveryStatus =
  | "sent"
  | "delivered"
  | "opened"
  | "clicked"
  | "bounced"
  | "failed";

export interface ReplyAttachment {
  filename: string;
  url: string;
  mimeType: string;
  size: number;
}

export interface ReplyTracking {
  openedAt?: string;
  clickedAt?: string;
  clickedLinks?: string[];
}

export interface ReplyHistoryItem {
  replyId: string;
  subject: string;
  body: string;
  sentBy: string;
  sentAt: string;
  brevoMessageId?: string;
  deliveryStatus: DeliveryStatus;
  attachments: ReplyAttachment[];
  cc?: string[];
  bcc?: string[];
  tracking?: ReplyTracking;
}

export interface ReplyDraft {
  subject: string;
  body: string;
  cc: string;
  bcc: string;
  attachments: ReplyAttachment[];
  updatedAt: string;
}

export interface InboxMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  status: MessageStatus;
  replyHistory: ReplyHistoryItem[];
  draft?: ReplyDraft;
  createdAt: string;
  updatedAt: string;
}

export type InboxFilter =
  | "all"
  | "unread"
  | "read"
  | "replied"
  | "archived";

export type InboxDateFilter = "all" | "today" | "week" | "month";

export type InboxSort = "newest" | "oldest" | "recently_replied" | "unread_first";

export interface ReplyToMessageInput {
  messageId: string;
  subject: string;
  body: string;
  cc?: string;
  bcc?: string;
  attachments?: ReplyAttachment[];
}

export interface SaveDraftInput {
  messageId: string;
  subject: string;
  body: string;
  cc?: string;
  bcc?: string;
  attachments?: ReplyAttachment[];
}

export interface ActionResult<T = undefined> {
  success: boolean;
  error?: string;
  data?: T;
}
