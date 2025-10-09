"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Globe, CheckCircle, AlertCircle, Clock, MoreHorizontal, RefreshCw, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getJSON, postJSON } from "@/lib/api";
import { useToast } from "@/lib/use-toast";

type ApiDomain = {
  id: string;
  domain: string;
  status: string;
  verifiedAt?: string | null;
  createdAt: string;
};

export default function DomainsPage() {
  const [items, setItems] = useState<ApiDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetchDomains = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getJSON<{ items: ApiDomain[] }>("/api/v1/domains");
      setItems(res.items || []);
    } catch (e: any) {
      setError(e?.message || "Failed to load domains");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  const handleAddDomain = async (domain: string) => {
    try {
      const newDomain = await postJSON<ApiDomain>("/api/v1/domains", {
        domain,
        status: "pending",
      });
      setItems(prev => [newDomain, ...prev]);
      toast.success("Domain added successfully");
    } catch (e: any) {
      toast.error(e?.message || "Failed to add domain");
    }
  };

  const handleVerifyDomain = async (domainId: string) => {
    try {
      const result = await postJSON<{ isValid: boolean; errors: string[] }>(`/api/v1/domains/${domainId}/verify`);
      if (result.isValid) {
        toast.success("Domain verified successfully!");
        fetchDomains(); // Refresh the list
      } else {
        toast.error(`Domain verification failed: ${result.errors.join(', ')}`);
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to verify domain");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      verified: 'default',
      pending: 'secondary',
      failed: 'destructive',
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
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Domains</h2>
            <p className="text-muted-foreground">
              Manage your sending domains
            </p>
          </div>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            Add Domain
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>All Domains</CardTitle>
            <CardDescription>
              Complete list of your sending domains
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">Loading domains...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Domains</h2>
            <p className="text-muted-foreground">
              Manage your sending domains
            </p>
          </div>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            Add Domain
          </Button>
        </div>
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Domains</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={fetchDomains}>
              <RefreshCw className="mr-2 h-4 w-4" /> Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-row items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Domains</h2>
          <p className="text-muted-foreground">
            Manage your sending domains
          </p>
        </div>
        <Button onClick={() => {
          const domain = prompt("Enter domain name:");
          if (domain) handleAddDomain(domain);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Domain
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Domains</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.length}</div>
            <p className="text-xs text-muted-foreground">
              {items.filter(d => d.status === 'verified').length} verified
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {items.filter(d => d.status === 'verified').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready to send
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {items.filter(d => d.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting verification
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {items.filter(d => d.status === 'failed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Needs attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Domains Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Domains</CardTitle>
          <CardDescription>
            Complete list of your sending domains
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Domain</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Added</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((domain) => (
                <TableRow key={domain.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{domain.domain}</p>
                        <p className="text-sm text-muted-foreground">
                          {domain.status === 'verified' ? 'Ready to send' : 'Verification required'}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(domain.status)}
                      {getStatusBadge(domain.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {domain.verifiedAt ? (
                      <span className="text-sm text-muted-foreground">
                        {formatDate(domain.verifiedAt)}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">Not verified</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(domain.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-1">
                      {domain.status === 'pending' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleVerifyDomain(domain.id)}
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Verify
                        </Button>
                      )}
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
              <Plus className="h-5 w-5" />
              <span>Add Domain</span>
            </CardTitle>
            <CardDescription>
              Add a new sending domain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full"
              onClick={() => {
                const domain = prompt("Enter domain name:");
                if (domain) handleAddDomain(domain);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Domain
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>DNS Setup</span>
            </CardTitle>
            <CardDescription>
              Configure DNS records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <Globe className="mr-2 h-4 w-4" />
              DNS Guide
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Verify Domain</span>
            </CardTitle>
            <CardDescription>
              Verify domain ownership
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <CheckCircle className="mr-2 h-4 w-4" />
              Verify Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}