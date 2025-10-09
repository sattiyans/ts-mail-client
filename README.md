# TS Mail Client

A minimal, modern email client web app with domain management, email templates, bulk sending (with or without attachments), and analytics for delivery status.

Built with Next.js (App Router) + ShadCN UI + Prisma + SendGrid/Nodemailer.

## 🚀 Phase 3 Complete - Enhanced Dashboard & Page UIs

✅ **Phase 1 Completed:**
- ✅ Next.js 15 project initialized with TypeScript and App Router
- ✅ ShadCN UI installed and configured with dark theme
- ✅ Core packages installed (Prisma, NextAuth, Nodemailer, Resend, Zod, React Query, Chart.js)
- ✅ Folder structure scaffolded for all app routes
- ✅ Environment variables template created
- ✅ Dark mode enabled by default
- ✅ Tailwind CSS configured with ShadCN components

✅ **Phase 2 Completed:**
- ✅ ShadCN UI components installed (Button, Card, Sheet, Avatar, Dropdown, etc.)
- ✅ Sidebar navigation component with active route highlighting
- ✅ Top navigation bar with user avatar dropdown
- ✅ Responsive layout with persistent sidebar (hidden on mobile)
- ✅ Mobile sidebar using Sheet component
- ✅ Placeholder pages for all sections (Dashboard, Domains, Templates, Campaigns, Analytics, Settings)
- ✅ Mock data and UI components for each page
- ✅ Home page redirects to dashboard
- ✅ All TypeScript path mappings fixed

✅ **Phase 3 Completed:**
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

## 🛠 Tech Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, ShadCN UI, Tailwind CSS
- **Backend:** Prisma ORM, NextAuth.js, Server Actions
- **Email:** Nodemailer, SendGrid, Resend
- **Analytics:** Chart.js, React Chart.js 2
- **State Management:** TanStack React Query
- **Validation:** Zod

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
- **Phase 4:** 🗂 Component Refinement & UX Polish
- **Phase 5:** 🛠 Backend & Database Integration
- **Phase 6:** 📤 Email Sending & Webhooks
- **Phase 7:** 🚀 Polish, Optimize, and Deploy

## 🎨 Design Principles

- **UI-First Approach:** Build complete UI with mock data before backend integration
- **Dark Mode Default:** All UI designed for dark theme
- **ShadCN Components:** Consistent, accessible component library
- **Mobile Responsive:** Works seamlessly across all devices
- **TypeScript Strict:** Full type safety throughout the application

---

**Next:** Ready to proceed with Phase 4 - Component Refinement & UX Polish with animations and enhanced user experience!
