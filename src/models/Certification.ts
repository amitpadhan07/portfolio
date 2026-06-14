import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICertification extends Document {
  name: string;
  issuer: string;
  date: string;
  certificateUrl: string;
  image: string; // Cloudinary URL (kept for backward compatibility)
  fileType: "image" | "pdf";
  fileUrl: string;
  issuerLogo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CertificationSchema: Schema<ICertification> = new Schema(
  {
    name: { type: String, required: true },
    issuer: { type: String, required: true },
    date: { type: String, required: true },
    certificateUrl: { type: String, default: "" },
    image: { type: String, default: "" },
    fileType: { type: String, enum: ["image", "pdf"], default: "image" },
    fileUrl: { type: String, default: "" },
    issuerLogo: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Certification: Model<ICertification> = mongoose.models.Certification || mongoose.model<ICertification>("Certification", CertificationSchema);

