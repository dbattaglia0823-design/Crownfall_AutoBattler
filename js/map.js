function generateRunMap(themeId) {
  const rows = [[{ id: "s1-start", stage: 1, type: "Battle", connectsTo: [] }]];

  for (let stage = 2; stage <= STAGE_COUNT; stage++) {
    if (stage % MAP_LAYER_SIZE === 0) {
      rows.push([{ id: `s${stage}-boss`, stage, type: "Boss", connectsTo: [] }]);
      continue;
    }

    const count = getMapNodeCount(stage);
    const types = getStageNodeTypes(stage, count, themeId);

    rows.push(
      types.map((type, index) => ({
        id: `s${stage}-${index}`,
        stage,
        type,
        connectsTo: []
      }))
    );
  }

  for (let rowIndex = 0; rowIndex < rows.length - 1; rowIndex++) {
    const lower = rows[rowIndex];
    const upper = rows[rowIndex + 1];

    lower.forEach((node, index) => {
      if (node.id === "s1-start") {
        node.connectsTo = upper.map(next => next.id);
        return;
      }

      const primary = Math.round((index / Math.max(1, lower.length - 1)) * (upper.length - 1));
      const links = [upper[primary].id];

      if (upper[primary - 1] && Math.random() < 0.38) {
        links.push(upper[primary - 1].id);
      }

      if (upper[primary + 1] && Math.random() < 0.48) {
        links.push(upper[primary + 1].id);
      }

      node.connectsTo = [...new Set(links)];
    });
  }

  return rows;
}

function getMapNodeCount(stage) {
  return 3;
}

function getStageNodeTypes(stage, count, themeId) {
  // Round 4 and 9: only Merchant / Sanctuary
  if (stage % MAP_LAYER_SIZE === 4 || stage % MAP_LAYER_SIZE === 9) {
    const themeEvents = getThemeEventNodes(themeId);
    return Array.from({ length: count }, (_, index) => themeEvents[index % themeEvents.length]);
  }

  // Round 5: only Elite
  if (stage % MAP_LAYER_SIZE === 5) {
    return Array.from({ length: count }, () => "Elite");
  }

  // Boss rounds are handled in generateRunMap()

  return Array.from({ length: count }, () => "Battle");
}

function getThemeEventNodes(themeId) {
  const theme = BIOME_THEMES[themeId || (run && run.themeId)];
  const events = theme && theme.eventNodes && theme.eventNodes.length ? [...theme.eventNodes] : ["Merchant", "Heal"];
  if (hasPermanentUnlock("unlock_events") && !events.includes("Treasure")) events.push("Treasure");
  return events;
}

function showMap() {
  run.availableNodeIds = getCurrentNode().connectsTo;
  showScreen("mapScreen");
  const nextStage = run.stage + 1;
  const layer = Math.ceil(nextStage / MAP_LAYER_SIZE);
  mapSubtitle.textContent = `Choose the route for Stage ${nextStage} - Map Layer ${layer}. Your previous path remains highlighted.`;
  renderMapLegend();
  renderRoguelikeMap();
}

function getCurrentNode() {
  return findMapNode(run.currentNodeId) || run.map[0][0];
}

function findMapNode(id) {
  return run.map.flat().find(node => node.id === id);
}

function handleMapChoice(node) {
  playSound("map");
  run.currentNodeId = node.id;
  run.chosenNodeIds.push(node.id);
  run.stage = node.stage;

  if (node.type === "Heal") {
    const maxHpGain = SANCTUARY_HP_GAIN;
    run.hero.maxHp += maxHpGain;
    run.hero.hp = Math.min(run.hero.maxHp, (run.hero.hp || 0) + maxHpGain);
    run.stagesCleared = Math.max(run.stagesCleared, run.stage);
    save.highestClear = Math.max(save.highestClear, run.stagesCleared);
    saveGame();
    log(`Visited a sanctuary. Gained ${maxHpGain} max HP.`);
    showMap();
    showSanctuaryGainPopup(maxHpGain);
    return;
  }

  if (node.type === "Merchant") {
    run.stagesCleared = Math.max(run.stagesCleared, run.stage);
    save.highestClear = Math.max(save.highestClear, run.stagesCleared);
    saveGame();
    return showShop();
  }

  if (node.type === "Treasure") {
    const gold = 35 + run.stage * 3;
    run.gold += gold;
    if (run.summary) run.summary.goldEarned += gold;
    run.stagesCleared = Math.max(run.stagesCleared, run.stage);
    save.highestClear = Math.max(save.highestClear, run.stagesCleared);
    saveGame();
    log(`Found hidden treasure. Gained ${Math.round(gold)} gold.`, "reward");
    if (Math.random() < 0.35 + Math.min(0.25, (run.hero.luck || 0) * 0.02)) {
      run.afterRelicAction = "map";
      return showRelicRewards("Hidden treasure found. Claim one relic.");
    }
    showMap();
    return;
  }

  beginStage(node.type);
}
