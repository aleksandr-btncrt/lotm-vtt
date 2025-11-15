import { lordOfMysteries } from './lotm.mjs';

const GodAlmighty = [
  { name: "Visionary", key: "visionary" },
  { name: "Sun", key: "sun" },
  { name: "Tyrant", key: "tyrant" },
  { name: "White Tower", key: "white-tower" },
  { name: "Hanged Man", key: "hanged-man" }
]

const EternalDarkness = [
  { name: "Darkness", key: "darkness" },
  { name: "Death", key: "death" },
  { name: "Twilight Giant", key: "twilight-giant" }
]

const CalamityOfDestruction = [
  { name: "Demoness", key: "demoness" },
  { name: "Red Priest", key: "red-priest" }
]

const DemonKnowledge = [
  { name: "Hermit", key: "hermit" },
  { name: "Paragon", key: "paragon" }
]

const KeyOfLight = [
  { name: "Wheel of Fortune", key: "wheel-of-fortune" }
]

const GoddesOfOrigin = [
  { name: "Mother", key: "mother" },
  { name: "Moon", key: "moon" }
]

const FatherOfDevils = [
  { name: "Abyss", key: "abyss" },
  { name: "Chained", key: "chained" }
]

const TheAnarchy = [
  { name: "Black Emperor", key: "black-emperor" },
  { name: "Justiciar", key: "justiciar" }
]

export const pathways = [
  ...lordOfMysteries,
  ...CalamityOfDestruction,
  ...DemonKnowledge,
  ...EternalDarkness,
  ...FatherOfDevils,
  ...GodAlmighty,
  ...GoddesOfOrigin,
  ...KeyOfLight,
  ...TheAnarchy,
]

export const sequences = [
  {name: "9", key: 9},
  {name: "8", key: 8},
  {name: "7", key: 7},
  {name: "6", key: 6},
  {name: "5", key: 5},
  {name: "4", key: 4},
  {name: "3", key: 3},
  {name: "2", key: 2},
  {name: "1", key: 1},
  {name: "0", key: 0}
]