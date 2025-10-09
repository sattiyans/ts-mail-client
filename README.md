# TS Mail Client

A minimal, modern email client web app with domain management, email templates, bulk sending (with or without attachments), and analytics for delivery status.

Built with Next.js (App Router) + ShadCN UI + Express.js + PostgreSQL + Nodemailer.

## 🚀 All Phases Complete - Production Ready Application

✅ **Phase 1 Completed - Project Setup:**
- ✅ Monorepo structure with frontend/backend separation
- ✅ Next.js 15 project initialized with TypeScript and App Router
- ✅ ShadCN UI installed and configured with dark theme
- ✅ Express.js backend with TypeScript configuration
- ✅ PostgreSQL database schema and connection setup
- ✅ Environment variables template created
- ✅ Dark mode enabled by default with hydration fix

✅ **Phase 2 Completed - UI Foundation:**
- ✅ ShadCN UI components installed (Button, Card, Sheet, Avatar, Dropdown, etc.)
- ✅ Sidebar navigation component with active route highlighting
- ✅ Top navigation bar with user avatar dropdown
- ✅ Responsive layout with persistent sidebar (hidden on mobile)
- ✅ Mobile sidebar using Sheet component
- ✅ Placeholder pages for all sections (Dashboard, Domains, Templates, Campaigns, Analytics, Settings)
- ✅ Authentication pages (Login, Register, Verify)
- ✅ All TypeScript path mappings fixed

✅ **Phase 3 Completed - Enhanced UI:**
- ✅ Comprehensive mock data system with realistic email marketing data
- ✅ Interactive charts using Chart.js (line, bar, doughnut charts)
- ✅ Advanced data tables with sorting, filtering, and action buttons
- ✅ Template editor modal with rich text editing and variable system
- ✅ Campaign management with performance metrics and progress bars
- ✅ Domain management with DNS verification and setup instructions
- ✅ Analytics dashboard with real-time calculations and visual indicators
- ✅ Status management system with badges, icons, and progress bars
- ✅ Template variable system with click-to-insert functionality
- ✅ Live preview system for templates with test data

✅ **Phase 4 Completed - Component Polish:**
- ✅ Reusable UI components and UX enhancements
- ✅ Page transitions and animations
- ✅ Theme switching with seamless transitions
- ✅ Loading states and error handling
- ✅ Responsive design optimizations
- ✅ Accessibility improvements

✅ **Phase 5 Completed - Backend Setup:**
- ✅ Express.js server with TypeScript
- ✅ PostgreSQL database connection with pg client
- ✅ API routes structure (controllers, services, routes)
- ✅ Zod validation schemas
- ✅ Error handling middleware
- ✅ Security middleware (CORS, rate limiting, headers)

✅ **Phase 6 Completed - Database & Logic:**
- ✅ Complete PostgreSQL schema (users, domains, templates, campaigns, email_logs, drafts)
- ✅ CRUD operations for all entities
- ✅ Email sending with Nodemailer
- ✅ Magic link authentication with JWT
- ✅ Domain verification with DNS lookups
- ✅ Email tracking (open/click tracking)
- ✅ Campaign scheduling with node-cron
- ✅ CSV template validation system

✅ **Phase 7 Completed - Frontend Integration:**
- ✅ Live API integration replacing mock data
- ✅ Authentication flow with magic links
- ✅ Protected routes and user context
- ✅ Real-time data fetching and updates
- ✅ Error handling and loading states
- ✅ CSV upload and validation
- ✅ Campaign creation and management
- ✅ Domain verification workflow

✅ **Phase 8 Completed - Production Deployment:**
- ✅ Comprehensive deployment documentation
- ✅ Vercel configuration for frontend deployment
- ✅ Render configuration for backend deployment
- ✅ Environment variables setup
- ✅ SMTP provider configuration guides
- ✅ Security optimizations and best practices
- ✅ Performance optimizations
- ✅ Monitoring and troubleshooting guides

## 🛠 Tech Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, ShadCN UI, Tailwind CSS
- **Backend:** Express.js, Node.js, TypeScript
- **Database:** PostgreSQL with pg client (no ORM)
- **Authentication:** Magic link authentication with JWT
- **Email:** Nodemailer with SMTP providers (Gmail, SendGrid, Resend, Mailgun)
- **Analytics:** Chart.js, React Chart.js 2
- **Validation:** Zod schemas
- **Deployment:** Vercel (frontend) + Render (backend)
- **Security:** Rate limiting, CORS, security headers, input validation

