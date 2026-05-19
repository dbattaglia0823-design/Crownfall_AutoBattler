const LEADERBOARD_LIMIT = 10;

function defaultLeaderboards() {
  return {
    endless: []
  };
}

function createEmptyEndlessScore() {
  const now = new Date().toISOString();
  return {
    runId: "",
    playerId: "local-player",
    playerName: "Player",
    stageReached: 0,
    characterId: "",
    characterName: "Unknown",
    finalStats: {},
    finalEquipment: [],
    finalPerks: [],
    runSeed: null,
    runDuration: null,
    createdAt: now
  };
}

function normalizeLeaderboards(storedLeaderboards, fallback = defaultLeaderboards()) {
  return {
    ...fallback,
    ...((storedLeaderboards && typeof storedLeaderboards === "object") ? storedLeaderboards : {}),
    endless: sortEndlessScores(
      Array.isArray(storedLeaderboards?.endless)
        ? storedLeaderboards.endless.map(normalizeEndlessScore).filter(Boolean)
        : []
    ).slice(0, LEADERBOARD_LIMIT)
  };
}

function normalizeEndlessScore(score) {
  if (!score || typeof score !== "object") return null;
  const stageReached = Math.max(0, Math.floor(Number(score.stageReached ?? score.highestStage) || 0));
  if (!stageReached) return null;

  return {
    ...createEmptyEndlessScore(),
    runId: String(score.runId || score.id || `local-run-${score.createdAt || score.date || Date.now()}`),
    playerId: String(score.playerId || "local-player"),
    playerName: String(score.playerName || "Player").trim() || "Player",
    stageReached,
    characterId: String(score.characterId || score.classId || ""),
    characterName: String(score.characterName || score.className || getCharacterName(score.characterId || score.classId)),
    finalStats: score.finalStats && typeof score.finalStats === "object" ? score.finalStats : {},
    finalEquipment: Array.isArray(score.finalEquipment) ? score.finalEquipment : [],
    finalPerks: Array.isArray(score.finalPerks) ? score.finalPerks : [],
    runSeed: score.runSeed ?? null,
    runDuration: Number.isFinite(Number(score.runDuration ?? score.runTimeMs)) ? Number(score.runDuration ?? score.runTimeMs) : null,
    createdAt: score.createdAt || score.date || new Date().toISOString(),
    summary: score.summary && typeof score.summary === "object" ? score.summary : {}
  };
}

function load_leaderboard() {
  if (!save.leaderboards) save.leaderboards = defaultLeaderboards();
  save.leaderboards = normalizeLeaderboards(save.leaderboards);
  return save.leaderboards;
}

function save_leaderboard() {
  if (!save.leaderboards) save.leaderboards = defaultLeaderboards();
  save.leaderboards.endless = sortEndlessScores(save.leaderboards.endless || []).slice(0, LEADERBOARD_LIMIT);
  localStorage.setItem(SAVE_KEY, JSON.stringify(save));
}

function get_top_endless_scores() {
  return [...load_leaderboard().endless];
}

function is_new_personal_best(stage) {
  const reached = Math.max(0, Math.floor(Number(stage) || 0));
  const best = get_top_endless_scores().reduce((highest, score) => Math.max(highest, Number(score.stageReached) || 0), 0);
  return reached > best;
}

function submit_endless_score(runData) {
  if (!runData || runData.mode !== "endless") return { entry: null, rank: null, newBest: false };
  const stageReached = Math.max(Number(runData.stage) || 0, Number(runData.stagesCleared) || 0);
  if (!stageReached) return { entry: null, rank: null, newBest: false };

  const newBest = is_new_personal_best(stageReached);
  const entry = createEndlessScoreEntry(runData, stageReached);
  const leaderboard = load_leaderboard();
  leaderboard.endless = sortEndlessScores([...(leaderboard.endless || []), entry]).slice(0, LEADERBOARD_LIMIT);
  save_leaderboard();

  // Future online leaderboards can upload the normalized entry here.
  // Example shape: upload_endless_score(entry), then reconcile server rank.

  const rankIndex = leaderboard.endless.findIndex(score => score.runId === entry.runId);
  return { entry, rank: rankIndex >= 0 ? rankIndex + 1 : null, newBest };
}

