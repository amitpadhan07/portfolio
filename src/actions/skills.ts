"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Skill } from "@/models/Skill";
import { ActivityLog } from "@/models/ActivityLog";
import { SkillSchema } from "@/validators/schemas";
import { revalidatePath } from "next/cache";

export async function createSkill(data: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized access" };
    }

    const parsed = SkillSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    await connectToDatabase();

    const lastSkill = await Skill.findOne({ category: parsed.data.category }).sort({ order: -1 });
    const order = lastSkill ? lastSkill.order + 1 : 0;

    const newSkill = await Skill.create({
      ...parsed.data,
      order,
    });

    await ActivityLog.create({
      action: `Created new skill: "${newSkill.name}" in category "${newSkill.category}"`,
      adminUser: session.user.email!,
      ipAddress: "127.0.0.1",
    });

    revalidatePath("/");
    revalidatePath("/admin/dashboard/skills");
    revalidatePath("/admin/dashboard");

    return { success: true, data: JSON.parse(JSON.stringify(newSkill)) };
  } catch (error: any) {
    console.error("Skill creation error:", error);
    return { success: false, error: "Failed to create skill: " + error.message };
  }
}

export async function updateSkill(id: string, data: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized access" };
    }

    const parsed = SkillSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    await connectToDatabase();

    const updatedSkill = await Skill.findByIdAndUpdate(
      id,
      { $set: parsed.data },
      { new: true }
    );

    await ActivityLog.create({
      action: `Updated skill credentials: "${updatedSkill?.name}"`,
      adminUser: session.user.email!,
      ipAddress: "127.0.0.1",
    });

    revalidatePath("/");
    revalidatePath("/admin/dashboard/skills");
    revalidatePath("/admin/dashboard");

    return { success: true, data: JSON.parse(JSON.stringify(updatedSkill)) };
  } catch (error: any) {
    console.error("Skill update error:", error);
    return { success: false, error: "Failed to update skill: " + error.message };
  }
}

export async function deleteSkill(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized access" };
    }

    await connectToDatabase();

    const existingSkill = await Skill.findById(id);
    if (!existingSkill) {
      return { success: false, error: "Skill not found" };
    }

    await Skill.findByIdAndDelete(id);

    await ActivityLog.create({
      action: `Deleted skill: "${existingSkill.name}"`,
      adminUser: session.user.email!,
      ipAddress: "127.0.0.1",
    });

    revalidatePath("/");
    revalidatePath("/admin/dashboard/skills");
    revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (error: any) {
    console.error("Skill deletion error:", error);
    return { success: false, error: "Failed to delete skill: " + error.message };
  }
}

export async function reorderSkills(skillIds: string[]) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized access" };
    }

    await connectToDatabase();

    const updates = skillIds.map((id, index) =>
      Skill.findByIdAndUpdate(id, { $set: { order: index } })
    );

    await Promise.all(updates);

    await ActivityLog.create({
      action: "Reordered list display sequence of technical skills",
      adminUser: session.user.email!,
      ipAddress: "127.0.0.1",
    });

    revalidatePath("/");
    revalidatePath("/admin/dashboard/skills");
    revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (error: any) {
    console.error("Skills reorder error:", error);
    return { success: false, error: "Failed to reorder skills: " + error.message };
  }
}
