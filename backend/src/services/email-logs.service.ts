import { db } from "../db";

export async function logEmail(opts: {
  campaignId: string | null;
  recipientEmail: string;
  status: string;
  opened?: boolean;
  clicked?: boolean;
  bounced?: boolean;
}) {
  await db.query(
    `insert into email_logs (campaign_id, recipient_email, status, opened, clicked, bounced)
     values ($1, $2, $3, $4, $5, $6)`,
    [opts.campaignId, opts.recipientEmail, opts.status, opts.opened ?? false, opts.clicked ?? false, opts.bounced ?? false]
  );
}


