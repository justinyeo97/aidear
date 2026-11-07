import React, {useState, useEffect} from 'react';
import {Heart, MapPin, ArrowUpRight, LoaderCircle, X} from 'lucide-react';

export function readPlaces() {
  try {
    const stored = JSON.parse(localStorage.getItem('aidear-saved-places') || '[]');
    return Array.isArray(stored) ? stored.filter(p => p && typeof p.id === 'string' && typeof p.name === 'string').map(p => ({...p, mapsUrl: 'https://www.google.com/maps/search/?' + new URLSearchParams({api:'1', query:[p.name, p.address].filter(Boolean).join(' ')})})) : [];
  } catch { return []; }
}
export function PlaceCards({places, saved, toggle}) {
  return <div className="place-grid">{places.map(place => <article className="place-card" key={place.id}>
    {place.image && /^https?:\/\//.test(place.image) && <img src={place.image} alt="" loading="lazy" onError={e => {e.currentTarget.style.display='none'}}/>}
    <div className="place-content"><h3>{place.name}</h3><p><MapPin size={13}/> {place.address || 'Address unavailable'}</p>
    {place.rating != null && <p>Rating: {place.rating} / 5 {place.reviews != null ? `(${place.reviews} reviews)` : ''}</p>}
    {place.price && <p>Price level: {place.price}</p>}{place.hours && <p>{place.hours}</p>}
    <div className="place-actions"><a href={place.mapsUrl} target="_blank" rel="noopener noreferrer">Google Maps <ArrowUpRight size={14}/></a><button onClick={()=>toggle(place)} aria-label={`${saved.some(p=>p.id===place.id)?'Unsave':'Save'} ${place.name}`} aria-pressed={saved.some(p=>p.id===place.id)}><Heart size={18} fill={saved.some(p=>p.id===place.id)?'currentColor':'none'}/></button></div></div>
  </article>)}</div>;
}
export function NearbyPlaces({idea, location, editPreferences, saved, toggle, close}) {
  const [places,setPlaces]=useState([]),[loading,setLoading]=useState(false),[error,setError]=useState(''),[searched,setSearched]=useState(false);
  const [retry,setRetry]=useState(0);
  useEffect(()=>{
    const request=new AbortController();
    async function search() {
    setLoading(true);setError('');setPlaces([]);setSearched(false);
    try {
      const response=await fetch('/api/places?'+new URLSearchParams({idea:idea.id,location:location.trim()}),{signal:request.signal});
      if (!response.headers.get('content-type')?.includes('application/json')) throw Error('Start the app with npm.cmd run dev or npm.cmd run preview to use venue search. Live Server cannot run the search backend.');
      const data=await response.json();
      if(!response.ok)throw Error(data.error || 'Venue search failed. Please try again.');
      if(!request.signal.aborted){setPlaces(data.places);setSearched(true);}
    } catch(err) {if(!request.signal.aborted)setError(err.message || 'Could not load nearby places.');}
    finally {if(!request.signal.aborted)setLoading(false);}
    }
    search();
    return ()=>request.abort();
  },[idea.id,location,retry]);
  return <section className="nearby-panel" aria-labelledby="nearby-title"><div className="nearby-heading"><div><span className="eyebrow muted">FIND YOUR SPOT</span><h2 id="nearby-title">Places for {idea.title.toLowerCase()}</h2></div><button className="surprise" onClick={close} aria-label="Close nearby places"><X size={18}/></button></div>
    <div className="search-context"><span><MapPin size={15}/> Near {location}</span><button className="text-button" onClick={editPreferences}>Change preferences</button></div>
    {loading&&<p role="status" className="data-note"><LoaderCircle size={15} className="spin"/> Looking for places that fit your date...</p>}{error&&<div><p role="alert" className="error">{error}</p><button className="surprise" onClick={()=>setRetry(n=>n+1)}>Try again</button></div>}
    <PlaceCards places={places} saved={saved} toggle={toggle}/>
    {searched&&!places.length&&<p className="data-note">No places found. Try a broader area.</p>}
    <p className="data-note">Google Local results via SerpApi. Check current hours and prices before heading out. Saved places stay in this browser.</p>
  </section>;
}
