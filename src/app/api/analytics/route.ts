import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Analytics } from "@/models/Analytics";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type } = body; // "visit" or "view"

    await connectToDatabase();

    const todayStr = new Date().toISOString().split("T")[0];

    const update: any = {};
    if (type === "visit") {
      update.$inc = { visitors: 1, pageViews: 1 };
    } else {
      update.$inc = { pageViews: 1 };
    }

    const doc = await Analytics.findOneAndUpdate(
      { date: todayStr },
      update,
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, data: doc });
  } catch (error: any) {
    console.error("Analytics tracking error:", error);
    return NextResponse.json(
      { error: "Failed to record analytics: " + error.message },
      { status: 500 }
    );
  }
}
