import {rideLabel} from '../src/dateOptions.js';
export function replyEmail(invitation,{to,from='aidear <onboarding@resend.dev>'}={}) {
  const reply=invitation.response;
  const status={accepted:"It's a date!", 'another-day':'Another day works better.',declined:'Not this time.'}[reply.status];
  const lines=[`A reply from ${invitation.recipient}`, '',status];
  if(reply.date){
    const date=new Intl.DateTimeFormat('en-MY',{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Kuala_Lumpur'}).format(new Date(reply.date+'T12:00:00+08:00'));
    const time=new Intl.DateTimeFormat('en-MY',{hour:'numeric',minute:'2-digit',hour12:true,timeZone:'Asia/Kuala_Lumpur'}).format(new Date(`${reply.date}T${reply.time}:00+08:00`));
    lines.push(`Day: ${date}`,`Time: ${time} (Malaysia time, GMT+8)`,`Activity: ${reply.customActivity || reply.activity || 'Dinner'}`);
  }
  if(reply.date&&(!reply.activity||reply.activity==='Dinner'))lines.push(`Dinner: ${reply.cuisine}`);
  if(reply.date&&reply.ride)lines.push(`Ride: ${rideLabel(reply.ride)}`);
  if(reply.note)lines.push('',`Her note: ${reply.note}`);
  lines.push('','See the plan: https://aidear-iota.vercel.app/?owner=1','','Sent by aidear. Your owner access code is never included in this email.');
  return {from,to:[to],subject:`${invitation.recipient.replace(/[\r\n]/g,' ')} got back to you`,text:lines.join('\n')};
}

export async function sendReplyEmail(invitation,{fetcher=fetch,key=process.env.RESEND_API_KEY,to=process.env.NOTIFICATION_EMAIL,from=process.env.EMAIL_FROM}={}) {
  if(!key||!to)throw Error('Email notifications are not configured on the server.');
  const payload=replyEmail(invitation,{to,from});
  const response=await fetcher('https://api.resend.com/emails',{
    method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json','Idempotency-Key':`aidear-reply/${invitation.id}/${invitation.response.id || 'initial'}`},
    body:JSON.stringify(payload),signal:AbortSignal.timeout(10000)
  });
  if(!response.ok)throw Error(response.status===403?'Resend did not permit this sender or recipient. Check the sender configuration.':response.status===401?'Resend authentication failed. Check the server email key.':response.status===429?'Email service limit reached. Try again later.':'Email service could not accept this notification. Try again later.');
  const result=await response.json();if(!result.id)throw Error('Email service did not confirm acceptance.');
  return {emailId:result.id,sentAt:new Date().toISOString()};
}
