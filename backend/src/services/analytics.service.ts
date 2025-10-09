import { db } from "../db";

export type AnalyticsOverview = {
  totalEmails: number;
  totalCampaigns: number;
  totalSubscribers: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  unsubscribeRate: number;
  monthlyStats: {
    month: string;
    emails: number;
    opens: number;
    clicks: number;
    bounces: number;
  }[];
  topCampaigns: {
    id: string;
    name: string;
    openRate: number;
    clickRate: number;
    recipients: number;
  }[];
};

export async function getAnalyticsOverviewSvc(): Promise<AnalyticsOverview> {
  // Get basic counts
  const [emailsResult, campaignsResult, subscribersResult] = await Promise.all([
    db.query(`select count(*) as count from email_logs`),
    db.query(`select count(*) as count from campaigns`),
    db.query(`select count(distinct recipient_email) as count from email_logs`),
  ]);

  const totalEmails = parseInt(emailsResult.rows[0]?.count || "0");
  const totalCampaigns = parseInt(campaignsResult.rows[0]?.count || "0");
  const totalSubscribers = parseInt(subscribersResult.rows[0]?.count || "0");

  // Get email metrics
  const metricsResult = await db.query(`
    select 
      count(case when opened = true then 1 end) as opens,
      count(case when clicked = true then 1 end) as clicks,
      count(case when bounced = true then 1 end) as bounces,
      count(case when status = 'unsubscribed' then 1 end) as unsubscribes,
      count(*) as total_sent
    from email_logs
    where status = 'sent'
  `);

  const metrics = metricsResult.rows[0];
  const totalSent = parseInt(metrics?.total_sent || "0");
  const opens = parseInt(metrics?.opens || "0");
  const clicks = parseInt(metrics?.clicks || "0");
  const bounces = parseInt(metrics?.bounces || "0");
  const unsubscribes = parseInt(metrics?.unsubscribes || "0");

  const openRate = totalSent > 0 ? (opens / totalSent) * 100 : 0;
  const clickRate = totalSent > 0 ? (clicks / totalSent) * 100 : 0;
  const bounceRate = totalSent > 0 ? (bounces / totalSent) * 100 : 0;
  const unsubscribeRate = totalSent > 0 ? (unsubscribes / totalSent) * 100 : 0;

  // Get monthly stats (last 7 months)
  const monthlyResult = await db.query(`
    select 
      to_char(created_at, 'Mon YYYY') as month,
      count(*) as emails,
      count(case when opened = true then 1 end) as opens,
      count(case when clicked = true then 1 end) as clicks,
      count(case when bounced = true then 1 end) as bounces
    from email_logs
    where created_at >= now() - interval '7 months'
    group by to_char(created_at, 'Mon YYYY')
    order by min(created_at) desc
  `);

  const monthlyStats = monthlyResult.rows.map(row => ({
    month: row.month,
    emails: parseInt(row.emails || "0"),
    opens: parseInt(row.opens || "0"),
    clicks: parseInt(row.clicks || "0"),
    bounces: parseInt(row.bounces || "0"),
  }));

  // Get top campaigns by open rate
  const topCampaignsResult = await db.query(`
    select 
      c.id,
      c.name,
      count(el.id) as recipients,
      count(case when el.opened = true then 1 end) as opens,
      count(case when el.clicked = true then 1 end) as clicks
    from campaigns c
    left join email_logs el on el.campaign_id = c.id
    where el.status = 'sent'
    group by c.id, c.name
    having count(el.id) > 0
    order by (count(case when el.opened = true then 1 end)::float / count(el.id)) desc
    limit 5
  `);

  const topCampaigns = topCampaignsResult.rows.map(row => {
    const recipients = parseInt(row.recipients || "0");
    const opens = parseInt(row.opens || "0");
    const clicks = parseInt(row.clicks || "0");
    
    return {
      id: row.id,
      name: row.name,
      openRate: recipients > 0 ? (opens / recipients) * 100 : 0,
      clickRate: recipients > 0 ? (clicks / recipients) * 100 : 0,
      recipients,
    };
  });

  return {
    totalEmails,
    totalCampaigns,
    totalSubscribers,
    openRate,
    clickRate,
    bounceRate,
    unsubscribeRate,
    monthlyStats,
    topCampaigns,
  };
}
