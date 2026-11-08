import test from 'node:test';
import assert from 'node:assert/strict';
import {replyEmail,sendReplyEmail} from './notifications.mjs';
const invitation={id:'test-id',recipient:'Mia',response:{status:'accepted',date:'2030-01-12',time:'19:00',cuisine:'Japanese',note:'Vegetarian options please'}};
test('email contains the reply details in Malaysia time without owner credentials',()=>{
 const mail=replyEmail(invitation,{to:'owner@example.test'});
 assert.deepEqual(mail.to,['owner@example.test']);assert.equal(mail.from,'aidear <onboarding@resend.dev>');
 assert.match(mail.text,/Japanese/);assert.match(mail.text,/Vegetarian options/);assert.match(mail.text,/GMT\+8/);
 assert.match(mail.text,/19:00|7:00/);assert.match(mail.text,/owner=1/);
});
test('uses the configured recipient and stable provider idempotency key',async()=>{
 let captured;
 const result=await sendReplyEmail(invitation,{key:'private-key',to:'owner@example.test',fetcher:async(url,options)=>{captured=options;return {ok:true,json:async()=>({id:'email-1'})};}});
 assert.equal(result.emailId,'email-1');assert.equal(captured.headers['Idempotency-Key'],'aidear-reply/test-id/initial');
 assert.deepEqual(JSON.parse(captured.body).to,['owner@example.test']);assert.equal(captured.body.includes('private-key'),false);
});
test('reports sender restrictions without exposing provider response or key',async()=>{
 await assert.rejects(sendReplyEmail(invitation,{key:'private-key',to:'owner@example.test',fetcher:async()=>({ok:false,status:403})}),/sender or recipient/);
});
