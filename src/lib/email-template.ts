import { escapeHtml, htmlToPlainText } from "@/lib/sanitize";

export interface EmailSignature {
  name: string;
  title: string;
  portfolioUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  email: string;
  phone: string;
}

export interface EmailTemplateData {
  recipientName: string;
  replyHtml: string;
  originalSubject: string;
  originalMessage: string;
  originalDate: string;
  signature: EmailSignature;
  attachments?: { filename: string; url: string }[];
}

export function buildReplyEmailHtml(data: EmailTemplateData): string {
  const {
    recipientName,
    replyHtml,
    originalSubject,
    originalMessage,
    originalDate,
    signature,
    attachments = [],
  } = data;

  const attachmentSection =
    attachments.length > 0
      ? `
    <tr>
      <td style="padding:0 32px 24px;">
        <p style="margin:0 0 12px;font-size:13px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Attachments</p>
        ${attachments
          .map(
            (a) => `
          <a href="${escapeHtml(a.url)}" style="display:inline-block;margin:0 8px 8px 0;padding:8px 16px;background:#f1f5f9;border-radius:8px;color:#0284c7;text-decoration:none;font-size:13px;font-weight:500;">
            📎 ${escapeHtml(a.filename)}
          </a>`
          )
          .join("")}
      </td>
    </tr>`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Reply from ${escapeHtml(signature.name)}</title>
  <!--[if mso]><style>table{border-collapse:collapse;}td{font-family:Arial,sans-serif;}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#312e81 100%);padding:32px;text-align:center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="width:56px;height:56px;border-radius:14px;background:linear-gradient(135deg,#38bdf8,#8b5cf6);display:inline-block;line-height:56px;font-size:22px;font-weight:700;color:#ffffff;font-family:monospace;">AP</div>
                    <h1 style="margin:16px 0 4px;font-size:22px;font-weight:700;color:#f8fafc;letter-spacing:-0.02em;">${escapeHtml(signature.name)}</h1>
                    <p style="margin:0;font-size:14px;color:#94a3b8;font-weight:400;">${escapeHtml(signature.title)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="height:3px;background:linear-gradient(90deg,#38bdf8,#8b5cf6,#38bdf8);"></td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:32px 32px 16px;">
              <p style="margin:0 0 8px;font-size:16px;color:#0f172a;font-weight:600;">Hello ${escapeHtml(recipientName)},</p>
              <p style="margin:0;font-size:15px;color:#475569;line-height:1.6;">Thank you for contacting me through my portfolio website. Here is my response:</p>
            </td>
          </tr>

          <!-- Response Card -->
          <tr>
            <td style="padding:0 32px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
                <tr>
                  <td style="padding:24px;">
                    <div style="font-size:15px;color:#334155;line-height:1.7;">${replyHtml}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${attachmentSection}

          <!-- Original Message Card -->
          <tr>
            <td style="padding:0 32px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fefefe;border:1px solid #e2e8f0;border-left:4px solid #94a3b8;border-radius:12px;overflow:hidden;">
                <tr>
                  <td style="padding:20px 24px;background-color:#f8fafc;border-bottom:1px solid #e2e8f0;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Original Message</p>
                    <p style="margin:0;font-size:14px;font-weight:600;color:#334155;">${escapeHtml(originalSubject)}</p>
                    <p style="margin:4px 0 0;font-size:12px;color:#94a3b8;">${escapeHtml(originalDate)}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0;font-size:14px;color:#64748b;line-height:1.6;white-space:pre-wrap;">${escapeHtml(originalMessage)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer Signature -->
          <tr>
            <td style="padding:24px 32px;background-color:#0f172a;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#f8fafc;">${escapeHtml(signature.name)}</p>
                    <p style="margin:0 0 16px;font-size:13px;color:#94a3b8;">${escapeHtml(signature.title)}</p>
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        ${signature.portfolioUrl ? `<td style="padding-right:12px;"><a href="${escapeHtml(signature.portfolioUrl)}" style="color:#38bdf8;text-decoration:none;font-size:12px;">Portfolio</a></td>` : ""}
                        ${signature.githubUrl ? `<td style="padding-right:12px;"><a href="${escapeHtml(signature.githubUrl)}" style="color:#38bdf8;text-decoration:none;font-size:12px;">GitHub</a></td>` : ""}
                        ${signature.linkedinUrl ? `<td style="padding-right:12px;"><a href="${escapeHtml(signature.linkedinUrl)}" style="color:#38bdf8;text-decoration:none;font-size:12px;">LinkedIn</a></td>` : ""}
                        ${signature.email ? `<td style="padding-right:12px;"><a href="mailto:${escapeHtml(signature.email)}" style="color:#38bdf8;text-decoration:none;font-size:12px;">Email</a></td>` : ""}
                        ${signature.phone ? `<td><a href="tel:${escapeHtml(signature.phone)}" style="color:#38bdf8;text-decoration:none;font-size:12px;">Phone</a></td>` : ""}
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Copyright -->
          <tr>
            <td style="padding:16px 32px;background-color:#020617;text-align:center;">
              <p style="margin:0;font-size:11px;color:#475569;">© ${new Date().getFullYear()} ${escapeHtml(signature.name)}. This email was sent from Portfolio CMS.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildReplyEmailPlainText(data: EmailTemplateData): string {
  const plainReply = htmlToPlainText(data.replyHtml);
  return `Hello ${data.recipientName},

Thank you for contacting me through my portfolio website. Here is my response:

---
${plainReply}
---

Original Message
Subject: ${data.originalSubject}
Date: ${data.originalDate}

${data.originalMessage}

---
${data.signature.name}
${data.signature.title}
${data.signature.portfolioUrl ? `Portfolio: ${data.signature.portfolioUrl}` : ""}
${data.signature.githubUrl ? `GitHub: ${data.signature.githubUrl}` : ""}
${data.signature.linkedinUrl ? `LinkedIn: ${data.signature.linkedinUrl}` : ""}
${data.signature.email ? `Email: ${data.signature.email}` : ""}
${data.signature.phone ? `Phone: ${data.signature.phone}` : ""}

© ${new Date().getFullYear()} ${data.signature.name}. This email was sent from Portfolio CMS.`;
}

export interface MessageNotificationData {
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  date: string;
  dashboardUrl: string;
}

export function buildNotificationEmailHtml(data: MessageNotificationData): string {
  const { senderName, senderEmail, subject, message, date, dashboardUrl } = data;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <title>New Portfolio Message from ${escapeHtml(senderName)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#312e81 100%);padding:32px;text-align:center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="width:56px;height:56px;border-radius:14px;background:linear-gradient(135deg,#38bdf8,#8b5cf6);display:inline-block;line-height:56px;font-size:22px;font-weight:700;color:#ffffff;font-family:monospace;">AP</div>
                    <h1 style="margin:16px 0 4px;font-size:22px;font-weight:700;color:#f8fafc;letter-spacing:-0.02em;">New Message Received</h1>
                    <p style="margin:0;font-size:14px;color:#94a3b8;font-weight:400;">Portfolio Contact Form Notification</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="height:3px;background:linear-gradient(90deg,#38bdf8,#8b5cf6,#38bdf8);"></td>
          </tr>

          <!-- Sender Details Section -->
          <tr>
            <td style="padding:32px 32px 16px;">
              <h2 style="margin:0 0 16px;font-size:18px;color:#0f172a;font-weight:700;">Submission Details</h2>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#475569;line-height:1.6;">
                <tr>
                  <td style="padding:4px 0;width:100px;font-weight:600;color:#64748b;">From:</td>
                  <td style="padding:4px 0;color:#0f172a;font-weight:500;">${escapeHtml(senderName)}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;font-weight:600;color:#64748b;">Email:</td>
                  <td style="padding:4px 0;"><a href="mailto:${escapeHtml(senderEmail)}" style="color:#0284c7;text-decoration:none;">${escapeHtml(senderEmail)}</a></td>
                </tr>
                <tr>
                  <td style="padding:4px 0;font-weight:600;color:#64748b;">Subject:</td>
                  <td style="padding:4px 0;color:#0f172a;font-weight:500;">${escapeHtml(subject)}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0;font-weight:600;color:#64748b;">Date:</td>
                  <td style="padding:4px 0;">${escapeHtml(date)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message Card -->
          <tr>
            <td style="padding:0 32px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #38bdf8;border-radius:12px;overflow:hidden;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 8px;font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">Message Body</p>
                    <div style="font-size:15px;color:#334155;line-height:1.7;white-space:pre-wrap;">${escapeHtml(message)}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Action Button -->
          <tr>
            <td style="padding:0 32px 32px;text-align:center;">
              <a href="${escapeHtml(dashboardUrl)}" style="display:inline-block;padding:12px 24px;background-color:#0f172a;border-radius:8px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;box-shadow:0 2px 4px rgba(15,23,42,0.1);">
                View & Reply in Dashboard
              </a>
            </td>
          </tr>

          <!-- Footer Signature -->
          <tr>
            <td style="padding:16px 32px;background-color:#020617;text-align:center;">
              <p style="margin:0;font-size:11px;color:#475569;">© ${new Date().getFullYear()} Amit Padhan. Sent by Portfolio CMS.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildNotificationEmailPlainText(data: MessageNotificationData): string {
  const { senderName, senderEmail, subject, message, date, dashboardUrl } = data;
  return `New Message Received on Portfolio Website

Submission Details:
----------------------------------------
From:    ${senderName}
Email:   ${senderEmail}
Subject: ${subject}
Date:    ${date}

Message Body:
----------------------------------------
${message}

----------------------------------------
View & Reply in Dashboard:
${dashboardUrl}

© ${new Date().getFullYear()} Amit Padhan. Sent by Portfolio CMS.`;
}

