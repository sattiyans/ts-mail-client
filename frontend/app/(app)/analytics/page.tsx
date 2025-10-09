"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Chart } from "@/components/chart";
import { getJSON } from "@/lib/api";
import { Mail, Send, Users, TrendingUp, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/use-toast";

type ApiAnalytics = {
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

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<ApiAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getJSON<ApiAnalytics>("/api/v1/analytics");
      setAnalytics(res);
    } catch (e: any) {
      setError(e?.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleRefresh = async () => {
    await fetchAnalytics();
    toast.success("Analytics refreshed successfully");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Analytics</h2>
            <p className="text-muted-foreground">
              Track your email performance and engagement metrics
            </p>
          </div>
          <Button disabled>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
                <div className="h-3 w-24 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Email Performance Over Time</CardTitle>
              <CardDescription>Loading chart...</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>Loading chart...</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Analytics</h2>
            <p className="text-muted-foreground">
              Track your email performance and engagement metrics
            </p>
          </div>
          <Button disabled>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Analytics</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" /> Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analytics) return null;

  // Chart data for email performance over time
  const emailPerformanceData = {
    labels: analytics.monthlyStats.map(stat => stat.month),
    datasets: [
      {
        label: 'Emails Sent',
        data: analytics.monthlyStats.map(stat => stat.emails),
        tension: 0.4,
      },
      {
        label: 'Opens',
        data: analytics.monthlyStats.map(stat => stat.opens),
        tension: 0.4,
      },
      {
        label: 'Clicks',
        data: analytics.monthlyStats.map(stat => stat.clicks),
        tension: 0.4,
      },
    ],
  };

  // Campaign performance data
  const campaignPerformanceData = {
    labels: analytics.topCampaigns.map(campaign => campaign.name),
    datasets: [
      {
        label: 'Open Rate (%)',
        data: analytics.topCampaigns.map(campaign => campaign.openRate),
        tension: 0.4,
      },
      {
        label: 'Click Rate (%)',
        data: analytics.topCampaigns.map(campaign => campaign.clickRate),
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-row items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">
            Track your email performance and engagement metrics
          </p>
        </div>
        <Button onClick={handleRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Emails</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalEmails.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              All time sent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.openRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Average across campaigns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.clickRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Average across campaigns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalSubscribers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total unique recipients
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Chart
          type="line"
          data={emailPerformanceData}
          title="Email Performance Over Time"
          description="Email metrics for the last 7 months"
        />

        <Chart
          type="bar"
          data={campaignPerformanceData}
          title="Top Campaign Performance"
          description="Best performing campaigns by open and click rates"
        />
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{analytics.bounceRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Emails that bounced
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Unsubscribe Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{analytics.unsubscribeRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Recipients who unsubscribed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalCampaigns}</div>
            <p className="text-xs text-muted-foreground">
              All time campaigns
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Campaigns</CardTitle>
          <CardDescription>
            Your best performing campaigns by open rate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.topCampaigns.map((campaign, index) => (
              <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{campaign.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {campaign.recipients.toLocaleString()} recipients
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{campaign.openRate.toFixed(1)}% open rate</p>
                  <p className="text-sm text-muted-foreground">
                    {campaign.clickRate.toFixed(1)}% click rate
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
