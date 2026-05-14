let save = loadSave();
let run = null;
let battle = null;
let battleFrame = null;
let lastFrameTime = 0;

function defaultSave() {
  return {
    essence: 0,
    highestClear: 0,
    firstBossDefeated: false,
    stats: defaultAccountStats(),
    achievements: {},
    tree: getDefaultTreeLevels(),
    skins: defaultSkins(),
    skinPurchases: defaultSkinPurchases(),
    settings: defaultSettings()
  };
}

function defaultSkins() {
  return {
    heroes: Object.keys(CLASSES).reduce((skins, id) => ({ ...skins, [id]: "base" }), {}),
    enemies: Object.values(ENEMY_ARCHETYPES).reduce((skins, enemy) => ({ ...skins, [enemy.id]: "base" }), {})
  };
}

function defaultSkinPurchases() {
  return {
    heroes: Object.keys(CLASSES).reduce((purchases, id) => ({ ...purchases, [id]: { base: true } }), {}),
    enemies: Object.values(ENEMY_ARCHETYPES).reduce((purchases, enemy) => ({ ...purchases, [enemy.id]: { base: true } }), {})
  };
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
    enemyKills: {}
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
    if (parsed && parsed.settings && parsed.settings.sound === false && parsed.settings.soundMigrated !== true) {
      settings.sound = true;
      settings.soundMigrated = true;
    }
    const skinPurchases = normalizeSkinPurchases(parsed && parsed.skinPurchases, fallback.skinPurchases);
    const skins = normalizeSkins(parsed && parsed.skins, fallback.skins, skinPurchases);
    return {
      ...fallback,
      ...storedSave,
      tree,
      stats: { ...fallback.stats, ...((parsed && parsed.stats) || {}) },
      achievements: { ...fallback.achievements, ...((parsed && parsed.achievements) || {}) },
      skins,
      skinPurchases,
      settings
    };
  } catch {
    return defaultSave();
  }
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
    if (!getEnemySkin(id, next.enemies[id]) || !isSkinPurchased("enemy", id, next.enemies[id], purchases)) next.enemies[id] = "base";
  });
  return next;
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
    next.enemies[id].base = true;
  });
  return next;
}

function getHeroSkin(classId, skinId) {
  return (HERO_SKINS[classId] || HERO_SKINS.knight || []).find(skin => skin.id === skinId) || null;
}

function getEnemySkin(enemyId, skinId) {
  const enemy = getAllCharacterEnemies().find(item => item.id === enemyId) || Object.values(ENEMY_ARCHETYPES).find(item => item.id === enemyId) || { id: enemyId, name: "Enemy" };
  return getEnemySkinSet(enemy.id, enemy.name).find(skin => skin.id === skinId) || null;
}

function getSelectedHeroSkin(classId) {
  const skinId = save?.skins?.heroes?.[classId] || "base";
  const skin = getHeroSkin(classId, skinId) || getHeroSkin(classId, "base");
  return isSkinUnlocked(skin) && isSkinPurchased("hero", classId, skin.id) ? skin : getHeroSkin(classId, "base");
}

function getSelectedEnemySkin(enemyId) {
  const skinId = save?.skins?.enemies?.[enemyId] || "base";
  const skin = getEnemySkin(enemyId, skinId) || getEnemySkin(enemyId, "base");
  return isSkinUnlocked(skin) && isSkinPurchased("enemy", enemyId, skin.id) ? skin : getEnemySkin(enemyId, "base");
}

function isSkinUnlocked(skin) {
  if (!skin || !skin.unlock || skin.unlock.type === "base") return true;
  if (skin.unlock.type === "purchase") return true;
  if (skin.unlock.type === "tree") return !!save?.tree && (save.tree[skin.unlock.node] || 0) > 0;
  if (skin.unlock.type === "achievement") return !!save?.achievements && !!save.achievements[skin.unlock.achievement];
  return false;
}

function isSkinPurchased(kind, ownerId, skinId, purchases = save?.skinPurchases) {
  if (skinId === "base") return true;
  const bucket = kind === "hero" ? "heroes" : "enemies";
  return !!purchases?.[bucket]?.[ownerId]?.[skinId];
}

