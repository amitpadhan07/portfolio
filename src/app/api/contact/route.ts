import { NextResponse } from "next/server";
import { submitContactMessage } from "@/actions/contact";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message, subject } = body;

    const result = await submitContactMessage({
      name,
      email,
      message,
      subject: subject || "General Inquiry",
    });

    if (result.success) {
      return NextResponse.json(
        { success: true, message: "Your message was transmitted successfully!" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: result.error || "Failed to process form submission. Please try again." },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to process form submission: " + error.message },
      { status: 500 }
    );
  }
}
