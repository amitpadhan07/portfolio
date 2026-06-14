"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function uploadImageAction(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Unauthorized access" };
    }

    const file = formData.get("file") as File | null;
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    // Security: Validate file size (max 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: "File is too large. Maximum size is 10MB." };
    }

    // Security: Validate file MIME type
    const ALLOWED_MIME_TYPES = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/svg+xml",
      "application/pdf",
    ];
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return {
        success: false,
        error: "Invalid file type. Supported types: JPG, JPEG, PNG, WEBP, SVG, PDF",
      };
    }

    const folder = (formData.get("folder") as string) || "portfolio_cms";

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload using stream helper
    const secureUrl = await uploadToCloudinary(buffer, folder);

    return { success: true, url: secureUrl };
  } catch (error: any) {
    console.error("Media upload server error:", error);
    return { success: false, error: "Failed to upload asset: " + error.message };
  }
}
