const SAVE_KEY = "crownfall_autobattler_save_v5";
const STAGE_COUNT = 30;
const MAP_LAYER_SIZE = 10;
const FINAL_BOSS_STAGE = STAGE_COUNT + 1;
const PLAYER_BASE_STAT_MULTIPLIER = 1.0;
const ENEMY_BASE_STAT_MULTIPLIER = 1.3;

let save = loadSave();
let run = null;
let battle = null;
let battleFrame = null;
let lastFrameTime = 0;

function defaultGauntletData() {
  return {
    points: 0,
    coins: 0,
    upgrades: {},
    heroLeaders: [],
    enemyLeaders: [],
    stats: { battles: 0, wins: 0, losses: 0, rankedWins: 0 },
    history: []
  };
}

function normalizeGauntletData(storedGauntlet, fallback = defaultGauntletData()) {
  const data = storedGauntlet && typeof storedGauntlet === "object" ? storedGauntlet : {};
  const storedVersion = Math.max(0, Math.floor(Number(data.version) || 0));
  const pointScale = storedVersion < 2 ? 5 : 1;
  return {
    version: 2,
    points: Math.max(0, Math.floor(Number(data.points) || 0)),
    coins: Math.max(0, Math.floor(Number(data.coins) || 0)),
    upgrades: data.upgrades && typeof data.upgrades === "object" ? data.upgrades : {},
    heroLeaders: normalizeGauntletLeaders(Array.isArray(data.heroLeaders) ? data.heroLeaders : fallback.heroLeaders, pointScale),
    enemyLeaders: normalizeGauntletLeaders(Array.isArray(data.enemyLeaders) ? data.enemyLeaders : fallback.enemyLeaders, pointScale),
    stats: { ...fallback.stats, ...((data.stats && typeof data.stats === "object") ? data.stats : {}) },
    history: Array.isArray(data.history) ? data.history.slice(-20) : []
  };
}

function normalizeGauntletLeaders(leaders, pointScale = 1) {
  return (leaders || []).map(leader => ({
    ...leader,
    points: Math.max(0, Math.floor((Number(leader?.points) || 0) * pointScale))
  }));
}

function defaultSave() {
  return {
    essence: 0,
    highestClear: 0,
    firstBossDefeated: false,
    difficultyClears: {},
    stats: defaultAccountStats(),
    achievements: {},
    achievementEssenceClaims: {},
    tree: getDefaultTreeLevels(),
    skins: defaultSkins(),
    skinPurchases: defaultSkinPurchases(),
    inventory: defaultInventory(),
    upgradePool: defaultUpgradePool(),
    settings: defaultSettings(),
    leaderboards: defaultLeaderboards(),
    gauntlet: defaultGauntletData()
  };
}

function defaultSkins() {
  return {
    heroes: Object.keys(CLASSES).reduce((skins, id) => ({ ...skins, [id]: "base" }), {}),
    enemies: getAllCharacterEnemies().reduce((skins, enemy) => ({ ...skins, [enemy.id]: "base" }), {})
  };
}

function defaultSkinPurchases() {
  return {
    heroes: Object.keys(CLASSES).reduce((purchases, id) => ({ ...purchases, [id]: { base: true } }), {}),
    enemies: getAllCharacterEnemies().reduce((purchases, enemy) => ({ ...purchases, [enemy.id]: { base: true } }), {})
  };
}

function defaultInventory() {
  return {
    items: [],
    equipment: Object.keys(CLASSES).reduce((equipment, classId) => {
      equipment[classId] = defaultHeroEquipment();
      return equipment;
    }, {})
  };
}

function defaultUpgradePool() {
  return {
    disabled: {
      upgrades: {},
      relics: {},
      talents: {}
    }
  };
}

function defaultHeroEquipment() {
  return EQUIPMENT_SLOTS.reduce((slots, slot) => {
    slots[slot.id] = null;
    return slots;
  }, {});
}

function defaultAccountStats() {
  return {
    runsStarted: 0,
    runsEnded: 0,
    victories: 0,
    defeats: 0,
    abandonedRuns: 0,
    battlesWon: 0,
    battlesLost: 0,
    stagesCleared: 0,
    enemiesDefeated: 0,
    elitesDefeated: 0,
    bossesDefeated: 0,
    totalDamageDealt: 0,
    totalDamageTaken: 0,
    highestBattleDamage: 0,
    totalGoldEarned: 0,
    totalEssenceEarned: 0,
    skillsTriggered: 0,
    finalBossKills: 0,
    hardStagesCleared: 0,
    shopsVisited: 0,
    relicsClaimed: 0,
    rewardsClaimed: 0,
    knightRuns: 0,
    rogueRuns: 0,
    wizardRuns: 0,
    knightLayer3Clears: 0,
    rogueLayer3Clears: 0,
    wizardLayer3Clears: 0,
    enemyKills: {},
    heroEnemyKills: { knight: 0, rogue: 0, wizard: 0 },
    heroMaxHp: { knight: 0, rogue: 0, wizard: 0 }
  };
}

function defaultSettings() {
  return {
    battleSpeed: 1,
    disableShake: false,
    reduceAnimations: false,
    musicVolume: 60,
    sfxVolume: 70,
    damageNumbers: true,
    tooltips: true,
    equipmentAutosellRarity: "",
    sound: true,
    soundMigrated: true
  };
}

function getDefaultTreeLevels() {
  return Object.keys(TREE).reduce((levels, id) => {
    levels[id] = 0;
    return levels;
  }, {});
}

