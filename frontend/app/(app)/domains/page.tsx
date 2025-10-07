import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Globe, CheckCircle, AlertCircle, Clock, MoreHorizontal, RefreshCw } from "lucide-react";
import { mockDomains } from "@/lib/mock-data";

export default function DomainsPage() {
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

  return (
    <div className="space-y-6">
          <div className="flex flex-row items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Domains</h2>
              <p className="text-muted-foreground">
                Manage your sending domains and verify their status
              </p>
            </div>
            <div className="flex flex-row items-center space-x-2">
              <Button variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Status
              </Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Domain
              </Button>
            </div>
          </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Domains</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDomains.length}</div>
            <p className="text-xs text-muted-foreground">
              {mockDomains.filter(d => d.status === 'verified').length} verified
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
              {mockDomains.filter(d => d.status === 'verified').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready for sending
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
              {mockDomains.filter(d => d.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting verification
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Domains Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Domains</CardTitle>
          <CardDescription>
            Complete list of your sending domains and their verification status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Domain</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>DNS Records</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDomains.map((domain) => (
                <TableRow key={domain.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{domain.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {domain.name.includes('newsletter') ? 'Newsletter subdomain' : 'Primary domain'}
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
                    <div className="space-y-1">
                      {domain.dnsRecords.map((record, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Badge 
                            variant={record.status === 'valid' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {record.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {record.status === 'valid' ? '✓' : record.status === 'invalid' ? '✗' : '⏳'}
                          </span>
                        </div>
                      ))}
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
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* DNS Setup Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>DNS Setup Instructions</CardTitle>
          <CardDescription>
            Follow these steps to verify your domain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">1. SPF Record</h4>
              <p className="text-sm text-muted-foreground">
                Add this TXT record to your domain's DNS settings:
              </p>
              <div className="bg-muted p-3 rounded-md font-mono text-sm">
                v=spf1 include:_spf.google.com ~all
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">2. DKIM Record</h4>
              <p className="text-sm text-muted-foreground">
                Add this CNAME record to your domain's DNS settings:
              </p>
              <div className="bg-muted p-3 rounded-md font-mono text-sm">
                mail._domainkey → mail.google.com
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">3. DMARC Record</h4>
              <p className="text-sm text-muted-foreground">
                Add this TXT record to your domain's DNS settings:
              </p>
              <div className="bg-muted p-3 rounded-md font-mono text-sm">
                v=DMARC1; p=quarantine; rua=mailto:dmarc@example.com
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
