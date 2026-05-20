let selectedGauntletClass = "knight";

function showGauntletScreen() {
  ensureGauntletData();
  showScreen("gauntletScreen");
}

function ensureGauntletData() {
  save.gauntlet = normalizeGauntletData(save.gauntlet);
  save.gauntlet.heroLeaders = syncGauntletLeadersWithConfigs(save.gauntlet.heroLeaders, "hero");
  save.gauntlet.enemyLeaders = syncGauntletLeadersWithConfigs(save.gauntlet.enemyLeaders, "enemy");
}

function createDefaultGauntletHeroLeaders() {
  return GAUNTLET_HERO_LEADER_CONFIGS.map(config => createGauntletLeader({ ...config, type: "hero" }));
}

function createDefaultGauntletEnemyLeaders() {
  return GAUNTLET_ENEMY_LEADER_CONFIGS.map(config => createGauntletLeader({ ...config, type: "enemy" }));
}

function syncGauntletLeadersWithConfigs(leaders, type) {
  const configs = type === "enemy" ? GAUNTLET_ENEMY_LEADER_CONFIGS : GAUNTLET_HERO_LEADER_CONFIGS;
  return configs.map(config => {
    const existing = (leaders || []).find(entry => entry.rank === config.rank);
    if (existing?.id === "local-player" || existing?.movedByPlayer) {
      return { ...existing, points: getGauntletRankPoints(config.rank) };
    }
    const defeatedByPlayer = existing?.defeatedByPlayer || false;
    return { ...createGauntletLeader({ ...config, type }), defeatedByPlayer };
  });
}

function createGauntletLeader(entry) {
  const rankPower = 1 + (11 - entry.rank) * 0.105;
  const classStats = entry.classId ? CLASSES[entry.classId] : null;
  const enemy = entry.enemyId ? ENEMIES.find(e => e.id === entry.enemyId) : ENEMIES[(entry.rank + 2) % ENEMIES.length];
  const source = classStats || enemy || ENEMIES[0];
  return {
    ...entry,
    points: entry.points || getGauntletRankPoints(entry.rank),
    stats: entry.stats ? { ...entry.stats } : {
      maxHp: Math.round((source.hp || 300) * 1.45 * rankPower),
      damage: Math.round((source.damage || 46) * 1.35 * rankPower * 10) / 10,
      attackSpeed: Math.round((source.attackSpeed || 0.9) * (1 + (11 - entry.rank) * 0.018) * 100) / 100,
      armor: Math.round((source.armor || 5) + (11 - entry.rank) * 0.8)
    }
  };
}

function getGauntletRankPoints(rank) {
  return Math.max(500, (1100 - Math.max(1, rank) * 100) * 5);
}

function sortGauntletLeaders(leaders) {
  return [...leaders].sort((a, b) => a.rank - b.rank).slice(0, LEADERBOARD_LIMIT);
}

function getPlayerGauntletHeroRank() {
  return (save.gauntlet?.heroLeaders || []).find(entry => entry.id === "local-player")?.rank || null;
}

function getGauntletChallengeState(entry, type) {
  const playerRank = getPlayerGauntletHeroRank();
  if (type === "hero") {
    if (entry.id === "local-player") return { canChallenge: false, label: "Your Spot" };
    if (playerRank && entry.rank > playerRank) return { canChallenge: false, label: "Below You" };
  }
  if ((save.gauntlet?.points || 0) < entry.points) return { canChallenge: false, label: "Need Points" };
  return { canChallenge: true, label: "Challenge" };
}

function renderGauntletScreen() {
  if (!gauntletSummary) return;
  ensureGauntletData();
  const data = save.gauntlet;
  const stats = data.stats || {};
  gauntletSummary.innerHTML = `
    <div><small>Points</small><strong>${Math.floor(data.points)}</strong></div>
    <div><small>Tournament Coins</small><strong>${Math.floor(data.coins)}</strong></div>
    <div><small>Record</small><strong>${stats.wins || 0}-${stats.losses || 0}</strong></div>
    <div><small>Hero</small><strong>${CLASSES[selectedGauntletClass].name}</strong></div>
  `;
  gauntletOpponentCards.innerHTML = `
    <div class="gauntlet-class-picker">${Object.entries(CLASSES).map(([id, heroClass]) => `<button class="${id === selectedGauntletClass ? "gauntlet-selected" : ""}" onclick="setGauntletClass('${id}')">${heroClass.name}</button>`).join("")}</div>
    ${GAUNTLET_OPPONENT_DIFFICULTIES.map(level => `<div class="gauntlet-card"><h4>${level.name}</h4><p>Unranked 1v1 opponent. Win for +${level.points} points and +${level.coins} coins.</p><button onclick="startGauntletBattle('${level.id}')">Fight</button></div>`).join("")}
  `;
  gauntletShopGrid.innerHTML = GAUNTLET_SHOP_UPGRADES.map(upgrade => renderGauntletShopUpgrade(upgrade)).join("");
  gauntletHeroLeaderboard.innerHTML = renderGauntletLeaderboard(data.heroLeaders, "hero");
  gauntletEnemyLeaderboard.innerHTML = renderGauntletLeaderboard(data.enemyLeaders, "enemy");
  saveGame();
}

