import { NextResponse } from "next/server";
import { updateDeliveryStatusFromWebhook } from "@/lib/message-delivery";

interface BrevoWebhookEvent {
  event: string;
  "message-id"?: string;
  messageId?: string;
  email?: string;
  date?: string;
}

export async function POST(request: Request) {
  try {
    const webhookSecret = process.env.BREVO_WEBHOOK_SECRET;
    if (webhookSecret) {
      const authHeader = request.headers.get("authorization");
      if (authHeader !== `Bearer ${webhookSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const body = (await request.json()) as BrevoWebhookEvent | BrevoWebhookEvent[];

    const events = Array.isArray(body) ? body : [body];

    let processed = 0;

    for (const event of events) {
      const messageId = event["message-id"] || event.messageId;
      const eventType = event.event;

      if (!messageId || !eventType) continue;

      const updated = await updateDeliveryStatusFromWebhook(messageId, eventType);
      if (updated) processed += 1;
    }

    return NextResponse.json({ success: true, processed });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Webhook processing failed";
    console.error("[Brevo Webhook]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "Brevo webhook endpoint active" });
}
