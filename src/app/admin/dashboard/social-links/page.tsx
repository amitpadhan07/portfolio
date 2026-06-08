import React from "react";
import { connectToDatabase } from "@/lib/db";
import { SocialLink } from "@/models/SocialLink";
import SocialLinksManager from "@/components/admin/SocialLinksManager";

export const dynamic = "force-dynamic";

export default async function AdminSocialLinksPage() {
  await connectToDatabase();

  const socialLinksDocs = await SocialLink.find().sort({ order: 1 }).lean();

  const plainLinks = socialLinksDocs.map((s: any) => ({
    _id: s._id.toString(),
    platform: s.platform,
    url: s.url,
    icon: s.icon || "Link2",
    active: s.active ?? true,
    order: s.order || 0,
  }));

  return <SocialLinksManager initialLinks={plainLinks} />;
}