function loadSave() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SAVE_KEY));
    const fallback = defaultSave();
    const tree = migrateTreeSave({ ...fallback.tree, ...((parsed && parsed.tree) || {}) }, parsed && parsed.tree);
    const storedSave = { ...(parsed || {}) };
    delete storedSave.customAssets;
    const settings = { ...fallback.settings, ...((parsed && parsed.settings) || {}) };
    settings.equipmentAutosellRarity = normalizeEquipmentAutosellRarity(settings.equipmentAutosellRarity);
    if (parsed && parsed.settings && parsed.settings.sound === false && parsed.settings.soundMigrated !== true) {
      settings.sound = true;
      settings.soundMigrated = true;
    }
    const skinPurchases = normalizeSkinPurchases(parsed && parsed.skinPurchases, fallback.skinPurchases);
    const skins = normalizeSkins(parsed && parsed.skins, fallback.skins, skinPurchases);
    const leaderboards = normalizeLeaderboards(parsed && parsed.leaderboards, fallback.leaderboards);
    const gauntlet = normalizeGauntletData(parsed && parsed.gauntlet, fallback.gauntlet);
    const inventory = normalizeInventory(parsed && parsed.inventory, fallback.inventory);
    const upgradePool = normalizeUpgradePool(parsed && parsed.upgradePool, fallback.upgradePool);
    const difficultyClears = normalizeDifficultyClears(parsed && parsed.difficultyClears, parsed);
    return {
      ...fallback,
      ...storedSave,
      tree,
      stats: { ...fallback.stats, ...((parsed && parsed.stats) || {}) },
      achievements: { ...fallback.achievements, ...((parsed && parsed.achievements) || {}) },
      achievementEssenceClaims: { ...fallback.achievementEssenceClaims, ...((parsed && parsed.achievementEssenceClaims) || {}) },
      skins,
      skinPurchases,
      inventory,
      upgradePool,
      difficultyClears,
      leaderboards,
      gauntlet,
      settings
    };
  } catch {
    return defaultSave();
  }
}

function normalizeDifficultyClears(storedClears, parsedSave = {}) {
  const clears = {};
  Object.keys(DIFFICULTIES || {}).forEach(id => {
    if (DIFFICULTIES[id].mode) return;
    clears[id] = !!(storedClears && storedClears[id]);
  });
  if (!storedClears && Number(parsedSave?.highestClear || 0) >= STAGE_COUNT) clears.easy = true;
  return clears;
}

function normalizeUpgradePool(storedPool, fallbackPool = defaultUpgradePool()) {
  const pool = {
    disabled: {
      upgrades: { ...(storedPool?.disabled?.upgrades || {}) },
      relics: { ...(storedPool?.disabled?.relics || {}) },
      talents: { ...(storedPool?.disabled?.talents || {}) }
    }
  };
  Object.keys(pool.disabled).forEach(category => {
    Object.keys(pool.disabled[category]).forEach(id => {
      if (!pool.disabled[category][id]) delete pool.disabled[category][id];
    });
  });
  return { ...fallbackPool, ...pool };
}

function normalizeSkins(storedSkins, fallback, purchases) {
  const next = {
    heroes: { ...fallback.heroes, ...((storedSkins && storedSkins.heroes) || {}) },
    enemies: { ...fallback.enemies, ...((storedSkins && storedSkins.enemies) || {}) }
  };
  Object.keys(next.heroes).forEach(id => {
    if (!getHeroSkin(id, next.heroes[id]) || !isSkinPurchased("hero", id, next.heroes[id], purchases)) next.heroes[id] = "base";
  });
  Object.keys(next.enemies).forEach(id => {
    next.enemies[id] = normalizeSkinId(next.enemies[id]);
    if (!getEnemySkin(id, next.enemies[id]) || !isSkinPurchased("enemy", id, next.enemies[id], purchases)) next.enemies[id] = "base";
  });
  return next;
}

function normalizeSkinId(skinId) {
  const legacyGoldenSkinId = ["gold", "bound"].join("");
  return skinId === legacyGoldenSkinId ? "golden" : skinId;
}

function normalizeSkinPurchases(storedPurchases, fallback) {
  const next = {
    heroes: { ...fallback.heroes },
    enemies: { ...fallback.enemies }
  };
  Object.keys(next.heroes).forEach(id => {
    next.heroes[id] = { ...next.heroes[id], ...((storedPurchases && storedPurchases.heroes && storedPurchases.heroes[id]) || {}) };
    next.heroes[id].base = true;
  });
  Object.keys(next.enemies).forEach(id => {
    next.enemies[id] = { ...next.enemies[id], ...((storedPurchases && storedPurchases.enemies && storedPurchases.enemies[id]) || {}) };
    const legacyGoldenSkinId = ["gold", "bound"].join("");
    if (next.enemies[id][legacyGoldenSkinId]) {
      next.enemies[id].golden = true;
      delete next.enemies[id][legacyGoldenSkinId];
    }
    next.enemies[id].base = true;
  });
  return next;
}

function normalizeInventory(storedInventory, fallback = defaultInventory()) {
  const storedItems = Array.isArray(storedInventory?.items) ? storedInventory.items : [];
  const itemsByInstance = new Map();
  [...fallback.items, ...storedItems].forEach(item => {
    const normalized = normalizeInventoryItem(item);
    if (isStarterInventoryItem(normalized)) return;
    if (normalized.instanceId) itemsByInstance.set(normalized.instanceId, normalized);
  });
  const items = [...itemsByInstance.values()];
  const itemIds = new Set(items.map(item => item.instanceId));
  const equipment = {};
  Object.keys(CLASSES).forEach(classId => {
    const storedHeroEquipment = storedInventory?.equipment?.[classId] || {};
    equipment[classId] = defaultHeroEquipment();
    EQUIPMENT_SLOTS.forEach(slot => {
      const instanceId = storedHeroEquipment[slot.id];
      const item = itemIds.has(instanceId) ? itemsByInstance.get(instanceId) : null;
      equipment[classId][slot.id] = item && item.slot === slot.id && canHeroEquipItem(classId, item) ? item.instanceId : null;
    });
  });
  return { items, equipment };
}

