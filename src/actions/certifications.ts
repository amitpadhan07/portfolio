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

    // Normalization and backward compatibility mapping
    const certData = { ...parsed.data };
    if (!certData.fileUrl && certData.image) {
      certData.fileUrl = certData.image;
    }
    if (!certData.image && certData.fileUrl) {
      certData.image = certData.fileUrl;
    }
    if (certData.fileUrl && certData.fileUrl.toLowerCase().endsWith(".pdf")) {
      certData.fileType = "pdf";
    }

    await connectToDatabase();

    const newCert = await Certification.create(certData);

    await ActivityLog.create({
      action: `Created certification record: "${newCert.name}" from "${newCert.issuer}"`,
      adminUser: session.user.email!,
      ipAddress: "127.0.0.1",
    });

    revalidatePath("/");
    revalidatePath("/admin/dashboard/certifications");
    revalidatePath("/admin/dashboard");

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

    // Normalization and backward compatibility mapping
    const certData = { ...parsed.data };
    if (!certData.fileUrl && certData.image) {
      certData.fileUrl = certData.image;
    }
    if (!certData.image && certData.fileUrl) {
      certData.image = certData.fileUrl;
    }
    if (certData.fileUrl && certData.fileUrl.toLowerCase().endsWith(".pdf")) {
      certData.fileType = "pdf";
    }

    await connectToDatabase();

    const existingCert = await Certification.findById(id);
    if (!existingCert) {
      return { success: false, error: "Certification not found" };
    }

    // Cloudinary Cleanup: If fileUrl (or image) is updated, delete the old one from Cloudinary
    const oldFileUrl = existingCert.fileUrl || existingCert.image;
    const newFileUrl = certData.fileUrl || certData.image;
    if (newFileUrl && oldFileUrl && newFileUrl !== oldFileUrl) {
      await deleteFromCloudinary(oldFileUrl);
    }

    // Cloudinary Cleanup: If issuerLogo is updated or removed, delete the old one from Cloudinary
    const oldLogo = existingCert.issuerLogo;
    const newLogo = certData.issuerLogo;
    if (oldLogo && newLogo !== oldLogo) {
      await deleteFromCloudinary(oldLogo);
    }

    const updatedCert = await Certification.findByIdAndUpdate(
      id,
      { $set: certData },
      { new: true }
    );

    await ActivityLog.create({
      action: `Updated certification details: "${updatedCert?.name}"`,
      adminUser: session.user.email!,
      ipAddress: "127.0.0.1",
    });

    revalidatePath("/");
    revalidatePath("/admin/dashboard/certifications");
    revalidatePath("/admin/dashboard");

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

    // Delete main certificate file/image from Cloudinary
    const fileUrl = existingCert.fileUrl || existingCert.image;
    if (fileUrl) {
      await deleteFromCloudinary(fileUrl);
    }

    // Delete issuer logo from Cloudinary if it exists
    if (existingCert.issuerLogo) {
      await deleteFromCloudinary(existingCert.issuerLogo);
    }

    await Certification.findByIdAndDelete(id);

    await ActivityLog.create({
      action: `Deleted certification: "${existingCert.name}"`,
      adminUser: session.user.email!,
      ipAddress: "127.0.0.1",
    });

    revalidatePath("/");
    revalidatePath("/admin/dashboard/certifications");
    revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (error: any) {
    console.error("Certification deletion error:", error);
    return { success: false, error: "Failed to delete certification: " + error.message };
  }
}
