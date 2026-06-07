"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Achievement } from "@/models/Achievement";
import { ActivityLog } from "@/models/ActivityLog";
import { AchievementSchema } from "@/validators/schemas";
import { revalidatePath } from "next/cache";

export async function createAchievement(data: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized access" };
    }

    const parsed = AchievementSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    await connectToDatabase();

    const newAchievement = await Achievement.create(parsed.data);

    await ActivityLog.create({
      action: `Created achievement award: "${newAchievement.title}"`,
      adminUser: session.user.email!,
      ipAddress: "127.0.0.1",
    });

    revalidatePath("/");
    revalidatePath("/admin/dashboard/achievements");

    return { success: true, data: JSON.parse(JSON.stringify(newAchievement)) };
  } catch (error: any) {
    console.error("Achievement creation error:", error);
    return { success: false, error: "Failed to create achievement: " + error.message };
  }
}

export async function updateAchievement(id: string, data: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized access" };
    }

    const parsed = AchievementSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    await connectToDatabase();

    const updatedAchievement = await Achievement.findByIdAndUpdate(
      id,
      { $set: parsed.data },
      { new: true }
    );

    await ActivityLog.create({
      action: `Updated achievement details: "${updatedAchievement?.title}"`,
      adminUser: session.user.email!,
      ipAddress: "127.0.0.1",
    });

    revalidatePath("/");
    revalidatePath("/admin/dashboard/achievements");

    return { success: true, data: JSON.parse(JSON.stringify(updatedAchievement)) };
  } catch (error: any) {
    console.error("Achievement update error:", error);
    return { success: false, error: "Failed to update achievement: " + error.message };
  }
}

export async function deleteAchievement(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized access" };
    }

    await connectToDatabase();

    const existingAchievement = await Achievement.findById(id);
    if (!existingAchievement) {
      return { success: false, error: "Achievement record not found" };
    }

    await Achievement.findByIdAndDelete(id);

    await ActivityLog.create({
      action: `Deleted achievement record: "${existingAchievement.title}"`,
      adminUser: session.user.email!,
      ipAddress: "127.0.0.1",
    });

    revalidatePath("/");
    revalidatePath("/admin/dashboard/achievements");

    return { success: true };
  } catch (error: any) {
    console.error("Achievement deletion error:", error);
    return { success: false, error: "Failed to delete achievement: " + error.message };
  }
}
