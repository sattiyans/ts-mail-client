"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Chart } from "@/components/chart";
import { DashboardCardSkeleton, ChartSkeleton, CampaignSkeleton } from "@/components/skeletons";
import { Mail, Send, Users, TrendingUp, Clock, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { getJSON } from "@/lib/api";
import { useLoading } from "@/lib/loading-context";
import { useToast } from "@/lib/use-toast";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { setLoadingMessage } = useLoading();
  const toast = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load campaigns for dashboard
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await getJSON<{ items: any[] }>("/api/v1/campaigns");
        if (active) setItems(res.items || []);
      } catch (e: any) {
        if (active) setError(e?.message || "Failed to load dashboard data");
      } finally {
        if (active) setIsLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setLoadingMessage("Refreshing dashboard data...");
    try {
      const res = await getJSON<{ items: any[] }>("/api/v1/campaigns");
      setItems(res.items || []);
    } catch {}
    setIsRefreshing(false);
    toast.success("Dashboard refreshed successfully");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Welcome back! Here&apos;s what&apos;s happening with your campaigns.
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="animate-in fade-in-0 slide-in-from-right-4"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        {/* Loading skeletons */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Campaigns</CardTitle>
              <CardDescription>
                Your latest email campaigns and their performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CampaignSkeleton />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Key performance indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between">
                      <div className="h-3 w-16 bg-muted animate-pulse rounded" />
                      <div className="h-3 w-8 bg-muted animate-pulse rounded" />
                    </div>
                    <div className="h-2 w-full bg-muted animate-pulse rounded" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Chart data for email performance over time
  // Placeholder until backend provides timeseries
  const emailPerformanceData = {
    labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul"],
    datasets: [
      { label: 'Emails Sent', data: [0,0,0,0,0,0,0], tension: 0.4 },
      { label: 'Opens', data: [0,0,0,0,0,0,0], tension: 0.4 },
      { label: 'Clicks', data: [0,0,0,0,0,0,0], tension: 0.4 },
    ],
  };

  // Campaign status distribution
  const campaignStatusData = {
    labels: ['Sent', 'Scheduled', 'Draft', 'Paused'],
    datasets: [
      {
        data: [
          items.filter(c => c.status === 'sent').length,
          items.filter(c => c.status === 'scheduled').length,
          items.filter(c => c.status === 'draft').length,
          items.filter(c => c.status === 'paused').length,
        ],
      },
    ],
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'scheduled':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'draft':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'paused':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      sent: 'default',
      scheduled: 'secondary',
      draft: 'outline',
      paused: 'destructive',
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-row items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening with your campaigns.
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="animate-in fade-in-0 slide-in-from-right-4"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Emails</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.reduce((s, c) => s + (c.metrics?.delivered ?? 0), 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campaigns</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.length}</div>
            <p className="text-xs text-muted-foreground">
              {mockCampaigns.filter(c => c.status === 'sent').length} sent this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              +180 new subscribers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold break-words overflow-hidden">{(() => {
              const delivered = items.reduce((s, c) => s + (c.metrics?.delivered ?? 0), 0);
              const opened = items.reduce((s, c) => s + (c.metrics?.opened ?? 0), 0);
              if (delivered === 0) return '0';
              return ((opened / delivered) * 100).toFixed(1);
            })()}%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
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
          type="doughnut"
          data={campaignStatusData}
          title="Campaign Status Distribution"
          description="Current status of all campaigns"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
            <CardDescription>
              Your latest email campaigns and their performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.slice(0, 3).map((campaign) => (
                <div key={campaign.id} className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(campaign.status)}
                    {getStatusBadge(campaign.status)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{campaign.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(campaign.recipients ?? 0).toLocaleString()} recipients
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {(campaign.metrics?.delivered ?? 0) > 0 
                        ? `${(((campaign.metrics?.opened ?? 0) / (campaign.metrics?.delivered ?? 1)) * 100).toFixed(1)}%`
                        : '0%'
                      } open rate
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(campaign as any).sentAt 
                        ? new Date((campaign as any).sentAt).toLocaleDateString()
                        : 'Not sent'
                      }
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>
              Key performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Open Rate</span>
                <span>{(() => {
                  const delivered = items.reduce((s, c) => s + (c.metrics?.delivered ?? 0), 0);
                  const opened = items.reduce((s, c) => s + (c.metrics?.opened ?? 0), 0);
                  if (delivered === 0) return '0';
                  return ((opened / delivered) * 100).toFixed(1);
                })()}%</span>
              </div>
              <Progress value={parseFloat((() => {
                const delivered = items.reduce((s, c) => s + (c.metrics?.delivered ?? 0), 0);
                const opened = items.reduce((s, c) => s + (c.metrics?.opened ?? 0), 0);
                if (delivered === 0) return '0';
                return ((opened / delivered) * 100).toFixed(1);
              })())} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Click Rate</span>
                <span>{(() => {
                  const delivered = items.reduce((s, c) => s + (c.metrics?.delivered ?? 0), 0);
                  const clicked = items.reduce((s, c) => s + (c.metrics?.clicked ?? 0), 0);
                  if (delivered === 0) return '0';
                  return ((clicked / delivered) * 100).toFixed(1);
                })()}%</span>
              </div>
              <Progress value={parseFloat((() => {
                const delivered = items.reduce((s, c) => s + (c.metrics?.delivered ?? 0), 0);
                const clicked = items.reduce((s, c) => s + (c.metrics?.clicked ?? 0), 0);
                if (delivered === 0) return '0';
                return ((clicked / delivered) * 100).toFixed(1);
              })())} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Bounce Rate</span>
                <span>0%</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Unsubscribe Rate</span>
                <span>0%</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Campaigns</CardTitle>
          <CardDescription>
            Your best performing campaigns by open rate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.slice(0, 3).map((campaign, index) => (
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
                  <p className="font-medium">{(() => {
                    const d = campaign.metrics?.delivered ?? 0;
                    const o = campaign.metrics?.opened ?? 0;
                    return d === 0 ? '0' : ((o / d) * 100).toFixed(1);
                  })()}% open rate</p>
                  <p className="text-sm text-muted-foreground">{(() => {
                    const d = campaign.metrics?.delivered ?? 0;
                    const c = campaign.metrics?.clicked ?? 0;
                    return d === 0 ? '0' : ((c / d) * 100).toFixed(1);
                  })()}% click rate</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
