"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { SocialLink } from "@/models/SocialLink";
import { ActivityLog } from "@/models/ActivityLog";
import { SocialLinkSchema } from "@/validators/schemas";
import { revalidatePath } from "next/cache";

export async function createSocialLink(data: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized access" };
    }

    const parsed = SocialLinkSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    await connectToDatabase();

    const lastLink = await SocialLink.findOne().sort({ order: -1 });
    const order = lastLink ? lastLink.order + 1 : 0;

    const newLink = await SocialLink.create({
      ...parsed.data,
      order,
    });

    await ActivityLog.create({
      action: `Created social profile link: "${newLink.platform}"`,
      adminUser: session.user.email!,
      ipAddress: "127.0.0.1",
    });

    revalidatePath("/");
    revalidatePath("/admin/dashboard/social-links");

    return { success: true, data: JSON.parse(JSON.stringify(newLink)) };
  } catch (error: any) {
    console.error("SocialLink creation error:", error);
    return { success: false, error: "Failed to create social link: " + error.message };
  }
}

export async function updateSocialLink(id: string, data: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized access" };
    }

    const parsed = SocialLinkSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    await connectToDatabase();

    const updatedLink = await SocialLink.findByIdAndUpdate(
      id,
      { $set: parsed.data },
      { new: true }
    );

    await ActivityLog.create({
      action: `Updated social link status/URL: "${updatedLink?.platform}"`,
      adminUser: session.user.email!,
      ipAddress: "127.0.0.1",
    });

    revalidatePath("/");
    revalidatePath("/admin/dashboard/social-links");

    return { success: true, data: JSON.parse(JSON.stringify(updatedLink)) };
  } catch (error: any) {
    console.error("SocialLink update error:", error);
    return { success: false, error: "Failed to update social link: " + error.message };
  }
}

export async function deleteSocialLink(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized access" };
    }

    await connectToDatabase();

    const existingLink = await SocialLink.findById(id);
    if (!existingLink) {
      return { success: false, error: "Social link not found" };
    }

    await SocialLink.findByIdAndDelete(id);

    await ActivityLog.create({
      action: `Deleted social link: "${existingLink.platform}"`,
      adminUser: session.user.email!,
      ipAddress: "127.0.0.1",
    });

    revalidatePath("/");
    revalidatePath("/admin/dashboard/social-links");

    return { success: true };
  } catch (error: any) {
    console.error("SocialLink deletion error:", error);
    return { success: false, error: "Failed to delete social link: " + error.message };
  }
}

export async function reorderSocialLinks(linkIds: string[]) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized access" };
    }

    await connectToDatabase();

    const updates = linkIds.map((id, index) =>
      SocialLink.findByIdAndUpdate(id, { $set: { order: index } })
    );

    await Promise.all(updates);

    await ActivityLog.create({
      action: "Reordered list display sequence of social profile links",
      adminUser: session.user.email!,
      ipAddress: "127.0.0.1",
    });

    revalidatePath("/");
    revalidatePath("/admin/dashboard/social-links");

    return { success: true };
  } catch (error: any) {
    console.error("SocialLinks reorder error:", error);
    return { success: false, error: "Failed to reorder social links: " + error.message };
  }
}
