function installDevTools() {
  window.CrownfallDev = {
    addEssence(amount = 100) {
      const value = Number(amount);
      if (!Number.isFinite(value)) return devResult("addEssence needs a number.");
      save.essence = Math.max(0, Math.round((Number(save.essence) || 0) + value));
      saveGame();
      if (upgradeScreen.classList.contains("active")) renderTree();
      return devResult(`Essence is now ${Math.floor(save.essence)}.`);
    },

    jumpToStage(stage, nodeType) {
      if (!run || !run.hero) return devResult("Start a run before jumping stages.");
      const targetStage = Math.max(1, Math.min(FINAL_BOSS_STAGE, Math.round(Number(stage) || 1)));
      const type = normalizeNodeType(nodeType) || getDefaultNodeTypeForStage(targetStage);
      stopBattleLoop();
      battle = null;
      run.stage = targetStage;
      run.stagesCleared = Math.max(0, targetStage - 1);
      syncRunNodeForStage(targetStage, type);
      beginStage(type);
      return devResult(`Jumped to Stage ${targetStage} as ${type}.`);
    },

    forceMapNodeType(type, nodeId) {
      if (!run) return devResult("Start a run before forcing map nodes.");
      const normalizedType = normalizeNodeType(type);
      if (!normalizedType) return devResult(`Unknown node type. Use: ${Object.keys(MAP_TYPES).join(", ")}.`);
      const changed = applyForcedMapNodeType(normalizedType, nodeId);
      if (!changed) return devResult("No matching map nodes were changed.");
      if (mapScreen.classList.contains("active")) {
        renderMapLegend();
        renderRoguelikeMap();
      }
      saveGame();
      return devResult(`Changed ${changed} map node${changed === 1 ? "" : "s"} to ${normalizedType}.`);
    },

    resetRun() {
      stopBattleLoop();
      run = null;
      battle = null;
      battleLog.innerHTML = "";
      showScreen("menuScreen");
      return devResult("Current run reset. Save data was not reset.");
    },

    seedEndlessLeaderboard() {
      if (!save.leaderboards) save.leaderboards = defaultLeaderboards();
      const now = Date.now();
      save.leaderboards.endless = sortEndlessScores([
        normalizeEndlessScore({ runId: "debug-endless-1", playerId: "local-player", playerName: "Player", stageReached: 18, characterId: "knight", characterName: "Knight", createdAt: new Date(now - 86400000).toISOString(), runDuration: 820000, finalStats: { maxHp: 540, damage: 48, attackSpeed: 1.3, armor: 18 }, finalEquipment: [], finalPerks: [], summary: { enemiesDefeated: 18 } }),
        normalizeEndlessScore({ runId: "debug-endless-2", playerId: "local-player", playerName: "Player", stageReached: 14, characterId: "rogue", characterName: "Rogue", createdAt: new Date(now - 3600000).toISOString(), runDuration: 610000, finalStats: { maxHp: 390, damage: 56, attackSpeed: 2.4, armor: 8 }, finalEquipment: [], finalPerks: [], summary: { enemiesDefeated: 14 } }),
        normalizeEndlessScore({ runId: "debug-endless-3", playerId: "local-player", playerName: "Player", stageReached: 11, characterId: "wizard", characterName: "Wizard", createdAt: new Date(now - 1800000).toISOString(), runDuration: 540000, finalStats: { maxHp: 360, damage: 64, attackSpeed: 1.1, armor: 6 }, finalEquipment: [], finalPerks: [], summary: { enemiesDefeated: 11 } }),
        ...(save.leaderboards.endless || [])
      ].filter(Boolean)).slice(0, LEADERBOARD_LIMIT);
      save_leaderboard();
      if (leaderboardGrid && leaderboardGrid.closest(".screen").classList.contains("active")) renderLeaderboard();
      return devResult("Seeded local Endless leaderboard test data.");
    }
  };

  console.info("CrownfallDev ready:", Object.keys(window.CrownfallDev).join(", "));
}

function devResult(message) {
  console.info(`[CrownfallDev] ${message}`);
  return message;
}

function normalizeNodeType(type) {
  if (!type) return "";
  if (String(type).toLowerCase() === "finalboss" || String(type).toLowerCase() === "final_boss") return "FinalBoss";
  const match = Object.keys(MAP_TYPES).find(key => key.toLowerCase() === String(type).toLowerCase());
  return match || "";
}

function getDefaultNodeTypeForStage(stage) {
  if (stage === FINAL_BOSS_STAGE) return "FinalBoss";
  if (stage % MAP_LAYER_SIZE === 0) return "Boss";
  if (stage === 1) return "Battle";
  return getStageNodeTypes(stage, 1)[0] || "Battle";
}

function syncRunNodeForStage(stage, type) {
  const row = run.map.find(mapRow => mapRow.some(node => node.stage === stage));
  const node = row && (row.find(candidate => candidate.type === type) || row[0]);
  if (!node) return;
  node.type = type;
  run.currentNodeId = node.id;
  if (!run.chosenNodeIds.includes(node.id)) run.chosenNodeIds.push(node.id);
  run.availableNodeIds = node.connectsTo || [];
}

function applyForcedMapNodeType(type, nodeId) {
  if (nodeId) {
    const node = findMapNode(nodeId);
    if (!node) return 0;
    node.type = type;
    return 1;
  }

  const ids = run.availableNodeIds && run.availableNodeIds.length
    ? run.availableNodeIds
    : (getCurrentNode().connectsTo || []);
  const targets = ids.map(id => findMapNode(id)).filter(Boolean);
  if (!targets.length) {
    const nextStage = Math.min(STAGE_COUNT, run.stage + 1);
    const row = run.map.find(mapRow => mapRow.some(node => node.stage === nextStage));
    if (row) targets.push(...row);
  }
  targets.forEach(node => {
    node.type = type;
  });
  return targets.length;
}
