# Geethanjali Campus Collective — Local Classroom Project

Complete frontend, backend, database schema, original event data, and tests. Runs on your computer using Next.js, React, Better Auth, Drizzle, and a persistent local PostgreSQL-compatible PGlite database. No Vercel account or hosted database is required.

## Run in VS Code

1. Install Node.js 24 LTS and VS Code.
2. Extract this entire folder and open it using VS Code > File > Open Folder.
3. Open Terminal > New Terminal and run:

```powershell
npm ci
npm run db:setup
npm run dev
```

4. Open http://localhost:3000 in your browser. Keep the terminal running. Press Ctrl+C to stop.

On Windows you can alternatively double-click START-PROJECT.cmd.
Internet is needed for the first dependency installation; the database and app logic run locally afterward. Google Fonts uses system fallbacks if offline.

## Demonstrate to your professor

- Browse the nine sample events; use search, categories, list view, bookmarks, and calendar.
- Create a student account, register, open My registrations, and cancel.
- Sign out. Sign in as the local demo organizer:
  - Email: organizer@campus.local
  - Password: CampusDemo2026!
- Select Organizer workspace in the footer to create/edit events and view/export participants.
- Duplicate reservations and full events are rejected by the backend.

The organizer credentials are for this local classroom demonstration only.

## Where the code is

- app/page.jsx and app/layout.jsx: application entry and layout
- components/Campus.jsx: interactive student and organizer screens
- components/Poster.jsx and app/globals.css: artwork and responsive styling
- app/api/campus/route.js: backend API and role checks
- app/api/auth/[...all]/route.js and lib/auth.js: authentication
- lib/service.js: event and registration business rules
- lib/schema.js and lib/migration.js: relational database structure
- lib/db.js: persistent local database
- lib/seed.js: nine original example events
- scripts/setup.mjs: automatic local setup and organizer account
- tests/registration.test.mjs: database integration tests

## Tests and production-style local run

```powershell
npm test
npm run build
npm start
```

Stop npm run dev before npm start. Do not run two app instances against the same local database.
Data persists in .data/campus. Your .env.local secret is generated during setup. The ZIP contains fresh source, without any existing accounts or private settings.

This is a web adaptation of the supplied Java Swing/MySQL report, not a Java application. The interface and core functionality match the deployed web version. Sample events are fictional and marked as a student project.
