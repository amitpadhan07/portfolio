import mongoose, { Schema, Document, Model } from "mongoose";

export interface IResume extends Document {
  pdfUrl: string; // Cloudinary URL
  downloadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema: Schema<IResume> = new Schema(
  {
    pdfUrl: { type: String, required: true },
    downloadCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Resume: Model<IResume> = mongoose.models.Resume || mongoose.model<IResume>("Resume", ResumeSchema);
