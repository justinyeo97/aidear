export const CUSTOM_ACTIVITY='My own idea';
export const rideOptions=[
  {value:'pickup',label:'Lai',description:'Passenger princess mode: on.'},
  {value:'own',label:"Wo Zhi Ji Vroom Vroom",description:'Meet you there, looking cute.'},
];
export const rideLabel=value=>rideOptions.find(option=>option.value===value)?.label || (value==='decide'?"Let's figure it out":'Not specified');
export const dateActivities = [
  {name:CUSTOM_ACTIVITY,description:'Got something else in mind? Tell me'},
  {name:'Dinner',description:'Nom Nom'},
  {name:'Coffee',description:'Slrrp Slrrp'},
  {name:'Ring making',description:'Make a little keepsake for each other'},
  {name:'Jewellery making',description:'Bling bling mouu'},
  {name:'Candle making',description:'Pick a scent and make something cosy'},
  {name:'Perfume workshop',description:'Xiang Xiang'},
  {name:'Movies',description:'wo he ni kan xi'},
  {name:'Mini golf',description:'ni ken ding shu hehe'},
  {name:'Bowling',description:'A few strikes, a few laughs'},
  {name:'Picnic',description:'lang man'},
  {name:'Arcade',description:'zhe ge ni ye shi hui shu'},
  {name:'Pottery',description:'kan shui de shou bi jiao geng'},
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
