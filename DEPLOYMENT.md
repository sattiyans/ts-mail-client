# 🚀 Deployment Guide

This guide walks you through deploying the TS Mail Client monorepo to production.

## 📋 Prerequisites

- [Vercel account](https://vercel.com) (for frontend)
- [Render account](https://render.com) (for backend + database)
- [GitHub repository](https://github.com) (connected to both services)

## 🗄️ Step 1: Database Setup (Render)

1. **Create PostgreSQL Database on Render:**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "PostgreSQL"
   - Name: `ts-mail-client-db`
   - Region: Choose closest to your users
   - Plan: Free tier (or paid for production)
   - Click "Create Database"

2. **Get Database URL:**
   - Copy the "External Database URL" from Render dashboard
   - Format: `postgresql://username:password@host:port/database`

3. **Apply Database Schema:**
   ```bash
   # Connect to your Render database and run:
   psql "your-database-url" -f backend/db/schema.sql
   ```
   
   **Schema includes these tables:**
   - `users` - User accounts and profiles
   - `domains` - Sending domains with verification status
   - `templates` - Email templates with variables
   - `campaigns` - Email campaigns with scheduling
   - `email_logs` - Email sending logs with tracking data
   - `email_clicks` - Click tracking data
   - `drafts` - Campaign drafts with CSV data

## 🔧 Step 2: Backend Deployment (Render)

1. **Create Web Service on Render:**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name:** `ts-mail-client-backend`
     - **Root Directory:** `backend`
     - **Environment:** `Node`
     - **Build Command:** `npm install && npm run build`
     - **Start Command:** `npm run start`
     - **Plan:** Free tier (or paid for production)

2. **Set Environment Variables:**
   
   **Required Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=postgresql://username:password@host:port/database
   JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
   FRONTEND_URL=https://your-frontend-app.vercel.app
   ```
   
   **SMTP Configuration (Choose one provider):**
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM=no-reply@yourdomain.com
   ```
   
   **Optional Variables:**
   ```
   CORS_ORIGIN=https://your-frontend-app.vercel.app
   JWT_EXPIRES_IN=24h
   ```

3. **Deploy:**
   - Click "Create Web Service"
   - Render will automatically build and deploy
   - Note the service URL: `https://your-backend-app.onrender.com`

## 🎨 Step 3: Frontend Deployment (Vercel)

1. **Import Project to Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset:** Next.js
     - **Root Directory:** `frontend`
     - **Build Command:** `npm run build`
     - **Output Directory:** `.next`

2. **Set Environment Variables:**
   
   **Required Variables:**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-app.onrender.com
   ```
   
   **Optional Variables:**
   ```
   NEXT_PUBLIC_APP_NAME=TS Mail Client
   NEXT_PUBLIC_APP_URL=https://your-frontend-app.vercel.app
   ```

3. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically build and deploy
   - Note the frontend URL: `https://your-frontend-app.vercel.app`

## 🔗 Step 4: Connect Frontend to Backend

1. **Update Backend CORS:**
   - In Render dashboard, update `FRONTEND_URL` environment variable
   - Set to your Vercel frontend URL

2. **Update Frontend API URL:**
   - In Vercel dashboard, update `NEXT_PUBLIC_API_URL`
   - Set to your Render backend URL

3. **Redeploy Both Services:**
   - Trigger redeploy on both Vercel and Render
   - Or push a new commit to trigger automatic deployment

## ✅ Step 5: Verify Deployment

1. **Test Backend Health:**
   ```bash
   curl https://your-backend-app.onrender.com/api/v1/health
   ```

2. **Test Frontend:**
   - Visit your Vercel URL
   - Check browser console for any API errors
   - Test login/register functionality

3. **Test Database Connection:**
   - Try creating a campaign or template
   - Check if data persists after page refresh

## 🔧 Step 6: SMTP Configuration

Choose one of these email providers:

### Gmail SMTP
1. **Enable 2-factor authentication** on your Google account
2. **Generate an App Password:**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Use these settings:**
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-character-app-password
   SMTP_FROM=your-email@gmail.com
   ```

### SendGrid SMTP
1. **Create SendGrid account** at [sendgrid.com](https://sendgrid.com)
2. **Verify your sender identity** (email or domain)
3. **Generate API key:**
   - Go to Settings → API Keys
   - Create API Key with "Mail Send" permissions
4. **Use these settings:**
   ```
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=your-sendgrid-api-key
   SMTP_FROM=verified-email@yourdomain.com
   ```

### Resend SMTP
1. **Create Resend account** at [resend.com](https://resend.com)
2. **Verify your domain** or use sandbox mode
3. **Generate API key:**
   - Go to API Keys section
   - Create new API key
4. **Use these settings:**
   ```
   SMTP_HOST=smtp.resend.com
   SMTP_PORT=587
   SMTP_USER=resend
   SMTP_PASS=your-resend-api-key
   SMTP_FROM=verified-email@yourdomain.com
   ```

### Mailgun SMTP
1. **Create Mailgun account** at [mailgun.com](https://mailgun.com)
2. **Verify your domain**
3. **Get SMTP credentials:**
   - Go to Sending → Domains → SMTP
4. **Use these settings:**
   ```
   SMTP_HOST=smtp.mailgun.org
   SMTP_PORT=587
   SMTP_USER=postmaster@your-domain.mailgun.org
   SMTP_PASS=your-mailgun-smtp-password
   SMTP_FROM=verified-email@yourdomain.com
   ```

## 📋 Complete Environment Variables Reference

### Backend Environment Variables (Render)

**Core Application:**
```
NODE_ENV=production
PORT=10000
```

**Database:**
```
DATABASE_URL=postgresql://username:password@host:port/database
```

**Authentication:**
```
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_EXPIRES_IN=24h
```

**Frontend Integration:**
```
FRONTEND_URL=https://your-frontend-app.vercel.app
CORS_ORIGIN=https://your-frontend-app.vercel.app
```

**SMTP Configuration (Choose one provider):**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=no-reply@yourdomain.com
```

### Frontend Environment Variables (Vercel)

**API Configuration:**
```
NEXT_PUBLIC_API_URL=https://your-backend-app.onrender.com
```

**App Configuration:**
```
NEXT_PUBLIC_APP_NAME=TS Mail Client
NEXT_PUBLIC_APP_URL=https://your-frontend-app.vercel.app
```

## 🧪 Testing Email Functionality

After deployment, test these features:

1. **User Registration:**
   - Register a new account
   - Check email for magic link
   - Click magic link to verify

2. **Email Sending:**
   - Create a template
   - Upload CSV with recipients
   - Send test campaign
   - Verify emails are delivered

3. **Email Tracking:**
   - Open sent emails
   - Click links in emails
   - Check analytics dashboard for tracking data

4. **Domain Verification:**
   - Add a domain
   - Run verification
   - Check DNS records are detected

## 🚨 Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Ensure `FRONTEND_URL` in backend matches your Vercel URL exactly
   - Check for trailing slashes
   - Verify `CORS_ORIGIN` includes your frontend URL
   - Check browser console for specific CORS error messages

2. **Database Connection Failed:**
   - Verify `DATABASE_URL` is correct (use Internal Database URL from Render)
   - Ensure database schema is applied: `psql "your-database-url" -f backend/db/schema.sql`
   - Check if database is running on Render dashboard
   - Verify database credentials are correct

3. **Build Failures:**
   - Check build logs in Vercel/Render dashboards
   - Ensure all dependencies are in package.json
   - Verify TypeScript compilation
   - Check for missing environment variables during build

4. **Environment Variables Not Loading:**
   - Restart services after adding new env vars
   - Check variable names match exactly (case-sensitive)
   - Ensure no spaces around `=` in env vars
   - Verify `NEXT_PUBLIC_` prefix for frontend variables

5. **Email Sending Issues:**
   - Verify SMTP credentials are correct
   - Check if 2FA is enabled for Gmail
   - Ensure sender email is verified with provider
   - Check SMTP provider's sending limits
   - Verify `SMTP_FROM` email is authorized

6. **Magic Link Authentication Issues:**
   - Ensure `JWT_SECRET` is set and at least 32 characters
   - Check `FRONTEND_URL` is correct for magic link generation
   - Verify email templates are being sent
   - Check spam folder for magic link emails

7. **Email Tracking Not Working:**
   - Verify tracking pixel URLs are accessible
   - Check if email clients block images
   - Ensure `FRONTEND_URL` is correct for pixel URLs
   - Verify database schema includes tracking fields

8. **Domain Verification Issues:**
   - Check DNS propagation (can take up to 48 hours)
   - Verify SPF record syntax is correct
   - Ensure DMARC record is properly formatted
   - Check if domain has proper MX records

### Debug Commands:

**Test Backend Health:**
```bash
curl https://your-backend-app.onrender.com/api/v1/health
```

**Test Database Connection:**
```bash
psql "your-database-url" -c "SELECT COUNT(*) FROM users;"
```

**Test SMTP Connection:**
```bash
# Use a tool like telnet or curl to test SMTP
telnet smtp.gmail.com 587
```

**Check Environment Variables:**
```bash
# In Render dashboard, check Environment tab
# In Vercel dashboard, check Environment Variables section
```

## 📊 Monitoring

### Vercel Analytics:
- Built-in analytics for frontend performance
- Monitor page views and user behavior

### Render Monitoring:
- Built-in metrics for backend performance
- Monitor CPU, memory, and response times
- Set up alerts for downtime

## 🔄 Continuous Deployment

Both services are configured for automatic deployment:
- **Vercel:** Deploys on every push to main branch
- **Render:** Deploys on every push to main branch

To deploy manually:
- **Vercel:** Use Vercel CLI or dashboard "Redeploy" button
- **Render:** Use dashboard "Manual Deploy" button

## 🎯 Production Checklist

### Pre-Deployment:
- [ ] Database schema applied successfully
- [ ] All environment variables configured
- [ ] SMTP provider account created and verified
- [ ] Domain verification setup (if using custom domain)
- [ ] JWT secret generated (32+ characters)

### Backend (Render):
- [ ] Environment variables set correctly
- [ ] SMTP configuration tested
- [ ] CORS configured with frontend URL
- [ ] Health check endpoint working (`/api/v1/health`)
- [ ] Database connection successful
- [ ] Rate limiting active
- [ ] Security headers enabled
- [ ] Error handling working
- [ ] Campaign scheduler started

### Frontend (Vercel):
- [ ] Environment variables set correctly
- [ ] API URL points to backend
- [ ] Build successful without errors
- [ ] Authentication flow working
- [ ] Protected routes functioning
- [ ] Theme switching working
- [ ] All pages loading correctly

### Email Functionality:
- [ ] User registration sends magic link
- [ ] Magic link authentication working
- [ ] Email templates can be created
- [ ] CSV upload and validation working
- [ ] Campaign creation and sending working
- [ ] Email tracking pixels loading
- [ ] Click tracking functional
- [ ] Analytics data displaying

### Domain Management:
- [ ] Domain addition working
- [ ] DNS verification functional
- [ ] SPF/DMARC/MX record detection
- [ ] Domain status updates correctly

### Testing:
- [ ] End-to-end user registration flow
- [ ] Email campaign creation and sending
- [ ] Email tracking and analytics
- [ ] Domain verification process
- [ ] Error handling and edge cases
- [ ] Performance under load

## 🔒 Security Considerations

### Production Security Checklist:
- [ ] **JWT Secret:** Use a strong, random 32+ character secret
- [ ] **HTTPS Only:** All traffic encrypted in transit
- [ ] **Rate Limiting:** Configured to prevent abuse
- [ ] **CORS:** Properly configured with specific origins
- [ ] **Security Headers:** Helmet.js configured with CSP
- [ ] **SMTP Security:** Use app passwords, not account passwords
- [ ] **Database Security:** Use connection pooling and prepared statements
- [ ] **Environment Variables:** Never commit secrets to git
- [ ] **Input Validation:** Zod schemas validate all inputs
- [ ] **Error Handling:** No sensitive data in error messages

### Recommended Security Practices:
1. **Regular Updates:** Keep dependencies updated
2. **Monitoring:** Set up alerts for failed authentication attempts
3. **Backup:** Regular database backups
4. **Access Control:** Limit admin access to necessary personnel
5. **Audit Logs:** Monitor email sending patterns

## ⚡ Performance Optimization

### Backend Optimizations:
- **Database Indexing:** Ensure proper indexes on frequently queried columns
- **Connection Pooling:** PostgreSQL connection pooling configured
- **Compression:** Gzip compression enabled
- **Caching:** Consider Redis for session storage at scale
- **Rate Limiting:** Prevents resource exhaustion

### Frontend Optimizations:
- **Image Optimization:** Next.js automatic image optimization
- **Code Splitting:** Automatic code splitting by Next.js
- **Static Generation:** Static pages where possible
- **CDN:** Vercel's global CDN for fast delivery
- **Bundle Analysis:** Monitor bundle size

### Email Performance:
- **Batch Processing:** Emails sent in batches to prevent SMTP limits
- **Queue System:** Consider Redis/Bull for large campaigns
- **Retry Logic:** Failed sends are retried with exponential backoff
- **Tracking Optimization:** Minimal tracking pixel for fast loading

## 📈 Scaling Considerations

### When to Scale:
- **Database:** When queries become slow (>100ms)
- **Backend:** When CPU usage consistently >70%
- **Email Volume:** When sending >10,000 emails/day
- **Concurrent Users:** When >100 active users

### Scaling Options:
1. **Database:** Upgrade to Render's paid PostgreSQL plan
2. **Backend:** Upgrade to Render's paid web service plan
3. **Email Queue:** Implement Redis + Bull for background processing
4. **CDN:** Use CloudFlare for additional caching
5. **Monitoring:** Add Sentry for error tracking

## 🚀 You're Live!

Your TS Mail Client is now deployed and ready for production use!

- **Frontend:** https://your-frontend-app.vercel.app
- **Backend:** https://your-backend-app.onrender.com
- **Database:** Managed by Render PostgreSQL

### Next Steps:
1. **Monitor Performance:** Check Vercel and Render dashboards
2. **Set Up Alerts:** Configure monitoring for downtime
3. **Test Thoroughly:** Run through all user flows
4. **Documentation:** Keep deployment notes updated
5. **Backup Strategy:** Implement regular database backups

### Support Resources:
- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Render Docs:** [render.com/docs](https://render.com/docs)
- **PostgreSQL Docs:** [postgresql.org/docs](https://postgresql.org/docs)
- **Next.js Docs:** [nextjs.org/docs](https://nextjs.org/docs)
