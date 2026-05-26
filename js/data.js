const BATTLEFIELD_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 430" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#40264f"/><stop offset=".45" stop-color="#a9553f"/><stop offset="1" stop-color="#3c2a25"/></linearGradient><linearGradient id="ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8b6438"/><stop offset="1" stop-color="#3e2a1b"/></linearGradient><radialGradient id="glow" cx="50%" cy="42%" r="42%"><stop offset="0" stop-color="#ffe28a" stop-opacity=".95"/><stop offset=".25" stop-color="#f59e45" stop-opacity=".45"/><stop offset="1" stop-color="#1b1120" stop-opacity="0"/></radialGradient></defs><rect width="900" height="430" fill="url(#sky)"/><rect width="900" height="430" fill="url(#glow)"/><circle cx="450" cy="180" r="34" fill="#ffd874"/><path d="M0 188 L64 132 L118 187 L164 112 L229 190 L292 120 L349 188 L406 96 L480 190 L548 118 L618 190 L684 99 L758 190 L825 126 L900 187 L900 250 L0 250 Z" fill="#33294b"/><path d="M0 238 L80 199 L170 235 L258 196 L350 238 L450 203 L536 238 L637 194 L722 238 L812 201 L900 238 L900 288 L0 288 Z" fill="#4f3a37"/><path d="M318 201 V150 H332 V126 H346 V154 H358 V110 H374 V154 H388 V132 H402 V201 Z" fill="#2a2434"/><rect x="309" y="194" width="104" height="20" fill="#33283a"/><path d="M620 205 V150 H636 V118 H652 V158 H668 V136 H684 V205 Z" fill="#302337"/><rect x="606" y="198" width="96" height="20" fill="#3a2a34"/><path d="M92 215 V92 H132 V204 H152 V222 H68 V204 H92 Z" fill="#322d31"/><path d="M768 215 V96 H810 V204 H832 V222 H746 V204 H768 Z" fill="#322d31"/><rect x="99" y="118" width="24" height="72" fill="#273558"/><rect x="779" y="120" width="25" height="74" fill="#6d2020"/><rect y="250" width="900" height="180" fill="url(#ground)"/><path d="M110 310 C208 286 348 282 452 288 C572 295 690 288 804 310 C704 331 584 342 455 338 C318 334 202 330 110 310 Z" fill="#9a7142" opacity=".72"/><rect x="83" y="292" width="34" height="12" fill="#b09369"/><rect x="242" y="301" width="44" height="11" fill="#a4885e"/><rect x="510" y="302" width="42" height="10" fill="#b08c5c"/><rect x="734" y="294" width="38" height="11" fill="#a68961"/><rect x="18" y="392" width="132" height="38" fill="#201711"/><rect x="732" y="392" width="150" height="38" fill="#201711"/></svg>`;

function createBiomeBattlefieldSvg(theme) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 430" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${theme.skyTop}"/><stop offset=".52" stop-color="${theme.skyMid}"/><stop offset="1" stop-color="${theme.skyBottom}"/></linearGradient><linearGradient id="ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${theme.groundTop}"/><stop offset="1" stop-color="${theme.groundBottom}"/></linearGradient><radialGradient id="glow" cx="50%" cy="38%" r="42%"><stop offset="0" stop-color="${theme.sun}" stop-opacity=".75"/><stop offset=".28" stop-color="${theme.sun}" stop-opacity=".22"/><stop offset="1" stop-color="${theme.skyBottom}" stop-opacity="0"/></radialGradient></defs><rect width="900" height="430" fill="url(#sky)"/><rect width="900" height="430" fill="url(#glow)"/><circle cx="450" cy="162" r="32" fill="${theme.sun}" opacity=".82"/><path d="M0 190 L64 132 L118 187 L164 112 L229 190 L292 120 L349 188 L406 96 L480 190 L548 118 L618 190 L684 99 L758 190 L825 126 L900 187 L900 258 L0 258 Z" fill="${theme.far}"/><path d="M0 238 L80 199 L170 235 L258 196 L350 238 L450 203 L536 238 L637 194 L722 238 L812 201 L900 238 L900 292 L0 292 Z" fill="${theme.near}"/><path d="M318 204 V150 H332 V126 H346 V154 H358 V110 H374 V154 H388 V132 H402 V204 Z" fill="${theme.accentB}"/><rect x="309" y="194" width="104" height="22" fill="${theme.near}"/><path d="M620 207 V150 H636 V118 H652 V158 H668 V136 H684 V207 Z" fill="${theme.accentB}"/><rect x="606" y="198" width="96" height="22" fill="${theme.near}"/><path d="M92 218 V92 H132 V204 H152 V224 H68 V204 H92 Z" fill="${theme.accentB}"/><path d="M768 218 V96 H810 V204 H832 V224 H746 V204 H768 Z" fill="${theme.accentB}"/><rect x="99" y="118" width="24" height="72" fill="${theme.accentA}"/><rect x="779" y="120" width="25" height="74" fill="${theme.accentA}"/><rect y="250" width="900" height="180" fill="url(#ground)"/><path d="M110 310 C208 286 348 282 452 288 C572 295 690 288 804 310 C704 331 584 342 455 338 C318 334 202 330 110 310 Z" fill="${theme.accentA}" opacity=".34"/><rect x="83" y="292" width="34" height="12" fill="${theme.near}"/><rect x="242" y="301" width="44" height="11" fill="${theme.near}"/><rect x="510" y="302" width="42" height="10" fill="${theme.near}"/><rect x="734" y="294" width="38" height="11" fill="${theme.near}"/><rect x="18" y="392" width="132" height="38" fill="${theme.groundBottom}"/><rect x="732" y="392" width="150" height="38" fill="${theme.groundBottom}"/></svg>`;
}

const BASE_STAGE_ESSENCE = 15;
const ENDLESS_BASE_ESSENCE = 2;
const ENDLESS_ESSENCE_PER_STAGE = 1.15;
const ENDLESS_ESSENCE_CAP = 50;
const ROGUE_BASE_BLEED_MAX_HP_PERCENT = 0.04;
const TREE_COST_GROWTH = 1.75;
const GLOBAL_TREE_COST_MULTIPLIER = 0.75;
const GLOBAL_TREE_COST_GROWTH = 1.5;
const TREE_UNLOCK_ESSENCE_COST = 300;
const PLAYER_BASE_STAT_MULTIPLIER = 1.05;
const ENEMY_BASE_STAT_MULTIPLIER = 1.3;
const HERO_SKIN_ESSENCE_COST = 200;
const RARITY_LUCK_REQUIREMENTS = { Rare: 5, Epic: 10, Legendary: 20 };

function getRarityLuckRequirement(rarity) {
  return RARITY_LUCK_REQUIREMENTS[rarity] || 0;
}

function isRarityAllowedByLuck(rarity, luck = (typeof run !== "undefined" && run?.hero?.luck) || 0) {
  return Math.max(0, Number(luck) || 0) >= getRarityLuckRequirement(rarity);
}
const ENEMY_SKIN_ESSENCE_COST = 150;

const GAUNTLET_OPPONENT_DIFFICULTIES = [
  { id: "sparring", name: "Sparring", opponentId: "sparring_duelist", statMultiplier: 1, statVariance: 0.1, points: 18, coins: 10 },
  { id: "contender", name: "Contender", opponentId: "iron_contender", statMultiplier: 1, statVariance: 0.2, points: 28, coins: 15 },
  { id: "veteran", name: "Veteran", opponentId: "grave_veteran", statMultiplier: 1, statVariance: 0.3, points: 42, coins: 25 },
  { id: "champion", name: "Champion", opponentId: "crown_champion", statMultiplier: 1, statVariance: 0.4, points: 62, coins: 35 }
];

// Edit these records to choose the exact unranked Gauntlet opponents.
// spriteSheet is optional. Use a 6-frame sheet that follows the normal enemy sheet layout.
const GAUNTLET_UNRANKED_OPPONENTS = {
  sparring_duelist: {
    id: "sparring_duelist",
    name: "Sparring Duelist",
    baseEnemyId: "bandit",
    className: "bandit",
    spriteSheet: "",
    stats: { maxHp: 430, damage: 29, attackSpeed: 0.75, armor: 6, armorPiercing: 2 }
  },
  iron_contender: {
    id: "iron_contender",
    name: "Iron Contender",
    baseEnemyId: "armored_knight",
    className: "armored-knight",
    spriteSheet: "",
    stats: { maxHp: 900, damage: 45, attackSpeed: 0.85, armor: 12, armorPiercing: 4 }
  },
  grave_veteran: {
    id: "grave_veteran",
    name: "Grave Veteran",
    baseEnemyId: "wraith",
    className: "wraith",
    spriteSheet: "",
    stats: { maxHp: 1500, damage: 68, attackSpeed: 0.88, armor: 10, armorPiercing: 4 }
  },
  crown_champion: {
    id: "crown_champion",
    name: "Crown Champion",
    baseEnemyId: "fallen_knight",
    className: "fallen-knight",
    spriteSheet: "",
    stats: { maxHp: 3000, damage: 88, attackSpeed: 0.9, armor: 15, armorPiercing: 6 }
  }
};

// Edit these arrays to customize the ranked Gauntlet top 10.
// Hero leader spriteSheet is optional; enemy leader spriteSheet uses the normal 6-frame enemy layout.
const GAUNTLET_HERO_LEADER_CONFIGS = [
  { id: "hero_aurelia", name: "Aurelia", classId: "knight", rank: 1, spriteSheet: "", stats: { maxHp: 6400, damage: 330, attackSpeed: 0.92, armor: 60 } },
  { id: "hero_brom", name: "Brom", classId: "wizard", rank: 2, spriteSheet: "", stats: { maxHp: 5600, damage: 360, attackSpeed: 0.75, armor: 48 } },
  { id: "hero_caldus", name: "Ser Caldus", classId: "knight", rank: 3, spriteSheet: "", stats: { maxHp: 5000, damage: 285, attackSpeed: 0.84, armor: 52 } },
  { id: "hero_nyra", name: "Nyra", classId: "rogue", rank: 4, spriteSheet: "", stats: { maxHp: 4300, damage: 245, attackSpeed: 1.42, armor: 34 } },
  { id: "hero_vey", name: "Vey", classId: "wizard", rank: 5, spriteSheet: "", stats: { maxHp: 3800, damage: 265, attackSpeed: 0.82, armor: 32 } },
  { id: "hero_merek", name: "Merek", classId: "knight", rank: 6, spriteSheet: "", stats: { maxHp: 3400, damage: 205, attackSpeed: 0.82, armor: 35 } },
  { id: "hero_iris", name: "Iris", classId: "rogue", rank: 7, spriteSheet: "", stats: { maxHp: 3000, damage: 190, attackSpeed: 1.28, armor: 24 } },
  { id: "hero_tor", name: "Tor", classId: "knight", rank: 8, spriteSheet: "", stats: { maxHp: 2600, damage: 165, attackSpeed: 0.74, armor: 28 } },
  { id: "hero_sable", name: "Sable", classId: "rogue", rank: 9, spriteSheet: "", stats: { maxHp: 2200, damage: 145, attackSpeed: 1.14, armor: 18 } },
  { id: "hero_rowan", name: "Rowan", classId: "wizard", rank: 10, spriteSheet: "", stats: { maxHp: 1900, damage: 135, attackSpeed: 0.72, armor: 16 } }
];

const GAUNTLET_ENEMY_LEADER_CONFIGS = [
  { id: "enemy_crown_tyrant", name: "Crown Tyrant", enemyId: "fallen_knight", className: "fallen-knight", rank: 1, spriteSheet: "", stats: { maxHp: 6900, damage: 320, attackSpeed: 0.88, armor: 58, armorPiercing: 18 } },
  { id: "enemy_void_wraith", name: "Void Wraith", enemyId: "wraith", className: "wraith", rank: 2, spriteSheet: "", stats: { maxHp: 5600, damage: 345, attackSpeed: 1.02, armor: 40, armorPiercing: 15 } },
  { id: "enemy_crypt_lord", name: "Crypt Lord", enemyId: "necromancer", className: "necromancer", rank: 3, spriteSheet: "", stats: { maxHp: 5100, damage: 280, attackSpeed: 0.85, armor: 44, armorPiercing: 13 } },
  { id: "enemy_iron_oath", name: "Iron Oath", enemyId: "armored_knight", className: "armored-knight", rank: 4, spriteSheet: "", stats: { maxHp: 4700, damage: 235, attackSpeed: 0.78, armor: 50, armorPiercing: 12 } },
  { id: "enemy_blood_acolyte", name: "Blood Acolyte", enemyId: "cultist", className: "cultist", rank: 5, spriteSheet: "", stats: { maxHp: 3900, damage: 230, attackSpeed: 0.96, armor: 28, armorPiercing: 10 } },
  { id: "enemy_marsh_stalker", name: "Marsh Stalker", enemyId: "plague_rat", className: "plague-rat", rank: 6, spriteSheet: "", stats: { maxHp: 3300, damage: 190, attackSpeed: 1.25, armor: 20, armorPiercing: 8 } },
  { id: "enemy_dark_marksman", name: "Dark Marksman", enemyId: "dark_archer", className: "dark-archer", rank: 7, spriteSheet: "", stats: { maxHp: 2900, damage: 185, attackSpeed: 0.98, armor: 18, armorPiercing: 7 } },
  { id: "enemy_war_troll", name: "War Troll", enemyId: "troll", className: "troll", rank: 8, spriteSheet: "", stats: { maxHp: 3600, damage: 155, attackSpeed: 0.52, armor: 30, armorPiercing: 6 } },
  { id: "enemy_red_raider", name: "Red Raider", enemyId: "raider", className: "raider", rank: 9, spriteSheet: "", stats: { maxHp: 2400, damage: 150, attackSpeed: 0.9, armor: 16, armorPiercing: 5 } },
  { id: "enemy_goblin_duke", name: "Goblin Duke", enemyId: "goblin", className: "goblin", rank: 10, spriteSheet: "", stats: { maxHp: 2000, damage: 125, attackSpeed: 1.04, armor: 12, armorPiercing: 4 } }
];

const GAUNTLET_SHOP_UPGRADES = [
  { id: "maxHp", name: "Tournament Vigor", description: "+18 max HP in Gauntlet battles.", cost: 18, maxLevel: 20, effect: { maxHp: 18 } },
  { id: "damage", name: "Arena Edge", description: "+3 damage in Gauntlet battles.", cost: 20, maxLevel: 20, effect: { damage: 3 } },
  { id: "armor", name: "Duel Plate", description: "+1 armor in Gauntlet battles.", cost: 16, maxLevel: 20, effect: { armor: 1 } },
  { id: "attackSpeed", name: "Quick Bell", description: "+0.04 attack speed in Gauntlet battles.", cost: 22, maxLevel: 20, effect: { attackSpeed: 0.04 } },
  { id: "crit", name: "Crowd Favorite", description: "+2% crit chance in Gauntlet battles.", cost: 24, maxLevel: 20, effect: { crit: 0.02 } }
];

const CLASSES = {
  knight: { name: "Knight", description: "Armored front-liner with strong defense and steady melee damage.", hp: 200, damage: 18, attackSpeed: 0.71, armor: 4, crit: 0.04, colorClass: "knight", traits: ["High health", "Armor", "Reliable melee"] },
  rogue: { name: "Rogue", description: "Fast assassin with high crit chance. Attacks always apply bleed based on max HP.", hp: 155, damage: 13, attackSpeed: 0.92, armor: 1, crit: 0.15, colorClass: "rogue", traits: ["Fast attacks", "High crit", "Max HP bleed"] },
  wizard: { name: "Wizard", description: "Ranged spellcaster with high damage and splash magic.", hp: 175, damage: 24, attackSpeed: 0.6, armor: 2, crit: 0.1, colorClass: "wizard", traits: ["High burst", "Splash damage", "Magic scaling"] }
};

const EQUIPMENT_SLOTS = [
  { id: "head", name: "Head" },
  { id: "body", name: "Body" },
  { id: "mainHand", name: "Main Hand" },
  { id: "offHand", name: "Off Hand" },
  { id: "legs", name: "Legs" },
  { id: "feet", name: "Feet" }
];

const EQUIPMENT_RARITIES = [
  { id: "Common", weight: 60, statMultiplier: 0.55, qualityBonus: 0 },
  { id: "Uncommon", weight: 26.5, statMultiplier: 0.9, qualityBonus: 0.02 },
  { id: "Rare", weight: 10, statMultiplier: 1.65, qualityBonus: 0.04 },
  { id: "Epic", weight: 3, statMultiplier: 2.8, qualityBonus: 0.06 },
  { id: "Legendary", weight: 0.5, statMultiplier: 4.5, qualityBonus: 0.08 }
];

const EQUIPMENT_STAT_RANGES = {
  maxHp: { min: 3, max: 12, decimals: 0 },
  damage: { min: 0.4, max: 2.4, decimals: 1 },
  armor: { min: 1, max: 2, decimals: 0 },
  attackSpeed: { min: 0.005, max: 0.025, decimals: 3 },
  critChance: { min: 0.005, max: 0.025, decimals: 3 },
  regen: { min: 0.05, max: 0.45, decimals: 1 },
  luck: { min: 1, max: 1, decimals: 0 }
};

