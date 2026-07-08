// animalData.js — Animal definitions for the Whiscy hunt/battle system

export const RARITY = {
  COMMON: 'Common',
  UNCOMMON: 'Uncommon',
  RARE: 'Rare',
  SUPER_RARE: 'Super Rare',
  LEGENDARY: 'Legendary',
  MYTHICAL: 'Mythical',
};

export const RARITY_COLORS = {
  [RARITY.COMMON]: '#95a5a6',
  [RARITY.UNCOMMON]: '#2ecc71',
  [RARITY.RARE]: '#3498db',
  [RARITY.SUPER_RARE]: '#9b59b6',
  [RARITY.LEGENDARY]: '#f1c40f',
  [RARITY.MYTHICAL]: '#e74c3c',
};

export const RARITY_EMOJI = {
  [RARITY.COMMON]: '⚪',
  [RARITY.UNCOMMON]: '🟢',
  [RARITY.RARE]: '🔵',
  [RARITY.SUPER_RARE]: '🟣',
  [RARITY.LEGENDARY]: '🟡',
  [RARITY.MYTHICAL]: '🔴',
};

// Weights for random selection (must sum to 100)
export const RARITY_WEIGHTS = {
  [RARITY.COMMON]: 45,
  [RARITY.UNCOMMON]: 25,
  [RARITY.RARE]: 15,
  [RARITY.SUPER_RARE]: 10,
  [RARITY.LEGENDARY]: 4,
  [RARITY.MYTHICAL]: 1,
};

// Whiscy value ranges per rarity
export const RARITY_WHISCY = {
  [RARITY.COMMON]: { min: 5, max: 15 },
  [RARITY.UNCOMMON]: { min: 15, max: 40 },
  [RARITY.RARE]: { min: 40, max: 100 },
  [RARITY.SUPER_RARE]: { min: 100, max: 300 },
  [RARITY.LEGENDARY]: { min: 300, max: 1000 },
  [RARITY.MYTHICAL]: { min: 1000, max: 5000 },
};

// Battle stats per rarity
export const RARITY_STATS = {
  [RARITY.COMMON]: { atk: 5, hp: 10 },
  [RARITY.UNCOMMON]: { atk: 15, hp: 25 },
  [RARITY.RARE]: { atk: 30, hp: 50 },
  [RARITY.SUPER_RARE]: { atk: 50, hp: 80 },
  [RARITY.LEGENDARY]: { atk: 80, hp: 120 },
  [RARITY.MYTHICAL]: { atk: 120, hp: 200 },
};

