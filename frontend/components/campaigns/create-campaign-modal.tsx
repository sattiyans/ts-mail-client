"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { extractTemplateVariables, diffVariableSets } from "@/lib/template";

type ParsedCsv = { headers: string[]; rows: Record<string, string>[] };

export function CreateCampaignModal({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [csv, setCsv] = useState<ParsedCsv | null>(null);
  const [csvError, setCsvError] = useState<string | null>(null);
  const router = useRouter();

  const templateVars = useMemo(() => extractTemplateVariables(`${subject}\n${content}`), [subject, content]);
  const headers = csv?.headers || [];
  const diff = diffVariableSets(templateVars, headers);
  const isValid = templateVars.length > 0 && diff.missing.length === 0; // require all placeholders present

  const handleCsvUpload: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    setCsvError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length === 0) throw new Error("Empty CSV");
      const rawHeaders = lines[0].split(",").map((h) => h.trim());
      const rows = lines.slice(1).map((line) => {
        const values = line.split(",").map((v) => v.trim());
        const obj: Record<string, string> = {};
        rawHeaders.forEach((h, i) => {
          obj[h] = values[i] ?? "";
        });
        return obj;
      });
      setCsv({ headers: rawHeaders, rows });
    } catch (err: any) {
      setCsvError(err?.message || "Failed to parse CSV");
      setCsv(null);
    }
  };

  const handleGenerate = async () => {
    if (!isValid || !csv) return;
    const draft = {
      name: campaignName || "Untitled Campaign",
      subject,
      content,
      variables: templateVars,
      headers,
      rows: csv.rows,
      createdAt: new Date().toISOString(),
    };
    // Try backend first
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || "";
      const resp = await fetch(`${base}/api/v1/campaigns/drafts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (resp.ok) {
        const json = await resp.json();
        sessionStorage.setItem("campaign_draft", JSON.stringify({ ...draft, id: json.id }));
      } else {
        sessionStorage.setItem("campaign_draft", JSON.stringify(draft));
      }
    } catch {
      try { sessionStorage.setItem("campaign_draft", JSON.stringify(draft)); } catch {}
    }
    setOpen(false);
    router.push("/campaigns/builder");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? <Button>Create Campaign</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create Campaign</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Campaign Name</Label>
              <Input id="campaign-name" value={campaignName} onChange={(e) => setCampaignName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Welcome to {{company_name}}" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Email Content (HTML)
            </Label>
            <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} className="min-h-[160px] font-mono text-sm" placeholder="Hi {{first_name}}, ..." />
            <div className="text-xs text-muted-foreground">Detected placeholders:
              <span className="ml-2 space-x-1">
                {templateVars.length === 0 ? <span className="text-destructive">None</span> : templateVars.map((v) => (
                  <Badge key={v} variant="outline">{`{{${v}}}`}</Badge>
                ))}
              </span>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="csv">Upload Recipients CSV</Label>
            <Input id="csv" type="file" accept=".csv" onChange={handleCsvUpload} />
            {csvError && <p className="text-sm text-destructive">{csvError}</p>}
            {headers.length > 0 && (
              <div className="text-xs text-muted-foreground">CSV headers: <span className="space-x-1">{headers.map((h) => <Badge key={h} variant="secondary">{h}</Badge>)}</span></div>
            )}
          </div>

          <div className="rounded-md border p-3 text-sm">
            <p className="font-medium mb-2">Validation</p>
            {templateVars.length === 0 && (
              <p className="text-destructive">No placeholders found in template. Add variables like {"{{first_name}}"}.</p>
            )}
            {diff.missing.length > 0 && (
              <p className="text-destructive">Missing in CSV: {diff.missing.join(", ")}</p>
            )}
            {diff.extras.length > 0 && (
              <p className="text-muted-foreground">Extra CSV columns (ignored): {diff.extras.join(", ")}</p>
            )}
            {isValid && <p className="text-green-600">Looks good. All required variables are present in the CSV.</p>}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleGenerate} disabled={!isValid || !csv}>Generate Campaign</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


