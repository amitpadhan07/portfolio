import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { Certification } from "../src/models/Certification";

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

async function check() {
  await mongoose.connect(MONGODB_URI!);
  const certs = await Certification.find({}).lean();
  console.log(JSON.stringify(certs, null, 2));
  await mongoose.connection.close();
}

check().catch(console.error);
