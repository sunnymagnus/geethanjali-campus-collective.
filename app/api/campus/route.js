import {getDb} from '@/lib/db';
import {getAuth} from '@/lib/auth';
import {listEvents,register,cancel,saveEvent,deleteEvent,participants,AppError} from '@/lib/service';
import {registrations,user} from '@/lib/schema';
import {eq} from 'drizzle-orm';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const response=(body,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
async function handle(request){try{
 const db=await getDb(); const url=new URL(request.url);const action=url.searchParams.get('action')||'events';
 if(request.method==='GET' && action==='events')return response({events:await listEvents(db)});
 if(request.method!=='GET'){
  const origin=request.headers.get('origin');
  if(!origin || origin!==url.origin)throw new AppError('Request origin is not allowed.',403);
  if(!request.headers.get('content-type')?.includes('application/json'))throw new AppError('JSON body required.',415);
 }
 const session=await (await getAuth()).api.getSession({headers:request.headers});
 if(!session)throw new AppError('Sign in to continue.',401);
 const [currentUser]=await db.select().from(user).where(eq(user.id,session.user.id));
 if(action==='me')return response({user:{id:currentUser.id,name:currentUser.name,email:currentUser.email,role:currentUser.role,rollNumber:currentUser.rollNumber,department:currentUser.department},registrations:await db.select().from(registrations).where(eq(registrations.userId,currentUser.id))});
 let body={};if(request.method!=='GET'){const raw=await request.text();if(raw.length>16000)throw new AppError('Request is too large.',413);try{body=JSON.parse(raw)}catch{throw new AppError('Invalid JSON.');}}
 if(action==='register' && request.method==='POST')return response(await register(db,currentUser.id,body.eventId),201);
 if(action==='cancel' && request.method==='POST')return response(await cancel(db,currentUser.id,body.eventId));
 if(currentUser.role!=='admin')throw new AppError('Organizer access is required.',403);
 if(action==='admin-events' && request.method==='GET')return response({events:await listEvents(db,true)});
 if(action==='participants' && request.method==='GET')return response({participants:await participants(db,url.searchParams.get('eventId'))});
 if(action==='save-event' && request.method==='POST')return response(await saveEvent(db,body.event,body.id));
 if(action==='delete-event' && request.method==='POST')return response(await deleteEvent(db,body.id));
 throw new AppError('This operation is not available.',404);
 }catch(error){if(!(error instanceof AppError))console.error('Campus API:',error.message);return response({error:error instanceof AppError?error.message:'The service is temporarily unavailable. Please try again.'},error.status||500);}}
export {handle as GET,handle as POST};
