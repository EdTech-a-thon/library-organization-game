export type DeweySection = {
  id: number
  range: string
  name: string
  shortName: string
  icon: string
  trinket: string
  trinketLabel: string
  color: string
  x: number
  y: number
  width: number
  height: number
}

export const sections: DeweySection[] = [
  { id: 0, range: '000-099', name: 'General Knowledge & Computers', shortName: 'General Knowledge', icon: '💻', trinket: '💾', trinketLabel: 'a computer disk', color: '#6f8de9', x: 4, y: 7, width: 16, height: 12 },
  { id: 1, range: '100-199', name: 'Philosophy & Psychology', shortName: 'Thoughts & Feelings', icon: '💭', trinket: '🧠', trinketLabel: 'a brain model', color: '#ad75cf', x: 32, y: 7, width: 16, height: 12 },
  { id: 2, range: '200-299', name: 'Religion', shortName: 'Religion', icon: '🕊️', trinket: '🕯️', trinketLabel: 'a candle', color: '#df799a', x: 52, y: 7, width: 16, height: 12 },
  { id: 3, range: '300-399', name: 'Society & Government', shortName: 'Society', icon: '🏛️', trinket: '⚖️', trinketLabel: 'scales of justice', color: '#ec805f', x: 80, y: 7, width: 16, height: 12 },
  { id: 4, range: '400-499', name: 'Language', shortName: 'Language', icon: '💬', trinket: '🔤', trinketLabel: 'letter blocks', color: '#e6a43c', x: 4, y: 34, width: 16, height: 12 },
  { id: 5, range: '500-599', name: 'Science & Math', shortName: 'Science & Math', icon: '🔬', trinket: '🧪', trinketLabel: 'a science beaker', color: '#54a574', x: 80, y: 34, width: 16, height: 12 },
  { id: 6, range: '600-699', name: 'Technology & Health', shortName: 'Tech & Health', icon: '⚙️', trinket: '🩺', trinketLabel: 'a stethoscope', color: '#40a89e', x: 4, y: 61, width: 16, height: 12 },
  { id: 7, range: '700-799', name: 'Arts, Sports & Recreation', shortName: 'Arts & Sports', icon: '🎨', trinket: '⚾', trinketLabel: 'a baseball', color: '#3b9abb', x: 80, y: 61, width: 16, height: 12 },
  { id: 8, range: '800-899', name: 'Literature', shortName: 'Literature', icon: '📖', trinket: '🪶', trinketLabel: 'a feather quill', color: '#587fc2', x: 24, y: 81, width: 16, height: 12 },
  { id: 9, range: '900-999', name: 'History & Geography', shortName: 'History & Geography', icon: '🌎', trinket: '🧭', trinketLabel: 'a compass', color: '#7b6cb3', x: 60, y: 81, width: 16, height: 12 },
]

export type Rectangle = { x: number; y: number; width: number; height: number }

export const obstacles: Rectangle[] = [
  ...sections.map(({ x, y, width, height }) => ({ x, y, width, height })),
  { x: 30, y: 27, width: 10, height: 5 }, { x: 60, y: 27, width: 10, height: 5 },
  { x: 30, y: 43, width: 10, height: 5 }, { x: 60, y: 43, width: 10, height: 5 },
  { x: 30, y: 60, width: 10, height: 5 }, { x: 60, y: 60, width: 10, height: 5 },
  { x: 45, y: 43, width: 10, height: 12 },
]

export type BookQuest = {
  title: string
  sectionId: number
  callNumber: number
}

