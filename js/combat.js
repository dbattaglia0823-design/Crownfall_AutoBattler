const WIZARD_BASE_SPLASH_CHANCE = 1;
const WIZARD_BASE_SPLASH_DAMAGE = 0.25;
const WIZARD_BASE_BURN_CHANCE = 0.1;
const WIZARD_BASE_BURN_DURATION = 3.5;
const WIZARD_BASE_SLOW_VALUE = 0.2;
const STATUS_SLOW_VALUE_CAP = 0.55;
const ROGUE_BASE_EXECUTE_THRESHOLD = 0.32;
const ROGUE_VENOM_BLADE_STAGE_SCALING = 0.28;
const ROGUE_TRAP_SLOW_VALUE = 0.28;
const ROGUE_TRAP_SLOWED_DAMAGE = 0.08;
const BUILD_TEST_MAX_HERO_ATTACK_SPEED = 30;
const BUILD_TEST_MAX_HERO_ATTACKS_PER_FRAME = 16;
const BUILD_TEST_MAX_ENEMY_ATTACKS_PER_FRAME = 4;
const BUILD_TEST_MAX_FLOATING_TEXTS = 36;
const BUILD_TEST_MAX_PARTICLES = 48;
const BUILD_TEST_FLOAT_TEXTS_PER_SECOND = 35;
const BATTLE_START_INTRO_MS = 620;
let battleStartTimeout = null;

function startRun(classId) {
  battleLog.innerHTML = "";
  run.classId = classId;
  run.gold = 20 + getPermanentEffectTotal("startingGold", classId) + getAchievementBonusTotal("startingGold", classId);
  run.hero = buildHero(classId);
  if (isBuildTestRun()) {
    run.gold = 0;
    run.essenceEarned = 0;
    run.buildTestSelections = { skills: {}, upgrades: {}, relics: {}, talents: {} };
    renderBuildTest();
    return showScreen("buildTestScreen");
  }
  addAccountStat("runsStarted", 1);
  addAccountStat(`${classId}Runs`, 1);
  saveGame();
  beginStage(getCurrentRunNodeType());
}

function beginStage(nodeType) {
  stopBattleLoop();
  applyRunTheme();
  showScreen("battleScreen");
  setupBattle(nodeType);
  battle.startIntroActive = true;
  setBattleLogVisible(!isBuildTestRun());
  updateRunHud();
  renderBattle();
  if (!battle.enemies.some(enemy => enemy.boss)) {
    log(`Stage ${run.stage}: ${nodeType} begins. ${run.hero.name} faces ${battle.enemies.map(enemy => enemy.name).join(", ")}.`, "info");
  }
  const introDuration = save.settings.reduceAnimations ? 180 : BATTLE_START_INTRO_MS;
  battleStartTimeout = setTimeout(() => {
    battleStartTimeout = null;
    if (!battle || battle.state !== "fighting") return;
    battle.startIntroActive = false;
    lastFrameTime = performance.now();
    renderBattle();
    battleFrame = requestAnimationFrame(battleLoop);
  }, introDuration);
}

function setupBattle(nodeType) {
  run.hero.x = 240;
  run.hero.y = 215;
  run.hero.spriteAnim = null;
  run.hero.hp = run.hero.maxHp;
  run.hero.attackCooldown = 1 / getHeroAttackSpeed(run.hero);
  run.hero.shield = 0;
  run.hero.battleAttackSpeedBonus = 0;
  run.hero.battleDamageBonus = 0;
  run.hero.attackCount = 0;

  const enemies = [];
  if (nodeType === "BuildTest") {
    const crown = makeEnemy(FINAL_BOSS, 640, 215, true, "FinalBoss");
    crown.hp = 1000000000000000;
    crown.maxHp = crown.hp;
    crown.damage = 100;
    crown.attackSpeed = 0.5;
    crown.attackCooldown = 1 / crown.attackSpeed;
    crown.crownDamageRamp = 0.5;
    crown.buildTestBoss = true;
    enemies.push(crown);
  } else if (isGauntletRun()) {
    enemies.push(makeGauntletEnemy(run.gauntlet?.opponent));
  } else if (isFinalBossStage(run.stage) || nodeType === "FinalBoss") {
    enemies.push(makeEnemy(FINAL_BOSS, 640, 215, true, "FinalBoss"));
  } else if (isBossStage(run.stage) || nodeType === "Boss") {
    enemies.push(makeEnemy(getBossForStage(run.stage), 640, 215, true, nodeType));
  } else if (nodeType === "Elite") {
    const enemyPool = getAreaEnemyPool();
    const baseEnemy = enemyPool[run.stage % enemyPool.length];
    enemies.push(makeEnemy(baseEnemy, 640, 215, false, nodeType));
  } else if (isEndlessRun()) {
    const enemyPool = getAreaEnemyPool();
    const baseEnemy = enemyPool[run.stage % enemyPool.length];
    enemies.push(makeEnemy(baseEnemy, 640, 215, false, nodeType));
  } else {
    const count = 2 + Math.floor(run.stage / 3);
    const enemyPool = getAreaEnemyPool();
    getEnemyPositions(count).forEach((position, index) => {
      const baseEnemy = enemyPool[(run.stage + index) % enemyPool.length];
      enemies.push(makeEnemy(baseEnemy, position.x, position.y, false, nodeType));
    });
  }

  const bossIntroEnemy = enemies.find(enemy => enemy.boss);
  battle = {
    enemies,
    floatingTexts: [],
    particles: [],
    pendingHits: [],
    elapsed: 0,
    speedMultiplier: getBattleSpeedPreference(),
    nodeType,
    state: "fighting",
    result: null,
    damageDone: 0,
    damageTaken: 0,
    enemiesKilled: 0,
    skillsUsed: {},
    activeSkills: {},
    abilityCooldowns: getInitialAbilityCooldowns(),
    activeAbilityEffects: {},
    recentAbilities: {},
    bossIntroTimer: bossIntroEnemy ? (bossIntroEnemy.finalBoss ? 2.8 : 1.35) : 0,
    bossIntroDuration: bossIntroEnemy ? (bossIntroEnemy.finalBoss ? 2.8 : 1.35) : 0,
    nextCombatLogAt: 3,
    guardianSealUsed: false,
    smokeStepUsed: false,
    chronoSealUsed: false,
    infernoCrownUsed: false
  };
  applyBattleStartTalents();
  applyBattleStartPermanentEffects();
  if (bossIntroEnemy) playSound("bossIntro");
  logBattleOpponents();
}

function isBossStage(stage) {
  return stage % MAP_LAYER_SIZE === 0;
}

function isFinalBossStage(stage) {
  return !isEndlessRun() && stage === FINAL_BOSS_STAGE;
}

function getCurrentRunNodeType() {
  if (!isEndlessRun()) return "Battle";
  return getEndlessNodeType(run.stage);
}

function getEndlessNodeType(stage) {
  if (stage > 0 && stage % 10 === 0) return "Boss";
  if (stage > 0 && stage % 5 === 0) return "Elite";
  return "Battle";
}

function getBossForStage(stage) {
  return BOSSES[Math.min(BOSSES.length - 1, Math.floor((stage - 1) / MAP_LAYER_SIZE))];
}

function getAreaEnemyPool() {
  const theme = getRunThemeForStage();
  if (theme && theme.enemyPool && theme.enemyPool.length) return filterUnlockedEnemies(theme.enemyPool);
  const difficulty = DIFFICULTIES[run.difficultyId] || {};
  return difficulty.enemyPool && difficulty.enemyPool.length ? filterUnlockedEnemies(difficulty.enemyPool) : ENEMIES;
}

function filterUnlockedEnemies(enemyPool) {
  const unlocked = enemyPool.filter(enemy => isRegularEncounterEnemy(enemy) && (!enemy.requiresNode || hasPermanentUnlock(enemy.requiresNode)));
  return unlocked.length ? unlocked : ENEMIES;
}

function logBattleOpponents() {
  battle.enemies.forEach(enemy => {
    if (enemy.boss) return;
    if (enemy.miniBoss) log(`${enemy.name} challenges you as a mini boss.`, "enemy");
    if (enemy.eliteSkill) log(`${enemy.name} readies ${enemy.eliteSkill}.`, "enemy");
  });
}

function getEnemyPositions(count) {
  const x = 650;
  if (count <= 1) return [{ x, y: 215 }];
  if (count === 2) return [{ x: x - 38, y: 160 }, { x: x + 38, y: 270 }];
  if (count === 3) return [{ x: x - 46, y: 126 }, { x: x + 46, y: 215 }, { x: x - 46, y: 304 }];
  return [
    { x: x - 62, y: 120 },
    { x: x + 62, y: 185 },
    { x: x - 62, y: 250 },
    { x: x + 62, y: 315 }
  ];
}

function makeEnemy(base, x, y, boss, nodeType) {
  const skin = getSelectedEnemySkin(base.id);
  const scaledHp = Math.round(base.hp * ENEMY_BASE_STAT_MULTIPLIER);
  const scaledDamage = base.damage * ENEMY_BASE_STAT_MULTIPLIER;
  const scaledAttackSpeed = base.attackSpeed * ENEMY_BASE_STAT_MULTIPLIER;
  const scaledArmor = Math.round((base.armor || 0) * ENEMY_BASE_STAT_MULTIPLIER);
  const scaledArmorPiercing = Math.round((base.armorPiercing || 0) * ENEMY_BASE_STAT_MULTIPLIER);
  if (base.finalBoss || nodeType === "FinalBoss") {
    return {
      ...base,
      spriteSheet: getAreaEnemySpriteSheet(base),
      x,
      y,
      hp: scaledHp,
      maxHp: scaledHp,
      damage: scaledDamage,
      armor: 0,
      armorPiercing: scaledArmorPiercing,
      shield: 0,
      attackSpeed: scaledAttackSpeed,
      attackCooldown: 1 / Math.max(0.01, scaledAttackSpeed),
      skinClass: skin.className,
      skinId: skin.id,
      boss: true,
      miniBoss: false,
      statusEffects: {}
    };
  }

  const difficulty = DIFFICULTIES[run.difficultyId];
  const endlessStage = Math.max(0, run.stage - 1);
  const hpStageMult = isEndlessRun() ? Math.pow(difficulty.endlessHealthGrowth || 1.13, endlessStage) : 1 + (endlessStage * (difficulty.stageHealthGrowth || 0.15));
  const dmgStageMult = isEndlessRun() ? Math.pow(difficulty.endlessDamageGrowth || 1.08, endlessStage) : 1 + (endlessStage * (difficulty.stageDamageGrowth || 0.15));
  const layerHealthMult = isEndlessRun() ? 1 : getLayerEnemyMultiplier();
  const layerDamageMult = isEndlessRun() ? 1 : getLayerEnemyDamageMultiplier();
  const secondLayerStage = Math.max(0, run.stage - MAP_LAYER_SIZE);
  const secondLayerArmor = secondLayerStage > 0 ? 1 + Math.floor(secondLayerStage / 2) : 0;
  let hpMult = difficulty.enemyHealth * hpStageMult * layerHealthMult;
  let dmgMult = difficulty.enemyDamage * dmgStageMult * layerDamageMult;

  const miniBoss = nodeType === "Elite" && !boss;

  if (miniBoss) {
    hpMult *= 3.45;
    dmgMult *= 2.05;
  }
  if (boss) {
    hpMult *= 1.9;
    dmgMult *= 1.4;
  }

  const eliteMod = miniBoss ? getEliteModifier(run.stage, x) : null;

  return {
    ...base,
    spriteSheet: getAreaEnemySpriteSheet(base),
    name: miniBoss && eliteMod ? `${eliteMod.name} ${base.name}` : base.name,
    skillName: base.skillName,
    eliteSkill: eliteMod ? eliteMod.skillName : null,
    x,
    y,
    hp: Math.round(scaledHp * hpMult),
    maxHp: Math.round(scaledHp * hpMult),
    damage: scaledDamage * dmgMult * (eliteMod ? (eliteMod.damageMultiplier || 1) : 1),
    armor: scaledArmor + Math.floor(run.stage / (difficulty.armorGrowth || 4)) + secondLayerArmor + (miniBoss ? 2 : 0) + (eliteMod ? (eliteMod.armor || 0) : 0),
    armorPiercing: scaledArmorPiercing,
    attackSpeed: scaledAttackSpeed * (miniBoss ? 1.05 : 1) * (eliteMod ? (eliteMod.attackSpeedMultiplier || 1) : 1),
    attackCooldown: 1 / Math.max(0.01, scaledAttackSpeed * (miniBoss ? 1.05 : 1) * (eliteMod ? (eliteMod.attackSpeedMultiplier || 1) : 1)),
    skinClass: skin.className,
    skinId: skin.id,
    boss,
    miniBoss,
    statusEffects: {}
  };
}

