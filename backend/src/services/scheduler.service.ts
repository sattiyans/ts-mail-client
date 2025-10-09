import { db } from "../db";
import { executeCampaign } from "./campaign-execution.service";

export interface ScheduledCampaign {
  id: string;
  name: string;
  subject: string;
  templateId?: string;
  scheduledAt: string;
  status: string;
  createdAt: string;
}

export async function scheduleCampaign(campaignId: string, scheduledAt: string) {
  await db.query(
    'UPDATE campaigns SET status = $1, scheduled_at = $2 WHERE id = $3',
    ['scheduled', scheduledAt, campaignId]
  );
}

export async function getScheduledCampaigns(): Promise<ScheduledCampaign[]> {
  const result = await db.query(`
    SELECT c.id, c.name, c.subject, c.template_id as "templateId", 
           c.scheduled_at as "scheduledAt", c.status, c.created_at as "createdAt"
    FROM campaigns c
    WHERE c.status = 'scheduled' 
    AND c.scheduled_at IS NOT NULL
    ORDER BY c.scheduled_at ASC
  `);
  
  return result.rows;
}

export async function getCampaignsReadyToSend(): Promise<ScheduledCampaign[]> {
  const result = await db.query(`
    SELECT c.id, c.name, c.subject, c.template_id as "templateId", 
           c.scheduled_at as "scheduledAt", c.status, c.created_at as "createdAt"
    FROM campaigns c
    WHERE c.status = 'scheduled' 
    AND c.scheduled_at <= NOW()
    ORDER BY c.scheduled_at ASC
  `);
  
  return result.rows;
}

export async function cancelScheduledCampaign(campaignId: string) {
  await db.query(
    'UPDATE campaigns SET status = $1, scheduled_at = NULL WHERE id = $2',
    ['draft', campaignId]
  );
}

export async function processScheduledCampaigns() {
  const readyCampaigns = await getCampaignsReadyToSend();
  
  for (const campaign of readyCampaigns) {
    try {
      // Get campaign details with recipients
      const campaignDetails = await db.query(`
        SELECT d.name, d.subject, d.content, d.variables, d.headers, d.rows
        FROM drafts d
        WHERE d.id = (
          SELECT MAX(id) FROM drafts 
          WHERE name = $1 AND subject = $2
        )
      `, [campaign.name, campaign.subject]);
      
      if (campaignDetails.rows.length === 0) {
        console.warn(`No draft found for campaign ${campaign.id}`);
        continue;
      }
      
      const draft = campaignDetails.rows[0];
      
      // Prepare recipients
      const recipients = draft.rows.map((row: any) => ({
        email: row.email || row.Email || Object.values(row)[0],
        variables: row
      }));
      
      // Execute the campaign
      await executeCampaign({
        campaignId: campaign.id,
        recipients,
        subject: draft.subject,
        content: draft.content
      });
      
      console.log(`Successfully processed scheduled campaign: ${campaign.name}`);
      
    } catch (error) {
      console.error(`Failed to process scheduled campaign ${campaign.id}:`, error);
      
      // Mark campaign as failed
      await db.query(
        'UPDATE campaigns SET status = $1 WHERE id = $2',
        ['failed', campaign.id]
      );
    }
  }
}

// Function to start the scheduler (call this from server startup)
export function startScheduler() {
  // Check for scheduled campaigns every minute
  setInterval(async () => {
    try {
      await processScheduledCampaigns();
    } catch (error) {
      console.error('Scheduler error:', error);
    }
  }, 60000); // 1 minute
  
  console.log('Campaign scheduler started');
}
