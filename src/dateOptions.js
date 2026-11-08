export const dateActivities = [
  {name:'Dinner',description:'Good food and a proper catch-up'},
  {name:'Coffee',description:'Something warm and an easy chat'},
  {name:'Movies',description:'A film, popcorn, and your company'},
  {name:'Mini golf',description:'A little friendly competition'},
  {name:'Bowling',description:'A few strikes, a few laughs'},
  {name:'Picnic',description:'Fresh air and our favourite snacks'},
  {name:'Arcade',description:'You can be my player two'},
  {name:'Pottery',description:'Make something a little wonky'},
];
export const defaultInviteMessage="Let's hang out. You pick what we do and when, I'll sort out the rest :)";
export function invitationMessage(message){
  return ["Let's grab dinner and hang out. You pick when and what we eat, I'll sort out the rest :)",'A little time for just the two of us. Pick a day, a time, and something delicious. I will take care of the rest.'].includes(message)?defaultInviteMessage:message;
}