function getLayerEnemyMultiplier() {
  const difficulty = DIFFICULTIES[run.difficultyId] || {};
  const layer = Math.max(1, Math.min(3, Math.ceil(run.stage / MAP_LAYER_SIZE)));
  const multipliers = difficulty.layerEnemyMultipliers || [1, 1, 1];
  return multipliers[layer - 1] || 1;
}

function getLayerEnemyDamageMultiplier() {
  const difficulty = DIFFICULTIES[run.difficultyId] || {};
  const layer = Math.max(1, Math.min(3, Math.ceil(run.stage / MAP_LAYER_SIZE)));
  const multipliers = difficulty.layerDamageMultipliers || difficulty.layerEnemyMultipliers || [1, 1, 1];
  return multipliers[layer - 1] || 1;
}

function getEliteModifier(stage, seed) {
  return ELITE_TITLES[Math.abs(stage + Math.round(seed)) % ELITE_TITLES.length];
}

function battleLoop(now) {
  if (!battle || battle.state === "done") return;
  if (battle.state === "result") return;

  const realDt = Math.min(0.05, (now - lastFrameTime) / 1000 || 0);
  lastFrameTime = now;
  if (battle.paused) {
    updateRunHud();
    renderBattle();
    battleFrame = requestAnimationFrame(battleLoop);
    return;
  }
  battle.elapsed += realDt;
  battle.speedMultiplier = getBattleSpeedMultiplier(battle.elapsed);
  const dt = realDt * battle.speedMultiplier;
  updateVisualTimers(realDt);

  if (battle.bossIntroTimer > 0) {
    updateRunHud();
    renderBattle();
    battleFrame = requestAnimationFrame(battleLoop);
    return;
  }

  applyStatusEffects(dt);

  updateBattle(dt);
  if (!battle || battle.state === "done") return;
  maybeLogCombatSnapshot();
  updateRunHud();
  renderBattle();
  if (battle.state !== "result") battleFrame = requestAnimationFrame(battleLoop);
}

function maybeLogCombatSnapshot() {
  if (!battle || battle.state !== "fighting" || battle.bossIntroTimer > 0) return;
  if (battle.elapsed < (battle.nextCombatLogAt || 3)) return;
  battle.nextCombatLogAt = battle.elapsed + 3;
  const aliveEnemies = battle.enemies.filter(enemy => enemy.hp > 0);
  if (!aliveEnemies.length || run.hero.hp <= 0) return;
  const focus = aliveEnemies
    .slice()
    .sort((a, b) => (b.boss ? 1 : 0) - (a.boss ? 1 : 0) || a.hp - b.hp)[0];
  log(`Status: ${run.hero.name} ${Math.ceil(run.hero.hp)}/${Math.ceil(run.hero.maxHp)} HP. Focus ${focus.name} ${Math.ceil(focus.hp)}/${Math.ceil(focus.maxHp)} HP.`, "info");
}

function updateBattle(dt) {
  const hero = run.hero;
  const aliveEnemies = battle.enemies.filter(enemy => enemy.hp > 0);

  if (hero.hp <= 0) return prepareBattleResult(false);
  if (!aliveEnemies.length) {
    if (battle.enemies.some(enemy => (enemy.deathTimer || 0) > 0)) return;
    return prepareBattleResult(true);
  }

  const target = aliveEnemies
    .slice()
    .sort((a, b) => (b.boss ? 1 : 0) - (a.boss ? 1 : 0) || a.hp - b.hp)[0];

  updateRunAbilities(hero, target, dt);

  hero.attackCooldown -= dt;
  let heroAttacksThisFrame = 0;
  const maxHeroAttacks = getFrameAttackLimit("hero");
  while (hero.attackCooldown <= 0 && target.hp > 0 && heroAttacksThisFrame < maxHeroAttacks) {
    heroAttack(hero, target);
    hero.attackCooldown += 1 / getCombatHeroAttackSpeed(hero);
    heroAttacksThisFrame += 1;
  }
  if (heroAttacksThisFrame >= maxHeroAttacks && hero.attackCooldown <= 0) hero.attackCooldown = 1 / getCombatHeroAttackSpeed(hero);

  aliveEnemies.forEach(enemy => {
    if (enemy.hp <= 0 || hero.hp <= 0) return;
    enemy.attackCooldown -= dt;
    let enemyAttacksThisFrame = 0;
    const maxEnemyAttacks = getFrameAttackLimit("enemy");
    while (enemy.attackCooldown <= 0 && hero.hp > 0 && enemyAttacksThisFrame < maxEnemyAttacks) {
      enemyAttack(enemy, hero);
      enemy.attackCooldown += 1 / getEnemyAttackSpeed(enemy);
      enemyAttacksThisFrame += 1;
    }
    if (enemyAttacksThisFrame >= maxEnemyAttacks && enemy.attackCooldown <= 0) enemy.attackCooldown = 1 / getEnemyAttackSpeed(enemy);
  });
}

function getAreaEnemySpriteSheet(enemy) {
  const theme = getRunThemeForStage();
  return theme?.spriteSheets?.enemies?.[enemy?.id] || theme?.enemySpriteSheets?.[enemy?.id] || enemy?.spriteSheet || "";
}

function updateVisualTimers(dt) {
  if (!battle) return;
  updateUnitSpriteAnimation(run.hero, dt);
  run.hero.hitFlash = Math.max(0, (run.hero.hitFlash || 0) - dt);
  battle.enemies.forEach(enemy => {
    updateUnitSpriteAnimation(enemy, dt);
    enemy.hitFlash = Math.max(0, (enemy.hitFlash || 0) - dt);
    enemy.deathTimer = Math.max(0, (enemy.deathTimer || 0) - dt);
  });
  battle.floatingTexts = (battle.floatingTexts || [])
    .map(float => ({ ...float, age: (float.age || 0) + dt }))
    .filter(float => float.age < (float.life || FLOAT_TEXT_LIFETIME));
  battle.particles = battle.particles
    .map(particle => ({ ...particle, age: particle.age + dt }))
    .filter(particle => particle.age < particle.life);
  if (isBuildTestRun() && battle.particles.length > BUILD_TEST_MAX_PARTICLES) {
    battle.particles = battle.particles.slice(-BUILD_TEST_MAX_PARTICLES);
  }
  battle.pendingHits = (battle.pendingHits || []).filter(hit => {
    hit.delay -= dt;
    if (hit.delay > 0) return true;
    applyPendingHit(hit);
    return false;
  });
  battle.bossIntroTimer = Math.max(0, (battle.bossIntroTimer || 0) - dt);
  Object.keys(battle.activeSkills || {}).forEach(name => {
    battle.activeSkills[name] -= dt;
    if (battle.activeSkills[name] <= 0) delete battle.activeSkills[name];
  });
  Object.keys(battle.activeAbilityEffects || {}).forEach(id => {
    battle.activeAbilityEffects[id] -= dt;
    if (battle.activeAbilityEffects[id] <= 0) delete battle.activeAbilityEffects[id];
  });
  Object.keys(battle.recentAbilities || {}).forEach(id => {
    battle.recentAbilities[id] -= dt;
    if (battle.recentAbilities[id] <= 0) delete battle.recentAbilities[id];
  });
}

function updateUnitSpriteAnimation(unit, dt) {
  if (!unit || !unit.spriteAnim || unit.spriteAnim.type === "downed") return;
  unit.spriteAnim.remaining -= dt;
  if (unit.spriteAnim.remaining <= 0) unit.spriteAnim = null;
}

function startUnitSpriteAnimation(unit, type, duration) {
  if (!unit) return;
  unit.spriteAnim = { type, duration, remaining: duration };
}

function stopBattleLoop() {
  if (battleStartTimeout) clearTimeout(battleStartTimeout);
  battleStartTimeout = null;
  if (battleFrame) cancelAnimationFrame(battleFrame);
  battleFrame = null;
}

function getBattleSpeedMultiplier() {
  return getBattleSpeedPreference();
}