export const ANIMALS = [
  // Common
  { id: 'bug', name: 'Bug', emoji: '🐛', rarity: RARITY.COMMON },
  { id: 'ant', name: 'Ant', emoji: '🐜', rarity: RARITY.COMMON },
  { id: 'snail', name: 'Snail', emoji: '🐌', rarity: RARITY.COMMON },
  { id: 'cricket', name: 'Cricket', emoji: '🦗', rarity: RARITY.COMMON },
  { id: 'frog', name: 'Frog', emoji: '🐸', rarity: RARITY.COMMON },
  { id: 'mouse', name: 'Mouse', emoji: '🐭', rarity: RARITY.COMMON },
  { id: 'chick', name: 'Chick', emoji: '🐤', rarity: RARITY.COMMON },
  { id: 'fish', name: 'Fish', emoji: '🐟', rarity: RARITY.COMMON },
  { id: 'turtle', name: 'Turtle', emoji: '🐢', rarity: RARITY.COMMON },
  { id: 'hamster', name: 'Hamster', emoji: '🐹', rarity: RARITY.COMMON },

  // Uncommon
  { id: 'rabbit', name: 'Rabbit', emoji: '🐰', rarity: RARITY.UNCOMMON },
  { id: 'fox', name: 'Fox', emoji: '🦊', rarity: RARITY.UNCOMMON },
  { id: 'cat', name: 'Cat', emoji: '🐱', rarity: RARITY.UNCOMMON },
  { id: 'dog', name: 'Dog', emoji: '🐶', rarity: RARITY.UNCOMMON },
  { id: 'raccoon', name: 'Raccoon', emoji: '🦝', rarity: RARITY.UNCOMMON },
  { id: 'penguin', name: 'Penguin', emoji: '🐧', rarity: RARITY.UNCOMMON },
  { id: 'koala', name: 'Koala', emoji: '🐨', rarity: RARITY.UNCOMMON },
  { id: 'panda', name: 'Panda', emoji: '🐼', rarity: RARITY.UNCOMMON },

  // Rare
  { id: 'eagle', name: 'Eagle', emoji: '🦅', rarity: RARITY.RARE },
  { id: 'wolf', name: 'Wolf', emoji: '🐺', rarity: RARITY.RARE },
  { id: 'deer', name: 'Deer', emoji: '🦌', rarity: RARITY.RARE },
  { id: 'bear', name: 'Bear', emoji: '🐻', rarity: RARITY.RARE },
  { id: 'owl', name: 'Owl', emoji: '🦉', rarity: RARITY.RARE },
  { id: 'dolphin', name: 'Dolphin', emoji: '🐬', rarity: RARITY.RARE },

  // Super Rare
  { id: 'lion', name: 'Lion', emoji: '🦁', rarity: RARITY.SUPER_RARE },
  { id: 'tiger', name: 'Tiger', emoji: '🐯', rarity: RARITY.SUPER_RARE },
  { id: 'dragon', name: 'Dragon', emoji: '🐉', rarity: RARITY.SUPER_RARE },
  { id: 'shark', name: 'Shark', emoji: '🦈', rarity: RARITY.SUPER_RARE },
  { id: 'gorilla', name: 'Gorilla', emoji: '🦍', rarity: RARITY.SUPER_RARE },

  // Legendary
  { id: 'unicorn', name: 'Unicorn', emoji: '🦄', rarity: RARITY.LEGENDARY },
  { id: 'ancient_dragon', name: 'Ancient Dragon', emoji: '🐲', rarity: RARITY.LEGENDARY },
  { id: 'celestial_fox', name: 'Celestial Fox', emoji: '⭐', rarity: RARITY.LEGENDARY },
  { id: 'spirit_wolf', name: 'Spirit Wolf', emoji: '🌟', rarity: RARITY.LEGENDARY },

  // Mythical
  { id: 'divine_beast', name: 'Divine Beast', emoji: '👑', rarity: RARITY.MYTHICAL },
  { id: 'crystal_phoenix', name: 'Crystal Phoenix', emoji: '💎', rarity: RARITY.MYTHICAL },
  { id: 'void_serpent', name: 'Void Serpent', emoji: '🌀', rarity: RARITY.MYTHICAL },
];

// Index animals by id for fast lookup
const ANIMAL_MAP = new Map(ANIMALS.map(a => [a.id, a]));

// Group animals by rarity for hunt selection
const ANIMALS_BY_RARITY = {};
for (const rarity of Object.values(RARITY)) {
  ANIMALS_BY_RARITY[rarity] = ANIMALS.filter(a => a.rarity === rarity);
}

export function getAnimalById(id) {
  return ANIMAL_MAP.get(id) || null;
}

export function getAnimalsByRarity(rarity) {
  return ANIMALS_BY_RARITY[rarity] || [];
}

export function getAnimalStats(animal) {
  const baseStats = RARITY_STATS[animal.rarity];
  return { ...baseStats };
}

export function getAnimalWhiscyValue(animal) {
  const range = RARITY_WHISCY[animal.rarity];
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
}

/**
 * Select a random rarity based on weights.
 * @param {number} [luckBonus=0] Percentage bonus applied to all non-Common rarities.
 */
