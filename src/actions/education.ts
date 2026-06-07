"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Education } from "@/models/Education";
import { ActivityLog } from "@/models/ActivityLog";
import { EducationSchema } from "@/validators/schemas";
import { revalidatePath } from "next/cache";

export async function createEducation(data: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized access" };
    }

    const parsed = EducationSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    await connectToDatabase();

    const newEdu = await Education.create(parsed.data);

    await ActivityLog.create({
      action: `Created education history: "${newEdu.degree}" at "${newEdu.institution}"`,
      adminUser: session.user.email!,
      ipAddress: "127.0.0.1",
    });

    revalidatePath("/");
    revalidatePath("/admin/dashboard/education");

    return { success: true, data: JSON.parse(JSON.stringify(newEdu)) };
  } catch (error: any) {
    console.error("Education creation error:", error);
    return { success: false, error: "Failed to create education: " + error.message };
  }
}

export async function updateEducation(id: string, data: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized access" };
    }

    const parsed = EducationSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    await connectToDatabase();

    const updatedEdu = await Education.findByIdAndUpdate(
      id,
      { $set: parsed.data },
      { new: true }
    );

    await ActivityLog.create({
      action: `Updated education record: "${updatedEdu?.degree}"`,
      adminUser: session.user.email!,
      ipAddress: "127.0.0.1",
    });

    revalidatePath("/");
    revalidatePath("/admin/dashboard/education");

    return { success: true, data: JSON.parse(JSON.stringify(updatedEdu)) };
  } catch (error: any) {
    console.error("Education update error:", error);
    return { success: false, error: "Failed to update education: " + error.message };
  }
}

export async function deleteEducation(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized access" };
    }

    await connectToDatabase();

    const existingEdu = await Education.findById(id);
    if (!existingEdu) {
      return { success: false, error: "Education record not found" };
    }

    await Education.findByIdAndDelete(id);

    await ActivityLog.create({
      action: `Deleted education record: "${existingEdu.degree}"`,
      adminUser: session.user.email!,
      ipAddress: "127.0.0.1",
    });

    revalidatePath("/");
    revalidatePath("/admin/dashboard/education");

    return { success: true };
  } catch (error: any) {
    console.error("Education deletion error:", error);
    return { success: false, error: "Failed to delete education: " + error.message };
  }
}
