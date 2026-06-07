"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Resume } from "@/models/Resume";
import { Analytics } from "@/models/Analytics";
import { ActivityLog } from "@/models/ActivityLog";
import { revalidatePath } from "next/cache";

export async function updateResume(pdfUrl: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized access" };
    }

    if (!pdfUrl) {
      return { success: false, error: "Resume URL is required" };
    }

    await connectToDatabase();

    const updatedResume = await Resume.findOneAndUpdate(
      {},
      { $set: { pdfUrl } },
      { new: true, upsert: true }
    );

    await ActivityLog.create({
      action: "Uploaded and replaced portfolio resume PDF",
      adminUser: session.user.email!,
      ipAddress: "127.0.0.1",
    });

    revalidatePath("/");
    revalidatePath("/admin/dashboard/resume");

    return { success: true, data: JSON.parse(JSON.stringify(updatedResume)) };
  } catch (error: any) {
    console.error("Resume update error:", error);
    return { success: false, error: "Failed to update resume: " + error.message };
  }
}

export async function incrementResumeDownloads() {
  try {
    await connectToDatabase();

    // 1. Increment in Resume model
    const resume = await Resume.findOneAndUpdate(
      {},
      { $inc: { downloadCount: 1 } },
      { new: true, upsert: true }
    );

    // 2. Increment in today's Analytics log
    const todayStr = new Date().toISOString().split("T")[0];
    await Analytics.findOneAndUpdate(
      { date: todayStr },
      { $inc: { resumeDownloads: 1 } },
      { upsert: true }
    );

    revalidatePath("/");
    return { success: true, count: resume.downloadCount };
  } catch (error: any) {
    console.error("Increment downloads error:", error);
    return { success: false, error: error.message };
  }
}
