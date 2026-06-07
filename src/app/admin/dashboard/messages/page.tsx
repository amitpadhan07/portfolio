import React from "react";
import { connectToDatabase } from "@/lib/db";
import { Message } from "@/models/Message";
import MessagesInbox from "@/components/admin/MessagesInbox";

export const revalidate = 0;

export default async function AdminMessagesPage() {
  await connectToDatabase();

  const messagesDocs = await Message.find().sort({ createdAt: -1 }).lean();

  const plainMessages = messagesDocs.map((m: any) => ({
    _id: m._id.toString(),
    name: m.name,
    email: m.email,
    subject: m.subject || "General Inquiry",
    message: m.message,
    read: m.read || false,
    createdAt: m.createdAt.toISOString(),
  }));

  return <MessagesInbox initialMessages={plainMessages} />;
}