export function rollRarity(luckBonus = 0) {
  const weights = { ...RARITY_WEIGHTS };

  if (luckBonus > 0) {
    // Shift weight from Common to higher rarities proportionally
    const shift = Math.min(weights[RARITY.COMMON], luckBonus);
    weights[RARITY.COMMON] -= shift;
    weights[RARITY.UNCOMMON] += shift * 0.35;
    weights[RARITY.RARE] += shift * 0.25;
    weights[RARITY.SUPER_RARE] += shift * 0.2;
    weights[RARITY.LEGENDARY] += shift * 0.12;
    weights[RARITY.MYTHICAL] += shift * 0.08;
  }

  const total = Object.values(weights).reduce((s, w) => s + w, 0);
  let roll = Math.random() * total;

  for (const [rarity, weight] of Object.entries(weights)) {
    roll -= weight;
    if (roll <= 0) return rarity;
  }

  return RARITY.COMMON;
}

/**
 * Pick a random animal from the pool.
 * @param {number} [luckBonus=0] Percentage luck bonus.
 */
export function rollAnimal(luckBonus = 0) {
  const rarity = rollRarity(luckBonus);
  const pool = getAnimalsByRarity(rarity);
  return pool[Math.floor(Math.random() * pool.length)];
}

// Monsters for PvE battle
export const MONSTERS = [
  { name: 'Goblin', emoji: '👹', minLevel: 1, maxLevel: 10 },
  { name: 'Skeleton', emoji: '💀', minLevel: 5, maxLevel: 20 },
  { name: 'Slime', emoji: '🟢', minLevel: 1, maxLevel: 8 },
  { name: 'Dark Knight', emoji: '🗡️', minLevel: 10, maxLevel: 30 },
  { name: 'Fire Elemental', emoji: '🔥', minLevel: 15, maxLevel: 40 },
  { name: 'Ice Golem', emoji: '🧊', minLevel: 20, maxLevel: 50 },
  { name: 'Shadow Wraith', emoji: '👻', minLevel: 25, maxLevel: 60 },
  { name: 'Demon Lord', emoji: '😈', minLevel: 30, maxLevel: 70 },
  { name: 'Ancient Titan', emoji: '🗿', minLevel: 40, maxLevel: 80 },
  { name: 'Void Dragon', emoji: '🐲', minLevel: 50, maxLevel: 100 },
];

export function rollMonster() {
  return MONSTERS[Math.floor(Math.random() * MONSTERS.length)];
}

// Shop items
export const SHOP_ITEMS = [
  {
    id: 'hunting_lure',
    name: 'Hunting Lure',
    emoji: '🎣',
    price: 500,
    description: '+20% rare chance for 10 hunts',
    type: 'buff',
    buffType: 'hunt_luck',
    buffValue: 20,
    buffUses: 10,
  },
  {
    id: 'battle_charm',
    name: 'Battle Charm',
    emoji: '⚔️',
    price: 800,
    description: '+10 ATK bonus for 5 battles',
    type: 'buff',
    buffType: 'battle_atk',
    buffValue: 10,
    buffUses: 5,
  },
  {
    id: 'lucky_clover',
    name: 'Lucky Clover',
    emoji: '🍀',
    price: 1000,
    description: '+10% all rarity chance for 20 hunts',
    type: 'buff',
    buffType: 'hunt_luck',
    buffValue: 10,
    buffUses: 20,
  },
  {
    id: 'xp_boost',
    name: 'XP Boost',
    emoji: '💊',
    price: 1500,
    description: '2x XP for 1 hour',
    type: 'buff',
    buffType: 'xp_boost',
    buffValue: 2,
    buffDuration: 60 * 60 * 1000,
  },
  {
    id: 'mystery_box',
    name: 'Mystery Box',
    emoji: '🎁',
    price: 2000,
    description: 'Random animal (guaranteed Rare+)',
    type: 'instant',
    action: 'mystery_box',
  },
  {
    id: 'whiscy_doubler',
    name: 'Whiscy Doubler',
    emoji: '🪙',
    price: 5000,
    description: '2x whiscy earnings for 30 minutes',
    type: 'buff',
    buffType: 'whiscy_boost',
    buffValue: 2,
    buffDuration: 30 * 60 * 1000,
  },
];

export function getShopItem(id) {
  return SHOP_ITEMS.find(item => item.id === id) || null;
}
