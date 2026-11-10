# Geethanjali Campus Collective — Local Classroom Project

Complete frontend, backend, database schema, original event data, and tests. Runs on your computer using Next.js, React, Better Auth, Drizzle, and a persistent local PostgreSQL-compatible PGlite database. No Vercel account or hosted database is required.

## Run on Windows with Command Prompt

1. Install Node.js 24 LTS and Git.
2. Open **Command Prompt** in this project folder and run:

```cmd
npm ci
npm run db:setup
npm run dev -- --port 3000
```

3. Open http://localhost:3000 in your browser. Keep the window running. Press Ctrl+C to stop.

You can also double-click START-PROJECT.cmd. Internet is needed for the first dependency installation; the database and app logic run locally afterward. Google Fonts uses system fallbacks if offline.

## Demonstrate to your professor

- Browse the nine sample events; use search, categories, list view, bookmarks, and calendar.
- Create a student account, register, open My registrations, and cancel.
- Sign out. Sign in as the local demo organizer:
  - Email: organiser@gcet.in
  - Password: 1234567890
- Select Organizer workspace in the footer to create/edit events and view/export participants.
- Duplicate reservations and full events are rejected by the backend.

The organizer credentials are for this local classroom demonstration only.

## Update an existing copy

Open Command Prompt in the copied project folder and run:

```cmd
git pull
npm ci
npm run db:setup
```

Then start the app with `npm run dev -- --port 3000`. If this copy already has an older local database and the new organizer login is not recognized, stop the app and run `rmdir /s /q .data` once, then run `npm run db:setup` again. This clears only that copy's local accounts and registrations; its sample events are recreated automatically.

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

```cmd
npm test
npm run build
npm start
```

Stop `npm run dev` before `npm start`. Do not run two app instances against the same local database. Data persists in `.data/campus`. Your `.env.local` secret is generated during setup. Fresh source checkouts do not contain existing accounts or private settings.

This is a web adaptation of the supplied Java Swing/MySQL report, not a Java application. The interface and core functionality match the deployed web version. Sample events are fictional and marked as a student project.
