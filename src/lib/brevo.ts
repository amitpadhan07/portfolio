import {
  buildReplyEmailHtml,
  buildReplyEmailPlainText,
  type EmailSignature,
  type EmailTemplateData,
} from "@/lib/email-template";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

export interface SendMailOptions {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  textContent?: string;
  cc?: { email: string; name?: string }[];
  bcc?: { email: string; name?: string }[];
  replyTo?: { email: string; name?: string };
  tags?: string[];
}

export interface SendMailResult {
  messageId: string;
}

function getBrevoConfig() {
  const apiKey = process.env.BREVO_API_KEY;
  const fromName = process.env.MAIL_FROM_NAME || "Amit Padhan";
  const fromEmail = process.env.MAIL_FROM_EMAIL;
  const replyToEmail = process.env.MAIL_REPLY_TO || fromEmail;

  if (!apiKey) {
    throw new Error("BREVO_API_KEY is not configured");
  }
  if (!fromEmail) {
    throw new Error("MAIL_FROM_EMAIL is not configured");
  }

  return { apiKey, fromName, fromEmail, replyToEmail };
}

function parseEmailList(input: string): { email: string; name?: string }[] {
  if (!input.trim()) return [];
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((entry) => {
      const match = entry.match(/^(.+?)\s*<([^>]+)>$/);
      if (match) {
        return { name: match[1].trim(), email: match[2].trim() };
      }
      return { email: entry };
    });
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function sendTransactionalMail(
  options: SendMailOptions
): Promise<SendMailResult> {
  const { apiKey, fromName, fromEmail, replyToEmail } = getBrevoConfig();

  const payload: Record<string, unknown> = {
    sender: { name: fromName, email: fromEmail },
    to: options.to,
    subject: options.subject,
    htmlContent: options.htmlContent,
    textContent: options.textContent || undefined,
    tags: options.tags || ["portfolio-cms"],
  };

  if (options.cc && options.cc.length > 0) {
    payload.cc = options.cc;
  }
  if (options.bcc && options.bcc.length > 0) {
    payload.bcc = options.bcc;
  }
  payload.replyTo = options.replyTo || { email: replyToEmail, name: fromName };

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(BREVO_API_URL, {
        method: "POST",
        headers: {
          accept: "application/json",
          "api-key": apiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errMsg =
          (body as { message?: string }).message ||
          `Brevo API error: ${response.status}`;
        throw new Error(errMsg);
      }

      const messageId = (body as { messageId?: string }).messageId || "";
      console.log(`[Brevo] Email sent successfully. messageId=${messageId}`);
      return { messageId };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(
        `[Brevo] Send attempt ${attempt}/${MAX_RETRIES} failed:`,
        lastError.message
      );
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * attempt);
      }
    }
  }

  throw lastError || new Error("Failed to send email after retries");
}

export interface SendReplyMailOptions {
  recipientEmail: string;
  recipientName: string;
  subject: string;
  replyHtml: string;
  originalSubject: string;
  originalMessage: string;
  originalDate: string;
  signature: EmailSignature;
  cc?: string;
  bcc?: string;
  attachments?: { filename: string; url: string }[];
}

export async function sendReplyMail(
  options: SendReplyMailOptions
): Promise<SendMailResult> {
  const templateData: EmailTemplateData = {
    recipientName: options.recipientName,
    replyHtml: options.replyHtml,
    originalSubject: options.originalSubject,
    originalMessage: options.originalMessage,
    originalDate: options.originalDate,
    signature: options.signature,
    attachments: options.attachments,
  };

  const htmlContent = buildReplyEmailHtml(templateData);
  const textContent = buildReplyEmailPlainText(templateData);

  return sendTransactionalMail({
    to: [{ email: options.recipientEmail, name: options.recipientName }],
    subject: options.subject,
    htmlContent,
    textContent,
    cc: parseEmailList(options.cc || ""),
    bcc: parseEmailList(options.bcc || ""),
    tags: ["portfolio-cms", "support-reply"],
  });
}

export { parseEmailList };
