"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Project } from "@/models/Project";
import { ActivityLog } from "@/models/ActivityLog";
import { ProjectSchema } from "@/validators/schemas";
import { revalidatePath } from "next/cache";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function createProject(data: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized access" };
    }

    const parsed = ProjectSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    await connectToDatabase();

    // Set order based on the highest existing order
    const lastProject = await Project.findOne().sort({ order: -1 });
    const order = lastProject ? lastProject.order + 1 : 0;

    const newProject = await Project.create({
      ...parsed.data,
      order,
    });

    await ActivityLog.create({
      action: `Created new project: "${newProject.name}"`,
      adminUser: session.user.email!,
      ipAddress: "127.0.0.1",
    });

    revalidatePath("/");
    revalidatePath("/admin/dashboard/projects");

    return { success: true, data: JSON.parse(JSON.stringify(newProject)) };
  } catch (error: any) {
    console.error("Project creation error:", error);
    return { success: false, error: "Failed to create project: " + error.message };
  }
}

export async function updateProject(id: string, data: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized access" };
    }

    const parsed = ProjectSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    await connectToDatabase();

    const existingProject = await Project.findById(id);
    if (!existingProject) {
      return { success: false, error: "Project not found" };
    }

    // If a new image is being set, delete the old image from Cloudinary
    if (parsed.data.image && existingProject.image && parsed.data.image !== existingProject.image) {
      await deleteFromCloudinary(existingProject.image);
    }

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { $set: parsed.data },
      { new: true }
    );

    await ActivityLog.create({
      action: `Updated project details: "${updatedProject?.name}"`,
      adminUser: session.user.email!,
      ipAddress: "127.0.0.1",
    });

    revalidatePath("/");
    revalidatePath("/admin/dashboard/projects");

    return { success: true, data: JSON.parse(JSON.stringify(updatedProject)) };
  } catch (error: any) {
    console.error("Project update error:", error);
    return { success: false, error: "Failed to update project: " + error.message };
  }
}

export async function deleteProject(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized access" };
    }

    await connectToDatabase();

    const existingProject = await Project.findById(id);
    if (!existingProject) {
      return { success: false, error: "Project not found" };
    }

    // Delete image from Cloudinary
    if (existingProject.image) {
      await deleteFromCloudinary(existingProject.image);
    }

    await Project.findByIdAndDelete(id);

    await ActivityLog.create({
      action: `Deleted project: "${existingProject.name}"`,
      adminUser: session.user.email!,
      ipAddress: "127.0.0.1",
    });

    revalidatePath("/");
    revalidatePath("/admin/dashboard/projects");

    return { success: true };
  } catch (error: any) {
    console.error("Project deletion error:", error);
    return { success: false, error: "Failed to delete project: " + error.message };
  }
}

export async function reorderProjects(projectIds: string[]) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized access" };
    }

    await connectToDatabase();

    // Perform bulk write or updates to save new orders
    const updates = projectIds.map((id, index) =>
      Project.findByIdAndUpdate(id, { $set: { order: index } })
    );

    await Promise.all(updates);

    await ActivityLog.create({
      action: "Reordered list display sequence of technical projects",
      adminUser: session.user.email!,
      ipAddress: "127.0.0.1",
    });

    revalidatePath("/");
    revalidatePath("/admin/dashboard/projects");

    return { success: true };
  } catch (error: any) {
    console.error("Projects reorder error:", error);
    return { success: false, error: "Failed to reorder projects: " + error.message };
  }
}