const EQUIPMENT_TEMPLATES = {
  head: [
    { id: "soldiers_helm", name: "Soldier's Helm", stats: ["maxHp", "armor"] },
    { id: "crownguard_sallet", name: "Crownguard Sallet", stats: ["armor", "maxHp"] },
    { id: "duelist_mask", name: "Duelist Mask", stats: ["critChance", "luck"] },
    { id: "oracle_cowl", name: "Oracle Cowl", stats: ["luck", "critChance"] },
    { id: "wolfhide_cap", name: "Wolfhide Cap", stats: ["maxHp", "critChance"] },
    { id: "iron_visor", name: "Iron Visor", stats: ["armor", "critChance"] },
    { id: "ember_hood", name: "Ember Hood", stats: ["maxHp", "luck"] },
    { id: "gravewatch_helm", name: "Gravewatch Helm", stats: ["maxHp", "luck"] },
    { id: "kingsfall_circlet", name: "Kingsfall Circlet", stats: ["critChance", "luck"] },
    { id: "ashen_crownlet", name: "Ashen Crownlet", stats: ["armor", "luck"] }
  ],
  body: [
    { id: "chainmail_vest", name: "Chainmail Vest", stats: ["armor", "maxHp"] },
    { id: "oathbound_plate", name: "Oathbound Plate", stats: ["maxHp", "armor"] },
    { id: "shadow_jacket", name: "Shadow Jacket", stats: ["critChance", "maxHp"] },
    { id: "runed_robes", name: "Runed Robes", stats: ["luck", "maxHp"] },
    { id: "raider_harness", name: "Raider Harness", stats: ["maxHp", "armor"] },
    { id: "sanctuary_mail", name: "Sanctuary Mail", stats: ["luck", "armor"] },
    { id: "wyvern_hide", name: "Wyvern Hide", stats: ["maxHp", "critChance"] },
    { id: "battle_surcoat", name: "Battle Surcoat", stats: ["armor", "maxHp"] },
    { id: "moonstitched_garb", name: "Moonstitched Garb", stats: ["critChance", "luck"] },
    { id: "crownforged_cuirass", name: "Crownforged Cuirass", stats: ["armor", "luck"] }
  ],
  mainHand: [
    { id: "tempered_blade", name: "Tempered Blade", stats: ["damage", "critChance"] },
    { id: "heavy_mace", name: "Heavy Mace", stats: ["damage", "critChance"] },
    { id: "quick_daggers", name: "Quick Daggers", stats: ["attackSpeed", "critChance"] },
    { id: "war_axe", name: "War Axe", stats: ["damage", "attackSpeed"] },
    { id: "dueling_rapier", name: "Dueling Rapier", stats: ["critChance", "damage"] },
    { id: "apprentice_wand", name: "Apprentice Wand", stats: ["damage", "attackSpeed"] },
    { id: "storm_staff", name: "Storm Staff", stats: ["damage", "luck"] },
    { id: "bone_scepter", name: "Bone Scepter", stats: ["damage", "luck"] },
    { id: "crownsplitter", name: "Crownsplitter", stats: ["damage", "critChance"] },
    { id: "gilded_halberd", name: "Gilded Halberd", stats: ["damage", "luck"] }
  ],
  offHand: [
    { id: "round_shield", name: "Round Shield", stats: ["armor", "maxHp"] },
    { id: "tower_guard", name: "Tower Guard", stats: ["armor", "regen"] },
    { id: "parrying_dagger", name: "Parrying Dagger", stats: ["critChance", "attackSpeed"] },
    { id: "focus_orb", name: "Focus Orb", stats: ["critChance", "luck"] },
    { id: "lucky_charm", name: "Lucky Charm", stats: ["luck", "critChance"] },
    { id: "iron_lantern", name: "Iron Lantern", stats: ["regen", "maxHp"] },
    { id: "ember_tome", name: "Ember Tome", stats: ["luck", "regen"] },
    { id: "duelist_buckler", name: "Duelist Buckler", stats: ["attackSpeed", "armor"] },
    { id: "saints_reliquary", name: "Saint's Reliquary", stats: ["maxHp", "luck"] },
    { id: "crown_mirror", name: "Crown Mirror", stats: ["critChance", "luck"] }
  ],
  legs: [
    { id: "marching_greaves", name: "Marching Greaves", stats: ["maxHp", "armor"] },
    { id: "plated_leggings", name: "Plated Leggings", stats: ["armor", "maxHp"] },
    { id: "rogues_trousers", name: "Rogue's Trousers", stats: ["attackSpeed", "critChance"] },
    { id: "runewoven_leggings", name: "Runewoven Leggings", stats: ["regen", "luck"] },
    { id: "wolfstep_chaps", name: "Wolfstep Chaps", stats: ["attackSpeed", "maxHp"] },
    { id: "grave_ward_greaves", name: "Grave Ward Greaves", stats: ["armor", "regen"] },
    { id: "campaign_tassets", name: "Campaign Tassets", stats: ["maxHp", "luck"] },
    { id: "emberstride_leggings", name: "Emberstride Leggings", stats: ["attackSpeed", "luck"] },
    { id: "duelist_legwraps", name: "Duelist Legwraps", stats: ["critChance", "attackSpeed"] },
    { id: "crownforged_greaves", name: "Crownforged Greaves", stats: ["armor", "luck"] }
  ],
  feet: [
    { id: "travelers_boots", name: "Traveler's Boots", stats: ["attackSpeed", "maxHp"] },
    { id: "iron_sabatons", name: "Iron Sabatons", stats: ["armor", "maxHp"] },
    { id: "silent_slippers", name: "Silent Slippers", stats: ["critChance", "attackSpeed"] },
    { id: "runecaster_sandals", name: "Runecaster Sandals", stats: ["regen", "luck"] },
    { id: "spurred_boots", name: "Spurred Boots", stats: ["attackSpeed", "critChance"] },
    { id: "sanctuary_treads", name: "Sanctuary Treads", stats: ["regen", "maxHp"] },
    { id: "fortune_boots", name: "Fortune Boots", stats: ["luck", "attackSpeed"] },
    { id: "grave_marchers", name: "Grave Marchers", stats: ["armor", "regen"] },
    { id: "emberstep_boots", name: "Emberstep Boots", stats: ["attackSpeed", "luck"] },
    { id: "kingroad_sabatons", name: "Kingroad Sabatons", stats: ["maxHp", "luck"] }
  ]
};

const SPRITE_SHEETS = {
  heroes: {
    knight: "assets/heroes/knight-sheet.png",
    rogue: "assets/heroes/rogue-sheet.png",
    wizard: "assets/heroes/wizard-sheet.png"
  },
  enemies: {
    goblin: "assets/enemies/goblin-sheet.png",
    skeleton: "assets/enemies/skeleton-sheet.png",
    orc: "assets/enemies/orc-sheet.png",
    wolf: "assets/enemies/wolf-sheet.png",
    bandit: "assets/enemies/bandit-sheet.png",
    cultist: "assets/enemies/cultist-sheet.png",
    dark_archer: "assets/enemies/dark-archer-sheet.png",
    plague_rat: "assets/enemies/plague-rat-sheet.png",
    armored_knight: "assets/enemies/armored-knight-sheet.png",
    fallen_knight: "assets/enemies/fallen-knight-sheet.png",
    necromancer: "assets/enemies/necromancer-sheet.png",
    wraith: "assets/enemies/wraith-sheet.png",
    troll: "assets/enemies/troll-sheet.png",
    raider: "assets/enemies/raider-sheet.png",
    boss: "assets/enemies/boss-sheet.png",
    eternalCrown: "assets/enemies/eternal-crown-sheet.png"
  }
};

const SKIN_SPRITE_SHEETS = {
  heroes: {
    knight: {
      crimson_champion: "assets/heroes/skins/crimson-champion-sheet.png",
      golden_oath: "assets/heroes/skins/knight-golden-oath-sheet.png"
    },
    rogue: {
      verdant_shade: "assets/heroes/skins/rogue-verdant-shade-sheet.png",
      crimson_ghost: "assets/heroes/skins/rogue-crimson-ghost-sheet.png"
    }
  },
  enemies: {}
};

const SKILL_SPRITE_SHEETS = {
  // Add custom skill sprites here. Skin-specific sprites override base sprites.
  wizard_curse: { base: "assets/skills/wizard_curse.png" },
  wizard_iceball: { base: "assets/skills/wizard_iceball.png" },
  wizard_lightning: { base: "assets/skills/wizard_lightning.png" },
  rogue_poison: { base: "assets/skills/rogue_poison.png" },
  rogue_bleed: { base: "" },
  rogue_burn: { base: "" },
  knight_heavy_attack: { base: "" },
  knight_holy_sword: { base: "" },
  knight_holy_shield: { base: "" }
};

const HERO_SKINS = {
  knight: [
    { id: "base", name: "Classic Oath", className: "", unlock: { type: "base" } },
    { id: "royal_vanguard", name: "Royal Vanguard", className: "skin-tree", unlock: { type: "purchase", cost: HERO_SKIN_ESSENCE_COST } },
    { id: "crimson_champion", name: "Crimson Champion", className: "skin-achievement", unlock: { type: "purchase", cost: HERO_SKIN_ESSENCE_COST } },
    { id: "golden_oath", name: "Golden Oath", className: "skin-gold", unlock: { type: "achievement", achievement: "knight_layer3_clear" } }
  ],
  rogue: [
    { id: "base", name: "Classic Contract", className: "", unlock: { type: "base" } },
    { id: "verdant_shade", name: "Verdant Shade", className: "skin-tree", unlock: { type: "purchase", cost: HERO_SKIN_ESSENCE_COST } },
    { id: "crimson_ghost", name: "Crimson Ghost", className: "skin-achievement", unlock: { type: "purchase", cost: HERO_SKIN_ESSENCE_COST } },
    { id: "gilded_contract", name: "Gilded Contract", className: "skin-gold", unlock: { type: "achievement", achievement: "rogue_layer3_clear" } }
  ],
  wizard: [
    { id: "base", name: "Classic Arcana", className: "", unlock: { type: "base" } },
    { id: "astral_scholar", name: "Astral Scholar", className: "skin-tree", unlock: { type: "purchase", cost: HERO_SKIN_ESSENCE_COST } },
    { id: "starfire_magus", name: "Starfire Magus", className: "skin-achievement", unlock: { type: "purchase", cost: HERO_SKIN_ESSENCE_COST } },
    { id: "auric_arcana", name: "Auric Arcana", className: "skin-gold", unlock: { type: "achievement", achievement: "wizard_layer3_clear" } }
  ]
};

function getEnemySkinSet(enemyId, enemyName) {
  return [
    { id: "base", name: `${enemyName} Classic`, className: "", unlock: { type: "base" } },
    { id: "crownmark", name: `${enemyName} Crownmark`, className: "skin-tree", unlock: { type: "purchase", cost: ENEMY_SKIN_ESSENCE_COST } },
    { id: "nemesis", name: `${enemyName} Nemesis`, className: "skin-achievement", unlock: { type: "purchase", cost: ENEMY_SKIN_ESSENCE_COST } },
    { id: "golden", name: `Golden ${enemyName}`, className: "skin-gold", unlock: { type: "achievement", achievement: `slayer_${enemyId}` } }
  ];
}

const ENEMY_ARCHETYPES = {
  goblin: { id: "goblin", name: "Goblin", hp: 40, damage: 7, attackSpeed: 0.6, armor: 0, armorPiercing: 0, className: "goblin" },
  wolf: { id: "wolf", name: "Wolf", hp: 46, damage: 10, attackSpeed: 0.78, armor: 0, armorPiercing: 0, className: "wolf" },
  bandit: { id: "bandit", name: "Bandit", hp: 54, damage: 9, attackSpeed: 0.62, armor: 1, armorPiercing: 1, className: "bandit" },
  plagueRat: { id: "plague_rat", name: "Plague Rat", hp: 32, damage: 6, attackSpeed: 0.89, armor: 0, armorPiercing: 0, className: "plague_rat" },
  darkArcher: { id: "dark_archer", name: "Dark Archer", hp: 48, damage: 12, attackSpeed: 0.56, armor: 1, armorPiercing: 1, className: "dark_archer" },

  skeleton: { id: "skeleton", name: "Skeleton", hp: 46, damage: 11, attackSpeed: 0.46, armor: 1, armorPiercing: 1, className: "skeleton" },
  wraith: { id: "wraith", name: "Wraith", hp: 52, damage: 13, attackSpeed: 0.64, armor: 2, armorPiercing: 2, className: "wraith" },
  necromancer: { id: "necromancer", name: "Necromancer", hp: 58, damage: 17, attackSpeed: 0.34, armor: 2, armorPiercing: 2, className: "necromancer" },

  orc: { id: "orc", name: "Orc", hp: 76, damage: 11, attackSpeed: 0.34, armor: 3, armorPiercing: 2, className: "orc" },
  raider: { id: "raider", name: "Raider", hp: 66, damage: 13, attackSpeed: 0.52, armor: 2, armorPiercing: 2, className: "raider" },
  troll: { id: "troll", name: "Troll", hp: 112, damage: 17, attackSpeed: 0.4, armor: 4, armorPiercing: 3, className: "troll" },
  armoredKnight: { id: "armored_knight", name: "Armored Knight", hp: 98, damage: 14, attackSpeed: 0.3, armor: 7, armorPiercing: 3, className: "armored_knight" },

  fallenKnight: { id: "fallen_knight", name: "Fallen Knight", hp: 108, damage: 17, attackSpeed: 0.33, armor: 7, armorPiercing: 4, className: "fallen_knight" },
  cultist: { id: "cultist", name: "Cultist", hp: 72, damage: 18, attackSpeed: 0.42, armor: 2, armorPiercing: 2, className: "cultist" },
  fallenKing: { id: "fallen_king_shade", name: "Fallen King", hp: 135, damage: 22, attackSpeed: 0.26, armor: 6, armorPiercing: 4, className: "boss" },
  crownHound: { id: "crown_hound", name: "Crown Hound", hp: 82, damage: 15, attackSpeed: 0.72, armor: 2, armorPiercing: 2, className: "wolf", requiresNode: "unlock_enemies" },
  oathbreaker: { id: "oathbreaker", name: "Oathbreaker", hp: 118, damage: 19, attackSpeed: 0.38, armor: 8, armorPiercing: 4, className: "fallen_knight", requiresNode: "unlock_enemies" },
  bloodAcolyte: { id: "blood_acolyte", name: "Blood Acolyte", hp: 86, damage: 21, attackSpeed: 0.44, armor: 3, armorPiercing: 3, className: "cultist", requiresNode: "unlock_enemies" }
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
      if (!isRegularEncounterEnemy(enemy)) return false;
      if (seen.has(enemy.id)) return false;
      seen.add(enemy.id);
      return true;
    });
}

function isRegularEncounterEnemy(enemy) {
  return !!enemy && !enemy.boss && !enemy.finalBoss && enemy.id !== "fallen_king_shade";
}

const AREA_ENEMY_POOLS = {
  easy: buildAreaEnemyPool(["forest"]),
  medium: buildAreaEnemyPool(["forest", "crypt", "warCamp"]),
  hard: buildAreaEnemyPool(["crypt", "warCamp", "darkCastle"])
};

