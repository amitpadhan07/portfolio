"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Message } from "@/models/Message";
import { ActivityLog } from "@/models/ActivityLog";
import { revalidatePath } from "next/cache";

export async function markMessageAsRead(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized access" };
    }

    await connectToDatabase();

    const updatedMsg = await Message.findByIdAndUpdate(
      id,
      { $set: { read: true } },
      { new: true }
    );

    await ActivityLog.create({
      action: `Marked message from "${updatedMsg?.name}" as read`,
      adminUser: session.user.email!,
      ipAddress: "127.0.0.1",
    });

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/dashboard/messages");

    return { success: true, data: JSON.parse(JSON.stringify(updatedMsg)) };
  } catch (error: any) {
    console.error("Mark message read error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteMessage(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized access" };
    }

    await connectToDatabase();

    const existingMsg = await Message.findById(id);
    if (!existingMsg) {
      return { success: false, error: "Message not found" };
    }

    await Message.findByIdAndDelete(id);

    await ActivityLog.create({
      action: `Deleted inbox message sent by: "${existingMsg.name}"`,
      adminUser: session.user.email!,
      ipAddress: "127.0.0.1",
    });

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/dashboard/messages");

    return { success: true };
  } catch (error: any) {
    console.error("Message deletion error:", error);
    return { success: false, error: error.message };
  }
}
