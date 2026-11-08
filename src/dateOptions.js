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
  {name:'Ring making',description:'Ahhhhhhhh!!!'},
  {name:'Jewellery making',description:'Bling bling mouu'},
  {name:'Candle making',description:'la zhu xiang ni jiang xiang'},
  {name:'Perfume workshop',description:'Xiang Xiang'},
  {name:'Movies',description:'wo he ni kan xi'},
  {name:'Mini golf',description:'ni ken ding shu hehe'},
  {name:'Bowling',description:'bu yao diu wo de tou'},
  {name:'Picnic',description:'lang man'},
  {name:'Arcade',description:'zhe ge ni ye shi hui shu'},
  {name:'Pottery',description:'kan shui de shou bi jiao geng'},
  {name:'Ceramic painting',description:'tu bei hehe'},
  {name:'Painting workshop',description:'tu hua hua'},
  {name:'Tufting workshop',description:'zhuo ni de mao de carpet'},
  {name:'Baking class',description:'KAboom!'},
  {name:'Cooking class',description:'Zhu Chi!'},
  {name:'Flower arranging',description:'Hua hua'},
  {name:'Board games',description:'tou nao shao shao'},
  {name:'Escape room',description:'tou nao tong tong'},
  {name:'Karaoke',description:'kan wo biao yan'},
  {name:'Archery',description:'dui bu qi wo hui bu xiao xin she dao ni'},
  {name:'Roller skating',description:'pokai'},
  {name:'Ice skaing',description:'pokai x2'},
  {name:'Aquarium',description:'who shi ni de yu ma?'},
  {name:'Photo booth',description:'hai xiuuuuu'},
];
export const defaultInviteMessage="Wo Xiang Ni! You pick what we do and when, I'll sort out the rest :)";
export function invitationMessage(message){
  return ["Let's go on a date! You pick when and what we eat, I'll sort out the rest :)",'A little time for just the two of us. Pick a day, a time, and something delicious. I will take care of the rest.'].includes(message)?defaultInviteMessage:message;
}
