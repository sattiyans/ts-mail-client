import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Plus, Send, Play, Pause, MoreHorizontal, Eye, Edit, Copy } from "lucide-react";
import { mockCampaigns } from "@/lib/mock-data";

export default function CampaignsPage() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Send className="h-4 w-4 text-green-500" />;
      case 'scheduled':
        return <Play className="h-4 w-4 text-blue-500" />;
      case 'draft':
        return <Edit className="h-4 w-4 text-yellow-500" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-red-500" />;
      case 'sending':
        return <Send className="h-4 w-4 text-blue-500 animate-pulse" />;
      default:
        return <Edit className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      sent: 'default',
      scheduled: 'secondary',
      draft: 'outline',
      paused: 'destructive',
      sending: 'secondary',
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateOpenRate = (campaign: { metrics: { delivered: number; opened: number } }) => {
    if (campaign.metrics.delivered === 0) return "0";
    return ((campaign.metrics.opened / campaign.metrics.delivered) * 100).toFixed(1);
  };

  const calculateClickRate = (campaign: { metrics: { delivered: number; clicked: number } }) => {
    if (campaign.metrics.delivered === 0) return "0";
    return ((campaign.metrics.clicked / campaign.metrics.delivered) * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
          <div className="flex flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Campaigns</h2>
              <p className="text-muted-foreground">
                Create and manage your email campaigns
              </p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCampaigns.length}</div>
            <p className="text-xs text-muted-foreground">
              {mockCampaigns.filter(c => c.status === 'sent').length} sent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recipients</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockCampaigns.reduce((sum, c) => sum + c.recipients, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all campaigns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Open Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold break-words overflow-hidden">
              {(
                mockCampaigns
                  .filter(c => c.status === 'sent')
                  .reduce((sum, c) => sum + parseFloat(calculateOpenRate(c)), 0) / 
                mockCampaigns.filter(c => c.status === 'sent').length || 0
              ).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Industry avg: 21.3%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Click Rate</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold break-words overflow-hidden">
              {(
                mockCampaigns
                  .filter(c => c.status === 'sent')
                  .reduce((sum, c) => sum + parseFloat(calculateClickRate(c)), 0) / 
                mockCampaigns.filter(c => c.status === 'sent').length || 0
              ).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Industry avg: 2.6%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
          <CardDescription>
            Complete list of your email campaigns and their performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Open Rate</TableHead>
                <TableHead>Click Rate</TableHead>
                <TableHead>Sent Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCampaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{campaign.name}</p>
                      <p className="text-sm text-muted-foreground">{campaign.subject}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(campaign.status)}
                      {getStatusBadge(campaign.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium">{campaign.recipients.toLocaleString()}</p>
                      <p className="text-muted-foreground">
                        {campaign.metrics.delivered.toLocaleString()} delivered
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{calculateOpenRate(campaign)}%</span>
                        <span>{campaign.metrics.opened.toLocaleString()}</span>
                      </div>
                      <Progress 
                        value={parseFloat(calculateOpenRate(campaign))} 
                        className="h-2 w-20" 
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{calculateClickRate(campaign)}%</span>
                        <span>{campaign.metrics.clicked.toLocaleString()}</span>
                      </div>
                      <Progress 
                        value={parseFloat(calculateClickRate(campaign))} 
                        className="h-2 w-20" 
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    {campaign.sentAt ? (
                      <span className="text-sm text-muted-foreground">
                        {formatDate(campaign.sentAt)}
                      </span>
                    ) : campaign.scheduledAt ? (
                      <span className="text-sm text-blue-600">
                        Scheduled: {formatDate(campaign.scheduledAt)}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">Not scheduled</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Send className="h-5 w-5" />
              <span>Create New Campaign</span>
            </CardTitle>
            <CardDescription>
              Start a new email campaign from scratch
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Copy className="h-5 w-5" />
              <span>Duplicate Campaign</span>
            </CardTitle>
            <CardDescription>
              Copy an existing campaign to save time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Edit className="h-5 w-5" />
              <span>Campaign Templates</span>
            </CardTitle>
            <CardDescription>
              Use pre-built campaign templates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <Edit className="mr-2 h-4 w-4" />
              Browse Templates
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
