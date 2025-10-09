import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export function generateToken(payload: { userId: string; email: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export function generateMagicLinkToken(email: string): string {
  // Magic link tokens expire in 15 minutes
  return jwt.sign({ email, type: 'magic_link' }, JWT_SECRET, { expiresIn: '15m' });
}

export function verifyMagicLinkToken(token: string): { email: string } | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    if (payload.type !== 'magic_link') return null;
    return { email: payload.email };
  } catch (error) {
    return null;
  }
}
