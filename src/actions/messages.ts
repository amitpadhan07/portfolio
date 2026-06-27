"use server";

import { getServerSession } from "next-auth/next";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { sendReplyMail } from "@/lib/brevo";
import { serializeMessage, serializeMessages } from "@/lib/message-serializer";
import { checkRateLimit } from "@/lib/rate-limit";
import { sanitizeHtml } from "@/lib/sanitize";
import { buildReplyEmailHtml, buildReplyEmailPlainText } from "@/lib/email-template";
import { ActivityLog } from "@/models/ActivityLog";
import { ContactInfo } from "@/models/ContactInfo";
import { Message } from "@/models/Message";
import { Profile } from "@/models/Profile";
import { SocialLink } from "@/models/SocialLink";
import {
  ArchiveMessageSchema,
  ReplyToMessageSchema,
  SaveDraftSchema,
} from "@/validators/schemas";
import type {
  ActionResult,
  InboxMessage,
  ReplyAttachment,
  ReplyToMessageInput,
  SaveDraftInput,
} from "@/types/message";

const MESSAGES_PATH = "/admin/dashboard/messages";

async function requireAdmin(): Promise<{ email: string } | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  return { email: session.user.email };
}

async function getEmailSignature() {
  const [profile, contact, socialLinks] = await Promise.all([
    Profile.findOne().lean(),
    ContactInfo.findOne().lean(),
    SocialLink.find({ active: true }).sort({ order: 1 }).lean(),
  ]);

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const findSocial = (platform: string) =>
    socialLinks.find((s) => s.platform.toLowerCase().includes(platform))?.url || "";

  return {
    name: profile?.name || "Amit Padhan",
    title: profile?.title || "AI Full Stack Developer",
    portfolioUrl: baseUrl,
    githubUrl: findSocial("github"),
    linkedinUrl: findSocial("linkedin"),
    email: contact?.email || "padhanamit072006@gmail.com",
    phone: contact?.phone || "",
  };
}

function formatReplySubject(subject: string): string {
  const trimmed = subject.trim();
  if (trimmed.toLowerCase().startsWith("re:")) return trimmed;
  return `Re: ${trimmed}`;
}

export async function markMessageAsRead(id: string): Promise<ActionResult<InboxMessage>> {
  try {
    const admin = await requireAdmin();
    if (!admin) return { success: false, error: "Unauthorized access" };

    await connectToDatabase();

    const updatedMsg = await Message.findByIdAndUpdate(
      id,
      { $set: { read: true, status: "read" } },
      { new: true }
    );

    if (!updatedMsg) return { success: false, error: "Message not found" };

    await ActivityLog.create({
      action: `Marked message from "${updatedMsg.name}" as read`,
      adminUser: admin.email,
      ipAddress: "127.0.0.1",
    });

    revalidatePath(MESSAGES_PATH);
    revalidatePath("/admin/dashboard");

    return { success: true, data: serializeMessage(updatedMsg) };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Mark message read error:", msg);
    return { success: false, error: msg };
  }
}

export async function markMessageAsUnread(id: string): Promise<ActionResult<InboxMessage>> {
  try {
    const admin = await requireAdmin();
    if (!admin) return { success: false, error: "Unauthorized access" };

    await connectToDatabase();

    const updatedMsg = await Message.findByIdAndUpdate(
      id,
      { $set: { read: false, status: "unread" } },
      { new: true }
    );

    if (!updatedMsg) return { success: false, error: "Message not found" };

    revalidatePath(MESSAGES_PATH);
    return { success: true, data: serializeMessage(updatedMsg) };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg };
  }
}

export async function archiveMessage(id: string): Promise<ActionResult<InboxMessage>> {
  try {
    const admin = await requireAdmin();
    if (!admin) return { success: false, error: "Unauthorized access" };

    const parsed = ArchiveMessageSchema.safeParse({ messageId: id });
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

    await connectToDatabase();

    const updatedMsg = await Message.findByIdAndUpdate(
      id,
      { $set: { status: "archived", read: true } },
      { new: true }
    );

    if (!updatedMsg) return { success: false, error: "Message not found" };

    await ActivityLog.create({
      action: `Archived message from "${updatedMsg.name}"`,
      adminUser: admin.email,
      ipAddress: "127.0.0.1",
    });

    revalidatePath(MESSAGES_PATH);
    return { success: true, data: serializeMessage(updatedMsg) };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg };
  }
}