function setGauntletClass(classId) {
  if (!CLASSES[classId]) return;
  selectedGauntletClass = classId;
  renderGauntletScreen();
}

function renderGauntletShopUpgrade(upgrade) {
  const level = Math.max(0, Math.floor(Number(save.gauntlet?.upgrades?.[upgrade.id]) || 0));
  const maxed = level >= upgrade.maxLevel;
  const cost = getGauntletUpgradeCost(upgrade, level);
  return `<div class="gauntlet-shop-item">
    <strong>${upgrade.name}</strong>
    <span>${upgrade.description}</span>
    <small>Level ${level}/${upgrade.maxLevel}</small>
    <button onclick="buyGauntletUpgrade('${upgrade.id}')" ${maxed || (save.gauntlet?.coins || 0) < cost ? "disabled" : ""}>${maxed ? "Maxed" : `Buy - ${cost}`}</button>
  </div>`;
}

function getGauntletUpgradeCost(upgrade, level = Math.max(0, Math.floor(Number(save.gauntlet?.upgrades?.[upgrade.id]) || 0))) {
  return Math.round(upgrade.cost * Math.pow(1.32, level));
}

function buyGauntletUpgrade(upgradeId) {
  ensureGauntletData();
  const upgrade = GAUNTLET_SHOP_UPGRADES.find(item => item.id === upgradeId);
  if (!upgrade) return;
  const level = Math.max(0, Math.floor(Number(save.gauntlet.upgrades[upgrade.id]) || 0));
  if (level >= upgrade.maxLevel) return;
  const cost = getGauntletUpgradeCost(upgrade, level);
  if (save.gauntlet.coins < cost) return;
  save.gauntlet.coins -= cost;
  save.gauntlet.upgrades[upgrade.id] = level + 1;
  playSound("shop");
  saveGame();
  renderGauntletScreen();
}

function renderGauntletLeaderboard(entries, type) {
  return entries.map(entry => {
    const challenge = getGauntletChallengeState(entry, type);
    const className = entry.classId ? CLASSES[entry.classId]?.name : "Enemy";
    const defeated = entry.defeatedByPlayer ? `<em>Defeated</em>` : "";
    return `<div class="gauntlet-rank-row">
      <div class="gauntlet-rank">#${entry.rank}</div>
      <div><strong>${escapeHtml(entry.name)}</strong><span>${className} | ${entry.points} pts ${defeated}</span><small>HP ${entry.stats.maxHp} | DMG ${entry.stats.damage} | AS ${entry.stats.attackSpeed} | ARM ${entry.stats.armor}</small></div>
      <button onclick="startGauntletBattle(null, '${type}', ${entry.rank})" ${challenge.canChallenge ? "" : "disabled"}>${challenge.label}</button>
    </div>`;
  }).join("");
}

function startGauntletBattle(difficultyId = "contender", challengeType = null, rank = null) {
  ensureGauntletData();
  const opponent = challengeType ? getGauntletChallengeOpponent(challengeType, rank) : getGauntletUnrankedOpponent(difficultyId);
  if (!opponent) return;
  const classId = selectedGauntletClass;
  beginGauntletFight(classId, opponent, { difficultyId, challengeType, challengeRank: rank });
}

function beginGauntletFight(classId, opponent, options = {}) {
  battleLog.innerHTML = "";
  run = createRun("gauntlet", "gauntlet");
  run.classId = classId;
  run.hero = buildHero(classId);
  applyGauntletUpgradesToHero(run.hero);
  run.gauntlet.opponent = opponent;
  run.gauntlet.difficultyId = options.difficultyId || "contender";
  run.gauntlet.challengeType = options.challengeType || null;
  run.gauntlet.challengeRank = options.challengeRank || null;
  run.gauntlet.rematch = {
    classId,
    opponent: { ...opponent, stats: opponent.stats ? { ...opponent.stats } : null },
    difficultyId: run.gauntlet.difficultyId,
    challengeType: run.gauntlet.challengeType,
    challengeRank: run.gauntlet.challengeRank
  };
  run.gauntlet.pointsAwarded = opponent.pointsAwarded || 0;
  run.gauntlet.coinsAwarded = opponent.coinsAwarded || 0;
  applyRunTheme();
  saveGame();
  beginStage("Gauntlet");
}

