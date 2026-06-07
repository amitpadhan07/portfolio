import mongoose, { Schema, Document, Model } from "mongoose";

export interface IActivityLog extends Document {
  action: string;
  adminUser: string;
  timestamp: Date;
  ipAddress: string;
}

const ActivityLogSchema: Schema<IActivityLog> = new Schema(
  {
    action: { type: String, required: true },
    adminUser: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, required: true },
    ipAddress: { type: String, default: "" },
  },
  { timestamps: false }
);

export const ActivityLog: Model<IActivityLog> = mongoose.models.ActivityLog || mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema);
