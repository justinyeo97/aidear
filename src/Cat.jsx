import React, {useState, useEffect, useRef} from 'react';

export default function Cat({small=false}) {
  const [petted,setPetted]=useState(false);
  const timer=useRef(null);
  useEffect(()=>()=>clearTimeout(timer.current),[]);
  function pet() {
    clearTimeout(timer.current);
    setPetted(true);
    timer.current=setTimeout(()=>setPetted(false),2200);
  }
  return <button type="button" className={`cat-friend ${small?'cat-friend-small':''} ${petted?'is-purring':''}`} onClick={pet} aria-label="Pet your wingcat" title="Give your wingcat a little love">
    <span className="cat-greeting" aria-live="polite">{petted?'Prrr... lovely choice.':'Psst... a little head scratch?'}</span>
    <span className="cat-motion"><svg className={small?'cat small':'cat'} viewBox="0 0 260 220" fill="none" aria-hidden="true">
      <g className="cat-tail"><path d="M174 191c54 16 74-13 60-30-11-14-26 1-16 10" stroke="#514735" strokeWidth="17" strokeLinecap="round"/><path d="M174 191c54 16 74-13 60-30-11-14-26 1-16 10" stroke="#e8c8a4" strokeWidth="12" strokeLinecap="round"/></g>
      <g className="cat-head">
        <g className="cat-ear-left"><path d="M66 93 50 23q-2-10 9-3l53 34" fill="#e8c8a4" stroke="#514735" strokeWidth="3" strokeLinejoin="round"/><path d="m61 35 10 43 27-23" fill="#d69486"/></g>
        <g className="cat-ear-right"><path d="m158 54 47-34q11-7 9 7l-7 70" fill="#e8c8a4" stroke="#514735" strokeWidth="3" strokeLinejoin="round"/><path d="m174 56 29-21-7 44" fill="#d69486"/></g>
        <path d="M52 118c0-48 34-75 79-75s82 31 82 77c0 45-35 74-83 74s-78-30-78-76Z" fill="#efdab9" stroke="#514735" strokeWidth="3"/>
        <path d="m115 45 6 26m17-26-1 24m17-20-5 21" stroke="#b99673" strokeWidth="8" strokeLinecap="round"/>
        <g className="cat-eyes"><ellipse cx="93" cy="110" rx="5" ry="7" fill="#514735"/><ellipse cx="167" cy="110" rx="5" ry="7" fill="#514735"/></g>
        <path className="cat-happy-eyes" d="M83 112q10-12 20 0m54 0q10-12 20 0" stroke="#514735" strokeWidth="4" strokeLinecap="round"/>
        <path d="m122 127 8 7 8-7Z" fill="#ce8c80"/><path d="M130 134v6m0 0q-11 14-19 0m19 0q11 14 19 0" stroke="#514735" strokeWidth="2.5" strokeLinecap="round"/>
        <g className="cat-whiskers"><path d="m75 130-33-7m34 16-35 4m143-13 33-7m-34 16 35 4" stroke="#514735" strokeWidth="2.5" strokeLinecap="round"/></g>
        <ellipse cx="88" cy="129" rx="12" ry="6" fill="#e8b8a0"/><ellipse cx="172" cy="129" rx="12" ry="6" fill="#e8b8a0"/>
      </g>
      <path d="M90 182q-20 0-20 17t28 14h65q28 0 28-15t-23-16" fill="#efdab9" stroke="#514735" strokeWidth="3"/>
      <path d="m89 199 1 12m9-12 1 13m58-13-1 13m10-13-1 12" stroke="#b99673" strokeWidth="2"/>
      <path className="cat-love" d="M224 61c-13-18-28 1-10 14l10 7 10-10c15-18-4-29-10-11" fill="#c77c68"/>
    </svg></span>
    <span className="pet-hearts" aria-hidden="true"><span>♡</span><span>♡</span><span>♡</span></span>
  </button>;
}
