import test from 'node:test';
import assert from 'node:assert/strict';
import {scratchStep} from './headScratch.js';
test('requires back-and-forth strokes rather than one pass or jitter',()=>{
  let state=null,pets=0;
  for(const [i,x] of [10,12,13,20,30,20,10,20].entries()){
    const step=scratchStep(state,x,i*40);state=step.state;pets+=Number(step.petted);
  }
  assert.equal(pets,1);
});
test('one-way movement does not pet the cat',()=>{
  let state=null;
  for(const [i,x] of [0,10,20,30,40].entries()){
    const step=scratchStep(state,x,i*30);assert.equal(step.petted,false);state=step.state;
  }
});
test('a pause resets the stroke sequence',()=>{
  let state=scratchStep(null,0,0).state;
  state=scratchStep(state,20,50).state;
  state=scratchStep(state,0,100).state;
  const next=scratchStep(state,20,1000);
  assert.equal(next.petted,false);assert.equal(next.state.turns,0);
});
