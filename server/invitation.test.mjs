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




test('activity choices only require a cuisine for dinner',()=>{
 const body={status:'accepted',date:suggestedDates()[0],time:'19:00'};
 assert.equal(validateReply({...body,activity:'Mini golf'}).cuisine,null);
 assert.equal(validateReply({...body,activity:'Movies',cuisine:'Italian'}).cuisine,null);
 assert.equal(validateReply({...body,activity:'Coffee'}).activity,'Coffee');
 assert.throws(()=>validateReply({...body,activity:'Dinner'}),/cuisine/);
 assert.throws(()=>validateReply({...body,activity:'unknown'}),/activity/);
 assert.equal(validateReply({...body,cuisine:'Japanese'}).activity,'Dinner');
});

test('custom activities are validated, trimmed, and do not require a cuisine',()=>{
 const body={status:'accepted',date:suggestedDates()[0],time:'19:00',activity:'My own idea'};
 const reply=validateReply({...body,customActivity:'  A bookstore crawl  ',cuisine:'Italian'});
 assert.equal(reply.customActivity,'A bookstore crawl');assert.equal(reply.cuisine,null);
 assert.throws(()=>validateReply(body),/activity/);
 assert.throws(()=>validateReply({...body,customActivity:' '.repeat(10)}),/activity/);
 assert.throws(()=>validateReply({...body,customActivity:'a'.repeat(101)}),/activity/);
 assert.equal(validateReply({...body,activity:'Movies',customActivity:'Ignored'}).customActivity,null);
});

test('ride preference accepts only the offered choices and supports older replies',()=>{
 const body={status:'accepted',date:suggestedDates()[0],time:'19:00',activity:'Movies'};
 for(const ride of ['pickup','own'])assert.equal(validateReply({...body,ride}).ride,ride);
 assert.equal(validateReply(body).ride,null);
 assert.throws(()=>validateReply({...body,ride:'decide'}),/ride/);
});


test('each new booking emails the owner without storing booking details',async()=>{
 const messages=[];const {request,docs}=setup({notify:async invite=>{messages.push(structuredClone(invite));return {emailId:'mail'};}});
 const created=await request('create',{owner:true,body:{recipient:'Mia'}});const id=created.data.invitation.id;
 const original=structuredClone(docs.get(id));
 const body={status:'accepted',date:suggestedDates()[0],time:'19:00',cuisine:'Japanese',submissionId:'first-submission-id'};
 for(const submissionId of ['first-submission-id','second-submission-id','third-submission-id'])assert.equal((await request('reply',{id,body:{...body,submissionId}})).data.sent,true);
 assert.equal(messages.length,3);assert.equal(new Set(messages.map(m=>m.response.id)).size,3);
 assert.equal(messages[0].response.cuisine,'Japanese');assert.deepEqual(docs.get(id),original);
 await request('reply',{id,body});assert.equal(messages[3].response.id,messages[0].response.id);
 assert.equal((await request('view',{id})).data.invitation.responded,false);
});
test('email failure returns an error and retry keeps its provider key without saving details',async()=>{
 const messages=[];const {request,docs}=setup({notify:async invite=>{messages.push(invite);if(messages.length===1)throw Error('Unavailable');return {emailId:'recovered'};}});
 const created=await request('create',{owner:true,body:{recipient:'Mia'}});const id=created.data.invitation.id;const original=structuredClone(docs.get(id));
 const body={status:'declined',note:'Another time',submissionId:'retry-submission-id'};
 assert.equal((await request('reply',{id,body})).status,502);
 assert.equal((await request('reply',{id,body})).status,200);
 assert.equal(messages[0].response.id,messages[1].response.id);assert.deepEqual(docs.get(id),original);
});

test('multiple activities validate with dinner anywhere in the list',()=>{
 const body={status:'accepted',date:suggestedDates()[0],time:'19:00',activities:['Coffee','Dinner','My own idea'],customActivity:'Bookstore crawl',cuisine:'Italian'};
 const reply=validateReply(body);assert.deepEqual(reply.activities,body.activities);assert.equal(reply.cuisine,'Italian');assert.equal(reply.customActivity,'Bookstore crawl');
 assert.throws(()=>validateReply({...body,cuisine:null}),/cuisine/);
 for(const activities of [[],null,'Coffee',['unknown'],['Coffee','Coffee']])assert.throws(()=>validateReply({...body,activities}),/activity/);
 assert.equal(validateReply({...body,activities:['Coffee','Movies']}).cuisine,null);
});
