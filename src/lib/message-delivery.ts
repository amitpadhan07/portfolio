import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/db";
import { Message } from "@/models/Message";

const MESSAGES_PATH = "/admin/dashboard/messages";

export async function updateDeliveryStatusFromWebhook(
  brevoMessageId: string,
  event: string
): Promise<boolean> {
  await connectToDatabase();

  const statusMap: Record<string, string> = {
    delivered: "delivered",
    opened: "opened",
    unique_opened: "opened",
    click: "clicked",
    hard_bounce: "bounced",
    soft_bounce: "bounced",
    blocked: "failed",
    invalid: "failed",
    error: "failed",
  };

  const newStatus = statusMap[event];
  if (!newStatus) return false;

  const message = await Message.findOne({
    "replyHistory.brevoMessageId": brevoMessageId,
  });

  if (!message) return false;

  const replyIndex = message.replyHistory.findIndex(
    (r) => r.brevoMessageId === brevoMessageId
  );
  if (replyIndex === -1) return false;

  const updatePath = `replyHistory.${replyIndex}.deliveryStatus`;
  const updates: Record<string, unknown> = { [updatePath]: newStatus };

  if (newStatus === "opened") {
    updates[`replyHistory.${replyIndex}.tracking.openedAt`] = new Date();
  }
  if (newStatus === "clicked") {
    updates[`replyHistory.${replyIndex}.tracking.clickedAt`] = new Date();
  }

  await Message.updateOne({ _id: message._id }, { $set: updates });
  revalidatePath(MESSAGES_PATH);
  return true;
}
