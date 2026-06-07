import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProject extends Document {
  name: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  image: string; // Cloudinary URL
  category: string;
  featured: boolean;
  status: "active" | "draft";
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema<IProject> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    technologies: { type: [String], default: [] },
    githubUrl: { type: String, default: "" },
    liveUrl: { type: String, default: "" },
    image: { type: String, default: "" },
    category: { type: String, required: true },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ["active", "draft"], default: "active", required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
