import React from "react";
import { connectToDatabase } from "@/lib/db";
import { Profile } from "@/models/Profile";
import ProfileForm from "@/components/admin/ProfileForm";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  await connectToDatabase();

  const profileDoc = await Profile.findOne().lean();
  let initialProfile = null;

  if (profileDoc) {
    initialProfile = {
      name: (profileDoc as any).name,
      title: (profileDoc as any).title,
      heroHeading: (profileDoc as any).heroHeading,
      heroDescription: (profileDoc as any).heroDescription,
      aboutMe: (profileDoc as any).aboutMe,
      profilePicture: (profileDoc as any).profilePicture || "",
      heroImage: (profileDoc as any).heroImage || "",
      stats: ((profileDoc as any).stats || []).map((s: any) => ({
        label: s.label,
        value: s.value,
        suffix: s.suffix || "",
        subtext: s.subtext || "",
      })),
    };
  }

  return <ProfileForm initialProfile={initialProfile} />;
}
