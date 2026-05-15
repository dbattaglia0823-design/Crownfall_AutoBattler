const SAVE_KEY = "crownfall_autobattler_save_v5";
const STAGE_COUNT = 30;
const MAP_LAYER_SIZE = 10;
const FINAL_BOSS_STAGE = STAGE_COUNT + 1;
const BASE_BATTLE_SPEED = 1;
const SANCTUARY_HP_GAIN = 75;

const BATTLEFIELD_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 430" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#40264f"/><stop offset=".45" stop-color="#a9553f"/><stop offset="1" stop-color="#3c2a25"/></linearGradient><linearGradient id="ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8b6438"/><stop offset="1" stop-color="#3e2a1b"/></linearGradient><radialGradient id="glow" cx="50%" cy="42%" r="42%"><stop offset="0" stop-color="#ffe28a" stop-opacity=".95"/><stop offset=".25" stop-color="#f59e45" stop-opacity=".45"/><stop offset="1" stop-color="#1b1120" stop-opacity="0"/></radialGradient></defs><rect width="900" height="430" fill="url(#sky)"/><rect width="900" height="430" fill="url(#glow)"/><circle cx="450" cy="180" r="34" fill="#ffd874"/><path d="M0 188 L64 132 L118 187 L164 112 L229 190 L292 120 L349 188 L406 96 L480 190 L548 118 L618 190 L684 99 L758 190 L825 126 L900 187 L900 250 L0 250 Z" fill="#33294b"/><path d="M0 238 L80 199 L170 235 L258 196 L350 238 L450 203 L536 238 L637 194 L722 238 L812 201 L900 238 L900 288 L0 288 Z" fill="#4f3a37"/><path d="M318 201 V150 H332 V126 H346 V154 H358 V110 H374 V154 H388 V132 H402 V201 Z" fill="#2a2434"/><rect x="309" y="194" width="104" height="20" fill="#33283a"/><path d="M620 205 V150 H636 V118 H652 V158 H668 V136 H684 V205 Z" fill="#302337"/><rect x="606" y="198" width="96" height="20" fill="#3a2a34"/><path d="M92 215 V92 H132 V204 H152 V222 H68 V204 H92 Z" fill="#322d31"/><path d="M768 215 V96 H810 V204 H832 V222 H746 V204 H768 Z" fill="#322d31"/><rect x="99" y="118" width="24" height="72" fill="#273558"/><rect x="779" y="120" width="25" height="74" fill="#6d2020"/><rect y="250" width="900" height="180" fill="url(#ground)"/><path d="M110 310 C208 286 348 282 452 288 C572 295 690 288 804 310 C704 331 584 342 455 338 C318 334 202 330 110 310 Z" fill="#9a7142" opacity=".72"/><rect x="83" y="292" width="34" height="12" fill="#b09369"/><rect x="242" y="301" width="44" height="11" fill="#a4885e"/><rect x="510" y="302" width="42" height="10" fill="#b08c5c"/><rect x="734" y="294" width="38" height="11" fill="#a68961"/><rect x="18" y="392" width="132" height="38" fill="#201711"/><rect x="732" y="392" width="150" height="38" fill="#201711"/></svg>`;

function createBiomeBattlefieldSvg(theme) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 430" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${theme.skyTop}"/><stop offset=".52" stop-color="${theme.skyMid}"/><stop offset="1" stop-color="${theme.skyBottom}"/></linearGradient><linearGradient id="ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${theme.groundTop}"/><stop offset="1" stop-color="${theme.groundBottom}"/></linearGradient><radialGradient id="glow" cx="50%" cy="38%" r="42%"><stop offset="0" stop-color="${theme.sun}" stop-opacity=".75"/><stop offset=".28" stop-color="${theme.sun}" stop-opacity=".22"/><stop offset="1" stop-color="${theme.skyBottom}" stop-opacity="0"/></radialGradient></defs><rect width="900" height="430" fill="url(#sky)"/><rect width="900" height="430" fill="url(#glow)"/><circle cx="450" cy="162" r="32" fill="${theme.sun}" opacity=".82"/><path d="M0 190 L64 132 L118 187 L164 112 L229 190 L292 120 L349 188 L406 96 L480 190 L548 118 L618 190 L684 99 L758 190 L825 126 L900 187 L900 258 L0 258 Z" fill="${theme.far}"/><path d="M0 238 L80 199 L170 235 L258 196 L350 238 L450 203 L536 238 L637 194 L722 238 L812 201 L900 238 L900 292 L0 292 Z" fill="${theme.near}"/><path d="M318 204 V150 H332 V126 H346 V154 H358 V110 H374 V154 H388 V132 H402 V204 Z" fill="${theme.accentB}"/><rect x="309" y="194" width="104" height="22" fill="${theme.near}"/><path d="M620 207 V150 H636 V118 H652 V158 H668 V136 H684 V207 Z" fill="${theme.accentB}"/><rect x="606" y="198" width="96" height="22" fill="${theme.near}"/><path d="M92 218 V92 H132 V204 H152 V224 H68 V204 H92 Z" fill="${theme.accentB}"/><path d="M768 218 V96 H810 V204 H832 V224 H746 V204 H768 Z" fill="${theme.accentB}"/><rect x="99" y="118" width="24" height="72" fill="${theme.accentA}"/><rect x="779" y="120" width="25" height="74" fill="${theme.accentA}"/><rect y="250" width="900" height="180" fill="url(#ground)"/><path d="M110 310 C208 286 348 282 452 288 C572 295 690 288 804 310 C704 331 584 342 455 338 C318 334 202 330 110 310 Z" fill="${theme.accentA}" opacity=".34"/><rect x="83" y="292" width="34" height="12" fill="${theme.near}"/><rect x="242" y="301" width="44" height="11" fill="${theme.near}"/><rect x="510" y="302" width="42" height="10" fill="${theme.near}"/><rect x="734" y="294" width="38" height="11" fill="${theme.near}"/><rect x="18" y="392" width="132" height="38" fill="${theme.groundBottom}"/><rect x="732" y="392" width="150" height="38" fill="${theme.groundBottom}"/></svg>`;
}

const BASE_STAGE_ESSENCE = 15;
const TREE_COST_GROWTH = 1.75;
const GLOBAL_TREE_COST_MULTIPLIER = 0.75;
const GLOBAL_TREE_COST_GROWTH = 1.5;
const PLAYER_BASE_STAT_MULTIPLIER = 1.05;
const ENEMY_BASE_STAT_MULTIPLIER = 1.3;
const HERO_SKIN_ESSENCE_COST = 200;
const ENEMY_SKIN_ESSENCE_COST = 150;

const CLASSES = {
  knight: { name: "Knight", description: "Armored front-liner with strong defense and steady melee damage.", hp: 220, damage: 16, attackSpeed: 0.71, armor: 5, crit: 0.04, colorClass: "knight", traits: ["High health", "Armor", "Reliable melee"] },
  rogue: { name: "Rogue", description: "Fast assassin with high crit chance. Attacks always apply bleed for 4 + 0.5 per stage damage each second.", hp: 135, damage: 13, attackSpeed: 1.16, armor: 1, crit: 0.25, colorClass: "rogue", traits: ["Fast attacks", "High crit", "Guaranteed bleed"] },
  wizard: { name: "Wizard", description: "Ranged spellcaster with high damage and splash magic.", hp: 115, damage: 28, attackSpeed: 0.58, armor: 1, crit: 0.1, colorClass: "wizard", traits: ["High burst", "Splash damage", "Magic scaling"] }
};

const SPRITE_SHEETS = {
  heroes: {
    knight: "assets/heroes/knight-sheet.svg",
    rogue: "assets/heroes/rogue-sheet.svg",
    wizard: "assets/heroes/wizard-sheet.svg"
  },
  enemies: {
    goblin: "assets/enemies/goblin-sheet.svg",
    skeleton: "assets/enemies/skeleton-sheet.svg",
    orc: "assets/enemies/orc-sheet.svg",
    wolf: "assets/enemies/wolf-sheet.svg",
    bandit: "assets/enemies/bandit-sheet.svg",
    cultist: "assets/enemies/cultist-sheet.svg",
    dark_archer: "assets/enemies/dark-archer-sheet.svg",
    plague_rat: "assets/enemies/plague-rat-sheet.svg",
    armored_knight: "assets/enemies/armored-knight-sheet.svg",
    fallen_knight: "assets/enemies/fallen-knight-sheet.svg",
    necromancer: "assets/enemies/necromancer-sheet.svg",
    wraith: "assets/enemies/wraith-sheet.svg",
    troll: "assets/enemies/troll-sheet.svg",
    raider: "assets/enemies/raider-sheet.svg",
    boss: "assets/enemies/boss-sheet.svg"
  }
};

const HERO_SKINS = {
  knight: [
    { id: "base", name: "Classic Oath", className: "", unlock: { type: "base" } },
    { id: "royal_vanguard", name: "Royal Vanguard", className: "skin-tree", unlock: { type: "purchase", cost: HERO_SKIN_ESSENCE_COST } },
    { id: "iron_champion", name: "Iron Champion", className: "skin-achievement", unlock: { type: "purchase", cost: HERO_SKIN_ESSENCE_COST } }
  ],
  rogue: [
    { id: "base", name: "Classic Contract", className: "", unlock: { type: "base" } },
    { id: "verdant_shade", name: "Verdant Shade", className: "skin-tree", unlock: { type: "purchase", cost: HERO_SKIN_ESSENCE_COST } },
    { id: "crimson_ghost", name: "Crimson Ghost", className: "skin-achievement", unlock: { type: "purchase", cost: HERO_SKIN_ESSENCE_COST } }
  ],
  wizard: [
    { id: "base", name: "Classic Arcana", className: "", unlock: { type: "base" } },
    { id: "astral_scholar", name: "Astral Scholar", className: "skin-tree", unlock: { type: "purchase", cost: HERO_SKIN_ESSENCE_COST } },
    { id: "starfire_magus", name: "Starfire Magus", className: "skin-achievement", unlock: { type: "purchase", cost: HERO_SKIN_ESSENCE_COST } }
  ]
};

function getEnemySkinSet(enemyId, enemyName) {
  return [
    { id: "base", name: `${enemyName} Classic`, className: "", unlock: { type: "base" } },
    { id: "crownmark", name: `${enemyName} Crownmark`, className: "skin-tree", unlock: { type: "purchase", cost: ENEMY_SKIN_ESSENCE_COST } },
    { id: "nemesis", name: `${enemyName} Nemesis`, className: "skin-achievement", unlock: { type: "purchase", cost: ENEMY_SKIN_ESSENCE_COST } }
  ];
}

const ENEMY_ARCHETYPES = {
  goblin: { id: "goblin", name: "Goblin", hp: 40, damage: 7, attackSpeed: 0.8, armor: 0, className: "goblin" },
  wolf: { id: "wolf", name: "Wolf", hp: 46, damage: 8, attackSpeed: 0.98, armor: 0, className: "wolf" },
  bandit: { id: "bandit", name: "Bandit", hp: 54, damage: 9, attackSpeed: 0.82, armor: 1, className: "bandit" },
  plagueRat: { id: "plague_rat", name: "Plague Rat", hp: 36, damage: 7, attackSpeed: 1.09, armor: 0, className: "plague_rat" },
  darkArcher: { id: "dark_archer", name: "Dark Archer", hp: 48, damage: 12, attackSpeed: 0.76, armor: 1, className: "dark_archer" },

  skeleton: { id: "skeleton", name: "Skeleton", hp: 60, damage: 9, attackSpeed: 0.66, armor: 1, className: "skeleton" },
  wraith: { id: "wraith", name: "Wraith", hp: 52, damage: 13, attackSpeed: 0.84, armor: 2, className: "wraith" },
  necromancer: { id: "necromancer", name: "Necromancer", hp: 68, damage: 15, attackSpeed: 0.54, armor: 2, className: "necromancer" },

  orc: { id: "orc", name: "Orc", hp: 75, damage: 12, attackSpeed: 0.54, armor: 3, className: "orc" },
  raider: { id: "raider", name: "Raider", hp: 66, damage: 13, attackSpeed: 0.72, armor: 2, className: "raider" },
  troll: { id: "troll", name: "Troll", hp: 116, damage: 17, attackSpeed: 0.4, armor: 4, className: "troll" },
  armoredKnight: { id: "armored_knight", name: "Armored Knight", hp: 98, damage: 14, attackSpeed: 0.5, armor: 7, className: "armored_knight" },

  fallenKnight: { id: "fallen_knight", name: "Fallen Knight", hp: 108, damage: 17, attackSpeed: 0.53, armor: 7, className: "fallen_knight" },
  cultist: { id: "cultist", name: "Cultist", hp: 72, damage: 18, attackSpeed: 0.62, armor: 2, className: "cultist" },
  fallenKing: { id: "fallen_king_shade", name: "Fallen King", hp: 135, damage: 22, attackSpeed: 0.46, armor: 6, className: "boss" },
  crownHound: { id: "crown_hound", name: "Crown Hound", hp: 82, damage: 15, attackSpeed: 0.92, armor: 2, className: "wolf", requiresNode: "unlock_enemies" },
  oathbreaker: { id: "oathbreaker", name: "Oathbreaker", hp: 118, damage: 19, attackSpeed: 0.58, armor: 8, className: "fallen_knight", requiresNode: "unlock_enemies" },
  bloodAcolyte: { id: "blood_acolyte", name: "Blood Acolyte", hp: 86, damage: 21, attackSpeed: 0.64, armor: 3, className: "cultist", requiresNode: "unlock_enemies" }
};

