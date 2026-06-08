import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z
    .string()
    .min(1, "MONGODB_URI is required for database connectivity")
    .refine(
      (val) => val.startsWith("mongodb+srv://") || val.startsWith("mongodb://"),
      {
        message: "MONGODB_URI must be a valid MongoDB connection string starting with 'mongodb+srv://' or 'mongodb://'",
      }
    ),
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required for security and session hashing"),
  NEXTAUTH_URL: z.string().url("NEXTAUTH_URL must be a valid URL pointing to the app's root path"),
  CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required for media hosting"),
  CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required for media authentication"),
  CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required for media signatures"),
});

export function validateEnv() {
  const result = envSchema.safeParse({
    MONGODB_URI: process.env.MONGODB_URI,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  });

  if (!result.success) {
    const errorDetails = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join(", ");
    console.error("❌ Environment configuration validation failed:", errorDetails);
    throw new Error(`Critical Environment Validation Error: ${errorDetails}`);
  }
}
