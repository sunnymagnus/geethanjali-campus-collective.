import { and, asc, count, eq, sql } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { events, registrations, user } from './schema.js';
export class AppError extends Error {constructor(message,status=400){super(message);this.status=status;}}
export const eventInput=z.object({title:z.string().trim().min(3).max(100),subtitle:z.string().trim().min(3).max(160),description:z.string().trim().min(20).max(6000),category:z.enum(['Technology','Cultural','Workshop','Sports','Career','Community']),startsAt:z.iso.datetime({offset:true}),endsAt:z.iso.datetime({offset:true}),venue:z.string().trim().min(3).max(120),capacity:z.coerce.number().int().min(1).max(10000),organizer:z.string().trim().min(3).max(120),theme:z.enum(['coral','mint','lavender','yellow','blue','orange','green','pink','sand']),status:z.enum(['published','draft']).default('published')}).refine(e=>new Date(e.endsAt)>new Date(e.startsAt),{message:'End time must be after start time.'});
export async function listEvents(db,admin=false){
 return db.select({...Object.fromEntries(Object.entries(events).filter(([k])=>['id','title','subtitle','description','category','startsAt','endsAt','venue','capacity','organizer','theme','status'].includes(k))),registered:count(registrations.id)}).from(events).leftJoin(registrations,eq(events.id,registrations.eventId)).where(admin?undefined:eq(events.status,'published')).groupBy(events.id).orderBy(asc(events.startsAt));
}
export async function register(db,userId,eventId){
 return db.transaction(async tx=>{
  const [event]=await tx.select().from(events).where(eq(events.id,eventId)).for('update');
  if(!event || event.status!=='published') throw new AppError('This event is unavailable.',404);
  if(event.startsAt<=new Date()) throw new AppError('Registration has closed for this event.',409);
  const [existing]=await tx.select().from(registrations).where(and(eq(registrations.eventId,eventId),eq(registrations.userId,userId)));
  if(existing) throw new AppError('You are already registered for this event.',409);
  const [total]=await tx.select({value:count()}).from(registrations).where(eq(registrations.eventId,eventId));
  if(total.value>=event.capacity) throw new AppError('This event is full.',409);
  const [registration]=await tx.insert(registrations).values({id:randomUUID(),eventId,userId}).returning();return registration;
 });
}
export async function cancel(db,userId,eventId){
 return db.transaction(async tx=>{
  const [event]=await tx.select().from(events).where(eq(events.id,eventId)).for('update');
  if(!event) throw new AppError('Event not found.',404);
  if(event.startsAt<=new Date()) throw new AppError('Cancellation closes when the event starts.',409);
  const result=await tx.delete(registrations).where(and(eq(registrations.eventId,eventId),eq(registrations.userId,userId))).returning();
  if(!result.length) throw new AppError('Registration not found.',404);return {ok:true};
 });
}
export async function saveEvent(db,input,id){
 const parsed=eventInput.safeParse(input); if(!parsed.success) throw new AppError(parsed.error.issues.map(x=>x.message).join(' '));
 const data={...parsed.data,startsAt:new Date(parsed.data.startsAt),endsAt:new Date(parsed.data.endsAt)};
 return db.transaction(async tx=>{
  if(id){const [found]=await tx.select().from(events).where(eq(events.id,id)).for('update');if(!found)throw new AppError('Event not found.',404);
   const [total]=await tx.select({value:count()}).from(registrations).where(eq(registrations.eventId,id));
   if(total.value>data.capacity)throw new AppError('Capacity cannot be lower than the current number of registrations.',409);
   if(total.value>0 && data.status==='draft')throw new AppError('An event with registrations cannot be unpublished.',409);
   return (await tx.update(events).set(data).where(eq(events.id,id)).returning())[0];
  }
  if(data.startsAt<=new Date())throw new AppError('New events must start in the future.');
  return (await tx.insert(events).values({id:randomUUID(),...data}).returning())[0];
 });
}
export async function deleteEvent(db,id){return db.transaction(async tx=>{
 const [event]=await tx.select().from(events).where(eq(events.id,id)).for('update');if(!event)throw new AppError('Event not found.',404);
 const [total]=await tx.select({value:count()}).from(registrations).where(eq(registrations.eventId,id));
 if(total.value)throw new AppError('This event has registrations. Keep the event available to its participants.',409);
 await tx.delete(events).where(eq(events.id,id));return {ok:true};
});}
export async function participants(db,eventId){return db.select({id:registrations.id,name:user.name,email:user.email,rollNumber:user.rollNumber,department:user.department,createdAt:registrations.createdAt}).from(registrations).innerJoin(user,eq(user.id,registrations.userId)).where(eq(registrations.eventId,eventId)).orderBy(asc(registrations.createdAt));}