function heroAttack(hero, enemy) {
  startUnitSpriteAnimation(hero, "attack", 0.42);
  spawnHeroAttackEffect(hero, enemy);

  let damage = hero.damage * (1 + (hero.battleDamageBonus || 0));
  const goldDamageMultiplier = getHeroGoldDamageMultiplier(hero);
  if (goldDamageMultiplier) damage *= 1 + goldDamageMultiplier;
  hero.attackCount = (hero.attackCount || 0) + 1;
  const guaranteedCritEvery = getPermanentEffectTotal("guaranteedCritEvery", hero.id);
  const guaranteedCrit = guaranteedCritEvery > 0 && hero.attackCount % guaranteedCritEvery === 0;
  const hasMegaCrit = getPermanentEffectTotal("megaCritFromOvercap", hero.id) > 0;
  const megaCritChance = hasMegaCrit ? Math.min(1, Math.max(0, hero.crit - 1)) : 0;
  const megaCrit = megaCritChance > 0 && Math.random() < megaCritChance;
  const crit = megaCrit || guaranteedCrit || Math.random() < Math.min(1, Math.max(0, hero.crit));
  if (crit) {
    playSound("crit");
    damage *= 2 + (hero.runCritDamage || 0) + getPermanentEffectTotal("critDamage", hero.id) + (megaCrit ? getPermanentEffectTotal("megaCritDamage", hero.id) : 0);
    const critSpeedBonus = getPermanentEffectTotal("critAttackSpeedBonus", hero.id);
    if (critSpeedBonus) {
      hero.battleAttackSpeedBonus = Math.min(0.35, (hero.battleAttackSpeedBonus || 0) + critSpeedBonus);
      addFloat(hero.x, hero.y - 62, "Rhythm", "#fde68a");
      triggerSkillVfx(hero.x, hero.y, "Deadly Rhythm", "rogue");
    }
    triggerScreenShake("light");
  }

  const lastStandThreshold = getTalentEffectNumber("knight_last_stand", "threshold");
  const lastStandValue = getTalentEffectNumber("knight_last_stand", "value");
  if (lastStandValue && hero.hp / hero.maxHp < lastStandThreshold) {
    damage *= 1 + lastStandValue;
  }
  if (hero.hp / hero.maxHp < 0.4) {
    const lowHpDamage = getPermanentEffectTotal("lowHpDamage", hero.id) + (hero.runLowHpDamage || 0);
    damage *= 1 + lowHpDamage;
    if (lowHpDamage) triggerSkillVfx(hero.x, hero.y, "Unbroken", "knight");
  }

  const executionerThreshold = getTalentEffectNumber("rogue_executioner", "threshold");
  const executionerValue = getTalentEffectNumber("rogue_executioner", "value");
  if (executionerValue && enemy.hp / enemy.maxHp < executionerThreshold) {
    damage *= 1 + executionerValue;
  }
  const executeThreshold = getHeroExecuteThreshold(hero);
  if (enemy.hp / enemy.maxHp < executeThreshold) {
    const executeDamage = getPermanentEffectTotal("executeDamage", hero.id) + (hero.runExecuteDamage || 0);
    damage *= 1 + executeDamage;
    if (executeDamage) triggerSkillVfx(enemy.x, enemy.y, "Execution", "rogue");
  }

  const manaSurgeValue = getTalentEffectNumber("wizard_mana_surge", "value");
  if (manaSurgeValue && hero.attackCount % 3 === 0) {
    const bonus = hero.damage * manaSurgeValue;
    damage += bonus;
    addFloat(enemy.x, enemy.y - 58, "Mana Surge", "#c4b5fd");
  }
  const permanentThirdAttack = getPermanentEffectTotal("thirdAttackBonus", hero.id) + (hero.runThirdAttackBonus || 0);
  if (permanentThirdAttack && hero.attackCount % 3 === 0) {
    damage += hero.damage * permanentThirdAttack;
    addFloat(enemy.x, enemy.y - 58, "Rune Burst", "#c4b5fd");
    triggerSkillVfx(enemy.x, enemy.y, "Rune Burst", "wizard");
  }

  if (hero.id === "rogue") {
    const bleedDamage = getHeroBleedDamage(hero);
    const bleedApplied = applyEnemyStatus(enemy, "bleed", {
      damage: bleedDamage,
      duration: Infinity
    });
    const bleedAttackSpeed = getPermanentEffectTotal("bleedAttackSpeed", hero.id) + (hero.runBleedAttackSpeed || 0);
    if (bleedApplied && bleedAttackSpeed) hero.battleAttackSpeedBonus = Math.min(0.35, (hero.battleAttackSpeedBonus || 0) + bleedAttackSpeed);
    if (bleedApplied && (getPermanentEffectTotal("bleedMaxHpPercent", hero.id) || bleedAttackSpeed || hero.runBleedMaxHpPercent)) triggerSkillVfx(enemy.x, enemy.y, "Bleed", "rogue");
  }

  if (hero.id === "wizard" && Math.random() < WIZARD_BASE_SPLASH_CHANCE) {
    battle.enemies
      .filter(other => other !== enemy && other.hp > 0)
      .forEach(other => {
        const splash = damageEnemy(other, hero.damage * getWizardSplashDamageMultiplier(hero), "#93c5fd");
        addFloat(other.x, other.y - 35, Math.round(splash), "#93c5fd");
      });
    const arcaneWardShield = getTalentEffectNumber("wizard_arcane_ward", "value");
    if (arcaneWardShield) addHeroShield(arcaneWardShield, "Arcane Ward");
    const splashShield = getPermanentEffectTotal("splashShield", hero.id) + (hero.runSplashShield || 0);
    if (splashShield) addHeroShield(splashShield, "Mana Shield");
    if (getPermanentEffectTotal("splashDamageMultiplier", hero.id) || hero.runSplashDamageMultiplier || splashShield) triggerSkillVfx(hero.x, hero.y, "Arcane", "wizard");
  }

  if (Math.random() < getTalentEffectNumber("rogue_venom_blade", "chance")) {
    const venom = getTalent("rogue_venom_blade").effect;
    applyEnemyStatus(enemy, "poison", {
      ...venom,
      damage: getRogueAttackPoisonDamage(hero, venom)
    });
  }
  if (Math.random() < getTalentEffectNumber("wizard_frostbite_hex", "chance")) {
    applyEnemyStatus(enemy, "slow", getTalent("wizard_frostbite_hex").effect);
  }
  const slowChance = getPermanentEffectTotal("slowChance", hero.id) + (hero.runSlowChance || 0);
  if (slowChance && Math.random() < slowChance) {
    applyEnemyStatus(enemy, "slow", { duration: 3.5, value: getWizardAttackSlowValue(hero) });
    triggerSkillVfx(enemy.x, enemy.y, "Frost Hex", "wizard");
  }
  const delayChance = getPermanentEffectTotal("delayChance", hero.id);
  if (delayChance && Math.random() < delayChance) {
    enemy.attackCooldown += getPermanentEffectTotal("delayAmount", hero.id) || 0.35;
    addFloat(enemy.x, enemy.y - 58, "Delayed", "#bae6fd");
    log(`${enemy.name}'s next attack was delayed.`, "skill");
    triggerSkillVfx(enemy.x, enemy.y, "Time Thread", "wizard");
  }
  if (hero.id === "wizard" && Math.random() < getWizardBurnChance(hero)) {
    applyEnemyStatus(enemy, "burn", { damage: getWizardBurnDamage(hero, enemy), duration: WIZARD_BASE_BURN_DURATION });
  }
  if (getPermanentEffectTotal("firstSpellBurnAll", hero.id) && !battle.infernoCrownUsed) {
    battle.infernoCrownUsed = true;
    battle.enemies.filter(other => other.hp > 0).forEach(other => applyEnemyStatus(other, "burn", { damage: getWizardBurnDamage(hero, other), duration: WIZARD_BASE_BURN_DURATION }));
    addFloat(hero.x, hero.y - 65, "Inferno Crown", "#fb923c");
    triggerSkillVfx(hero.x, hero.y, "Inferno Crown", "wizard");
  }
  const meteorChance = getTalentEffectNumber("wizard_meteor_spark", "chance") + (hero.runMeteorChance || 0);
  if (meteorChance && Math.random() < meteorChance) {
    battle.enemies.filter(other => other.hp > 0).forEach(other => {
      const meteorMultiplier = Math.max(hero.runMeteorDamageMultiplier || 0, getTalentEffectNumber("wizard_meteor_spark", "damageMultiplier", 0.4));
      damageEnemy(other, hero.damage * meteorMultiplier, "#fca5a5");
      addFloat(other.x, other.y - 54, "Meteor", "#fca5a5");
    });
  }

  if (enemy.statusEffects && enemy.statusEffects.burn) damage *= 1 + getPermanentEffectTotal("burningEnemyDamage", hero.id) + (hero.runBurningEnemyDamage || 0);
  if (enemy.statusEffects && enemy.statusEffects.curse) damage *= 1 + enemy.statusEffects.curse.value;
  if (enemy.statusEffects && enemy.statusEffects.slow) damage *= 1 + getPermanentEffectTotal("slowedEnemyDamage", hero.id) + (hero.runSlowedEnemyDamage || 0) + (hero.id === "rogue" ? ROGUE_TRAP_SLOWED_DAMAGE : 0);
  if ((hero.holySwordHitsRemaining || 0) > 0) {
    hero.holySwordHitsRemaining -= 1;
    damage *= 1 + (hero.holySwordDamageBonus || 0.5);
    triggerSkillVfx(enemy.x, enemy.y, "Holy", "knight");
  }
  const heavyHit = damage >= enemy.maxHp * 0.22 || damage >= 85;
  const hit = {
    enemy,
    damage,
    color: megaCrit ? "#f87171" : crit ? "#fde68a" : "#fca5a5",
    text: `${Math.round(damage)}${megaCrit ? "!!" : crit ? "!" : ""}`,
    variant: megaCrit ? "mega" : crit ? "crit" : heavyHit ? "heavy" : "",
    heavy: heavyHit,
    shake: crit && heavyHit ? "heavy" : heavyHit ? "light" : ""
  };
  if (hero.id === "wizard") queuePendingHit(hit, 0.22);
  else applyPendingHit(hit);
}

function queuePendingHit(hit, delay) {
  if (!battle) return applyPendingHit(hit);
  if (isBuildTestRun()) return applyPendingHit(hit);
  battle.pendingHits.push({ ...hit, delay });
}

function applyPendingHit(hit) {
  const enemy = hit.enemy;
  if (!enemy || enemy.hp <= 0) return;
  const actualDamage = damageEnemy(enemy, hit.damage, hit.color, { heavy: hit.heavy });
  if (!hit.variant || hit.variant === "heavy") playSound("swordHit");
  addFloat(enemy.x, enemy.y - 38, `${Math.round(actualDamage)}${hit.text.endsWith("!!") ? "!!" : hit.text.endsWith("!") ? "!" : ""}`, hit.color, { variant: hit.variant });
  if (hit.variant === "crit" || hit.variant === "mega") addFloat(enemy.x, enemy.y - 72, "+Crit", "#fde68a", { variant: "crit" });
  if (hit.variant === "mega") log(`Mega crit: ${Math.round(actualDamage)} damage to ${enemy.name}.`, "hero");
  else if (hit.variant === "crit") log(`Critical hit: ${Math.round(actualDamage)} damage to ${enemy.name}.`, "hero");
  else if (hit.variant === "heavy") log(`Heavy hit: ${Math.round(actualDamage)} damage to ${enemy.name}.`, "hero");
  if (hit.shake) triggerScreenShake(hit.shake);
}

