import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { getDb } from './db.js';
import * as schema from './schema.js';
export async function getAuth(){
 if(!globalThis.__campusAuth) globalThis.__campusAuth=(async()=>{
  if(!process.env.BETTER_AUTH_SECRET || process.env.BETTER_AUTH_SECRET.length<32) throw new Error('Set BETTER_AUTH_SECRET to a random value of at least 32 characters.');
  return betterAuth({database:drizzleAdapter(await getDb(),{provider:'pg',schema}),secret:process.env.BETTER_AUTH_SECRET,baseURL:'http://localhost:3000',emailAndPassword:{enabled:true,minPasswordLength:10},rateLimit:{enabled:true,storage:'database',window:60,max:60,customRules:{'/sign-in/email':{window:60,max:10},'/sign-up/email':{window:60,max:5}}},user:{additionalFields:{role:{type:'string',defaultValue:'student',input:false},rollNumber:{type:'string',required:false},department:{type:'string',required:false}}}});
 })().catch(e=>{globalThis.__campusAuth=null;throw e});
 return globalThis.__campusAuth;
}