export async function unarchiveMessage(id: string): Promise<ActionResult<InboxMessage>> {
  try {
    const admin = await requireAdmin();
    if (!admin) return { success: false, error: "Unauthorized access" };

    await connectToDatabase();

    const existing = await Message.findById(id);
    if (!existing) return { success: false, error: "Message not found" };

    const newStatus =
      (existing.replyHistory?.length || 0) > 0
        ? "replied"
        : existing.read
          ? "read"
          : "unread";

    const updatedMsg = await Message.findByIdAndUpdate(
      id,
      { $set: { status: newStatus } },
      { new: true }
    );

    revalidatePath(MESSAGES_PATH);
    return { success: true, data: serializeMessage(updatedMsg!) };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg };
  }
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  try {
    const admin = await requireAdmin();
    if (!admin) return { success: false, error: "Unauthorized access" };

    await connectToDatabase();

    const existingMsg = await Message.findById(id);
    if (!existingMsg) return { success: false, error: "Message not found" };

    await Message.findByIdAndDelete(id);

    await ActivityLog.create({
      action: `Deleted inbox message sent by: "${existingMsg.name}"`,
      adminUser: admin.email,
      ipAddress: "127.0.0.1",
    });

    revalidatePath(MESSAGES_PATH);
    revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Message deletion error:", msg);
    return { success: false, error: msg };
  }
}