function getSkinUnlockText(skin) {
  if (!skin || !skin.unlock || skin.unlock.type === "base") return "Unlocked";
  if (skin.unlock.type === "purchase") return `${skin.unlock.cost || 0} Essence`;
  return "Locked";
}

function getAllCharacterEnemies() {
  const seen = new Set();
  return Object.values(ENEMY_ARCHETYPES).filter(enemy => {
    if (seen.has(enemy.id)) return false;
    seen.add(enemy.id);
    return true;
  });
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

function addAccountStat(id, amount) {
  if (!save.stats) save.stats = defaultAccountStats();
  save.stats[id] = (Number(save.stats[id]) || 0) + amount;
  checkAchievements();
}

function addEnemyKillStat(enemyId, amount = 1) {
  if (!enemyId) return;
  if (!save.stats) save.stats = defaultAccountStats();
  if (!save.stats.enemyKills) save.stats.enemyKills = {};
  save.stats.enemyKills[enemyId] = (Number(save.stats.enemyKills[enemyId]) || 0) + amount;
  checkAchievements();
}

function checkAchievements() {
  if (!save.achievements) save.achievements = {};
  if (typeof ACHIEVEMENTS === "undefined") return [];
  const unlocked = [];
  ACHIEVEMENTS.forEach(achievement => {
    if (save.achievements[achievement.id]) return;
    if (!achievement.condition(save)) return;
    save.achievements[achievement.id] = true;
    unlocked.push(achievement);
  });
  if (unlocked.length && typeof showAchievementPopup === "function") {
    unlocked.forEach(achievement => showAchievementPopup(achievement));
  }
  return unlocked;
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
  return [1, 2, 3].includes(speed) ? speed : 1;
}

function createRun(difficultyId) {
  const themeId = getRandomThemeForDifficulty(difficultyId);
  return {
    difficultyId,
    themeId,
    classId: null,
    stage: 1,
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
    map: generateRunMap(themeId),
    currentNodeId: "s1-start",
    chosenNodeIds: ["s1-start"],
    availableNodeIds: []
  };
}

function getRandomThemeForDifficulty(difficultyId) {
  const themeIds = (DIFFICULTIES[difficultyId] && DIFFICULTIES[difficultyId].themeIds) || Object.keys(BIOME_THEMES);
  return themeIds[Math.floor(Math.random() * themeIds.length)] || "hauntedForest";
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

function validateDifficultyProgression() {
  const originalTree = save.tree;
  save.tree = Object.keys(TREE).reduce((maxed, id) => {
    maxed[id] = TREE[id].maxLevel;
    return maxed;
  }, {});

  const warnings = [];
  Object.keys(DIFFICULTIES).forEach(difficultyId => {
    Object.keys(CLASSES).forEach(classId => {
      const hero = buildHero(classId);
      const boss = estimateBossThreat(difficultyId, hero);
      const rewardDamageMultiplier = 1.65;
      const rewardHp = 145;
      const relicDamageMultiplier = 1.25;
      const relicDefenseBuffer = 1.35;
      const classDamagePlan = classId === "wizard" ? 1.75 : classId === "rogue" ? 1.35 : 1.15;
      const classDefensePlan = classId === "wizard" ? 1.45 : classId === "rogue" ? 1.55 : 1;
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
  const layerEnemyMult = (difficulty.layerEnemyMultipliers && difficulty.layerEnemyMultipliers[2]) || 1;
  const hp = boss.hp * difficulty.enemyHealth * hpStageMult * layerEnemyMult * 1.9;
  const rawDamage = Math.max(1, boss.damage * difficulty.enemyDamage * dmgStageMult * layerEnemyMult * 1.4 - hero.armor);
  const classReduction = getPermanentEffectTotal("bossDamageTaken", hero.id) + getPermanentEffectTotal("eliteBossDamageTaken", hero.id);
  return {
    hp,
    damagePerSecond: rawDamage * Math.max(0.25, 1 - classReduction) * boss.attackSpeed
  };
}
