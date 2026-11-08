import React,{useState,useEffect,useRef} from 'react';
import {Heart,PawPrint,ArrowRight,ArrowLeft,Check,LoaderCircle} from 'lucide-react';
import Cat from './Cat.jsx';
import CatDate from './CatDate.jsx';

export default function DateInvite({id,api,dateLabel,timeLabel,today}){
 const [invite,setInvite]=useState(null),[error,setError]=useState(''),[step,setStep]=useState(0),[saved,setSaved]=useState(false),[busy,setBusy]=useState(false),[noFlipped,setNoFlipped]=useState(false);
 const [date,setDate]=useState(''),[time,setTime]=useState('19:00'),[cuisine,setCuisine]=useState(''),[note,setNote]=useState('');
 const timer=useRef(null),heading=useRef(null),submissionId=useRef(crypto.randomUUID());
 useEffect(()=>{let active=true;api('view',{id}).then(data=>{if(active){setInvite(data.invitation);setSaved(data.invitation.responded);}}).catch(e=>{if(active)setError(e.message);});return()=>{active=false;clearTimeout(timer.current);};},[id,api]);
 useEffect(()=>{if(step>0)heading.current?.focus({preventScroll:true});},[step]);
 function advance(){setError('');setStep(s=>s+1);}
 function playfulNo(){setNoFlipped(true);timer.current=setTimeout(()=>{setNoFlipped(false);setStep(1);},350);}
 function restart(){submissionId.current=crypto.randomUUID();setSaved(false);setStep(0);setDate('');setTime('19:00');setCuisine('');setNote('');setError('');}
 async function submit(e){e.preventDefault();if(step<4){if(step===3&&!cuisine){setError('Pick something tasty first.');return;}advance();return;}
   setBusy(true);setError('');try{await api('reply',{id,body:{status:step===5?'declined':'accepted',date,time,cuisine,note,submissionId:submissionId.current}});setSaved(true);}catch(e){setError(e.message);}finally{setBusy(false);}
 }
 if(!invite)return <div className="quiet-state">{error?<><Heart size={28}/><h1>A little pause.</h1><p role="alert">{error}</p><button className="button secondary" onClick={()=>window.location.reload()}>Try again</button></>:<><LoaderCircle className="spin"/><p>Opening a little something for you...</p></>}</div>;
 if(saved)return <section className="thank-you"><div className="thank-cat"><Cat/></div><div className="eyebrow">A LITTLE PAW-FIVE</div><h1>Got it!<br/><em>{invite.sender} has your reply.</em></h1><p>All saved.<br/>You can pop back here if anything changes.</p><span className="success-seal"><Check size={16}/> All sent</span><button className="button primary" onClick={restart}>Change my picks or plan another <ArrowRight size={16}/></button><p className="small-print">You can use this same invitation again whenever you like.</p></section>;
 const titles=['WILL YOU GO OUT WITH ME?','When are you free?','What time works?','What are you craving?','Looks like a date?','No worries.'];
 return <section className="invitation-layout invitation-centered"><div className="centered-greeting">Hey {invite.recipient} <Heart size={16}/></div>
 <div className="invite-paper step-paper"><div className="step-progress" aria-label={step===0?'Your invitation':step===5?'Your reply':`Step ${step} of 4`}>{[0,1,2,3,4].map(n=><span key={n} className={n<=step?'complete':''}/>)}</div><div key={step} className="step-screen">{step===0?<img className="opening-cat-photo" src="/images/invite-cat.jpg" alt="An orange cat looking up close with big, hopeful eyes" width="640" height="640" fetchPriority="high"/>:<span className="stamp step-stamp"><PawPrint size={25}/></span>}<div className="eyebrow">{step===0?'A VERY IMPORTANT QUESTION':step===4?'ONE LAST THING':step===5?'NO PRESSURE, REALLY':`A LITTLE PLAN / ${step} OF 3`}</div><h2 ref={heading} tabIndex={-1} className={step===0?'opening-question':''}>{titles[step]}</h2>
 {step===0?<><p className="step-intro">{invite.message}</p><div className="yes-no"><button className="button primary" disabled={noFlipped} onClick={()=>setStep(1)}>Yes <Heart size={16}/></button><button className={'button secondary '+(noFlipped?'no-to-yes':'')} disabled={noFlipped} onClick={playfulNo}>{noFlipped?'Yes':'No'}</button></div><div className="signature centered-signature">from <strong>{invite.sender}</strong> <Heart size={14}/></div></>:<form onSubmit={submit}>
 {step===1&&<><div className="choice-row">{invite.dates.filter(d=>d>=today()).map(d=><button key={d} type="button" className={date===d?'choice selected':'choice'} aria-pressed={date===d} onClick={()=>setDate(d)}>{dateLabel(d)}</button>)}</div><label className="field-label">Or pick another day<input type="date" min={today()} value={date} onChange={e=>setDate(e.target.value)} required/></label></>}
 {step===2&&<><div className="choice-row">{['17:00','18:00','19:00','20:00'].map(t=><button type="button" key={t} className={time===t?'choice selected':'choice'} aria-pressed={time===t} onClick={()=>setTime(t)}>{timeLabel(t)}</button>)}</div><label className="field-label">Or another time<input type="time" value={time} onChange={e=>setTime(e.target.value)} required/></label><p className="small-print">Malaysia time (GMT+8).</p></>}
 {step===3&&<div className="cuisine-choices">{invite.cuisines.map(c=><button type="button" key={c} className={cuisine===c?'choice selected':'choice'} aria-pressed={cuisine===c} onClick={()=>setCuisine(c)}>{c}{cuisine===c&&<Check size={13}/>}</button>)}</div>}
 {step===4&&<><p className="step-intro">A quick look before you send your yes.</p><dl className="date-review"><div><dt>When</dt><dd>{dateLabel(date)}</dd></div><div><dt>Time</dt><dd>{timeLabel(time)} MYT</dd></div><div><dt>Dinner</dt><dd>{cuisine}</dd></div></dl></>}
 {step===5&&<p className="step-intro">You can let {invite.sender} know this time is a no.</p>}
 {step>=4&&<label className="field-label">Anything else? <span>optional</span><textarea maxLength={500} value={note} onChange={e=>setNote(e.target.value)} placeholder={step===5?'Anything you want to say?':'Anything you cannot eat? A little request?'} /></label>}
 {error&&<p className="form-error" role="alert">{error}</p>}
 <div className="step-actions"><button type="button" className="button secondary" disabled={busy} onClick={()=>{setError('');setStep(step===5?4:step-1);}}><ArrowLeft size={15}/> Back</button><button className="button primary" disabled={busy}>{busy?<><LoaderCircle className="spin" size={16}/> Sending...</>:step<4?<>Next <ArrowRight size={16}/></>:step===5?'Send my no':<>Yes, send my reply <Heart size={16}/></>}</button></div>
 {step===4&&<button type="button" className="real-no" onClick={()=>setStep(5)}>Actually, not this time</button>}
 {step>=4&&<p className="small-print">Nothing is sent until you press {step===5?'Send my no':'Yes, send my reply'}.</p>}
 </form>}</div></div><div className="centered-scene" aria-hidden="true"><CatDate/></div></section>;
}
