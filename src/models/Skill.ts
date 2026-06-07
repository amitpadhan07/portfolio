import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISkill extends Document {
  name: string;
  icon: string; // Lucide icon identifier or name
  category: "Frontend" | "Backend" | "Database" | "Programming" | "AI/ML" | "Cloud";
  level: "Advanced" | "Intermediate" | "Familiar";
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema: Schema<ISkill> = new Schema(
  {
    name: { type: String, required: true },
    icon: { type: String, default: "Code" },
    category: {
      type: String,
      enum: ["Frontend", "Backend", "Database", "Programming", "AI/ML", "Cloud"],
      required: true,
    },
    level: {
      type: String,
      enum: ["Advanced", "Intermediate", "Familiar"],
      default: "Intermediate",
      required: true,
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Skill: Model<ISkill> = mongoose.models.Skill || mongoose.model<ISkill>("Skill", SkillSchema);
