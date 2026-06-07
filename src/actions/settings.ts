"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Settings } from "@/models/Settings";
import { User } from "@/models/User";
import { ActivityLog } from "@/models/ActivityLog";
import { SettingsSchema, ChangePasswordSchema } from "@/validators/schemas";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function updateSettings(data: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized access" };
    }

    const parsed = SettingsSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    await connectToDatabase();

    const updatedSettings = await Settings.findOneAndUpdate(
      {},
      { $set: parsed.data },
      { new: true, upsert: true }
    );

    await ActivityLog.create({
      action: "Updated global website SEO settings and search keywords",
      adminUser: session.user.email!,
      ipAddress: "127.0.0.1",
    });

    revalidatePath("/");
    revalidatePath("/admin/dashboard/settings");

    return { success: true, data: JSON.parse(JSON.stringify(updatedSettings)) };
  } catch (error: any) {
    console.error("Settings update error:", error);
    return { success: false, error: "Failed to update settings: " + error.message };
  }
}

export async function changeAdminPassword(data: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized access" };
    }

    const parsed = ChangePasswordSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    await connectToDatabase();

    const user = await User.findOne({ email: session.user.email?.toLowerCase() });
    if (!user) {
      return { success: false, error: "Admin account not found" };
    }

    // Verify current password
    const isMatch = await bcrypt.compare(parsed.data.oldPassword, user.passwordHash);
    if (!isMatch) {
      return { success: false, error: "Incorrect current password" };
    }

    // Hash new password and save
    const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
    user.passwordHash = passwordHash;
    await user.save();

    await ActivityLog.create({
      action: "Successfully updated administrator security credentials",
      adminUser: session.user.email!,
      ipAddress: "127.0.0.1",
    });

    return { success: true };
  } catch (error: any) {
    console.error("Change password error:", error);
    return { success: false, error: "Failed to change password: " + error.message };
  }
}
