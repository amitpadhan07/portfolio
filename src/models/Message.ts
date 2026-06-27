import mongoose, { Schema, Document, Model } from "mongoose";
import type { DeliveryStatus, MessageStatus } from "@/types/message";

export interface IReplyAttachment {
  filename: string;
  url: string;
  mimeType: string;
  size: number;
}

export interface IReplyTracking {
  openedAt?: Date;
  clickedAt?: Date;
  clickedLinks?: string[];
}

export interface IReplyHistoryItem {
  replyId: string;
  subject: string;
  body: string;
  sentBy: string;
  sentAt: Date;
  brevoMessageId?: string;
  deliveryStatus: DeliveryStatus;
  attachments: IReplyAttachment[];
  cc?: string[];
  bcc?: string[];
  tracking?: IReplyTracking;
}

export interface IReplyDraft {
  subject: string;
  body: string;
  cc: string;
  bcc: string;
  attachments: IReplyAttachment[];
  updatedAt: Date;
}

export interface IMessage extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  status: MessageStatus;
  replyHistory: IReplyHistoryItem[];
  draft?: IReplyDraft;
  createdAt: Date;
  updatedAt: Date;
}

const ReplyAttachmentSchema = new Schema<IReplyAttachment>(
  {
    filename: { type: String, required: true },
    url: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
  },
  { _id: false }
);

const ReplyTrackingSchema = new Schema<IReplyTracking>(
  {
    openedAt: { type: Date },
    clickedAt: { type: Date },
    clickedLinks: { type: [String], default: [] },
  },
  { _id: false }
);

const ReplyHistorySchema = new Schema<IReplyHistoryItem>(
  {
    replyId: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    sentBy: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
    brevoMessageId: { type: String },
    deliveryStatus: {
      type: String,
      enum: ["sent", "delivered", "opened", "clicked", "bounced", "failed"],
      default: "sent",
    },
    attachments: { type: [ReplyAttachmentSchema], default: [] },
    cc: { type: [String], default: [] },
    bcc: { type: [String], default: [] },
    tracking: { type: ReplyTrackingSchema },
  },
  { _id: false }
);

const ReplyDraftSchema = new Schema<IReplyDraft>(
  {
    subject: { type: String, default: "" },
    body: { type: String, default: "" },
    cc: { type: String, default: "" },
    bcc: { type: String, default: "" },
    attachments: { type: [ReplyAttachmentSchema], default: [] },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const MessageSchema: Schema<IMessage> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    subject: { type: String, default: "General Inquiry" },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["unread", "read", "replied", "archived"],
      default: "unread",
    },
    replyHistory: { type: [ReplyHistorySchema], default: [] },
    draft: { type: ReplyDraftSchema },
  },
  { timestamps: true }
);

MessageSchema.index({ status: 1, createdAt: -1 });
MessageSchema.index({ email: 1 });
MessageSchema.index({ subject: "text", message: "text", name: "text" });
MessageSchema.index({ "replyHistory.brevoMessageId": 1 });

export const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);
