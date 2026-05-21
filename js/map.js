function generateRunMap(themeIds, stages = STAGE_COUNT) {
  const rows = [[{ id: "s1-start", stage: 1, type: "Battle", connectsTo: [] }]];

  for (let stage = 2; stage <= stages; stage++) {
    if (stage % MAP_LAYER_SIZE === 0) {
      rows.push([{ id: `s${stage}-boss`, stage, type: "Boss", connectsTo: [] }]);
      continue;
    }

    const count = getMapNodeCount(stage);
    const types = getStageNodeTypes(stage, count, getMapThemeIdForStage(themeIds, stage));

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
    const nextRowIds = upper.map(next => next.id);

    lower.forEach(node => {
      node.connectsTo = nextRowIds;
    });
  }

  return rows;
}

function getMapNodeCount(stage) {
  if (stage % MAP_LAYER_SIZE === 4 || stage % MAP_LAYER_SIZE === 9) return 3;
  return 1;
}

function getStageNodeTypes(stage, count, themeId) {
  // Round 4 and 9: optional side stops, with the main route staying as combat.
  if (stage % MAP_LAYER_SIZE === 4 || stage % MAP_LAYER_SIZE === 9) {
    return ["Merchant", "Battle", "Heal"];
  }

  // Round 5: only Elite
  if (stage % MAP_LAYER_SIZE === 5) {
    return ["Elite"];
  }

  // Boss rounds are handled in generateRunMap()

  return ["Battle"];
}

function getThemeEventNodes(themeId) {
  const theme = BIOME_THEMES[themeId || (run && run.themeId)];
  const events = theme && theme.eventNodes && theme.eventNodes.length ? [...theme.eventNodes] : ["Merchant", "Heal"];
  if (!events.includes("Heal")) events.push("Heal");
  if (hasPermanentUnlock("unlock_events") && !events.includes("Treasure")) events.push("Treasure");
  return events;
}

function getMapThemeIdForStage(themeIds, stage) {
  const ids = Array.isArray(themeIds) ? themeIds : [themeIds].filter(Boolean);
  const layer = Math.max(1, Math.min(3, Math.ceil(stage / MAP_LAYER_SIZE)));
  return ids[layer - 1] || ids[0];
}

function showMap() {
  if (isEndlessRun()) return beginNextEndlessStage();
  applyRunTheme();
  applyMapBackground();
  run.availableNodeIds = getCurrentNode().connectsTo;
  showScreen("mapScreen");
  const nextStage = run.stage + 1;
  mapSubtitle.textContent = `Stage ${nextStage}`;
  renderMapLegend();
  renderRoguelikeMap();
}

function applyMapBackground() {
  const theme = getRunThemeForStage(run?.stage + 1 || run?.stage || 1);
  const image = theme?.mapBackgroundImage || theme?.mapImage || MAP_BACKGROUND_IMAGE || "";
  document.documentElement.style.setProperty("--map-bg-image", image ? `url("${image}")` : "none");
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
    const layer = Math.max(1, Math.ceil(run.stage / MAP_LAYER_SIZE));
    const maxHpGain = SANCTUARY_BASE_HP_GAIN + ((layer - 1) * SANCTUARY_LAYER_HP_GAIN) + getPermanentEffectTotal("sanctuaryMaxHp", run.classId);
    const regenGain = SANCTUARY_BASE_REGEN_GAIN + ((layer - 1) * SANCTUARY_LAYER_REGEN_GAIN) + getPermanentEffectTotal("sanctuaryRegen", run.classId);
    run.hero.maxHp += maxHpGain;
    run.hero.hp = Math.min(run.hero.maxHp, (run.hero.hp || 0) + maxHpGain);
    run.hero.regen = (run.hero.regen || 0) + regenGain;
    run.stagesCleared = Math.max(run.stagesCleared, run.stage);
    save.highestClear = Math.max(save.highestClear, run.stagesCleared);
    saveGame();
    log(`Visited a sanctuary. Gained ${maxHpGain} max HP and +${regenGain} HP regen.`);
    showMap();
    showSanctuaryGainPopup(maxHpGain, regenGain);
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