const ENEMY_AREAS = {
  forest: {
    name: "Forest",
    enemies: [
      ENEMY_ARCHETYPES.goblin,
      ENEMY_ARCHETYPES.wolf,
      ENEMY_ARCHETYPES.bandit,
      ENEMY_ARCHETYPES.plagueRat,
      ENEMY_ARCHETYPES.darkArcher,
      ENEMY_ARCHETYPES.crownHound
    ]
  },
  crypt: {
    name: "Crypt",
    enemies: [
      ENEMY_ARCHETYPES.skeleton,
      ENEMY_ARCHETYPES.wraith,
      ENEMY_ARCHETYPES.necromancer,
      ENEMY_ARCHETYPES.plagueRat,
      ENEMY_ARCHETYPES.bloodAcolyte
    ]
  },
  warCamp: {
    name: "War Camp",
    enemies: [
      ENEMY_ARCHETYPES.orc,
      ENEMY_ARCHETYPES.raider,
      ENEMY_ARCHETYPES.troll,
      ENEMY_ARCHETYPES.armoredKnight,
      ENEMY_ARCHETYPES.darkArcher,
      ENEMY_ARCHETYPES.oathbreaker
    ]
  },
  darkCastle: {
    name: "Dark Castle",
    enemies: [
      ENEMY_ARCHETYPES.fallenKnight,
      ENEMY_ARCHETYPES.cultist,
      ENEMY_ARCHETYPES.fallenKing,
      ENEMY_ARCHETYPES.wraith,
      ENEMY_ARCHETYPES.necromancer,
      ENEMY_ARCHETYPES.oathbreaker,
      ENEMY_ARCHETYPES.bloodAcolyte
    ]
  }
};

const ENEMIES = [
  ENEMY_ARCHETYPES.goblin,
  ENEMY_ARCHETYPES.skeleton,
  ENEMY_ARCHETYPES.orc
];

function buildAreaEnemyPool(areaIds) {
  const seen = new Set();
  return areaIds
    .flatMap(areaId => (ENEMY_AREAS[areaId] ? ENEMY_AREAS[areaId].enemies : []))
    .filter(enemy => {
      if (seen.has(enemy.id)) return false;
      seen.add(enemy.id);
      return true;
    });
}

const AREA_ENEMY_POOLS = {
  easy: buildAreaEnemyPool(["forest"]),
  medium: buildAreaEnemyPool(["forest", "crypt", "warCamp"]),
  hard: buildAreaEnemyPool(["crypt", "warCamp", "darkCastle"])
};

const BIOME_THEMES = {
  hauntedForest: {
    name: "Haunted Forest",
    description: "A moonlit wood packed with beasts, thieves, and lingering spirits.",
    icon: "HF",
    enemyPool: buildAreaEnemyPool(["forest", "crypt"]),
    eventTags: ["ambush", "shrine", "fog"],
    eventNodes: ["Heal", "Battle", "Merchant"],
    musicKey: "haunted_forest",
    bossVariant: "forest_horror",
    backgroundSvg: createBiomeBattlefieldSvg({
      skyTop: "#172313", skyMid: "#263f27", skyBottom: "#111827",
      groundTop: "#334d25", groundBottom: "#161f13", sun: "#c7d2fe",
      far: "#18241a", near: "#20341f", accentA: "#365314", accentB: "#1f2937"
    })
  },
  ruinedKeep: {
    name: "Ruined Keep",
    description: "Broken battlements where raiders, armored knights, and castle dead still fight.",
    icon: "RK",
    enemyPool: buildAreaEnemyPool(["warCamp", "darkCastle"]),
    eventTags: ["armory", "siege", "barracks"],
    eventNodes: ["Merchant", "Elite", "Heal"],
    musicKey: "ruined_keep",
    bossVariant: "fallen_commander",
    backgroundSvg: createBiomeBattlefieldSvg({
      skyTop: "#2f2a35", skyMid: "#5b463f", skyBottom: "#211816",
      groundTop: "#6b5a45", groundBottom: "#2b2119", sun: "#fbbf24",
      far: "#3a3440", near: "#4b3b34", accentA: "#78716c", accentB: "#7f1d1d"
    })
  },
  goblinCamp: {
    name: "Goblin Camp",
    description: "A crude camp of goblins, wolves, bandits, and raiders.",
    icon: "GC",
    enemyPool: buildAreaEnemyPool(["forest", "warCamp"]),
    eventTags: ["loot", "trap", "campfire"],
    eventNodes: ["Merchant", "Battle", "Elite"],
    musicKey: "goblin_camp",
    bossVariant: "goblin_warlord",
    backgroundSvg: createBiomeBattlefieldSvg({
      skyTop: "#3f2f1f", skyMid: "#9a5c24", skyBottom: "#2f1f14",
      groundTop: "#8a5a2b", groundBottom: "#31200f", sun: "#fde68a",
      far: "#4a341f", near: "#5f3e1f", accentA: "#365314", accentB: "#a16207"
    })
  },
  cursedMarsh: {
    name: "Cursed Marsh",
    description: "A drowned battlefield of plague rats, dark archers, wraiths, and cultists.",
    icon: "CM",
    enemyPool: buildAreaEnemyPool(["forest", "crypt"]),
    eventTags: ["bog", "curse", "lost_relic"],
    eventNodes: ["Heal", "Elite", "Merchant"],
    musicKey: "cursed_marsh",
    bossVariant: "marsh_witch",
    backgroundSvg: createBiomeBattlefieldSvg({
      skyTop: "#10231f", skyMid: "#23463d", skyBottom: "#0f172a",
      groundTop: "#31533f", groundBottom: "#101812", sun: "#86efac",
      far: "#172f2a", near: "#1f3b30", accentA: "#3f6212", accentB: "#312e81"
    })
  },
  warCamp: {
    name: "War Camp",
    description: "A brutal front line of orcs, raiders, trolls, and armored knights.",
    icon: "WC",
    enemyPool: buildAreaEnemyPool(["warCamp"]),
    eventTags: ["siege", "war_drum", "spoils"],
    eventNodes: ["Elite", "Merchant", "Battle"],
    musicKey: "war_camp",
    bossVariant: "troll_chieftain",
    backgroundSvg: createBiomeBattlefieldSvg({
      skyTop: "#2f1d16", skyMid: "#7c2d12", skyBottom: "#1c120d",
      groundTop: "#6b3f20", groundBottom: "#24130b", sun: "#fdba74",
      far: "#3f2418", near: "#552c18", accentA: "#9a3412", accentB: "#292524"
    })
  },
  royalCrypt: {
    name: "Royal Crypt",
    description: "A sealed tomb of skeletons, wraiths, necromancers, and plague things.",
    icon: "RC",
    enemyPool: buildAreaEnemyPool(["crypt"]),
    eventTags: ["sarcophagus", "curse", "reliquary"],
    eventNodes: ["Heal", "Elite", "Merchant"],
    musicKey: "royal_crypt",
    bossVariant: "crypt_lord",
    backgroundSvg: createBiomeBattlefieldSvg({
      skyTop: "#111827", skyMid: "#263044", skyBottom: "#0f172a",
      groundTop: "#3f3f46", groundBottom: "#18181b", sun: "#93c5fd",
      far: "#27272a", near: "#3f3f46", accentA: "#a8a29e", accentB: "#6d28d9"
    })
  },
  darkCastle: {
    name: "Dark Castle",
    description: "The crown's final ruin, guarded by cultists, fallen knights, and royal shades.",
    icon: "DC",
    enemyPool: buildAreaEnemyPool(["darkCastle"]),
    eventTags: ["throne", "blood_oath", "dark_altar"],
    eventNodes: ["Elite", "Merchant", "Battle"],
    musicKey: "dark_castle",
    bossVariant: "fallen_king",
    backgroundSvg: createBiomeBattlefieldSvg({
      skyTop: "#180f1f", skyMid: "#4c1d3f", skyBottom: "#14080f",
      groundTop: "#4b1f24", groundBottom: "#1c0f12", sun: "#ef4444",
      far: "#231325", near: "#35151d", accentA: "#7f1d1d", accentB: "#111827"
    })
  }
};

const DIFFICULTIES = {
  easy: {
    name: "Greenwood Outskirts",
    description: "The safest road into Crownfall. Lighter enemy pressure and a forgiving route for early builds.",
    enemyHealth: 0.8,
    enemyDamage: 0.8,
    stageHealthGrowth: 0.11,
    stageDamageGrowth: 0.1,
    armorGrowth: 5,
    essenceMultiplier: 0.6,
    enemyPool: AREA_ENEMY_POOLS.easy,
    themeIds: ["hauntedForest", "goblinCamp"],
    layerEnemyMultipliers: [1.1, 1.35, 1.65],
    layerDamageMultipliers: [1.05, 1.18, 1.32]
  },
  medium: {
    name: "Ashen Ramparts",
    description: "A balanced siege route with steady danger and stronger rewards.",
    enemyHealth: 1,
    enemyDamage: 1,
    stageHealthGrowth: 0.15,
    stageDamageGrowth: 0.15,
    armorGrowth: 4,
    essenceMultiplier: 1.1,
    enemyPool: AREA_ENEMY_POOLS.medium,
    themeIds: ["ruinedKeep", "cursedMarsh"],
    layerEnemyMultipliers: [1.35, 1.65, 2.25],
    layerDamageMultipliers: [1.1, 1.32, 1.58]
  },
  hard: {
    name: "Crownfall Keep",
    description: "The crown's brutal inner keep. Enemies hit hard, scale fast, and reward bold runs.",
    requiresNode: "unlock_harder_difficulty",
    enemyHealth: 1.32,
    enemyDamage: 1.35,
    stageHealthGrowth: 0.22,
    stageDamageGrowth: 0.21,
    armorGrowth: 3,
    essenceMultiplier: 1.9,
    enemyPool: AREA_ENEMY_POOLS.hard,
    themeIds: ["warCamp", "darkCastle"],
    layerEnemyMultipliers: [2.0, 2.5, 3.25],
    layerDamageMultipliers: [1.5, 1.7, 2.0]
  },
  endless: {
    name: "Endless Mode",
    description: "A no-map 1v1 gauntlet. Every 5th stage is a miniboss and every 10th stage is a boss.",
    mode: "endless",
    requiresAchievement: "eternal_crown",
    enemyHealth: 1,
    enemyDamage: 1,
    stageHealthGrowth: 0,
    stageDamageGrowth: 0,
    endlessHealthGrowth: 1.2,
    endlessDamageGrowth: 1.12,
    armorGrowth: 5,
    essenceMultiplier: 1.4,
    enemyPool: ENEMIES,
    themeIds: ["darkCastle", "warCamp"],
    layerEnemyMultipliers: [1, 1, 1],
    layerDamageMultipliers: [1, 1, 1]
  }
};

const BOSSES = [
  { id: "fallenKing", name: "The Fallen King", skillName: "Crownbreaker Slam", hp: 300, damage: 20, attackSpeed: 0.5, armor: 4, className: "boss", boss: true },
  { id: "ashenRegent", name: "The Ashen Regent", skillName: "Ember Edict", hp: 420, damage: 28, attackSpeed: 0.46, armor: 6, className: "boss", boss: true },
  { id: "crownfallTyrant", name: "The Crownfall Tyrant", skillName: "Imperial Ruin", hp: 620, damage: 34, attackSpeed: 0.45, armor: 8, className: "boss", boss: true }
];

const FINAL_BOSS = {
  id: "eternalCrown",
  name: "The Eternal Crown",
  skillName: "Endless Decree",
  hp: 1000000,
  damage: 500,
  attackSpeed: 1.0,
  armor: 20,
  shield: 0,
  className: "boss",
  boss: true,
  finalBoss: true
};

const BOSS = BOSSES[0];

const ELITE_TITLES = [
  { name: "Ironbound Captain", skillName: "Shield Crush", damageMultiplier: 1.05, armor: 2 },
  { name: "Redknife Duelist", skillName: "Bleeding Feint", attackSpeedMultiplier: 1.12, damageMultiplier: 1.03 },
  { name: "Oathless Hexer", skillName: "Withering Hex", damageMultiplier: 1.08 }
];

