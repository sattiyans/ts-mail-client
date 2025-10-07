"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, FileText, Edit, Copy, Eye, Trash2, Calendar } from "lucide-react";
import { mockTemplates } from "@/lib/mock-data";
import { TemplateEditor } from "@/components/template-editor";

export default function TemplatesPage() {
  const getCategoryBadge = (category: string) => {
    const variants = {
      welcome: 'default',
      newsletter: 'secondary',
      promotional: 'destructive',
      transactional: 'outline',
    } as const;
    
    return (
      <Badge variant={variants[category as keyof typeof variants] || 'outline'}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleSaveTemplate = (template: any) => {
    console.log('Saving template:', template);
    // In a real app, this would save to the database
  };

  return (
    <div className="space-y-6">
          <div className="flex flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Templates</h2>
              <p className="text-muted-foreground">
                Create and manage your email templates
              </p>
            </div>
            <TemplateEditor onSave={handleSaveTemplate}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Template
              </Button>
            </TemplateEditor>
          </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTemplates.length}</div>
            <p className="text-xs text-muted-foreground">
              {mockTemplates.filter(t => t.lastUsed).length} used recently
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Welcome</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockTemplates.filter(t => t.category === 'welcome').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Onboarding templates
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Newsletter</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {mockTemplates.filter(t => t.category === 'newsletter').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Regular updates
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promotional</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {mockTemplates.filter(t => t.category === 'promotional').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Marketing campaigns
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Templates Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Templates</CardTitle>
          <CardDescription>
            Complete list of your email templates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Variables</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{template.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {template.variables.length} variables
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getCategoryBadge(template.category)}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px]">
                      <p className="text-sm font-medium truncate">{template.subject}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {template.variables.slice(0, 2).map((variable) => (
                        <Badge key={variable} variant="outline" className="text-xs">
                          {`{{${variable}}}`}
                        </Badge>
                      ))}
                      {template.variables.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.variables.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {template.lastUsed ? (
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {formatDate(template.lastUsed)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Never used</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(template.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <TemplateEditor template={template} onSave={handleSaveTemplate}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TemplateEditor>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
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
              <Plus className="h-5 w-5" />
              <span>Create Template</span>
            </CardTitle>
            <CardDescription>
              Start with a blank template
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TemplateEditor onSave={handleSaveTemplate}>
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Create Template
              </Button>
            </TemplateEditor>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Copy className="h-5 w-5" />
              <span>Template Library</span>
            </CardTitle>
            <CardDescription>
              Browse pre-built templates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <Copy className="mr-2 h-4 w-4" />
              Browse Library
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Import Template</span>
            </CardTitle>
            <CardDescription>
              Import from HTML file
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              Import HTML
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