function enemyAttack(enemy, hero) {
  startUnitSpriteAnimation(enemy, "attack", 0.38);
  if (enemy.boss) spawnBossSlashEffect(hero);
  else spawnSlashEffect(hero, "sword");
  const crownAttackCount = enemy.finalBoss ? (enemy.crownAttackCount || 0) : 0;
  const crownDamageMultiplier = enemy.finalBoss ? 1 + crownAttackCount * (enemy.crownDamageRamp || 0.2) : 1;
  if (enemy.finalBoss) enemy.crownAttackCount = crownAttackCount + 1;
  let damage = Math.max(1, enemy.damage);
  damage *= crownDamageMultiplier;
  if (enemy.finalBoss && crownAttackCount > 0) {
    addFloat(enemy.x, enemy.y - 78, `+${Math.round((crownDamageMultiplier - 1) * 100)}%`, "#fca5a5", { variant: "heavy" });
    log(`${enemy.name}'s decree grows stronger. Next blow: ${Math.round(crownDamageMultiplier * 100)}% damage.`, "danger");
  }
  let blockedByGuard = false;
  let blockPrevented = 0;
  const blockChance = getHeroBlockChance(hero);
  if (blockChance && Math.random() < blockChance) {
    const beforeBlock = damage;
    damage *= Math.max(0.5, 1 - blockChance * 0.5);
    blockPrevented = beforeBlock - damage;
    blockedByGuard = true;
  }
  if (!battle.smokeStepUsed && Math.random() < getPermanentEffectTotal("firstHitAvoidChance", hero.id)) {
    battle.smokeStepUsed = true;
    addFloat(hero.x, hero.y - 38, "Smoke Step", "#bae6fd");
    log(`${hero.name} avoided the first hit with Smoke Step.`, "hero");
    triggerSkillVfx(hero.x, hero.y, "Smoke Step", "rogue");
    return;
  }
  if (Math.random() < getTalentEffectNumber("rogue_evasion", "chance")) {
    addFloat(hero.x, hero.y - 38, "Evade", "#bae6fd");
    log(`${hero.name} evaded ${enemy.name}'s attack.`, "hero");
    onHeroEvaded(enemy, hero);
    return;
  }
  const evasionChance = Math.min(0.45, getPermanentEffectTotal("evasion", hero.id) + (hero.runEvasion || 0));
  if (Math.random() < evasionChance) {
    addFloat(hero.x, hero.y - 38, "Evasion", "#bae6fd");
    log(`${hero.name} evaded ${enemy.name}'s attack.`, "hero");
    onHeroEvaded(enemy, hero);
    return;
  }
  const firstHitReduction = hero.runFirstHitReduction || 0;
  if (firstHitReduction > 0 && !battle.guardianSealUsed) {
    damage *= 1 - firstHitReduction;
    battle.guardianSealUsed = true;
  }
  const holyShieldActive = (hero.holyShieldHitsRemaining || 0) > 0;
  const rawEffectiveArmor = holyShieldActive ? hero.armor * (1 + (hero.holyShieldArmorBonus || 0.5)) : hero.armor;
  const effectiveArmor = Math.max(0, rawEffectiveArmor - Math.max(0, Number(enemy.armorPiercing) || 0));
  if (holyShieldActive) {
    hero.holyShieldHitsRemaining -= 1;
    addFloat(hero.x, hero.y - 76, "Holy Guard", "#fde68a", { variant: "block" });
  }
  const mitigatedDamage = getArmorMitigatedDamage(damage, effectiveArmor);
  const armorPrevented = Math.max(0, damage - mitigatedDamage);
  const blocked = absorbHeroShield(mitigatedDamage);
  const totalBlocked = blocked + blockPrevented + armorPrevented;
  const damageTaken = Math.max(0, mitigatedDamage - blocked);
  if (totalBlocked > 0 || blockedByGuard) {
    playSound("shieldBlock");
    startUnitSpriteAnimation(hero, "block", 0.28);
    spawnShieldImpactEffect(hero);
    addFloat(hero.x, hero.y - 72, "BLOCK", "#bae6fd", { variant: "block" });
    log(`${hero.name} blocked ${Math.round(totalBlocked || damage - damageAfterShield)} damage from ${enemy.name}.`, "hero");
  }
  const safeDamageTaken = getFiniteNumber(damageTaken);
  hero.hp = Math.max(0, getFiniteNumber(hero.hp, hero.maxHp) - safeDamageTaken);
  battle.damageTaken = getFiniteNumber(battle.damageTaken) + safeDamageTaken;
  if (safeDamageTaken >= hero.maxHp * 0.18 || safeDamageTaken >= 45) triggerScreenShake(enemy.boss ? "heavy" : "light");
  const knightRetaliation = getTalentEffectNumber("knight_retaliation", "value");
  if (totalBlocked > 0 && knightRetaliation) {
    const retaliate = totalBlocked * knightRetaliation;
    damageEnemy(enemy, retaliate, "#f8e7bb");
    addFloat(enemy.x, enemy.y - 58, "Retaliate", "#f8e7bb");
  }
  const blockRetaliate = getPermanentEffectTotal("retaliateBlock", hero.id) + (hero.runRetaliateBlock || 0);
  if (totalBlocked > 0 && blockRetaliate) {
    const retaliate = totalBlocked * blockRetaliate;
    damageEnemy(enemy, retaliate, "#f8e7bb");
    addFloat(enemy.x, enemy.y - 58, "Spiked Guard", "#f8e7bb");
    triggerSkillVfx(hero.x, hero.y, "Spiked Guard", "knight");
  }
  const hitRetaliateChance = getPermanentEffectTotal("hitRetaliateChance", hero.id) + (hero.runHitRetaliateChance || 0);
  if (hitRetaliateChance && Math.random() < hitRetaliateChance) {
    const retaliate = hero.damage * (getPermanentEffectTotal("hitRetaliateDamage", hero.id) || 0.22);
    damageEnemy(enemy, retaliate, "#f8e7bb");
    addFloat(enemy.x, enemy.y - 58, "Counter", "#f8e7bb");
    triggerSkillVfx(hero.x, hero.y, "Counter", "knight");
  }
  if (safeDamageTaken > 0) markUnitHit(hero);
  if (enemy.boss) triggerScreenShake("heavy");
  if (armorPrevented >= 1) addFloat(hero.x, hero.y - 38, Math.round(armorPrevented), "#7dd3fc", { variant: "armor", stackKey: "playerDamage" });
  if (safeDamageTaken > 0) addFloat(hero.x, hero.y - 38, Math.round(safeDamageTaken), "#ff8b8b", { variant: safeDamageTaken >= hero.maxHp * 0.18 ? "heavy" : "", stackKey: "playerDamage" });
  if (safeDamageTaken >= hero.maxHp * 0.18 || safeDamageTaken >= 45) log(`${enemy.name} lands a heavy hit for ${Math.round(safeDamageTaken)} damage.`, "danger");
}

function prepareBattleResult(victory) {
  stopBattleLoop();
  if (!battle || battle.state === "done") return;

  battle.state = "result";
  battle.recentAbilities = {};
  battle.result = {
    victory,
    title: isGauntletRun() ? (victory ? "Gauntlet Victory" : "Gauntlet Defeat") : victory ? "Victory" : (isFinalBossStage(run.stage) || battle.nodeType === "FinalBoss") ? "The Crown Endures" : "Defeat",
    gold: 0,
    essence: 0,
    nextLabel: isGauntletRun() ? "Return to Gauntlet" : victory ? getVictoryContinueLabel() : (isFinalBossStage(run.stage) || battle.nodeType === "FinalBoss") ? "Complete Run" : "Continue"
  };

  if (!victory) {
    run.hero.hp = Math.max(0, run.hero.hp);
    startUnitSpriteAnimation(run.hero, "downed", 999);
    if (isGauntletRun()) recordGauntletBattleResult(false);
    else recordBattleAccountStats(false, 0, 0);
    updateRunHud();
    renderBattle();
    return;
  }

  if (isGauntletRun()) {
    recordGauntletBattleResult(true);
    saveGame();
    updateRunHud();
    renderBattle();
    return;
  }

  run.stagesCleared = Math.max(run.stagesCleared, isFinalBossStage(run.stage) ? STAGE_COUNT : run.stage);
  save.highestClear = Math.max(save.highestClear, run.stagesCleared);

  const baseEssence = getBaseEssenceForCurrentBattle();
  const eliteBonus = battle.nodeType === "Elite" ? getPermanentEffectTotal("eliteRewardMultiplier", run.classId) : 0;
  const encounterEssenceBonus = battle.nodeType === "Elite" || isBossStage(run.stage) || isFinalBossStage(run.stage) ? 0.2 : 0;
  if (eliteBonus) triggerSkillVfx(run.hero.x, run.hero.y, "Elite Bounty", run.classId);
  const layerRewardMultiplier = getLayerRewardMultiplier();
  const rawEssence = Math.round(baseEssence * layerRewardMultiplier * DIFFICULTIES[run.difficultyId].essenceMultiplier * (1 + encounterEssenceBonus + getPermanentEffectTotal("essenceMultiplier", run.classId) + getAchievementBonusTotal("essenceMultiplier", run.classId) + eliteBonus + (run.hero.runEssenceMultiplier || 0)));
  const earned = isEndlessRun() ? Math.min(ENDLESS_ESSENCE_CAP, rawEssence) : rawEssence;
  const goldBefore = run.gold;
  run.essenceEarned += earned;
  const baseGoldReward = battle.nodeType === "Elite" ? 30 : 15 + run.stage * 1.4;
  run.gold += Math.round(baseGoldReward * layerRewardMultiplier * (1 + eliteBonus));
  applyStageGrowthRelics();
  applyAfterBattleRelics();
  battle.result.gold = run.gold - goldBefore;
  battle.result.essence = earned;
  if (run.summary) {
    run.summary.goldEarned += battle.result.gold;
    run.summary.essenceEarned += earned;
  }
  if (shouldDropBossEquipment()) {
    const defeatedBoss = battle.enemies.find(enemy => enemy.boss || enemy.finalBoss);
    const eliteDrop = battle.nodeType === "Elite";
    const dropResult = collectEquipmentDrop(generateEquipmentDrop({
      classId: run.classId,
      stage: run.stage,
      sourceName: defeatedBoss?.name || (eliteDrop ? "Elite" : "Boss"),
      rarityBonus: eliteDrop ? 0 : isFinalBossStage(run.stage) || battle.nodeType === "FinalBoss" ? 0.45 : isEndlessRun() ? Math.min(0.65, run.stage * 0.015) : 0,
      maxRarity: eliteDrop ? "Rare" : null
    }));
    const drop = dropResult.item;
    battle.result.equipmentDrop = drop;
    battle.result.equipmentAutosold = dropResult.sold;
    battle.result.equipmentAutosellValue = dropResult.value;
    if (dropResult.sold) {
      log(`Equipment autosold: ${drop.rarity} ${drop.name} for ${dropResult.value} Essence.`, "reward");
    } else {
      log(`Equipment found: ${drop.rarity} ${drop.name} (${formatEquipmentItemSummary(drop)}).`, "reward");
    }
  }
  log(`Battle stats: ${Math.round(battle.damageDone)} damage dealt, ${Math.round(battle.damageTaken)} damage taken.`);
  const skillSummary = Object.entries(battle.skillsUsed).map(([name, count]) => `${name} x${count}`).join(", ");
  if (skillSummary) log(`Skills used: ${skillSummary}.`);
  recordBattleAccountStats(true, battle.result.gold, earned);
  saveGame();
  updateRunHud();
  renderBattle();
}

function shouldDropBossEquipment() {
  if (!battle || !run || isBuildTestRun()) return false;
  return battle.nodeType === "Elite" || battle.nodeType === "Boss" || battle.nodeType === "FinalBoss" || isBossStage(run.stage) || isFinalBossStage(run.stage);
}

