import {randomBytes} from 'node:crypto';
import {existsSync,writeFileSync} from 'node:fs';
import {eq} from 'drizzle-orm';
if(!existsSync('.env.local')&&!process.env.BETTER_AUTH_SECRET){writeFileSync('.env.local',`BETTER_AUTH_SECRET=${randomBytes(48).toString('base64url')}\nBETTER_AUTH_URL=http://localhost:3000\n`);process.loadEnvFile('.env.local');}
process.env.ADMIN_EMAIL='organizer@campus.local';
process.env.ADMIN_PASSWORD='CampusDemo2026!';
const {getDb,migrate}=await import('../lib/db.js');const {user}=await import('../lib/schema.js');
const db=await getDb();await migrate(db);
if(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD){
 const email=process.env.ADMIN_EMAIL.toLowerCase();
 const [existing]=await db.select().from(user).where(eq(user.email,email));
 if(existing){console.log('Local demo already initialized.');process.exit(0);}
 const {getAuth}=await import('../lib/auth.js');
 const result=await (await getAuth()).api.signUpEmail({body:{name:'Campus Organizer',email,password:process.env.ADMIN_PASSWORD}});
 await db.update(user).set({role:'admin'}).where(eq(user.id,result.user.id));console.log('Administrator created.');
}
console.log('Database initialized with 9 sample events.');process.exit(0);
