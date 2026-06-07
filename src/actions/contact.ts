"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { ContactInfo } from "@/models/ContactInfo";
import { Message } from "@/models/Message";
import { Analytics } from "@/models/Analytics";
import { ActivityLog } from "@/models/ActivityLog";
import { ContactInfoSchema, MessageSchema } from "@/validators/schemas";
import { revalidatePath } from "next/cache";

export async function updateContactInfo(data: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized access" };
    }

    const parsed = ContactInfoSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    await connectToDatabase();

    const updatedContact = await ContactInfo.findOneAndUpdate(
      {},
      { $set: parsed.data },
      { new: true, upsert: true }
    );

    await ActivityLog.create({
      action: "Updated contact endpoints and information configurations",
      adminUser: session.user.email!,
      ipAddress: "127.0.0.1",
    });

    revalidatePath("/");
    revalidatePath("/admin/dashboard/contact");

    return { success: true, data: JSON.parse(JSON.stringify(updatedContact)) };
  } catch (error: any) {
    console.error("ContactInfo update error:", error);
    return { success: false, error: "Failed to update contact info: " + error.message };
  }
}

export async function submitContactMessage(data: any) {
  try {
    const parsed = MessageSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    await connectToDatabase();

    // 1. Create message log in DB
    const newMessage = await Message.create(parsed.data);

    // 2. Increment form submission counter in today's Analytics log
    const todayStr = new Date().toISOString().split("T")[0];
    await Analytics.findOneAndUpdate(
      { date: todayStr },
      { $inc: { formSubmissions: 1 } },
      { upsert: true }
    );

    revalidatePath("/admin/dashboard/messages");

    return { success: true, data: JSON.parse(JSON.stringify(newMessage)) };
  } catch (error: any) {
    console.error("Contact message submission error:", error);
    return { success: false, error: "Failed to transmit message: " + error.message };
  }
}
