let selectedGauntletClass = "knight";

function showGauntletScreen() {
  ensureGauntletData();
  showScreen("gauntletScreen");
}

function ensureGauntletData() {
  save.gauntlet = normalizeGauntletData(save.gauntlet);
  if (!save.gauntlet.heroLeaders.length) save.gauntlet.heroLeaders = createDefaultGauntletHeroLeaders();
  if (!save.gauntlet.enemyLeaders.length) save.gauntlet.enemyLeaders = createDefaultGauntletEnemyLeaders();
}

function createDefaultGauntletHeroLeaders() {
  const names = ["Aurelia", "Brom", "Ser Caldus", "Nyra", "Vey", "Merek", "Iris", "Tor", "Sable", "Rowan"];
  const classIds = ["knight", "wizard", "knight", "rogue", "wizard", "knight", "rogue", "knight", "rogue", "wizard"];
  return names.map((name, index) => createGauntletLeader({
    id: `hero-${index + 1}`,
    type: "hero",
    name,
    classId: classIds[index],
    rank: index + 1,
    points: getGauntletRankPoints(index + 1)
  }));
}

function createDefaultGauntletEnemyLeaders() {
  return ENEMIES.slice(0, 10).map((enemy, index) => createGauntletLeader({
    id: `enemy-${enemy.id}`,
    type: "enemy",
    name: enemy.name,
    enemyId: enemy.id,
    rank: index + 1,
    points: getGauntletRankPoints(index + 1)
  }));
}

function createGauntletLeader(entry) {
  const rankPower = 1 + (11 - entry.rank) * 0.105;
  const classStats = entry.classId ? CLASSES[entry.classId] : null;
  const enemy = entry.enemyId ? ENEMIES.find(e => e.id === entry.enemyId) : ENEMIES[(entry.rank + 2) % ENEMIES.length];
  const source = classStats || enemy || ENEMIES[0];
  return {
    ...entry,
    stats: {
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
    const canChallenge = (save.gauntlet?.points || 0) >= entry.points;
    const className = entry.classId ? CLASSES[entry.classId]?.name : "Enemy";
    const defeated = entry.defeatedByPlayer ? `<em>Defeated</em>` : "";
    return `<div class="gauntlet-rank-row">
      <div class="gauntlet-rank">#${entry.rank}</div>
      <div><strong>${escapeHtml(entry.name)}</strong><span>${className} | ${entry.points} pts ${defeated}</span><small>HP ${entry.stats.maxHp} | DMG ${entry.stats.damage} | AS ${entry.stats.attackSpeed} | ARM ${entry.stats.armor}</small></div>
      <button onclick="startGauntletBattle(null, '${type}', ${entry.rank})" ${canChallenge ? "" : "disabled"}>${canChallenge ? "Challenge" : "Need Points"}</button>
    </div>`;
  }).join("");
}

function startGauntletBattle(difficultyId = "contender", challengeType = null, rank = null) {
  ensureGauntletData();
  const opponent = challengeType ? getGauntletChallengeOpponent(challengeType, rank) : getGauntletUnrankedOpponent(difficultyId);
  if (!opponent) return;
  battleLog.innerHTML = "";
  run = createRun("gauntlet", "gauntlet");
  run.classId = selectedGauntletClass;
  run.hero = buildHero(selectedGauntletClass);
  applyGauntletUpgradesToHero(run.hero);
  run.gauntlet.opponent = opponent;
  run.gauntlet.challengeType = challengeType;
  run.gauntlet.challengeRank = rank;
  run.gauntlet.pointsAwarded = opponent.pointsAwarded || 0;
  run.gauntlet.coinsAwarded = opponent.coinsAwarded || 0;
  applyRunTheme();
  saveGame();
  beginStage("Gauntlet");
}

function getGauntletUnrankedOpponent(difficultyId) {
  const level = GAUNTLET_OPPONENT_DIFFICULTIES.find(item => item.id === difficultyId) || GAUNTLET_OPPONENT_DIFFICULTIES[1];
  const enemy = ENEMIES[Math.floor(Math.random() * ENEMIES.length)] || ENEMIES[0];
  return {
    id: `unranked-${level.id}-${Date.now()}`,
    name: `${level.name} ${enemy.name}`,
    enemyId: enemy.id,
    statMultiplier: level.statMultiplier,
    pointsAwarded: level.points,
    coinsAwarded: level.coins
  };
}

function getGauntletChallengeOpponent(type, rank) {
  const list = type === "enemy" ? save.gauntlet.enemyLeaders : save.gauntlet.heroLeaders;
  const entry = list.find(item => item.rank === Number(rank));
  if (!entry || save.gauntlet.points < entry.points) return null;
  return {
    ...entry,
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
  const points = victory ? Math.max(0, run.gauntlet.pointsAwarded || 0) : Math.max(4, Math.round((run.gauntlet.pointsAwarded || 12) * 0.25));
  const coins = victory ? Math.max(1, run.gauntlet.coinsAwarded || 0) : Math.max(1, Math.round((run.gauntlet.coinsAwarded || 4) * 0.35));
  save.gauntlet.points += points;
  save.gauntlet.coins += coins;
  if (victory && run.gauntlet.challengeRank) resolveGauntletChallenge();
  run.gauntlet.earnedPoints = points;
  run.gauntlet.earnedCoins = coins;
  save.gauntlet.history.push({ victory, points, coins, opponent: run.gauntlet.opponent?.name || "Opponent", createdAt: new Date().toISOString() });
  save.gauntlet.history = save.gauntlet.history.slice(-20);
}

function resolveGauntletChallenge() {
  const type = run.gauntlet.challengeType;
  const list = type === "enemy" ? save.gauntlet.enemyLeaders : save.gauntlet.heroLeaders;
  const index = list.findIndex(entry => entry.rank === Number(run.gauntlet.challengeRank));
  if (index < 0) return;
  if (type === "enemy") {
    list[index].defeatedByPlayer = true;
    return;
  }
  save.gauntlet.stats.rankedWins += 1;
  list[index] = createGauntletLeader({
    id: "local-player",
    type: "hero",
    name: `Player ${CLASSES[run.classId].name}`,
    classId: run.classId,
    rank: Number(run.gauntlet.challengeRank),
    points: list[index].points
  });
}

function finishGauntletBattle(victory) {
  stopBattleLoop();
  const points = run.gauntlet?.earnedPoints || 0;
  const coins = run.gauntlet?.earnedCoins || 0;
  showScreen("runEndScreen");
  runEndTitle.textContent = victory ? "Gauntlet Won" : "Gauntlet Lost";
  if (gauntletReturnButton) gauntletReturnButton.style.display = victory ? "" : "none";
  runEndText.innerHTML = `
    <span class="run-end-message">${victory ? "The crowd roars. Your tournament standing rises." : "The bracket is cruel, but even losses pay a little coin."}</span>
    <span class="run-summary-grid">
      <span><small>Opponent</small><strong>${escapeHtml(run.gauntlet?.opponent?.name || "Opponent")}</strong></span>
      <span><small>Points</small><strong>+${points}</strong></span>
      <span><small>Coins</small><strong>+${coins}</strong></span>
      <span><small>Total Points</small><strong>${Math.floor(save.gauntlet.points)}</strong></span>
    </span>
  `;
  saveGame();
  battle = null;
}
