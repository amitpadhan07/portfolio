import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Server-side basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, and message are required." },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address format." },
        { status: 400 }
      )
    }

    // Mock processing - In production, you would configure an email dispatcher here
    // (e.g. Nodemailer, Resend, Sendgrid) or save it directly to a database.
    console.log("Contact form submission received:", { name, email, message });

    // Simulate database/API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return NextResponse.json(
      { success: true, message: "Your message was transmitted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process form submission. Please try again." },
      { status: 500 }
    );
  }
}
