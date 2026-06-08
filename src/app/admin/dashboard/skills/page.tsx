import React from "react";
import { connectToDatabase } from "@/lib/db";
import { Skill } from "@/models/Skill";
import SkillsManager from "@/components/admin/SkillsManager";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  await connectToDatabase();

  const skillsDocs = await Skill.find().sort({ category: 1, order: 1 }).lean();

  const plainSkills = skillsDocs.map((s: any) => ({
    _id: s._id.toString(),
    name: s.name,
    icon: s.icon || "Code",
    category: s.category,
    level: s.level || "Intermediate",
    order: s.order || 0,
  }));

  return <SkillsManager initialSkills={plainSkills} />;
}
