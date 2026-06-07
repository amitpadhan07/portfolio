import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAchievement extends Document {
  title: string;
  description: string;
  icon: string;
  date: string;
  createdAt: Date;
  updatedAt: Date;
}

const AchievementSchema: Schema<IAchievement> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: "Award" },
    date: { type: String, required: true },
  },
  { timestamps: true }
);

export const Achievement: Model<IAchievement> = mongoose.models.Achievement || mongoose.model<IAchievement>("Achievement", AchievementSchema);
