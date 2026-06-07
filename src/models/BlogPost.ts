import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  content: string;
  featuredImage: string;
  tags: string[];
  category: string;
  publishedStatus: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema: Schema<IBlogPost> = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    content: { type: String, required: true },
    featuredImage: { type: String, default: "" },
    tags: { type: [String], default: [] },
    category: { type: String, default: "Tech" },
    publishedStatus: { type: String, enum: ["draft", "published"], default: "draft", required: true },
  },
  { timestamps: true }
);

export const BlogPost: Model<IBlogPost> = mongoose.models.BlogPost || mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);
