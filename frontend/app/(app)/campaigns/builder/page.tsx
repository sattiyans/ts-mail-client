"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { diffVariableSets } from "@/lib/template";
import { useRouter } from "next/navigation";

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
  const [draft, setDraft] = useState<Draft | null>(null);

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
          <Button disabled={diff.missing.length > 0}>Schedule/Send</Button>
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