function isStarterInventoryItem(item) {
  return String(item?.instanceId || "").startsWith("starter_");
}

function normalizeInventoryItem(item) {
  const slotIds = new Set(EQUIPMENT_SLOTS.map(slot => slot.id));
  const slot = slotIds.has(item?.slot) ? item.slot : "mainHand";
  const itemId = String(item?.itemId || item?.id || `item_${slot}`);
  const instanceId = String(item?.instanceId || `${itemId}_${Math.random().toString(36).slice(2, 10)}`);
  const rarity = String(item?.rarity || "Common");
  const quality = Math.max(0, Math.min(1, Number(item?.quality) || 0));
  return {
    itemId,
    instanceId,
    name: String(item?.name || "Unknown Equipment"),
    slot,
    rarity,
    quality,
    power: Math.max(1, Number(item?.power) || getEquipmentPower(rarity, quality)),
    allowedClassIds: Array.isArray(item?.allowedClassIds) ? item.allowedClassIds.filter(id => CLASSES[id]) : [],
    stats: item?.stats && typeof item.stats === "object" ? { ...item.stats } : {},
    description: String(item?.description || ""),
    source: String(item?.source || "")
  };
}

function canHeroEquipItem(classId, item) {
  return !!CLASSES[classId] && !!item && (!item.allowedClassIds?.length || item.allowedClassIds.includes(classId));
}

function getHeroEquipment(classId) {
  if (!save.inventory) save.inventory = defaultInventory();
  save.inventory = normalizeInventory(save.inventory);
  return save.inventory.equipment[classId] || defaultHeroEquipment();
}

function getInventoryItemsForHero(classId, slotId = null) {
  if (!save.inventory) save.inventory = defaultInventory();
  save.inventory = normalizeInventory(save.inventory);
  return save.inventory.items.filter(item => canHeroEquipItem(classId, item) && (!slotId || item.slot === slotId));
}

function isInventoryItemEquipped(instanceId) {
  if (!save.inventory) return false;
  return Object.values(save.inventory.equipment || {}).some(heroEquipment =>
    EQUIPMENT_SLOTS.some(slot => heroEquipment?.[slot.id] === instanceId)
  );
}

function getInventoryItem(instanceId) {
  if (!save.inventory) save.inventory = defaultInventory();
  return (save.inventory.items || []).find(item => item.instanceId === instanceId) || null;
}

function getEquippedItem(classId, slotId) {
  const instanceId = getHeroEquipment(classId)[slotId];
  return instanceId ? getInventoryItem(instanceId) : null;
}

function equipInventoryItem(classId, instanceId) {
  const item = getInventoryItem(instanceId);
  if (!canHeroEquipItem(classId, item)) return false;
  if (!save.inventory) save.inventory = defaultInventory();
  save.inventory = normalizeInventory(save.inventory);
  if (isInventoryItemEquipped(instanceId)) return false;
  save.inventory.equipment[classId][item.slot] = item.instanceId;
  saveGame();
  return true;
}

function unequipHeroSlot(classId, slotId) {
  if (!save.inventory) save.inventory = defaultInventory();
  save.inventory = normalizeInventory(save.inventory);
  if (!save.inventory.equipment[classId] || !(slotId in save.inventory.equipment[classId])) return false;
  save.inventory.equipment[classId][slotId] = null;
  saveGame();
  return true;
}

function addInventoryItem(item) {
  if (!save.inventory) save.inventory = defaultInventory();
  save.inventory = normalizeInventory(save.inventory);
  const normalized = normalizeInventoryItem(item);
  save.inventory.items.push(normalized);
  saveGame();
  return normalized;
}

function collectEquipmentDrop(item) {
  const normalized = normalizeInventoryItem(item);
  if (shouldAutoSellEquipmentItem(normalized)) {
    const value = getEquipmentSellValue(normalized);
    save.essence = Math.max(0, Math.round((Number(save.essence) || 0) + value));
    saveGame();
    return { item: normalized, sold: true, value };
  }
  return { item: addInventoryItem(normalized), sold: false, value: 0 };
}

function shouldAutoSellEquipmentItem(item) {
  const rarity = normalizeEquipmentAutosellRarity(save.settings?.equipmentAutosellRarity);
  if (!rarity || !item?.rarity) return false;
  return getEquipmentRarityRank(item.rarity) <= getEquipmentRarityRank(rarity);
}

function normalizeEquipmentAutosellRarity(rarity) {
  const value = String(rarity || "");
  return EQUIPMENT_RARITIES.some(item => item.id === value) ? value : "";
}

function removeInventoryItem(instanceId) {
  if (!save.inventory) save.inventory = defaultInventory();
  save.inventory = normalizeInventory(save.inventory);
  const index = save.inventory.items.findIndex(item => item.instanceId === instanceId);
  if (index < 0) return null;
  const [removed] = save.inventory.items.splice(index, 1);
  Object.keys(save.inventory.equipment).forEach(classId => {
    EQUIPMENT_SLOTS.forEach(slot => {
      if (save.inventory.equipment[classId][slot.id] === instanceId) save.inventory.equipment[classId][slot.id] = null;
    });
  });
  saveGame();
  return removed;
}

