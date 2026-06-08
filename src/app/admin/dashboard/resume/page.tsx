import React from "react";
import { connectToDatabase } from "@/lib/db";
import { Resume } from "@/models/Resume";
import ResumeManager from "@/components/admin/ResumeManager";

export const dynamic = "force-dynamic";

export default async function AdminResumePage() {
  await connectToDatabase();

  const resumeDoc = await Resume.findOne().lean();
  let initialResume = null;

  if (resumeDoc) {
    initialResume = {
      pdfUrl: (resumeDoc as any).pdfUrl || "",
      downloadCount: (resumeDoc as any).downloadCount || 0,
    };
  }

  return <ResumeManager initialResume={initialResume} />;
}
