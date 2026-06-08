import React from "react";
import { connectToDatabase } from "@/lib/db";
import { Achievement } from "@/models/Achievement";
import AchievementsManager from "@/components/admin/AchievementsManager";

export const dynamic = "force-dynamic";

export default async function AdminAchievementsPage() {
  await connectToDatabase();

  const achDocs = await Achievement.find().sort({ createdAt: -1 }).lean();

  const plainAch = achDocs.map((a: any) => ({
    _id: a._id.toString(),
    title: a.title,
    description: a.description,
    icon: a.icon || "Trophy",
    date: a.date,
  }));

  return <AchievementsManager initialAchievements={plainAch} />;
}
