import { promisify } from 'util';
import { resolveTxt, resolveMx } from 'dns';
import { db } from "../db";

const resolveTxtAsync = promisify(resolveTxt);
const resolveMxAsync = promisify(resolveMx);

export interface DomainVerificationResult {
  isValid: boolean;
  hasSpf: boolean;
  hasDkim: boolean;
  hasDmarc: boolean;
  hasMx: boolean;
  spfRecord?: string;
  dkimRecord?: string;
  dmarcRecord?: string;
  mxRecords?: Array<{ priority: number; exchange: string }>;
  errors: string[];
}

export async function verifyDomain(domain: string): Promise<DomainVerificationResult> {
  const result: DomainVerificationResult = {
    isValid: false,
    hasSpf: false,
    hasDkim: false,
    hasDmarc: false,
    hasMx: false,
    errors: []
  };

  try {
    // Check SPF record
    try {
      const spfRecords = await resolveTxtAsync(domain);
      const spfRecord = spfRecords.find(record => 
        record.some(r => r.startsWith('v=spf1'))
      );
      
      if (spfRecord) {
        result.hasSpf = true;
        result.spfRecord = spfRecord.join('');
      }
    } catch (error) {
      result.errors.push('No SPF record found');
    }

    // Check DMARC record
    try {
      const dmarcRecords = await resolveTxtAsync(`_dmarc.${domain}`);
      const dmarcRecord = dmarcRecords.find(record => 
        record.some(r => r.startsWith('v=DMARC1'))
      );
      
      if (dmarcRecord) {
        result.hasDmarc = true;
        result.dmarcRecord = dmarcRecord.join('');
      }
    } catch (error) {
      result.errors.push('No DMARC record found');
    }

    // Check MX records
    try {
      const mxRecords = await resolveMxAsync(domain);
      if (mxRecords && mxRecords.length > 0) {
        result.hasMx = true;
        result.mxRecords = mxRecords.map(mx => ({
          priority: mx.priority,
          exchange: mx.exchange
        }));
      }
    } catch (error) {
      result.errors.push('No MX records found');
    }

    // Check DKIM (this would typically be domain-specific)
    // For now, we'll just check if a DKIM selector exists
    try {
      const dkimRecords = await resolveTxtAsync(`default._domainkey.${domain}`);
      if (dkimRecords && dkimRecords.length > 0) {
        result.hasDkim = true;
        result.dkimRecord = dkimRecords[0].join('');
      }
    } catch (error) {
      result.errors.push('No DKIM record found');
    }

    // Domain is considered valid if it has SPF and MX records
    result.isValid = result.hasSpf && result.hasMx;

  } catch (error: any) {
    result.errors.push(`Domain verification failed: ${error.message}`);
  }

  return result;
}

export async function verifyDomainAndUpdate(domainId: string): Promise<DomainVerificationResult> {
  // Get domain from database
  const domainResult = await db.query(
    'SELECT domain FROM domains WHERE id = $1',
    [domainId]
  );

  if (domainResult.rows.length === 0) {
    throw new Error('Domain not found');
  }

  const domain = domainResult.rows[0].domain;
  const verificationResult = await verifyDomain(domain);

  // Update domain status based on verification result
  const status = verificationResult.isValid ? 'verified' : 'failed';
  const verifiedAt = verificationResult.isValid ? new Date().toISOString() : null;

  await db.query(
    'UPDATE domains SET status = $1, verified_at = $2 WHERE id = $3',
    [status, verifiedAt, domainId]
  );

  return verificationResult;
}

export async function generateDomainVerificationInstructions(domain: string) {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  
  return {
    domain,
    instructions: [
      {
        type: 'SPF',
        description: 'Add SPF record to authorize email sending',
        record: `v=spf1 include:_spf.google.com ~all`,
        host: '@',
        ttl: '3600'
      },
      {
        type: 'DMARC',
        description: 'Add DMARC policy for email authentication',
        record: `v=DMARC1; p=quarantine; rua=mailto:dmarc@${domain}`,
        host: '_dmarc',
        ttl: '3600'
      },
      {
        type: 'MX',
        description: 'Ensure MX records are configured for email delivery',
        record: `10 mail.${domain}`,
        host: '@',
        ttl: '3600'
      }
    ],
    verificationUrl: `${frontendUrl}/domains/verify/${domain}`
  };
}