## 📁 Project Structure

```
/frontend              # Next.js frontend application
  /app                 # App Router pages
    /(app)             # Main app pages (dashboard, campaigns, etc.)
    /(auth)            # Authentication pages (login, register)
  /components          # Reusable UI components
  /lib                 # Frontend utilities & API helpers
  /types               # TypeScript type definitions

/backend               # Express.js backend API
  /src
    /controllers       # API route controllers
    /services          # Business logic & database operations
    /routes            # API route definitions
    /db                # Database connection & schema
  /db
    schema.sql         # PostgreSQL database schema

/shared                # Shared types and utilities (optional)
```

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   
   **Frontend** (`frontend/.env.local`):
   ```bash
   cp frontend/env.example frontend/.env.local
   # Edit frontend/.env.local with your actual values
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```
   
   **Backend** (`backend/.env`):
   ```bash
   # Create backend/.env with your database and SMTP settings
   DATABASE_URL=postgresql://username:password@localhost:5432/ts_mail_client
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

3. **Set up database:**
   ```bash
   # Create PostgreSQL database
   createdb ts_mail_client
   
   # Apply schema
   psql ts_mail_client -f backend/db/schema.sql
   ```

4. **Run both frontend and backend servers:**
   ```bash
   npm run dev
   ```
   
   This will start:
   - **Frontend**: http://localhost:3000 (Next.js)
   - **Backend**: http://localhost:4000 (Express API)

5. **Individual server commands:**
   ```bash
   # Run only frontend
   npm run dev:frontend
   
   # Run only backend  
   npm run dev:backend
   
   # Build both
   npm run build
   
   # Start production servers
   npm run start
   ```

## 🚀 Production Deployment

For production deployment to Vercel (frontend) + Render (backend), see the detailed [DEPLOYMENT.md](./DEPLOYMENT.md) guide.

**Quick Deploy:**
1. **Database**: Create PostgreSQL on Render
2. **Backend**: Deploy to Render (Node.js service)  
3. **Frontend**: Deploy to Vercel (Next.js app)
4. **Connect**: Update environment variables to link services

## 📋 Development Phases

- **Phase 1:** ✅ Project Initialization & Base Setup (COMPLETED)
- **Phase 2:** ✅ Global Layout & Navigation (COMPLETED)
- **Phase 3:** ✅ Enhanced Dashboard & Page UIs (COMPLETED)
- **Phase 4:** ✅ Component Refinement & UX Polish (COMPLETED)
- **Phase 5:** ✅ Backend & Database Integration (COMPLETED)
- **Phase 6:** ✅ Email Sending & Webhooks (COMPLETED)
- **Phase 7:** ✅ Frontend + Backend Integration (COMPLETED)
- **Phase 8:** ✅ Production Deployment & Optimization (COMPLETED)

## 🎯 Current Status: Production Ready

The application is now **fully functional** and ready for production deployment with:

- ✅ **Complete Authentication System** (Magic link login/register)
- ✅ **Email Campaign Management** (Templates, CSV upload, bulk sending)
- ✅ **Domain Management** (DNS verification, SPF/DMARC setup)
- ✅ **Analytics & Tracking** (Open rates, click tracking, bounce handling)
- ✅ **Campaign Scheduling** (Future send scheduling)
- ✅ **Production Deployment** (Vercel + Render configuration)

## 🎨 Design Principles

- **UI-First Approach:** Build complete UI with mock data before backend integration
- **Dark Mode Default:** All UI designed for dark theme
- **ShadCN Components:** Consistent, accessible component library
- **Mobile Responsive:** Works seamlessly across all devices
- **TypeScript Strict:** Full type safety throughout the application

---

## 🚀 Ready for Production!

The TS Mail Client is now a **complete, production-ready email marketing application** with all features implemented and tested. Follow the [DEPLOYMENT.md](./DEPLOYMENT.md) guide to deploy to production!

### 🔗 Repository Links:
- **GitHub**: https://github.com/sattiyans/ts-mail-client
- **GitLab**: https://gitlab.com/trisquare-labs/ts-mail-client
