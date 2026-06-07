import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEducation extends Document {
  institution: string;
  degree: string;
  duration: string;
  description: string;
  grade: string;
  createdAt: Date;
  updatedAt: Date;
}

const EducationSchema: Schema<IEducation> = new Schema(
  {
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    duration: { type: String, required: true },
    description: { type: String, default: "" },
    grade: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Education: Model<IEducation> = mongoose.models.Education || mongoose.model<IEducation>("Education", EducationSchema);
