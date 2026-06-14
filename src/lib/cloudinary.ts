import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary only if environment variables are present
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Uploads a buffer to Cloudinary using streams.
 * @param fileBuffer The file buffer (e.g. from server action / form data)
 * @param folder Cloudinary folder name
 */
export async function uploadToCloudinary(fileBuffer: Buffer, folder: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Check configuration
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      reject(new Error("Cloudinary environment variables are missing."));
      return;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result.secure_url);
        } else {
          reject(new Error("Failed to retrieve upload secure URL."));
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
}

/**
 * Deletes an asset from Cloudinary using its secure URL or public ID.
 * @param fileUrl The secure URL of the asset
 */
export async function deleteFromCloudinary(fileUrl: string): Promise<boolean> {
  if (!fileUrl) return false;

  try {
    // Extract resource type and public ID from the Cloudinary URL
    // Format: https://res.cloudinary.com/cloud_name/<resource_type>/upload/v123456789/folder/public_id.jpg
    const regex = /\/([a-z]+)\/upload\/v\d+\/([^/]+(?:\/[^/]+)*)\.[a-z0-9]+$/i;
    const match = fileUrl.match(regex);

    if (!match) {
      // Fallback to simpler regex if format is slightly different
      const fallbackRegex = /\/v\d+\/([^/]+(?:\/[^/]+)*)\.[a-z0-9]+$/i;
      const fallbackMatch = fileUrl.match(fallbackRegex);
      if (!fallbackMatch) return false;
      const result = await cloudinary.uploader.destroy(fallbackMatch[1]);
      return result.result === "ok";
    }

    const resourceType = match[1];
    const publicId = match[2];

    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    return result.result === "ok";
  } catch (error) {
    console.error("Cloudinary asset deletion failed:", error);
    return false;
  }
}
