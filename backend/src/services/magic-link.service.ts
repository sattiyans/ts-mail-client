import { sendMail } from './mailer';
import { generateMagicLinkToken } from './jwt.service';

export async function sendMagicLinkEmail(email: string, firstName: string, isRegistration: boolean = false) {
  const token = generateMagicLinkToken(email);
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const magicLink = `${frontendUrl}/auth/verify?token=${token}`;
  
  const subject = isRegistration 
    ? 'Welcome! Verify your email address' 
    : 'Sign in to your account';
    
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .button { display: inline-block; padding: 12px 24px; background-color: #000; color: white; text-decoration: none; border-radius: 6px; font-weight: 500; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #666; }
        .warning { background-color: #fef3cd; border: 1px solid #fecba1; padding: 15px; border-radius: 6px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>TS Mail Client</h1>
        </div>
        
        <h2>Hello ${firstName}!</h2>
        
        <p>${isRegistration ? 'Thank you for signing up!' : 'You requested to sign in to your account.'}</p>
        
        <p>Click the button below to ${isRegistration ? 'verify your email and complete your registration' : 'sign in'}:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${magicLink}" class="button">${isRegistration ? 'Verify Email' : 'Sign In'}</a>
        </div>
        
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 4px; font-family: monospace;">${magicLink}</p>
        
        <div class="warning">
          <strong>Security Notice:</strong> This link will expire in 15 minutes for your security. If you didn't request this ${isRegistration ? 'verification' : 'sign-in'}, please ignore this email.
        </div>
        
        <div class="footer">
          <p>This email was sent by TS Mail Client. If you have any questions, please contact support.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await sendMail({
    to: email,
    subject,
    html
  });
  
  return { token, magicLink };
}
