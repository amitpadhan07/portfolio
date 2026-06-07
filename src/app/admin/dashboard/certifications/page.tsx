import React from "react";
import { connectToDatabase } from "@/lib/db";
import { Certification } from "@/models/Certification";
import CertificationsManager from "@/components/admin/CertificationsManager";

export const revalidate = 0;

export default async function AdminCertificationsPage() {
  await connectToDatabase();

  const certDocs = await Certification.find().sort({ createdAt: -1 }).lean();

  const plainCerts = certDocs.map((c: any) => ({
    _id: c._id.toString(),
    name: c.name,
    issuer: c.issuer,
    date: c.date,
    certificateUrl: c.certificateUrl || "",
    image: c.image || "",
  }));

  return <CertificationsManager initialCertifications={plainCerts} />;
}