function generateEquipmentDrop(options = {}) {
  const classId = options.classId || run?.classId || "knight";
  const slot = options.slot || randomChoice(EQUIPMENT_SLOTS).id;
  const templates = EQUIPMENT_TEMPLATES[slot] || [];
  const template = randomChoice(templates);
  const rarityConfig = rollEquipmentRarity(options.rarityBonus || 0, options.maxRarity);
  const quality = rollEquipmentQuality(rarityConfig.qualityBonus);
  const stats = rollEquipmentStats(template.stats || ["maxHp"], rarityConfig, quality, options.stage || run?.stage || 1);
  return normalizeInventoryItem({
    itemId: template.id,
    instanceId: `${template.id}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    name: template.name,
    slot,
    rarity: rarityConfig.id,
    quality,
    power: getEquipmentPower(rarityConfig.id, quality),
    allowedClassIds: [],
    stats,
    description: `Dropped from ${options.sourceName || "a boss"}.`,
    source: options.sourceName || "Boss"
  });
}

function rollEquipmentRarity(bonus = 0, maxRarity = null) {
  const maxRank = maxRarity ? getEquipmentRarityRank(maxRarity) : Infinity;
  const luck = Math.max(0, run?.hero?.luck || 0);
  const pool = EQUIPMENT_RARITIES.filter(rarity => getEquipmentRarityRank(rarity.id) <= maxRank && isRarityAllowedByLuck(rarity.id, luck));
  const weighted = (pool.length ? pool : EQUIPMENT_RARITIES).map(rarity => ({
    ...rarity,
    weight: rarity.weight * (rarity.id === "Common" ? 1 : 1 + bonus)
  }));
  const total = weighted.reduce((sum, rarity) => sum + rarity.weight, 0);
  let roll = Math.random() * total;
  for (const rarity of weighted) {
    roll -= rarity.weight;
    if (roll <= 0) return rarity;
  }
  return weighted[0];
}

function rollEquipmentQuality(qualityBonus = 0) {
  const roll = Math.pow(Math.random(), 2.65);
  return Math.max(0, Math.min(1, roll + qualityBonus));
}

function rollEquipmentStats(statKeys, rarityConfig, quality, stage) {
  const stageMultiplier = 1 + Math.max(0, Number(stage) || 1) * 0.012;
  return statKeys.reduce((stats, key, index) => {
    const range = EQUIPMENT_STAT_RANGES[key] || EQUIPMENT_STAT_RANGES.maxHp;
    const slotWeight = index === 0 ? 1 : 0.58;
    const raw = (range.min + (range.max - range.min) * quality) * rarityConfig.statMultiplier * stageMultiplier * slotWeight;
    stats[key] = roundEquipmentStat(raw, range.decimals);
    return stats;
  }, {});
}

function roundEquipmentStat(value, decimals = 0) {
  const factor = Math.pow(10, decimals);
  return Math.max(decimals ? 0.01 : 1, Math.round(value * factor) / factor);
}

function getEquipmentPower(rarity, quality) {
  const rarityRank = Math.max(1, getEquipmentRarityRank(rarity || "Common"));
  return Math.round(rarityRank * 100 + Math.max(0, Math.min(1, Number(quality) || 0)) * 100);
}

function getEquipmentRarityRank(rarity) {
  return ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic"].indexOf(rarity) + 1 || 1;
}

function randomChoice(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function applyEquipmentStatsToHero(hero) {
  if (!hero) return;
  EQUIPMENT_SLOTS.forEach(slot => {
    const item = getEquippedItem(hero.id, slot.id);
    if (!item) return;
    Object.entries(item.stats || {}).forEach(([stat, value]) => applyEquipmentStat(hero, stat, Number(value) || 0));
  });
  hero.hp = Math.min(hero.hp, hero.maxHp);
}

function applyEquipmentStat(hero, stat, value) {
  if (stat === "maxHp") {
    hero.maxHp += value;
    hero.hp += value;
  }
  else if (stat === "damage") hero.damage += value;
  else if (stat === "armor") hero.armor += value;
  else if (stat === "attackSpeed") hero.attackSpeed += value;
  else if (stat === "critChance") hero.crit += value;
  else if (stat === "regen") hero.regen += value;
  else if (stat === "luck") hero.luck += value;
}

function getHeroSkin(classId, skinId) {
  return (HERO_SKINS[classId] || HERO_SKINS.knight || []).find(skin => skin.id === skinId) || null;
}

function getEnemySkin(enemyId, skinId) {
  skinId = normalizeSkinId(skinId);
  const enemy = getAllCharacterEnemies().find(item => item.id === enemyId) || Object.values(ENEMY_ARCHETYPES).find(item => item.id === enemyId) || { id: enemyId, name: "Enemy" };
  return getEnemySkinSet(enemy.id, enemy.name).find(skin => skin.id === skinId) || null;
}

function getSelectedHeroSkin(classId) {
  const skinId = save?.skins?.heroes?.[classId] || "base";
  const skin = getHeroSkin(classId, skinId) || getHeroSkin(classId, "base");
  return isSkinUnlocked(skin) && isSkinPurchased("hero", classId, skin.id) ? skin : getHeroSkin(classId, "base");
}

function getSelectedEnemySkin(enemyId) {
  const skinId = normalizeSkinId(save?.skins?.enemies?.[enemyId] || "base");
  const skin = getEnemySkin(enemyId, skinId) || getEnemySkin(enemyId, "base");
  return isSkinUnlocked(skin) && isSkinPurchased("enemy", enemyId, skin.id) ? skin : getEnemySkin(enemyId, "base");
}

function getSkinSpriteSheet(kind, ownerId, skinId, baseSheet) {
  if (!skinId || skinId === "base") return baseSheet;
  const bucket = kind === "hero" ? SKIN_SPRITE_SHEETS.heroes : SKIN_SPRITE_SHEETS.enemies;
  return (bucket && bucket[ownerId] && bucket[ownerId][skinId]) || baseSheet;
}

function isSkinUnlocked(skin) {
  if (!skin || !skin.unlock || skin.unlock.type === "base") return true;
  if (skin.unlock.type === "purchase") return true;
  if (skin.unlock.type === "tree") return !!save?.tree && (save.tree[skin.unlock.node] || 0) > 0;
  if (skin.unlock.type === "achievement") return !!save?.achievements && !!save.achievements[skin.unlock.achievement];
  return false;
}

function isSkinPurchased(kind, ownerId, skinId, purchases = save?.skinPurchases) {
  skinId = normalizeSkinId(skinId);
  if (skinId === "base") return true;
  const skin = kind === "hero" ? getHeroSkin(ownerId, skinId) : getEnemySkin(ownerId, skinId);
  if (skin && skin.unlock && skin.unlock.type === "achievement" && isSkinUnlocked(skin)) return true;
  const bucket = kind === "hero" ? "heroes" : "enemies";
  return !!purchases?.[bucket]?.[ownerId]?.[skinId];
}

function getSkinUnlockText(skin) {
  if (!skin || !skin.unlock || skin.unlock.type === "base") return "Unlocked";
  if (skin.unlock.type === "purchase") return `${skin.unlock.cost || 0} Essence`;
  if (skin.unlock.type === "achievement") return "Achievement";
  return "Locked";
}

function getAllCharacterEnemies() {
  const seen = new Set();
  const enemies = typeof CHARACTER_ENEMIES !== "undefined" ? CHARACTER_ENEMIES : Object.values(ENEMY_ARCHETYPES);
  return enemies.filter(enemy => {
    if (enemy.id === "fallen_king_shade") return false;
    if (seen.has(enemy.id)) return false;
    seen.add(enemy.id);
    return true;
  });
}

function getEnemySpriteSheet(enemy) {
  if (!enemy) return "";
  if (enemy.spriteSheet) return enemy.spriteSheet;
  return SPRITE_SHEETS.enemies[enemy.id] || SPRITE_SHEETS.enemies[enemy.className] || "";
}

function migrateTreeSave(tree, oldTree) {
  const oldLevels = oldTree || {};
  let migrated = Object.keys(oldLevels).some(id => !TREE[id] && oldLevels[id] > 0);
  const hadAnyProgress = Object.values(oldLevels).some(level => level > 0);
  if (hadAnyProgress && !oldLevels.crown_legacy) {
    tree.crown_legacy = 1;
    migrated = true;
  }

  const oldClassUnlocks = {
    knight_root: ["knight_vigor", "knight_edge", "knight_bulwark", "knight_banner"],
    rogue_root: ["rogue_blades", "rogue_reflex", "rogue_precision", "rogue_plunder"],
    wizard_root: ["wizard_focus", "wizard_conduit", "wizard_ward", "wizard_inferno"]
  };

  Object.entries(oldClassUnlocks).forEach(([rootId, oldIds]) => {
    if (!tree[rootId] && oldIds.some(id => oldLevels[id] > 0)) {
      tree[rootId] = 1;
      migrated = true;
    }
  });

  if (oldLevels.knight_edge && !tree.knight_banner) { tree.knight_banner = Math.min(TREE.knight_banner.maxLevel, oldLevels.knight_edge); migrated = true; }
  if (oldLevels.knight_bulwark && !tree.knight_plate) { tree.knight_plate = Math.min(TREE.knight_plate.maxLevel, oldLevels.knight_bulwark); migrated = true; }
  if (oldLevels.rogue_blades && !tree.rogue_serrated) { tree.rogue_serrated = Math.min(TREE.rogue_serrated.maxLevel, oldLevels.rogue_blades); migrated = true; }
  if (oldLevels.rogue_plunder && !tree.fortune) { tree.fortune = Math.min(TREE.fortune.maxLevel, oldLevels.rogue_plunder); migrated = true; }
  if (oldLevels.wizard_conduit && !tree.wizard_focus) { tree.wizard_focus = Math.min(TREE.wizard_focus.maxLevel, oldLevels.wizard_conduit); migrated = true; }
  if (oldLevels.wizard_ward && !tree.wizard_mana_shield) { tree.wizard_mana_shield = Math.min(TREE.wizard_mana_shield.maxLevel, oldLevels.wizard_ward); migrated = true; }

  Object.keys(tree).forEach(id => {
    if (!TREE[id]) {
      delete tree[id];
      migrated = true;
    }
    else tree[id] = Math.min(Math.max(0, Number(tree[id]) || 0), TREE[id].maxLevel);
  });

  if (migrated) localStorage.setItem(SAVE_KEY, JSON.stringify({ ...(JSON.parse(localStorage.getItem(SAVE_KEY)) || {}), tree }));
  return tree;
}

function saveGame() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  applySettings();
  refreshTopbar();
}

function isProgressionWriteBlocked() {
  return typeof isBuildTestRun === "function" && isBuildTestRun();
}

function addAccountStat(id, amount) {
  if (isProgressionWriteBlocked()) return;
  if (!save.stats) save.stats = defaultAccountStats();
  save.stats[id] = (Number(save.stats[id]) || 0) + amount;
  checkAchievements();
}

function addEnemyKillStat(enemyId, amount = 1) {
  if (!enemyId) return;
  if (isProgressionWriteBlocked()) return;
  if (!save.stats) save.stats = defaultAccountStats();
  if (!save.stats.enemyKills) save.stats.enemyKills = {};
  save.stats.enemyKills[enemyId] = (Number(save.stats.enemyKills[enemyId]) || 0) + amount;
  checkAchievements();
}

function addHeroEnemyKillStat(classId, amount = 1) {
  if (!classId || !amount) return;
  if (isProgressionWriteBlocked()) return;
  if (!save.stats) save.stats = defaultAccountStats();
  if (!save.stats.heroEnemyKills) save.stats.heroEnemyKills = {};
  save.stats.heroEnemyKills[classId] = (Number(save.stats.heroEnemyKills[classId]) || 0) + amount;
  checkAchievements();
}

function recordHeroMaxHpStat(classId, maxHp) {
  if (!classId || !maxHp) return;
  if (isProgressionWriteBlocked()) return;
  if (!save.stats) save.stats = defaultAccountStats();
  if (!save.stats.heroMaxHp) save.stats.heroMaxHp = {};
  save.stats.heroMaxHp[classId] = Math.max(Number(save.stats.heroMaxHp[classId]) || 0, Math.floor(maxHp));
  checkAchievements();
}

function recordGameEvent(type, payload = {}) {
  if (isProgressionWriteBlocked()) return;
  if (type === "enemyKilled") {
    addEnemyKillStat(payload.enemyId, payload.count || 1);
    addHeroEnemyKillStat(payload.classId, payload.count || 1);
  }
  if (type === "heroMaxHp") recordHeroMaxHpStat(payload.classId, payload.maxHp);
}

function checkAchievements() {
  if (isProgressionWriteBlocked()) return [];
  if (!save.achievements) save.achievements = {};
  if (!save.achievementEssenceClaims) save.achievementEssenceClaims = {};
  if (typeof ACHIEVEMENTS === "undefined") return [];
  const unlocked = [];
  let essenceClaimed = 0;
  ACHIEVEMENTS.forEach(achievement => {
    if (save.achievements[achievement.id]) {
      essenceClaimed += claimAchievementEssence(achievement);
      return;
    }
    if (achievement.condition(save)) {
      save.achievements[achievement.id] = true;
      essenceClaimed += claimAchievementEssence(achievement);
      unlocked.push(achievement);
    }
  });
  if (unlocked.length && typeof showAchievementPopup === "function") {
    unlocked.forEach(achievement => showAchievementPopup(achievement));
  }
  if (essenceClaimed && typeof saveGame === "function") saveGame();
  return unlocked;
}

function isRequirementMet(requirement, sourceSave = save) {
  if (!requirement) return true;
  const stats = sourceSave?.stats || {};
  return getRequirementProgress(requirement, sourceSave).current >= getRequirementProgress(requirement, sourceSave).target;
}

function getRequirementProgress(requirement, sourceSave = save) {
  if (!requirement) return { current: 1, target: 1 };
  const stats = sourceSave?.stats || {};
  const target = Math.max(0, Number(requirement.count) || 0);
  if (requirement.type === "enemyKills") return { current: Number(stats.enemyKills?.[requirement.enemyId]) || 0, target };
  if (requirement.type === "heroEnemyKills") return { current: Number(stats.heroEnemyKills?.[requirement.classId]) || 0, target };
  if (requirement.type === "heroMaxHp") return { current: Number(stats.heroMaxHp?.[requirement.classId]) || 0, target };
  if (requirement.type === "bossKills") return { current: Number(stats.bossesDefeated) || 0, target };
  if (requirement.type === "finalBossKills") return { current: Number(stats.finalBossKills) || 0, target };
  if (requirement.type === "stat") return { current: Number(stats[requirement.stat]) || 0, target };
  return { current: target, target };
}

function formatRequirement(requirement, options = {}) {
  if (!requirement) return "";
  const base = getRequirementBaseText(requirement);
  if (!options.progress) return base;
  const progress = getRequirementProgress(requirement, options.save || save);
  return `${base} (${Math.min(progress.current, progress.target)} / ${progress.target})`;
}

function getRequirementBaseText(requirement) {
  if (!requirement) return "";
  if (requirement.type === "enemyKills") return `Defeat ${getRequirementEnemyName(requirement.enemyId)} ${requirement.count} times`;
  if (requirement.type === "heroEnemyKills") return `Defeat ${requirement.count} enemies with ${getRequirementClassName(requirement.classId)}`;
  if (requirement.type === "heroMaxHp") return `Reach ${requirement.count} max HP with ${getRequirementClassName(requirement.classId)}`;
  if (requirement.type === "bossKills") return `Defeat bosses ${requirement.count} times`;
  if (requirement.type === "finalBossKills") return `Defeat The Eternal Crown ${requirement.count} times`;
  if (requirement.type === "stat") return `Reach ${requirement.count} ${formatRequirementStatName(requirement.stat)}`;
  return "";
}

function getRequirementEnemyName(enemyId) {
  return getAllCharacterEnemies().find(enemy => enemy.id === enemyId)?.name || enemyId || "enemy";
}

function getRequirementClassName(classId) {
  return CLASSES[classId]?.name || classId || "Hero";
}

function formatRequirementStatName(stat) {
  return String(stat || "").replace(/([A-Z])/g, " $1").replace(/^./, char => char.toUpperCase());
}

function claimAchievementEssence(achievement) {
  const amount = getAchievementEssenceReward(achievement);
  if (!amount || save.achievementEssenceClaims[achievement.id]) return 0;
  save.achievementEssenceClaims[achievement.id] = true;
  save.essence = Math.max(0, Math.round((Number(save.essence) || 0) + amount));
  return amount;
}

function getAchievementEssenceReward(achievement) {
  return Math.max(0, Math.round(Number(achievement?.essenceReward) || 0));
}

function resetSave() {
  if (!confirm("Reset all Essence and upgrades?")) return;
  const currentSettings = { ...save.settings };
  save = { ...defaultSave(), settings: currentSettings };
  stopBattleLoop();
  run = null;
  battle = null;
  saveGame();
  renderTree();
  showScreen("menuScreen");
}

function getBattleSpeedPreference() {
  const speed = Number(save.settings.battleSpeed) || 1;
  return [1, 1.5, 2].includes(speed) ? speed : 1;
}

function createRun(difficultyId, mode = "standard") {
  const endless = mode === "endless";
  const buildTest = mode === "buildTest";
  const gauntlet = mode === "gauntlet";
  const themeIds = getThemeIdsForDifficulty(difficultyId, mode);
  const themeId = themeIds[0] || getRandomThemeForDifficulty(difficultyId);
  return {
    mode: gauntlet ? "gauntlet" : buildTest ? "buildTest" : endless ? "endless" : "standard",
    runId: `local-run-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    runSeed: Math.floor(Math.random() * 1000000000),
    difficultyId,
    themeId,
    themeIds,
    classId: null,
    stage: 1,
    startedAt: Date.now(),
    maxStage: STAGE_COUNT,
    gold: 0,
    essenceEarned: 0,
    rewardNames: [],
    rewardCounts: {},
    rewardDescriptions: {},
    relics: [],
    talents: [],
    shopItems: [],
    shopsVisited: 0,
    summary: {
      enemiesDefeated: 0,
      goldEarned: 0,
      essenceEarned: 0,
      relicsCollected: 0,
      talentsChosen: 0,
      damageDealt: 0,
      damageTaken: 0
    },
    afterRewardAction: null,
    stagesCleared: 0,
    hero: null,
    buildTestSelections: buildTest ? { skills: {}, upgrades: {}, relics: {}, talents: {} } : null,
    gauntlet: gauntlet ? { opponent: null, challengeRank: null, pointsAwarded: 0, coinsAwarded: 0 } : null,
    map: endless || buildTest || gauntlet ? [] : generateRunMap(themeIds),
    currentNodeId: endless || buildTest || gauntlet ? null : "s1-start",
    chosenNodeIds: endless || buildTest || gauntlet ? [] : ["s1-start"],
    availableNodeIds: []
  };
}

function isEndlessRun() {
  return run && run.mode === "endless";
}

function isBuildTestRun() {
  return run && run.mode === "buildTest";
}

function isGauntletRun() {
  return run && run.mode === "gauntlet";
}

function getThemeIdsForDifficulty(difficultyId, mode = "standard") {
  const difficulty = DIFFICULTIES[difficultyId] || {};
  const themeIds = difficulty.themeIds && difficulty.themeIds.length ? difficulty.themeIds : Object.keys(BIOME_THEMES);
  if (mode === "standard") return themeIds.slice(0, MAP_LAYER_SIZE ? Math.ceil(STAGE_COUNT / MAP_LAYER_SIZE) : 3);
  return [themeIds[Math.floor(Math.random() * themeIds.length)] || themeIds[0] || "hauntedForest"];
}

function getRandomThemeForDifficulty(difficultyId) {
  const themeIds = (DIFFICULTIES[difficultyId] && DIFFICULTIES[difficultyId].themeIds) || Object.keys(BIOME_THEMES);
  return themeIds[Math.floor(Math.random() * themeIds.length)] || "hauntedForest";
}

function getRunLayer(stage = run?.stage || 1) {
  return Math.max(1, Math.min(3, Math.ceil(stage / MAP_LAYER_SIZE)));
}

function getRunThemeIds() {
  if (run?.themeIds && run.themeIds.length) return run.themeIds;
  return [run?.themeId].filter(Boolean);
}

function getRunThemeIdForStage(stage = run?.stage || 1) {
  const ids = getRunThemeIds();
  return ids[getRunLayer(stage) - 1] || ids[0] || run?.themeId || getRandomThemeForDifficulty(run?.difficultyId);
}

function getRunThemeForStage(stage = run?.stage || 1) {
  return BIOME_THEMES[getRunThemeIdForStage(stage)] || null;
}

function getDifficultyThemeNames(difficulty) {
  return (difficulty?.themeIds || []).map(themeId => BIOME_THEMES[themeId]?.name).filter(Boolean);
}

function getRunRouteName() {
  const difficulty = DIFFICULTIES[run?.difficultyId];
  if (!difficulty) return "Unknown Route";
  if (difficulty.mode) return difficulty.name;
  const areaNames = getRunThemeIds().map(themeId => BIOME_THEMES[themeId]?.name).filter(Boolean);
  return areaNames.length ? `${difficulty.name} / ${areaNames.join(" -> ")}` : difficulty.name;
}

function buildHero(classId) {
  const heroClass = CLASSES[classId];
  const skin = getSelectedHeroSkin(classId);
  const hero = {
    id: classId,
    name: heroClass.name,
    hp: Math.round(heroClass.hp * PLAYER_BASE_STAT_MULTIPLIER),
    maxHp: Math.round(heroClass.hp * PLAYER_BASE_STAT_MULTIPLIER),
    damage: heroClass.damage * PLAYER_BASE_STAT_MULTIPLIER,
    attackSpeed: heroClass.attackSpeed * PLAYER_BASE_STAT_MULTIPLIER,
    armor: Math.round(heroClass.armor * PLAYER_BASE_STAT_MULTIPLIER),
    crit: heroClass.crit * PLAYER_BASE_STAT_MULTIPLIER,
    luck: 0,
    lifeSteal: 0,
    regen: 0,
    x: 240,
    y: 215,
    attackCooldown: 0.35,
    colorClass: [heroClass.colorClass, skin.className].filter(Boolean).join(" "),
    skinId: skin.id
  };

  hero.maxHp += getPermanentEffectTotal("maxHp", classId);
  hero.hp = hero.maxHp;
  hero.damage += getPermanentEffectTotal("damage", classId);
  hero.attackSpeed += getPermanentEffectTotal("attackSpeed", classId);
  hero.damage *= 1 + getPermanentEffectTotal("damageMultiplier", classId);
  hero.attackSpeed *= 1 + getPermanentEffectTotal("attackSpeedMultiplier", classId);
  hero.armor += getPermanentEffectTotal("armor", classId);
  hero.crit += getPermanentEffectTotal("critChance", classId);
  hero.luck += getPermanentEffectTotal("luck", classId);
  hero.lifeSteal += getPermanentEffectTotal("lifeSteal", classId);
  hero.regen += getPermanentEffectTotal("regen", classId);
  hero.maxHp += getAchievementBonusTotal("maxHp", classId);
  hero.hp = hero.maxHp;
  hero.damage *= 1 + getAchievementBonusTotal("damageMultiplier", classId);
  hero.attackSpeed *= 1 + getAchievementBonusTotal("attackSpeedMultiplier", classId);
  hero.armor += getAchievementBonusTotal("armor", classId);
  hero.crit += getAchievementBonusTotal("critChance", classId);
  hero.luck += getAchievementBonusTotal("luck", classId);
  if (classId === "knight") hero.armor += getAchievementBonusTotal("knightArmor", classId);
  if (classId === "rogue") hero.crit += getAchievementBonusTotal("rogueCritChance", classId);
  applyEquipmentStatsToHero(hero);
  return hero;
}

function getTreeLevel(id) {
  return save.tree[id] || 0;
}

function getPermanentEffectTotal(effectName, classId) {
  return TREE_NODES.reduce((total, node) => {
    if (node.classId !== "global" && node.classId !== classId) return total;
    const level = getTreeLevel(node.id);
    if (!level || !node.effect || node.effect[effectName] === undefined) return total;
    return total + node.effect[effectName] * level;
  }, 0);
}

function getAchievementBonusTotal(effectName, classId) {
  if (!save.achievements || typeof ACHIEVEMENTS === "undefined") return 0;
  return ACHIEVEMENTS.reduce((total, achievement) => {
    if (!save.achievements[achievement.id] || !achievement.bonus) return total;
    return total + (achievement.bonus[effectName] || 0);
  }, 0);
}

function hasPermanentNode(id) {
  return getTreeLevel(id) > 0;
}

function hasPermanentUnlock(id) {
  return !!id && hasPermanentNode(id);
}

function hasAchievement(id) {
  return !!id && !!save?.achievements && !!save.achievements[id];
}

function hasDifficultyClear(id) {
  return !!id && !!save?.difficultyClears && !!save.difficultyClears[id];
}

function validateDifficultyProgression() {
  const originalTree = save.tree;
  save.tree = Object.keys(TREE).reduce((maxed, id) => {
    maxed[id] = TREE[id].maxLevel;
    return maxed;
  }, {});

  const warnings = [];
  Object.keys(DIFFICULTIES).filter(difficultyId => !DIFFICULTIES[difficultyId].mode).forEach(difficultyId => {
    Object.keys(CLASSES).forEach(classId => {
      const hero = buildHero(classId);
      const boss = estimateBossThreat(difficultyId, hero);
      const rewardDamageMultiplier = 8.5;
      const rewardHp = 1200;
      const relicDamageMultiplier = 2.2;
      const relicDefenseBuffer = 3.4;
      const classDamagePlan = classId === "wizard" ? 3.6 : classId === "rogue" ? 3.1 : 2.8;
      const classDefensePlan = classId === "wizard" ? 2.5 : classId === "rogue" ? 2.6 : 3.4;
      const dps = hero.damage * rewardDamageMultiplier * relicDamageMultiplier * classDamagePlan * getHeroAttackSpeed(hero) * (1 + hero.crit);
      const timeToWin = boss.hp / Math.max(1, dps);
      const survivalTime = ((hero.maxHp + rewardHp) * relicDefenseBuffer * classDefensePlan) / Math.max(1, boss.damagePerSecond);
      if (survivalTime < timeToWin * 0.82) {
        warnings.push(`${DIFFICULTIES[difficultyId].name} ${CLASSES[classId].name}: survival ${survivalTime.toFixed(1)}s vs win ${timeToWin.toFixed(1)}s`);
      }
    });
  });

  save.tree = originalTree;
  if (warnings.length) {
    console.warn("Balance sanity check: some max-progression boss routes may be too tight.", warnings);
  }
}

function estimateBossThreat(difficultyId, hero) {
  const difficulty = DIFFICULTIES[difficultyId];
  const boss = BOSSES[BOSSES.length - 1] || BOSS;
  const hpStageMult = 1 + ((STAGE_COUNT - 1) * (difficulty.stageHealthGrowth || 0.15));
  const dmgStageMult = 1 + ((STAGE_COUNT - 1) * (difficulty.stageDamageGrowth || 0.15));
  const layerHealthMult = (difficulty.layerEnemyMultipliers && difficulty.layerEnemyMultipliers[2]) || 1;
  const layerDamageMult = ((difficulty.layerDamageMultipliers || difficulty.layerEnemyMultipliers) && (difficulty.layerDamageMultipliers || difficulty.layerEnemyMultipliers)[2]) || 1;
  const hp = boss.hp * difficulty.enemyHealth * hpStageMult * layerHealthMult * 1.9;
  const rawDamage = Math.max(1, boss.damage * difficulty.enemyDamage * dmgStageMult * layerDamageMult * 1.4 - hero.armor);
  return {
    hp,
    damagePerSecond: rawDamage * boss.attackSpeed
  };
}
