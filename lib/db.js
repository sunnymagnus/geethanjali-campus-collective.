import { sql } from 'drizzle-orm';
import * as schema from './schema.js';
import { migration } from './migration.js';
import { sampleEvents } from './seed.js';
import {mkdirSync} from 'node:fs';
import {dirname} from 'node:path';
export async function migrate(db) {
  for(const statement of migration.split(';').map(s=>s.trim()).filter(Boolean)) await db.execute(sql.raw(statement));
  for (const event of sampleEvents) await db.insert(schema.events).values({...event,startsAt:new Date(event.startsAt),endsAt:new Date(event.endsAt)}).onConflictDoNothing();
}
export async function getDb() {
  if (!globalThis.__campusDb) globalThis.__campusDb = (async()=>{
    const {PGlite}=await import('@electric-sql/pglite'); const {drizzle}=await import('drizzle-orm/pglite');
    const dbPath=process.env.LOCAL_DB_PATH || './.data/campus';
    mkdirSync(dirname(dbPath),{recursive:true});
    const db=drizzle(new PGlite(dbPath),{schema});
    await migrate(db); return db;
  })().catch(e=>{globalThis.__campusDb=null;throw e});
  return globalThis.__campusDb;
}
