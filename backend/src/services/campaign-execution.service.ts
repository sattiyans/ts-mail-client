import { db } from "../db";
import { sendMail } from "./mailer";
import { logEmail } from "./email-logs.service";
import { getTemplateByIdSvc } from "./templates.service";

export interface CampaignExecutionOptions {
  campaignId: string;
  recipients: Array<{
    email: string;
    variables: Record<string, string>;
  }>;
  templateId?: string;
  subject?: string;
  content?: string;
  attachments?: Array<{
    filename: string;
    contentBase64: string;
    contentType?: string;
  }>;
}

export async function executeCampaign(options: CampaignExecutionOptions) {
  const { campaignId, recipients, templateId, subject, content, attachments } = options;
  
  let finalSubject = subject || '';
  let finalContent = content || '';
  
  // If template is provided, use it
  if (templateId) {
    const template = await getTemplateByIdSvc(templateId);
    if (template) {
      finalSubject = template.subject;
      finalContent = template.content;
    }
  }
  
  const results = {
    total: recipients.length,
    sent: 0,
    failed: 0,
    errors: [] as Array<{ email: string; error: string }>
  };
  
  // Process attachments
  const processedAttachments = attachments?.map(att => ({
    filename: att.filename,
    content: Buffer.from(att.contentBase64, 'base64'),
    contentType: att.contentType
  })) || [];
  
  // Send emails to all recipients
  for (const recipient of recipients) {
    try {
      // Replace template variables with recipient data
      let personalizedSubject = finalSubject;
      let personalizedContent = finalContent;
      
      Object.entries(recipient.variables).forEach(([key, value]) => {
        const placeholder = `{{${key}}}`;
        personalizedSubject = personalizedSubject.replace(new RegExp(placeholder, 'g'), value);
        personalizedContent = personalizedContent.replace(new RegExp(placeholder, 'g'), value);
      });
      
      // Send the email
      await sendMail({
        to: recipient.email,
        subject: personalizedSubject,
        html: personalizedContent,
        attachments: processedAttachments,
        campaignId,
        enableTracking: true
      });
      
      // Log successful send
      await logEmail({
        campaignId,
        recipientEmail: recipient.email,
        status: 'sent'
      });
      
      results.sent++;
      
      // Add a small delay to avoid overwhelming the SMTP server
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error: any) {
      // Log failed send
      await logEmail({
        campaignId,
        recipientEmail: recipient.email,
        status: 'error'
      });
      
      results.failed++;
      results.errors.push({
        email: recipient.email,
        error: error.message || 'Unknown error'
      });
    }
  }
  
  // Update campaign status
  await db.query(
    'UPDATE campaigns SET status = $1 WHERE id = $2',
    ['completed', campaignId]
  );
  
  return results;
}

export async function scheduleCampaign(campaignId: string, scheduledAt: string) {
  await db.query(
    'UPDATE campaigns SET status = $1, scheduled_at = $2 WHERE id = $3',
    ['scheduled', scheduledAt, campaignId]
  );
}

export async function getScheduledCampaigns() {
  const result = await db.query(`
    SELECT c.*, t.subject, t.content, t.variables
    FROM campaigns c
    LEFT JOIN templates t ON c.template_id = t.id
    WHERE c.status = 'scheduled' 
    AND c.scheduled_at <= NOW()
    ORDER BY c.scheduled_at ASC
  `);
  
  return result.rows;
}
