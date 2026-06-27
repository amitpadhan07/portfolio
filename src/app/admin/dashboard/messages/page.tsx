import React from "react";
import { connectToDatabase } from "@/lib/db";
import { Message } from "@/models/Message";
import { serializeMessages } from "@/lib/message-serializer";
import MessagesInbox from "@/components/admin/MessagesInbox";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  await connectToDatabase();

  const messagesDocs = await Message.find().sort({ createdAt: -1 }).lean();
  const plainMessages = serializeMessages(messagesDocs);

  return <MessagesInbox initialMessages={plainMessages} />;
}