function applyStageGrowthRelics() {
  if (!run || !run.hero || !run.stageGrowthRelics) return;
  run.stageGrowthRelics.forEach(growth => {
    growth.stages = (growth.stages || 0) + 1;
    const amount = getStageGrowthValue(growth.stat, growth.value);
    if (growth.stat === "maxHp") {
      run.hero.maxHp += amount;
      run.hero.hp += amount;
    }
    if (growth.stat === "damage") run.hero.damage += amount;
    if (growth.stat === "attackSpeed") run.hero.attackSpeed += amount;
    if (growth.stat === "armor") run.hero.armor += amount;
    if (growth.stat === "damageMultiplier") run.hero.damage *= 1 + growth.value;
    if (growth.stat === "attackSpeedMultiplier") run.hero.attackSpeed *= 1 + growth.value;
    if (growth.stat === "armorMultiplier") multiplyArmor(run.hero, 1 + growth.value);
    if (growth.stat === "maxHpMultiplier") multiplyMaxHp(run.hero, 1 + growth.value);
    if (growth.stat === "mainStatsMultiplier") {
      run.hero.damage *= 1 + growth.value;
      run.hero.attackSpeed *= 1 + growth.value;
      multiplyArmor(run.hero, 1 + growth.value);
      multiplyMaxHp(run.hero, 1 + growth.value);
    }
  });
}

function recordBattleAccountStats(victory, gold, essence) {
  if (!battle || battle.statsRecorded) return;
  battle.statsRecorded = true;
  if (run.summary) {
    run.summary.enemiesDefeated += battle.enemiesKilled || 0;
    run.summary.damageDealt += battle.damageDone || 0;
    run.summary.damageTaken += battle.damageTaken || 0;
  }
  if (isBuildTestRun() || isGauntletRun()) return;
  addAccountStat(victory ? "battlesWon" : "battlesLost", 1);
  addAccountStat("totalDamageDealt", battle.damageDone || 0);
  addAccountStat("totalDamageTaken", battle.damageTaken || 0);
  addAccountStat("enemiesDefeated", battle.enemiesKilled || 0);
  addAccountStat("totalGoldEarned", gold || 0);
  const skillCount = Object.values(battle.skillsUsed || {}).reduce((total, count) => total + count, 0);
  addAccountStat("skillsTriggered", skillCount);
  save.stats.highestBattleDamage = Math.max(Number(save.stats.highestBattleDamage) || 0, battle.damageDone || 0);
  recordGameEvent("heroMaxHp", { classId: run.classId, maxHp: run.hero?.maxHp || 0 });
  if (victory) {
    addAccountStat("stagesCleared", 1);
    battle.enemies.forEach(enemy => recordGameEvent("enemyKilled", { enemyId: enemy.id, classId: run.classId, count: 1 }));
    if (run.difficultyId === "hard") addAccountStat("hardStagesCleared", 1);
    if (battle.nodeType === "Elite") addAccountStat("elitesDefeated", 1);
    if (isBossStage(run.stage) || isFinalBossStage(run.stage)) addAccountStat("bossesDefeated", 1);
    if (isFinalBossStage(run.stage) || battle.nodeType === "FinalBoss") addAccountStat("finalBossKills", 1);
  }
}

function getLayerRewardMultiplier() {
  if (isEndlessRun()) return 1;
  const layer = Math.max(1, Math.min(3, Math.ceil(run.stage / MAP_LAYER_SIZE)));
  return [1, 1.12, 1.28][layer - 1] || 1;
}

function getVictoryContinueLabel() {
  if (isFinalBossStage(run.stage) || battle.nodeType === "FinalBoss") return "Complete Run";
  if (battle.nodeType === "Elite" || isBossStage(run.stage)) return "Claim Relic";
  return "Continue";
}

function getHeroBleedDamage(hero) {
  if (!hero || hero.id !== "rogue") return 0;
  const percent = getHeroBleedMaxHpPercent(hero);
  return Math.max(1, hero.maxHp * percent);
}

function getHeroBleedMaxHpPercent(hero) {
  if (!hero || hero.id !== "rogue") return 0;
  return ROGUE_BASE_BLEED_MAX_HP_PERCENT + getPermanentEffectTotal("bleedMaxHpPercent", hero.id) + (hero.runBleedMaxHpPercent || 0);
}

function continueBattleResult() {
  if (!battle || battle.state !== "result") return;
  const victory = battle.result.victory;
  battle.state = "done";

  if (isGauntletRun()) return finishGauntletBattle(victory);

  if (!victory) {
    if (isBuildTestRun()) return endBuildTest(false);
    if (isFinalBossStage(run.stage) || battle.nodeType === "FinalBoss") return endEternalCrownEnding();
    return endRun(false);
  }
  if (isEndlessRun()) {
    if (isBossStage(run.stage)) {
      run.afterRelicAction = "reward";
      return showRelicRewards("Endless boss defeated. Claim one relic before the next duel.");
    }
    if (battle.nodeType === "Elite") {
      run.afterRelicAction = "reward";
      return showRelicRewards("Endless miniboss defeated. Claim one relic before the next duel.");
    }
    return showRewards();
  }
  if (isBuildTestRun()) return endBuildTest(true);
  if (isFinalBossStage(run.stage) || battle.nodeType === "FinalBoss") return endEternalCrownEnding(true);
  if (isBossStage(run.stage)) {
    run.afterRelicAction = "reward";
    if (run.stage === STAGE_COUNT) run.afterRewardAction = "finalBoss";
    return showRelicRewards(run.stage === STAGE_COUNT
      ? "Layer 3 cleared. Claim one relic and choose a final reward before the Eternal Crown descends."
      : "Boss defeated. Claim one relic before pushing into the next map layer.");
  }
  if (battle.nodeType === "Elite") {
    run.afterRelicAction = "reward";
    return showRelicRewards("Elite defeated. Claim one relic from the fallen champion.");
  }
  showRewards();
}

function endRun(victory) {
  stopBattleLoop();
  const essence = Math.max(1, Math.round(run.essenceEarned));
  recordRunEndStats(victory, essence);
  checkAchievements();
  const endlessResult = isEndlessRun() ? submit_endless_score(run) : null;
  saveGame();
  showScreen("runEndScreen");
  runEndTitle.textContent = victory ? "Crownfall Broken" : isEndlessRun() ? "Endless Run Ended" : "Run Failed";
  const routeName = getRunRouteName();
  runEndText.innerHTML = renderRunSummary(victory, routeName, essence, getRunEndMessage(victory, endlessResult), getRunEndExtraRows(endlessResult));
  battle = null;
}

function getBaseEssenceForCurrentBattle() {
  if (!isEndlessRun()) return BASE_STAGE_ESSENCE;
  return ENDLESS_BASE_ESSENCE + Math.max(0, run.stage - 1) * ENDLESS_ESSENCE_PER_STAGE;
}

function endBuildTest(victory) {
  stopBattleLoop();
  showScreen("runEndScreen");
  runEndTitle.textContent = victory ? "Build Test Complete" : "Build Test Ended";
  const summary = run.summary || {};
  runEndText.innerHTML = `
    <span class="run-end-message">${victory ? "The test build somehow broke the Eternal Crown." : "The Eternal Crown erased the test build. That is useful data."}</span>
    <span class="run-summary-grid">
      <span><small>Class</small><strong>${CLASSES[run.classId].name}</strong></span>
      <span><small>Difficulty</small><strong>Build Test</strong></span>
      <span><small>Damage dealt</small><strong>${Math.round(summary.damageDealt || 0).toLocaleString()}</strong></span>
      <span><small>Damage taken</small><strong>${Math.round(summary.damageTaken || 0).toLocaleString()}</strong></span>
    </span>
  `;
  saveGame();
  battle = null;
}

function recordRunEndStats(victory, essence) {
  if (run.runEndStatsRecorded) return;
  run.runEndStatsRecorded = true;
  if (isBuildTestRun()) return;
  save.essence += essence;
  save.highestClear = Math.max(save.highestClear, run.stagesCleared);
  addAccountStat("runsEnded", 1);
  addAccountStat(victory ? "victories" : "defeats", 1);
  if (victory && !isEndlessRun() && run.stagesCleared >= STAGE_COUNT) addAccountStat(`${run.classId}Layer3Clears`, 1);
  addAccountStat("totalEssenceEarned", essence);
  if (victory) save.firstBossDefeated = true;
  if (victory && !isEndlessRun() && !isBuildTestRun() && !isGauntletRun() && run.stagesCleared >= STAGE_COUNT) {
    if (!save.difficultyClears) save.difficultyClears = {};
    save.difficultyClears[run.difficultyId] = true;
  }
}

function recordLayer3VictoryBeforeEternalCrown() {
  if (!run || run.layer3VictoryRecorded) return;
  run.layer3VictoryRecorded = true;
  const essence = Math.max(1, Math.round(run.essenceEarned));
  recordRunEndStats(true, essence);
  checkAchievements();
  saveGame();
}

function endEternalCrownEnding(crownDefeated = false) {
  stopBattleLoop();
  const essence = Math.max(1, Math.round(run.essenceEarned));
  if (!run.layer3VictoryRecorded && !run.runEndStatsRecorded) recordRunEndStats(crownDefeated, essence);
  checkAchievements();
  saveGame();
  showScreen("runEndScreen");
  runEndTitle.textContent = crownDefeated ? "The Impossible Crown Falls" : "The Eternal Crown Endures";
  const routeName = getRunRouteName();
  const endlessChoice = crownDefeated ? `<span class="actions run-end-actions"><button onclick="continueStoryRunIntoEndless()">Enter Endless Stage 5</button><button onclick="finishCrownVictory()">End Run</button></span>` : "";
  runEndText.innerHTML = renderRunSummary(true, routeName, essence, crownDefeated
    ? "Against all odds, the Eternal Crown has fallen. Your Layer 3 victory was already sealed."
    : "Layer 3 was conquered and your victory stands. The Eternal Crown wipes out the champion as the crown's last cruel joke.") + endlessChoice;
  battle = null;
}

function finishCrownVictory() {
  run = null;
  battle = null;
  showScreen("menuScreen");
}

function continueStoryRunIntoEndless() {
  if (!run || !run.hero) return;
  run.mode = "endless";
  run.difficultyId = "endless";
  run.stage = 4;
  run.stagesCleared = 4;
  run.currentNodeId = null;
  run.chosenNodeIds = [];
  run.availableNodeIds = [];
  run.map = [];
  run.summary = {
    enemiesDefeated: 0,
    goldEarned: 0,
    essenceEarned: 0,
    relicsCollected: 0,
    talentsChosen: 0,
    damageDealt: 0,
    damageTaken: 0
  };
  run.afterRewardAction = null;
  applyRunTheme();
  beginNextEndlessStage();
}

function getRunEndMessage(victory, endlessResult) {
  if (endlessResult && endlessResult.entry) {
    return [
      endlessResult.newBest ? "New Best!" : "",
      `Stage Reached: ${endlessResult.entry.stageReached}`,
      endlessResult.rank ? `Leaderboard Rank: #${endlessResult.rank}` : ""
    ].filter(Boolean).join("<br>");
  }
  return victory ? "Layer 3 has fallen. Crownfall is broken, even if the crown still hungers." : "Your champion falls, but the Essence returns to the crown vault.";
}

