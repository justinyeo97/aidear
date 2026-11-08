export const CUSTOM_ACTIVITY='My own idea';
export const rideOptions=[
  {value:'pickup',label:'Yes, come get me',description:'Passenger princess mode: on.'},
  {value:'own',label:"I'll make my own entrance",description:'Meet you there, looking cute.'},
  {value:'decide',label:"Let's figure it out",description:'Transport is a future-us problem.'},
];
export const rideLabel=value=>rideOptions.find(option=>option.value===value)?.label || 'Not specified';
export const dateActivities = [
  {name:CUSTOM_ACTIVITY,description:'Got something else in mind? Tell me'},
  {name:'Dinner',description:'Good food and a proper catch-up'},
  {name:'Coffee',description:'Something warm and an easy chat'},
  {name:'Ring making',description:'Make a little keepsake for each other'},
  {name:'Jewellery making',description:'Beads, charms, and something that is ours'},
  {name:'Candle making',description:'Pick a scent and make something cosy'},
  {name:'Perfume workshop',description:'Mix a scent that reminds us of today'},
  {name:'Movies',description:'A film, popcorn, and your company'},
  {name:'Mini golf',description:'A little friendly competition'},
  {name:'Bowling',description:'A few strikes, a few laughs'},
  {name:'Picnic',description:'Fresh air and our favourite snacks'},
  {name:'Arcade',description:'You can be my player two'},
  {name:'Pottery',description:'Make something a little wonky'},
  {name:'Ceramic painting',description:'Paint a mug for our next coffee date'},
  {name:'Painting workshop',description:'A blank canvas and zero pressure'},
  {name:'Tufting workshop',description:'Make a fluffy little rug together'},
  {name:'Terrarium making',description:'Build a tiny green world for two'},
  {name:'Baking class',description:'Make something sweet, then share it'},
  {name:'Cooking class',description:'Learn a dish for our next night in'},
  {name:'Flower arranging',description:'Put together a bouquet with a little us in it'},
  {name:'Board games',description:'A little strategy and a lot of laughing'},
  {name:'Escape room',description:'Team up and see if we can crack it'},
  {name:'Karaoke',description:'Questionable vocals, excellent company'},
  {name:'Archery',description:'Try something new and cheer each other on'},
  {name:'Roller skating',description:'Find our feet and take it slow'},
  {name:'Aquarium',description:'Wander around and pick our favourite fish'},
  {name:'Photo booth',description:'Take a few silly pictures to keep'},
];
export const defaultInviteMessage="Let's hang out. You pick what we do and when, I'll sort out the rest :)";
export function invitationMessage(message){
  return ["Let's grab dinner and hang out. You pick when and what we eat, I'll sort out the rest :)",'A little time for just the two of us. Pick a day, a time, and something delicious. I will take care of the rest.'].includes(message)?defaultInviteMessage:message;
}
