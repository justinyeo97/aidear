import test from 'node:test';
import assert from 'node:assert/strict';
import {emptyDate,addDateStop,moveStop,dateTotal,readItineraries,ITINERARY_KEY} from './itinerary.js';

test('attaching a venue preserves the planned stop, timing and cost',()=>{
  const idea={id:'minigolf',title:'Mini golf',cost:80};
  const first=addDateStop(emptyDate(),idea,null,'Kuala Lumpur');
  first.stops[0].time='17:00';first.stops[0].cost=75;
  const venue={id:'venue-1',name:'Mini golf venue',address:'Test Street'};
  const next=addDateStop(first,idea,venue,'Kuala Lumpur');
  assert.equal(next.stops.length,1);
  assert.equal(next.stops[0].id,first.stops[0].id);
  assert.equal(next.stops[0].time,'17:00');
  assert.equal(next.stops[0].cost,75);
  assert.equal(next.stops[0].venue.name,venue.name);
  assert.equal(first.stops[0].venue,null);
  assert.equal(addDateStop(next,idea,venue),next);
});
test('activity, dinner and dessert reorder without changing their total',()=>{
  let draft=emptyDate();
  for(const [id,cost] of [['minigolf',80],['dinner',100],['dessert',40]])draft=addDateStop(draft,{id,title:id,cost});
  const reordered=moveStop(draft.stops,2,-1);
  assert.deepEqual(reordered.map(s=>s.ideaId),['minigolf','dessert','dinner']);
  assert.deepEqual(draft.stops.map(s=>s.ideaId),['minigolf','dinner','dessert']);
  assert.equal(dateTotal(reordered),220);
  assert.equal(moveStop(draft.stops,0,-1),draft.stops);
});
test('reload restores drafts and saved itineraries, and tolerates corrupt storage',()=>{
  const original=globalThis.localStorage;
  let data=JSON.stringify({draft:addDateStop(emptyDate(),{id:'dinner',title:'Dinner',cost:100}),saved:[{...emptyDate(),id:'saved-date'}]});
  globalThis.localStorage={getItem(key){assert.equal(key,ITINERARY_KEY);return data;}};
  try{
    assert.equal(readItineraries().draft.stops[0].title,'Dinner');
    assert.equal(readItineraries().saved[0].id,'saved-date');
    data='{not json';assert.deepEqual(readItineraries(),{draft:emptyDate(),saved:[]});
  }finally{if(original===undefined)delete globalThis.localStorage;else globalThis.localStorage=original;}
});