function getRunEndExtraRows(endlessResult) {
  if (!endlessResult || !endlessResult.entry) return [];
  const rows = [["Stage Reached", endlessResult.entry.stageReached]];
  if (endlessResult.rank) rows.push(["Leaderboard Rank", `#${endlessResult.rank}`]);
  return rows;
}

function renderRunSummary(victory, routeName, essence, message, extraRows = []) {
  const summary = run.summary || {};
  const performance = getRunPerformanceHighlights(summary, victory, essence);
  const rows = [
    ...extraRows,
    ["Class", CLASSES[run.classId].name],
    ["Difficulty", DIFFICULTIES[run.difficultyId].name],
    ["Route", routeName],
    ["Stages cleared", run.stagesCleared],
    ["Enemies defeated", summary.enemiesDefeated || 0],
    ["Gold earned", Math.round(summary.goldEarned || 0)],
    ["Essence earned", essence],
    ["Relics collected", summary.relicsCollected || run.relics.length],
    ["Talents chosen", summary.talentsChosen || run.talents.length],
    ["Damage dealt", Math.round(summary.damageDealt || 0).toLocaleString()],
    ["Damage taken", Math.round(summary.damageTaken || 0).toLocaleString()]
  ];
  return `
    <span class="run-end-message">${message || (victory ? "Layer 3 has fallen. Crownfall is broken, even if the crown still hungers." : "Your champion falls, but the Essence returns to the crown vault.")}</span>
    <span class="run-summary-spotlight">
      ${performance.map(item => `<span class="run-summary-highlight ${item.className}"><small>${item.label}</small><strong>${item.value}</strong><em>${item.note}</em></span>`).join("")}
    </span>
    <span class="run-summary-grid">
      ${rows.map(([label, value]) => `<span><small>${label}</small><strong>${value}</strong></span>`).join("")}
    </span>
  `;
}

function getRunPerformanceHighlights(summary, victory, essence) {
  const dealt = Math.round(summary.damageDealt || 0);
  const taken = Math.round(summary.damageTaken || 0);
  const enemies = Math.round(summary.enemiesDefeated || 0);
  const efficiency = taken > 0 ? dealt / taken : dealt > 0 ? dealt : 0;
  const grade = victory ? efficiency >= 28 ? "S" : efficiency >= 16 ? "A" : efficiency >= 8 ? "B" : "C" : enemies >= 8 ? "B" : "C";
  return [
    { label: "Run Grade", value: grade, note: victory ? "Victory sealed" : "Progress banked", className: `run-grade-${grade.toLowerCase()}` },
    { label: "Damage Flow", value: dealt.toLocaleString(), note: taken ? `${Math.max(0, Math.round(efficiency * 10) / 10)} dealt per taken` : "Untouched pressure", className: "run-grade-damage" },
    { label: "Essence Banked", value: `+${Math.floor(essence)}`, note: `${enemies} enemies defeated`, className: "run-grade-essence" }
  ];
}

const FLOAT_TEXT_LIFETIME = 0.75;
const FLOAT_TEXT_STACK_LIMIT = 5;

function addFloat(x, y, text, color, options = {}) {
  if (save.settings.damageNumbers === false) return;
  if (save.settings.reduceAnimations) return;
  if (battle) {
    if (isBuildTestRun()) {
      if (!canAddBuildTestFloat(text)) return;
      if (battle.floatingTexts.length >= BUILD_TEST_MAX_FLOATING_TEXTS) return;
    }
    const variant = options.variant || "";
    const stackKey = options.stackKey || "";
    const textValue = String(text);
    const numeric = /^[-+]?\d+(\.\d+)?$/.test(textValue);
    const nearby = !stackKey && battle.floatingTexts.find(float =>
      float.color === color &&
      float.variant === variant &&
      Math.abs(float.x - x) <= 32 &&
      Math.abs(float.y - y) <= 32 &&
      (numeric ? float.numeric : float.text === textValue)
    );
    if (nearby) {
      nearby.count = (nearby.count || 1) + 1;
      nearby.x = (nearby.x + x) / 2;
      nearby.y = Math.min(nearby.y, y) - 3;
      if (numeric) {
        nearby.numeric = true;
        nearby.value = (Number(nearby.value) || Number(nearby.text) || 0) + Number(textValue);
        nearby.text = String(Math.round(nearby.value));
      }
      return;
    }
    if (stackKey) {
      battle.floatingTexts = battle.floatingTexts
        .map(float => float.stackKey === stackKey ? { ...float, stackIndex: (float.stackIndex || 0) + 1 } : float)
        .filter(float => float.stackKey !== stackKey || (float.stackIndex || 0) < FLOAT_TEXT_STACK_LIMIT);
    }
    battle.floatingTexts.push({ x, y, text: textValue, color, variant, stackKey, stackIndex: 0, count: 1, numeric, age: 0, life: FLOAT_TEXT_LIFETIME });
  }
}

function canAddBuildTestFloat(text) {
  if (!battle) return false;
  const currentSecond = Math.floor(battle.elapsed || 0);
  if (battle.buildTestFloatSecond !== currentSecond) {
    battle.buildTestFloatSecond = currentSecond;
    battle.buildTestFloatCount = 0;
  }
  const isDamageNumber = /^-?\+?\d/.test(String(text));
  if (!isDamageNumber) return true;
  if ((battle.buildTestFloatCount || 0) >= BUILD_TEST_FLOAT_TEXTS_PER_SECOND) return false;
  battle.buildTestFloatCount = (battle.buildTestFloatCount || 0) + 1;
  return true;
}

function triggerSkillVfx(x, y, label, theme, options = {}) {
  if (!battle) return;
  battle.skillsUsed[label] = (battle.skillsUsed[label] || 0) + 1;
  battle.activeSkills[label] = 3;
  if (save.settings.reduceAnimations) return;
  if (isBuildTestRun() && battle.particles.filter(particle => particle.type === "skill").length >= 10) return;
  const colors = {
    knight: "#f8e7bb",
    rogue: "#bbf7d0",
    wizard: "#c4b5fd",
    global: "#ffe2a2"
  };
  battle.particles.push({
    type: "skill",
    x,
    y,
    label,
    theme,
    sprite: options.sprite || (options.abilityId && typeof getSkillSpriteSheet === "function" ? getSkillSpriteSheet(options.abilityId, options.hero || run?.hero) : ""),
    color: colors[theme] || colors.global,
    age: 0,
    life: options.life || 0.85,
    floatY: options.floatY ?? 28,
    startScale: options.startScale ?? 0.65,
    endScale: options.endScale ?? 1.35,
    startOpacity: options.startOpacity ?? 1,
    endOpacity: options.endOpacity ?? 0
  });
}

function getInitialAbilityCooldowns() {
  return ((run && run.hero && run.hero.runAbilities) || []).reduce((cooldowns, id) => {
    if (RUN_ABILITIES[id]) cooldowns[id] = getAbilityOpeningCooldown(RUN_ABILITIES[id]);
    return cooldowns;
  }, {});
}

function getAbilityOpeningCooldown(ability) {
  return Math.min(1.25, ability.cooldown * 0.5);
}

function updateRunAbilities(hero, target, dt) {
  if (!battle || !target || target.hp <= 0) return;
  (hero.runAbilities || []).forEach(id => {
    const ability = RUN_ABILITIES[id];
    if (!ability) return;
    if (!battle.abilityCooldowns) battle.abilityCooldowns = {};
    battle.abilityCooldowns[id] = Math.max(0, (battle.abilityCooldowns[id] || 0) - dt);
    if (battle.abilityCooldowns[id] > 0) return;
    useRunAbility(ability, hero, target);
    const holyReduction = ability.id.startsWith("knight_holy") ? (hero.runHolyCooldownReduction || 0) : 0;
    battle.abilityCooldowns[id] = ability.cooldown * Math.max(0.5, 1 - holyReduction);
  });
}

function useRunAbility(ability, hero, target) {
  delete battle.activeSkills[ability.name];
  battle.recentAbilities[ability.id] = 0.55;

  if (ability.id === "wizard_curse") {
    playSound("magicCast");
    applyEnemyStatus(target, "curse", { duration: ability.duration + (hero.runCurseDuration || 0), value: 0.22 + (hero.runCurseDamageTaken || 0) });
    triggerSkillVfx(target.x, target.y - 4, ability.name, ability.classId, { abilityId: ability.id, hero });
    spawnAbilityIndicator(target, "curse");
    startUnitSpriteAnimation(hero, "attack", 0.26);
    addFloat(target.x, target.y - 70, "CURSE", ability.color);
    return;
  }

  if (ability.id === "wizard_iceball") {
    playSound("magicCast");
    startUnitSpriteAnimation(hero, "attack", 0.26);
    spawnAbilityProjectile(hero, target, "iceball", { abilityId: ability.id, hero, color: ability.color });
    damageEnemy(target, hero.damage * (0.75 + (hero.runIceballDamage || 0)), "#93c5fd");
    applyEnemyStatus(target, "slow", { duration: ability.duration + (hero.runIceballDuration || 0), value: 0.38 + (hero.runIceballSlow || 0) });
    addFloat(target.x, target.y - 62, "Iceball", ability.color);
    return;
  }

  if (ability.id === "wizard_lightning") {
    playSound("magicCast");
    startUnitSpriteAnimation(hero, "attack", 0.28);
    battle.enemies.filter(enemy => enemy.hp > 0).slice(0, 3 + (hero.runLightningTargets || 0)).forEach((enemy, index) => {
      damageEnemy(enemy, hero.damage * (0.9 + (hero.runLightningDamage || 0) - index * 0.15), "#fde68a", { heavy: index === 0 });
      triggerSkillVfx(enemy.x, enemy.y - 4, ability.name, ability.classId, { abilityId: ability.id, hero });
      spawnAbilityIndicator(enemy, "lightning");
      addFloat(enemy.x, enemy.y - 62, "Lightning", ability.color);
    });
    triggerScreenShake("light");
    return;
  }

  if (ability.id === "rogue_poison") {
    playSound("swordHit");
    startUnitSpriteAnimation(hero, "attack", 0.24);
    spawnSlashEffect(target, "rogue");
    applyEnemyStatus(target, "poison", { damage: getRoguePoisonAbilityDamage(hero), duration: ability.duration });
    triggerSkillVfx(target.x, target.y - 4, ability.name, ability.classId, { abilityId: ability.id, hero });
    spawnAbilityIndicator(target, "poison");
    return;
  }

  if (ability.id === "rogue_bleed") {
    startUnitSpriteAnimation(hero, "attack", 0.24);
    battle.enemies.filter(enemy => enemy.hp > 0).forEach(enemy => {
      applyEnemyStatus(enemy, "slow", { duration: ability.duration + (hero.runTrapDuration || 0), value: ROGUE_TRAP_SLOW_VALUE + (hero.runTrapSlow || 0) });
      triggerSkillVfx(enemy.x, enemy.y - 4, ability.name, ability.classId, { abilityId: ability.id, hero });
      spawnAbilityIndicator(enemy, "bleed");
    });
    addFloat(hero.x, hero.y - 72, "TRAP", ability.color);
    return;
  }

  if (ability.id === "rogue_burn") {
    startUnitSpriteAnimation(hero, "attack", 0.24);
    spawnSlashEffect(target, "rogue");
    applyEnemyStatus(target, "burn", { damage: getRogueBurnAbilityDamage(hero, target), duration: ability.duration + (hero.runBurnAbilityDuration || 0) });
    triggerSkillVfx(target.x, target.y - 4, ability.name, ability.classId, { abilityId: ability.id, hero });
    spawnAbilityIndicator(target, "burn");
    return;
  }

  if (ability.id === "knight_heavy_attack") {
    startUnitSpriteAnimation(hero, "attack", 0.45);
    spawnSlashEffect(target, "heavy");
    const percent = (ability.maxHpDamage || 0.25) + (hero.runHeavyAttackMaxHpDamage || 0);
    damageEnemy(target, hero.maxHp * percent, "#f8e7bb", { heavy: true });
    triggerSkillVfx(target.x, target.y - 4, ability.name, ability.classId, { abilityId: ability.id, hero });
    addFloat(target.x, target.y - 70, "HEAVY", "#f8e7bb", { variant: "heavy" });
    return;
  }

  if (ability.id === "knight_holy_sword") {
    playSound("magicCast");
    hero.holySwordHitsRemaining = Math.max(hero.holySwordHitsRemaining || 0, (ability.hitCount || 3) + (hero.runHolySwordHits || 0));
    hero.holySwordDamageBonus = ability.hitDamageBonus || 0.5;
    startUnitSpriteAnimation(hero, "attack", 0.3);
    spawnSlashEffect(target, "sword");
    triggerSkillVfx(hero.x, hero.y - 6, ability.name, ability.classId, { abilityId: ability.id, hero, life: ability.duration, floatY: 0, startScale: 1.05, endScale: 1.05, startOpacity: 0.88, endOpacity: 0.88 });
    spawnAbilityIndicator(hero, "holy-sword");
    addFloat(hero.x, hero.y - 72, "Holy Sword", ability.color);
    return;
  }

  if (ability.id === "knight_holy_shield") {
    hero.holyShieldHitsRemaining = Math.max(hero.holyShieldHitsRemaining || 0, (ability.hitCount || 2) + (hero.runHolyShieldHits || 0));
    hero.holyShieldArmorBonus = ability.armorMultiplier || 0.5;
    startUnitSpriteAnimation(hero, "block", 0.3);
    triggerSkillVfx(hero.x, hero.y - 6, ability.name, ability.classId, { abilityId: ability.id, hero, life: 0.42, floatY: 0, startScale: 1.9, endScale: 0.15, startOpacity: 0.58, endOpacity: 0 });
    spawnAbilityIndicator(hero, "holy-shield");
    addFloat(hero.x, hero.y - 72, "Holy Shield", ability.color);
  }
}

