export function scratchStep(previous, x, now) {
  if (!previous || now-previous.time>700) return {state:{anchor:x,direction:0,turns:0,time:now},petted:false};
  const delta=x-previous.anchor;
  if(Math.abs(delta)<5)return {state:previous,petted:false};
  const direction=Math.sign(delta);
  const turns=previous.direction&&direction!==previous.direction?previous.turns+1:previous.turns;
  return {state:{anchor:x,direction,turns:turns>=2?0:turns,time:now},petted:turns>=2};
}
