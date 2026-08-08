# Register — Class Attendance Tracker

A simple Next.js app for tracking class attendance and flagging students
below an 80% attendance target.

## Features

- **Students** — capture name, programme of study, year of study, and semester.
- **Courses** — capture course code, course name, and the programme/year/semester it belongs to.
- **Take Attendance** — pick a course and date, mark each matching student present/absent, edit or delete past sessions.
- **Dashboard** — per-student, per-course attendance percentage, average attendance, and an automatic "BELOW 80%" flag for anyone under the target. Filter by course or by flagged-only.

Data is stored in the browser's `localStorage` — no database or sign-in
required. This makes it easy to deploy and use immediately, but data will not
sync across devices or browsers. See **Going further** below if you want a
shared database instead.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy to Vercel

**Option A — Vercel CLI**

```bash
npm install -g vercel
vercel
```

Follow the prompts (accept the defaults — Vercel auto-detects Next.js).

**Option B — GitHub + Vercel dashboard**

1. Push this folder to a new GitHub repository.
2. Go to https://vercel.com/new and import that repository.
3. Leave the default build settings (Framework Preset: Next.js) and click Deploy.

No environment variables are required for the default (localStorage) setup.

## Project structure

```
app/
  layout.tsx        Root layout, fonts, wraps app in DataProvider
  page.tsx           Tab navigation (Dashboard / Students / Courses / Take Attendance)
  globals.css        Tailwind + base styles
components/
  StudentsTab.tsx     Enrol / list / remove students
  CoursesTab.tsx      Add / list / remove courses
  AttendanceTab.tsx   Mark a register per course + date
  DashboardTab.tsx    Attendance % table with 80% flagging
  StatusStamp.tsx     "ON TRACK" / "BELOW 80%" badge
lib/
  types.ts            Shared TypeScript types + the 80% threshold constant
  data-context.tsx     React context: CRUD + localStorage persistence + stats calculation
```

## Going further

- **Shared/persistent database**: swap `lib/data-context.tsx`'s localStorage
  calls for a database such as Vercel Postgres, Supabase, or Neon, and move
  the CRUD functions into API routes (`app/api/.../route.ts`).
- **Authentication**: add NextAuth.js if multiple lecturers need separate
  logins.
- **Export**: add a "download CSV" button on the Dashboard tab using the
  `stats` array already computed in `data-context.tsx`.
- **Change the 80% threshold**: edit `ATTENDANCE_THRESHOLD` in `lib/types.ts`.
