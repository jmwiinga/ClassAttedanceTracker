# Register — Class Attendance Tracker

A simple Next.js app for tracking class attendance and flagging students
below an 80% attendance target.

## Features

- **Students** — capture student number, name, programme of study, year of study, and semester.
- **Courses** — capture course code, course name, and the programme/year/semester it belongs to.
- **Take Attendance** — pick a course and date, mark each matching student present/absent, edit or delete past sessions.
- **Dashboard** — a pie chart of on-track vs. below-target records, plus an attendance chart that adapts to class size: individual bars per student for smaller groups, or a distribution histogram once there are too many students to plot one-by-one. A detailed, filterable table below still lists every student by name and student number with an automatic "BELOW 80%" flag.
- **NUST branding** — navy/gold/red corporate colours and the NUST logo in the header.

### About the logo

`public/nust-logo.png` was cropped from a screenshot of the myNUST portal, so
it's a placeholder — it carries a bit of background image and won't be crisp
at large sizes. For a clean result, replace that file with the university's
official logo asset (ideally a transparent PNG or SVG from NUST's brand
guidelines or marketing office) and keep the filename `nust-logo.png`, or
update the `src` in `app/page.tsx` if you rename it.

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
