import React from 'react';
import './cat-date.css';

function DateCat({dark=false}) {
  const fur=dark?'#697d75':'#edc397';
  const ink='#414c43';
  return <>
    <path className="date-tail" d="M-27 62C-74 74-79 38-60 33" fill="none" stroke={fur} strokeWidth="13" strokeLinecap="round"/>
    <path d="M-34 31Q-47 71-29 88H31Q49 66 32 30" fill={fur} stroke={ink} strokeWidth="2"/>
    <g className="date-cat-head">
      <path d="M-37-13-40-49-14-33Q0-38 17-32L40-49 37-9C48 34-47 34-37-13Z" fill={fur} stroke={ink} strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="m-34-38 3 18 12-9m52-9-2 18-12-9" fill={dark?'#c2aba1':'#d9998b'}/>
      <path d="M-8-34-5-21m13-13-1 13" stroke={dark?'#4b645d':'#cb9c6f'} strokeWidth="5" strokeLinecap="round"/>
      <g className="date-cat-eyes"><ellipse cx="-17" cy="-5" rx="3" ry="4.5" fill={ink}/><ellipse cx="17" cy="-5" rx="3" ry="4.5" fill={ink}/></g>
      <path d="m-4 5 4 4 4-4" fill="#b47d72"/><path d="M0 9v4m0 0q-7 8-11 0m11 0q7 8 11 0m-39-9-16-3m16 10-16 3m72-10 16-3m-16 10 16 3" stroke={ink} strokeWidth="1.5" strokeLinecap="round"/>
      <ellipse cx="-25" cy="7" rx="7" ry="3.5" fill="#dca897"/><ellipse cx="25" cy="7" rx="7" ry="3.5" fill="#dca897"/>
    </g>
    <path d="M-19 35q-9 7-6 20m44-20q9 7 6 20" stroke={ink} strokeWidth="2" strokeLinecap="round"/>
    {dark?<path d="m-10 30 10 6 10-6v12L0 36l-10 6Z" fill="#d9ab85"/>:<path d="m-23 29 23 8 23-8" stroke="#c17e6b" strokeWidth="6" strokeLinecap="round"/>}
  </>;
}

export default function CatDate() {
  return <svg className="cat-date-scene" viewBox="0 0 440 400" preserveAspectRatio="xMidYMid slice" role="img" aria-labelledby="cat-date-title cat-date-desc">
    <title id="cat-date-title">A little table for two cats</title>
    <desc id="cat-date-desc">Two cats share warm drinks and a candlelit date beneath a moonlit window. They gently lean toward each other as hearts float above the table.</desc>
    <defs><linearGradient id="date-wall" x2="0" y2="1"><stop stopColor="#ece7d6"/><stop offset="1" stopColor="#dedcc4"/></linearGradient><linearGradient id="date-night" x2="0" y2="1"><stop stopColor="#637b77"/><stop offset="1" stopColor="#a2b1a0"/></linearGradient><radialGradient id="date-candle"><stop stopColor="#f9d999" stopOpacity=".6"/><stop offset="1" stopColor="#f9d999" stopOpacity="0"/></radialGradient></defs>
    <path fill="url(#date-wall)" d="M0 0h440v400H0z"/>
    <path d="M100 225V110a120 120 0 0 1 240 0v115Z" fill="url(#date-night)" stroke="#c4bea2" strokeWidth="9"/>
    <path d="M220 0v225M100 142h240" stroke="#dad6bf" strokeWidth="6"/>
    <path d="M277 53a21 21 0 1 0 23 28 20 20 0 0 1-23-28" fill="#f6e9bf"/>
    <g fill="#f6e9bf"><circle className="date-star" cx="160" cy="76" r="2"/><circle className="date-star second" cx="247" cy="112" r="2"/><circle cx="189" cy="38" r="1.5"/></g>
    <path d="M0 302h440v98H0z" fill="#cecbb4"/>
    <path d="m0 345 440-1M52 302l-20 98m130-98-6 98m127-98 8 98m95-98 26 98" stroke="#bcbda7" strokeWidth="1"/>
    <ellipse cx="225" cy="348" rx="150" ry="18" fill="#9a9f84" opacity=".22"/>
    <path d="M78 267v66m78-66v66m126-66v66m78-66v66" stroke="#8b9278" strokeWidth="7" strokeLinecap="round"/>
    <path d="M76 213v59h82m204-59v59h-82" fill="none" stroke="#98a184" strokeWidth="8" strokeLinecap="round"/>
    <g transform="translate(133 216)"><g className="date-cat-left"><DateCat/></g></g>
    <g transform="translate(308 216)"><g className="date-cat-right"><DateCat dark/></g></g>
    <path d="m206 283-8 62m38-62 8 62" stroke="#7b826b" strokeWidth="8" strokeLinecap="round"/>
    <ellipse cx="220" cy="278" rx="98" ry="15" fill="#a08e70"/>
    <path d="M122 267q98 25 196 0v13q-98 28-196 0Z" fill="#c5ae87"/>
    <ellipse cx="220" cy="267" rx="98" ry="17" fill="#e7d5b4"/>
    <ellipse cx="172" cy="270" rx="23" ry="5" fill="#c8b895"/><ellipse cx="270" cy="270" rx="23" ry="5" fill="#c8b895"/>
    <g fill="#fcf4df" stroke="#a79c80" strokeWidth="1.5"><path d="M158 250h26l-3 17q-10 8-20 0Z"/><path d="M184 253q15-3 12 6t-13 4" fill="none"/><path d="M257 250h26l-3 17q-10 8-20 0Z"/><path d="M283 253q15-3 12 6t-13 4" fill="none"/></g>
    <g fill="none" stroke="#f9f4e5" strokeWidth="2.5" strokeLinecap="round"><path className="date-steam" d="M170 242c-9-8 9-10 0-19"/><path className="date-steam second" d="M270 242c-9-8 9-10 0-19"/></g>
    <circle cx="220" cy="247" r="35" fill="url(#date-candle)"/>
    <path d="M214 249h12v19h-12z" fill="#f5ead0" stroke="#b5a482"/><path className="date-flame" d="M220 232q-10 12 0 16 9-4 0-16" fill="#e3b46b"/>
    <g className="date-hearts" fill="#bf8375"><path d="M219 169c-14-17-25 3-10 13l10 8 10-8c15-12 2-29-10-13Z"/><path className="second" d="M244 147c-8-10-15 2-6 8l6 5 6-5c9-7 1-17-6-8Z"/></g>
    <path d="M31 297h29l-5 29H36Z" fill="#a98d72"/><path d="M46 297v-53m0 30q-27-2-23-24 25 1 23 24m0-11q25-1 23-22-25 1-23 22" fill="#889778" stroke="#738565" strokeWidth="2"/>
  </svg>;
}