export const bookQuests: BookQuest[] = [
  { title: 'My First Coding Game', sectionId: 0, callNumber: 0 }, { title: 'A List of Books About Dogs', sectionId: 0, callNumber: 10 },
  { title: 'How Libraries Help Us', sectionId: 0, callNumber: 20 }, { title: 'Amazing Facts for Curious Kids', sectionId: 0, callNumber: 30 },
  { title: 'Junior Science Magazine', sectionId: 0, callNumber: 50 }, { title: 'The Museum Adventure Guide', sectionId: 0, callNumber: 60 },
  { title: 'Kids Report the News', sectionId: 0, callNumber: 70 }, { title: 'Funny Sayings to Share', sectionId: 0, callNumber: 80 },
  { title: 'Treasures From Long Ago', sectionId: 0, callNumber: 90 },
  { title: 'Big Questions for Curious Kids', sectionId: 1, callNumber: 100 }, { title: 'What Is the World Made Of?', sectionId: 1, callNumber: 110 },
  { title: 'How Do We Know Things?', sectionId: 1, callNumber: 120 }, { title: 'Mysteries and Mind Tricks', sectionId: 1, callNumber: 130 },
  { title: 'Ideas From Great Thinkers', sectionId: 1, callNumber: 140 }, { title: 'Feelings Are Superpowers', sectionId: 1, callNumber: 150 },
  { title: 'Logic Puzzles for Kids', sectionId: 1, callNumber: 160 }, { title: 'Kind Choices Every Day', sectionId: 1, callNumber: 170 },
  { title: 'Wise Ideas From Long Ago', sectionId: 1, callNumber: 180 }, { title: 'Modern Ideas That Changed the World', sectionId: 1, callNumber: 190 },
  { title: 'Learning About Religions', sectionId: 2, callNumber: 200 }, { title: 'Big Questions About Beliefs', sectionId: 2, callNumber: 210 },
  { title: 'Bible Stories for Young Readers', sectionId: 2, callNumber: 220 }, { title: 'Learning About Christianity', sectionId: 2, callNumber: 230 },
  { title: 'Ways People Practice Faith', sectionId: 2, callNumber: 240 }, { title: 'Helping Others in Faith Communities', sectionId: 2, callNumber: 250 },
  { title: 'Churches and Community Helpers', sectionId: 2, callNumber: 260 }, { title: 'A History of Christianity', sectionId: 2, callNumber: 270 },
  { title: 'Christian Traditions Around the World', sectionId: 2, callNumber: 280 }, { title: 'Celebrations Around the World', sectionId: 2, callNumber: 290 },
  { title: 'How People Live Together', sectionId: 3, callNumber: 300 }, { title: 'Graphs and Numbers for Kids', sectionId: 3, callNumber: 310 },
  { title: 'How Our Government Works', sectionId: 3, callNumber: 320 }, { title: 'Money and Saving Made Simple', sectionId: 3, callNumber: 330 },
  { title: 'Rules That Keep Us Safe', sectionId: 3, callNumber: 340 }, { title: 'Community Leaders at Work', sectionId: 3, callNumber: 350 },
  { title: 'Kids Can Help Their Community', sectionId: 3, callNumber: 360 }, { title: 'School Days Around the World', sectionId: 3, callNumber: 370 },
  { title: 'Trains, Planes, and Mail Trucks', sectionId: 3, callNumber: 380 }, { title: 'Celebrations and Family Traditions', sectionId: 3, callNumber: 390 },
  { title: 'The Magic of Words', sectionId: 4, callNumber: 400 }, { title: 'How Languages Work', sectionId: 4, callNumber: 410 },
  { title: 'English Words Through Time', sectionId: 4, callNumber: 420 }, { title: 'My First German Words', sectionId: 4, callNumber: 430 },
  { title: 'Bonjour, Friends!', sectionId: 4, callNumber: 440 }, { title: 'Ciao! Italian for Kids', sectionId: 4, callNumber: 450 },
  { title: 'Hola! Spanish and Portuguese', sectionId: 4, callNumber: 460 }, { title: 'Latin Words We Still Use', sectionId: 4, callNumber: 470 },
  { title: 'Greek Myths and Greek Words', sectionId: 4, callNumber: 480 }, { title: 'Say Hello in Many Languages', sectionId: 4, callNumber: 490 },
  { title: 'Science Experiments for Curious Kids', sectionId: 5, callNumber: 500 }, { title: 'Math Puzzles and Number Games', sectionId: 5, callNumber: 510 },
  { title: 'Space Explorer Handbook', sectionId: 5, callNumber: 520 }, { title: 'Forces That Make Things Move', sectionId: 5, callNumber: 530 },
  { title: 'Kitchen Chemistry for Kids', sectionId: 5, callNumber: 540 }, { title: 'Weather Watchers', sectionId: 5, callNumber: 550 },
  { title: 'Dinosaur Bones and Fossils', sectionId: 5, callNumber: 560 }, { title: 'The Amazing World of Living Things', sectionId: 5, callNumber: 570 },
  { title: 'Seeds, Flowers, and Trees', sectionId: 5, callNumber: 580 }, { title: 'Awesome Animal Babies', sectionId: 5, callNumber: 590 },
  { title: 'Cool Tools and Technology', sectionId: 6, callNumber: 600 }, { title: 'My Healthy Body', sectionId: 6, callNumber: 610 },
  { title: 'Bridges and Big Machines', sectionId: 6, callNumber: 620 }, { title: 'Growing a School Garden', sectionId: 6, callNumber: 630 },
  { title: 'Cooking and Chores Together', sectionId: 6, callNumber: 640 }, { title: 'Leading a Great Team', sectionId: 6, callNumber: 650 },
  { title: 'Chemistry That Makes Things', sectionId: 6, callNumber: 660 }, { title: 'How Toys Are Made', sectionId: 6, callNumber: 670 },
  { title: 'Making Helpful Things', sectionId: 6, callNumber: 680 }, { title: 'Build a Birdhouse', sectionId: 6, callNumber: 690 },
  { title: 'My Big Book of Art Ideas', sectionId: 7, callNumber: 700 }, { title: 'Design a Backyard Garden', sectionId: 7, callNumber: 710 },
  { title: 'Amazing Buildings Around the World', sectionId: 7, callNumber: 720 }, { title: 'Clay Creatures and Metal Art', sectionId: 7, callNumber: 730 },
  { title: 'Draw a Comic Book', sectionId: 7, callNumber: 740 }, { title: 'Paint Like a Color Wizard', sectionId: 7, callNumber: 750 },
  { title: 'Prints, Posters, and Picture Books', sectionId: 7, callNumber: 760 }, { title: 'Photo and Computer Art for Kids', sectionId: 7, callNumber: 770 },
  { title: 'Make Music With Friends', sectionId: 7, callNumber: 780 }, { title: 'Soccer Skills for Kids', sectionId: 7, callNumber: 790 },
  { title: 'Stories, Poems, and Great Writing', sectionId: 8, callNumber: 800 }, { title: 'American Stories for Kids', sectionId: 8, callNumber: 810 },
  { title: 'Tales From England', sectionId: 8, callNumber: 820 }, { title: 'German Stories for Young Readers', sectionId: 8, callNumber: 830 },
  { title: 'French Tales to Enjoy', sectionId: 8, callNumber: 840 }, { title: 'Italian and Romanian Stories', sectionId: 8, callNumber: 850 },
  { title: 'Spanish and Portuguese Tales', sectionId: 8, callNumber: 860 }, { title: 'Stories From Ancient Rome', sectionId: 8, callNumber: 870 },
  { title: 'Greek Myths Retold', sectionId: 8, callNumber: 880 }, { title: 'Fairy Tales to Read Aloud', sectionId: 8, callNumber: 890 },
  { title: "A Kid's Guide to History", sectionId: 9, callNumber: 900 }, { title: 'Maps and Places Around the World', sectionId: 9, callNumber: 910 },
  { title: 'Brave People Who Changed Things', sectionId: 9, callNumber: 920 }, { title: 'Amazing Ancient Egypt', sectionId: 9, callNumber: 930 },
  { title: 'Castles and Kings of Europe', sectionId: 9, callNumber: 940 }, { title: 'Stories From Across Asia', sectionId: 9, callNumber: 950 },
  { title: 'Amazing Places in Africa', sectionId: 9, callNumber: 960 }, { title: 'North American History for Kids', sectionId: 9, callNumber: 970 },
  { title: 'Rainforests and History of South America', sectionId: 9, callNumber: 980 }, { title: 'Island Adventures Around the World', sectionId: 9, callNumber: 990 },
]

