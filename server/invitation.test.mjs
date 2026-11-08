import test from 'node:test';
import assert from 'node:assert/strict';
import {invitationHandler,ownerSession,validSession,validateReply,suggestedDates} from './invitation.mjs';
const key='owner-key-for-tests';
function setup(options={}){
 const docs=new Map();
 const store={async read(id){return docs.get(id)||null;},async write(data,etag){const old=docs.get(data.id);assert.equal(etag,old?.etag);docs.set(data.id,{data:structuredClone(data),etag:String(Number(old?.etag||0)+1)});},async all(){return [...docs.values()].map(x=>x.data);}};
 const handler=invitationHandler({store,key:()=>key,notify:async()=>({emailId:'test-email',sentAt:new Date().toISOString()}),...options});
 async function request(action,{id,body,owner=false,headers={}}={}){
  let status,data;const responseHeaders={};
  await handler({url:'/api/invitation?'+new URLSearchParams({action,...(id?{id}:{})}),method:body?'POST':'GET',body,headers:{host:'example.test',origin:'https://example.test','content-type':'application/json',...(owner?{cookie:'aidear_owner='+ownerSession(key)}:{}),...headers},socket:{remoteAddress:'test-'+Math.random()}},{setHeader(k,v){responseHeaders[k]=v;},writeHead(value){status=value;},end(value){data=JSON.parse(value);}});
  return {status,data,headers:responseHeaders};
 }
 return {request,docs};
}
test('private owner access rejects missing, tampered and expired sessions',()=>{
 assert.equal(validSession(null,key),false);
 assert.equal(validSession(ownerSession(key),key),true);
 assert.equal(validSession(ownerSession('other-key'),key),false);
 assert.equal(validSession(ownerSession(key,0),key),false);
});
test('owner can create an invitation; guests cannot read the private desk',async()=>{
 const {request}=setup();
 assert.equal((await request('owner')).status,401);
 assert.equal((await request('create',{body:{recipient:'Mia'}})).status,401);
 const created=await request('create',{owner:true,body:{recipient:'Mia',sender:'Justin'}});
 assert.equal(created.status,201);assert.match(created.data.invitation.id,/^[a-f0-9]{48}$/);
 assert.equal(created.data.invitation.recipient,'Mia');assert.equal(created.data.invitation.dates.length,3);
});
test('reply is durable, owner-only, and repeated submissions do not overwrite it',async()=>{
 const {request,docs}=setup();
 const created=await request('create',{owner:true,body:{recipient:'Mia'}});const id=created.data.invitation.id;
 const body={status:'accepted',date:suggestedDates()[0],time:'19:00',cuisine:'Japanese',note:'No shellfish please'};
 assert.equal((await request('reply',{id,body})).status,200);
 const guest=await request('view',{id});assert.equal(guest.data.invitation.responded,true);assert.equal('response' in guest.data.invitation,false);
 const owner=await request('owner',{owner:true});assert.equal(owner.data.invitations[0].response.cuisine,'Japanese');assert.equal(owner.data.invitations[0].seenAt,null);
 assert.equal((await request('reply',{id,body})).data.alreadyReplied,true);
 assert.equal(docs.get(id).data.response.cuisine,'Japanese');
 await request('seen',{id,owner:true,body:{}});assert.ok(docs.get(id).data.seenAt);
});
test('validates time, cuisine, dates and accepts a respectful decline',()=>{
 const body={status:'accepted',date:suggestedDates()[0],time:'19:00',cuisine:'Italian'};
 assert.equal(validateReply(body).timezone,'Asia/Kuala_Lumpur');
 assert.throws(()=>validateReply({...body,time:'25:00'}),/time/);
 assert.throws(()=>validateReply({...body,date:'2000-01-01'}),/date/);
 assert.throws(()=>validateReply({...body,cuisine:'unknown'}),/cuisine/);
 assert.equal(validateReply({status:'declined'}).status,'declined');
});
test('rejects cross-origin writes and only sets a private HttpOnly owner cookie',async()=>{
 const {request}=setup();
 assert.equal((await request('session',{body:{key},headers:{origin:'https://another.test'}})).status,403);
 assert.equal((await request('session',{body:{key:'incorrect'}})).status,401);
 const login=await request('session',{body:{key}});assert.equal(login.status,200);assert.match(login.headers['Set-Cookie'],/HttpOnly; SameSite=Strict/);assert.equal(JSON.stringify(login.data).includes(key),false);
});

