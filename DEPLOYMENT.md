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
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=postgresql://username:password@host:port/database
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   FRONTEND_URL=https://your-frontend-app.vercel.app
   JWT_SECRET=your-super-secret-jwt-key-here
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
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-app.onrender.com
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
1. Enable 2-factor authentication
2. Generate an App Password
3. Use these settings:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

### SendGrid SMTP
1. Create SendGrid account
2. Generate API key
3. Use these settings:
   ```
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=your-sendgrid-api-key
   ```

### Resend SMTP
1. Create Resend account
2. Generate API key
3. Use these settings:
   ```
   SMTP_HOST=smtp.resend.com
   SMTP_PORT=587
   SMTP_USER=resend
   SMTP_PASS=your-resend-api-key
   ```

## 🚨 Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Ensure `FRONTEND_URL` in backend matches your Vercel URL exactly
   - Check for trailing slashes

2. **Database Connection Failed:**
   - Verify `DATABASE_URL` is correct
   - Ensure database schema is applied
   - Check if database is running on Render

3. **Build Failures:**
   - Check build logs in Vercel/Render dashboards
   - Ensure all dependencies are in package.json
   - Verify TypeScript compilation

4. **Environment Variables Not Loading:**
   - Restart services after adding new env vars
   - Check variable names match exactly
   - Ensure no spaces around `=` in env vars

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

- [ ] Database schema applied
- [ ] Environment variables set
- [ ] SMTP configured and tested
- [ ] CORS configured correctly
- [ ] Health check endpoint working
- [ ] Frontend can communicate with backend
- [ ] Email sending functionality tested
- [ ] Analytics data loading correctly
- [ ] Error handling working
- [ ] Rate limiting active

## 🚀 You're Live!

Your TS Mail Client is now deployed and ready for production use!

- **Frontend:** https://your-frontend-app.vercel.app
- **Backend:** https://your-backend-app.onrender.com
- **Database:** Managed by Render PostgreSQL