export function shelfRange(callNumber: number) {
  const start = Math.floor(callNumber / 10) * 10
  return `${String(start).padStart(3, '0')}-${String(start + 9).padStart(3, '0')}`
}

export function shelfRanges(sectionId: number) {
  return Array.from({ length: 10 }, (_, index) => shelfRange(sectionId * 100 + index * 10))
}

const shelfTopics: Record<number, string[]> = {
  0: [
    'Computers & knowledge', 'Book lists', 'Libraries & information', 'Facts & encyclopedias', 'Unassigned',
    'Magazines & journals', 'Museums & organizations', 'News & publishing', 'Quotations', 'Rare books',
  ],
  1: [
    'Philosophy', 'Metaphysics', 'How we know things', 'Mysteries & the unusual', 'Schools of thought',
    'Psychology', 'Logic', 'Ethics', 'Ancient & eastern philosophy', 'Modern western philosophy',
  ],
  2: [
    'Religion', 'Ideas about religion', 'The Bible', 'Christianity', 'Christian practice',
    'Christian care & service', 'Christian community & worship', 'History of Christianity', 'Christian traditions', 'Other religions',
  ],
  3: [
    'Social sciences', 'Statistics', 'Government', 'Money & economics', 'Law',
    'Public service & military', 'Community help & services', 'Education', 'Business & transportation', 'Customs & traditions',
  ],
  4: [
    'Language', 'How language works', 'English', 'German', 'French',
    'Italian & Romanian', 'Spanish & Portuguese', 'Latin', 'Greek', 'Other languages',
  ],
  5: [
    'Science', 'Math', 'Space & astronomy', 'Physics', 'Chemistry',
    'Earth & geology', 'Fossils & prehistoric life', 'Life science & biology', 'Plants', 'Animals',
  ],
  6: [
    'Technology', 'Medicine & health', 'Engineering', 'Agriculture', 'Home & family',
    'Management & public relations', 'Chemical engineering', 'Manufacturing', 'Making useful things', 'Building & construction',
  ],
  7: [
    'Arts', 'Landscaping & planning', 'Architecture', 'Sculpture & ceramics', 'Drawing & decorative arts',
    'Painting', 'Graphic arts', 'Photography & computer art', 'Music', 'Sports, games & entertainment',
  ],
  8: [
    'Literature & writing', 'American literature', 'English literature', 'German literature', 'French literature',
    'Italian & Romanian literature', 'Spanish & Portuguese literature', 'Latin literature', 'Greek literature', 'Other literatures',
  ],
  9: [
    'History', 'Geography & travel', 'Biography & family history', 'Ancient world history', 'European history',
    'Asian history', 'African history', 'North American history', 'South American history', 'History of other places',
  ],
}

export function shelfTopic(callNumber: number) {
  return shelfTopics[Math.floor(callNumber / 100)]?.[Math.floor((callNumber % 100) / 10)] ?? ''
}