test('saves a reply before notifying and does not resend on repeated submission',async()=>{
 let calls=0;
 const {request,docs}=setup({notify:async invite=>{calls++;assert.equal(docs.get(invite.id).data.response.cuisine,'Korean');return {emailId:'notification-1',sentAt:new Date().toISOString()};}});
 const created=await request('create',{owner:true,body:{recipient:'Mia'}});const id=created.data.invitation.id;
 const body={status:'accepted',date:suggestedDates()[0],time:'18:00',cuisine:'Korean'};
 await request('reply',{id,body});await request('reply',{id,body});
 assert.equal(calls,1);assert.equal(docs.get(id).data.notification.status,'sent');
 const guest=await request('view',{id});assert.equal('notification' in guest.data.invitation,false);
});

test('email failure preserves the reply and allows owner-only retry',async()=>{
 let calls=0;
 const {request,docs}=setup({notify:async()=>{if(++calls===1)throw Error('Email service unavailable');return {emailId:'recovered',sentAt:new Date().toISOString()};}});
 const created=await request('create',{owner:true,body:{recipient:'Mia'}});const id=created.data.invitation.id;
 const response=await request('reply',{id,body:{status:'declined',note:'Another time'}});
 assert.equal(response.status,200);assert.equal(docs.get(id).data.response.status,'declined');assert.equal(docs.get(id).data.notification.status,'failed');
 assert.equal((await request('retry-email',{id,body:{}})).status,401);
 assert.equal((await request('retry-email',{id,owner:true,body:{}})).status,200);
 assert.equal(docs.get(id).data.notification.status,'sent');
 await request('retry-email',{id,owner:true,body:{}});assert.equal(calls,2);
});

test('same invitation accepts another reply, preserves history, and notifies again',async()=>{
 let calls=0;
 const {request,docs}=setup({notify:async()=>({emailId:`mail-${++calls}`,sentAt:new Date().toISOString()})});
 const created=await request('create',{owner:true,body:{recipient:'Mia'}});const id=created.data.invitation.id;
 const body={status:'accepted',date:suggestedDates()[0],time:'19:00',cuisine:'Japanese',submissionId:'first-submission-id'};
 await request('reply',{id,body});
 const firstId=docs.get(id).data.response.id;
 await request('seen',{id,owner:true,body:{}});
 const second=await request('reply',{id,body:{...body,time:'20:00',cuisine:'Italian',submissionId:'second-submission-id'}});
 assert.equal(second.status,200);assert.equal(calls,2);
 assert.equal(docs.get(id).data.response.cuisine,'Italian');
 assert.notEqual(docs.get(id).data.response.id,firstId);
 assert.equal(docs.get(id).data.responseHistory[0].cuisine,'Japanese');
 assert.equal(docs.get(id).data.seenAt,null);
 const guest=await request('view',{id});assert.equal('responseHistory' in guest.data.invitation,false);
 await request('reply',{id,body});assert.equal(calls,2);assert.equal(docs.get(id).data.response.cuisine,'Italian');
});

test('activity choices only require a cuisine for dinner',()=>{
 const body={status:'accepted',date:suggestedDates()[0],time:'19:00'};
 assert.equal(validateReply({...body,activity:'Mini golf'}).cuisine,null);
 assert.equal(validateReply({...body,activity:'Movies',cuisine:'Italian'}).cuisine,null);
 assert.equal(validateReply({...body,activity:'Coffee'}).activity,'Coffee');
 assert.throws(()=>validateReply({...body,activity:'Dinner'}),/cuisine/);
 assert.throws(()=>validateReply({...body,activity:'unknown'}),/activity/);
 assert.equal(validateReply({...body,cuisine:'Japanese'}).activity,'Dinner');
});
