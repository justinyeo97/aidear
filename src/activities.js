// Shared by date cards and the server so every activity has a matching venue search.
export const activityLabels = {
  coffee:'Cafes', park:'Parks & picnics', art:'Museums & galleries', books:'Bookstores',
  archery:'Archery', minigolf:'Mini golf', bowling:'Bowling', badminton:'Badminton',
  skating:'Roller skating', arcade:'Arcades', boardgames:'Board games', dessert:'Dessert',
  pottery:'Pottery', dinner:'Dinner', movies:'Movies', cooking:'Cooking classes', escape:'Escape rooms',
};

export const activities = [
  {
    id:'dinner',title:'A table for two, a new favourite',category:'Dinner',vibe:'Foodie',
    image:'photo-1517248135467-4c7edcad34c4',imageAlt:'A warmly lit restaurant',color:'peach',time:'1-2 hours',cost:100,
    query:'restaurants for a dinner date',
    intro:'Try a restaurant neither of you has visited and make choosing the meal part of the fun.',
    steps:['Check the menu, dietary options and total budget before booking.','Each choose a dish you think the other would enjoy.','Take a short walk afterward and choose a favourite moment from the evening.'],
    backup:'Cook a simple dinner together at home and set the table like a little restaurant.'
  },
  {
    id:'movies',title:'Make an evening of the movies',category:'Movies',vibe:'Cozy',
    image:'photo-1489599849927-2ee91cede3ba',imageAlt:'A cinema auditorium',color:'lilac',time:'2-3 hours',cost:60,
    query:'cinema movie theatre',
    intro:'Pick a film together, share a snack, and leave some time to talk about it afterward.',
    steps:['Choose a film you both want to see and check showtimes.','Agree on tickets and snacks within your shared budget.','After the film, compare your favourite scenes over a short walk.'],
    backup:'Choose a film at home, make popcorn, and create your own cinema night.'
  },
  {
    id:'cooking',title:'A recipe for a lovely afternoon',category:'Cooking classes',vibe:'Creative',
    image:'photo-1556911220-bff31c812dba',imageAlt:'A kitchen ready for cooking',color:'sage',time:'2-3 hours',cost:200,
    query:'couples beginner cooking baking class',
    intro:'Learn a new dish together and leave with a recipe for your next night in.',
    steps:['Find a beginner class and confirm the price for two and dietary requirements.','Share the preparation and let each person try a new technique.','Enjoy what you made and pick a date to recreate it at home.'],
    backup:'Choose a simple recipe and cook together with ingredients you already have.'
  },
  {
    id:'escape',title:'Two heads, one great escape',category:'Escape rooms',vibe:'Playful',
    image:'photo-1511512578047-dfb367046420',imageAlt:'A playful indoor gaming setting',color:'lilac',time:'1-2 hours',cost:120,
    query:'escape room two players beginner',
    intro:'Solve clues as a team and discover how well your different ideas fit together.',
    steps:['Choose a room that explicitly supports two players and check its difficulty.','Tell each other what you find and ask for hints whenever you need them.','Celebrate the teamwork afterward, whether or not you beat the clock.'],
    backup:'Try a free online puzzle or a mystery board game together at home.'
  },
  {
    id:'archery', title:'Aim for a little chemistry', category:'Try something together', vibe:'Active',
    image:'photo-1517649763962-0c623066013b', imageAlt:'Equipment and space for an active outing', color:'sage', time:'1-2 hours', cost:80,
    query:'beginner indoor archery range',
    intro:'Try a beginner archery session, cheer on the small wins, and see who finds their aim first.',
    steps:['Find a range offering beginner sessions and check whether booking is needed.','Ask for a safety briefing and start with a short practice round.','Set a friendly challenge, then grab a drink and compare your best shots.'],
    backup:'Swap the range for a board-game cafe if beginner sessions are fully booked.'
  },
  {
    id:'minigolf', title:'A little friendly competition', category:'Keep it playful', vibe:'Playful',
    image:'photo-1535131749006-b7f58c99034b', imageAlt:'A green golf course', color:'peach', time:'1-2 hours', cost:80,
    query:'mini golf miniature golf course',
    intro:'A round of mini golf, a few questionable putting techniques, and plenty of reasons to laugh.',
    steps:['Pick a mini golf course and check the price for two.','Take turns inventing a silly celebration for each successful putt.','Finish with a snack and let the runner-up choose the next date.'],
    backup:'Choose an indoor course or swap to bowling when the weather turns.'
  },
  {
    id:'bowling', title:'Right up your alley', category:'Keep it playful', vibe:'Playful',
    image:'photo-1519861531473-9200262188bf', imageAlt:'An indoor recreational sports space', color:'peach', time:'1-2 hours', cost:60,
    query:'bowling alley',
    intro:'Share a lane, celebrate every strike, and make the gutter balls part of the story.',
    steps:['Check lane availability, shoe rental, and the cost of a game for two.','Play one warm-up game with no score pressure.','Try a second round where you work together to beat your combined score.'],
    backup:'If lanes are full, head to an arcade or a nearby board-game cafe.'
  },
  {
    id:'badminton', title:'A match made for two', category:'Move a little closer', vibe:'Active',
    image:'photo-1622279457486-62dcc4a431d6', imageAlt:'A court ready for a racket-sport outing', color:'sage', time:'1-2 hours', cost:40,
    query:'badminton court rental',
    intro:'Book a court, keep the rally going, and make moving together the point of the date.',
    steps:['Book a court and check whether rackets and shuttlecocks are available to rent.','Warm up, then see how long you can keep a rally going together.','Cool down over a refreshing drink and pick a new shared rally goal.'],
    backup:'Try a simple indoor stretching session followed by a homemade smoothie.'
  },
  {
    id:'skating', title:'Find your feet together', category:'Move a little closer', vibe:'Active',
    image:'photo-1517649763962-0c623066013b', imageAlt:'A space for an active afternoon', color:'sage', time:'1-2 hours', cost:100,
    query:'roller skating rink skate rental',
    intro:'A beginner-friendly skate session with plenty of pauses, encouragement, and little victories.',
    steps:['Find a rink with skate rental and check beginner-session times.','Choose protective gear and take a slow practice lap at your own pace.','Take breaks, celebrate the progress, and finish with a snack.'],
    backup:'Take a relaxed walk somewhere covered if a skating session is unavailable.'
  },
  {
    id:'arcade', title:'Player two looks good on you', category:'Keep it playful', vibe:'Playful',
    image:'photo-1511512578047-dfb367046420', imageAlt:'Colourful gaming equipment', color:'lilac', time:'1-2 hours', cost:50,
    query:'amusement arcade games',
    intro:'Team up for a racing game, challenge each other at air hockey, and leave room for a silly photo.',
    steps:['Agree on a token budget before you start.','Each choose one favourite game, then find a game you can play as a team.','Take a photo together and compare your funniest moments over a drink.'],
    backup:'Set up a two-player game night at home with games you already own.'
  },
  {
    id:'boardgames', title:'Make your next move together', category:'A little strategy, a lot of laughs', vibe:'Game night',
    image:'photo-1610890716171-6b1bb98ffd09', imageAlt:'Board games set out on a table', color:'lilac', time:'2-3 hours', cost:50,
    query:'board game cafe',
    intro:'Find a board-game cafe and trade scrolling for a little friendly tabletop competition.',
    steps:['Check the cafe cover charge and whether drinks are included.','Ask for a quick two-player game recommendation to get started.','Try a cooperative game next and see what kind of team you make.'],
    backup:'Play cards at home and let each person invent one new house rule.'
  },
  {
    id:'dessert', title:'Something sweet, someone sweeter', category:'Follow your sweet tooth', vibe:'Foodie',
    image:'photo-1488477181946-6428a0291777', imageAlt:'Dessert topped with fresh fruit', color:'peach', time:'1-2 hours', cost:40,
    query:'dessert cafe ice cream',
    intro:'Pick a dessert spot, order two things to share, and discover each other\'s new favourite.',
    steps:['Choose a dessert shop and check the menu for dietary needs.','Each pick one treat within your shared budget.','Rate your favourites and take a short walk afterward.'],
    backup:'Make ice cream sundaes at home using a topping chosen by each of you.'
  },
  {
    id:'pottery', title:'Make something a little wonky', category:'Create a keepsake', vibe:'Creative',
    image:'photo-1460661419201-fd4cecdf8a8b', imageAlt:'Materials for a creative workshop', color:'lilac', time:'2-3 hours', cost:180,
    query:'beginner pottery workshop ceramic painting',
    intro:'Try pottery or ceramic painting and make a small keepsake with a story behind it.',
    steps:['Compare beginner workshops and confirm the total price for two.','Choose a simple piece and let the instructor guide you.','Leave a tiny detail inspired by each other, and check when your pieces can be collected.'],
    backup:'Try sketching or paper crafts together with supplies you already have.'
  }
];
