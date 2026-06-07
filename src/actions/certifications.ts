"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Certification } from "@/models/Certification";
import { ActivityLog } from "@/models/ActivityLog";
import { CertificationSchema } from "@/validators/schemas";
import { revalidatePath } from "next/cache";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function createCertification(data: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized access" };
    }

    const parsed = CertificationSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    await connectToDatabase();

    const newCert = await Certification.create(parsed.data);

    await ActivityLog.create({
      action: `Created certification record: "${newCert.name}" from "${newCert.issuer}"`,
      adminUser: session.user.email!,
      ipAddress: "127.0.0.1",
    });

    revalidatePath("/");
    revalidatePath("/admin/dashboard/certifications");

    return { success: true, data: JSON.parse(JSON.stringify(newCert)) };
  } catch (error: any) {
    console.error("Certification creation error:", error);
    return { success: false, error: "Failed to create certification: " + error.message };
  }
}

export async function updateCertification(id: string, data: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized access" };
    }

    const parsed = CertificationSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    await connectToDatabase();

    const existingCert = await Certification.findById(id);
    if (!existingCert) {
      return { success: false, error: "Certification not found" };
    }

    // If new image is set, delete old image from Cloudinary
    if (parsed.data.image && existingCert.image && parsed.data.image !== existingCert.image) {
      await deleteFromCloudinary(existingCert.image);
    }

    const updatedCert = await Certification.findByIdAndUpdate(
      id,
      { $set: parsed.data },
      { new: true }
    );

    await ActivityLog.create({
      action: `Updated certification details: "${updatedCert?.name}"`,
      adminUser: session.user.email!,
      ipAddress: "127.0.0.1",
    });

    revalidatePath("/");
    revalidatePath("/admin/dashboard/certifications");

    return { success: true, data: JSON.parse(JSON.stringify(updatedCert)) };
  } catch (error: any) {
    console.error("Certification update error:", error);
    return { success: false, error: "Failed to update certification: " + error.message };
  }
}

export async function deleteCertification(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized access" };
    }

    await connectToDatabase();

    const existingCert = await Certification.findById(id);
    if (!existingCert) {
      return { success: false, error: "Certification not found" };
    }

    // Delete image from Cloudinary
    if (existingCert.image) {
      await deleteFromCloudinary(existingCert.image);
    }

    await Certification.findByIdAndDelete(id);

    await ActivityLog.create({
      action: `Deleted certification: "${existingCert.name}"`,
      adminUser: session.user.email!,
      ipAddress: "127.0.0.1",
    });

    revalidatePath("/");
    revalidatePath("/admin/dashboard/certifications");

    return { success: true };
  } catch (error: any) {
    console.error("Certification deletion error:", error);
    return { success: false, error: "Failed to delete certification: " + error.message };
  }
}