const RUN_ABILITIES = {
  wizard_curse: { id: "wizard_curse", classId: "wizard", name: "Curse", icon: "☽", cooldown: 2.5, duration: 4, color: "#c084fc", description: "Every 2.5s, curse one enemy for 4s so it takes +22% damage." },
  wizard_iceball: { id: "wizard_iceball", classId: "wizard", name: "Iceball", icon: "❄", cooldown: 2.5, duration: 3.5, color: "#93c5fd", description: "Every 2.5s, hit one enemy for 75% damage and slow it by 38% for 3.5s." },
  wizard_lightning: { id: "wizard_lightning", classId: "wizard", name: "Lightning", icon: "ϟ", cooldown: 2, duration: 0.7, color: "#fde68a", description: "Every 2s, strike up to 3 enemies for 90%/75%/60% damage." },
  rogue_poison: { id: "rogue_poison", classId: "rogue", name: "Poison", icon: "✹", cooldown: 2.8, duration: 4.5, color: "#86efac", description: "Every 2.8s, poison one enemy for 4.5s. Poison deals 9 + 0.75 per stage damage each second." },
  rogue_bleed: { id: "rogue_bleed", classId: "rogue", name: "Trap", icon: "✧", cooldown: 2.5, duration: 4, color: "#fca5a5", description: "Every 2.5s, slow all living enemies by 28% for 4s. Rogue deals +8% damage to slowed enemies." },
  rogue_burn: { id: "rogue_burn", classId: "rogue", name: "Burn", icon: "♨", cooldown: 2.2, duration: 3.5, color: "#fb923c", description: "Every 2.2s, burn one enemy for 3.5s. Burn deals 7 + 0.55 per stage damage each second." },
  knight_heavy_attack: { id: "knight_heavy_attack", classId: "knight", name: "Heavy Attack", icon: "⚔", cooldown: 3, duration: 0.8, color: "#f8e7bb", description: "Every 3s, strike one enemy for 225% damage." },
  knight_holy_sword: { id: "knight_holy_sword", classId: "knight", name: "Holy Sword", icon: "✦", cooldown: 5, duration: 4.5, color: "#fde68a", description: "Every 5s, empower attacks for 4.5s. Holy Sword attacks add 32% damage, minimum 4." },
  knight_holy_shield: { id: "knight_holy_shield", classId: "knight", name: "Holy Shield", icon: "⬟", cooldown: 5, duration: 0.9, color: "#facc15", description: "Every 5s, gain shield equal to 32 + 12% max HP." }
};

const ENEMY_KILL_ACHIEVEMENTS = Object.values(ENEMY_ARCHETYPES).map((enemy, index) => ({
  id: `slayer_${enemy.id}`,
  name: `${enemy.name} Slayer`,
  description: `Defeat ${enemy.name}s across your runs.`,
  goal: `Defeat 75 ${enemy.name}s`,
  condition: save => ((save.stats.enemyKills && save.stats.enemyKills[enemy.id]) || 0) >= 75,
  bonus: getEnemySlayerBonus(index)
}));

const ACHIEVEMENTS = [
  { id: "first_steps", name: "First Steps", description: "Start your first run.", goal: "Start 1 run", condition: save => save.stats.runsStarted >= 1, bonus: { maxHp: 2 } },
  { id: "first_victory", name: "First Victory", description: "Win your first battle.", goal: "Win 1 battle", condition: save => save.stats.battlesWon >= 1, bonus: { damageMultiplier: 0.005 } },
  { id: "ten_battles", name: "Battle Tested", description: "Win 10 battles.", goal: "Win 10 battles", condition: save => save.stats.battlesWon >= 10, bonus: { maxHp: 4 } },
  { id: "fifty_battles", name: "Veteran Blade", description: "Win 50 battles.", goal: "Win 50 battles", condition: save => save.stats.battlesWon >= 50, bonus: { damageMultiplier: 0.01 } },
  { id: "hundred_enemies", name: "Line Breaker", description: "Defeat 100 enemies.", goal: "Defeat 100 enemies", condition: save => save.stats.enemiesDefeated >= 100, bonus: { attackSpeedMultiplier: 0.01 } },
  { id: "elite_hunter", name: "Elite Hunter", description: "Defeat 10 elites.", goal: "Defeat 10 elites", condition: save => save.stats.elitesDefeated >= 10, bonus: { armor: 1 } },
  { id: "elite_reaper", name: "Elite Reaper", description: "Defeat 500 elites.", goal: "Defeat 500 elites", condition: save => save.stats.elitesDefeated >= 500, bonus: { armor: 1, damageMultiplier: 0.005 } },
  { id: "boss_breaker", name: "Boss Breaker", description: "Defeat 3 bosses.", goal: "Defeat 3 bosses", condition: save => save.stats.bossesDefeated >= 3, bonus: { bossDamage: 0.015 } },
  { id: "boss_conqueror", name: "Boss Conqueror", description: "Defeat 100 bosses.", goal: "Defeat 100 bosses", condition: save => save.stats.bossesDefeated >= 100, bonus: { bossDamage: 0.01, maxHp: 3 } },
  { id: "deep_delver", name: "Deep Delver", description: "Reach Stage 20.", goal: "Reach Stage 20", condition: save => save.highestClear >= 20, bonus: { maxHp: 5 } },
  { id: "third_map", name: "Third March", description: "Reach Stage 30.", goal: "Reach Stage 30", condition: save => save.highestClear >= 30, bonus: { essenceMultiplier: 0.01 } },
  { id: "essence_hoard", name: "Essence Hoard", description: "Bank 500 total Essence.", goal: "Earn 500 Essence", condition: save => save.stats.totalEssenceEarned >= 500, bonus: { luck: 1 } },
  { id: "gold_hand", name: "Gold Hand", description: "Earn 500 total gold.", goal: "Earn 500 gold", condition: save => save.stats.totalGoldEarned >= 500, bonus: { startingGold: 5 } },
  { id: "skill_spark", name: "Skill Spark", description: "Trigger 25 skills.", goal: "Trigger 25 skills", condition: save => save.stats.skillsTriggered >= 25, bonus: { attackSpeedMultiplier: 0.005 } },
  { id: "skill_storm", name: "Skill Storm", description: "Trigger 150 skills.", goal: "Trigger 150 skills", condition: save => save.stats.skillsTriggered >= 150, bonus: { damageMultiplier: 0.01 } },
  { id: "hard_path", name: "Crownfall Trial", description: "Clear at least 15 stages on hard.", goal: "Clear 15 hard stages", condition: save => save.stats.hardStagesCleared >= 15, bonus: { armor: 1 } },
  { id: "merchant_friend", name: "Merchant Friend", description: "Visit 10 shops.", goal: "Visit 10 shops", condition: save => save.stats.shopsVisited >= 10, bonus: { startingGold: 8 } },
  { id: "relic_keeper", name: "Relic Keeper", description: "Claim 15 relics.", goal: "Claim 15 relics", condition: save => save.stats.relicsClaimed >= 15, bonus: { luck: 1 } },
  { id: "reward_seeker", name: "Reward Seeker", description: "Choose 30 run upgrades.", goal: "Choose 30 upgrades", condition: save => save.stats.rewardsClaimed >= 30, bonus: { maxHp: 3 } },
  { id: "knight_oath", name: "Knight Oath", description: "Start 5 Knight runs.", goal: "Start 5 Knight runs", condition: save => save.stats.knightRuns >= 5, bonus: { knightArmor: 1 } },
  { id: "rogue_contract", name: "Rogue Contract", description: "Start 5 Rogue runs.", goal: "Start 5 Rogue runs", condition: save => save.stats.rogueRuns >= 5, bonus: { rogueCritChance: 0.01 } },
  { id: "eternal_crown", name: "Eternal Crownbreaker", description: "Kill the final boss with 1,000,000 HP.", goal: "Defeat The Eternal Crown", condition: save => save.stats.finalBossKills >= 1, bonus: { unlock: "Endless Mode", damageMultiplier: 0.08, maxHp: 40, armor: 3, luck: 3, essenceMultiplier: 0.05 } },
  ...ENEMY_KILL_ACHIEVEMENTS
];

function getEnemySlayerBonus(index) {
  const bonuses = [
    { maxHp: 1 },
    { damageMultiplier: 0.002 },
    { attackSpeedMultiplier: 0.002 },
    { luck: 1 },
    { bossDamage: 0.002 }
  ];
  return bonuses[index % bonuses.length];
}

function getDungeonStatScale(type = "stat") {
  const stage = run ? Math.max(1, Number(run.stage) || 1) : 1;
  const perStage = type === "attackSpeed" ? 0.009 : 0.014;
  const cap = type === "attackSpeed" ? 1.28 : 1.45;
  return Math.min(cap, 1 + (stage - 1) * perStage);
}

function getScaledDungeonValue(value, type = "stat") {
  const scaled = value * getDungeonStatScale(type);
  return type === "attackSpeed" ? Math.round(scaled * 100) / 100 : Math.round(scaled);
}

function addScaledDamage(hero, value) {
  hero.damage += getScaledDungeonValue(value, "damage");
}

function addScaledMaxHp(hero, value, heal = true) {
  const amount = getScaledDungeonValue(value, "maxHp");
  hero.maxHp += amount;
  if (heal) hero.hp += amount;
}

function addScaledAttackSpeed(hero, value) {
  hero.attackSpeed += getScaledDungeonValue(value, "attackSpeed");
}

function multiplyMaxHp(hero, multiplier, heal = true) {
  const oldMax = hero.maxHp;
  hero.maxHp = Math.max(1, Math.round(hero.maxHp * multiplier));
  const delta = hero.maxHp - oldMax;
  if (heal && delta > 0) hero.hp += delta;
  hero.hp = Math.min(hero.hp, hero.maxHp);
}

function multiplyArmor(hero, multiplier) {
  hero.armor = Math.max(0, Math.round((hero.armor || 0) * multiplier * 10) / 10);
}

