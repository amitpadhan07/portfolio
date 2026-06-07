import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISettings extends Document {
  siteTitle: string;
  metaDescription: string;
  keywords: string[];
  favicon: string;
  analyticsId: string;
  maintenanceMode: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema: Schema<ISettings> = new Schema(
  {
    siteTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    keywords: { type: [String], default: [] },
    favicon: { type: String, default: "" },
    analyticsId: { type: String, default: "" },
    maintenanceMode: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Settings: Model<ISettings> = mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);
