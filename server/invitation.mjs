import {createHmac,randomBytes,timingSafeEqual} from 'node:crypto';
import {get,put,list,del,BlobPreconditionFailedError} from '@vercel/blob';
import {sendReplyEmail} from './notifications.mjs';
const COOKIE='aidear_owner';
const isId=id=>typeof id==='string'&&/^[a-f0-9]{48}$/.test(id);
export const cuisines=['Japanese','Italian','Korean','Chinese','Thai','Western','Surprise me'];
const compare=(a,b)=>typeof a==='string'&&typeof b==='string'&&Buffer.byteLength(a)===Buffer.byteLength(b)&&timingSafeEqual(Buffer.from(a),Buffer.from(b));
const sign=(text,key)=>createHmac('sha256',key).update(text).digest('hex');
export function ownerSession(key,now=Date.now()){const expiry=String(now+7*86400000);return `${expiry}.${sign(expiry,key)}`;}
export function validSession(value,key,now=Date.now()){if(!key||!value)return false;const [expiry,signature]=value.split('.');return /^\d+$/.test(expiry)&&Number(expiry)>now&&compare(signature,sign(expiry,key));}
export function localToday(){return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kuala_Lumpur',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
export function suggestedDates(){const current=new Date(localToday()+'T12:00:00+08:00');const dates=[];for(let n=1;n<=14&&dates.length<3;n++){const next=new Date(current.getTime()+n*86400000);if([5,6,0].includes(next.getUTCDay()))dates.push(next.toISOString().slice(0,10));}return dates;}
export function validateReply(body){
  if(!['accepted','another-day','declined'].includes(body.status))throw Error('Please choose a reply.');
  if(body.status==='declined')return {status:body.status,note:String(body.note||'').trim().slice(0,500)};
  if(typeof body.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(body.date)||Number.isNaN(Date.parse(body.date+'T12:00:00Z'))||new Date(body.date+'T12:00:00Z').toISOString().slice(0,10)!==body.date||body.date<localToday())throw Error('Choose today or a future date.');
  if(typeof body.time!=='string'||!/^([01]\d|2[0-3]):[0-5]\d$/.test(body.time))throw Error('Choose a preferred time.');
  if(!cuisines.includes(body.cuisine))throw Error('Choose a dinner cuisine.');
  return {status:body.status,date:body.date,time:body.time,cuisine:body.cuisine,note:String(body.note||'').trim().slice(0,500),timezone:'Asia/Kuala_Lumpur'};
}
export const blobStore={
  async remove(id,etag){return del(`invitations/${id}.json`,{ifMatch:etag});},
  async read(id){const result=await get(`invitations/${id}.json`,{access:'private',useCache:false});if(!result)return null;return {data:await new Response(result.stream).json(),etag:result.blob.etag};},
  async write(data,etag){return put(`invitations/${data.id}.json`,JSON.stringify(data),{access:'private',addRandomSuffix:false,allowOverwrite:Boolean(etag),...(etag?{ifMatch:etag}:{}),contentType:'application/json',cacheControlMaxAge:60});},
  async all(){let cursor;const records=[];do{const page=await list({prefix:'invitations/',limit:100,...(cursor?{cursor}:{})});const docs=await Promise.all(page.blobs.map(blob=>this.read(blob.pathname.split('/').pop().replace('.json',''))));records.push(...docs.filter(Boolean).map(doc=>doc.data));cursor=page.hasMore?page.cursor:null;}while(cursor);return records.sort((a,b)=>b.createdAt.localeCompare(a.createdAt));}
};
const limits=new Map();
async function readBody(req){if(req.body!==undefined){const text=typeof req.body==='string'?req.body:JSON.stringify(req.body);if(Buffer.byteLength(text)>8000)throw Error('Reply is too long.');return JSON.parse(text);}let text='';for await(const part of req){text+=part;if(Buffer.byteLength(text)>8000)throw Error('Reply is too long.');}return JSON.parse(text||'{}');}
export function invitationHandler({store=blobStore,key=()=>process.env.INVITE_ADMIN_KEY,notify=sendReplyEmail,emailConfigured=()=>Boolean(process.env.RESEND_API_KEY&&process.env.NOTIFICATION_EMAIL)}={}){
  async function notifyOwner(invitation){
    let notification;
    try{notification={status:'sent',...await notify(invitation)};}
    catch(error){notification={status:'failed',error:error.name==='TimeoutError'?'Email delivery was not confirmed in time. You can retry safely within 24 hours.':error instanceof TypeError?'Email service could not be reached. Try again later.':error.message,attemptedAt:new Date().toISOString()};}
    // Merge into the latest copy so an owner's mark-as-seen isn't overwritten.
    try{for(let attempt=0;attempt<2;attempt++){const latest=await store.read(invitation.id);if(!latest||latest.data.response?.id!==invitation.response?.id||latest.data.notification?.status==='sent')return latest?.data.notification||notification;try{await store.write({...latest.data,notification},latest.etag);return notification;}catch(error){if(!(error instanceof BlobPreconditionFailedError)||attempt===1)throw error;}}}
    catch{console.error('Could not persist email delivery status');}
    return notification;
  }
  return async(req,res)=>{
    const url=new URL(req.url,'http://localhost');const action=url.searchParams.get('action')||'view';
    const send=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'});res.end(JSON.stringify(data));};
    const secret=key();if(!secret)return send(503,{error:'The invitation desk is being prepared. Please try again shortly.'});
    const cookie=(req.headers?.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(COOKIE+'='))?.slice(COOKIE.length+1);
    const owner=validSession(cookie,secret);
    if(!['GET','POST'].includes(req.method))return send(405,{error:'Method not allowed.'});
    if(req.method==='POST'){
      const origin=req.headers?.origin;const host=req.headers?.host;
      if(origin&&(!host||new URL(origin).host!==host))return send(403,{error:'Please send your reply from the invitation page.'});
      if(!req.headers?.['content-type']?.includes('application/json'))return send(415,{error:'JSON required.'});
      const client=req.headers?.['x-vercel-forwarded-for']||req.socket?.remoteAddress||'local';const bucket=`${client}:${action}`;let rate=limits.get(bucket);if(!rate||rate.until<Date.now())rate={count:0,until:Date.now()+60000};if(++rate.count>15)return send(429,{error:'Please wait a minute before trying again.'});limits.set(bucket,rate);if(limits.size>1000)for(const [id,value]of limits)if(value.until<Date.now())limits.delete(id);
    }
    try{
      if(action==='session'&&req.method==='POST'){
        const body=await readBody(req);if(!compare(body.key,secret))return send(401,{error:'That access code is not correct.'});
        res.setHeader('Set-Cookie',`${COOKIE}=${ownerSession(secret)}; HttpOnly; SameSite=Strict; Path=/api; Max-Age=604800${process.env.VERCEL?'; Secure':''}`);return send(200,{ok:true});
      }
      if(action==='logout'&&req.method==='POST'){res.setHeader('Set-Cookie',`${COOKIE}=; HttpOnly; SameSite=Strict; Path=/api; Max-Age=0${process.env.VERCEL?'; Secure':''}`);return send(200,{ok:true});}
      if(['owner','create','seen','revoke','retry-email'].includes(action)&&!owner)return send(401,{error:'Sign in to your private invitation desk.'});
      if(action==='owner'&&req.method==='GET')return send(200,{invitations:await store.all(),defaults:{dates:suggestedDates(),cuisines},emailConfigured:emailConfigured()});
      if(action==='create'&&req.method==='POST'){
        const body=await readBody(req);const recipient=String(body.recipient||'Mia').trim(),sender=String(body.sender||'Justin').trim(),message=String(body.message||'A little time for just the two of us. Pick a day, a time, and something delicious. I will take care of the rest.').trim();
        if(!recipient||recipient.length>60||!sender||sender.length>60||message.length>700)return send(400,{error:'Add short names and a message under 700 characters.'});
        const record={id:randomBytes(24).toString('hex'),recipient,sender,message,dates:suggestedDates(),cuisines,createdAt:new Date().toISOString(),response:null,seenAt:null};await store.write(record);return send(201,{invitation:record});
      }
      const id=url.searchParams.get('id');if(!isId(id))return send(404,{error:'This invitation link is not available.'});
      const record=await store.read(id);if(!record)return send(404,{error:'This invitation link is not available.'});
      if(action==='view'&&req.method==='GET'){const {response,responseHistory,seenAt,notification,...invite}=record.data;return send(200,{invitation:{...invite,dates:suggestedDates(),responded:Boolean(response)}});}
      if(action==='reply'&&req.method==='POST'){
        const body=await readBody(req);const reply=validateReply(body);
        const submissionId=typeof body.submissionId==='string'&&/^[a-zA-Z0-9-]{16,64}$/.test(body.submissionId)?body.submissionId:sign(JSON.stringify(reply),secret);
        if(record.data.response?.submissionId===submissionId||(record.data.responseHistory||[]).some(r=>r.submissionId===submissionId))return send(200,{saved:true,alreadyReplied:true});
        const updated={...record.data,responseHistory:[...(record.data.responseHistory||[]),...(record.data.response?[record.data.response]:[])],response:{...reply,id:randomBytes(12).toString('hex'),submissionId,receivedAt:new Date().toISOString()},seenAt:null,notification:{status:'pending'}};
        await store.write(updated,record.etag);
        await notifyOwner(updated);
        return send(200,{saved:true});
      }
      if(action==='retry-email'&&req.method==='POST'){
        if(!record.data.response)return send(400,{error:'No reply to email yet.'});
        if(record.data.notification?.status==='sent')return send(200,{ok:true,notification:record.data.notification});
        if(Date.now()-Date.parse(record.data.response.receivedAt)>23*3600000)return send(409,{error:'This reply is outside the safe retry window. Check Resend before sending another email.'});
        const notification=await notifyOwner(record.data);return send(notification.status==='sent'?200:502,{ok:notification.status==='sent',notification,...(notification.status==='failed'?{error:notification.error}:{})});
      }
      if(action==='seen'&&req.method==='POST'){await store.write({...record.data,seenAt:new Date().toISOString()},record.etag);return send(200,{ok:true});}
      if(action==='revoke'&&req.method==='POST'){await store.remove(id,record.etag);return send(200,{ok:true});}
      return send(404,{error:'Not found.'});
    }catch(error){
      if(error instanceof BlobPreconditionFailedError)return send(409,{error:'This invitation changed while you were replying. Refresh the page to see its current status.'});
      if(error instanceof SyntaxError)return send(400,{error:'The reply could not be read. Please try again.'});
      if(/Choose|Please choose|Reply is too long/.test(error.message))return send(400,{error:error.message});
      console.error('Invitation operation failed',{action,type:error.name});return send(503,{error:'We could not save or load this just yet. Please try again; no confirmation has been sent.'});
    }
  };
}