const REWARDS = [
  { name: "Sharpened Blade", rarity: "Common", text: "+15% hero damage", apply: hero => hero.damage *= 1.15 },
  { name: "Battle Rhythm", rarity: "Common", text: "+15% attack speed", apply: hero => hero.attackSpeed *= 1.15 },
  { name: "Iron Skin", rarity: "Common", text: "+15% armor", apply: hero => multiplyArmor(hero, 1.15) },
  { name: "Leeching Edge", rarity: "Rare", text: "+5% life steal", apply: hero => hero.lifeSteal = (hero.lifeSteal || 0) + 0.05 },
  { name: "Balanced Blade", rarity: "Common", text: "+15% damage", apply: hero => hero.damage *= 1.15 },
  { name: "Hardy Bread", rarity: "Common", text: "+12% max HP", apply: hero => multiplyMaxHp(hero, 1.12) },
  { name: "Quick Buckle", rarity: "Common", text: "+12% attack speed", apply: hero => hero.attackSpeed *= 1.12 },
  { name: "Scout's Dice", rarity: "Common", text: "+3 Luck", apply: hero => hero.luck = (hero.luck || 0) + 3 },
  { requiresNode: "unlock_starting_bonuses", name: "Prepared Camp", rarity: "Common", text: "Start future battles this run with +15 shield", apply: hero => hero.runStartShield = (hero.runStartShield || 0) + 15 },
  { requiresNode: "unlock_starting_bonuses", name: "Opening Gambit", rarity: "Rare", text: "Gain +30 gold and +3 Luck", apply: hero => { run.gold += 30; hero.luck = (hero.luck || 0) + 3; } },
  { name: "Triage Kit", rarity: "Common", text: "+10% max HP and +1 HP regen", apply: hero => { multiplyMaxHp(hero, 1.1, false); hero.regen = (hero.regen || 0) + 1; } },
  { name: "Risky Footwork", rarity: "Common", text: "+22% attack speed, -15% armor", apply: hero => { hero.attackSpeed *= 1.22; multiplyArmor(hero, 0.85); } },
  { name: "Vitality Draught", rarity: "Rare", text: "+20% max HP", apply: hero => multiplyMaxHp(hero, 1.20, false) },
  { name: "Lucky Charm", rarity: "Rare", text: "+10% crit chance", apply: hero => hero.crit += 0.1 },
  { name: "Knightly Edge", rarity: "Rare", text: "+22% damage", apply: hero => hero.damage *= 1.22 },
  { name: "Oakheart Tonic", rarity: "Rare", text: "+24% max HP", apply: hero => multiplyMaxHp(hero, 1.24) },
  { name: "Clockwork Grip", rarity: "Rare", text: "+20% attack speed", apply: hero => hero.attackSpeed *= 1.18 },
  { name: "Royal Purse", rarity: "Common", text: "+50 gold", apply: () => run.gold += 50 },
  { name: "Field Medic", rarity: "Rare", text: "+12% max HP and +15% armor", apply: hero => { multiplyMaxHp(hero, 1.12, false); multiplyArmor(hero, 1.15); } },
  { name: "Gilded Compass", rarity: "Rare", text: "+3 Luck and +30 gold", apply: hero => { hero.luck = (hero.luck || 0) + 3; run.gold += 30; } },
  { name: "Barbed Buckler", rarity: "Rare", text: "+25% armor and +8% crit chance", apply: hero => { multiplyArmor(hero, 1.25); hero.crit += 0.08; } },
  { name: "Glass Canon", rarity: "Rare", text: "+30% damage, -12% max HP", apply: hero => { hero.damage *= 1.3; multiplyMaxHp(hero, 0.88, false); } },
  { name: "War Training", rarity: "Epic", text: "+20% damage and +10% max HP", apply: hero => { hero.damage *= 1.2; multiplyMaxHp(hero, 1.1, false); } },
  { name: "Runed Greatblade", rarity: "Epic", text: "+35% damage", apply: hero => hero.damage *= 1.35 },
  { name: "Giant's Supper", rarity: "Epic", text: "+35% max HP", apply: hero => multiplyMaxHp(hero, 1.35) },
  { name: "Silver Reflexes", rarity: "Epic", text: "+28% attack speed", apply: hero => hero.attackSpeed *= 1.28 },
  { name: "Fortune's Edge", rarity: "Epic", text: "+20% damage, +8% crit chance, +2 Luck", apply: hero => { hero.damage *= 1.2; hero.crit += 0.08; hero.luck = (hero.luck || 0) + 2; } },
  { name: "Iron Momentum", rarity: "Epic", text: "+25% armor and +18% attack speed", apply: hero => { multiplyArmor(hero, 1.25); hero.attackSpeed *= 1.18; } },
  { name: "Vampiric Training", rarity: "Epic", text: "+22% damage and +2 HP regen", apply: hero => { hero.damage *= 1.22; hero.regen = (hero.regen || 0) + 2; } },
  { name: "Kingslayer Edge", rarity: "Legendary", text: "Crown-forged: +50% damage and +10% crit chance", apply: hero => { hero.damage *= 1.5; hero.crit += 0.1; } },
  { name: "Titan Plate", rarity: "Legendary", text: "Ancient royal plate: +60% armor and +22% max HP", apply: hero => { multiplyArmor(hero, 1.6); multiplyMaxHp(hero, 1.22, false); } },
  { name: "Eternal Edge", rarity: "Legendary", text: "A blade with a name of its own: +55% damage", apply: hero => hero.damage *= 1.55 },
  { name: "Colossus Heart", rarity: "Legendary", text: "A thunderous second heartbeat: +55% max HP", apply: hero => multiplyMaxHp(hero, 1.55) },
  { name: "Chrono Spurs", rarity: "Legendary", text: "Time buckles under each step: +50% attack speed", apply: hero => hero.attackSpeed *= 1.5 },
  { name: "Storm Tempo", rarity: "Epic", text: "+32% attack speed", apply: hero => hero.attackSpeed *= 1.32 },
  { name: "Battle Renewal", rarity: "Epic", text: "+5 HP regen while in battle", apply: hero => hero.regen = (hero.regen || 0) + 5 },
  { name: "Sovereign Star", rarity: "Legendary", text: "A fate-lit royal charm: +6 Luck, +15% crit chance, +60 gold", apply: hero => { hero.luck = (hero.luck || 0) + 6; hero.crit += 0.15; run.gold += 60; } },
  { name: "Living Aegis", rarity: "Legendary", text: "A shield that remembers kings: +55% armor, +18% max HP, +2 HP regen", apply: hero => { multiplyArmor(hero, 1.55); multiplyMaxHp(hero, 1.18, false); hero.regen = (hero.regen || 0) + 2; } },

  { classId: "knight", name: "Shield Drill", rarity: "Common", text: "Knight only: start each battle with +20 shield", apply: hero => hero.runStartShield = (hero.runStartShield || 0) + 20 },
  { classId: "knight", name: "Plate Fitting", rarity: "Common", text: "Knight only: +18% armor and +8% max HP", apply: hero => { multiplyArmor(hero, 1.18); multiplyMaxHp(hero, 1.08, false); } },
  { classId: "knight", name: "Guard Stance", rarity: "Rare", text: "Knight only: +8% block chance", apply: hero => hero.runBlockChance = (hero.runBlockChance || 0) + 0.08 },
  { classId: "knight", name: "Shield Timing", rarity: "Common", text: "Knight only: +4% block chance", apply: hero => hero.runBlockChance = (hero.runBlockChance || 0) + 0.04 },
  { classId: "knight", name: "Bulwark Drill", rarity: "Rare", text: "Knight only: +10% block chance and +15 shield each battle", apply: hero => { hero.runBlockChance = (hero.runBlockChance || 0) + 0.1; hero.runStartShield = (hero.runStartShield || 0) + 15; } },
  { classId: "knight", name: "Spiked Shield", rarity: "Rare", text: "Knight only: blocked damage retaliates for 20%", apply: hero => hero.runRetaliateBlock = (hero.runRetaliateBlock || 0) + 0.2 },
  { classId: "knight", name: "Unbroken Vow", rarity: "Epic", text: "Knight only: +20% max HP and +25 shield each battle", apply: hero => { multiplyMaxHp(hero, 1.2, false); hero.runStartShield = (hero.runStartShield || 0) + 25; } },
  { classId: "knight", name: "Castle Guard", rarity: "Epic", text: "Knight only: +16% block chance", apply: hero => hero.runBlockChance = (hero.runBlockChance || 0) + 0.16 },
  { classId: "knight", name: "Royal Bastion", rarity: "Legendary", text: "Knight only: a king's last wall. +45% armor, +4 armor, and +25% max HP", apply: hero => { multiplyArmor(hero, 1.45); hero.armor += 4; multiplyMaxHp(hero, 1.25, false); } },

  { classId: "rogue", name: "Serrated Oil", rarity: "Common", text: "Rogue only: +40% bleed damage", apply: hero => hero.runBleedDamageMultiplier = (hero.runBleedDamageMultiplier || 0) + 0.4 },
  { classId: "rogue", name: "Quickstep", rarity: "Common", text: "Rogue only: +12% attack speed and +3% evasion", apply: hero => { hero.attackSpeed *= 1.12; hero.runEvasion = (hero.runEvasion || 0) + 0.03; } },
  { classId: "rogue", name: "Rending Cuts", rarity: "Rare", text: "Rogue only: +60% bleed damage", apply: hero => hero.runBleedDamageMultiplier = (hero.runBleedDamageMultiplier || 0) + 0.6 },
  { classId: "rogue", name: "Assassin's Eye", rarity: "Rare", text: "Rogue only: +12% crit chance and +15% execute damage", apply: hero => { hero.crit += 0.12; hero.runExecuteDamage = (hero.runExecuteDamage || 0) + 0.15; } },
  { classId: "rogue", name: "Blood Rush", rarity: "Epic", text: "Rogue only: +50% bleed damage and +8% attack speed after bleeding a new target", apply: hero => { hero.runBleedDamageMultiplier = (hero.runBleedDamageMultiplier || 0) + 0.5; hero.runBleedAttackSpeed = (hero.runBleedAttackSpeed || 0) + 0.08; } },
  { classId: "rogue", name: "Deathblow Contract", rarity: "Legendary", text: "Rogue only: enemies below 40% HP take +45% execute damage", apply: hero => { hero.runExecuteDamage = (hero.runExecuteDamage || 0) + 0.45; hero.runExecuteThreshold = Math.max(hero.runExecuteThreshold || 0, 0.4); } },

  { classId: "wizard", name: "Kindling Rune", rarity: "Common", text: "Wizard only: +15% burn chance", apply: hero => hero.runBurnChance = (hero.runBurnChance || 0) + 0.15 },
  { classId: "wizard", name: "Arcane Focus", rarity: "Common", text: "Wizard only: +15% damage and +8% splash damage", apply: hero => { hero.damage *= 1.15; hero.runSplashDamageMultiplier = (hero.runSplashDamageMultiplier || 0) + 0.08; } },
  { classId: "wizard", name: "Frost Thread", rarity: "Rare", text: "Wizard only: attacks gain +15% chance to slow by 20% for 3.5s", apply: hero => hero.runSlowChance = (hero.runSlowChance || 0) + 0.15 },
  { classId: "wizard", name: "Mana Ward", rarity: "Rare", text: "Wizard only: splash grants +14 shield", apply: hero => hero.runSplashShield = (hero.runSplashShield || 0) + 14 },
  { classId: "wizard", name: "Chain Spell", rarity: "Epic", text: "Wizard only: +18% splash damage", apply: hero => hero.runSplashDamageMultiplier = (hero.runSplashDamageMultiplier || 0) + 0.18 },
  { classId: "wizard", name: "Inferno Thesis", rarity: "Legendary", text: "Wizard only: +8 burn damage per second and burning enemies take +25% damage", apply: hero => { hero.runBurnDamage = (hero.runBurnDamage || 0) + 8; hero.runBurningEnemyDamage = (hero.runBurningEnemyDamage || 0) + 0.25; } },

  { requiresAbility: "wizard_curse", name: "Cruel Hex", rarity: "Rare", text: "Curse lasts +1.5s and cursed enemies take an extra +6% damage.", apply: hero => { hero.runCurseDuration = (hero.runCurseDuration || 0) + 1.5; hero.runCurseDamageTaken = (hero.runCurseDamageTaken || 0) + 0.06; } },
  { requiresAbility: "wizard_iceball", name: "Packed Ice", rarity: "Rare", text: "Iceball deals +20% damage and lasts +1s longer.", apply: hero => { hero.runIceballDamage = (hero.runIceballDamage || 0) + 0.2; hero.runIceballDuration = (hero.runIceballDuration || 0) + 1; } },
  { requiresAbility: "wizard_lightning", name: "Forked Storm", rarity: "Epic", text: "Lightning reaches one more enemy.", apply: hero => hero.runLightningTargets = (hero.runLightningTargets || 0) + 1 },
  { requiresAbility: "rogue_poison", name: "Toxic Reservoir", rarity: "Rare", text: "Poison special deals +6 damage per second.", apply: hero => hero.runPoisonAbilityDamage = (hero.runPoisonAbilityDamage || 0) + 6 },
  { requiresAbility: "rogue_bleed", name: "Barbed Trap", rarity: "Rare", text: "Trap slow increases from 28% to 36%.", apply: hero => hero.runTrapSlow = (hero.runTrapSlow || 0) + 0.08 },
  { requiresAbility: "rogue_burn", name: "Pitch Powder", rarity: "Rare", text: "Burn special lasts +1.5s longer.", apply: hero => hero.runBurnAbilityDuration = (hero.runBurnAbilityDuration || 0) + 1.5 },
  { requiresAbility: "knight_heavy_attack", name: "Crushing Windup", rarity: "Rare", text: "Heavy Attack deals +35% damage.", apply: hero => hero.runHeavyAttackDamage = (hero.runHeavyAttackDamage || 0) + 0.35 },
  { requiresAbility: "knight_holy_sword", name: "Long Benediction", rarity: "Epic", text: "Holy Sword lasts +1.5s longer.", apply: hero => hero.runHolySwordDuration = (hero.runHolySwordDuration || 0) + 1.5 },
  { requiresAbility: "knight_holy_shield", name: "Consecrated Guard", rarity: "Rare", text: "Holy Shield grants +8% max HP as extra shield.", apply: hero => hero.runHolyShieldPower = (hero.runHolyShieldPower || 0) + 0.08 },

  { classId: "wizard", requiresNode: "wizard_curse_unlock", abilityId: "wizard_curse", name: "Forbidden Curse", rarity: "Mythic", text: "Unlock Curse: 2.5s cooldown, 4s duration, cursed enemy takes +22% damage", apply: hero => grantRunAbility(hero, "wizard_curse") },
  { classId: "wizard", requiresNode: "wizard_iceball_unlock", abilityId: "wizard_iceball", name: "Frozen Orb", rarity: "Mythic", text: "Unlock Iceball: 2.5s cooldown, 75% damage, 38% slow for 3.5s", apply: hero => grantRunAbility(hero, "wizard_iceball") },
  { classId: "wizard", requiresNode: "wizard_lightning_unlock", abilityId: "wizard_lightning", name: "Storm Sigil", rarity: "Mythic", text: "Unlock Lightning: 2s cooldown, hits 3 enemies for 90%/75%/60% damage", apply: hero => grantRunAbility(hero, "wizard_lightning") },
  { classId: "rogue", requiresNode: "rogue_poison_unlock", abilityId: "rogue_poison", name: "Poison Vials", rarity: "Mythic", text: "Unlock Poison: 2.8s cooldown, 4.5s duration, 9 + 0.75 per stage DPS", apply: hero => grantRunAbility(hero, "rogue_poison") },
  { classId: "rogue", requiresNode: "rogue_bleed_unlock", abilityId: "rogue_bleed", name: "Snare Kit", rarity: "Mythic", text: "Unlock Trap: 2.5s cooldown, slows all enemies by 28% for 4s and makes Rogue deal +8% damage to slowed enemies", apply: hero => grantRunAbility(hero, "rogue_bleed") },
  { classId: "rogue", requiresNode: "rogue_burn_unlock", abilityId: "rogue_burn", name: "Fire Powder", rarity: "Mythic", text: "Unlock Burn: 2.2s cooldown, 3.5s duration, 7 + 0.55 per stage DPS", apply: hero => grantRunAbility(hero, "rogue_burn") },
  { classId: "knight", requiresNode: "knight_heavy_attack_unlock", abilityId: "knight_heavy_attack", name: "Weighted Pommel", rarity: "Mythic", text: "Unlock Heavy Attack: 3s cooldown, strikes one enemy for 225% damage", apply: hero => grantRunAbility(hero, "knight_heavy_attack") },
  { classId: "knight", requiresNode: "knight_holy_sword_unlock", abilityId: "knight_holy_sword", name: "Blessed Oil", rarity: "Mythic", text: "Unlock Holy Sword: 5s cooldown, attacks add 32% damage for 4.5s", apply: hero => grantRunAbility(hero, "knight_holy_sword") },
  { classId: "knight", requiresNode: "knight_holy_shield_unlock", abilityId: "knight_holy_shield", name: "Sunlit Bulwark", rarity: "Mythic", text: "Unlock Holy Shield: 5s cooldown, grants 32 shield plus 12% max HP", apply: hero => grantRunAbility(hero, "knight_holy_shield") }
];

