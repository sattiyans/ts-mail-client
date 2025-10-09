import { db } from "../db";

export interface TrackingPixel {
  id: string;
  campaignId: string;
  recipientEmail: string;
  pixelUrl: string;
}

export async function createTrackingPixel(campaignId: string, recipientEmail: string): Promise<TrackingPixel> {
  const pixelId = `pixel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const pixelUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/api/track/pixel/${pixelId}`;
  
  const result = await db.query(
    `INSERT INTO email_logs (campaign_id, recipient_email, status, pixel_id)
     VALUES ($1, $2, 'sent', $3)
     RETURNING id`,
    [campaignId, recipientEmail, pixelId]
  );
  
  return {
    id: result.rows[0].id,
    campaignId,
    recipientEmail,
    pixelUrl
  };
}

export async function trackEmailOpen(pixelId: string) {
  await db.query(
    `UPDATE email_logs 
     SET opened = true, opened_at = NOW()
     WHERE pixel_id = $1`,
    [pixelId]
  );
}

export async function trackEmailClick(campaignId: string, recipientEmail: string, url: string) {
  await db.query(
    `UPDATE email_logs 
     SET clicked = true, clicked_at = NOW()
     WHERE campaign_id = $1 AND recipient_email = $2`,
    [campaignId, recipientEmail]
  );
  
  // Log the click with URL
  await db.query(
    `INSERT INTO email_clicks (campaign_id, recipient_email, url, clicked_at)
     VALUES ($1, $2, $3, NOW())`,
    [campaignId, recipientEmail, url]
  );
}

export async function getTrackingStats(campaignId: string) {
  const result = await db.query(`
    SELECT 
      COUNT(*) as total_sent,
      COUNT(CASE WHEN opened = true THEN 1 END) as total_opened,
      COUNT(CASE WHEN clicked = true THEN 1 END) as total_clicked,
      COUNT(CASE WHEN bounced = true THEN 1 END) as total_bounced,
      COUNT(CASE WHEN unsubscribed = true THEN 1 END) as total_unsubscribed
    FROM email_logs 
    WHERE campaign_id = $1
  `, [campaignId]);
  
  return result.rows[0];
}