function applyBattleStartTalents() {
  const shieldWall = getTalentEffectNumber("knight_shield_wall", "value");
  if (shieldWall) {
    addHeroShield(shieldWall, "Shield Wall");
  }
}

function applyBattleStartPermanentEffects() {
  const hero = run.hero;
  const shield = getPermanentEffectTotal("battleStartShield", hero.id) + (hero.runStartShield || 0);
  if (shield) {
    addHeroShield(shield, hero.id === "wizard" ? "Arcane Shield" : "Starting Shield");
    triggerSkillVfx(hero.x, hero.y, hero.id === "wizard" ? "Arcane Shield" : "Bulwark", hero.id);
  }

  const firstEnemyDelay = getPermanentEffectTotal("firstEnemyDelay", hero.id);
  if (firstEnemyDelay && !battle.chronoSealUsed) {
    battle.chronoSealUsed = true;
    battle.enemies.forEach(enemy => enemy.attackCooldown += firstEnemyDelay);
    addFloat(hero.x, hero.y - 65, "Chrono Seal", "#bae6fd");
    triggerSkillVfx(hero.x, hero.y, "Chrono Seal", "wizard");
  }
}

function applyStatusEffects(dt) {
  if (!battle || battle.state !== "fighting") return;
  if (run.hero.regen && run.hero.hp > 0) {
    run.hero.hp = Math.min(run.hero.maxHp, run.hero.hp + run.hero.regen * dt);
  }
  battle.enemies.forEach(enemy => {
    if (enemy.hp <= 0 || !enemy.statusEffects) return;
    ["poison", "burn"].forEach(type => {
      const status = enemy.statusEffects[type];
      if (!status) return;
      status.duration -= dt;
      damageEnemy(enemy, status.damage * dt, type === "poison" ? "#86efac" : type === "burn" ? "#fb923c" : "#fca5a5", { status: true });
      if (status.duration <= 0) delete enemy.statusEffects[type];
    });
    const bleed = enemy.statusEffects.bleed;
    if (bleed) {
      bleed.duration -= dt;
      bleed.tickTimer = (bleed.tickTimer ?? 1) - dt;
      while (enemy.hp > 0 && bleed.tickTimer <= 0) {
        const bleedDamage = damageEnemy(enemy, bleed.damage, "#fca5a5", { status: true });
        addFloat(enemy.x, enemy.y - 46, Math.round(bleedDamage), "#fca5a5", { variant: "heavy" });
        log(`${enemy.name} bleeds for ${Math.round(bleedDamage)} damage.`, "skill");
        bleed.tickTimer += 1;
      }
      if (bleed.duration <= 0) delete enemy.statusEffects.bleed;
    }
    const slow = enemy.statusEffects.slow;
    if (slow) {
      slow.duration -= dt;
      if (slow.duration <= 0) delete enemy.statusEffects.slow;
    }
    const curse = enemy.statusEffects.curse;
    if (curse) {
      curse.duration -= dt;
      if (curse.duration <= 0) delete enemy.statusEffects.curse;
    }
  });
}

function applyEnemyStatus(enemy, type, effect) {
  if (!enemy.statusEffects) enemy.statusEffects = {};
  const duration = effect.duration;
  const damageMultiplier = type === "burn" ? 1 + getPermanentEffectTotal("burnDamage", run.classId) : 1;
  const status = {
    duration,
    damage: (effect.damage || 0) * damageMultiplier,
    value: type === "slow" ? Math.min(STATUS_SLOW_VALUE_CAP, effect.value || 0) : effect.value || 0,
    tickTimer: type === "bleed" ? 1 : undefined,
    stacks: type === "burn" ? 1 : undefined
  };
  if (type === "bleed" && enemy.statusEffects.bleed) {
    enemy.statusEffects.bleed.damage = status.damage;
    enemy.statusEffects.bleed.duration = Infinity;
    enemy.statusEffects.bleed.tickTimer = enemy.statusEffects.bleed.tickTimer ?? 1;
    return false;
  }
  if (type === "poison" && enemy.statusEffects.poison) {
    enemy.statusEffects.poison.damage = Math.max(enemy.statusEffects.poison.damage || 0, status.damage);
    enemy.statusEffects.poison.duration = Math.max(enemy.statusEffects.poison.duration || 0, status.duration);
    addFloat(enemy.x, enemy.y - 58, getStatusFloatText(type, enemy.statusEffects.poison), getStatusColor(type));
  } else if (type === "burn" && enemy.statusEffects.burn) {
    enemy.statusEffects.burn.damage = (enemy.statusEffects.burn.damage || 0) + status.damage;
    enemy.statusEffects.burn.stacks = (enemy.statusEffects.burn.stacks || 1) + 1;
    enemy.statusEffects.burn.duration = Math.max(enemy.statusEffects.burn.duration || 0, status.duration);
    addFloat(enemy.x, enemy.y - 58, getStatusFloatText(type, enemy.statusEffects.burn), getStatusColor(type));
  } else if (type === "slow" && enemy.statusEffects.slow) {
    enemy.statusEffects.slow.value = Math.min(STATUS_SLOW_VALUE_CAP, Math.max(enemy.statusEffects.slow.value || 0, status.value));
    enemy.statusEffects.slow.duration = Math.max(enemy.statusEffects.slow.duration || 0, status.duration);
    addFloat(enemy.x, enemy.y - 58, getStatusFloatText(type, enemy.statusEffects.slow), getStatusColor(type));
    return false;
  } else {
    enemy.statusEffects[type] = status;
    addFloat(enemy.x, enemy.y - 58, getStatusFloatText(type, status), getStatusColor(type));
    if (["poison", "burn", "bleed", "slow", "curse"].includes(type)) {
      log(`${enemy.name} suffers ${getStatusFloatText(type, status).toLowerCase()}.`, "skill");
    }
  }

  const wildfireChance = getTalentEffectNumber("wizard_wildfire_spark", "chance") + getPermanentEffectTotal("burnSpreadChance", run.classId);
  if (type === "burn" && wildfireChance && Math.random() < wildfireChance) {
    const spreadTarget = battle.enemies.find(other => other !== enemy && other.hp > 0 && !other.statusEffects.burn);
    if (spreadTarget) {
      spreadTarget.statusEffects.burn = { duration: status.duration, damage: status.damage, value: 0, stacks: 1 };
      addFloat(spreadTarget.x, spreadTarget.y - 58, "Wildfire", "#fb923c");
      log(`Wildfire spread to ${spreadTarget.name}.`, "skill");
    }
  }
  return true;
}

function getStatusColor(type) {
  if (type === "poison") return "#86efac";
  if (type === "burn") return "#fb923c";
  if (type === "bleed") return "#fca5a5";
  if (type === "curse") return "#c084fc";
  if (type === "slow") return "#bae6fd";
  return "#f8fafc";
}

function getStatusFloatText(type, status) {
  if (type === "poison") return `POISON ${Math.round(status.damage)}/s`;
  if (type === "burn") return `BURN ${Math.round(status.damage)}/s${status.stacks > 1 ? ` x${status.stacks}` : ""}`;
  if (type === "bleed") return `BLEED ${Math.round(status.damage)}/s`;
  if (type === "curse") return `CURSE +${Math.round(status.value * 100)}%`;
  if (type === "slow") return `SLOW ${Math.round(status.value * 100)}%`;
  return type.toUpperCase();
}

function getWizardSplashDamageMultiplier(hero) {
  return WIZARD_BASE_SPLASH_DAMAGE + getPermanentEffectTotal("splashDamageMultiplier", hero.id) + (hero.runSplashDamageMultiplier || 0);
}

function getWizardBurnChance(hero) {
  const wildfireTalent = getTalent("wizard_wildfire_spark");
  return Math.min(0.75, WIZARD_BASE_BURN_CHANCE + (hero.runBurnChance || 0) + (wildfireTalent?.effect.igniteChance || 0));
}

function getWizardBurnDamage(hero, enemy) {
  return getBurnStatusDamage(hero, enemy, 4 + run.stage * 0.45 + (hero.runAbilityFlatDamage || 0));
}

