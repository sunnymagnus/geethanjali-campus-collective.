import {getAuth} from '@/lib/auth';
export const runtime='nodejs';
async function handler(request){try{return (await getAuth()).handler(request);}catch(error){console.error('Authentication initialization failed:',error.message);return Response.json({message:'Account service is unavailable. Please try again later.'},{status:503});}}
export {handler as GET,handler as POST};
