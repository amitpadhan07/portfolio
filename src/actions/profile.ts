"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Profile } from "@/models/Profile";
import { ActivityLog } from "@/models/ActivityLog";
import { ProfileSchema } from "@/validators/schemas";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized access" };
    }

    // 1. Validate payload
    const parsed = ProfileSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    await connectToDatabase();

    // 2. Perform DB update (since there is only one profile, upsert it)
    const updatedProfile = await Profile.findOneAndUpdate(
      {},
      { $set: parsed.data },
      { new: true, upsert: true }
    );

    // 3. Log activity
    await ActivityLog.create({
      action: "Updated general profile bio and homepage statistics",
      adminUser: session.user.email!,
      ipAddress: "127.0.0.1",
    });

    // 4. Trigger path revalidation for the home page
    revalidatePath("/");
    revalidatePath("/admin/dashboard/profile");

    return { success: true, data: JSON.parse(JSON.stringify(updatedProfile)) };
  } catch (error: any) {
    console.error("Profile update server error:", error);
    return { success: false, error: "Failed to update profile: " + error.message };
  }
}