const SHOP_ITEMS = [
  { name: "Mercenary's Whetstone", rarity: "Common", text: "+15% hero damage", cost: 40, apply: hero => hero.damage *= 1.15 },
  { name: "Swiftsteel Charm", rarity: "Common", text: "+15% attack speed", cost: 40, apply: hero => hero.attackSpeed *= 1.15 },
  { name: "Apothecary Flask", rarity: "Common", text: "+15% max HP", cost: 40, apply: hero => multiplyMaxHp(hero, 1.15, false) },
  { name: "Tempered Plates", rarity: "Common", text: "+25% armor", cost: 50, apply: hero => multiplyArmor(hero, 1.25) },
  { name: "Keen-Eye Talisman", rarity: "Rare", text: "+15% crit chance", cost: 50, apply: hero => hero.crit += 0.1 },
  { name: "Knight's Ration", rarity: "Common", text: "+6% max HP and +10 gold", cost: 35, apply: hero => { multiplyMaxHp(hero, 1.06, false); run.gold += 10; } },
  { name: "Duelist's Oil", rarity: "Rare", text: "+10% damage and +5% crit chance", cost: 60, apply: hero => { hero.damage *= 1.1; hero.crit += 0.05; } },
  { name: "Loaded Dice", rarity: "Rare", text: "+4 Luck", cost: 55, apply: hero => hero.luck = (hero.luck || 0) + 4 },
  { requiresNode: "unlock_merchants", name: "Black Market Contract", rarity: "Rare", text: "+20% damage and +40 gold", cost: 80, apply: hero => { hero.damage *= 1.2; run.gold += 40; } },
  { requiresNode: "unlock_merchants", name: "Relic Broker's Map", rarity: "Epic", text: "+6 Luck and +12% Essence earned", cost: 105, apply: hero => { hero.luck = (hero.luck || 0) + 6; hero.runEssenceMultiplier = (hero.runEssenceMultiplier || 0) + 0.12; } },
  { name: "Spiked Greaves", rarity: "Rare", text: "+15% armor and +12% attack speed", cost: 65, apply: hero => { multiplyArmor(hero, 1.15); hero.attackSpeed *= 1.12; } },
  { name: "Bloodletter Kit", rarity: "Epic", text: "+20% damage and +10% crit chance, -10% max HP", cost: 90, apply: hero => { hero.damage *= 1.2; hero.crit += 0.1; multiplyMaxHp(hero, 0.9, false); } },
  { name: "Crown Insurance", rarity: "Epic", text: "+22% max HP and +2 HP regen", cost: 95, apply: hero => { multiplyMaxHp(hero, 1.22, false); hero.regen = (hero.regen || 0) + 2; } },
  { name: "Merchant's Star Chart", rarity: "Epic", text: "+4 Luck and +12% max HP", cost: 85, apply: hero => { hero.luck = (hero.luck || 0) + 4; multiplyMaxHp(hero, 1.12, false); } },
  { name: "Royal Armament", rarity: "Legendary", text: "A masterwork from the king's vault: +25% damage, +35% armor, +8% crit chance", cost: 130, apply: hero => { hero.damage *= 1.25; multiplyArmor(hero, 1.35); hero.crit += 0.08; } },
  { name: "Fatebound Crown", rarity: "Legendary", text: "A crown that bends chance: +7 Luck and +25% attack speed", cost: 120, apply: hero => { hero.luck = (hero.luck || 0) + 7; hero.attackSpeed *= 1.25; } }
];

const RELICS = [
  { id: "wolf_fang", name: "Wolf Fang", description: "+10% damage.", rarity: "Common", icon: "WF", effect: { type: "stat", stat: "damageMultiplier", value: 0.1 } },
  { id: "plain_whetstone", name: "Plain Whetstone", description: "+12% damage.", rarity: "Common", icon: "PW", effect: { type: "stat", stat: "damageMultiplier", value: 0.12 } },
  { id: "traveler_brooch", name: "Traveler Brooch", description: "+10% max HP.", rarity: "Common", icon: "TB", effect: { type: "stat", stat: "maxHpMultiplier", value: 0.1 } },
  { id: "quick_clasp", name: "Quick Clasp", description: "+10% attack speed.", rarity: "Common", icon: "QC", effect: { type: "stat", stat: "attackSpeedMultiplier", value: 0.1 } },
  { id: "iron_crown", name: "Iron Crown", description: "+15% armor.", rarity: "Common", icon: "IC", effect: { type: "stat", stat: "armorMultiplier", value: 0.15 } },
  { id: "blood_chalice", name: "Blood Chalice", description: "+3 HP regen while in battle.", rarity: "Rare", icon: "BC", effect: { type: "stat", stat: "regen", value: 3 } },
  { id: "duelist_charm", name: "Duelist Charm", description: "+20% damage.", rarity: "Rare", icon: "DC", effect: { type: "stat", stat: "damageMultiplier", value: 0.2 } },
  { id: "lion_cloak", name: "Lion Cloak", description: "+18% max HP.", rarity: "Rare", icon: "LC", effect: { type: "stat", stat: "maxHpMultiplier", value: 0.18 } },
  { id: "silver_gear", name: "Silver Gear", description: "+18% attack speed.", rarity: "Rare", icon: "SG", effect: { type: "stat", stat: "attackSpeedMultiplier", value: 0.18 } },
  { id: "ember_ring", name: "Ember Ring", description: "Critical hits deal +50% damage.", rarity: "Rare", icon: "ER", effect: { type: "critBonus", value: 0.5 } },
  { id: "war_drum", name: "War Drum", description: "+10% attack speed.", rarity: "Common", icon: "WD", effect: { type: "stat", stat: "attackSpeedMultiplier", value: 0.1 } },
  { id: "old_coin", name: "Old Coin", description: "Gain +15 gold after each battle.", rarity: "Common", icon: "OC", effect: { type: "afterBattleGold", value: 15 } },
  { id: "clover_pin", name: "Clover Pin", description: "+2 Luck.", rarity: "Common", icon: "CP", effect: { type: "stat", stat: "luck", value: 2 } },
  { id: "glass_dagger", name: "Glass Dagger", description: "+25% damage, -10% max HP.", rarity: "Rare", icon: "GD", effect: { type: "glassDagger", damageMultiplier: 0.25, maxHpMultiplier: -0.1 } },
  { id: "guardian_seal", name: "Guardian Seal", description: "First enemy hit each battle deals 30% less damage.", rarity: "Rare", icon: "GS", effect: { type: "firstHitReduction", value: 0.3 } },
  { id: "red_crown_splinter", requiresNode: "unlock_relics", name: "Red Crown Splinter", description: "Bosses take 18% more damage.", rarity: "Epic", icon: "RC", effect: { type: "eliteBossDamage", value: 0.18 } },
  { id: "merchant_seal", requiresNode: "unlock_relics", name: "Merchant Seal", description: "Gain +30 gold after each battle.", rarity: "Rare", icon: "MS", effect: { type: "afterBattleGold", value: 30 } },
  { id: "dawn_banner", requiresNode: "unlock_relics", name: "Dawn Banner", description: "Start each battle with +35 shield.", rarity: "Epic", icon: "DB", effect: { type: "stat", stat: "blockChance", value: 0, battleStartShield: 35 } },
  { id: "scholars_rune", name: "Scholar's Rune", description: "+10% Essence earned.", rarity: "Rare", icon: "SR", effect: { type: "essenceMultiplier", value: 0.1 } },
  { id: "oracle_lens", name: "Oracle Lens", description: "+4 Luck and +5% crit chance.", rarity: "Rare", icon: "OL", effect: { type: "stat", stat: "luck", value: 4, critChance: 0.05 } },
  { id: "hunters_mark", name: "Hunter's Mark", description: "Deal +12% damage to elites and bosses.", rarity: "Epic", icon: "HM", effect: { type: "eliteBossDamage", value: 0.12 } },
  { id: "executioners_file", name: "Executioner's File", description: "+32% damage.", rarity: "Epic", icon: "EF", effect: { type: "stat", stat: "damageMultiplier", value: 0.32 } },
  { id: "giant_knot", name: "Giant Knot", description: "+30% max HP.", rarity: "Epic", icon: "GK", effect: { type: "stat", stat: "maxHpMultiplier", value: 0.3 } },
  { id: "storm_buckle", name: "Storm Buckle", description: "+28% attack speed.", rarity: "Epic", icon: "SB", effect: { type: "stat", stat: "attackSpeedMultiplier", value: 0.28 } },
  { id: "silver_spur", name: "Silver Spur", description: "+75 gold immediately.", rarity: "Common", icon: "SS", effect: { type: "gold", value: 75 } },
  { id: "sun_amulet", name: "Sun Amulet", description: "+22% max HP.", rarity: "Epic", icon: "SA", effect: { type: "stat", stat: "maxHpMultiplier", value: 0.22 } },
  { id: "fate_deck", name: "Fate Deck", description: "+6 Luck.", rarity: "Epic", icon: "FD", effect: { type: "stat", stat: "luck", value: 6 } },
  { id: "dragon_heart", name: "Dragon Heart", description: "A living ember beats in your chest. +28% max HP and +2 HP regen.", rarity: "Legendary", icon: "DH", effect: { type: "stat", stat: "maxHpMultiplier", value: 0.28, regen: 2 } },
  { id: "sunforged_edge", name: "Sunforged Edge", description: "A royal killing edge. +45% damage.", rarity: "Legendary", icon: "SE", effect: { type: "stat", stat: "damageMultiplier", value: 0.45 } },
  { id: "titan_heart", name: "Titan Heart", description: "A mountain's pulse. +55% max HP.", rarity: "Legendary", icon: "TH", effect: { type: "stat", stat: "maxHpMultiplier", value: 0.55 } },
  { id: "hourglass_chain", name: "Hourglass Chain", description: "The second hand snaps forward. +35% attack speed.", rarity: "Legendary", icon: "HC", effect: { type: "stat", stat: "attackSpeedMultiplier", value: 0.35 } },
  { id: "starforged_blade", name: "Starforged Blade", description: "A weapon bright enough to cut fate. +30% damage.", rarity: "Legendary", icon: "SB", effect: { type: "stat", stat: "damageMultiplier", value: 0.3 } },
  { id: "crown_of_chance", name: "Crown of Chance", description: "The crown smiles on impossible odds. +7 Luck and +8% Essence earned.", rarity: "Legendary", icon: "CC", effect: { type: "stat", stat: "luck", value: 7, essenceMultiplier: 0.08 } },
  { id: "phoenix_ember", name: "Phoenix Ember", description: "A reborn flame drives your strikes. +20% attack speed and +7% crit chance.", rarity: "Legendary", icon: "PE", effect: { type: "stat", stat: "attackSpeedMultiplier", value: 0.2, critChance: 0.07 } },
  { id: "blood_grail", name: "Blood Grail", description: "+5% life steal.", rarity: "Epic", icon: "BG", effect: { type: "stat", stat: "lifeSteal", value: 0.05 } },
  { id: "tower_shield", classId: "knight", name: "Tower Shield", description: "+8% block chance.", rarity: "Rare", icon: "TS", effect: { type: "stat", stat: "blockChance", value: 0.08 } },
  { id: "oathguard_emblem", classId: "knight", name: "Oathguard Emblem", description: "+12% block chance and +8% max HP.", rarity: "Epic", icon: "OE", effect: { type: "stat", stat: "blockChance", value: 0.12, maxHpMultiplier: 0.08 } },
  { id: "kingwall_sigil", classId: "knight", name: "Kingwall Sigil", description: "A royal ward for standing firm. +16% block chance.", rarity: "Legendary", icon: "KS", effect: { type: "stat", stat: "blockChance", value: 0.16 } },
  { id: "storm_capacitor", name: "Storm Capacitor", description: "Lightning special deals +20% damage.", rarity: "Epic", icon: "SC", requiresAbility: "wizard_lightning", effect: { type: "abilityStat", stat: "runLightningDamage", value: 0.2 } },
  { id: "frost_core", name: "Frost Core", description: "Iceball special slows enemies by an extra 8%.", rarity: "Rare", icon: "FC", requiresAbility: "wizard_iceball", effect: { type: "abilityStat", stat: "runIceballSlow", value: 0.08 } },
  { id: "trapwire_spool", name: "Trapwire Spool", description: "Trap special lasts +1.5s longer.", rarity: "Rare", icon: "TS", requiresAbility: "rogue_bleed", effect: { type: "abilityStat", stat: "runTrapDuration", value: 1.5 } },
  { id: "holy_reliquary", name: "Holy Reliquary", description: "Holy Sword and Holy Shield cooldowns are 12% shorter.", rarity: "Epic", icon: "HR", requiresAnyAbility: ["knight_holy_sword", "knight_holy_shield"], effect: { type: "abilityStat", stat: "runHolyCooldownReduction", value: 0.12 } },
  { id: "campaign_heart", name: "Campaign Heart", description: "Gain +3% max HP after each stage defeated.", rarity: "Legendary", icon: "CH", effect: { type: "stageGrowth", stat: "maxHpMultiplier", value: 0.03 } },
  { id: "campaign_blade", name: "Campaign Blade", description: "Gain +3% damage after each stage defeated.", rarity: "Legendary", icon: "CB", effect: { type: "stageGrowth", stat: "damageMultiplier", value: 0.03 } },
  { id: "campaign_spurs", name: "Campaign Spurs", description: "Gain +2% attack speed after each stage defeated.", rarity: "Legendary", icon: "CS", effect: { type: "stageGrowth", stat: "attackSpeedMultiplier", value: 0.02 } },
  { id: "campaign_plate", name: "Campaign Plate", description: "Gain +3% armor after each stage defeated.", rarity: "Legendary", icon: "CP", effect: { type: "stageGrowth", stat: "armorMultiplier", value: 0.03 } },
  { id: "moonlit_armor", name: "Moonlit Armor", description: "+65% armor and +14% max HP.", rarity: "Epic", icon: "MA", effect: { type: "stat", stat: "armorMultiplier", value: 0.65, maxHpMultiplier: 0.14 } }
];

