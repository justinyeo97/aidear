export const ITINERARY_KEY = 'aidear-itineraries';
export function emptyDate() {return {id:null,title:'Our little date',location:'',date:'',notes:'',stops:[]};}
export function addDateStop(draft, idea, venue, location='') {
  if (venue && draft.stops.some(s=>s.venue?.id===venue.id)) return draft;
  const stop={id:crypto.randomUUID(),ideaId:idea.id,title:idea.title,cost:idea.cost,time:'',venue:venue?{id:venue.id,name:venue.name,address:venue.address || ''}:null};
  const match=draft.stops.findIndex(s=>s.ideaId===idea.id&&!s.venue);
  if(match>=0) {
    if(!venue)return draft;
    return {...draft,location:draft.location||location,stops:draft.stops.map((s,i)=>i===match?{...s,venue:stop.venue}:s)};
  }
  return {...draft,location:draft.location||location,stops:[...draft.stops,stop]};
}
export function moveStop(stops,index,direction) {
  const next=index+direction;
  if(next<0||next>=stops.length)return stops;
  const copy=[...stops];[copy[index],copy[next]]=[copy[next],copy[index]];return copy;
}
export function dateTotal(stops) {return stops.reduce((total,stop)=>total+(Number(stop.cost)||0),0);}
export function readItineraries() {
  try {
    const data=JSON.parse(localStorage.getItem(ITINERARY_KEY)||'null');
    const valid=d=>d&&typeof d.title==='string'&&Array.isArray(d.stops)&&d.stops.every(s=>s&&typeof s.id==='string'&&typeof s.title==='string'&&Number.isFinite(Number(s.cost)));
    return {draft:valid(data?.draft)?data.draft:emptyDate(),saved:Array.isArray(data?.saved)?data.saved.filter(d=>valid(d)&&typeof d.id==='string'):[]};
  }catch{return {draft:emptyDate(),saved:[]};}
}