function fightGauntletAgain() {
  const rematch = run?.gauntlet?.rematch;
  if (!rematch?.opponent || !rematch.classId) return showGauntletScreen();
  selectedGauntletClass = rematch.classId;
  const opponent = rematch.challengeType
    ? { ...rematch.opponent, stats: rematch.opponent.stats ? { ...rematch.opponent.stats } : null }
    : getGauntletUnrankedOpponent(rematch.difficultyId);
  beginGauntletFight(rematch.classId, opponent, rematch);
}

function getGauntletUnrankedOpponent(difficultyId) {
  const level = GAUNTLET_OPPONENT_DIFFICULTIES.find(item => item.id === difficultyId) || GAUNTLET_OPPONENT_DIFFICULTIES[1];
  const config = GAUNTLET_UNRANKED_OPPONENTS[level.opponentId] || GAUNTLET_UNRANKED_OPPONENTS[level.id] || {};
  const enemy = ENEMIES.find(item => item.id === (config.baseEnemyId || config.enemyId)) || ENEMIES[0];
  return {
    id: config.id || `unranked-${level.id}`,
    name: config.name || `${level.name} ${enemy.name}`,
    enemyId: enemy.id,
    className: config.className || enemy.className,
    spriteSheet: config.spriteSheet || "",
    skinClass: config.skinClass || "",
    stats: getVariedGauntletStats(config.stats || null, level.statVariance),
    statMultiplier: level.statMultiplier,
    pointsAwarded: level.points,
    coinsAwarded: level.coins
  };
}

function getVariedGauntletStats(stats, variance = 0) {
  if (!stats) return null;
  const amount = Math.max(0, Number(variance) || 0);
  const next = {};
  Object.entries(stats).forEach(([stat, value]) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return;
    if (!amount) {
      next[stat] = numeric;
      return;
    }
    const direction = Math.random() < 0.5 ? -1 : 1;
    const strength = amount * (0.45 + Math.random() * 0.55);
    const varied = numeric * (1 + direction * strength);
    if (stat === "attackSpeed") {
      const rounded = Math.max(0.1, Math.round(varied * 100) / 100);
      next[stat] = rounded === numeric ? Math.max(0.1, Math.round((numeric + direction * 0.01) * 100) / 100) : rounded;
    } else {
      const rounded = Math.max(0, Math.round(varied));
      next[stat] = rounded === numeric ? Math.max(0, numeric + direction) : rounded;
    }
  });
  return next;
}

function getGauntletChallengeOpponent(type, rank) {
  const list = type === "enemy" ? save.gauntlet.enemyLeaders : save.gauntlet.heroLeaders;
  const entry = list.find(item => item.rank === Number(rank));
  if (!entry || !getGauntletChallengeState(entry, type).canChallenge) return null;
  const baseEnemyId = entry.enemyId || (entry.classId === "wizard" ? "necromancer" : entry.classId === "rogue" ? "dark_archer" : "armored_knight");
  return {
    ...entry,
    enemyId: baseEnemyId,
    className: entry.className || (ENEMIES.find(enemy => enemy.id === baseEnemyId)?.className) || "armored-knight",
    statMultiplier: 1,
    pointsAwarded: Math.max(20, Math.round(entry.points * 0.12)),
    coinsAwarded: Math.max(12, 26 - entry.rank)
  };
}

function applyGauntletUpgradesToHero(hero) {
  GAUNTLET_SHOP_UPGRADES.forEach(upgrade => {
    const level = Math.max(0, Math.floor(Number(save.gauntlet?.upgrades?.[upgrade.id]) || 0));
    if (!level) return;
    Object.entries(upgrade.effect || {}).forEach(([stat, value]) => {
      if (stat === "maxHp") {
        hero.maxHp += value * level;
        hero.hp += value * level;
      } else {
        hero[stat] = (hero[stat] || 0) + value * level;
      }
    });
  });
}

function makeGauntletEnemy(opponent) {
  const base = ENEMIES.find(enemy => enemy.id === opponent?.enemyId) || ENEMIES[0];
  const enemy = makeEnemy(base, 640, 215, false, "Gauntlet");
  const stats = opponent?.stats || {};
  const multiplier = opponent?.statMultiplier || 1;
  enemy.name = opponent?.name || enemy.name;
  enemy.id = opponent?.id || enemy.id;
  enemy.className = opponent?.className || enemy.className;
  enemy.spriteSheet = opponent?.spriteSheet || getEnemySpriteSheet(base);
  enemy.skinClass = opponent?.skinClass || enemy.skinClass || "";
  enemy.hp = Math.round((stats.maxHp || enemy.hp) * multiplier);
  enemy.maxHp = enemy.hp;
  enemy.damage = (stats.damage || enemy.damage) * multiplier;
  enemy.attackSpeed = (stats.attackSpeed || enemy.attackSpeed) * Math.sqrt(multiplier);
  enemy.attackCooldown = 1 / Math.max(0.01, enemy.attackSpeed);
  enemy.armor = Math.round((stats.armor ?? enemy.armor) * Math.sqrt(multiplier));
  enemy.statusEffects = {};
  return enemy;
}

