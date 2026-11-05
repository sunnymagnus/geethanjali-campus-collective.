export const migration = `
CREATE TABLE IF NOT EXISTS "user" (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, "emailVerified" BOOLEAN NOT NULL DEFAULT false, image TEXT, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, role TEXT NOT NULL DEFAULT 'student', "rollNumber" TEXT, department TEXT);
CREATE TABLE IF NOT EXISTS session (id TEXT PRIMARY KEY, "expiresAt" TIMESTAMP NOT NULL, token TEXT NOT NULL UNIQUE, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, "ipAddress" TEXT, "userAgent" TEXT, "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS account (id TEXT PRIMARY KEY, "accountId" TEXT NOT NULL, "providerId" TEXT NOT NULL, "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE, "accessToken" TEXT, "refreshToken" TEXT, "idToken" TEXT, "accessTokenExpiresAt" TIMESTAMP, "refreshTokenExpiresAt" TIMESTAMP, scope TEXT, password TEXT, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL);
CREATE TABLE IF NOT EXISTS verification (id TEXT PRIMARY KEY, identifier TEXT NOT NULL, value TEXT NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL);
CREATE TABLE IF NOT EXISTS "rateLimit" (id TEXT PRIMARY KEY, key TEXT NOT NULL UNIQUE, count INTEGER NOT NULL, "lastRequest" TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS events (id TEXT PRIMARY KEY, title TEXT NOT NULL, subtitle TEXT NOT NULL, description TEXT NOT NULL, category TEXT NOT NULL, starts_at TIMESTAMP NOT NULL, ends_at TIMESTAMP NOT NULL, venue TEXT NOT NULL, capacity INTEGER NOT NULL CHECK (capacity > 0), organizer TEXT NOT NULL, theme TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'published', created_at TIMESTAMP NOT NULL DEFAULT now(), CHECK (ends_at > starts_at));
CREATE TABLE IF NOT EXISTS registrations (id TEXT PRIMARY KEY, event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE, user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE, created_at TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT unique_event_student UNIQUE (event_id,user_id));
CREATE INDEX IF NOT EXISTS registrations_user_idx ON registrations(user_id);
CREATE INDEX IF NOT EXISTS session_user_idx ON session("userId");
CREATE INDEX IF NOT EXISTS events_date_idx ON events(starts_at);
`;
