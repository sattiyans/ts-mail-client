// Mock data for TS Mail Client
export interface Domain {
  id: string;
  name: string;
  status: 'verified' | 'pending' | 'failed';
  verifiedAt?: string;
  dnsRecords: {
    type: string;
    name: string;
    value: string;
    status: 'valid' | 'invalid' | 'pending';
  }[];
  createdAt: string;
}

export interface Template {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: 'welcome' | 'newsletter' | 'promotional' | 'transactional';
  lastUsed?: string;
  createdAt: string;
  variables: string[];
}

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused';
  templateId: string;
  recipients: number;
  sentAt?: string;
  scheduledAt?: string;
  metrics: {
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
  };
  createdAt: string;
}

export interface EmailLog {
  id: string;
  campaignId: string;
  recipient: string;
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'unsubscribed';
  timestamp: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface AnalyticsData {
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
}

// Mock Data
export const mockDomains: Domain[] = [
  {
    id: '1',
    name: 'example.com',
    status: 'verified',
    verifiedAt: '2024-01-15T10:30:00Z',
    dnsRecords: [
      {
        type: 'TXT',
        name: 'example.com',
        value: 'v=spf1 include:_spf.google.com ~all',
        status: 'valid'
      },
      {
        type: 'CNAME',
        name: 'mail.example.com',
        value: 'mail.google.com',
        status: 'valid'
      }
    ],
    createdAt: '2024-01-10T09:00:00Z'
  },
  {
    id: '2',
    name: 'newsletter.example.com',
    status: 'verified',
    verifiedAt: '2024-01-20T14:15:00Z',
    dnsRecords: [
      {
        type: 'TXT',
        name: 'newsletter.example.com',
        value: 'v=spf1 include:_spf.google.com ~all',
        status: 'valid'
      }
    ],
    createdAt: '2024-01-18T11:30:00Z'
  },
  {
    id: '3',
    name: 'newdomain.com',
    status: 'pending',
    dnsRecords: [
      {
        type: 'TXT',
        name: 'newdomain.com',
        value: 'v=spf1 include:_spf.google.com ~all',
        status: 'pending'
      }
    ],
    createdAt: '2024-01-25T16:45:00Z'
  }
];

export const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Welcome Email',
    subject: 'Welcome to \{\{company_name\}\}!',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Welcome \{\{first_name\}\}!</h1>
        <p>Thank you for joining \{\{company_name\}\}. We're excited to have you on board!</p>
        <p>Here's what you can expect:</p>
        <ul>
          <li>Weekly newsletters with industry insights</li>
          <li>Exclusive offers and promotions</li>
          <li>Product updates and announcements</li>
        </ul>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <p>Best regards,<br>The \{\{company_name\}\} Team</p>
      </div>
    `,
    category: 'welcome',
    lastUsed: '2024-01-28T10:00:00Z',
    createdAt: '2024-01-15T09:00:00Z',
    variables: ['first_name', 'company_name']
  },
  {
    id: '2',
    name: 'Weekly Newsletter',
    subject: '\{\{newsletter_title\}\} - Week of \{\{date\}\}',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>\{\{newsletter_title\}\}</h1>
        <p>Hello \{\{first_name\}\},</p>
        <p>Here's what's happening this week:</p>
        <h2>Featured Article</h2>
        <p>\{\{featured_article_content\}\}</p>
        <h2>Industry News</h2>
        <p>\{\{industry_news\}\}</p>
        <h2>Upcoming Events</h2>
        <p>\{\{upcoming_events\}\}</p>
        <p>Thanks for reading!</p>
      </div>
    `,
    category: 'newsletter',
    lastUsed: '2024-01-26T08:00:00Z',
    createdAt: '2024-01-20T14:30:00Z',
    variables: ['first_name', 'newsletter_title', 'date', 'featured_article_content', 'industry_news', 'upcoming_events']
  },
  {
    id: '3',
    name: 'Product Launch',
    subject: '🚀 Introducing \{\{product_name\}\} - Available Now!',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>🚀 \{\{product_name\}\} is Here!</h1>
        <p>Dear \{\{first_name\}\},</p>
        <p>We're thrilled to announce the launch of \{\{product_name\}\}!</p>
        <h2>What's New:</h2>
        <ul>
          <li>\{\{feature_1\}\}</li>
          <li>\{\{feature_2\}\}</li>
          <li>\{\{feature_3\}\}</li>
        </ul>
        <p>Get \{\{product_name\}\} now for just $\{\{price\}\}!</p>
        <a href="\{\{product_url\}\}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Shop Now</a>
        <p>Limited time offer - Don't miss out!</p>
      </div>
    `,
    category: 'promotional',
    lastUsed: '2024-01-24T12:00:00Z',
    createdAt: '2024-01-22T10:15:00Z',
    variables: ['first_name', 'product_name', 'feature_1', 'feature_2', 'feature_3', 'price', 'product_url']
  }
];

export const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Welcome Series',
    subject: 'Welcome to TS Mail Client!',
    status: 'sent',
    templateId: '1',
    recipients: 1234,
    sentAt: '2024-01-28T10:00:00Z',
    metrics: {
      delivered: 1200,
      opened: 294,
      clicked: 98,
      bounced: 34,
      unsubscribed: 12
    },
    createdAt: '2024-01-25T09:00:00Z'
  },
  {
    id: '2',
    name: 'Product Launch Announcement',
    subject: '🚀 Introducing New Features - Available Now!',
    status: 'sent',
    templateId: '3',
    recipients: 856,
    sentAt: '2024-01-24T12:00:00Z',
    metrics: {
      delivered: 820,
      opened: 256,
      clicked: 110,
      bounced: 36,
      unsubscribed: 8
    },
    createdAt: '2024-01-22T10:15:00Z'
  },
  {
    id: '3',
    name: 'Weekly Newsletter #42',
    subject: 'Industry Insights - Week of January 22',
    status: 'sent',
    templateId: '2',
    recipients: 2100,
    sentAt: '2024-01-26T08:00:00Z',
    metrics: {
      delivered: 2050,
      opened: 393,
      clicked: 113,
      bounced: 50,
      unsubscribed: 15
    },
    createdAt: '2024-01-24T16:30:00Z'
  },
  {
    id: '4',
    name: 'Black Friday Sale',
    subject: '🔥 Black Friday: 50% Off Everything!',
    status: 'scheduled',
    templateId: '3',
    recipients: 2500,
    scheduledAt: '2024-11-29T00:00:00Z',
    metrics: {
      delivered: 0,
      opened: 0,
      clicked: 0,
      bounced: 0,
      unsubscribed: 0
    },
    createdAt: '2024-01-20T14:00:00Z'
  },
  {
    id: '5',
    name: 'Monthly Report',
    subject: 'Your January Performance Report',
    status: 'draft',
    templateId: '2',
    recipients: 0,
    metrics: {
      delivered: 0,
      opened: 0,
      clicked: 0,
      bounced: 0,
      unsubscribed: 0
    },
    createdAt: '2024-01-30T11:00:00Z'
  }
];

export const mockAnalytics: AnalyticsData = {
  totalEmails: 12345,
  totalCampaigns: 23,
  totalSubscribers: 2350,
  openRate: 24.5,
  clickRate: 8.2,
  bounceRate: 3.2,
  unsubscribeRate: 0.8,
  monthlyStats: [
    { month: 'Jul 2023', emails: 850, opens: 204, clicks: 68, bounces: 27 },
    { month: 'Aug 2023', emails: 920, opens: 221, clicks: 74, bounces: 29 },
    { month: 'Sep 2023', emails: 1100, opens: 264, clicks: 88, bounces: 35 },
    { month: 'Oct 2023', emails: 1250, opens: 300, clicks: 100, bounces: 40 },
    { month: 'Nov 2023', emails: 1400, opens: 336, clicks: 112, bounces: 45 },
    { month: 'Dec 2023', emails: 1600, opens: 384, clicks: 128, bounces: 51 },
    { month: 'Jan 2024', emails: 1800, opens: 432, clicks: 144, bounces: 58 }
  ],
  topCampaigns: [
    { id: '2', name: 'Product Launch Announcement', openRate: 31.2, clickRate: 13.4, recipients: 856 },
    { id: '1', name: 'Welcome Series', openRate: 24.5, clickRate: 8.2, recipients: 1234 },
    { id: '3', name: 'Weekly Newsletter #42', openRate: 19.2, clickRate: 5.5, recipients: 2100 }
  ]
};

export const mockEmailLogs: EmailLog[] = [
  {
    id: '1',
    campaignId: '1',
    recipient: 'john.doe@example.com',
    status: 'opened',
    timestamp: '2024-01-28T10:15:00Z',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    ipAddress: '192.168.1.100'
  },
  {
    id: '2',
    campaignId: '1',
    recipient: 'jane.smith@example.com',
    status: 'clicked',
    timestamp: '2024-01-28T10:20:00Z',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    ipAddress: '192.168.1.101'
  },
  {
    id: '3',
    campaignId: '2',
    recipient: 'bob.wilson@example.com',
    status: 'delivered',
    timestamp: '2024-01-24T12:05:00Z',
    ipAddress: '192.168.1.102'
  }
];