function recordGauntletBattleResult(victory) {
  if (!run?.gauntlet || run.gauntlet.recorded) return;
  ensureGauntletData();
  run.gauntlet.recorded = true;
  save.gauntlet.stats.battles += 1;
  save.gauntlet.stats[victory ? "wins" : "losses"] += 1;
  const points = victory ? Math.max(0, run.gauntlet.pointsAwarded || 0) : -getGauntletPointLoss();
  const coins = victory ? Math.max(1, run.gauntlet.coinsAwarded || 0) : Math.max(1, Math.round((run.gauntlet.coinsAwarded || 4) * 0.35));
  save.gauntlet.points = Math.max(0, save.gauntlet.points + points);
  save.gauntlet.coins += coins;
  if (victory && run.gauntlet.challengeRank) resolveGauntletChallenge();
  run.gauntlet.earnedPoints = points;
  run.gauntlet.earnedCoins = coins;
  save.gauntlet.history.push({ victory, points, coins, opponent: run.gauntlet.opponent?.name || "Opponent", createdAt: new Date().toISOString() });
  save.gauntlet.history = save.gauntlet.history.slice(-20);
}

function getGauntletPointLoss() {
  const base = Math.max(8, Math.round((run.gauntlet?.pointsAwarded || 28) * 0.35));
  const rankPenalty = run.gauntlet?.challengeRank ? Math.max(10, 60 - Number(run.gauntlet.challengeRank) * 3) : 0;
  return Math.max(base, rankPenalty);
}

function resolveGauntletChallenge() {
  const type = run.gauntlet.challengeType;
  const list = type === "enemy" ? save.gauntlet.enemyLeaders : save.gauntlet.heroLeaders;
  const targetRank = Number(run.gauntlet.challengeRank);
  const index = list.findIndex(entry => entry.rank === targetRank);
  if (index < 0) return;
  if (type === "enemy") {
    list[index].defeatedByPlayer = true;
    return;
  }
  save.gauntlet.stats.rankedWins += 1;
  const playerEntry = createGauntletLeader({
    id: "local-player",
    type: "hero",
    name: `Player ${CLASSES[run.classId].name}`,
    classId: run.classId,
    rank: targetRank,
    points: getGauntletRankPoints(targetRank)
  });

  const playerIndex = list.findIndex(entry => entry.id === "local-player");
  if (playerIndex >= 0) {
    const currentRank = list[playerIndex].rank;
    const targetEntry = { ...list[index], rank: currentRank, points: getGauntletRankPoints(currentRank), movedByPlayer: true };
    list[index] = { ...list[playerIndex], rank: targetRank, points: getGauntletRankPoints(targetRank) };
    list[playerIndex] = targetEntry;
    save.gauntlet.heroLeaders = sortGauntletLeaders(list);
    return;
  }

  const shiftedLeaders = list
    .map(entry => entry.rank >= targetRank
      ? { ...entry, rank: entry.rank + 1, points: getGauntletRankPoints(entry.rank + 1), movedByPlayer: true }
      : entry)
    .filter(entry => entry.rank <= LEADERBOARD_LIMIT);
  save.gauntlet.heroLeaders = sortGauntletLeaders([...shiftedLeaders, playerEntry]);
}

function finishGauntletBattle(victory) {
  stopBattleLoop();
  const points = run.gauntlet?.earnedPoints || 0;
  const coins = run.gauntlet?.earnedCoins || 0;
  showScreen("runEndScreen");
  runEndTitle.textContent = victory ? "Gauntlet Won" : "Gauntlet Lost";
  if (gauntletReturnButton) gauntletReturnButton.style.display = "";
  if (gauntletFightAgainButton) gauntletFightAgainButton.style.display = "";
  if (runEndStartButton) runEndStartButton.style.display = "none";
  if (runEndEssenceButton) runEndEssenceButton.style.display = "none";
  runEndText.innerHTML = `
    <span class="run-end-message">${victory ? "The crowd roars. Your tournament standing rises." : "The bracket is cruel, but even losses pay a little coin."}</span>
    <span class="run-summary-grid">
      <span><small>Opponent</small><strong>${escapeHtml(run.gauntlet?.opponent?.name || "Opponent")}</strong></span>
      <span><small>Points</small><strong>${points >= 0 ? "+" : ""}${points}</strong></span>
      <span><small>Coins</small><strong>+${coins}</strong></span>
      <span><small>Total Points</small><strong>${Math.floor(save.gauntlet.points)}</strong></span>
    </span>
  `;
  saveGame();
  battle = null;
}