const CLASS_TALENT_STAGES = [3, 6, 9];

const CLASS_TALENTS = {
  knight: [
    { id: "knight_shield_wall", classId: "knight", name: "Shield Wall", description: "Gain a 30 HP shield at the start of each battle.", icon: "SW", tier: 1, effect: { type: "battleStartShield", value: 30 } },
    { id: "knight_retaliation", classId: "knight", name: "Retaliation", description: "When blocking, deal 35% of blocked damage back.", icon: "RT", tier: 1, effect: { type: "retaliateBlock", value: 0.35 } },
    { id: "knight_heavy_armor", classId: "knight", name: "Heavy Armor", description: "+45% armor, -10% attack speed.", icon: "HA", tier: 2, effect: { type: "stat", armorMultiplier: 0.45, attackSpeedMultiplier: -0.1 } },
    { id: "knight_royal_guard", classId: "knight", name: "Royal Guard", description: "+20% armor.", icon: "RG", tier: 2, effect: { armorMultiplier: 0.2 } },
    { id: "knight_unshaken", classId: "knight", name: "Unshaken", description: "+25% armor and +1 HP regen.", icon: "US", tier: 3, effect: { type: "stat", armorMultiplier: 0.25, regen: 1 } },
    { id: "knight_last_stand", classId: "knight", name: "Last Stand", description: "Deal 30% more damage while below 35% HP.", icon: "LS", tier: 3, effect: { type: "lowHpDamage", threshold: 0.35, value: 0.3 } }
  ],
  rogue: [
    { id: "rogue_deep_cuts", classId: "rogue", name: "Deep Cuts", description: "Rogue bleed deals +6 damage per second.", icon: "DC", tier: 1, effect: { type: "bleedDamage", value: 6 } },
    { id: "rogue_venom_blade", classId: "rogue", name: "Venom Blade", description: "Attacks have a 22% chance to poison for 4 seconds. Poison scales with stage.", icon: "VB", tier: 1, effect: { type: "poisonChance", chance: 0.22, damage: 4, duration: 4 } },
    { id: "rogue_backstab", classId: "rogue", name: "Shadow Backstab", description: "Critical hits deal 35% more damage.", icon: "SB", tier: 2, effect: { type: "critDamage", value: 0.35 } },
    { id: "rogue_evasion", classId: "rogue", name: "Evasion", description: "Gain a 14% chance to avoid enemy attacks.", icon: "EV", tier: 2, effect: { type: "evasion", chance: 0.14 } },
    { id: "rogue_momentum", classId: "rogue", name: "Momentum", description: "Gain 6% attack speed after kills, up to 30% per battle.", icon: "MO", tier: 3, effect: { type: "killAttackSpeed", value: 0.06, max: 0.3 } },
    { id: "rogue_executioner", classId: "rogue", name: "Executioner", description: "Deal 30% more damage to enemies below 35% HP.", icon: "EX", tier: 3, effect: { type: "executeDamage", threshold: 0.35, value: 0.3 } }
  ],
  wizard: [
    { id: "wizard_wildfire_spark", classId: "wizard", name: "Wildfire Spark", description: "Attacks gain +10% burn chance. Burn has a 35% chance to spread to another enemy.", icon: "WS", tier: 1, effect: { type: "burnSpread", chance: 0.35, igniteChance: 0.1 } },
    { id: "wizard_arcane_ward", classId: "wizard", name: "Arcane Ward", description: "Gain an 8 HP shield when splash magic triggers.", icon: "AW", tier: 1, effect: { type: "splashShield", value: 8 } },
    { id: "wizard_frostbite_hex", classId: "wizard", name: "Frostbite Hex", description: "Attacks have an 18% chance to slow enemy attacks by 24% for 3s.", icon: "FH", tier: 2, effect: { type: "slowChance", chance: 0.18, value: 0.24, duration: 3 } },
    { id: "wizard_mana_surge", classId: "wizard", name: "Mana Surge", description: "Every third attack deals +40% damage.", icon: "MS", tier: 2, effect: { type: "thirdAttackBonus", value: 0.4 } },
    { id: "wizard_runic_focus", classId: "wizard", name: "Runic Focus", description: "+20% damage, -10% max HP.", icon: "RF", tier: 3, effect: { type: "stat", damageMultiplier: 0.2, maxHpMultiplier: -0.1 } },
    { id: "wizard_meteor_spark", classId: "wizard", name: "Meteor Spark", description: "Attacks have a 30% chance to hit all enemies for 45% damage.", icon: "MT", tier: 3, effect: { type: "meteorChance", chance: 0.3, damageMultiplier: 0.45 } }
  ]
};

const TREE_CANVAS = { width: 3200, height: 2660 };

