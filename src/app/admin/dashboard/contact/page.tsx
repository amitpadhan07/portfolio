import React from "react";
import { connectToDatabase } from "@/lib/db";
import { ContactInfo } from "@/models/ContactInfo";
import ContactInfoForm from "@/components/admin/ContactInfoForm";

export const dynamic = "force-dynamic";

export default async function AdminContactPage() {
  await connectToDatabase();

  const contactDoc = await ContactInfo.findOne().lean();

  const plainContact = contactDoc
    ? {
        email: contactDoc.email,
        phone: contactDoc.phone || "",
        address: contactDoc.address || "",
        location: contactDoc.location || "",
        whatsapp: contactDoc.whatsapp || "",
        telegram: contactDoc.telegram || "",
      }
    : null;

  return <ContactInfoForm initialContactInfo={plainContact} />;
}
