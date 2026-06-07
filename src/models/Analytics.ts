import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAnalytics extends Document {
  date: string; // YYYY-MM-DD
  visitors: number;
  pageViews: number;
  resumeDownloads: number;
  formSubmissions: number;
  createdAt: Date;
  updatedAt: Date;
}

const AnalyticsSchema: Schema<IAnalytics> = new Schema(
  {
    date: { type: String, required: true, unique: true },
    visitors: { type: Number, default: 0 },
    pageViews: { type: Number, default: 0 },
    resumeDownloads: { type: Number, default: 0 },
    formSubmissions: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Analytics: Model<IAnalytics> = mongoose.models.Analytics || mongoose.model<IAnalytics>("Analytics", AnalyticsSchema);
