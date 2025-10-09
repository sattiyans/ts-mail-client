"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { diffVariableSets } from "@/lib/template";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/use-toast";
import { Send, Clock, Loader2, Calendar } from "lucide-react";

type Draft = {
  name: string;
  subject: string;
  content: string;
  variables: string[];
  headers: string[];
  rows: Record<string, string>[];
  createdAt: string;
};

export default function CampaignBuilderPage() {
  const router = useRouter();
  const toast = useToast();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [sendResults, setSendResults] = useState<any>(null);
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduledAt, setScheduledAt] = useState('');

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("campaign_draft");
      if (!raw) return;
      const local = JSON.parse(raw) as Draft & { id?: string };
      if (local?.id) {
        const base = process.env.NEXT_PUBLIC_API_URL || "";
        fetch(`${base}/api/v1/campaigns/drafts/${local.id}`)
          .then(async (r) => (r.ok ? r.json() : local))
          .then((data) => setDraft(data))
          .catch(() => setDraft(local));
      } else {
        setDraft(local);
      }
    } catch {}
  }, []);

  const diff = useMemo(() => {
    return draft ? diffVariableSets(draft.variables, draft.headers) : { missing: [], extras: [] };
  }, [draft]);

  const handleSendCampaign = async () => {
    if (!draft || diff.missing.length > 0) return;
    
    setIsSending(true);
    try {
      // First create the campaign
      const campaignResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/v1/campaigns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: draft.name,
          subject: draft.subject,
          status: 'draft'
        })
      });
      
      const campaign = await campaignResponse.json();
      
      // Prepare recipients data
      const recipients = draft.rows.map(row => ({
        email: row.email || row.Email || Object.values(row)[0], // Assume first column or 'email' column
        variables: row
      }));
      
      // Send the campaign
      const sendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/v1/campaigns/${campaign.id}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients,
          subject: draft.subject,
          content: draft.content
        })
      });
      
      const results = await sendResponse.json();
      setSendResults(results);
      
      if (results.sent > 0) {
        toast.success(`Campaign sent successfully! ${results.sent} emails sent, ${results.failed} failed.`);
        // Clear the draft
        sessionStorage.removeItem("campaign_draft");
        router.push("/campaigns");
      } else {
        toast.error(`Campaign failed to send. ${results.errors?.[0]?.error || 'Unknown error'}`);
      }
    } catch (error: any) {
      toast.error(`Failed to send campaign: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleScheduleCampaign = async () => {
    if (!draft || diff.missing.length > 0 || !scheduledAt) return;
    
    setIsScheduling(true);
    try {
      // First create the campaign
      const campaignResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/v1/campaigns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: draft.name,
          subject: draft.subject,
          status: 'draft'
        })
      });
      
      const campaign = await campaignResponse.json();
      
      // Schedule the campaign
      const scheduleResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/v1/campaigns/${campaign.id}/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scheduledAt: new Date(scheduledAt).toISOString()
        })
      });
      
      if (scheduleResponse.ok) {
        toast.success(`Campaign scheduled for ${new Date(scheduledAt).toLocaleString()}`);
        // Clear the draft
        sessionStorage.removeItem("campaign_draft");
        router.push("/campaigns");
      } else {
        toast.error("Failed to schedule campaign");
      }
    } catch (error: any) {
      toast.error(`Failed to schedule campaign: ${error.message}`);
    } finally {
      setIsScheduling(false);
    }
  };

  if (!draft) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Campaign Builder</h2>
        <p className="text-muted-foreground">No draft found. Please start from Create Campaign.</p>
        <Button onClick={() => router.push("/campaigns")}>Back to Campaigns</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Campaign Builder</h2>
          <p className="text-muted-foreground">Review and finalize your campaign</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/campaigns")}>Cancel</Button>
          <Button disabled={diff.missing.length > 0}>Save Draft</Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button disabled={diff.missing.length > 0 || isSending}>
                {isSending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                Send Now
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Campaign</DialogTitle>
                <DialogDescription>
                  This will send emails to {draft?.rows.length || 0} recipients. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p><strong>Campaign:</strong> {draft?.name}</p>
                  <p><strong>Recipients:</strong> {draft?.rows.length || 0}</p>
                  <p><strong>Subject:</strong> {draft?.subject}</p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={handleSendCampaign} disabled={isSending}>
                    {isSending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                    Confirm Send
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" disabled={diff.missing.length > 0 || isScheduling}>
                {isScheduling ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Calendar className="h-4 w-4 mr-2" />}
                Schedule
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule Campaign</DialogTitle>
                <DialogDescription>
                  Schedule this campaign to be sent later to {draft?.rows.length || 0} recipients.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="schedule-time">Schedule Date & Time</Label>
                  <Input
                    id="schedule-time"
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  <p><strong>Campaign:</strong> {draft?.name}</p>
                  <p><strong>Recipients:</strong> {draft?.rows.length || 0}</p>
                  <p><strong>Subject:</strong> {draft?.subject}</p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={handleScheduleCampaign} disabled={isScheduling || !scheduledAt}>
                    {isScheduling ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Calendar className="h-4 w-4 mr-2" />}
                    Schedule Campaign
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Template</CardTitle>
            <CardDescription>Subject and HTML content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Subject</label>
              <Input value={draft.subject} readOnly />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Variables</label>
              <div className="flex flex-wrap gap-2">
                {draft.variables.map((v) => (
                  <Badge key={v} variant="outline">{`{{${v}}}`}</Badge>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">HTML</label>
              <Textarea value={draft.content} readOnly className="min-h-[160px] font-mono text-sm" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recipients</CardTitle>
            <CardDescription>CSV headers and validation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">CSV Headers</label>
              <div className="flex flex-wrap gap-2">
                {draft.headers.map((h) => (
                  <Badge key={h} variant="secondary">{h}</Badge>
                ))}
              </div>
            </div>
            <div className="rounded-md border p-3 text-sm">
              <p className="font-medium mb-2">Validation</p>
              {diff.missing.length > 0 && (
                <p className="text-destructive">Missing in CSV: {diff.missing.join(", ")}</p>
              )}
              {diff.extras.length > 0 && (
                <p className="text-muted-foreground">Extra CSV columns (ignored): {diff.extras.join(", ")}</p>
              )}
              {diff.missing.length === 0 && (
                <p className="text-green-600">All required variables are present.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recipient Preview</CardTitle>
          <CardDescription>First 10 rows</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {draft.headers.map((h) => (
                  <TableHead key={h}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {(draft.rows || []).slice(0, 10).map((row, idx) => (
                <TableRow key={idx}>
                  {draft.headers.map((h) => (
                    <TableCell key={h}>{row[h]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}