const TREE_NODES = [
  { id: "crown_legacy", classId: "global", branch: "Crown", name: "Crown Legacy", description: "Unlocks class upgrade branches. +5 starting HP and +1 starting damage to all classes.", cost: 25, maxLevel: 1, effect: { maxHp: 5, damage: 1 }, x: 1300, y: 1050, prerequisites: [], type: "center" },

  { id: "endurance", classId: "global", branch: "Crown", name: "Veteran Blood", description: "+5 starting HP per level for all classes.", cost: 35, maxLevel: 6, effect: { maxHp: 5 }, x: 1120, y: 900, prerequisites: ["crown_legacy"], type: "stat" },
  { id: "might", classId: "global", branch: "Crown", name: "Sharpened Instincts", description: "+2 starting damage per level for all classes.", cost: 35, maxLevel: 6, effect: { damage: 2 }, x: 1480, y: 900, prerequisites: ["crown_legacy"], type: "stat" },
  { id: "haste", classId: "global", branch: "Crown", name: "Battle Tempo", description: "+0.04 attack speed per level for all classes.", cost: 45, maxLevel: 5, effect: { attackSpeed: 0.04 }, x: 1020, y: 760, prerequisites: ["endurance"], type: "stat" },
  { id: "fortune", classId: "global", branch: "Crown", name: "Royal Fortune", description: "+10 starting gold per level for all classes.", cost: 45, maxLevel: 5, effect: { startingGold: 10 }, x: 1580, y: 760, prerequisites: ["might"], type: "stat" },
  { id: "lucky_omens", classId: "global", branch: "Crown", name: "Lucky Omens", description: "+1 Luck per level for all classes. Luck improves reward, relic, and shop rolls.", cost: 50, maxLevel: 5, effect: { luck: 1 }, x: 1640, y: 610, prerequisites: ["fortune"], type: "stat" },
  { id: "armor", classId: "global", branch: "Crown", name: "Royal Armory", description: "+1 starting armor per level for all classes.", cost: 50, maxLevel: 5, effect: { armor: 1 }, x: 760, y: 620, prerequisites: ["endurance"], type: "stat" },
  { id: "essence", classId: "global", branch: "Crown", name: "Essence Mastery", description: "+4% Essence earned per level.", cost: 75, maxLevel: 5, effect: { essenceMultiplier: 0.04 }, x: 980, y: 610, prerequisites: ["haste"], type: "notable" },
  { id: "crown_purse", classId: "global", branch: "Crown", name: "Crown Purse", description: "+8 starting gold per level for all classes.", cost: 55, maxLevel: 4, effect: { startingGold: 8 }, x: 1840, y: 620, prerequisites: ["fortune"], type: "stat" },
  { id: "field_drills", classId: "global", branch: "Crown", name: "Field Drills", description: "+1 starting damage and +0.02 attack speed per level.", cost: 65, maxLevel: 5, effect: { damage: 1, attackSpeed: 0.02 }, x: 1300, y: 840, prerequisites: ["crown_legacy"], type: "stat" },
  { id: "royal_tithe", classId: "global", branch: "Crown", name: "Royal Tithe", description: "+2% Essence earned, +5 starting gold, and +1 Luck per level.", cost: 90, maxLevel: 4, effect: { essenceMultiplier: 0.02, startingGold: 5, luck: 1 }, x: 2020, y: 500, prerequisites: ["crown_purse"], type: "notable" },
  { id: "old_campaigns", classId: "global", branch: "Crown", name: "Old Campaigns", description: "+18 starting HP and +1 armor per level.", cost: 90, maxLevel: 4, effect: { maxHp: 18, armor: 1 }, x: 580, y: 500, prerequisites: ["armor"], type: "notable" },
  { id: "duelist_lessons", classId: "global", branch: "Crown", name: "Duelist Lessons", description: "+2% crit chance per level for all classes.", cost: 95, maxLevel: 5, effect: { critChance: 0.02 }, x: 1440, y: 670, prerequisites: ["field_drills"], type: "stat" },
  { id: "life_siphon", classId: "global", branch: "Crown", name: "Life Siphon", description: "+1% life steal per level for all classes.", cost: 90, maxLevel: 5, effect: { lifeSteal: 0.01 }, x: 1300, y: 540, prerequisites: ["field_drills"], type: "stat" },
  { id: "marching_songs", classId: "global", branch: "Crown", name: "Marching Songs", description: "+0.03 attack speed per level for all classes.", cost: 95, maxLevel: 5, effect: { attackSpeed: 0.03 }, x: 1220, y: 670, prerequisites: ["field_drills"], type: "stat" },
  { id: "veteran_bounty", classId: "global", branch: "Crown", name: "Veteran Bounty", description: "Elite fights grant +4% gold and Essence per level.", cost: 130, maxLevel: 3, effect: { eliteRewardMultiplier: 0.04 }, x: 2180, y: 360, prerequisites: ["royal_tithe"], type: "notable" },
  { id: "castle_stores", classId: "global", branch: "Crown", name: "Castle Stores", description: "+25 starting HP and +8 starting gold per level.", cost: 130, maxLevel: 3, effect: { maxHp: 25, startingGold: 8 }, x: 420, y: 360, prerequisites: ["old_campaigns"], type: "notable" },
  { id: "crown_doctrine", classId: "global", branch: "Crown", name: "Crown Doctrine", description: "A costly general mastery node for all classes: +3 damage, +35 HP, and +2% Essence earned.", cost: 240, maxLevel: 2, effect: { damage: 3, maxHp: 35, essenceMultiplier: 0.02 }, x: 980, y: 430, prerequisites: ["essence"], type: "capstone" },
  { id: "royal_mender", classId: "global", branch: "Crown", name: "Royal Mender", description: "+1 HP regen while in battle per level.", cost: 150, maxLevel: 5, effect: { regen: 1 }, x: 300, y: 220, prerequisites: ["castle_stores"], type: "notable" },
  { id: "battle_trance", classId: "global", branch: "Crown", name: "Battle Trance", description: "+3 damage and +0.05 attack speed per level.", cost: 155, maxLevel: 3, effect: { damage: 3, attackSpeed: 0.05 }, x: 2300, y: 220, prerequisites: ["veteran_bounty"], type: "notable" },
  { id: "ancient_charter", classId: "global", branch: "Crown", name: "Ancient Charter", description: "+5% Essence earned per level.", cost: 50, maxLevel: 5, effect: { essenceMultiplier: 0.05 }, x: 820, y: 270, prerequisites: ["crown_doctrine"], type: "capstone" },
  { id: "unlock_relics", classId: "global", branch: "Unlocks", name: "Sealed Reliquary", description: "Unlocks new relics in future runs.", cost: 180, maxLevel: 1, effect: {}, x: 560, y: 160, prerequisites: ["royal_mender"], type: "unlock" },
  { id: "unlock_events", classId: "global", branch: "Unlocks", name: "Hidden Roads", description: "Unlocks treasure route events on the map.", cost: 160, maxLevel: 1, effect: {}, x: 1040, y: 160, prerequisites: ["ancient_charter"], type: "unlock" },
  { id: "unlock_merchants", classId: "global", branch: "Unlocks", name: "Black Market", description: "Unlocks additional merchant stock in shops.", cost: 170, maxLevel: 1, effect: {}, x: 2180, y: 80, prerequisites: ["battle_trance"], type: "unlock" },
  { id: "unlock_enemies", classId: "global", branch: "Unlocks", name: "Wanted Posters", description: "Unlocks dangerous new enemies that can drop higher rewards.", cost: 150, maxLevel: 1, effect: {}, x: 2480, y: 260, prerequisites: ["battle_trance"], type: "unlock" },
  { id: "unlock_starting_bonuses", classId: "global", branch: "Unlocks", name: "Campaign Kit", description: "Unlocks starting bonus rewards and grants +10 battle-start shield.", cost: 155, maxLevel: 1, effect: { battleStartShield: 10 }, x: 300, y: 80, prerequisites: ["royal_mender"], type: "unlock" },
  { id: "unlock_harder_difficulty", classId: "global", branch: "Unlocks", name: "Crownfall Writ", description: "Unlocks the Crownfall Keep difficulty.", cost: 220, maxLevel: 1, effect: {}, x: 1300, y: 180, prerequisites: ["ancient_charter"], type: "unlock" },

  { id: "knight_root", classId: "knight", branch: "Knight", name: "Knight Branch", description: "Unlocks Knight upgrades. +10 starting HP and +1 armor.", cost: 50, maxLevel: 1, effect: { maxHp: 10, armor: 1 }, x: 980, y: 1050, prerequisites: ["crown_legacy"], type: "class" },
  { id: "wizard_root", classId: "wizard", branch: "Wizard", name: "Wizard Branch", description: "Unlocks Wizard upgrades. +2 starting damage and +15 starting HP.", cost: 50, maxLevel: 1, effect: { damage: 2, maxHp: 15 }, x: 1620, y: 1050, prerequisites: ["crown_legacy"], type: "class" },
  { id: "rogue_root", classId: "rogue", branch: "Rogue", name: "Rogue Branch", description: "Unlocks Rogue upgrades. +1 starting damage and +0.03 attack speed.", cost: 50, maxLevel: 1, effect: { damage: 1, attackSpeed: 0.03 }, x: 1300, y: 1320, prerequisites: ["crown_legacy"], type: "class" },

  { id: "knight_plate", classId: "knight", branch: "Armor", name: "Plate Training", description: "+2 starting armor per level.", cost: 55, maxLevel: 4, effect: { armor: 2 }, x: 780, y: 780, prerequisites: ["knight_root"], type: "stat" },
  { id: "knight_vigor", classId: "knight", branch: "Armor", name: "Oathbound Vigor", description: "+14 starting HP per level.", cost: 70, maxLevel: 4, effect: { maxHp: 14 }, x: 580, y: 720, prerequisites: ["knight_plate"], type: "stat" },
  { id: "knight_iron_will", classId: "knight", branch: "Armor", name: "Iron Will", description: "+1 armor and +1 HP regen per level.", cost: 120, maxLevel: 3, effect: { armor: 1, regen: 1 }, x: 380, y: 660, prerequisites: ["knight_vigor"], type: "notable" },
  { id: "knight_iron_bastion", classId: "knight", branch: "Armor", name: "Iron Bastion", description: "Capstone: +6 armor, +60 starting HP, and +3 HP regen.", cost: 285, maxLevel: 1, effect: { armor: 6, maxHp: 60, regen: 3 }, x: 180, y: 600, prerequisites: ["knight_iron_will"], type: "capstone" },

  { id: "knight_bulwark", classId: "knight", branch: "Shield", name: "Bulwark", description: "+14 battle-start shield per level.", cost: 60, maxLevel: 4, effect: { battleStartShield: 14 }, x: 760, y: 960, prerequisites: ["knight_root"], type: "stat" },
  { id: "knight_guard", classId: "knight", branch: "Shield", name: "Shield Guard", description: "+10 battle-start shield and blocked damage retaliates for +8% per level.", cost: 105, maxLevel: 3, effect: { battleStartShield: 10, retaliateBlock: 0.08 }, x: 560, y: 960, prerequisites: ["knight_bulwark"], type: "notable" },
  { id: "knight_sanctuary", classId: "knight", branch: "Shield", name: "Sanctuary Aegis", description: "+18 battle-start shield per level.", cost: 150, maxLevel: 3, effect: { battleStartShield: 18 }, x: 360, y: 960, prerequisites: ["knight_guard"], type: "notable" },
  { id: "knight_aegis_eternal", classId: "knight", branch: "Shield", name: "Eternal Aegis", description: "Capstone: +85 battle-start shield and +3 armor.", cost: 285, maxLevel: 1, effect: { battleStartShield: 85, armor: 3 }, x: 160, y: 960, prerequisites: ["knight_sanctuary"], type: "capstone" },

  { id: "knight_counter", classId: "knight", branch: "Retaliation", name: "Counter Stance", description: "+6% chance to retaliate when hit per level. Retaliation deals 18% damage.", cost: 55, maxLevel: 3, effect: { hitRetaliateChance: 0.06, hitRetaliateDamage: 0.18 }, x: 760, y: 1140, prerequisites: ["knight_root"], type: "stat" },
  { id: "knight_unbroken", classId: "knight", branch: "Retaliation", name: "Unbroken", description: "+8% damage while below 40% HP per level.", cost: 120, maxLevel: 3, effect: { lowHpDamage: 0.08 }, x: 560, y: 1140, prerequisites: ["knight_counter"], type: "notable" },
  { id: "knight_spiked_guard", classId: "knight", branch: "Retaliation", name: "Spiked Guard", description: "Blocked damage retaliates for +15% per level.", cost: 150, maxLevel: 3, effect: { retaliateBlock: 0.15 }, x: 360, y: 1140, prerequisites: ["knight_unbroken"], type: "notable" },
  { id: "knight_retribution", classId: "knight", branch: "Retaliation", name: "King's Retribution", description: "Capstone: blocks retaliate for +75%; +8% hit retaliation chance; hit retaliation deals 35% damage.", cost: 300, maxLevel: 1, effect: { retaliateBlock: 0.75, hitRetaliateChance: 0.08, hitRetaliateDamage: 0.35 }, x: 160, y: 1140, prerequisites: ["knight_spiked_guard"], type: "capstone" },

  { id: "knight_hold_line", classId: "knight", branch: "Crown Guard", name: "Hold the Line", description: "+1 starting armor per level.", cost: 65, maxLevel: 4, effect: { armor: 1 }, x: 780, y: 1320, prerequisites: ["knight_root"], type: "stat" },
  { id: "knight_crown_guard_meta", classId: "knight", branch: "Crown Guard", name: "Crown Guard", description: "+2 starting armor per level.", cost: 115, maxLevel: 3, effect: { armor: 2 }, x: 580, y: 1380, prerequisites: ["knight_hold_line"], type: "notable" },
  { id: "knight_banner", classId: "knight", branch: "Crown Guard", name: "Boss Banner", description: "+8% boss damage and +5% elite rewards per level.", cost: 155, maxLevel: 3, effect: { bossDamage: 0.08, eliteRewardMultiplier: 0.05 }, x: 380, y: 1440, prerequisites: ["knight_crown_guard_meta"], type: "notable" },
  { id: "knight_warlord_oath", classId: "knight", branch: "Crown Guard", name: "Warlord's Oath", description: "Capstone: +35% boss damage and +8 starting armor.", cost: 300, maxLevel: 1, effect: { bossDamage: 0.35, armor: 8 }, x: 180, y: 1500, prerequisites: ["knight_banner"], type: "capstone" },

  { id: "knight_heavy_attack_unlock", classId: "knight", branch: "Ability Unlock", name: "Heavy Attack", description: "Unlocks Heavy Attack: every 3s, strike one enemy for 225% damage.", cost: 500, maxLevel: 1, effect: { unlockRunAbility: "knight_heavy_attack" }, x: 0, y: 880, prerequisites: ["knight_iron_bastion"], type: "ability" },
  { id: "knight_holy_sword_unlock", classId: "knight", branch: "Ability Unlock", name: "Holy Sword", description: "Unlocks Holy Sword: every 5s, attacks add 32% damage for 4.5s.", cost: 500, maxLevel: 1, effect: { unlockRunAbility: "knight_holy_sword" }, x: 0, y: 1050, prerequisites: ["knight_retribution"], type: "ability" },
  { id: "knight_holy_shield_unlock", classId: "knight", branch: "Ability Unlock", name: "Holy Shield", description: "Unlocks Holy Shield: every 5s, gain 32 shield plus 12% max HP.", cost: 500, maxLevel: 1, effect: { unlockRunAbility: "knight_holy_shield" }, x: 0, y: 1230, prerequisites: ["knight_aegis_eternal"], type: "ability" },

  { id: "rogue_serrated", classId: "rogue", branch: "Bleed", name: "Serrated Edge", description: "+3 bleed damage per second per level.", cost: 55, maxLevel: 4, effect: { bleedDamage: 3 }, x: 760, y: 1540, prerequisites: ["rogue_root"], type: "stat" },
  { id: "rogue_open_wounds", classId: "rogue", branch: "Bleed", name: "Open Wounds", description: "+5 bleed damage per second per level.", cost: 100, maxLevel: 3, effect: { bleedDamage: 5 }, x: 760, y: 1680, prerequisites: ["rogue_serrated"], type: "notable" },
  { id: "rogue_blood_scent", classId: "rogue", branch: "Bleed", name: "Blood Scent", description: "Bleeding a new target grants +5% attack speed per level.", cost: 145, maxLevel: 3, effect: { bleedAttackSpeed: 0.05 }, x: 760, y: 1820, prerequisites: ["rogue_open_wounds"], type: "notable" },
  { id: "rogue_crimson_execution", classId: "rogue", branch: "Bleed", name: "Crimson Execution", description: "Capstone: +16 bleed damage per second and +18% execute damage.", cost: 285, maxLevel: 1, effect: { executeDamage: 0.18, bleedDamage: 16 }, x: 760, y: 2020, prerequisites: ["rogue_blood_scent"], type: "capstone" },

  { id: "rogue_precision", classId: "rogue", branch: "Critical", name: "Keen Eye", description: "+3% crit chance per level.", cost: 60, maxLevel: 4, effect: { critChance: 0.03 }, x: 1120, y: 1540, prerequisites: ["rogue_root"], type: "stat" },
  { id: "rogue_backstab_meta", classId: "rogue", branch: "Critical", name: "Backstab", description: "Critical hits deal +12% damage per level.", cost: 105, maxLevel: 3, effect: { critDamage: 0.12 }, x: 1120, y: 1680, prerequisites: ["rogue_precision"], type: "notable" },
  { id: "rogue_deadly_rhythm", classId: "rogue", branch: "Critical", name: "Deadly Rhythm", description: "Critical hits grant +4% attack speed per level.", cost: 145, maxLevel: 3, effect: { critAttackSpeedBonus: 0.04 }, x: 1120, y: 1820, prerequisites: ["rogue_backstab_meta"], type: "notable" },
  { id: "rogue_perfect_strike", classId: "rogue", branch: "Critical", name: "Perfect Strike", description: "Capstone: crit chance above 100% can become mega crit chance. Mega crit adds +200% crit damage.", cost: 285, maxLevel: 1, effect: { megaCritFromOvercap: 1, megaCritDamage: 2 }, x: 1120, y: 2020, prerequisites: ["rogue_deadly_rhythm"], type: "capstone" },

  { id: "rogue_reflex", classId: "rogue", branch: "Evasion", name: "Light Footwork", description: "+0.04 attack speed and +2% evasion per level.", cost: 60, maxLevel: 4, effect: { attackSpeed: 0.04, evasion: 0.02 }, x: 1480, y: 1540, prerequisites: ["rogue_root"], type: "stat" },
  { id: "rogue_smoke_step", classId: "rogue", branch: "Evasion", name: "Smoke Step", description: "+18% chance per level to avoid the first hit each battle.", cost: 115, maxLevel: 3, effect: { firstHitAvoidChance: 0.18 }, x: 1480, y: 1680, prerequisites: ["rogue_reflex"], type: "notable" },
  { id: "rogue_opportunist", classId: "rogue", branch: "Evasion", name: "Opportunist", description: "Dodging grants +8% battle damage per level, up to +40%.", cost: 150, maxLevel: 3, effect: { dodgeDamageBonus: 0.08 }, x: 1480, y: 1820, prerequisites: ["rogue_smoke_step"], type: "notable" },
  { id: "rogue_ghostblade", classId: "rogue", branch: "Evasion", name: "Ghostblade", description: "Capstone: dodging counterattacks for 65% damage.", cost: 285, maxLevel: 1, effect: { dodgeCounter: 0.65 }, x: 1480, y: 2020, prerequisites: ["rogue_opportunist"], type: "capstone" },

  { id: "rogue_mark_weakness", classId: "rogue", branch: "Execute", name: "Mark Weakness", description: "Enemies below 35% HP take +5% damage per level.", cost: 65, maxLevel: 4, effect: { executeDamage: 0.05, executeThreshold: 0.35 }, x: 1840, y: 1540, prerequisites: ["rogue_root"], type: "stat" },
  { id: "rogue_killers_instinct", classId: "rogue", branch: "Execute", name: "Killer's Instinct", description: "+8% execute damage and +1.5% crit chance per level.", cost: 115, maxLevel: 3, effect: { executeDamage: 0.08, critChance: 0.015 }, x: 1840, y: 1680, prerequisites: ["rogue_mark_weakness"], type: "notable" },
  { id: "rogue_finishing_dash", classId: "rogue", branch: "Execute", name: "Finishing Dash", description: "Kills grant +7% attack speed per level, up to +35%.", cost: 155, maxLevel: 3, effect: { killAttackSpeed: 0.07, killAttackSpeedMax: 0.35 }, x: 1840, y: 1820, prerequisites: ["rogue_killers_instinct"], type: "notable" },
  { id: "rogue_death_sentence", classId: "rogue", branch: "Execute", name: "Death Sentence", description: "Capstone: enemies below 40% HP take +38% damage; every 6th attack crits.", cost: 300, maxLevel: 1, effect: { executeDamage: 0.38, executeThreshold: 0.4, guaranteedCritEvery: 6 }, x: 1840, y: 2020, prerequisites: ["rogue_finishing_dash"], type: "capstone" },

  { id: "rogue_poison_unlock", classId: "rogue", branch: "Ability Unlock", name: "Poison", description: "Unlocks Poison: every 2.8s, poison one enemy for 4.5s. Poison deals 9 + 0.75 per stage DPS.", cost: 500, maxLevel: 1, effect: { unlockRunAbility: "rogue_poison" }, x: 1060, y: 2150, prerequisites: ["rogue_crimson_execution"], type: "ability" },
  { id: "rogue_bleed_unlock", classId: "rogue", branch: "Ability Unlock", name: "Trap", description: "Unlocks Trap: every 2.5s, slow all living enemies by 28% for 4s and make Rogue deal +8% damage to slowed enemies.", cost: 500, maxLevel: 1, effect: { unlockRunAbility: "rogue_bleed" }, x: 1300, y: 2150, prerequisites: ["rogue_perfect_strike"], type: "ability" },
  { id: "rogue_burn_unlock", classId: "rogue", branch: "Ability Unlock", name: "Burn", description: "Unlocks Burn: every 2.2s, burn one enemy for 3.5s. Burn deals 7 + 0.55 per stage DPS.", cost: 500, maxLevel: 1, effect: { unlockRunAbility: "rogue_burn" }, x: 1540, y: 2150, prerequisites: ["rogue_ghostblade"], type: "ability" },

  { id: "wizard_ember", classId: "wizard", branch: "Burn", name: "Ember Study", description: "Burn deals +18% damage per level.", cost: 55, maxLevel: 4, effect: { burnDamage: 0.18 }, x: 1800, y: 720, prerequisites: ["wizard_root"], type: "stat" },
  { id: "wizard_wildfire_meta", classId: "wizard", branch: "Burn", name: "Wildfire", description: "Burn spread chance +10% per level.", cost: 105, maxLevel: 3, effect: { burnSpreadChance: 0.1 }, x: 2000, y: 660, prerequisites: ["wizard_ember"], type: "notable" },
  { id: "wizard_scorching_focus", classId: "wizard", branch: "Burn", name: "Scorching Focus", description: "Burning enemies take +8% damage per level.", cost: 145, maxLevel: 3, effect: { burningEnemyDamage: 0.08 }, x: 2200, y: 600, prerequisites: ["wizard_wildfire_meta"], type: "notable" },
  { id: "wizard_inferno_crown", classId: "wizard", branch: "Burn", name: "Inferno Crown", description: "Capstone: first spell burns all enemies and burn deals +45% damage.", cost: 300, maxLevel: 1, effect: { firstSpellBurnAll: 1, burnDamage: 0.45 }, x: 2400, y: 540, prerequisites: ["wizard_scorching_focus"], type: "capstone" },

  { id: "wizard_mana_shield", classId: "wizard", branch: "Arcane Shield", name: "Mana Shield", description: "Splash grants +6 shield per level.", cost: 60, maxLevel: 4, effect: { splashShield: 6 }, x: 1840, y: 960, prerequisites: ["wizard_root"], type: "stat" },
  { id: "wizard_warding_glyph", classId: "wizard", branch: "Arcane Shield", name: "Warding Glyph", description: "+10 battle-start shield per level.", cost: 110, maxLevel: 3, effect: { battleStartShield: 10 }, x: 2040, y: 960, prerequisites: ["wizard_mana_shield"], type: "notable" },
  { id: "wizard_prismatic_shell", classId: "wizard", branch: "Arcane Shield", name: "Prismatic Shell", description: "+1 armor and +4 splash shield per level.", cost: 155, maxLevel: 3, effect: { armor: 1, splashShield: 4 }, x: 2240, y: 960, prerequisites: ["wizard_warding_glyph"], type: "notable" },
  { id: "wizard_archmage_aegis", classId: "wizard", branch: "Arcane Shield", name: "Archmage Aegis", description: "Capstone: +45 battle-start shield, +12 splash shield, and +1 armor.", cost: 300, maxLevel: 1, effect: { battleStartShield: 45, splashShield: 12, armor: 1 }, x: 2440, y: 960, prerequisites: ["wizard_prismatic_shell"], type: "capstone" },

  { id: "wizard_focus", classId: "wizard", branch: "Splash", name: "Arcane Study", description: "+2 starting damage and +5% splash damage per level.", cost: 60, maxLevel: 4, effect: { damage: 2, splashDamageMultiplier: 0.05 }, x: 1840, y: 1140, prerequisites: ["wizard_root"], type: "stat" },
  { id: "wizard_rune_battery", classId: "wizard", branch: "Splash", name: "Rune Battery", description: "Every third attack deals +12% damage per level.", cost: 115, maxLevel: 3, effect: { thirdAttackBonus: 0.12 }, x: 2040, y: 1140, prerequisites: ["wizard_focus"], type: "notable" },
  { id: "wizard_chain_spark", classId: "wizard", branch: "Splash", name: "Chain Spark", description: "Splash deals +8% damage per level.", cost: 155, maxLevel: 3, effect: { splashDamageMultiplier: 0.08 }, x: 2240, y: 1140, prerequisites: ["wizard_rune_battery"], type: "notable" },
  { id: "wizard_archmage_sigil", classId: "wizard", branch: "Splash", name: "Archmage Sigil", description: "Capstone: every third attack deals +50% damage; splash deals +25% damage.", cost: 300, maxLevel: 1, effect: { thirdAttackBonus: 0.5, splashDamageMultiplier: 0.25 }, x: 2440, y: 1140, prerequisites: ["wizard_chain_spark"], type: "capstone" },

  { id: "wizard_frost_hex_meta", classId: "wizard", branch: "Control", name: "Frost Hex", description: "Attacks gain +5% slow chance and +4% slow strength per level.", cost: 55, maxLevel: 4, effect: { slowChance: 0.05, slowValue: 0.04 }, x: 1800, y: 1320, prerequisites: ["wizard_root"], type: "stat" },
  { id: "wizard_time_thread", classId: "wizard", branch: "Control", name: "Time Thread", description: "Attacks gain +2.5% chance per level to delay enemy attacks by 0.35s.", cost: 105, maxLevel: 3, effect: { delayChance: 0.025, delayAmount: 0.35 }, x: 2000, y: 1380, prerequisites: ["wizard_frost_hex_meta"], type: "notable" },
  { id: "wizard_binding_rune", classId: "wizard", branch: "Control", name: "Binding Rune", description: "Slowed enemies take +7% damage per level.", cost: 150, maxLevel: 3, effect: { slowedEnemyDamage: 0.07 }, x: 2200, y: 1440, prerequisites: ["wizard_time_thread"], type: "notable" },
  { id: "wizard_chrono_seal", classId: "wizard", branch: "Control", name: "Chrono Seal", description: "Capstone: first enemy attack is delayed 1.6s; +10% slow chance; slow effect +10%.", cost: 300, maxLevel: 1, effect: { firstEnemyDelay: 1.6, slowChance: 0.1, slowValue: 0.1 }, x: 2400, y: 1500, prerequisites: ["wizard_binding_rune"], type: "capstone" },

  { id: "wizard_curse_unlock", classId: "wizard", branch: "Ability Unlock", name: "Curse", description: "Unlocks Curse: every 2.5s, curse one enemy for 4s so it takes +22% damage.", cost: 500, maxLevel: 1, effect: { unlockRunAbility: "wizard_curse" }, x: 2620, y: 880, prerequisites: ["wizard_chrono_seal"], type: "ability" },
  { id: "wizard_iceball_unlock", classId: "wizard", branch: "Ability Unlock", name: "Iceball", description: "Unlocks Iceball: every 2.5s, hit one enemy for 75% damage and slow it by 38% for 3.5s.", cost: 500, maxLevel: 1, effect: { unlockRunAbility: "wizard_iceball" }, x: 2620, y: 1050, prerequisites: ["wizard_archmage_aegis"], type: "ability" },
  { id: "wizard_lightning_unlock", classId: "wizard", branch: "Ability Unlock", name: "Lightning", description: "Unlocks Lightning: every 2s, strike up to 3 enemies for 90%/75%/60% damage.", cost: 500, maxLevel: 1, effect: { unlockRunAbility: "wizard_lightning" }, x: 2620, y: 1230, prerequisites: ["wizard_archmage_sigil"], type: "ability" }
];