export async function saveReplyDraft(
  input: SaveDraftInput
): Promise<ActionResult<InboxMessage>> {
  try {
    const admin = await requireAdmin();
    if (!admin) return { success: false, error: "Unauthorized access" };

    const parsed = SaveDraftSchema.safeParse(input);
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

    await connectToDatabase();

    const updatedMsg = await Message.findByIdAndUpdate(
      input.messageId,
      {
        $set: {
          draft: {
            subject: parsed.data.subject,
            body: sanitizeHtml(parsed.data.body),
            cc: parsed.data.cc || "",
            bcc: parsed.data.bcc || "",
            attachments: parsed.data.attachments || [],
            updatedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!updatedMsg) return { success: false, error: "Message not found" };

    return { success: true, data: serializeMessage(updatedMsg) };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg };
  }
}

export async function clearReplyDraft(messageId: string): Promise<ActionResult<InboxMessage>> {
  try {
    const admin = await requireAdmin();
    if (!admin) return { success: false, error: "Unauthorized access" };

    await connectToDatabase();

    const updatedMsg = await Message.findByIdAndUpdate(
      messageId,
      { $unset: { draft: 1 } },
      { new: true }
    );

    if (!updatedMsg) return { success: false, error: "Message not found" };

    return { success: true, data: serializeMessage(updatedMsg) };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg };
  }
}

export async function replyToMessage(
  input: ReplyToMessageInput
): Promise<ActionResult<InboxMessage>> {
  try {
    const admin = await requireAdmin();
    if (!admin) return { success: false, error: "Unauthorized access" };

    const rateCheck = checkRateLimit(`reply:${admin.email}`, 10, 60_000);
    if (!rateCheck.allowed) {
      return {
        success: false,
        error: `Rate limit exceeded. Try again in ${Math.ceil(rateCheck.retryAfterMs / 1000)}s`,
      };
    }

    const parsed = ReplyToMessageSchema.safeParse(input);
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

    await connectToDatabase();

    const existingMsg = await Message.findById(input.messageId);
    if (!existingMsg) return { success: false, error: "Message not found" };

    const sanitizedBody = sanitizeHtml(parsed.data.body);
    if (!sanitizedBody.replace(/<[^>]+>/g, "").trim()) {
      return { success: false, error: "Reply body cannot be empty" };
    }

    const subject = formatReplySubject(parsed.data.subject);
    const signature = await getEmailSignature();
    const attachments = (parsed.data.attachments || []) as ReplyAttachment[];

    let brevoMessageId = "";
    let deliveryStatus: "sent" | "failed" = "sent";

    try {
      const result = await sendReplyMail({
        recipientEmail: existingMsg.email,
        recipientName: existingMsg.name,
        subject,
        replyHtml: sanitizedBody,
        originalSubject: existingMsg.subject,
        originalMessage: existingMsg.message,
        originalDate: existingMsg.createdAt.toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
        signature,
        cc: parsed.data.cc,
        bcc: parsed.data.bcc,
        attachments: attachments.map((a) => ({ filename: a.filename, url: a.url })),
      });
      brevoMessageId = result.messageId;
    } catch (sendError) {
      deliveryStatus = "failed";
      const errMsg = sendError instanceof Error ? sendError.message : "Email send failed";
      console.error("[replyToMessage] Brevo send failed:", errMsg);
      return { success: false, error: errMsg };
    }

    const replyEntry = {
      replyId: nanoid(12),
      subject,
      body: sanitizedBody,
      sentBy: admin.email,
      sentAt: new Date(),
      brevoMessageId,
      deliveryStatus,
      attachments,
      cc: parsed.data.cc
        ? parsed.data.cc.split(",").map((e) => e.trim()).filter(Boolean)
        : [],
      bcc: parsed.data.bcc
        ? parsed.data.bcc.split(",").map((e) => e.trim()).filter(Boolean)
        : [],
    };

    const updatedMsg = await Message.findByIdAndUpdate(
      input.messageId,
      {
        $push: { replyHistory: replyEntry },
        $set: { read: true, status: "replied" },
        $unset: { draft: 1 },
      },
      { new: true }
    );

    await ActivityLog.create({
      action: `Sent reply to "${existingMsg.name}" (${existingMsg.email})`,
      adminUser: admin.email,
      ipAddress: "127.0.0.1",
    });

    revalidatePath(MESSAGES_PATH);
    revalidatePath("/admin/dashboard");

    return { success: true, data: serializeMessage(updatedMsg!) };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Reply to message error:", msg);
    return { success: false, error: msg };
  }
}

export async function getMessageById(id: string): Promise<ActionResult<InboxMessage>> {
  try {
    const admin = await requireAdmin();
    if (!admin) return { success: false, error: "Unauthorized access" };

    await connectToDatabase();
    const msg = await Message.findById(id);
    if (!msg) return { success: false, error: "Message not found" };

    return { success: true, data: serializeMessage(msg) };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg };
  }
}

export async function getAllMessages(): Promise<ActionResult<InboxMessage[]>> {
  try {
    const admin = await requireAdmin();
    if (!admin) return { success: false, error: "Unauthorized access" };

    await connectToDatabase();
    const docs = await Message.find().sort({ createdAt: -1 }).lean();
    return { success: true, data: serializeMessages(docs) };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg };
  }
}

export async function previewReplyEmail(input: {
  messageId: string;
  subject: string;
  body: string;
  attachments?: ReplyAttachment[];
}): Promise<
  ActionResult<{ html: string; plainText: string }>
> {
  try {
    const admin = await requireAdmin();
    if (!admin) return { success: false, error: "Unauthorized access" };

    await connectToDatabase();
    const existingMsg = await Message.findById(input.messageId);
    if (!existingMsg) return { success: false, error: "Message not found" };

    const signature = await getEmailSignature();
    const sanitizedBody = sanitizeHtml(input.body);

    const templateData = {
      recipientName: existingMsg.name,
      replyHtml: sanitizedBody,
      originalSubject: existingMsg.subject,
      originalMessage: existingMsg.message,
      originalDate: existingMsg.createdAt.toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
      signature,
      attachments: (input.attachments || []).map((a) => ({
        filename: a.filename,
        url: a.url,
      })),
    };

    return {
      success: true,
      data: {
        html: buildReplyEmailHtml(templateData),
        plainText: buildReplyEmailPlainText(templateData),
      },
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: msg };
  }
}
