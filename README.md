# Campus Collective — Geethanjali Events

A responsive, full-stack adaptation of the supplied College Event Registration and Management System report for Geethanjali College of Engineering and Technology, Hyderabad.

## Included

- Nine original sample events across technology, culture, workshops, sports, careers, and community activities.
- Search, category filters, available-seat filter, sorting, grid/list layouts, calendar, and browser-local bookmarks.
- Student sign-up/sign-in using Better Auth, password hashing, HTTP-only sessions, and database-backed authentication rate limits.
- Registration, cancellation, event passes, and `.ics` calendar downloads.
- Administrator event create/edit/delete, draft/publish, participant lists, seat counts, and CSV export.
- Server-side authorization, same-origin mutation checks, input validation, transactional capacity checks, and a unique student/event database constraint.
- PostgreSQL storage in production; persistent PGlite (PostgreSQL-compatible) local storage for development.

These are fictional sample events, not official university announcements. No report author names, student roll numbers, signatures, or other report personal information are published.

## Run locally

Requires Node.js 22.18+ (Node 24 LTS recommended).

```powershell
npm ci
npm run db:setup
npm run dev
```

Open http://localhost:3000. The setup command creates a random local auth secret and seeds events. Data persists in `.data/campus`, excluded from source control. Do not run multiple processes against the same local PGlite directory; use hosted PostgreSQL for concurrent application processes.

Create an ordinary student account in the UI. To provision an organizer, add `ADMIN_EMAIL` and `ADMIN_PASSWORD` to `.env.local`, choosing an email that has not already signed up, then run `npm run db:setup` with the dev server stopped. Use at least 10 password characters. Remove `ADMIN_PASSWORD` afterward. The setup command deliberately refuses to promote an existing email to avoid accidental takeover. There is no public role switch or shared admin password.

## Deploy to Vercel

1. Create a Next.js project for this folder in the intended Vercel team.
2. Connect a PostgreSQL database (for example Neon through Vercel Marketplace). Configure `DATABASE_URL` as a server-only variable.
3. Generate a random `BETTER_AUTH_SECRET` of at least 32 characters. Set `BETTER_AUTH_URL` to the exact production HTTPS origin. Never commit secrets.
4. In a secure local environment with the production database connection and initial admin credentials, run `npm run db:setup` to create tables, seed events, and create the admin. Remove the one-time admin password from the environment afterward.
5. Run `npm run build`, deploy, and verify sign-up → registration → My registrations → cancellation on the deployed origin.

Vercel Functions use the Mumbai (`bom1`) region. Keep the database nearby when available. The app refuses ephemeral filesystem database storage on Vercel: a persistent production database is required.

## Verification

```powershell
npm test
npm run build
```

Tests exercise simultaneous requests for the last seat, duplicate prevention, cancellation ownership, capacity reductions, draft visibility, input validation, and registration/cancellation deadlines.

## Report mapping

| Report requirement | Web implementation |
| --- | --- |
| Java Swing screens | Responsive Next.js / React UI |
| Java/JDBC application logic | Next.js server routes and Drizzle transactions |
| MySQL relational database | PostgreSQL with foreign keys and uniqueness constraints |
| Student authentication | Better Auth email/password and server sessions |
| Event discovery and registration | Searchable events, details, transactional reservations |
| Administrator module | Role-protected event editor and participant dashboard |
| Prevent overbooking | Event-row lock, capacity count, and insert in one transaction |
| Prevent duplicates | Unique `(event_id, user_id)` database constraint |

The last report page discusses healthcare and symptom checking, which is unrelated to the event-system specification and was excluded. The report describes desktop technologies; the explicit request for a Vercel web app determines this implementation's platform.

## Scope

Payment processing, email delivery/verification, password-recovery email, QR attendance, and official student-directory verification are not configured. Events are free. Accounts belong to this project, not the college's institutional identity system. Bookmarks are local to the browser; accounts and registrations are database-backed.

Poster artwork is original CSS/vector composition. Fonts use Google Fonts with system fallbacks. Replace the demonstration branding disclaimer only after the institution authorizes official use.