applyUniformTreeLayout();

function applyUniformTreeLayout() {
  const positions = {
    crown_legacy: [1600, 1180],

    endurance: [1280, 1000], armor: [1060, 820], old_campaigns: [840, 640], castle_stores: [620, 460], royal_mender: [460, 280],
    unlock_starting_bonuses: [260, 120], unlock_relics: [660, 120],

    field_drills: [1600, 960], haste: [1380, 780], essence: [1200, 600], crown_doctrine: [1160, 420], ancient_charter: [1160, 240],
    unlock_events: [960, 100], unlock_harder_difficulty: [1360, 100],
    marching_songs: [1560, 760], life_siphon: [1600, 600], duelist_lessons: [1780, 760],

    might: [1920, 1000], fortune: [2160, 820], lucky_omens: [2060, 640], crown_purse: [2340, 660], royal_tithe: [2520, 500],
    veteran_bounty: [2680, 340], battle_trance: [2680, 180], unlock_merchants: [2480, 80], unlock_enemies: [2880, 80],

    knight_root: [520, 1500], rogue_root: [1600, 1760], wizard_root: [2680, 1500],

    knight_plate: [170, 1660], knight_vigor: [170, 1820], knight_iron_will: [170, 1980], knight_iron_bastion: [170, 2140], knight_heavy_attack_unlock: [170, 2380],
    knight_bulwark: [410, 1660], knight_guard: [410, 1820], knight_sanctuary: [410, 1980], knight_aegis_eternal: [410, 2140], knight_holy_shield_unlock: [410, 2380],
    knight_counter: [650, 1660], knight_unbroken: [650, 1820], knight_spiked_guard: [650, 1980], knight_retribution: [650, 2140], knight_holy_sword_unlock: [650, 2380],
    knight_hold_line: [890, 1660], knight_crown_guard_meta: [890, 1820], knight_banner: [890, 1980], knight_warlord_oath: [890, 2140],

    rogue_serrated: [1120, 1920], rogue_open_wounds: [1120, 2080], rogue_blood_scent: [1120, 2240], rogue_crimson_execution: [1120, 2400], rogue_poison_unlock: [1120, 2560],
    rogue_precision: [1440, 1920], rogue_backstab_meta: [1440, 2080], rogue_deadly_rhythm: [1440, 2240], rogue_perfect_strike: [1440, 2400], rogue_bleed_unlock: [1440, 2560],
    rogue_reflex: [1760, 1920], rogue_smoke_step: [1760, 2080], rogue_opportunist: [1760, 2240], rogue_ghostblade: [1760, 2400], rogue_burn_unlock: [1760, 2560],
    rogue_mark_weakness: [2080, 1920], rogue_killers_instinct: [2080, 2080], rogue_finishing_dash: [2080, 2240], rogue_death_sentence: [2080, 2400],

    wizard_ember: [2310, 1660], wizard_wildfire_meta: [2310, 1820], wizard_scorching_focus: [2310, 1980], wizard_inferno_crown: [2310, 2140],
    wizard_mana_shield: [2550, 1660], wizard_warding_glyph: [2550, 1820], wizard_prismatic_shell: [2550, 1980], wizard_archmage_aegis: [2550, 2140], wizard_iceball_unlock: [2550, 2380],
    wizard_focus: [2790, 1660], wizard_rune_battery: [2790, 1820], wizard_chain_spark: [2790, 1980], wizard_archmage_sigil: [2790, 2140], wizard_lightning_unlock: [2790, 2380],
    wizard_frost_hex_meta: [3030, 1660], wizard_time_thread: [3030, 1820], wizard_binding_rune: [3030, 1980], wizard_chrono_seal: [3030, 2140], wizard_curse_unlock: [3030, 2380]
  };

  TREE_NODES.forEach(node => {
    const position = positions[node.id];
    if (!position) return;
    [node.x, node.y] = position;
  });
}

const TREE = TREE_NODES.reduce((nodes, node) => {
  nodes[node.id] = node;
  return nodes;
}, {});

const MAP_TYPES = {
  Battle: { label: "Combat", icon: "&#9876;", className: "map-battle", description: "Standard battle" },
  Elite: { label: "Elite", icon: "&#9760;", className: "map-elite", description: "Elite fight: 35 base gold, +20% Essence, and a relic reward" },
  Heal: { label: "Sanctuary", icon: "&#10010;", className: "map-heal", description: "Gain +65 max HP" },
  Merchant: { label: "Merchant", icon: "$", className: "map-merchant", description: "Spend gold on run upgrades" },
  Treasure: { label: "Treasure", icon: "&#10022;", className: "map-treasure", description: "Gain 35 + 3 per stage gold; 35% relic chance plus Luck" },
  Boss: { label: "Boss", icon: "&#9819;", className: "map-boss", description: "Final boss" }
};
