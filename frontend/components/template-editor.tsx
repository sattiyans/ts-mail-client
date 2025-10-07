"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Eye, Save, X } from "lucide-react";

interface TemplateEditorProps {
  template?: {
    id: string;
    name: string;
    subject: string;
    content: string;
    category: string;
    variables: string[];
    createdAt?: string;
  };
  onSave?: (template: any) => void;
  trigger?: React.ReactNode;
  children?: React.ReactNode;
}

export function TemplateEditor({ template, onSave, trigger, children }: TemplateEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: template?.name || "",
    subject: template?.subject || "",
    content: template?.content || "",
    category: template?.category || "welcome",
  });
  const [previewData, setPreviewData] = useState({
    first_name: "John",
    company_name: "TS Mail Client",
    newsletter_title: "Weekly Update",
    date: new Date().toLocaleDateString(),
  });

  const handleSave = () => {
    const templateData = {
      ...formData,
      id: template?.id || Date.now().toString(),
      variables: extractVariables(formData.content),
      createdAt: template?.createdAt || new Date().toISOString(),
    };
    onSave?.(templateData);
    setIsOpen(false);
  };

  const extractVariables = (content: string) => {
    const matches = content.match(/\{\{([^}]+)\}\}/g);
    return matches ? matches.map(match => match.replace(/[{}]/g, '')) : [];
  };

  const renderPreview = () => {
    let previewContent = formData.content;
    Object.entries(previewData).forEach(([key, value]) => {
      previewContent = previewContent.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
    });
    return previewContent;
  };

  const availableVariables = [
    { name: "first_name", description: "Recipient's first name" },
    { name: "last_name", description: "Recipient's last name" },
    { name: "email", description: "Recipient's email address" },
    { name: "company_name", description: "Your company name" },
    { name: "newsletter_title", description: "Newsletter title" },
    { name: "date", description: "Current date" },
    { name: "product_name", description: "Product name" },
    { name: "price", description: "Product price" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || trigger || (
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Template
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {template ? "Edit Template" : "Create New Template"}
          </DialogTitle>
          <DialogDescription>
            {template ? "Modify your email template" : "Create a new email template with variables"}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Welcome Email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="welcome">Welcome</SelectItem>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                    <SelectItem value="promotional">Promotional</SelectItem>
                    <SelectItem value="transactional">Transactional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject Line</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g., Welcome to {{company_name}}!"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Email Content (HTML)</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter your HTML email content..."
                className="min-h-[300px] font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label>Available Variables</Label>
              <div className="flex flex-wrap gap-2">
                {availableVariables.map((variable) => (
                  <Badge
                    key={variable.name}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => {
                      const textarea = document.getElementById('content') as HTMLTextAreaElement;
                      if (textarea) {
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const text = textarea.value;
                        const before = text.substring(0, start);
                        const after = text.substring(end, text.length);
                        const newText = before + `{{${variable.name}}}` + after;
                        setFormData({ ...formData, content: newText });
                        setTimeout(() => {
                          textarea.focus();
                          textarea.setSelectionRange(start + variable.name.length + 4, start + variable.name.length + 4);
                        }, 0);
                      }
                    }}
                  >
                    {`{{${variable.name}}}`}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Click on a variable to insert it into your content
              </p>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <div className="space-y-2">
              <Label>Preview Data</Label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(previewData).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <Label htmlFor={key} className="text-xs">{key}</Label>
                    <Input
                      id={key}
                      value={value}
                      onChange={(e) => setPreviewData({ ...previewData, [key]: e.target.value })}
                      className="text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Subject Preview</Label>
              <div className="p-3 bg-muted rounded-md">
                {formData.subject.replace(/\{\{([^}]+)\}\}/g, (match, key) => previewData[key as keyof typeof previewData] || match)}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Content Preview</Label>
              <div className="border rounded-md p-4 bg-white dark:bg-gray-900">
                <div dangerouslySetInnerHTML={{ __html: renderPreview() }} />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
