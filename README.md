# Namekayro Appointments — Holistic Wellness Platform

A production-ready, full-stack appointment booking system designed for a wellness practice. Features a smooth, login-free client experience paired with a nutritionist management portal.

---

## Architecture & Folder Structure

```
namekayro-appointments/
├── prisma/
│   ├── migrations/            # SQL migration history
│   ├── schema.prisma          # PostgreSQL Appointment data model
│   └── seed.ts                # Deterministic seed data (IST timestamps)
├── public/
│   └── pill.png               # Pill graphic asset
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── appointments/  # CRUD API (GET list, POST booking, PATCH status/reschedule/cancel)
│   │   │   └── slots/         # Available slots API (Asia/Kolkata timezone)
│   │   ├── dashboard/         # Nutritionist management dashboard page
│   │   ├── globals.css        # Tailwind v4 theme tokens & base styles
│   │   ├── layout.tsx         # Root layout with Space Grotesk font
│   │   └── page.tsx           # Client booking portal (Hero, Next Appt, Booking, My Bookings)
│   ├── components/
│   │   ├── client/            # Client-facing UI sections (HeroSection, BookSection, DateStrip, etc.)
│   │   ├── dashboard/         # Dashboard UI components (DashboardTable, Filters, Summary, WhatsApp)
│   │   ├── reactbits/         # Canvas animations (LaserFlow card & CircularText with scroll-to-top)
│   │   └── ui/                # Accessible base components (Button, Modal, Pill, Skeleton, SmoothScroll)
│   ├── hooks/                 # Custom React hooks (useClientBookings, useDashboardData)
│   └── lib/                   # Time utilities, database client, validation, phone formatting
└── tests/
    ├── hardening.ts           # Concurrency & race condition test suite
    └── e2e_check.ts           # Automated end-to-end API verification suite
```

---

## Design Tokens

- **Font**: Space Grotesk (`--font-space-grotesk`)
- **Background**: `#0B0B0B` (Black)
- **Surface**: `#151515` (Dark Gray Card Surface)
- **Primary Accent**: `#FF2DAB` (Hot Pink)
- **Interactive Highlight**: `#D4FF3F` (Chartreuse Green on hover & highlights)
- **Warning / Notice**: `#FF9F1C` (Amber)

---

## Running Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   Copy `.env.example` to `.env` and provide your Neon Postgres URLs:
   ```env
   DATABASE_URL=postgresql://user:password@host/neondb?sslmode=require
   DIRECT_URL=postgresql://user:password@host/neondb?sslmode=require
   ```

3. **Run database migrations & seed**:
   ```bash
   npm run db:migrate
   npm run seed
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) for the client portal or [http://localhost:3000/dashboard](http://localhost:3000/dashboard) for the nutritionist portal.

---

## Vercel Deployment Guide

### 1. Environment Variables to Add in Vercel
In your Vercel Project Settings > **Environment Variables**, add:
- `DATABASE_URL`: Your pooled connection string (Neon PgBouncer).
- `DIRECT_URL`: Your direct connection string (unpooled, for Prisma migrations).

### 2. Production Database Commands
Run once against your production database:
```bash
npx prisma migrate deploy
npx tsx prisma/seed.ts
```

### 3. Post-Deployment Verification Checklist
1. **Client Booking**: Book a slot on `/` and confirm celebration animation displays.
2. **Nutritionist Dashboard**: Verify the new appointment appears immediately on `/dashboard`.
3. **Double-Booking Prevention**: Attempt to book the exact same date & time slot to confirm it returns `409 Conflict`.
4. **Reschedule & Cancel**: Verify rescheduling frees the previous slot and cancelling marks the appointment as cancelled.
5. **Mobile Responsiveness**: Confirm layout, tap targets, and floating return arrow work seamlessly on mobile viewports.
