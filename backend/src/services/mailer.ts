import nodemailer, { Transporter } from "nodemailer";

let transporter: Transporter | null = null;

export function getTransporter(): Transporter {
  if (transporter) return transporter;
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    throw new Error("SMTP environment variables are not set");
  }
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  return transporter;
}

export type MailAttachment = { filename: string; content: Buffer; contentType?: string | undefined };

export async function sendMail(opts: {
  to: string;
  subject: string;
  html: string;
  attachments?: MailAttachment[];
}) {
  const tx = getTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@example.com";
  return tx.sendMail({ from, to: opts.to, subject: opts.subject, html: opts.html, attachments: opts.attachments });
}