const BIOME_THEMES = {
  // Optional custom area assets:
  // - backgroundImage: "assets/areas/your-area.png" replaces the generated battlefield art.
  // - spriteSheets.enemies: { goblin: "assets/areas/your-area/goblin-sheet.png" } overrides enemy sprites while fighting in this area.
  sunlitBeach: {
    name: "Beach",
    description: "A bright shoreline where the first crown scouts land among wreckage and tide pools.",
    icon: "BE",
    backgroundImage: "",
    spriteSheets: { enemies: {} },
    enemyPool: buildAreaEnemyPool(["forest"]),
    eventTags: ["wreck", "tide", "supply"],
    eventNodes: ["Heal", "Merchant", "Battle"],
    musicKey: "beach",
    bossVariant: "shore_raider",
    backgroundSvg: createBiomeBattlefieldSvg({
      skyTop: "#62a8d8", skyMid: "#f3c46b", skyBottom: "#8fd3d6",
      groundTop: "#d7b46a", groundBottom: "#6f5a32", sun: "#fff1a8",
      far: "#427b89", near: "#c08f47", accentA: "#256d85", accentB: "#8b5e34"
    })
  },
  greenwoodForest: {
    name: "Forest",
    description: "The road bends into old trees watched by beasts, bandits, and crown-marked scouts.",
    icon: "FO",
    backgroundImage: "",
    spriteSheets: { enemies: {} },
    enemyPool: buildAreaEnemyPool(["forest", "crypt"]),
    eventTags: ["ambush", "shrine", "fog"],
    eventNodes: ["Heal", "Battle", "Merchant"],
    musicKey: "forest",
    bossVariant: "forest_horror",
    backgroundSvg: createBiomeBattlefieldSvg({
      skyTop: "#172313", skyMid: "#263f27", skyBottom: "#111827",
      groundTop: "#334d25", groundBottom: "#161f13", sun: "#c7d2fe",
      far: "#18241a", near: "#20341f", accentA: "#365314", accentB: "#1f2937"
    })
  },
  storyGoblinCamp: {
    name: "Goblin Camp",
    description: "A crude war camp guarding the last safe path toward the fallen crownlands.",
    icon: "GC",
    backgroundImage: "",
    spriteSheets: { enemies: {} },
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
  crownOutskirts: {
    name: "Outskirts",
    description: "Burned farms and broken roads mark the edge of the kingdom's collapse.",
    icon: "OS",
    backgroundImage: "",
    spriteSheets: { enemies: {} },
    enemyPool: buildAreaEnemyPool(["forest", "warCamp"]),
    eventTags: ["refugee", "barricade", "patrol"],
    eventNodes: ["Merchant", "Heal", "Battle"],
    musicKey: "outskirts",
    bossVariant: "fallen_commander",
    backgroundSvg: createBiomeBattlefieldSvg({
      skyTop: "#32424a", skyMid: "#806241", skyBottom: "#2b2119",
      groundTop: "#756148", groundBottom: "#292017", sun: "#facc15",
      far: "#3d3f39", near: "#544033", accentA: "#78716c", accentB: "#7f1d1d"
    })
  },
  ashLands: {
    name: "Ash Lands",
    description: "A scorched march through cinders, siege smoke, and royal firebreaks.",
    icon: "AL",
    backgroundImage: "",
    spriteSheets: { enemies: {} },
    enemyPool: buildAreaEnemyPool(["warCamp", "darkCastle"]),
    eventTags: ["ash", "siege", "embers"],
    eventNodes: ["Elite", "Merchant", "Heal"],
    musicKey: "ash_lands",
    bossVariant: "ash_regent",
    backgroundSvg: createBiomeBattlefieldSvg({
      skyTop: "#23181a", skyMid: "#7c2d12", skyBottom: "#1c120d",
      groundTop: "#6b3f20", groundBottom: "#24130b", sun: "#fdba74",
      far: "#3f2418", near: "#552c18", accentA: "#9a3412", accentB: "#292524"
    })
  },
  necromancerTower: {
    name: "Necromancer Tower",
    description: "A black spire where the crown's dead are named, bound, and sent onward.",
    icon: "NT",
    backgroundImage: "",
    spriteSheets: { enemies: {} },
    enemyPool: buildAreaEnemyPool(["crypt", "darkCastle"]),
    eventTags: ["ritual", "library", "curse"],
    eventNodes: ["Heal", "Elite", "Merchant"],
    musicKey: "necromancer_tower",
    bossVariant: "crypt_lord",
    backgroundSvg: createBiomeBattlefieldSvg({
      skyTop: "#111827", skyMid: "#263044", skyBottom: "#0f172a",
      groundTop: "#3f3f46", groundBottom: "#18181b", sun: "#93c5fd",
      far: "#27272a", near: "#3f3f46", accentA: "#a8a29e", accentB: "#6d28d9"
    })
  },
  kingdomEntrance: {
    name: "Kingdom Entrance",
    description: "The shattered gate into Crownfall, still guarded by soldiers who never yielded.",
    icon: "KE",
    backgroundImage: "",
    spriteSheets: { enemies: {} },
    enemyPool: buildAreaEnemyPool(["warCamp", "darkCastle"]),
    eventTags: ["gate", "siege", "standard"],
    eventNodes: ["Merchant", "Elite", "Battle"],
    musicKey: "kingdom_entrance",
    bossVariant: "gate_warden",
    backgroundSvg: createBiomeBattlefieldSvg({
      skyTop: "#2f2a35", skyMid: "#5b463f", skyBottom: "#211816",
      groundTop: "#6b5a45", groundBottom: "#2b2119", sun: "#fbbf24",
      far: "#3a3440", near: "#4b3b34", accentA: "#78716c", accentB: "#7f1d1d"
    })
  },
  royalDungeon: {
    name: "Dungeon",
    description: "Cells beneath the keep, packed with sealed horrors and crown-forged jailers.",
    icon: "DG",
    backgroundImage: "",
    spriteSheets: { enemies: {} },
    enemyPool: buildAreaEnemyPool(["crypt", "darkCastle"]),
    eventTags: ["chains", "cells", "vault"],
    eventNodes: ["Heal", "Elite", "Merchant"],
    musicKey: "dungeon",
    bossVariant: "dungeon_jailer",
    backgroundSvg: createBiomeBattlefieldSvg({
      skyTop: "#111827", skyMid: "#1f2937", skyBottom: "#0b0f18",
      groundTop: "#3f3f46", groundBottom: "#18181b", sun: "#a8a29e",
      far: "#27272a", near: "#2b2b30", accentA: "#78716c", accentB: "#581c87"
    })
  },
  kingsQuarters: {
    name: "King's Quarters",
    description: "The ruined royal chambers, the final threshold before the Eternal Crown descends.",
    icon: "KQ",
    backgroundImage: "",
    spriteSheets: { enemies: {} },
    enemyPool: buildAreaEnemyPool(["darkCastle"]),
    eventTags: ["throne", "blood_oath", "dark_altar"],
    eventNodes: ["Elite", "Merchant", "Battle"],
    musicKey: "kings_quarters",
    bossVariant: "fallen_king",
    backgroundSvg: createBiomeBattlefieldSvg({
      skyTop: "#180f1f", skyMid: "#4c1d3f", skyBottom: "#14080f",
      groundTop: "#4b1f24", groundBottom: "#1c0f12", sun: "#ef4444",
      far: "#231325", near: "#35151d", accentA: "#7f1d1d", accentB: "#111827"
    })
  },
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
    enemyHealth: 0.9,
    enemyDamage: 0.9,
    stageHealthGrowth: 0.11,
    stageDamageGrowth: 0.1,
    armorGrowth: 5,
    essenceMultiplier: 0.6,
    enemyPool: AREA_ENEMY_POOLS.easy,
    themeIds: ["sunlitBeach", "greenwoodForest", "storyGoblinCamp"],
    layerEnemyMultipliers: [0.9, 1.3, 1.7],
    layerDamageMultipliers: [0.9, 1.18, 1.4]
  },
  medium: {
    name: "Ashen Ramparts",
    description: "A balanced siege route with steady danger and stronger rewards.",
    requiresDifficultyClear: "easy",
    enemyHealth: 1.2,
    enemyDamage: 1.2,
    stageHealthGrowth: 0.15,
    stageDamageGrowth: 0.15,
    armorGrowth: 4,
    essenceMultiplier: 1.1,
    enemyPool: AREA_ENEMY_POOLS.medium,
    themeIds: ["crownOutskirts", "ashLands", "necromancerTower"],
    layerEnemyMultipliers: [1.4, 1.8, 2.2],
    layerDamageMultipliers: [1.2, 1.4, 1.6]
  },
  hard: {
    name: "Crownfall Keep",
    description: "The crown's brutal inner keep. Enemies hit hard, scale fast, and reward bold runs.",
    requiresDifficultyClear: "medium",
    enemyHealth: 1.5,
    enemyDamage: 1.5,
    stageHealthGrowth: 0.22,
    stageDamageGrowth: 0.21,
    armorGrowth: 3,
    essenceMultiplier: 1.9,
    enemyPool: AREA_ENEMY_POOLS.hard,
    themeIds: ["kingdomEntrance", "royalDungeon", "kingsQuarters"],
    layerEnemyMultipliers: [2.0, 2.7, 3.25],
    layerDamageMultipliers: [1.4, 1.8, 2.1]
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
    endlessHealthGrowth: 0.8,
    endlessDamageGrowth: 0.8,
    armorGrowth: 3,
    essenceMultiplier: 1.4,
    enemyPool: ENEMIES,
    themeIds: ["darkCastle", "warCamp"],
    layerEnemyMultipliers: [1, 1, 1],
    layerDamageMultipliers: [1, 1, 1]
  },
  buildTest: {
    name: "Build Test",
    description: "Assemble any unlocked build, then test it in one fight against the Eternal Crown.",
    mode: "buildTest",
    enemyHealth: 1,
    enemyDamage: 1,
    stageHealthGrowth: 0,
    stageDamageGrowth: 0,
    armorGrowth: 5,
    essenceMultiplier: 0,
    enemyPool: [],
    themeIds: ["darkCastle"],
    layerEnemyMultipliers: [1, 1, 1],
    layerDamageMultipliers: [1, 1, 1]
  },
  gauntlet: {
    name: "Gauntlet",
    description: "A ranked 1v1 tournament ladder with its own coins, points, and shop upgrades.",
    mode: "gauntlet",
    enemyHealth: 1,
    enemyDamage: 1,
    stageHealthGrowth: 0,
    stageDamageGrowth: 0,
    armorGrowth: 5,
    essenceMultiplier: 0,
    enemyPool: ENEMIES,
    themeIds: ["ruinedKeep", "warCamp", "darkCastle"],
    layerEnemyMultipliers: [1, 1, 1],
    layerDamageMultipliers: [1, 1, 1]
  }
};

const BOSSES = [
  { id: "fallenKing", name: "The Fallen King", skillName: "Crownbreaker Slam", hp: 300, damage: 20, attackSpeed: 0.3, armor: 4, armorPiercing: 3, className: "boss", boss: true },
  { id: "ashenRegent", name: "The Ashen Regent", skillName: "Ember Edict", hp: 420, damage: 28, attackSpeed: 0.26, armor: 6, armorPiercing: 4, className: "boss", boss: true },
  { id: "crownfallTyrant", name: "The Crownfall Tyrant", skillName: "Imperial Ruin", hp: 620, damage: 34, attackSpeed: 0.25, armor: 8, armorPiercing: 5, className: "boss", boss: true }
];

const FINAL_BOSS = {
  id: "eternalCrown",
  name: "The Eternal Crown",
  skillName: "Endless Decree",
  hp: 1000000,
  damage: 300,
  attackSpeed: 0.8,
  armor: 50,
  armorPiercing: 12,
  shield: 0,
  className: "boss",
  boss: true,
  finalBoss: true
};

const CHARACTER_ENEMIES = [
  ...Object.values(ENEMY_ARCHETYPES),
  ...BOSSES,
  FINAL_BOSS
];

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
  knight_heavy_attack: { id: "knight_heavy_attack", classId: "knight", name: "Heavy Attack", icon: "⚔", cooldown: 3, duration: 0.8, color: "#f8e7bb", maxHpDamage: 0.15, description: "Every 3s, strike one enemy for 15% of Knight max HP as damage." },
  knight_holy_sword: { id: "knight_holy_sword", classId: "knight", name: "Holy Sword", icon: "✦", cooldown: 4, duration: 3, color: "#fde68a", hitDamageBonus: 0.5, hitCount: 3, description: "Every 4s, the next 3 player hits deal +50% damage." },
  knight_holy_shield: { id: "knight_holy_shield", classId: "knight", name: "Holy Shield", icon: "⬟", cooldown: 5, duration: 2, color: "#facc15", armorMultiplier: 0.5, hitCount: 2, description: "Every 5s, gain +50% armor against the next 2 enemy hits." }
};

const ENEMY_KILL_ACHIEVEMENTS = CHARACTER_ENEMIES.map((enemy, index) => ({
  id: `slayer_${enemy.id}`,
  name: `${enemy.name} Slayer`,
  description: `Defeat ${enemy.name}s across your runs.`,
  goal: `Defeat 75 ${enemy.name}s`,
  condition: save => ((save.stats.enemyKills && save.stats.enemyKills[enemy.id]) || 0) >= 75,
  essenceReward: 5,
  bonus: getEnemySlayerBonus(index)
}));

const GAUNTLET_ACHIEVEMENTS = [
  { id: "gauntlet_first_bout", name: "Arena Debut", description: "Finish your first Gauntlet battle.", goal: "Fight 1 Gauntlet battle", condition: save => (save.gauntlet?.stats?.battles || 0) >= 1, essenceReward: 5, bonus: { maxHp: 2 } },
  { id: "gauntlet_first_win", name: "Duelist's Mark", description: "Win your first Gauntlet battle.", goal: "Win 1 Gauntlet battle", condition: save => (save.gauntlet?.stats?.wins || 0) >= 1, essenceReward: 5, bonus: { damageMultiplier: 0.005 } },
  { id: "gauntlet_ten_wins", name: "Arena Regular", description: "Win 10 Gauntlet battles.", goal: "Win 10 Gauntlet battles", condition: save => (save.gauntlet?.stats?.wins || 0) >= 10, essenceReward: 10, bonus: { maxHp: 4 } },
  { id: "gauntlet_fifty_wins", name: "Crowd Favorite", description: "Win 50 Gauntlet battles.", goal: "Win 50 Gauntlet battles", condition: save => (save.gauntlet?.stats?.wins || 0) >= 50, essenceReward: 20, bonus: { damageMultiplier: 0.01 } },
  { id: "gauntlet_first_rank", name: "Name on the Board", description: "Claim a spot on the Hero leaderboard.", goal: "Enter the Hero Top 10", condition: save => getPlayerGauntletAchievementRank(save) <= 10, essenceReward: 15, bonus: { luck: 1 } },
  { id: "gauntlet_top_five", name: "Upper Bracket", description: "Reach the top 5 on the Hero leaderboard.", goal: "Reach Hero rank 5", condition: save => getPlayerGauntletAchievementRank(save) <= 5, essenceReward: 25, bonus: { armor: 1 } },
  { id: "gauntlet_champion", name: "Gauntlet Champion", description: "Reach #1 on the Hero leaderboard.", goal: "Reach Hero rank 1", condition: save => getPlayerGauntletAchievementRank(save) === 1, essenceReward: 50, bonus: { damageMultiplier: 0.025, maxHp: 10 } },
  { id: "gauntlet_ranked_wins", name: "Ladder Climber", description: "Win 5 ranked Hero leaderboard challenges.", goal: "Win 5 ranked challenges", condition: save => (save.gauntlet?.stats?.rankedWins || 0) >= 5, essenceReward: 20, bonus: { attackSpeedMultiplier: 0.01 } },
  { id: "gauntlet_points_earned", name: "Point Breaker", description: "Hold 2,500 Gauntlet points.", goal: "Hold 2,500 Gauntlet points", condition: save => (save.gauntlet?.points || 0) >= 2500, essenceReward: 20, bonus: { startingGold: 8 } },
  { id: "gauntlet_coin_purse", name: "Tournament Purse", description: "Hold 100 Tournament Coins.", goal: "Hold 100 Tournament Coins", condition: save => (save.gauntlet?.coins || 0) >= 100, essenceReward: 15, bonus: { luck: 1 } },
  { id: "gauntlet_shop_investor", name: "Arena Training", description: "Buy 10 Tournament Shop upgrade levels.", goal: "Buy 10 Gauntlet shop upgrades", condition: save => getGauntletAchievementUpgradeLevels(save) >= 10, essenceReward: 15, bonus: { maxHp: 4 } },
  { id: "gauntlet_enemy_board", name: "Monster Bracket", description: "Defeat 5 enemies from the Enemy leaderboard.", goal: "Defeat 5 ranked enemies", condition: save => getDefeatedGauntletEnemyLeaders(save) >= 5, essenceReward: 25, bonus: { damageMultiplier: 0.015 } }
];

const ACHIEVEMENTS = [
  { id: "first_steps", name: "First Steps", description: "Start your first run.", goal: "Start 1 run", condition: save => save.stats.runsStarted >= 1, essenceReward: 3, bonus: { maxHp: 2 } },
  { id: "first_victory", name: "First Victory", description: "Win your first battle.", goal: "Win 1 battle", condition: save => save.stats.battlesWon >= 1, essenceReward: 3, bonus: { damageMultiplier: 0.005 } },
  { id: "ten_battles", name: "Battle Tested", description: "Win 10 battles.", goal: "Win 10 battles", condition: save => save.stats.battlesWon >= 10, essenceReward: 5, bonus: { maxHp: 4 } },
  { id: "fifty_battles", name: "Veteran Blade", description: "Win 50 battles.", goal: "Win 50 battles", condition: save => save.stats.battlesWon >= 50, essenceReward: 10, bonus: { damageMultiplier: 0.01 } },
  { id: "hundred_enemies", name: "Line Breaker", description: "Defeat 100 enemies.", goal: "Defeat 100 enemies", condition: save => save.stats.enemiesDefeated >= 100, essenceReward: 10, bonus: { attackSpeedMultiplier: 0.01 } },
  { id: "elite_hunter", name: "Elite Hunter", description: "Defeat 10 elites.", goal: "Defeat 10 elites", condition: save => save.stats.elitesDefeated >= 10, essenceReward: 10, bonus: { armor: 1 } },
  { id: "elite_reaper", name: "Elite Reaper", description: "Defeat 500 elites.", goal: "Defeat 500 elites", condition: save => save.stats.elitesDefeated >= 500, essenceReward: 20, bonus: { armor: 1, damageMultiplier: 0.005 } },
  { id: "boss_breaker", name: "Boss Breaker", description: "Defeat 3 bosses.", goal: "Defeat 3 bosses", condition: save => save.stats.bossesDefeated >= 3, essenceReward: 10, bonus: { damageMultiplier: 0.015 } },
  { id: "boss_conqueror", name: "Boss Conqueror", description: "Defeat 100 bosses.", goal: "Defeat 100 bosses", condition: save => save.stats.bossesDefeated >= 100, essenceReward: 20, bonus: { damageMultiplier: 0.01, maxHp: 3 } },
  { id: "deep_delver", name: "Deep Delver", description: "Reach Stage 20.", goal: "Reach Stage 20", condition: save => save.highestClear >= 20, essenceReward: 10, bonus: { maxHp: 5 } },
  { id: "third_map", name: "Third March", description: "Reach Stage 30.", goal: "Reach Stage 30", condition: save => save.highestClear >= 30, essenceReward: 20, bonus: { essenceMultiplier: 0.01 } },
  { id: "essence_hoard", name: "Essence Hoard", description: "Bank 500 total Essence.", goal: "Earn 500 Essence", condition: save => save.stats.totalEssenceEarned >= 500, essenceReward: 10, bonus: { luck: 1 } },
  { id: "gold_hand", name: "Gold Hand", description: "Earn 500 total gold.", goal: "Earn 500 gold", condition: save => save.stats.totalGoldEarned >= 500, essenceReward: 5, bonus: { startingGold: 5 } },
  { id: "skill_spark", name: "Skill Spark", description: "Trigger 25 skills.", goal: "Trigger 25 skills", condition: save => save.stats.skillsTriggered >= 25, essenceReward: 5, bonus: { attackSpeedMultiplier: 0.005 } },
  { id: "skill_storm", name: "Skill Storm", description: "Trigger 150 skills.", goal: "Trigger 150 skills", condition: save => save.stats.skillsTriggered >= 150, essenceReward: 10, bonus: { damageMultiplier: 0.01 } },
  { id: "hard_path", name: "Crownfall Trial", description: "Clear at least 15 stages on hard.", goal: "Clear 15 hard stages", condition: save => save.stats.hardStagesCleared >= 15, essenceReward: 20, bonus: { armor: 1 } },
  { id: "merchant_friend", name: "Merchant Friend", description: "Visit 10 shops.", goal: "Visit 10 shops", condition: save => save.stats.shopsVisited >= 10, essenceReward: 5, bonus: { startingGold: 8 } },
  { id: "relic_keeper", name: "Relic Keeper", description: "Claim 15 relics.", goal: "Claim 15 relics", condition: save => save.stats.relicsClaimed >= 15, essenceReward: 10, bonus: { luck: 1 } },
  { id: "reward_seeker", name: "Reward Seeker", description: "Choose 30 run upgrades.", goal: "Choose 30 upgrades", condition: save => save.stats.rewardsClaimed >= 30, essenceReward: 10, bonus: { maxHp: 3 } },
  { id: "knight_oath", name: "Knight Oath", description: "Start 5 Knight runs.", goal: "Start 5 Knight runs", condition: save => save.stats.knightRuns >= 5, essenceReward: 5, bonus: { knightArmor: 1 } },
  { id: "rogue_contract", name: "Rogue Contract", description: "Start 5 Rogue runs.", goal: "Start 5 Rogue runs", condition: save => save.stats.rogueRuns >= 5, essenceReward: 5, bonus: { rogueCritChance: 0.01 } },
  { id: "knight_layer3_clear", name: "Golden Oath", description: "Win a run with the Knight by clearing Layer 3 on any difficulty.", goal: "Clear Layer 3 as Knight", condition: save => save.stats.knightLayer3Clears >= 1, essenceReward: 20, bonus: { skin: "Knight Golden Oath", knightArmor: 1 } },
  { id: "rogue_layer3_clear", name: "Gilded Contract", description: "Win a run with the Rogue by clearing Layer 3 on any difficulty.", goal: "Clear Layer 3 as Rogue", condition: save => save.stats.rogueLayer3Clears >= 1, essenceReward: 20, bonus: { skin: "Rogue Gilded Contract", rogueCritChance: 0.01 } },
  { id: "wizard_layer3_clear", name: "Auric Arcana", description: "Win a run with the Wizard by clearing Layer 3 on any difficulty.", goal: "Clear Layer 3 as Wizard", condition: save => save.stats.wizardLayer3Clears >= 1, essenceReward: 20, bonus: { skin: "Wizard Auric Arcana", damageMultiplier: 0.01 } },
  { id: "eternal_crown", name: "Eternal Crownbreaker", description: "Kill the final boss with 1,000,000 HP.", goal: "Defeat The Eternal Crown", condition: save => save.stats.finalBossKills >= 1, essenceReward: 100, bonus: { unlock: "Endless Mode", damageMultiplier: 0.08, maxHp: 40, armor: 3, luck: 3, essenceMultiplier: 0.05 } },
  ...GAUNTLET_ACHIEVEMENTS,
  ...ENEMY_KILL_ACHIEVEMENTS
];

