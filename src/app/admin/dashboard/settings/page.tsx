import React from "react";
import { connectToDatabase } from "@/lib/db";
import { Settings } from "@/models/Settings";
import SettingsForm from "@/components/admin/SettingsForm";

export const revalidate = 0;

export default async function AdminSettingsPage() {
  await connectToDatabase();

  const settingsDoc = await Settings.findOne().lean();

  const plainSettings = settingsDoc
    ? {
        siteTitle: settingsDoc.siteTitle,
        metaDescription: settingsDoc.metaDescription,
        keywords: settingsDoc.keywords || [],
        favicon: settingsDoc.favicon || "",
        analyticsId: settingsDoc.analyticsId || "",
        maintenanceMode: settingsDoc.maintenanceMode || false,
      }
    : null;

  return <SettingsForm initialSettings={plainSettings} />;
}
