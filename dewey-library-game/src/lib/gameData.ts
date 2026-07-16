export type DeweySection = {
  id: number
  range: string
  name: string
  shortName: string
  icon: string
  color: string
  x: number
  y: number
  width: number
  height: number
}

export const sections: DeweySection[] = [
  { id: 0, range: '000-099', name: 'General Knowledge & Computers', shortName: 'General Knowledge', icon: '💻', color: '#6f8de9', x: 4, y: 7, width: 16, height: 12 },
  { id: 1, range: '100-199', name: 'Philosophy & Psychology', shortName: 'Thoughts & Feelings', icon: '💭', color: '#ad75cf', x: 24, y: 7, width: 16, height: 12 },
  { id: 2, range: '200-299', name: 'Religion', shortName: 'Religion', icon: '🕊️', color: '#df799a', x: 60, y: 7, width: 16, height: 12 },
  { id: 3, range: '300-399', name: 'Society & Government', shortName: 'Society', icon: '🏛️', color: '#ec805f', x: 80, y: 7, width: 16, height: 12 },
  { id: 4, range: '400-499', name: 'Language', shortName: 'Language', icon: '💬', color: '#e6a43c', x: 4, y: 27, width: 16, height: 12 },
  { id: 5, range: '500-599', name: 'Science & Math', shortName: 'Science & Math', icon: '🔬', color: '#54a574', x: 80, y: 27, width: 16, height: 12 },
  { id: 6, range: '600-699', name: 'Technology & Health', shortName: 'Tech & Health', icon: '⚙️', color: '#40a89e', x: 4, y: 61, width: 16, height: 12 },
  { id: 7, range: '700-799', name: 'Arts, Sports & Recreation', shortName: 'Arts & Sports', icon: '🎨', color: '#3b9abb', x: 80, y: 61, width: 16, height: 12 },
  { id: 8, range: '800-899', name: 'Literature', shortName: 'Literature', icon: '📖', color: '#587fc2', x: 24, y: 81, width: 16, height: 12 },
  { id: 9, range: '900-999', name: 'History & Geography', shortName: 'History & Geography', icon: '🌎', color: '#7b6cb3', x: 60, y: 81, width: 16, height: 12 },
]

export type Rectangle = { x: number; y: number; width: number; height: number }

export const obstacles: Rectangle[] = [
  ...sections.map(({ x, y, width, height }) => ({ x, y, width, height })),
  { x: 30, y: 27, width: 8, height: 5 }, { x: 62, y: 27, width: 8, height: 5 },
  { x: 27, y: 43, width: 10, height: 5 }, { x: 63, y: 43, width: 10, height: 5 },
  { x: 27, y: 60, width: 10, height: 5 }, { x: 63, y: 60, width: 10, height: 5 },
  { x: 45, y: 43, width: 10, height: 12 }, { x: 46, y: 68, width: 8, height: 7 },
]

export const questNumbers = [
  24, 58, 86, 112, 147, 185, 214, 255, 292, 315, 347, 383, 412, 456, 491,
  507, 548, 582, 613, 657, 694, 718, 756, 793, 814, 852, 887, 906, 947, 985,
]
