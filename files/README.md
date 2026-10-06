# Library IT Big — School Library Management System

A library management web app for a secondary school (grades 7–11), built
with Next.js (App Router), TypeScript, and Tailwind CSS. It currently runs
entirely on realistic mock data — no backend or database yet. Supabase is
planned but intentionally not connected.

Context baked into the mock data: Kazakhstan secondary school, grades 7–11,
Cyrillic sections (А/Б/В), Kazakh and Russian student names, and a KZ-style
subject/textbook list (Mathematics, Physics, Informatics, Chemistry, Biology,
History, Geography, Kazakh Language, Kazakh Literature, Russian Language,
Russian Literature, English).

## Tech stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- lucide-react icons
- No backend — deterministic, seeded mock data generated in-memory

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 — it redirects to `/dashboard`.

## Project structure

```
app/                    Routes (App Router)
  dashboard/
  students/, students/[id]/
  catalog/, catalog/[id]/
  circulation/issue/, circulation/return/
  loans/
  overdue/
  settings/
components/
  layout/               AppShell, Sidebar, TopBar, StaffContext (mock role switch), QuickSearch, NotificationsBell
  shared/                Reusable UI: SearchInput, StatusBadge, EmptyState, Avatar, Card, ToastContext, ConfirmDialog
  dashboard/, students/, catalog/, circulation/   Feature-specific components
lib/
  types/                Student, Book, Loan, StaffUser — shared TS types
  data/                 Mock data generators (seeded, deterministic) + the in-memory "database"
  services/             Data-access layer — pages call these, never lib/data directly
  utils/                cn(), date formatting helpers
```

### Why a service layer over mock data?

Pages and components call functions in `lib/services/*` (e.g.
`studentService.searchStudents`, `loanService.issueBook`). Those functions
currently just read/write the in-memory arrays in `lib/data/*.mock.ts`. When
Supabase is connected, **only the internals of the service files change** —
every page, component, and type stays exactly the same. This is the seam to
build on.

### How mock data works

- `lib/data/seed-random.ts` — a small seeded PRNG (mulberry32), so the
  dataset is stable across reloads instead of re-randomizing every run.
- `lib/data/students.mock.ts` — ~100+ students across grades 7–11, uneven
  section sizes, Kazakh/Russian name mix, referenced by `studentNumber`
  (searchable ID) and `barcode` (reserved for a future scanner UI).
- `lib/data/books.mock.ts` — curated KZ-curriculum textbooks per
  grade/subject, plus a curated fiction/reference list. ISBNs are generated
  with valid ISBN-13 check digits.
- `lib/data/loans.mock.ts` — generates realistic circulation: each active
  student holds a handful of their grade's textbooks, plus ~260 varied
  fiction/reference loans (mix of returned history and open loans), with a
  deliberate handful forced overdue so the Dashboard/Overdue page have real
  data to show. `availableCopies` on every book is reconciled against
  actually-open loans, so the catalog never shows numbers that contradict
  circulation.
- Issuing/returning a book (`loanService.issueBook` / `returnBook`) mutates
  these in-memory arrays directly — changes work within a session but reset
  on a full reload, since there's no persistence yet.

### Roles

A single "Staff" account type with an `isAdmin` boolean — there's no
separate admin dashboard. Admin-only UI (Settings, staff management) is
gated with `<RoleGate>` / a direct `isAdmin` check. Since there's no real
auth yet, `components/layout/StaffContext.tsx` provides a demo role
switcher (click your avatar in the header → "Переключить на: ...") so you
can preview both views. This whole file is what gets replaced by real
Supabase Auth later.

## Deploying

### Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: library management app"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### Deploy to Vercel

1. Go to https://vercel.com/new and import the GitHub repository.
2. Framework preset: Vercel auto-detects Next.js — no config needed.
3. No environment variables are required yet (see `.env.example` — it's a
   placeholder for Supabase, unused for now).
4. Click **Deploy**. Every push to `main` redeploys automatically.

## What's next when Supabase is connected

1. Create tables matching `lib/types/*.ts`: `students`, `books`, `loans`,
   `staff_users` (mirror the field names to minimize mapping code).
2. Replace the internals of `lib/services/*.ts` one file at a time —
   `studentService.ts` first (lowest risk), then `bookService.ts`, then
   `loanService.ts` (the mutating one — `issueBook`/`returnBook` become
   Supabase inserts/updates, ideally wrapped in a Postgres function/RPC for
   atomicity so `availableCopies` never drifts from actual open loans).
3. Replace `StaffContext`'s mock role switch with real Supabase Auth +
   a `staff_users.is_admin` check; add the `/login` flow.
4. Add row-level security policies once real student data is involved.
5. Wire up the barcode/QR fields already present on `Student` and `Book`
   (`barcode`) to an actual scanner UI — the data model already supports it,
   only the UI is missing.
