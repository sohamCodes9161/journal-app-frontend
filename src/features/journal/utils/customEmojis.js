// src/components/editor/utils/customEmojis.js

export const EMOJI_CATEGORIES = [
  { id: "faces", label: "Expressions" },
  { id: "cute", label: "Cute Creatures" },
  { id: "vibes", label: "Vibes & Magic" },
  { id: "food", label: "Food & Sweets" },
];

const CDN_BASE = "https://fonts.gstatic.com/s/e/notoemoji/latest";

// Curated 60+ fully verified Google 3D Animated WebP assets
export const CUSTOM_EMOJIS = [
  // --- EXPRESSIONS ---
  {
    name: "Melting Face",
    category: "faces",
    url: `${CDN_BASE}/1fae0/512.webp`,
  },
  {
    name: "Pleading Face",
    category: "faces",
    url: `${CDN_BASE}/1f97a/512.webp`,
  },
  { name: "Star Struck", category: "faces", url: `${CDN_BASE}/1f929/512.webp` },
  {
    name: "Partying Face",
    category: "faces",
    url: `${CDN_BASE}/1f973/512.webp`,
  },
  {
    name: "Exploding Head",
    category: "faces",
    url: `${CDN_BASE}/1f92f/512.webp`,
  },
  { name: "Heart Eyes", category: "faces", url: `${CDN_BASE}/1f60d/512.webp` },
  { name: "Zany Face", category: "faces", url: `${CDN_BASE}/1f92a/512.webp` },
  { name: "Nerd Face", category: "faces", url: `${CDN_BASE}/1f913/512.webp` },
  {
    name: "Thinking Face",
    category: "faces",
    url: `${CDN_BASE}/1f914/512.webp`,
  },
  { name: "Smirk Face", category: "faces", url: `${CDN_BASE}/1f60f/512.webp` },
  {
    name: "Drooling Face",
    category: "faces",
    url: `${CDN_BASE}/1f924/512.webp`,
  },
  { name: "Alien", category: "faces", url: `${CDN_BASE}/1f47d/512.webp` },
  { name: "Robot", category: "faces", url: `${CDN_BASE}/1f916/512.webp` },
  {
    name: "Shushing Face",
    category: "faces",
    url: `${CDN_BASE}/1f92b/512.webp`,
  },
  {
    name: "Face Vomiting",
    category: "faces",
    url: `${CDN_BASE}/1f92e/512.webp`,
  },

  // --- CUTE CREATURES ---
  { name: "Unicorn", category: "cute", url: `${CDN_BASE}/1f984/512.webp` },
  { name: "Ghost", category: "cute", url: `${CDN_BASE}/1f47b/512.webp` },
  { name: "Dinosaur", category: "cute", url: `${CDN_BASE}/1f996/512.webp` },
  { name: "Koala", category: "cute", url: `${CDN_BASE}/1f428/512.webp` },
  { name: "Sloth", category: "cute", url: `${CDN_BASE}/1f9a5/512.webp` },
  { name: "Teddy Bear", category: "cute", url: `${CDN_BASE}/1f9f8/512.webp` },
  { name: "Turtle", category: "cute", url: `${CDN_BASE}/1f422/512.webp` },
  { name: "Cat Face", category: "cute", url: `${CDN_BASE}/1f431/512.webp` },
  { name: "Frog Face", category: "cute", url: `${CDN_BASE}/1f438/512.webp` },
  { name: "Octopus", category: "cute", url: `${CDN_BASE}/1f419/512.webp` },
  { name: "Bunny Face", category: "cute", url: `${CDN_BASE}/1f430/512.webp` },
  { name: "Hedgehog", category: "cute", url: `${CDN_BASE}/1f994/512.webp` },
  { name: "See No Evil", category: "cute", url: `${CDN_BASE}/1f648/512.webp` },
  { name: "Baby Chick", category: "cute", url: `${CDN_BASE}/1f425/512.webp` },
  { name: "Fox Face", category: "cute", url: `${CDN_BASE}/1f43a/512.webp` },

  // --- VIBES & MAGIC ---
  { name: "Sparkles", category: "vibes", url: `${CDN_BASE}/2728/512.webp` },
  { name: "Fire", category: "vibes", url: `${CDN_BASE}/1f525/512.webp` },
  {
    name: "Crystal Ball",
    category: "vibes",
    url: `${CDN_BASE}/1f52e/512.webp`,
  },
  { name: "Magic Wand", category: "vibes", url: `${CDN_BASE}/1fa84/512.webp` },
  { name: "Rocket", category: "vibes", url: `${CDN_BASE}/1f680/512.webp` },
  { name: "Rainbow", category: "vibes", url: `${CDN_BASE}/1f308/512.webp` },
  {
    name: "Cloud with Rain",
    category: "vibes",
    url: `${CDN_BASE}/1f327/512.webp`,
  },
  {
    name: "Shooting Star",
    category: "vibes",
    url: `${CDN_BASE}/1f320/512.webp`,
  },
  {
    name: "Crescent Moon",
    category: "vibes",
    url: `${CDN_BASE}/1f319/512.webp`,
  },
  { name: "Controller", category: "vibes", url: `${CDN_BASE}/1f3ae/512.webp` },
  { name: "Disco Ball", category: "vibes", url: `${CDN_BASE}/1faa9/512.webp` },
  {
    name: "Heart Sparkle",
    category: "vibes",
    url: `${CDN_BASE}/1f496/512.webp`,
  },
  { name: "Nail Polish", category: "vibes", url: `${CDN_BASE}/1f485/512.webp` },
  {
    name: "Sparkling Star",
    category: "vibes",
    url: `${CDN_BASE}/1f31f/512.webp`,
  },
  { name: "Art Palette", category: "vibes", url: `${CDN_BASE}/1f3a8/512.webp` },

  // --- FOOD & SWEETS ---
  { name: "Bubble Tea", category: "food", url: `${CDN_BASE}/1f9cb/512.webp` },
  { name: "Avocado", category: "food", url: `${CDN_BASE}/1f951/512.webp` },
  { name: "Croissant", category: "food", url: `${CDN_BASE}/1f950/512.webp` },
  { name: "Taco", category: "food", url: `${CDN_BASE}/1f32e/512.webp` },
  { name: "Cupcake", category: "food", url: `${CDN_BASE}/1f9c1/512.webp` },
  { name: "Lollipop", category: "food", url: `${CDN_BASE}/1f36d/512.webp` },
  { name: "Watermelon", category: "food", url: `${CDN_BASE}/1f349/512.webp` },
  { name: "Ice Cream", category: "food", url: `${CDN_BASE}/1f366/512.webp` },
  { name: "Doughnut", category: "food", url: `${CDN_BASE}/1f369/512.webp` },
  { name: "Cookie", category: "food", url: `${CDN_BASE}/1f36a/512.webp` },
  { name: "French Fries", category: "food", url: `${CDN_BASE}/1f35f/512.webp` },
  { name: "Strawberry", category: "food", url: `${CDN_BASE}/1f353/512.webp` },
  {
    name: "Birthday Cake",
    category: "food",
    url: `${CDN_BASE}/1f382/512.webp`,
  },
  { name: "Peach", category: "food", url: `${CDN_BASE}/1f351/512.webp` },
  { name: "Cherries", category: "food", url: `${CDN_BASE}/1f352/512.webp` },
];
