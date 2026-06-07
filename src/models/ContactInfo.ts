import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContactInfo extends Document {
  email: string;
  phone: string;
  address: string;
  location: string;
  whatsapp: string;
  telegram: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactInfoSchema: Schema<IContactInfo> = new Schema(
  {
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    location: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    telegram: { type: String, default: "" },
  },
  { timestamps: true }
);

export const ContactInfo: Model<IContactInfo> = mongoose.models.ContactInfo || mongoose.model<IContactInfo>("ContactInfo", ContactInfoSchema);
