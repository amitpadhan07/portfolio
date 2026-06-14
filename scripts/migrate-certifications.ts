import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { Certification } from "../src/models/Certification";

// Manual env loader for .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf8");
  envConfig.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      process.env[key] = value.trim();
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI is not set in .env.local");
  process.exit(1);
}

async function migrate() {
  console.log("Connecting to database for certification migration...");
  await mongoose.connect(MONGODB_URI!);
  console.log("Connected successfully!");

  const certs = await Certification.find({});
  console.log(`Found ${certs.length} certifications to evaluate.`);

  let migratedCount = 0;
  for (const cert of certs) {
    let changed = false;

    // Migrate fileUrl from image if not set
    if (!cert.fileUrl && cert.image) {
      cert.fileUrl = cert.image;
      changed = true;
    }

    // Determine and set fileType if not set
    if (!cert.fileType) {
      const isPdf = (cert.fileUrl || "").toLowerCase().endsWith(".pdf");
      cert.fileType = isPdf ? "pdf" : "image";
      changed = true;
    }

    // Initialize empty logo if not present
    if (cert.issuerLogo === undefined) {
      cert.issuerLogo = "";
      changed = true;
    }

    if (changed) {
      await cert.save();
      migratedCount++;
      console.log(`✓ Migrated record: "${cert.name}" (fileType: ${cert.fileType})`);
    }
  }

  console.log(`Migration completed! Migrated ${migratedCount} out of ${certs.length} records.`);
  await mongoose.connection.close();
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