function getRogueBurnAbilityDamage(hero, enemy) {
  return getBurnStatusDamage(hero, enemy, 7 + run.stage * 0.55 + (hero.runAbilityFlatDamage || 0));
}

function getBurnStatusDamage(hero, enemy, baseDamage) {
  return baseDamage + (hero.runBurnDamage || 0) + (enemy?.maxHp || 0) * getHeroBurnMaxHpPercent(hero);
}

function getHeroBurnMaxHpPercent(hero) {
  if (!hero) return 0;
  return getPermanentEffectTotal("burnMaxHpPercent", hero.id) + (hero.runBurnMaxHpPercent || 0);
}

function getWizardAttackSlowValue(hero) {
  return Math.min(STATUS_SLOW_VALUE_CAP, WIZARD_BASE_SLOW_VALUE + getPermanentEffectTotal("slowValue", hero.id) + (hero.runSlowValue || 0));
}

function getHeroExecuteThreshold(hero) {
  return Math.max(hero.id === "rogue" ? ROGUE_BASE_EXECUTE_THRESHOLD : 0.3, getPermanentEffectTotal("executeThreshold", hero.id) || 0, hero.runExecuteThreshold || 0);
}

function getRogueAttackPoisonDamage(hero, effect = {}) {
  return (effect.damage || 0) + run.stage * ROGUE_VENOM_BLADE_STAGE_SCALING + (hero.runPoisonAttackDamage || 0) + (hero.runAbilityFlatDamage || 0);
}

function getRoguePoisonAbilityDamage(hero) {
  return 9 + run.stage * 0.75 + (hero.runPoisonAbilityDamage || 0) + (hero.runAbilityFlatDamage || 0);
}

function onHeroEvaded(enemy, hero) {
  const damageBonus = getPermanentEffectTotal("evasionDamageBonus", hero.id);
  if (damageBonus) {
    hero.battleDamageBonus = Math.min(0.4, (hero.battleDamageBonus || 0) + damageBonus);
    addFloat(hero.x, hero.y - 62, "Opportunist", "#bbf7d0");
    triggerSkillVfx(hero.x, hero.y, "Opportunist", "rogue");
  }

  const counter = getPermanentEffectTotal("evasionCounter", hero.id) + (hero.runEvasionCounter || 0);
  if (counter) {
    const amount = hero.damage * counter;
    damageEnemy(enemy, amount, "#bae6fd");
    addFloat(enemy.x, enemy.y - 58, "Ghostblade", "#bae6fd");
    triggerSkillVfx(hero.x, hero.y, "Ghostblade", "rogue");
  }
}

function damageEnemy(enemy, amount, color, options = {}) {
  if (!enemy || enemy.hp <= 0) return 0;
  const wasAlive = enemy.hp > 0;
  const damageAmount = options.status || options.ignoreArmor ? getFiniteNumber(amount) : getArmorMitigatedDamage(amount, enemy.armor);
  const actualDamage = Math.min(enemy.hp, Math.max(0, damageAmount));
  enemy.hp = Math.max(0, enemy.hp - actualDamage);
  if (battle) battle.damageDone = getFiniteNumber(battle.damageDone) + actualDamage;
  if (!options.status) applyLifeSteal(actualDamage);
  if (!options.status) markUnitHit(enemy);
  if (options.heavy && !options.status) triggerScreenShake(enemy.boss ? "heavy" : "light");
  if (wasAlive && enemy.hp <= 0) {
    playSound("enemyDeath");
    const deathDelay = enemy.boss ? 1.45 : enemy.miniBoss ? 0.95 : 0.62;
    enemy.hp = 0;
    enemy.deathTimer = deathDelay;
    enemy.deathDuration = deathDelay;
    startUnitSpriteAnimation(enemy, "downed", deathDelay);
    if (battle) battle.enemiesKilled = (battle.enemiesKilled || 0) + 1;
    spawnDeathParticles(enemy);
    addFloat(enemy.x, enemy.y - 48, enemy.boss ? "BOSS FALLS" : "DOWN", enemy.boss ? "#fcd34d" : "#e7d6b5", { variant: enemy.boss ? "crit" : "heavy" });
    log(`${enemy.name} defeated.`, enemy.boss || enemy.miniBoss ? "reward" : "enemy");
    if (enemy.boss) triggerScreenShake("heavy");
    onEnemyDeath(enemy);
  }
  return actualDamage;
}

function applyLifeSteal(damageDone) {
  if (!run || !run.hero || damageDone <= 0 || run.hero.hp <= 0) return;
  const lifeSteal = run.hero.lifeSteal || 0;
  if (!lifeSteal) return;
  const heal = Math.min(run.hero.maxHp - run.hero.hp, damageDone * lifeSteal);
  if (heal <= 0) return;
  run.hero.hp += heal;
  if (heal >= 1) addFloat(run.hero.x, run.hero.y - 62, `+${Math.round(heal)}`, "#86efac", { variant: "heal" });
}

function onEnemyDeath(enemy) {
  const killAttackSpeed = getPermanentEffectTotal("killAttackSpeed", run.hero.id) + (run.hero.runKillAttackSpeed || 0);
  if (killAttackSpeed) {
    const max = run.hero.runKillAttackSpeedMax || getPermanentEffectTotal("killAttackSpeedMax", run.hero.id) || 0.35;
    run.hero.battleAttackSpeedBonus = Math.min(max, (run.hero.battleAttackSpeedBonus || 0) + killAttackSpeed);
    addFloat(run.hero.x, run.hero.y - 60, "Finishing Dash", "#bbf7d0");
    triggerSkillVfx(run.hero.x, run.hero.y, "Finishing Dash", "rogue");
  }
  const momentumValue = getTalentEffectNumber("rogue_momentum", "value");
  if (momentumValue) {
    const current = run.hero.battleAttackSpeedBonus || 0;
    const next = Math.min(getTalentEffectNumber("rogue_momentum", "max", 0.3), current + momentumValue);
    run.hero.battleAttackSpeedBonus = next;
    addFloat(run.hero.x, run.hero.y - 60, "Momentum", "#bbf7d0");
  }
}

function addHeroShield(amount, source) {
  amount = getFiniteNumber(amount);
  if (amount <= 0) return;
  const currentShield = run.hero.shield || 0;
  const shieldCap = getHeroShieldCap();
  const nextShield = Math.min(shieldCap, currentShield + amount);
  const gained = Math.max(0, nextShield - currentShield);
  run.hero.shield = nextShield;

  if (gained > 0) {
    addFloat(run.hero.x, run.hero.y - 58, `+${Math.round(gained)} Shield`, "#bae6fd", { variant: "block" });
    if (source) log(`${source} grants ${Math.round(gained)} shield.`);
  } else if (source) {
    addFloat(run.hero.x, run.hero.y - 58, "Shield capped", "#bae6fd");
    log(`${source} shield is capped.`);
  }
}

function getHeroShieldCap() {
  const hero = run.hero;
  const maxHp = hero.maxHp || 1;
  return Math.max(1, Math.round(maxHp * getHeroShieldCapPercent(hero)));
}

function getArmorMitigatedDamage(amount, armor) {
  amount = getFiniteNumber(amount);
  const reduction = getArmorDamageReduction(armor);
  return Math.max(1, amount * (1 - reduction));
}

const ARMOR_BAND_SIZE = 5;
const ARMOR_BASE_REDUCTION_PER_POINT = 0.015;
const ARMOR_REDUCTION_DECAY_PER_BAND = 0.86;
const ARMOR_MIN_REDUCTION_PER_POINT = 0.0025;
const ARMOR_MAX_DAMAGE_REDUCTION = 0.85;

function getArmorDamageReduction(armor) {
  let remainingArmor = Math.max(0, getFiniteNumber(armor));
  let reduction = 0;
  let band = 0;
  while (remainingArmor > 0 && reduction < ARMOR_MAX_DAMAGE_REDUCTION) {
    const armorInBand = Math.min(ARMOR_BAND_SIZE, remainingArmor);
    const perArmorReduction = Math.max(
      ARMOR_MIN_REDUCTION_PER_POINT,
      ARMOR_BASE_REDUCTION_PER_POINT * Math.pow(ARMOR_REDUCTION_DECAY_PER_BAND, band)
    );
    reduction += armorInBand * perArmorReduction;
    remainingArmor -= armorInBand;
    band += 1;
  }
  return Math.min(ARMOR_MAX_DAMAGE_REDUCTION, reduction);
}

function getHeroShieldCapPercent(hero = run?.hero) {
  if (!hero) return 0.2;
  return Math.max(0.01, 0.2 + (hero.runShieldCapPercent || 0));
}

function absorbHeroShield(damage, armorReduction = 0) {
  damage = getFiniteNumber(damage);
  armorReduction = getFiniteNumber(armorReduction);
  const shield = run.hero.shield || 0;
  if (shield <= 0) return 0;
  const shieldDamage = Math.max(1, damage - Math.max(0, armorReduction));
  const shieldSpent = Math.min(shield, shieldDamage);
  const blocked = Math.min(damage, shieldSpent + Math.max(0, armorReduction));
  run.hero.shield = shield - shieldSpent;
  if (shieldSpent > 0) addFloat(run.hero.x, run.hero.y - 58, `-${Math.round(shieldSpent)} Shield`, "#bae6fd");
  return blocked;
}

function getHeroBlockChance(hero) {
  if (!hero) return 0;
  const baseBlock = hero.id === "knight" ? 0.16 : 0;
  return Math.min(0.85, Math.max(0, baseBlock + (hero.runBlockChance || 0) + getPermanentEffectTotal("blockChance", hero.id)));
}

function getHeroAttackSpeed(hero) {
  return hero.attackSpeed * (1 + (hero.battleAttackSpeedBonus || 0));
}

function getCombatHeroAttackSpeed(hero) {
  const attackSpeed = getHeroAttackSpeed(hero);
  return isBuildTestRun() ? Math.min(attackSpeed, BUILD_TEST_MAX_HERO_ATTACK_SPEED) : attackSpeed;
}

function getFrameAttackLimit(source) {
  if (!isBuildTestRun()) return Infinity;
  return source === "enemy" ? BUILD_TEST_MAX_ENEMY_ATTACKS_PER_FRAME : BUILD_TEST_MAX_HERO_ATTACKS_PER_FRAME;
}

function getEnemyAttackSpeed(enemy) {
  const slow = enemy.statusEffects && enemy.statusEffects.slow;
  return enemy.attackSpeed * (1 - (slow ? slow.value : 0));
}

function hasTalent(id) {
  return !!run && run.talents.some(talent => talent.id === id);
}

function getTalent(id) {
  return run && run.talents.find(talent => talent.id === id);
}

function getTalentEffectNumber(id, key, fallback = 0) {
  const value = getTalent(id)?.effect?.[key];
  return Number.isFinite(value) ? value : fallback;
}

function getFiniteNumber(value, fallback = 0) {
  return Number.isFinite(value) ? value : fallback;
}

function applyAfterBattleRelics() {
  if (run.hero?.runAfterBattleGold) {
    run.gold += run.hero.runAfterBattleGold;
    log(`Run bonuses grant ${run.hero.runAfterBattleGold} gold.`);
  }
}
