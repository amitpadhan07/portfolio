import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISocialLink extends Document {
  platform: string;
  url: string;
  icon: string; // Icon name e.g., 'GithubIcon', 'LinkedinIcon'
  active: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const SocialLinkSchema: Schema<ISocialLink> = new Schema(
  {
    platform: { type: String, required: true },
    url: { type: String, required: true },
    icon: { type: String, required: true },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const SocialLink: Model<ISocialLink> = mongoose.models.SocialLink || mongoose.model<ISocialLink>("SocialLink", SocialLinkSchema);
