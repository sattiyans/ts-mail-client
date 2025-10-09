import nodemailer, { Transporter } from "nodemailer";
import { createTrackingPixel } from "./tracking.service";

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
  campaignId?: string;
  enableTracking?: boolean;
}) {
  const tx = getTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@example.com";
  
  let finalHtml = opts.html;
  
  // Add tracking pixel if enabled and campaignId is provided
  if (opts.enableTracking && opts.campaignId) {
    try {
      const pixel = await createTrackingPixel(opts.campaignId, opts.to);
      const trackingPixel = `<img src="${pixel.pixelUrl}" width="1" height="1" style="display:none;" alt="" />`;
      finalHtml += trackingPixel;
    } catch (error) {
      console.warn('Failed to add tracking pixel:', error);
    }
  }
  
  return tx.sendMail({ 
    from, 
    to: opts.to, 
    subject: opts.subject, 
    html: finalHtml, 
    attachments: opts.attachments 
  });
}


