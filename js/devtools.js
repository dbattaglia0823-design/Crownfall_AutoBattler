function installDevTools() {
  window.CrownfallDev = {
    addEssence(amount = 100) {
      const value = Number(amount);
      if (!Number.isFinite(value)) return devResult("addEssence needs a number.");
      save.essence = Math.max(0, Math.round((Number(save.essence) || 0) + value));
      saveGame();
      refreshDevEssenceUi();
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

    validate() {
      validateSkillTreeLines();
      validateDifficultyProgression();
      return devResult("Ran skill-tree and difficulty validation checks. Check the console for warnings.");
    },

    run(command = "") {
      return runDevCommand(command);
    }
  };

  window.addEssence = window.addessence = amount => window.CrownfallDev.addEssence(amount);
  window.jumpToStage = window.jumptostage = (stage, nodeType) => window.CrownfallDev.jumpToStage(stage, nodeType);
  window.forceMapNodeType = window.forcemapnodetype = (type, nodeId) => window.CrownfallDev.forceMapNodeType(type, nodeId);
  window.resetRun = window.resetrun = () => window.CrownfallDev.resetRun();
  window.dev = command => window.CrownfallDev.run(command);

  console.info("CrownfallDev ready:", Object.keys(window.CrownfallDev).join(", "));
  console.info("CrownfallDev shortcuts: addessence(1000), jumptostage(10, 'Boss'), forcemapnodetype('Elite'), resetrun(), dev('addessence 1000')");
}

function devResult(message) {
  console.info(`[CrownfallDev] ${message}`);
  return message;
}

function runDevCommand(command = "") {
  const parts = String(command).trim().split(/\s+/).filter(Boolean);
  const name = (parts.shift() || "").toLowerCase();
  if (!name) return devResult("Enter a dev command.");
  const aliases = {
    addessence: "addEssence",
    essence: "addEssence",
    jumptostage: "jumpToStage",
    jump: "jumpToStage",
    forcemapnodetype: "forceMapNodeType",
    forcenode: "forceMapNodeType",
    resetrun: "resetRun",
    validate: "validate"
  };
  const method = aliases[name] || name;
  if (!window.CrownfallDev || typeof window.CrownfallDev[method] !== "function") {
    return devResult(`Unknown dev command: ${name}.`);
  }
  return window.CrownfallDev[method](...parts);
}

function refreshDevEssenceUi() {
  if (typeof refreshTopbar === "function") refreshTopbar();
  const treeEssenceEl = document.getElementById("treeEssence");
  if (treeEssenceEl) treeEssenceEl.textContent = Math.floor(save.essence);
  const upgradeScreenEl = document.getElementById("upgradeScreen");
  if (upgradeScreenEl?.classList.contains("active") && typeof renderTree === "function") renderTree();
  const equipmentScreenEl = document.getElementById("equipmentScreen");
  if (equipmentScreenEl?.classList.contains("active") && typeof renderEquipmentShop === "function") renderEquipmentShop();
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
