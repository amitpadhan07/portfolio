import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProfileStat {
  label: string;
  value: number;
  suffix: string;
  subtext: string;
}

export interface IProfile extends Document {
  name: string;
  title: string;
  heroHeading: string;
  heroDescription: string;
  aboutMe: string;
  profilePicture: string; // Cloudinary URL
  heroImage: string;      // Cloudinary URL
  stats: IProfileStat[];
  createdAt: Date;
  updatedAt: Date;
}

const ProfileStatSchema = new Schema<IProfileStat>({
  label: { type: String, required: true },
  value: { type: Number, required: true },
  suffix: { type: String, default: "" },
  subtext: { type: String, default: "" },
});

const ProfileSchema: Schema<IProfile> = new Schema(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    heroHeading: { type: String, required: true },
    heroDescription: { type: String, required: true },
    aboutMe: { type: String, required: true },
    profilePicture: { type: String, default: "" },
    heroImage: { type: String, default: "" },
    stats: { type: [ProfileStatSchema], default: [] },
  },
  { timestamps: true }
);

export const Profile: Model<IProfile> = mongoose.models.Profile || mongoose.model<IProfile>("Profile", ProfileSchema);