function getPlayerGauntletAchievementRank(saveData) {
  const rank = (saveData.gauntlet?.heroLeaders || []).find(entry => entry.id === "local-player")?.rank;
  return Number.isFinite(Number(rank)) ? Number(rank) : Infinity;
}

function getGauntletAchievementUpgradeLevels(saveData) {
  return Object.values(saveData.gauntlet?.upgrades || {}).reduce((total, level) => total + Math.max(0, Math.floor(Number(level) || 0)), 0);
}

function getDefeatedGauntletEnemyLeaders(saveData) {
  return (saveData.gauntlet?.enemyLeaders || []).filter(entry => entry.defeatedByPlayer).length;
}

function getEnemySlayerBonus(index) {
  const bonuses = [
    { maxHp: 1 },
    { damageMultiplier: 0.002 },
    { attackSpeedMultiplier: 0.002 },
    { luck: 1 },
    { damageMultiplier: 0.002 }
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

function addFlatMaxHp(hero, value, heal = true) {
  const amount = Math.max(1, Math.round(value));
  hero.maxHp += amount;
  if (heal) hero.hp += amount;
  hero.hp = Math.min(hero.hp, hero.maxHp);
}

function addRoundGrowth(hero, stat, value) {
  if (!run) return;
  run.stageGrowthRelics = run.stageGrowthRelics || [];
  run.stageGrowthRelics.push({ id: `growth_${stat}_${run.stageGrowthRelics.length}`, stat, value, stages: 0 });
}

// Run upgrades, shop items, and relics use explicit stat data.
// Put values in `stats` or directly on the item to set exact values.
// Example: { name: "Sharpened Blade", rarity: "Common", stats: { damage: 5 } }
// Ability/run-only stat example: { stats: { abilityStats: { runBurnDamage: 5 } } }
// Growth exception example: { effects: [{ type: "stageGrowth", stat: "damageMultiplier", value: 0.02 }] }
// Common keys: damage, maxHp, armor, attackSpeed, regen, luck, gold, shield, shieldCapPercent, critChance,
// blockChance, lifeSteal, abilityDamage, bleedMaxHpPercent, burnChance, evasion.
const REWARDS = [
  // General Upgrades
  { name: "Sharpened Blade", rarity: "Common", stats: { damage: 8 } },
  { name: "Battle Rhythm", rarity: "Common", stats: { attackSpeed: 0.12 } },
  { name: "Iron Skin", rarity: "Common", stats: { armor: 2 } },
  { name: "Balanced Blade", rarity: "Common", stats: { damage: 10 } },
  { name: "Hardy Bread", rarity: "Common", stats: { maxHp: 35 } },
  { name: "Quick Buckle", rarity: "Common", stats: { attackSpeed: 0.08 } },
  { name: "Scout's Dice", rarity: "Common", stats: { luck: 2 } },
  { requiresNode: "unlock_starting_bonuses", name: "Prepared Camp", rarity: "Common", stats: { shield: 10 } },
  { name: "Triage Kit", rarity: "Common", stats: { maxHp: 28, regen: 1 } },
  { name: "Risky Footwork", rarity: "Common", stats: { attackSpeed: 0.14, armor: -2 } },
  { name: "Royal Purse", rarity: "Common", stats: { gold: 50 } },
  { name: "Leeching Edge", rarity: "Rare", stats: { lifeSteal: 0.03 } },
  { requiresNode: "unlock_starting_bonuses", name: "Opening Gambit", rarity: "Rare", stats: { gold: 60, luck: 2 } },
  { name: "Vitality Draught", rarity: "Rare", stats: { maxHp: 65 } },
  { name: "Lucky Charm", rarity: "Rare", stats: { critChance: 0.06 } },
  { name: "Knightly Edge", rarity: "Rare", stats: { damage: 28 } },
  { name: "Oakheart Tonic", rarity: "Rare", stats: { maxHp: 45 } },
  { name: "Clockwork Grip", rarity: "Rare", stats: { attackSpeed: 0.16 } },
  { name: "Field Medic", rarity: "Rare", stats: { maxHp: 32, armor: 2 } },
  { name: "Gilded Compass", rarity: "Rare", stats: { luck: 3, gold: 30 } },
  { name: "Reinforced Guard", rarity: "Rare", stats: { shieldCapPercent: 0.05 } },
  { name: "Barbed Buckler", rarity: "Rare", stats: { armor: 3, critChance: 0.08 } },
  { name: "Glass Canon", rarity: "Rare", stats: { damage: 40, maxHp: -80 } },
  { name: "War Training", rarity: "Epic", stats: { damage: 25, maxHp: 32 } },
  { name: "Runed Greatblade", rarity: "Epic", stats: { damage: 42 } },
  { name: "Giant's Supper", rarity: "Epic", stats: { maxHp: 150 } },
  { name: "Silver Reflexes", rarity: "Epic", stats: { attackSpeed: 0.20 } },
  { name: "Fortune's Edge", rarity: "Epic", stats: { damage: 30, critChance: 0.08, luck: 2 } },
  { name: "Iron Momentum", rarity: "Epic", stats: { armor: 9, attackSpeed: 0.1 } },
  { name: "Vampiric Training", rarity: "Epic", stats: { damage: 20, regen: 3, lifeSteal: 0.05 } },
  { name: "Storm Tempo", rarity: "Epic", stats: { attackSpeed: 0.28 } },
  { name: "Battle Renewal", rarity: "Epic", stats: { regen: 12 } },
  { name: "Battle Edge", rarity: "Epic", unlockRequirement: { type: "stat", stat: "stagesCleared", count: 20 }, effects: [{ type: "stageGrowth", stat: "damageMultiplier", value: 0.03 }] },
  { name: "Battle Heart", rarity: "Epic", unlockRequirement: { type: "bossKills", count: 2 }, effects: [{ type: "stageGrowth", stat: "maxHpMultiplier", value: 0.03 }] },
  { name: "Battle Plate", rarity: "Epic", unlockRequirement: { type: "stat", stat: "totalDamageTaken", count: 2500 }, effects: [{ type: "stageGrowth", stat: "armorMultiplier", value: 0.03 }] },
  { name: "Battle Tempo", rarity: "Epic", unlockRequirement: { type: "stat", stat: "battlesWon", count: 30 }, effects: [{ type: "stageGrowth", stat: "attackSpeedMultiplier", value: 0.03 }] },
  { name: "Goblin Breaker", rarity: "Epic", unlockRequirement: { type: "enemyKills", enemyId: "goblin", count: 50 }, stats: { damage: 50 } },
  { name: "Wolfhunter Stride", rarity: "Epic", unlockRequirement: { type: "enemyKills", enemyId: "wolf", count: 50 }, stats: { attackSpeed: 0.24 } },
  { name: "Bonecrusher Guard", rarity: "Epic", unlockRequirement: { type: "enemyKills", enemyId: "skeleton", count: 50 }, stats: { armor: 16 } },
  { name: "Ratcatcher's Draught", rarity: "Epic", unlockRequirement: { type: "enemyKills", enemyId: "plague_rat", count: 50 }, stats: { maxHp: 180 } },
  { name: "Archer's Tempo", rarity: "Epic", unlockRequirement: { type: "enemyKills", enemyId: "dark_archer", count: 50 }, stats: { attackSpeed: 0.18, critChance: 0.05 } },
  { name: "Orc Splitter", rarity: "Epic", unlockRequirement: { type: "enemyKills", enemyId: "orc", count: 50 }, stats: { damage: 50 } },
  { name: "Kingslayer Edge", rarity: "Legendary", stats: { damage: 80, critChance: 0.12 } },
  { name: "Titan Plate", rarity: "Legendary", stats: { armor: 16, maxHp: 125 } },
  { name: "Eternal Edge", rarity: "Legendary", stats: { damage: 100 } },
  { name: "Colossus Heart", rarity: "Legendary", stats: { maxHp: 200 } },
  { name: "Chrono Spurs", rarity: "Legendary", stats: { attackSpeed: 0.24 } },
  { name: "Sovereign Star", rarity: "Legendary", stats: { luck: 10, critChance: 0.1, gold: 200 } },
  { name: "Living Aegis", rarity: "Legendary", stats: { armor: 16, maxHp: 240, regen: 3 } },
  { name: "Aegis Reservoir", rarity: "Legendary", stats: { shieldCapPercent: 0.12, maxHp: 120 } },
  { name: "Crown Edge", rarity: "Legendary", unlockRequirement: { type: "bossKills", count: 12 }, effects: [{ type: "stageGrowth", stat: "damageMultiplier", value: 0.05 }] },
  { name: "Crown Heart", rarity: "Legendary", unlockRequirement: { type: "bossKills", count: 14 }, effects: [{ type: "stageGrowth", stat: "maxHpMultiplier", value: 0.05 }] },
  { name: "Crown Plate", rarity: "Legendary", unlockRequirement: { type: "stat", stat: "totalDamageTaken", count: 15000 }, effects: [{ type: "stageGrowth", stat: "armorMultiplier", value: 0.05 }] },
  { name: "Crown Tempo", rarity: "Legendary", unlockRequirement: { type: "stat", stat: "battlesWon", count: 100 }, effects: [{ type: "stageGrowth", stat: "attackSpeedMultiplier", value: 0.05 }] },
  { name: "Regent's Drill", rarity: "Legendary", unlockRequirement: { type: "bossKills", count: 8 }, stats: { damage: 150, maxHp: 80 } },
  { name: "Tyrant's Answer", rarity: "Legendary", unlockRequirement: { type: "enemyKills", enemyId: "crownfallTyrant", count: 3 }, stats: { damage: 220 } },
  { name: "Crown Duelist", rarity: "Legendary", unlockRequirement: { type: "finalBossKills", count: 1 }, stats: { attackSpeed: 0.50, critChance: 0.16 } },

  // Hero Upgrades
  { classId: "knight", name: "Shield Drill", rarity: "Common", stats: { shield: 20 } },
  { classId: "knight", name: "Plate Fitting", rarity: "Common", stats: { armor: 3, maxHp: 30 } },
  { classId: "knight", name: "Shield Timing", rarity: "Common", stats: { blockChance: 0.04 } },
  { classId: "rogue", name: "Serrated Oil", rarity: "Common", stats: { bleedMaxHpPercent: 0.013 } },
  { classId: "rogue", name: "Quickstep", rarity: "Common", stats: { attackSpeed: 0.1, evasion: 0.03 } },
  { classId: "wizard", name: "Kindling Rune", rarity: "Common", stats: { burnChance: 0.15 } },
  { classId: "wizard", name: "Arcane Focus", rarity: "Common", stats: { damage: 9, splashDamageMultiplier: 0.1 } },
  { classId: "knight", name: "Guard Stance", rarity: "Rare", stats: { blockChance: 0.07 } },
  { classId: "knight", name: "Bulwark Drill", rarity: "Rare", stats: { blockChance: 0.04, shield: 30 } },
  { classId: "knight", name: "Spiked Shield", rarity: "Rare", stats: { retaliateBlock: 0.15 } },
  { classId: "rogue", name: "Rending Cuts", rarity: "Rare", stats: { bleedMaxHpPercent: 0.014 } },
  { classId: "rogue", name: "Assassin's Eye", rarity: "Rare", stats: { critChance: 0.1, executeDamage: 0.1 } },
  { classId: "wizard", name: "Frost Thread", rarity: "Rare", stats: { slowChance: 0.2, slowValue: 0.2 } },
  { classId: "wizard", name: "Mana Ward", rarity: "Rare", stats: { splashShield: 12 } },
  { classId: "wizard", name: "Scorching Brand", rarity: "Rare", stats: { burnMaxHpPercent: 0.004 } },
  { classId: "knight", name: "Unbroken Vow", rarity: "Epic", stats: { maxHp: 90, shield: 40 } },
  { classId: "knight", name: "Castle Guard", rarity: "Epic", stats: { blockChance: 0.15 } },
  { classId: "rogue", name: "Blood Rush", rarity: "Epic", stats: { bleedMaxHpPercent: 0.018, bleedAttackSpeed: 0.08 } },
  { classId: "wizard", name: "Chain Spell", rarity: "Epic", stats: { splashDamageMultiplier: 0.20 } },
  { classId: "knight", name: "Oathbreaker Lessons", rarity: "Epic", unlockRequirement: { type: "enemyKills", enemyId: "oathbreaker", count: 20 }, stats: { armor: 8, shield: 10 } },
  { classId: "rogue", name: "Acolyte's Black Oil", rarity: "Epic", unlockRequirement: { type: "enemyKills", enemyId: "blood_acolyte", count: 20 }, stats: { abilityDamage: 12 } },
  { classId: "wizard", name: "Necromancer's Margin", rarity: "Epic", unlockRequirement: { type: "enemyKills", enemyId: "necromancer", count: 20 }, stats: { splashDamageMultiplier: 0.2, abilityStats: { runBurnDamage: 10 } } },
  { classId: "knight", name: "Royal Bastion", rarity: "Legendary", stats: { armor: 14, maxHp: 170 } },
  { classId: "rogue", name: "Deathblow Contract", rarity: "Legendary", stats: { executeDamage: 0.4, executeThreshold: 0.4 } },
  { classId: "wizard", name: "Inferno Thesis", rarity: "Legendary", stats: { abilityStats: { runBurnDamage: 15, runBurningEnemyDamage: 0.16 } } },

  // Ability Upgrades
  { requiresAbility: "wizard_curse", name: "Cruel Hex", rarity: "Rare", stats: { abilityStats: { runCurseDuration: 1.5, runCurseDamageTaken: 0.06 } } },
  { requiresAbility: "wizard_iceball", name: "Packed Ice", rarity: "Rare", stats: { abilityStats: { runIceballDamage: 0.2, runIceballDuration: 1 } } },
  { requiresAbility: "rogue_poison", name: "Toxic Reservoir", rarity: "Rare", stats: { abilityStat: "runPoisonAbilityDamage", abilityValue: 6 } },
  { requiresAbility: "rogue_bleed", name: "Barbed Trap", rarity: "Rare", stats: { abilityStat: "runTrapSlow", abilityValue: 0.08 } },
  { requiresAbility: "rogue_burn", name: "Pitch Powder", rarity: "Rare", stats: { abilityStat: "runBurnAbilityDuration", abilityValue: 1.5 } },
  { requiresAbility: "rogue_burn", name: "Charcoal Powder", rarity: "Rare", stats: { abilityStat: "runBurnDamage", abilityValue: 4, burnMaxHpPercent: 0.0025 } },
  { requiresAbility: "knight_heavy_attack", name: "Crushing Windup", rarity: "Rare", stats: { abilityStat: "runHeavyAttackMaxHpDamage", abilityValue: 0.06 } },
  { requiresAbility: "knight_holy_shield", name: "Consecrated Guard", rarity: "Rare", stats: { abilityStat: "runHolyShieldHits", abilityValue: 1 } },
  { requiresAbility: "wizard_lightning", name: "Forked Storm", rarity: "Epic", stats: { abilityStat: "runLightningTargets", abilityValue: 1 } },
  { requiresAbility: "knight_holy_sword", name: "Long Benediction", rarity: "Epic", stats: { abilityStat: "runHolySwordHits", abilityValue: 1 } },

  // Ability Unlocks
  { classId: "wizard", requiresNode: "wizard_curse_unlock", abilityId: "wizard_curse", name: "Forbidden Curse", rarity: "Mythic", text: "Unlock Curse: 2.5s cooldown, 4s duration, cursed enemy takes +22% damage", apply: hero => grantRunAbility(hero, "wizard_curse") },
  { classId: "wizard", requiresNode: "wizard_iceball_unlock", abilityId: "wizard_iceball", name: "Frozen Orb", rarity: "Mythic", text: "Unlock Iceball: 2.5s cooldown, 75% damage, 38% slow for 3.5s", apply: hero => grantRunAbility(hero, "wizard_iceball") },
  { classId: "wizard", requiresNode: "wizard_lightning_unlock", abilityId: "wizard_lightning", name: "Storm Sigil", rarity: "Mythic", text: "Unlock Lightning: 2s cooldown, hits 3 enemies for 90%/75%/60% damage", apply: hero => grantRunAbility(hero, "wizard_lightning") },
  { classId: "rogue", requiresNode: "rogue_poison_unlock", abilityId: "rogue_poison", name: "Poison Vials", rarity: "Mythic", text: "Unlock Poison: 2.8s cooldown, 4.5s duration, 9 + 0.75 per stage DPS", apply: hero => grantRunAbility(hero, "rogue_poison") },
  { classId: "rogue", requiresNode: "rogue_bleed_unlock", abilityId: "rogue_bleed", name: "Snare Kit", rarity: "Mythic", text: "Unlock Trap: 2.5s cooldown, slows all enemies by 28% for 4s and makes Rogue deal +8% damage to slowed enemies", apply: hero => grantRunAbility(hero, "rogue_bleed") },
  { classId: "rogue", requiresNode: "rogue_burn_unlock", abilityId: "rogue_burn", name: "Fire Powder", rarity: "Mythic", text: "Unlock Burn: 2.2s cooldown, 3.5s duration, stacks on one enemy, 7 + 0.55 per stage DPS", apply: hero => grantRunAbility(hero, "rogue_burn") },
  { classId: "knight", requiresNode: "knight_heavy_attack_unlock", abilityId: "knight_heavy_attack", name: "Weighted Pommel", rarity: "Mythic", text: "Unlock Heavy Attack: 3s cooldown, deals 15% max HP damage", apply: hero => grantRunAbility(hero, "knight_heavy_attack") },
  { classId: "knight", requiresNode: "knight_holy_sword_unlock", abilityId: "knight_holy_sword", name: "Blessed Oil", rarity: "Mythic", text: "Unlock Holy Sword: 4s cooldown, next 3 hits deal +50% damage", apply: hero => grantRunAbility(hero, "knight_holy_sword") },
  { classId: "knight", requiresNode: "knight_holy_shield_unlock", abilityId: "knight_holy_shield", name: "Sunlit Bulwark", rarity: "Mythic", text: "Unlock Holy Shield: 5s cooldown, +50% armor for next 2 enemy hits", apply: hero => grantRunAbility(hero, "knight_holy_shield") }
];

const SHOP_ITEMS = [
  { name: "Mercenary's Whetstone", rarity: "Common", cost: 40, stats: { damage: 8 } },
  { name: "Swiftsteel Charm", rarity: "Common", cost: 40, stats: { attackSpeed: 0.1 } },
  { name: "Apothecary Flask", rarity: "Common", cost: 40, stats: { maxHp: 36 } },
  { name: "Tempered Plates", rarity: "Common", cost: 50, stats: { armor: 3 } },
  { name: "Keen-Eye Talisman", rarity: "Rare", cost: 50, stats: { critChance: 0.1 } },
  { name: "Knight's Ration", rarity: "Common", cost: 35, stats: { maxHp: 20, regen: 1 } },
  { name: "Duelist's Oil", rarity: "Rare", cost: 60, stats: { damage: 10, critChance: 0.05 } },
  { name: "Loaded Dice", rarity: "Rare", cost: 55, stats: { luck: 4 } },
  { requiresNode: "unlock_merchants", name: "Black Market Contract", rarity: "Rare", cost: 80, stats: { damage: 14, critChance: 0.06 } },
  { requiresNode: "unlock_merchants", name: "Relic Broker's Map", rarity: "Epic", cost: 105, stats: { luck: 6, essenceMultiplier: 0.12 } },
  { name: "Spiked Greaves", rarity: "Rare", cost: 65, stats: { armor: 3, attackSpeed: 0.1 } },
  { name: "Bloodletter Kit", rarity: "Epic", cost: 90, stats: { damage: 16, critChance: 0.1, maxHp: -30 } },
  { name: "Crown Insurance", rarity: "Epic", cost: 95, stats: { maxHp: 65, regen: 2 } },
  { name: "Merchant's Star Chart", rarity: "Epic", cost: 85, stats: { luck: 4, maxHp: 36 } },
  { name: "Royal Armament", rarity: "Legendary", cost: 130, stats: { damage: 20, armor: 6, critChance: 0.08 } },
  { name: "Fatebound Crown", rarity: "Legendary", cost: 120, stats: { luck: 7, attackSpeed: 0.2 } }
];

const RELICS = [
  { id: "wolf_fang", name: "Wolf Fang", rarity: "Common", icon: "WF", stats: { damage: 15 } },
  { id: "plain_whetstone", name: "Plain Whetstone", rarity: "Common", icon: "PW", stats: { damage: 12 } },
  { id: "traveler_brooch", name: "Traveler Brooch", rarity: "Common", icon: "TB", stats: { maxHp: 60 } },
  { id: "quick_clasp", name: "Quick Clasp", rarity: "Common", icon: "QC", stats: { attackSpeed: 0.12 } },
  { id: "iron_crown", name: "Iron Crown", rarity: "Common", icon: "IC", stats: { armor: 3 } },
  { id: "war_drum", name: "War Drum", rarity: "Common", icon: "WD", stats: { attackSpeed: 0.14 } },
  { id: "old_coin", name: "Old Coin", rarity: "Common", icon: "OC", stats: { afterBattleGold: 30 } },
  { id: "clover_pin", name: "Clover Pin", rarity: "Common", icon: "CP", stats: { luck: 3 } },
  { id: "silver_spur", name: "Silver Spur", rarity: "Common", icon: "SS", stats: { gold: 120 } },
  { id: "blood_chalice", name: "Blood Chalice", rarity: "Rare", icon: "BC", stats: { regen: 6 } },
  { id: "duelist_charm", name: "Duelist Charm", rarity: "Rare", icon: "DC", stats: { damage: 22 } },
  { id: "lion_cloak", name: "Lion Cloak", rarity: "Rare", icon: "LC", stats: { maxHp: 90 } },
  { id: "silver_gear", name: "Silver Gear", rarity: "Rare", icon: "SG", stats: { attackSpeed: 0.2 } },
  { id: "ember_ring", name: "Ember Ring", rarity: "Rare", icon: "ER", stats: { critDamage: 0.75 } },
  { id: "glass_dagger", name: "Glass Dagger", rarity: "Rare", icon: "GD", stats: { damage: 30, maxHp: -38 } },
  { id: "guardian_seal", name: "Guardian Seal", rarity: "Rare", icon: "GS", stats: { firstHitReduction: 0.5 } },
  { id: "merchant_seal", requiresNode: "unlock_relics", name: "Merchant Seal", rarity: "Rare", icon: "MS", stats: { afterBattleGold: 75 } },
  { id: "coin_edge", name: "Coin Edge", rarity: "Rare", icon: "CE", stats: { goldDamageMultiplier: 0.00008 } },
  { id: "scholars_rune", name: "Scholar's Rune", rarity: "Rare", icon: "SR", stats: { essenceMultiplier: 0.20 } },
  { id: "oracle_lens", name: "Oracle Lens", rarity: "Rare", icon: "OL", stats: { luck: 6, critChance: 0.12 } },
  { id: "tower_shield", classId: "knight", name: "Tower Shield", rarity: "Rare", icon: "TS", stats: { blockChance: 0.12 } },
  { id: "shield_brace", name: "Shield Brace", rarity: "Rare", icon: "SB", stats: { shieldCapPercent: 0.05 } },
  { id: "frost_core", name: "Frost Core", rarity: "Rare", icon: "FC", requiresAbility: "wizard_iceball", stats: { abilityStat: "runIceballSlow", abilityValue: 0.15 } },
  { id: "trapwire_spool", name: "Trapwire Spool", rarity: "Rare", icon: "TS", requiresAbility: "rogue_bleed", stats: { abilityStat: "runTrapDuration", abilityValue: 2.5 } },
  { id: "red_crown_splinter", requiresNode: "unlock_relics", name: "Red Crown Splinter", rarity: "Epic", icon: "RC", stats: { damage: 45 } },
  { id: "dawn_banner", requiresNode: "unlock_relics", name: "Dawn Banner", rarity: "Epic", icon: "DB", stats: { shield: 120 } },
  { id: "aegis_core", name: "Aegis Core", rarity: "Epic", icon: "AC", stats: { shieldCapPercent: 0.08, armor: 4 } },
  { id: "gilded_edge", name: "Gilded Edge", rarity: "Epic", icon: "GE", stats: { goldDamageMultiplier: 0.00010 } },
  { id: "hunters_mark", name: "Hunter's Mark", rarity: "Epic", icon: "HM", stats: { damage: 65 } },
  { id: "executioners_file", name: "Executioner's File", rarity: "Epic", icon: "EF", stats: { damage: 72 } },
  { id: "giant_knot", name: "Giant Knot", rarity: "Epic", icon: "GK", stats: { maxHp: 180 } },
  { id: "storm_buckle", name: "Storm Buckle", rarity: "Epic", icon: "SB", stats: { attackSpeed: 0.26 } },
  { id: "sun_amulet", name: "Sun Amulet", rarity: "Epic", icon: "SA", stats: { maxHp: 195 } },
  { id: "fate_deck", name: "Fate Deck", rarity: "Epic", icon: "FD", stats: { luck: 10 } },
  { id: "blood_grail", name: "Blood Grail", rarity: "Epic", icon: "BG", stats: { lifeSteal: 0.08 } },
  { id: "oathguard_emblem", classId: "knight", name: "Oathguard Emblem", rarity: "Epic", icon: "OE", stats: { blockChance: 0.16, maxHp: 105 } },
  { id: "storm_capacitor", name: "Storm Capacitor", rarity: "Epic", icon: "SC", requiresAbility: "wizard_lightning", stats: { abilityStat: "runLightningDamage", abilityValue: 0.4 } },
  { id: "holy_reliquary", name: "Holy Reliquary", rarity: "Epic", icon: "HR", requiresAnyAbility: ["knight_holy_sword", "knight_holy_shield"], stats: { abilityStat: "runHolyCooldownReduction", abilityValue: 0.3 } },
  { id: "moonlit_armor", name: "Moonlit Armor", rarity: "Epic", icon: "MA", stats: { armor: 7, maxHp: 80 } },
  { id: "goblin_lantern", name: "Goblin Lantern", rarity: "Epic", icon: "GL", unlockRequirement: { type: "enemyKills", enemyId: "goblin", count: 75 }, stats: { damage: 45 } },
  { id: "wolfhide_lace", name: "Wolfhide Lace", rarity: "Epic", icon: "WL", unlockRequirement: { type: "enemyKills", enemyId: "wolf", count: 75 }, stats: { attackSpeed: 0.3 } },
  { id: "bandit_map", name: "Bandit Map", rarity: "Epic", icon: "BM", unlockRequirement: { type: "enemyKills", enemyId: "bandit", count: 75 }, stats: { afterBattleGold: 100 } },
  { id: "wraith_glass", name: "Wraith Glass", rarity: "Epic", icon: "WG", unlockRequirement: { type: "enemyKills", enemyId: "wraith", count: 75 }, stats: { luck: 7, critChance: 0.15 } },
  { id: "raider_spaulder", name: "Raider Spaulder", rarity: "Epic", icon: "RS", unlockRequirement: { type: "enemyKills", enemyId: "raider", count: 75 }, stats: { armor: 13 } },
  { id: "trollblood_vial", name: "Trollblood Vial", rarity: "Epic", icon: "TV", unlockRequirement: { type: "enemyKills", enemyId: "troll", count: 75 }, stats: { maxHp: 170, regen: 8 } },
  { id: "cultist_candle", name: "Cultist Candle", rarity: "Epic", icon: "CC", unlockRequirement: { type: "enemyKills", enemyId: "cultist", count: 75 }, stats: { abilityDamage: 15 } },
  { id: "crown_hound_collar", name: "Crown Hound Collar", rarity: "Epic", icon: "CH", unlockRequirement: { type: "enemyKills", enemyId: "crown_hound", count: 75 }, stats: { attackSpeed: 0.4, armor: 6 } },
  { id: "dragon_heart", name: "Dragon Heart", rarity: "Legendary", icon: "DH", stats: { maxHp: 300, regen: 10 } },
  { id: "sunforged_edge", name: "Sunforged Edge", rarity: "Legendary", icon: "SE", stats: { damage: 90} },
  { id: "titan_heart", name: "Titan Heart", rarity: "Legendary", icon: "TH", stats: { maxHp: 400 } },
  { id: "hourglass_chain", name: "Hourglass Chain", rarity: "Legendary", icon: "HC", stats: { attackSpeed: 0.6 } },
  { id: "starforged_blade", name: "Starforged Blade", rarity: "Legendary", icon: "SB", stats: { damage: 110 } },
  { id: "crown_of_chance", name: "Crown of Chance", rarity: "Legendary", icon: "CC", stats: { luck: 12, essenceMultiplier: 0.20 } },
  { id: "phoenix_ember", name: "Phoenix Ember", rarity: "Legendary", icon: "PE", stats: { attackSpeed: 0.36, critChance: 0.20 } },
  { id: "kingwall_sigil", classId: "knight", name: "Kingwall Sigil", rarity: "Legendary", icon: "KS", stats: { blockChance: 0.25 } },
  { id: "campaign_heart", name: "Campaign Heart", rarity: "Legendary", icon: "CH", unlockRequirement: { type: "bossKills", count: 10 }, effects: [{ type: "stageGrowth", stat: "maxHpMultiplier", value: 0.06 }] },
  { id: "campaign_blade", name: "Campaign Blade", rarity: "Legendary", icon: "CB", unlockRequirement: { type: "enemyKills", enemyId: "fallenKing", count: 4 }, effects: [{ type: "stageGrowth", stat: "damageMultiplier", value: 0.06 }] },
  { id: "campaign_spurs", name: "Campaign Spurs", rarity: "Legendary", icon: "CS", unlockRequirement: { type: "enemyKills", enemyId: "wolf", count: 100 }, effects: [{ type: "stageGrowth", stat: "attackSpeedMultiplier", value: 0.06 }] },
  { id: "campaign_plate", name: "Campaign Plate", rarity: "Legendary", icon: "CP", unlockRequirement: { type: "enemyKills", enemyId: "armored_knight", count: 100 }, effects: [{ type: "stageGrowth", stat: "armorMultiplier", value: 0.06 }] },
  { id: "fallen_knight_banner", name: "Fallen Knight Banner", rarity: "Legendary", icon: "FB", unlockRequirement: { type: "enemyKills", enemyId: "fallen_knight", count: 100 }, stats: { armor: 8, shield: 20 } },
  { id: "ashen_regent_coal", name: "Ashen Regent Coal", rarity: "Legendary", icon: "AR", unlockRequirement: { type: "enemyKills", enemyId: "ashenRegent", count: 15 }, stats: { damage: 133 } },
  { id: "eternal_crown_shard", name: "Eternal Crown Shard", rarity: "Legendary", icon: "EC", unlockRequirement: { type: "finalBossKills", count: 3 }, effects: [{ type: "stageGrowth", stat: "damageMultiplier", value: 0.06 }] },
  { id: "kingbreaker_plate", name: "Kingbreaker Plate", rarity: "Legendary", icon: "KP", unlockRequirement: { type: "bossKills", count: 15 }, stats: { armor: 12, maxHp: 235 } }
];

const DIRECT_STAT_KEYS = [
  "damage", "maxHp", "armor", "attackSpeed", "regen", "luck", "gold", "shield", "shieldCapPercent", "blockChance", "critChance",
  "critDamage", "lifeSteal", "essenceMultiplier", "afterBattleGold", "firstHitReduction", "abilityDamage",
  "goldDamageMultiplier",
  "retaliateBlock", "hitRetaliateChance", "lowHpDamage", "bleedMaxHpPercent", "bleedAttackSpeed", "burnChance",
  "burnSpreadChance", "burnMaxHpPercent", "poisonChance", "poisonAttackDamage", "evasion", "evasionCounter",
  "executeDamage", "executeThreshold", "killAttackSpeed", "killAttackSpeedMax", "slowChance", "slowValue",
  "slowedEnemyDamage", "splashShield", "splashDamageMultiplier", "thirdAttackBonus", "meteorChance",
  "meteorDamageMultiplier"
];

applyCharacterUnlockRequirements();
rebalanceRunItems();

function applyCharacterUnlockRequirements() {
  const rewardRequirements = {
    "Vampiric Training": { type: "heroEnemyKills", classId: "rogue", count: 100 },
    "Battle Renewal": { type: "heroMaxHp", classId: "knight", count: 2500 },
    "Storm Tempo": { type: "heroEnemyKills", classId: "rogue", count: 150 },
    "Fortune's Edge": { type: "heroEnemyKills", classId: "rogue", count: 125 },
    "Sovereign Star": { type: "heroEnemyKills", classId: "wizard", count: 200 },
    "Living Aegis": { type: "heroMaxHp", classId: "knight", count: 4500 }
  };
  const relicRequirements = {
    executioners_file: { type: "heroEnemyKills", classId: "rogue", count: 100 },
    giant_knot: { type: "heroMaxHp", classId: "knight", count: 2500 },
    storm_buckle: { type: "heroEnemyKills", classId: "rogue", count: 100 },
    sun_amulet: { type: "heroMaxHp", classId: "knight", count: 3000 },
    fate_deck: { type: "heroEnemyKills", classId: "wizard", count: 100 },
    dragon_heart: { type: "heroMaxHp", classId: "knight", count: 5000 },
    titan_heart: { type: "heroMaxHp", classId: "knight", count: 5000 },
    hourglass_chain: { type: "heroEnemyKills", classId: "rogue", count: 200 },
    starforged_blade: { type: "heroEnemyKills", classId: "wizard", count: 250 },
    phoenix_ember: { type: "heroEnemyKills", classId: "wizard", count: 150 },
    moonlit_armor: { type: "heroMaxHp", classId: "knight", count: 3500 }
  };
  REWARDS.forEach(reward => {
    if (rewardRequirements[reward.name] && !reward.unlockRequirement) reward.unlockRequirement = rewardRequirements[reward.name];
  });
  RELICS.forEach(relic => {
    if (relicRequirements[relic.id] && !relic.unlockRequirement) relic.unlockRequirement = relicRequirements[relic.id];
  });
}

const CLASS_TALENT_STAGES = [5, 15, 25];

const CLASS_TALENTS = {
  knight: [
    { id: "knight_shield_wall", classId: "knight", name: "Shield Wall", icon: "SW", tier: 1, stats: { shield: 40 } },
    { id: "knight_retaliation", classId: "knight", name: "Retaliation", icon: "RT", tier: 1, stats: { blockChance: 0.04 } },
    { id: "knight_heavy_armor", classId: "knight", name: "Heavy Armor", icon: "HA", tier: 2, stats: { armor: 4 } },
    { id: "knight_royal_guard", classId: "knight", name: "Royal Guard", icon: "RG", tier: 2, stats: { armor: 4, shield: 24 } },
    { id: "knight_unshaken", classId: "knight", name: "Unshaken", icon: "US", tier: 3, stats: { maxHp: 80, regen: 2 } },
    { id: "knight_last_stand", classId: "knight", name: "Last Stand", icon: "LS", tier: 3, stats: { maxHp: 60, damage: 8 } }
  ],
  rogue: [
    { id: "rogue_deep_cuts", classId: "rogue", name: "Deep Cuts", icon: "DC", tier: 1, stats: { bleedMaxHpPercent: 0.004 } },
    { id: "rogue_venom_blade", classId: "rogue", name: "Venom Blade", icon: "VB", tier: 1, stats: { poisonAttackDamage: 4 } },
    { id: "rogue_backstab", classId: "rogue", name: "Shadow Backstab", icon: "SB", tier: 2, stats: { critDamage: 0.24 } },
    { id: "rogue_evasion", classId: "rogue", name: "Evasion", icon: "EV", tier: 2, stats: { evasion: 0.06 } },
    { id: "rogue_momentum", classId: "rogue", name: "Momentum", icon: "MO", tier: 3, stats: { attackSpeed: 0.12 } },
    { id: "rogue_executioner", classId: "rogue", name: "Executioner", icon: "EX", tier: 3, stats: { damage: 10, critChance: 0.06 } }
  ],
  wizard: [
    { id: "wizard_wildfire_spark", classId: "wizard", name: "Wildfire Spark", icon: "WS", tier: 1, stats: { burnChance: 0.08 } },
    { id: "wizard_arcane_ward", classId: "wizard", name: "Arcane Ward", icon: "AW", tier: 1, stats: { shield: 32 } },
    { id: "wizard_frostbite_hex", classId: "wizard", name: "Frostbite Hex", icon: "FH", tier: 2, stats: { slowChance: 0.08, slowValue: 0.08 } },
    { id: "wizard_mana_surge", classId: "wizard", name: "Mana Surge", icon: "MS", tier: 2, stats: { abilityDamage: 8 } },
    { id: "wizard_runic_focus", classId: "wizard", name: "Runic Focus", icon: "RF", tier: 3, stats: { splashDamageMultiplier: 0.12 } },
    { id: "wizard_meteor_spark", classId: "wizard", name: "Meteor Spark", icon: "MT", tier: 3, stats: { damage: 12, abilityDamage: 6 } }
  ]
};

rebalanceClassTalents();

function rebalanceRunItems() {
  REWARDS.forEach(configureRunUpgrade);
  SHOP_ITEMS.forEach(configureShopUpgrade);
  RELICS.forEach(configureRelic);
}

function configureRunUpgrade(upgrade) {
  if (upgrade.abilityId || upgrade.rarity === "Mythic") return;
  configureExplicitItemEffects(upgrade, "text");
}

function configureShopUpgrade(item) {
  configureExplicitItemEffects(item, "text");
}

function configureRelic(relic) {
  configureExplicitItemEffects(relic, "description");
}

function configureExplicitItemEffects(item, displayKey) {
  if (!item || item.effects) {
    if (item?.effects?.length) {
      item[displayKey] = formatItemEffects(item.effects);
      item.apply = hero => applyItemEffects(hero, item.effects);
    }
    return;
  }
  if (item.effect?.type === "stageGrowth") {
    item.effects = [{ type: "stageGrowth", stat: item.effect.stat, value: item.effect.value }];
  } else {
    const stats = getDirectStatBonus(item);
    if (!stats) return;
    item.effects = createItemEffects(stats, item.growth || null, { normalize: false });
  }
  item[displayKey] = formatItemEffects(item.effects);
  item.apply = hero => applyItemEffects(hero, item.effects);
}

function rebalanceClassTalents() {
  Object.values(CLASS_TALENTS).flat().forEach(talent => {
    const stats = getDirectStatBonus(talent);
    if (!stats) return;
    talent.effects = createItemEffects(stats, talent.growth || null, { normalize: false });
    talent.description = formatItemEffects(talent.effects);
    talent.effect = { type: "flatBundle", flat: stats, growth: talent.growth || null };
  });
}

function getDirectStatBonus(item) {
  if (!item || typeof item !== "object") return null;
  const stats = { ...(item.stats || {}) };
  DIRECT_STAT_KEYS.forEach(key => {
    if (item[key] !== undefined && item[key] !== null && item[key] !== 0) stats[key] = item[key];
  });
  if (item.abilityStat && item.abilityValue) {
    stats.abilityStat = item.abilityStat;
    stats.abilityValue = item.abilityValue;
  }
  return Object.keys(stats).length ? stats : null;
}

function roundEven(value) {
  const sign = value < 0 ? -1 : 1;
  const amount = Math.abs(Number(value) || 0);
  if (!amount) return 0;
  return sign * Math.max(2, Math.round(amount / 2) * 2);
}

function normalizePercentValue(value) {
  const sign = value < 0 ? -1 : 1;
  const percent = Math.abs(Number(value) || 0) * 100;
  if (!percent) return 0;
  return sign * Math.max(0.02, Math.round(percent / 2) * 2 / 100);
}

function createItemEffects(flat = {}, growth = null, options = {}) {
  const normalize = options.normalize !== false;
  const effects = Object.entries(flat)
    .filter(([stat]) => stat !== "abilityStat" && stat !== "abilityValue" && stat !== "abilityStats")
    .filter(([, value]) => value !== undefined && value !== null && value !== 0)
    .map(([stat, value]) => ({ type: "flat", stat, value: normalize ? normalizeEffectValue(stat, value) : value }));
  if (flat.abilityStat && flat.abilityValue) effects.push({ type: "flat", stat: "abilityStat", targetStat: flat.abilityStat, value: flat.abilityValue });
  Object.entries(flat.abilityStats || {}).forEach(([targetStat, value]) => {
    if (value !== undefined && value !== null && value !== 0) effects.push({ type: "flat", stat: "abilityStat", targetStat, value });
  });
  if (growth) effects.push({ type: "stageGrowth", stat: growth.stat, value: growth.value });
  return effects;
}

function normalizeEffectValue(stat, value) {
  if (["damage", "maxHp", "armor", "regen", "luck", "gold", "shield", "afterBattleGold", "abilityDamage", "poisonAttackDamage", "splashShield"].includes(stat)) return roundEven(value);
  if (stat === "attackSpeed") return normalizePercentValue(value);
  if ([
    "blockChance", "critChance", "critDamage", "lifeSteal", "essenceMultiplier", "firstHitReduction", "retaliateBlock", "hitRetaliateChance",
    "lowHpDamage", "bleedAttackSpeed", "burnChance", "burnSpreadChance", "poisonChance", "evasion", "evasionCounter", "executeDamage",
    "killAttackSpeed", "slowChance", "slowValue", "slowedEnemyDamage", "splashDamageMultiplier", "thirdAttackBonus", "meteorChance"
  ].includes(stat)) return normalizePercentValue(value);
  return value;
}

function applyItemEffects(hero, effects = []) {
  (effects || []).forEach(effect => applyItemEffect(hero, effect));
}

function applyItemEffect(hero, effect = {}) {
  if (!hero || !effect) return;
  if (effect.type === "stageGrowth") return addRoundGrowth(hero, effect.stat, effect.value);
  if (effect.type !== "flat") return;
  if (effect.stat === "abilityStat") return hero[effect.targetStat] = (hero[effect.targetStat] || 0) + effect.value;
  applyFlatUpgrade(hero, { [effect.stat]: effect.value });
}

function formatItemEffects(effects = []) {
  const flat = {};
  let growth = null;
  (effects || []).forEach(effect => {
    if (effect.type === "stageGrowth") growth = { stat: effect.stat, value: effect.value };
    if (effect.type === "flat" && effect.stat === "abilityStat") {
      flat.abilityStats = flat.abilityStats || {};
      flat.abilityStats[effect.targetStat] = effect.value;
    } else if (effect.type === "flat") flat[effect.stat] = effect.value;
  });
  return getFlatUpgradeText(flat, growth);
}

function applyFlatUpgrade(hero, flat = {}, growth = null) {
  if (flat.damage) hero.damage += flat.damage;
  if (flat.attackSpeed) hero.attackSpeed += flat.attackSpeed;
  if (flat.maxHp) addFlatMaxHp(hero, flat.maxHp, flat.maxHp > 0);
  if (flat.armor) hero.armor += flat.armor;
  if (flat.regen) hero.regen = (hero.regen || 0) + flat.regen;
  if (flat.luck) hero.luck = (hero.luck || 0) + flat.luck;
  if (flat.gold) { run.gold += flat.gold; if (run.summary) run.summary.goldEarned += flat.gold; }
  if (flat.shield) hero.runStartShield = (hero.runStartShield || 0) + flat.shield;
  if (flat.shieldCapPercent) hero.runShieldCapPercent = (hero.runShieldCapPercent || 0) + flat.shieldCapPercent;
  if (flat.blockChance) hero.runBlockChance = (hero.runBlockChance || 0) + flat.blockChance;
  if (flat.critChance) hero.crit += flat.critChance;
  if (flat.critDamage) hero.runCritDamage = (hero.runCritDamage || 0) + flat.critDamage;
  if (flat.lifeSteal) hero.lifeSteal = (hero.lifeSteal || 0) + flat.lifeSteal;
  if (flat.essenceMultiplier) hero.runEssenceMultiplier = (hero.runEssenceMultiplier || 0) + flat.essenceMultiplier;
  if (flat.afterBattleGold) hero.runAfterBattleGold = (hero.runAfterBattleGold || 0) + flat.afterBattleGold;
  if (flat.firstHitReduction) hero.runFirstHitReduction = (hero.runFirstHitReduction || 0) + flat.firstHitReduction;
  if (flat.abilityStat) hero[flat.abilityStat] = (hero[flat.abilityStat] || 0) + flat.abilityValue;
  if (flat.abilityDamage) hero.runAbilityFlatDamage = (hero.runAbilityFlatDamage || 0) + flat.abilityDamage;
  if (flat.goldDamageMultiplier) hero.runGoldDamageMultiplier = (hero.runGoldDamageMultiplier || 0) + flat.goldDamageMultiplier;
  if (flat.retaliateBlock) hero.runRetaliateBlock = (hero.runRetaliateBlock || 0) + flat.retaliateBlock;
  if (flat.hitRetaliateChance) hero.runHitRetaliateChance = (hero.runHitRetaliateChance || 0) + flat.hitRetaliateChance;
  if (flat.lowHpDamage) hero.runLowHpDamage = (hero.runLowHpDamage || 0) + flat.lowHpDamage;
  if (flat.bleedMaxHpPercent) hero.runBleedMaxHpPercent = (hero.runBleedMaxHpPercent || 0) + flat.bleedMaxHpPercent;
  if (flat.bleedAttackSpeed) hero.runBleedAttackSpeed = (hero.runBleedAttackSpeed || 0) + flat.bleedAttackSpeed;
  if (flat.burnChance) hero.runBurnChance = (hero.runBurnChance || 0) + flat.burnChance;
  if (flat.burnSpreadChance) hero.runBurnSpreadChance = (hero.runBurnSpreadChance || 0) + flat.burnSpreadChance;
  if (flat.burnMaxHpPercent) hero.runBurnMaxHpPercent = (hero.runBurnMaxHpPercent || 0) + flat.burnMaxHpPercent;
  if (flat.poisonChance) hero.runPoisonChance = (hero.runPoisonChance || 0) + flat.poisonChance;
  if (flat.poisonAttackDamage) hero.runPoisonAttackDamage = (hero.runPoisonAttackDamage || 0) + flat.poisonAttackDamage;
  if (flat.evasion) hero.runEvasion = (hero.runEvasion || 0) + flat.evasion;
  if (flat.evasionCounter) hero.runEvasionCounter = (hero.runEvasionCounter || 0) + flat.evasionCounter;
  if (flat.executeDamage) hero.runExecuteDamage = (hero.runExecuteDamage || 0) + flat.executeDamage;
  if (flat.executeThreshold) hero.runExecuteThreshold = Math.max(hero.runExecuteThreshold || 0, flat.executeThreshold);
  if (flat.killAttackSpeed) hero.runKillAttackSpeed = (hero.runKillAttackSpeed || 0) + flat.killAttackSpeed;
  if (flat.killAttackSpeedMax) hero.runKillAttackSpeedMax = Math.max(hero.runKillAttackSpeedMax || 0, flat.killAttackSpeedMax);
  if (flat.slowChance) hero.runSlowChance = (hero.runSlowChance || 0) + flat.slowChance;
  if (flat.slowValue) hero.runSlowValue = (hero.runSlowValue || 0) + flat.slowValue;
  if (flat.slowedEnemyDamage) hero.runSlowedEnemyDamage = (hero.runSlowedEnemyDamage || 0) + flat.slowedEnemyDamage;
  if (flat.splashShield) hero.runSplashShield = (hero.runSplashShield || 0) + flat.splashShield;
  if (flat.splashDamageMultiplier) hero.runSplashDamageMultiplier = (hero.runSplashDamageMultiplier || 0) + flat.splashDamageMultiplier;
  if (flat.thirdAttackBonus) hero.runThirdAttackBonus = (hero.runThirdAttackBonus || 0) + flat.thirdAttackBonus;
  if (flat.meteorChance) hero.runMeteorChance = (hero.runMeteorChance || 0) + flat.meteorChance;
  if (flat.meteorDamageMultiplier) hero.runMeteorDamageMultiplier = Math.max(hero.runMeteorDamageMultiplier || 0, flat.meteorDamageMultiplier);
  if (growth) addRoundGrowth(hero, growth.stat, growth.value);
}

function getFlatUpgradeText(flat = {}, growth = null) {
  const parts = [];
  if (flat.damage) parts.push(`${formatEvenSigned(flat.damage)} damage`);
  if (flat.attackSpeed) parts.push(`${formatEvenSigned(flat.attackSpeed)} attack speed`);
  if (flat.maxHp) parts.push(`${formatEvenSigned(flat.maxHp)} max HP`);
  if (flat.armor) parts.push(`${formatEvenSigned(flat.armor)} armor`);
  if (flat.regen) parts.push(`${formatEvenSigned(flat.regen)} HP regen`);
  if (flat.luck) parts.push(`${formatEvenSigned(flat.luck)} Luck`);
  if (flat.gold) parts.push(`${formatEvenSigned(flat.gold)} gold`);
  if (flat.shield) parts.push(`${formatEvenSigned(flat.shield)} battle-start shield`);
  if (flat.shieldCapPercent) parts.push(`${formatPercent(flat.shieldCapPercent)} shield cap`);
  if (flat.blockChance) parts.push(`${formatPercent(flat.blockChance)} block chance`);
  if (flat.critChance) parts.push(`${formatPercent(flat.critChance)} crit chance`);
  if (flat.critDamage) parts.push(`${formatPercent(flat.critDamage)} crit damage`);
  if (flat.lifeSteal) parts.push(`${formatPercent(flat.lifeSteal)} life steal`);
  if (flat.essenceMultiplier) parts.push(`${formatPercent(flat.essenceMultiplier)} Essence earned`);
  if (flat.afterBattleGold) parts.push(`${formatEvenSigned(flat.afterBattleGold)} gold after each battle`);
  if (flat.firstHitReduction) parts.push(`${formatPercent(flat.firstHitReduction)} first-hit damage reduction`);
  if (flat.abilityStat) parts.push(formatAbilityStatText(flat.abilityStat, flat.abilityValue));
  Object.entries(flat.abilityStats || {}).forEach(([stat, value]) => parts.push(formatAbilityStatText(stat, value)));
  if (flat.abilityDamage) parts.push(`${formatEvenSigned(flat.abilityDamage)} skill damage`);
  if (flat.goldDamageMultiplier) parts.push(`${formatPercent(flat.goldDamageMultiplier * 100)} damage per 100 gold`);
  if (flat.retaliateBlock) parts.push(`${formatPercent(flat.retaliateBlock)} block retaliation`);
  if (flat.hitRetaliateChance) parts.push(`${formatPercent(flat.hitRetaliateChance)} hit retaliation chance`);
  if (flat.lowHpDamage) parts.push(`${formatPercent(flat.lowHpDamage)} low-HP damage`);
  if (flat.bleedMaxHpPercent) parts.push(`${formatPercent(flat.bleedMaxHpPercent)} max HP bleed DPS`);
  if (flat.bleedAttackSpeed) parts.push(`${formatPercent(flat.bleedAttackSpeed)} bleed attack speed`);
  if (flat.burnChance) parts.push(`${formatPercent(flat.burnChance)} burn chance`);
  if (flat.burnSpreadChance) parts.push(`${formatPercent(flat.burnSpreadChance)} burn spread chance`);
  if (flat.burnMaxHpPercent) parts.push(`${formatPercent(flat.burnMaxHpPercent)} max HP burn DPS`);
  if (flat.poisonChance) parts.push(`${formatPercent(flat.poisonChance)} poison chance`);
  if (flat.poisonAttackDamage) parts.push(`${formatEvenSigned(flat.poisonAttackDamage)} poison damage`);
  if (flat.evasion) parts.push(`${formatPercent(flat.evasion)} evasion`);
  if (flat.evasionCounter) parts.push(`${formatPercent(flat.evasionCounter)} evasion counter damage`);
  if (flat.executeDamage) parts.push(`${formatPercent(flat.executeDamage)} execute damage`);
  if (flat.executeThreshold) parts.push(`execute below ${formatPercent(flat.executeThreshold)}`);
  if (flat.killAttackSpeed) parts.push(`${formatPercent(flat.killAttackSpeed)} attack speed on kill`);
  if (flat.slowChance) parts.push(`${formatPercent(flat.slowChance)} slow chance`);
  if (flat.slowValue) parts.push(`${formatPercent(flat.slowValue)} slow power`);
  if (flat.slowedEnemyDamage) parts.push(`${formatPercent(flat.slowedEnemyDamage)} damage to slowed enemies`);
  if (flat.splashShield) parts.push(`${formatEvenSigned(flat.splashShield)} splash shield`);
  if (flat.splashDamageMultiplier) parts.push(`${formatPercent(flat.splashDamageMultiplier)} splash damage`);
  if (flat.thirdAttackBonus) parts.push(`${formatPercent(flat.thirdAttackBonus)} third-attack bonus`);
  if (flat.meteorChance) parts.push(`${formatPercent(flat.meteorChance)} meteor chance`);
  if (growth) parts.push(`${formatPercent(growth.value)} ${formatGrowthStat(growth.stat)} after each stage`);
  return parts.join(", ") || "Flat run bonus";
}

function getHeroGoldDamageMultiplier(hero) {
  const rate = hero?.runGoldDamageMultiplier || 0;
  if (!rate || typeof run === "undefined" || !run) return 0;
  return Math.max(0, Math.floor(run.gold || 0) * rate);
}

function formatSigned(value) {
  const rounded = Math.round(value * 100) / 100;
  return `${rounded >= 0 ? "+" : ""}${rounded}`;
}

function formatEvenSigned(value) {
  const rounded = Math.round((Number(value) || 0) * 100) / 100;
  return `${rounded >= 0 ? "+" : ""}${rounded}`;
}

function formatPercent(value) {
  return formatExactPercent(value);
}

function formatExactPercent(value) {
  const rounded = Math.round((Number(value) || 0) * 1000) / 10;
  return `${rounded >= 0 ? "+" : ""}${Number.isInteger(rounded) ? rounded.toFixed(0) : rounded}%`;
}

function formatAbilityStatText(stat, value) {
  const labels = {
    runAbilityFlatDamage: "skill damage",
    runLightningDamage: "Lightning damage",
    runIceballSlow: "Iceball slow",
    runTrapDuration: "Trap duration",
    runHolyCooldownReduction: "Holy cooldown reduction",
    runBurnDamage: "burn damage",
    runBurningEnemyDamage: "damage to burning enemies",
    runCurseDuration: "Curse duration",
    runCurseDamageTaken: "Curse damage taken",
    runIceballDamage: "Iceball damage",
    runIceballDuration: "Iceball duration",
    runLightningTargets: "Lightning targets",
    runPoisonAbilityDamage: "Poison damage",
    runTrapSlow: "Trap slow",
    runBurnAbilityDuration: "Burn duration",
    runHeavyAttackMaxHpDamage: "Heavy Attack max HP damage",
    runHolySwordHits: "Holy Sword hits",
    runHolyShieldHits: "Holy Shield hits"
  };
  const label = labels[stat] || stat.replace(/^run/, "").replace(/([A-Z])/g, " $1").trim().toLowerCase();
  if (/duration$/.test(label)) return `${formatSigned(value)}s ${label}`;
  if (/targets?$|hits?$/.test(label)) return `${formatSigned(value)} ${label}`;
  if (/damage$/.test(label) && Math.abs(value) >= 1) return `${formatSigned(value)} ${label}`;
  return `${formatExactPercent(value)} ${label}`;
}

function formatGrowthStat(stat = "") {
  return ({ mainStatsMultiplier: "damage, max HP, armor, and attack speed", damageMultiplier: "damage", maxHpMultiplier: "max HP", attackSpeedMultiplier: "attack speed", armorMultiplier: "armor" })[stat] || stat.replace(/([A-Z])/g, " $1");
}

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
  { id: "old_campaigns", classId: "global", branch: "Crown", name: "Old Campaigns", description: "+1 starting HP and +1 armor per level.", cost: 90, maxLevel: 4, effect: { maxHp: 1, armor: 1 }, x: 580, y: 500, prerequisites: ["armor"], type: "notable" },
  { id: "duelist_lessons", classId: "global", branch: "Crown", name: "Duelist Lessons", description: "+2% crit chance per level for all classes.", cost: 95, maxLevel: 5, effect: { critChance: 0.02 }, x: 1440, y: 670, prerequisites: ["field_drills"], type: "stat" },
  { id: "life_siphon", classId: "global", branch: "Crown", name: "Life Siphon", description: "+1% life steal per level for all classes.", cost: 90, maxLevel: 5, effect: { lifeSteal: 0.01 }, x: 1300, y: 540, prerequisites: ["field_drills"], type: "stat" },
  { id: "marching_songs", classId: "global", branch: "Crown", name: "Marching Songs", description: "+0.03 attack speed per level for all classes.", cost: 95, maxLevel: 5, effect: { attackSpeed: 0.03 }, x: 1220, y: 670, prerequisites: ["field_drills"], type: "stat" },
  { id: "veteran_bounty", classId: "global", branch: "Crown", name: "Veteran Bounty", description: "Elite fights grant +4% gold and Essence per level.", cost: 130, maxLevel: 3, effect: { eliteRewardMultiplier: 0.04 }, x: 2180, y: 360, prerequisites: ["royal_tithe"], type: "notable" },
  { id: "castle_stores", classId: "global", branch: "Crown", name: "Castle Stores", description: "+25 starting HP and +8 starting gold per level.", cost: 130, maxLevel: 3, effect: { maxHp: 25, startingGold: 8 }, x: 420, y: 360, prerequisites: ["old_campaigns"], type: "notable" },
  { id: "crown_doctrine", classId: "global", branch: "Crown", name: "Crown Doctrine", description: "A costly general mastery node for all classes: +3 damage, +35 HP, and +2% Essence earned.", cost: 240, maxLevel: 2, effect: { damage: 3, maxHp: 35, essenceMultiplier: 0.02 }, x: 980, y: 430, prerequisites: ["essence"], type: "capstone" },
  { id: "royal_mender", classId: "global", branch: "Crown", name: "Royal Mender", description: "+1 HP regen while in battle per level.", cost: 150, maxLevel: 5, effect: { regen: 1 }, x: 300, y: 220, prerequisites: ["castle_stores"], type: "notable" },
  { id: "sanctuary_blessing", classId: "global", branch: "Crown", name: "Sanctuary Blessing", description: "Sanctuaries grant +50 max HP and +1 HP regen per level.", costs: [100, 200, 300], maxLevel: 3, effect: { sanctuaryMaxHp: 50, sanctuaryRegen: 1 }, x: 520, y: 80, prerequisites: ["royal_mender"], type: "notable" },
  { id: "battle_trance", classId: "global", branch: "Crown", name: "Battle Trance", description: "+3 damage and +0.05 attack speed per level.", cost: 155, maxLevel: 3, effect: { damage: 3, attackSpeed: 0.05 }, x: 2300, y: 220, prerequisites: ["veteran_bounty"], type: "notable" },
  { id: "crown_dice", classId: "global", branch: "Crown", name: "Crown Dice", description: "+1 reroll per reward, relic, and shop offer per level.", costs: [100, 200], maxLevel: 2, effect: { rerolls: 1 }, x: 2480, y: 220, prerequisites: ["battle_trance"], type: "notable" },
  { id: "ancient_charter", classId: "global", branch: "Crown", name: "Ancient Charter", description: "+5% Essence earned per level.", cost: 50, maxLevel: 5, effect: { essenceMultiplier: 0.05 }, x: 820, y: 270, prerequisites: ["crown_doctrine"], type: "capstone" },
  { id: "unlock_relics", classId: "global", branch: "Unlocks", name: "Sealed Reliquary", description: "Unlocks new relics in future runs.", cost: 180, maxLevel: 1, effect: {}, x: 560, y: 160, prerequisites: ["royal_mender"], type: "unlock" },
  { id: "unlock_events", classId: "global", branch: "Unlocks", name: "Hidden Roads", description: "Unlocks treasure route events on the map.", cost: 160, maxLevel: 1, effect: {}, x: 1040, y: 160, prerequisites: ["ancient_charter"], type: "unlock" },
  { id: "unlock_merchants", classId: "global", branch: "Unlocks", name: "Black Market", description: "Unlocks additional merchant stock in shops.", cost: 170, maxLevel: 1, effect: {}, x: 2180, y: 80, prerequisites: ["battle_trance"], type: "unlock" },
  { id: "unlock_enemies", classId: "global", branch: "Unlocks", name: "Wanted Posters", description: "Unlocks dangerous new enemies that can drop higher rewards.", cost: 150, maxLevel: 1, effect: {}, x: 2480, y: 260, prerequisites: ["battle_trance"], type: "unlock" },
  { id: "unlock_starting_bonuses", classId: "global", branch: "Unlocks", name: "Campaign Kit", description: "Unlocks starting bonus rewards and grants +10 battle-start shield.", cost: 155, maxLevel: 1, effect: { battleStartShield: 10 }, x: 300, y: 80, prerequisites: ["royal_mender"], type: "unlock" },

  { id: "knight_root", classId: "knight", branch: "Knight", name: "Knight Branch", description: "Unlocks Knight upgrades. +10 starting HP and +1 armor.", cost: 50, maxLevel: 1, effect: { maxHp: 10, armor: 1 }, x: 980, y: 1050, prerequisites: ["crown_legacy"], type: "class" },
  { id: "wizard_root", classId: "wizard", branch: "Wizard", name: "Wizard Branch", description: "Unlocks Wizard upgrades. +2 starting damage and +15 starting HP.", cost: 50, maxLevel: 1, effect: { damage: 2, maxHp: 15 }, x: 1620, y: 1050, prerequisites: ["crown_legacy"], type: "class" },
  { id: "rogue_root", classId: "rogue", branch: "Rogue", name: "Rogue Branch", description: "Unlocks Rogue upgrades. +1 starting damage and +0.03 attack speed.", cost: 50, maxLevel: 1, effect: { damage: 1, attackSpeed: 0.03 }, x: 1300, y: 1320, prerequisites: ["crown_legacy"], type: "class" },

  { id: "knight_plate", classId: "knight", branch: "Armor/Health", name: "Plate Training", description: "+2 starting armor per level.", cost: 55, maxLevel: 4, effect: { armor: 2 }, x: 780, y: 780, prerequisites: ["knight_root"], type: "stat" },
  { id: "knight_vigor", classId: "knight", branch: "Armor/Health", name: "Oathbound Vigor", description: "+14 starting HP per level.", cost: 70, maxLevel: 4, effect: { maxHp: 14 }, x: 580, y: 720, prerequisites: ["knight_plate"], type: "stat" },
  { id: "knight_iron_will", classId: "knight", branch: "Armor/Health", name: "Iron Will", description: "+1 armor and +1 HP regen per level.", cost: 120, maxLevel: 3, effect: { armor: 1, regen: 1 }, x: 380, y: 660, prerequisites: ["knight_vigor"], type: "notable" },
  { id: "knight_iron_bastion", classId: "knight", branch: "Armor/Health", name: "Iron Bastion", description: "Capstone: +6 armor, +60 starting HP, and +3 HP regen.", cost: 285, maxLevel: 1, effect: { armor: 6, maxHp: 60, regen: 3 }, x: 180, y: 600, prerequisites: ["knight_iron_will"], type: "capstone" },

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
  { id: "knight_banner", classId: "knight", branch: "Crown Guard", name: "Battle Banner", description: "+8% damage and +5% elite rewards per level.", cost: 155, maxLevel: 3, effect: { damageMultiplier: 0.08, eliteRewardMultiplier: 0.05 }, x: 380, y: 1440, prerequisites: ["knight_crown_guard_meta"], type: "notable" },
  { id: "knight_warlord_oath", classId: "knight", branch: "Crown Guard", name: "Warlord's Oath", description: "Capstone: +35% damage and +8 starting armor.", cost: 300, maxLevel: 1, effect: { damageMultiplier: 0.35, armor: 8 }, x: 180, y: 1500, prerequisites: ["knight_banner"], type: "capstone" },

  { id: "knight_heavy_attack_unlock", classId: "knight", branch: "Ability Unlock", name: "Heavy Attack", description: "Unlocks Heavy Attack: every 3s, strike one enemy for 15% of Knight max HP as damage.", cost: 500, maxLevel: 1, effect: { unlockRunAbility: "knight_heavy_attack" }, x: 0, y: 880, prerequisites: ["knight_iron_bastion"], type: "ability" },
  { id: "knight_holy_sword_unlock", classId: "knight", branch: "Ability Unlock", name: "Holy Sword", description: "Unlocks Holy Sword: every 4s, the next 3 player hits deal +50% damage.", cost: 500, maxLevel: 1, effect: { unlockRunAbility: "knight_holy_sword" }, x: 0, y: 1050, prerequisites: ["knight_retribution"], type: "ability" },
  { id: "knight_holy_shield_unlock", classId: "knight", branch: "Ability Unlock", name: "Holy Shield", description: "Unlocks Holy Shield: every 5s, gain +50% armor against the next 2 enemy hits.", cost: 500, maxLevel: 1, effect: { unlockRunAbility: "knight_holy_shield" }, x: 0, y: 1230, prerequisites: ["knight_aegis_eternal"], type: "ability" },

  { id: "rogue_serrated", classId: "rogue", branch: "Bleed", name: "Serrated Edge", description: "+1.5% max HP bleed damage per second per level.", cost: 55, maxLevel: 4, effect: { bleedMaxHpPercent: 0.015 }, x: 760, y: 1540, prerequisites: ["rogue_root"], type: "stat" },
  { id: "rogue_open_wounds", classId: "rogue", branch: "Bleed", name: "Open Wounds", description: "+1.8% max HP bleed damage per second per level.", cost: 100, maxLevel: 3, effect: { bleedMaxHpPercent: 0.018 }, x: 760, y: 1680, prerequisites: ["rogue_serrated"], type: "notable" },
  { id: "rogue_blood_scent", classId: "rogue", branch: "Bleed", name: "Blood Scent", description: "Bleeding a new target grants +5% attack speed per level.", cost: 145, maxLevel: 3, effect: { bleedAttackSpeed: 0.05 }, x: 760, y: 1820, prerequisites: ["rogue_open_wounds"], type: "notable" },
  { id: "rogue_crimson_execution", classId: "rogue", branch: "Bleed", name: "Crimson Execution", description: "Capstone: +4% max HP bleed damage per second and +18% execute damage.", cost: 285, maxLevel: 1, effect: { executeDamage: 0.18, bleedMaxHpPercent: 0.04 }, x: 760, y: 2020, prerequisites: ["rogue_blood_scent"], type: "capstone" },

  { id: "rogue_precision", classId: "rogue", branch: "Critical", name: "Keen Eye", description: "+3% crit chance per level.", cost: 60, maxLevel: 4, effect: { critChance: 0.03 }, x: 1120, y: 1540, prerequisites: ["rogue_root"], type: "stat" },
  { id: "rogue_backstab_meta", classId: "rogue", branch: "Critical", name: "Backstab", description: "Critical hits deal +12% damage per level.", cost: 105, maxLevel: 3, effect: { critDamage: 0.12 }, x: 1120, y: 1680, prerequisites: ["rogue_precision"], type: "notable" },
  { id: "rogue_deadly_rhythm", classId: "rogue", branch: "Critical", name: "Deadly Rhythm", description: "Critical hits grant +4% attack speed per level.", cost: 145, maxLevel: 3, effect: { critAttackSpeedBonus: 0.04 }, x: 1120, y: 1820, prerequisites: ["rogue_backstab_meta"], type: "notable" },
  { id: "rogue_perfect_strike", classId: "rogue", branch: "Critical", name: "Perfect Strike", description: "Capstone: crit chance above 100% can become mega crit chance. Mega crit adds +200% crit damage.", cost: 285, maxLevel: 1, effect: { megaCritFromOvercap: 1, megaCritDamage: 2 }, x: 1120, y: 2020, prerequisites: ["rogue_deadly_rhythm"], type: "capstone" },

  { id: "rogue_reflex", classId: "rogue", branch: "Evasion", name: "Light Footwork", description: "+0.04 attack speed and +2% evasion per level.", cost: 60, maxLevel: 4, effect: { attackSpeed: 0.04, evasion: 0.02 }, x: 1480, y: 1540, prerequisites: ["rogue_root"], type: "stat" },
  { id: "rogue_smoke_step", classId: "rogue", branch: "Evasion", name: "Smoke Step", description: "+18% chance per level to avoid the first hit each battle.", cost: 115, maxLevel: 3, effect: { firstHitAvoidChance: 0.18 }, x: 1480, y: 1680, prerequisites: ["rogue_reflex"], type: "notable" },
  { id: "rogue_opportunist", classId: "rogue", branch: "Evasion", name: "Opportunist", description: "Evading grants +8% battle damage per level, up to +40%.", cost: 150, maxLevel: 3, effect: { evasionDamageBonus: 0.08 }, x: 1480, y: 1820, prerequisites: ["rogue_smoke_step"], type: "notable" },
  { id: "rogue_ghostblade", classId: "rogue", branch: "Evasion", name: "Ghostblade", description: "Capstone: evading counterattacks for 65% damage.", cost: 285, maxLevel: 1, effect: { evasionCounter: 0.65 }, x: 1480, y: 2020, prerequisites: ["rogue_opportunist"], type: "capstone" },

  { id: "rogue_mark_weakness", classId: "rogue", branch: "Execute", name: "Mark Weakness", description: "Enemies below 35% HP take +5% damage per level.", cost: 65, maxLevel: 4, effect: { executeDamage: 0.05, executeThreshold: 0.35 }, x: 1840, y: 1540, prerequisites: ["rogue_root"], type: "stat" },
  { id: "rogue_killers_instinct", classId: "rogue", branch: "Execute", name: "Killer's Instinct", description: "+8% execute damage and +1.5% crit chance per level.", cost: 115, maxLevel: 3, effect: { executeDamage: 0.08, critChance: 0.015 }, x: 1840, y: 1680, prerequisites: ["rogue_mark_weakness"], type: "notable" },
  { id: "rogue_finishing_dash", classId: "rogue", branch: "Execute", name: "Finishing Dash", description: "Kills grant +7% attack speed per level, up to +35%.", cost: 155, maxLevel: 3, effect: { killAttackSpeed: 0.07, killAttackSpeedMax: 0.35 }, x: 1840, y: 1820, prerequisites: ["rogue_killers_instinct"], type: "notable" },
  { id: "rogue_death_sentence", classId: "rogue", branch: "Execute", name: "Death Sentence", description: "Capstone: enemies below 40% HP take +38% damage; every 6th attack crits.", cost: 300, maxLevel: 1, effect: { executeDamage: 0.38, executeThreshold: 0.4, guaranteedCritEvery: 6 }, x: 1840, y: 2020, prerequisites: ["rogue_finishing_dash"], type: "capstone" },

  { id: "rogue_poison_unlock", classId: "rogue", branch: "Ability Unlock", name: "Poison", description: "Unlocks Poison: every 2.8s, poison one enemy for 4.5s. Poison deals 9 + 0.75 per stage DPS.", cost: 500, maxLevel: 1, effect: { unlockRunAbility: "rogue_poison" }, x: 1060, y: 2150, prerequisites: ["rogue_crimson_execution"], type: "ability" },
  { id: "rogue_bleed_unlock", classId: "rogue", branch: "Ability Unlock", name: "Trap", description: "Unlocks Trap: every 2.5s, slow all living enemies by 28% for 4s and make Rogue deal +8% damage to slowed enemies.", cost: 500, maxLevel: 1, effect: { unlockRunAbility: "rogue_bleed" }, x: 1300, y: 2150, prerequisites: ["rogue_perfect_strike"], type: "ability" },
  { id: "rogue_burn_unlock", classId: "rogue", branch: "Ability Unlock", name: "Burn", description: "Unlocks Burn: every 2.2s, burn one enemy for 3.5s. Burn stacks on that enemy and deals 7 + 0.55 per stage DPS.", cost: 500, maxLevel: 1, effect: { unlockRunAbility: "rogue_burn" }, x: 1540, y: 2150, prerequisites: ["rogue_ghostblade"], type: "ability" },

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
applyOrderedTreeDependencies();
syncDataDescriptions();

function applyUniformTreeLayout() {
  const positions = {
    crown_legacy: [1600, 1180],

    endurance: [1280, 1000], armor: [1060, 820], old_campaigns: [840, 640], castle_stores: [620, 460], royal_mender: [460, 280], sanctuary_blessing: [520, 120],
    unlock_starting_bonuses: [260, 120], unlock_relics: [660, 120],

    field_drills: [1600, 960], haste: [1380, 780], essence: [1200, 600], crown_doctrine: [1160, 420], ancient_charter: [1160, 240],
    unlock_events: [960, 100],
    marching_songs: [1560, 760], life_siphon: [1600, 600], duelist_lessons: [1780, 760],

    might: [1920, 1000], fortune: [2160, 820], lucky_omens: [2060, 640], crown_purse: [2340, 660], royal_tithe: [2520, 500],
    veteran_bounty: [2680, 340], battle_trance: [2680, 180], crown_dice: [2480, 160], unlock_merchants: [2480, 80], unlock_enemies: [2880, 80],

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

function applyOrderedTreeDependencies() {
  const dependencies = {
    crown_legacy: [],

    endurance: ["crown_legacy"],
    armor: ["endurance"],
    old_campaigns: ["armor"],
    castle_stores: ["old_campaigns"],
    royal_mender: ["castle_stores"],
    sanctuary_blessing: ["royal_mender"],

    field_drills: ["crown_legacy"],
    haste: ["field_drills"],
    essence: ["haste"],
    crown_doctrine: ["essence"],
    ancient_charter: ["crown_doctrine"],
    marching_songs: ["field_drills"],
    life_siphon: ["marching_songs"],
    duelist_lessons: ["life_siphon"],

    might: ["crown_legacy"],
    fortune: ["might"],
    lucky_omens: ["fortune"],
    crown_purse: ["lucky_omens"],
    royal_tithe: ["crown_purse"],
    veteran_bounty: ["royal_tithe"],
    battle_trance: ["veteran_bounty"],
    crown_dice: ["battle_trance"],

    knight_root: [],
    knight_plate: ["knight_root"],
    knight_vigor: ["knight_plate"],
    knight_iron_will: ["knight_vigor"],
    knight_iron_bastion: ["knight_iron_will"],
    knight_heavy_attack_unlock: ["knight_iron_bastion"],
    knight_bulwark: ["knight_root"],
    knight_guard: ["knight_bulwark"],
    knight_sanctuary: ["knight_guard"],
    knight_aegis_eternal: ["knight_sanctuary"],
    knight_holy_shield_unlock: ["knight_aegis_eternal"],
    knight_counter: ["knight_root"],
    knight_unbroken: ["knight_counter"],
    knight_spiked_guard: ["knight_unbroken"],
    knight_retribution: ["knight_spiked_guard"],
    knight_holy_sword_unlock: ["knight_retribution"],
    knight_hold_line: ["knight_root"],
    knight_crown_guard_meta: ["knight_hold_line"],
    knight_banner: ["knight_crown_guard_meta"],
    knight_warlord_oath: ["knight_banner"],

    rogue_root: [],
    rogue_serrated: ["rogue_root"],
    rogue_open_wounds: ["rogue_serrated"],
    rogue_blood_scent: ["rogue_open_wounds"],
    rogue_crimson_execution: ["rogue_blood_scent"],
    rogue_poison_unlock: ["rogue_crimson_execution"],
    rogue_precision: ["rogue_root"],
    rogue_backstab_meta: ["rogue_precision"],
    rogue_deadly_rhythm: ["rogue_backstab_meta"],
    rogue_perfect_strike: ["rogue_deadly_rhythm"],
    rogue_bleed_unlock: ["rogue_perfect_strike"],
    rogue_reflex: ["rogue_root"],
    rogue_smoke_step: ["rogue_reflex"],
    rogue_opportunist: ["rogue_smoke_step"],
    rogue_ghostblade: ["rogue_opportunist"],
    rogue_burn_unlock: ["rogue_ghostblade"],
    rogue_mark_weakness: ["rogue_root"],
    rogue_killers_instinct: ["rogue_mark_weakness"],
    rogue_finishing_dash: ["rogue_killers_instinct"],
    rogue_death_sentence: ["rogue_finishing_dash"],

    wizard_root: [],
    wizard_ember: ["wizard_root"],
    wizard_wildfire_meta: ["wizard_ember"],
    wizard_scorching_focus: ["wizard_wildfire_meta"],
    wizard_inferno_crown: ["wizard_scorching_focus"],
    wizard_mana_shield: ["wizard_root"],
    wizard_warding_glyph: ["wizard_mana_shield"],
    wizard_prismatic_shell: ["wizard_warding_glyph"],
    wizard_archmage_aegis: ["wizard_prismatic_shell"],
    wizard_iceball_unlock: ["wizard_archmage_aegis"],
    wizard_focus: ["wizard_root"],
    wizard_rune_battery: ["wizard_focus"],
    wizard_chain_spark: ["wizard_rune_battery"],
    wizard_archmage_sigil: ["wizard_chain_spark"],
    wizard_lightning_unlock: ["wizard_archmage_sigil"],
    wizard_frost_hex_meta: ["wizard_root"],
    wizard_time_thread: ["wizard_frost_hex_meta"],
    wizard_binding_rune: ["wizard_time_thread"],
    wizard_chrono_seal: ["wizard_binding_rune"],
    wizard_curse_unlock: ["wizard_chrono_seal"]
  };

  TREE_NODES.forEach(node => {
    if (node.type === "unlock") {
      node.cost = TREE_UNLOCK_ESSENCE_COST;
      node.costs = undefined;
      node.prerequisites = [];
      return;
    }
    if (node.type === "ability") {
      node.cost = TREE_UNLOCK_ESSENCE_COST;
      node.costs = undefined;
    }
    if (dependencies[node.id]) node.prerequisites = dependencies[node.id];
  });
}

function syncDataDescriptions() {
  Object.values(RUN_ABILITIES).forEach(ability => {
    ability.description = getRunAbilityDescription(ability);
  });
  REWARDS.forEach(reward => {
    if (!reward.abilityId || !RUN_ABILITIES[reward.abilityId]) return;
    reward.text = `Unlock ${RUN_ABILITIES[reward.abilityId].name}: ${RUN_ABILITIES[reward.abilityId].description}`;
  });
  TREE_NODES.forEach(node => {
    const effect = node.effect || {};
    if (effect.unlockRunAbility && RUN_ABILITIES[effect.unlockRunAbility]) {
      node.description = `Unlocks ${RUN_ABILITIES[effect.unlockRunAbility].name}: ${RUN_ABILITIES[effect.unlockRunAbility].description}`;
      return;
    }
    const effectText = formatTreeEffectText(effect, node.maxLevel > 1);
    if (!effectText) return;
    const prefix = node.type === "class" ? `Unlocks ${CLASSES[node.classId]?.name || node.classId} upgrades. ` : "";
    const capstone = node.type === "capstone" ? "Capstone: " : "";
    node.description = `${prefix}${capstone}${effectText}.`;
  });
}

function getRunAbilityDescription(ability) {
  if (ability.id === "wizard_curse") return `Every ${formatSeconds(ability.cooldown)}, curse one enemy for ${formatSeconds(ability.duration)} so it takes +22% damage.`;
  if (ability.id === "wizard_iceball") return `Every ${formatSeconds(ability.cooldown)}, hit one enemy for 75% damage and slow it by 38% for ${formatSeconds(ability.duration)}.`;
  if (ability.id === "wizard_lightning") return `Every ${formatSeconds(ability.cooldown)}, strike up to 3 enemies for 90%/75%/60% damage.`;
  if (ability.id === "rogue_poison") return `Every ${formatSeconds(ability.cooldown)}, poison one enemy for ${formatSeconds(ability.duration)}. Poison deals 9 + 0.75 per stage damage each second.`;
  if (ability.id === "rogue_bleed") return `Every ${formatSeconds(ability.cooldown)}, slow all living enemies by 28% for ${formatSeconds(ability.duration)}. Rogue deals +8% damage to slowed enemies.`;
  if (ability.id === "rogue_burn") return `Every ${formatSeconds(ability.cooldown)}, burn one enemy for ${formatSeconds(ability.duration)}. Burn deals 7 + 0.55 per stage damage each second.`;
  if (ability.id === "knight_heavy_attack") return `Every ${formatSeconds(ability.cooldown)}, strike one enemy for ${formatUnsignedPercent(ability.maxHpDamage)} of Knight max HP as damage.`;
  if (ability.id === "knight_holy_sword") return `Every ${formatSeconds(ability.cooldown)}, the next ${ability.hitCount} player hits deal ${formatExactPercent(ability.hitDamageBonus)} damage.`;
  if (ability.id === "knight_holy_shield") return `Every ${formatSeconds(ability.cooldown)}, gain ${formatExactPercent(ability.armorMultiplier)} armor against the next ${ability.hitCount} enemy hits.`;
  return ability.description || "";
}

function formatSeconds(value) {
  const seconds = Math.round((Number(value) || 0) * 10) / 10;
  return `${Number.isInteger(seconds) ? seconds.toFixed(0) : seconds}s`;
}

function formatUnsignedPercent(value) {
  return formatExactPercent(value).replace(/^\+/, "");
}

function formatTreeEffectText(effect = {}, perLevel = false) {
  const parts = Object.entries(effect)
    .filter(([, value]) => value !== undefined && value !== null && value !== 0)
    .filter(([stat]) => stat !== "unlockRunAbility")
    .map(([stat, value]) => formatTreeStatText(stat, value))
    .filter(Boolean);
  if (!parts.length) return "";
  return `${joinTextParts(parts)}${perLevel ? " per level" : ""}`;
}

function formatTreeStatText(stat, value) {
  const flatLabels = {
    maxHp: "starting HP",
    damage: "starting damage",
    armor: "starting armor",
    attackSpeed: "attack speed",
    startingGold: "starting gold",
    luck: "Luck",
    regen: "HP regen",
    sanctuaryMaxHp: "max HP from Sanctuaries",
    sanctuaryRegen: "HP regen from Sanctuaries",
    battleStartShield: "battle-start shield",
    shieldCapPercent: "shield cap",
    rerolls: "reroll per reward, relic, and shop offer",
    hitRetaliateDamage: "hit retaliation damage",
    firstEnemyDelay: "first enemy attack delay",
    guaranteedCritEvery: "guaranteed crit interval",
    megaCritFromOvercap: "mega crit from crit overcap"
  };
  const percentLabels = {
    essenceMultiplier: "Essence earned",
    lifeSteal: "life steal",
    eliteRewardMultiplier: "elite gold and Essence rewards",
    retaliateBlock: "block retaliation",
    hitRetaliateChance: "hit retaliation chance",
    lowHpDamage: "damage while below 40% HP",
    damageMultiplier: "damage",
    bleedMaxHpPercent: "max HP bleed damage per second",
    bleedAttackSpeed: "attack speed after bleeding a new target",
    critChance: "crit chance",
    critDamage: "crit damage",
    critAttackSpeedBonus: "attack speed after crits",
    megaCritDamage: "mega crit damage",
    firstHitAvoidChance: "chance to avoid the first hit each battle",
    evasionDamageBonus: "battle damage after evading",
    evasionCounter: "evasion counterattack damage",
    executeDamage: "execute damage",
    executeThreshold: "execute threshold",
    killAttackSpeed: "attack speed on kill",
    killAttackSpeedMax: "maximum attack speed from kills",
    burnDamage: "burn damage",
    burnSpreadChance: "burn spread chance",
    burningEnemyDamage: "damage to burning enemies",
    splashDamageMultiplier: "splash damage",
    thirdAttackBonus: "third-attack damage",
    slowChance: "slow chance",
    slowValue: "slow strength",
    delayChance: "delay chance"
  };
  if (stat === "delayAmount") return `${formatSigned(value)}s enemy attack delay`;
  if (flatLabels[stat]) return `${formatEvenSigned(value)} ${flatLabels[stat]}`;
  if (percentLabels[stat]) return `${formatExactPercent(value)} ${percentLabels[stat]}`;
  return `${formatEvenSigned(value)} ${stat.replace(/([A-Z])/g, " $1").toLowerCase()}`;
}

function joinTextParts(parts = []) {
  if (parts.length <= 1) return parts[0] || "";
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  return `${parts.slice(0, -1).join(", ")}, and ${parts[parts.length - 1]}`;
}

const TREE = TREE_NODES.reduce((nodes, node) => {
  nodes[node.id] = node;
  return nodes;
}, {});

const MAP_TYPES = {
  Battle: { label: "Combat", icon: "&#9876;", className: "map-battle", description: "Standard battle" },
  Elite: { label: "Elite", icon: "&#9760;", className: "map-elite", description: "Elite fight: 35 base gold, +20% Essence, and a relic reward" },
  Heal: { label: "Sanctuary", icon: "&#10010;", className: "map-heal", description: "Gain max HP and HP regen. Scales each layer" },
  Merchant: { label: "Merchant", icon: "$", className: "map-merchant", description: "Spend gold on run upgrades" },
  Treasure: { label: "Treasure", icon: "&#10022;", className: "map-treasure", description: "Gain 35 + 3 per stage gold; 35% relic chance plus Luck" },
  Boss: { label: "Boss", icon: "&#9819;", className: "map-boss", description: "Final boss" }
};
