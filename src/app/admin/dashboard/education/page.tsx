import React from "react";
import { connectToDatabase } from "@/lib/db";
import { Education } from "@/models/Education";
import EducationManager from "@/components/admin/EducationManager";

export const revalidate = 0;

export default async function AdminEducationPage() {
  await connectToDatabase();

  const eduDocs = await Education.find().sort({ createdAt: -1 }).lean();

  const plainEdu = eduDocs.map((e: any) => ({
    _id: e._id.toString(),
    institution: e.institution,
    degree: e.degree,
    duration: e.duration,
    description: e.description || "",
    grade: e.grade || "",
  }));

  return <EducationManager initialEducation={plainEdu} />;
}