function createEndlessScoreEntry(runData, stageReached) {
  const hero = runData.hero || {};
  const summary = runData.summary || {};
  const now = new Date();
  return normalizeEndlessScore({
    runId: runData.runId || `local-run-${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
    playerId: save.playerId || "local-player",
    playerName: save.playerName || "Player",
    stageReached,
    characterId: runData.classId || hero.id || "",
    characterName: getCharacterName(runData.classId || hero.id, hero.name),
    finalStats: getEndlessFinalStats(hero),
    finalEquipment: getEndlessFinalEquipment(runData),
    finalPerks: getEndlessFinalPerks(runData),
    runSeed: runData.runSeed || null,
    runDuration: runData.startedAt ? Math.max(0, now.getTime() - runData.startedAt) : null,
    createdAt: now.toISOString(),
    summary: {
      enemiesDefeated: Math.round(Number(summary.enemiesDefeated) || 0),
      goldEarned: Math.round(Number(summary.goldEarned) || 0),
      essenceEarned: Math.round(Number(summary.essenceEarned) || 0),
      relicsCollected: Math.round(Number(summary.relicsCollected) || 0),
      talentsChosen: Math.round(Number(summary.talentsChosen) || 0),
      damageDealt: Math.round(Number(summary.damageDealt) || 0),
      damageTaken: Math.round(Number(summary.damageTaken) || 0)
    }
  });
}

function getEndlessFinalStats(hero) {
  return {
    hp: Math.max(0, Math.round(Number(hero.hp) || 0)),
    maxHp: Math.round(Number(hero.maxHp) || 0),
    damage: Math.round((Number(hero.damage) || 0) * 10) / 10,
    attackSpeed: Math.round(getHeroAttackSpeed(hero) * 100) / 100,
    armor: Math.round(Number(hero.armor) || 0),
    crit: Math.round((Number(hero.crit) || 0) * 1000) / 10,
    luck: Math.round(Number(hero.luck) || 0),
    lifeSteal: Math.round((Number(hero.lifeSteal) || 0) * 1000) / 10,
    regen: Math.round((Number(hero.regen) || 0) * 10) / 10
  };
}

function getEndlessFinalEquipment(runData) {
  return [
    ...(runData.relics || []).map(relic => ({ id: relic.id || relic.name, name: relic.name || "Relic", type: "relic", rarity: relic.rarity || "" })),
    ...Object.entries(runData.rewardCounts || {}).map(([name, count]) => ({ id: name, name, type: "upgrade", count: Number(count) || 1, rarity: runData.rewardRarities?.[name] || "" }))
  ];
}

function getEndlessFinalPerks(runData) {
  const abilityIds = runData.hero?.runAbilities || [];
  return [
    ...abilityIds.map(id => ({ id, name: RUN_ABILITIES[id]?.name || id, type: "ability" })),
    ...(runData.talents || []).map(talent => ({ id: talent.id || talent.name, name: talent.name || "Talent", type: "talent", tier: talent.tier || null }))
  ];
}

function sortEndlessScores(scores) {
  return [...scores].sort((a, b) => {
    const stageDiff = (Number(b.stageReached) || 0) - (Number(a.stageReached) || 0);
    if (stageDiff) return stageDiff;
    const aTime = Number(a.runDuration), bTime = Number(b.runDuration);
    if (Number.isFinite(aTime) && Number.isFinite(bTime) && aTime !== bTime) return aTime - bTime;
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });
}

function getCharacterName(characterId, fallback = "Unknown") {
  return (characterId && CLASSES[characterId] ? CLASSES[characterId].name : fallback) || "Unknown";
}
