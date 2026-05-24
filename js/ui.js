const $ = id => document.getElementById(id);
const essenceTop = $("essenceTop"), highestClearTop = $("highestClearTop"), accountStatsGrid = $("accountStatsGrid"), achievementGrid = $("achievementGrid");
const characterList = $("characterList"), characterDetails = $("characterDetails"), heroCharacterTab = $("heroCharacterTab"), enemyCharacterTab = $("enemyCharacterTab");
const difficultyTitle = $("difficultyTitle"), difficultyText = $("difficultyText"), classTitle = $("classTitle"), classText = $("classText");
const difficultyCards = $("difficultyCards"), classCards = $("classCards"), battleScreen = $("battleScreen"), runDifficulty = $("runDifficulty"), runClass = $("runClass"), runStage = $("runStage"), runGold = $("runGold"), runEssence = $("runEssence"), battleSpeedSelect = $("battleSpeedSelect");
const buildTestText = $("buildTestText"), buildTestSummary = $("buildTestSummary"), buildTestStats = $("buildTestStats"), buildTestCategories = $("buildTestCategories");
const battlefield = $("battlefield"), buildTestFightHud = $("buildTestFightHud"), buildTestPauseButton = $("buildTestPauseButton"), buildTestDamageCounter = $("buildTestDamageCounter"), buildTestTimer = $("buildTestTimer"), heroStats = $("heroStats"), heroFullStats = $("heroFullStats"), enemyStats = $("enemyStats"), activeSkills = $("activeSkills"), specialSkills = $("specialSkills"), heroUpgrades = $("heroUpgrades"), heroRelics = $("heroRelics"), heroTalents = $("heroTalents"), battleLog = $("battleLog");
const rewardSubtitle = $("rewardSubtitle"), rewardHeroStats = $("rewardHeroStats"), rewardCards = $("rewardCards"), rewardRerollButton = $("rewardRerollButton"), relicSubtitle = $("relicSubtitle"), relicHeroStats = $("relicHeroStats"), relicCards = $("relicCards"), relicRerollButton = $("relicRerollButton");
const talentSubtitle = $("talentSubtitle"), talentCards = $("talentCards"), mapScreen = $("mapScreen"), mapSubtitle = $("mapSubtitle"), mapConnections = $("mapConnections"), mapBoard = $("mapBoard"), mapLegend = $("mapLegend");
const shopSubtitle = $("shopSubtitle"), shopGold = $("shopGold"), shopHeroStats = $("shopHeroStats"), shopCards = $("shopCards"), shopRerollButton = $("shopRerollButton"), runEndTitle = $("runEndTitle"), runEndText = $("runEndText");
const gauntletReturnButton = $("gauntletReturnButton"), gauntletFightAgainButton = $("gauntletFightAgainButton"), runEndStartButton = $("runEndStartButton"), runEndEssenceButton = $("runEndEssenceButton");
const upgradeScreen = $("upgradeScreen"), treeCards = $("treeCards"), treeViewport = $("treeViewport"), treeDetails = $("treeDetails"), treeEssence = $("treeEssence"), treeTabs = $("treeTabs");
const upgradePoolSummary = $("upgradePoolSummary"), upgradePoolTabs = $("upgradePoolTabs"), upgradePoolGrid = $("upgradePoolGrid");
const gauntletSummary = $("gauntletSummary"), gauntletOpponentCards = $("gauntletOpponentCards"), gauntletShopGrid = $("gauntletShopGrid"), gauntletHeroLeaderboard = $("gauntletHeroLeaderboard"), gauntletEnemyLeaderboard = $("gauntletEnemyLeaderboard");
const battleSpeedSetting = $("battleSpeedSetting"), disableShakeSetting = $("disableShakeSetting"), reduceAnimationsSetting = $("reduceAnimationsSetting"), soundSetting = $("soundSetting"), musicVolumeSetting = $("musicVolumeSetting"), sfxVolumeSetting = $("sfxVolumeSetting"), damageNumbersSetting = $("damageNumbersSetting"), tooltipsSetting = $("tooltipsSetting"), equipmentAutosellRaritySetting = $("equipmentAutosellRaritySetting"), fullscreenHint = $("fullscreenHint"), settingsMainMenuButton = $("settingsMainMenuButton");
const screens = [...document.querySelectorAll(".screen")];
const runGoldLabel = runGold?.closest(".stat-box")?.querySelector("small");
const runEssenceLabel = runEssence?.closest(".stat-box")?.querySelector("small");

let settingsReturnScreen = "menuScreen";
let selectedTreeNodeId = "crown_legacy";
let selectedTreeTab = "global";
let treeCamera = { x: 0, y: 0, zoom: 0.75 };
let treePointer = null;
let treePointers = new Map();
let treePinch = null;
let treeHasInitialCenter = false;
let characterBrowserTab = "heroes";
let selectedCharacterId = "knight";
let selectedEquipmentSlotTab = "all";
let selectedUpgradePoolTab = "upgrades";
let equipmentShopOffers = {};
let equipmentShopRefreshAvailableAt = {};
let equipmentShopRefreshTimer = null;

const STARTER_UPGRADE_NAMES = new Set([
  "Sharpened Blade", "Battle Rhythm", "Iron Skin", "Hardy Bread", "Quick Buckle",
  "Vitality Draught", "Knightly Edge", "Oakheart Tonic", "Clockwork Grip", "Field Medic",
  "War Training", "Runed Greatblade", "Giant's Supper", "Silver Reflexes", "Iron Momentum"
]);
let previewSkins = { heroes: {}, enemies: {} };
let lastAttackSoundAt = 0;
let lastHudRenderAt = 0;
const EQUIPMENT_SHOP_REFRESH_COOLDOWN_MS = 60000;
const BUILD_TEST_ATTACK_SOUND_INTERVAL = 0.1;
const BUILD_TEST_STACK_LIMIT = 100;
const TREE_TAB_ROOTS = { global: "crown_legacy", knight: "knight_root", rogue: "rogue_root", wizard: "wizard_root" };
const BUILD_TEST_EFFECT_LIMITS = {
  ".attack-vfx": 10,
  ".battle-projectile": 6,
  ".ability-vfx": 8,
  ".battle-impact": 5
};

function refreshTopbar() {
  essenceTop.textContent = Math.floor(save.essence);
  highestClearTop.textContent = "Stage " + save.highestClear;
}

function showScreen(id) {
  screens.forEach(screen => screen.classList.toggle("active", screen.id === id));
  document.body.classList.toggle("build-test-mode", id === "battleScreen" && isBuildTestRun());
  if (id === "upgradeScreen") {
    renderTree();
    if (!treeHasInitialCenter) requestAnimationFrame(() => { resetTreeView(); treeHasInitialCenter = true; });
  }
  if (id === "charactersScreen") renderCharacterBrowser();
  if (id === "statsScreen") renderAccountStats();
  if (id === "achievementScreen") renderAchievements();
  if (id === "gauntletScreen") renderGauntletScreen();
  if (id === "battleScreen") syncMobileBattleDropdowns();
  if (id === "runEndScreen") resetRunEndActions();
}

function resetRunEndActions() {
  if (gauntletReturnButton) gauntletReturnButton.style.display = "none";
  if (gauntletFightAgainButton) gauntletFightAgainButton.style.display = "none";
  if (runEndStartButton) runEndStartButton.style.display = "";
  if (runEndEssenceButton) runEndEssenceButton.style.display = "";
}

function syncMobileBattleDropdowns() {
  const dropdowns = document.querySelectorAll(".mobile-battle-dropdown");
  const mobile = window.matchMedia("(max-width: 650px)").matches;
  dropdowns.forEach(dropdown => {
    if (!mobile) {
      dropdown.open = true;
      dropdown.dataset.mobileCollapsed = "";
      return;
    }
    if (dropdown.dataset.mobileCollapsed === "true") return;
    dropdown.open = false;
    dropdown.dataset.mobileCollapsed = "true";
  });
}

function applyRunTheme() {
  const theme = run && getRunThemeForStage();
  if (theme?.backgroundImage) {
    document.documentElement.style.setProperty("--battlefield-bg", `url("${theme.backgroundImage}")`);
    return;
  }
  const svg = theme ? theme.backgroundSvg : BATTLEFIELD_SVG;
  document.documentElement.style.setProperty("--battlefield-bg", `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`);
}

function showSettings(returnScreenId) {
  settingsReturnScreen = returnScreenId || getActiveScreenId() || "menuScreen";
  renderSettings();
  showScreen("settingsScreen");
}

function closeSettings() {
  showScreen(settingsReturnScreen || "menuScreen");
  if (settingsReturnScreen === "mapScreen") requestAnimationFrame(drawMapConnections);
}

function getActiveScreenId() {
  const active = document.querySelector(".screen.active");
  return active ? active.id : null;
}

function renderSettings() {
  renderEquipmentAutosellOptions();
  battleSpeedSetting.value = String(getBattleSpeedPreference());
  disableShakeSetting.checked = !!save.settings.disableShake;
  reduceAnimationsSetting.checked = !!save.settings.reduceAnimations;
  soundSetting.checked = save.settings.sound !== false;
  musicVolumeSetting.value = Number(save.settings.musicVolume ?? 60);
  sfxVolumeSetting.value = Number(save.settings.sfxVolume ?? 70);
  damageNumbersSetting.checked = save.settings.damageNumbers !== false;
  tooltipsSetting.checked = save.settings.tooltips !== false;
  equipmentAutosellRaritySetting.value = normalizeEquipmentAutosellRarity(save.settings.equipmentAutosellRarity);
  settingsMainMenuButton.textContent = run ? "Exit Run to Main Menu" : "Main Menu";
  settingsMainMenuButton.classList.toggle("danger-btn", !!run);
  fullscreenHint.textContent = "";
}

function saveSettings() {
  save.settings.battleSpeed = normalizeBattleSpeed(battleSpeedSetting.value);
  save.settings.disableShake = disableShakeSetting.checked;
  save.settings.reduceAnimations = reduceAnimationsSetting.checked;
  save.settings.sound = soundSetting.checked;
  save.settings.soundMigrated = true;
  save.settings.musicVolume = Math.max(0, Math.min(100, Number(musicVolumeSetting.value) || 0));
  save.settings.sfxVolume = Math.max(0, Math.min(100, Number(sfxVolumeSetting.value) || 0));
  save.settings.damageNumbers = damageNumbersSetting.checked;
  save.settings.tooltips = tooltipsSetting.checked;
  save.settings.equipmentAutosellRarity = normalizeEquipmentAutosellRarity(equipmentAutosellRaritySetting.value);
  saveGame();
  if (save.settings.sound === false) stopMusic();
  else updateMusicVolume();
  fullscreenHint.textContent = "Settings saved.";
  updateRunHud();
}

function setupSettingsAutoSave() {
  [battleSpeedSetting, disableShakeSetting, reduceAnimationsSetting, soundSetting, musicVolumeSetting, sfxVolumeSetting, damageNumbersSetting, tooltipsSetting, equipmentAutosellRaritySetting].forEach(control => {
    if (!control) return;
    control.addEventListener("input", saveSettings);
    control.addEventListener("change", saveSettings);
  });
}

function renderEquipmentAutosellOptions() {
  if (!equipmentAutosellRaritySetting) return;
  const current = normalizeEquipmentAutosellRarity(save.settings.equipmentAutosellRarity);
  equipmentAutosellRaritySetting.innerHTML = `<option value="">Off</option>${EQUIPMENT_RARITIES.map(rarity => `<option value="${rarity.id}">${rarity.id}</option>`).join("")}`;
  equipmentAutosellRaritySetting.value = current;
}

function changeBattleSpeed(value) {
  save.settings.battleSpeed = normalizeBattleSpeed(value);
  if (battle) battle.speedMultiplier = save.settings.battleSpeed;
  saveGame();
  updateRunHud();
}

function toggleBuildTestPause() {
  if (!battle || !isBuildTestRun() || battle.state === "result" || battle.state === "done") return;
  battle.paused = !battle.paused;
  updateBuildTestFightHud();
}

function normalizeBattleSpeed(value) {
  const speed = Number(value) || 1;
  return [1, 1.5, 2].includes(speed) ? speed : 1;
}

function applySettings() {
  document.body.classList.toggle("disable-shake", !!save.settings.disableShake);
  document.body.classList.toggle("reduce-animations", !!save.settings.reduceAnimations);
  document.body.classList.toggle("hide-tooltips", save.settings.tooltips === false);
}

let audioContext = null;
let musicState = {
  source: "assets/audio/Main New.ceol",
  song: null,
  gain: null,
  timer: null,
  started: false,
  nextTime: 0,
  sequenceIndex: 0
};

function getAudioContext() {
  if (save.settings.sound === false) return null;
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
  if (audioContext.state === "suspended") audioContext.resume();
  return audioContext;
}

function playSound(type) {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (isBuildTestRun() && ["swordHit", "magicCast", "crit"].includes(type)) {
    const now = performance.now() / 1000;
    if (now - lastAttackSoundAt < BUILD_TEST_ATTACK_SOUND_INTERVAL) return;
    lastAttackSoundAt = now;
  }
  const volume = Math.max(0, Math.min(1, Number(save.settings.sfxVolume ?? 70) / 100));
  const specs = {
    button: [360, 520, 0.045, "triangle", 0.12], map: [260, 420, 0.09, "sine", 0.16],
    swordHit: [170, 95, 0.08, "sawtooth", 0.12], shieldBlock: [120, 75, 0.12, "square", 0.18],
    magicCast: [520, 880, 0.16, "sine", 0.18], crit: [760, 1180, 0.13, "triangle", 0.2],
    enemyDeath: [210, 65, 0.18, "sawtooth", 0.16], relic: [540, 920, 0.22, "sine", 0.18],
    shop: [420, 690, 0.12, "triangle", 0.16], bossIntro: [82, 36, 0.38, "sawtooth", 0.34]
  };
  const [start, end, duration, wave, gain] = specs[type] || specs.button;
  const oscillator = ctx.createOscillator();
  const amp = ctx.createGain();
  oscillator.type = wave;
  oscillator.frequency.setValueAtTime(start, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, end), ctx.currentTime + duration);
  amp.gain.setValueAtTime(0.0001, ctx.currentTime);
  amp.gain.exponentialRampToValueAtTime(gain * volume, ctx.currentTime + 0.012);
  amp.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  oscillator.connect(amp); amp.connect(ctx.destination); oscillator.start(); oscillator.stop(ctx.currentTime + duration + 0.02);
}

function setupGlobalSoundHandlers() {
  document.addEventListener("click", event => {
    if (event.target.closest("button, select, input")) playSound("button");
    startMusic();
  }, true);
  document.addEventListener("pointerdown", startMusic, { once: true });
  document.addEventListener("keydown", startMusic, { once: true });
}

async function startMusic() {
  if (musicState.started || save.settings.sound === false) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  musicState.started = true;
  try {
    if (!musicState.song) musicState.song = await loadCeolSong(musicState.source);
    if (!musicState.gain) {
      musicState.gain = ctx.createGain();
      musicState.gain.connect(ctx.destination);
    }
    updateMusicVolume();
    musicState.nextTime = ctx.currentTime + 0.08;
    musicState.sequenceIndex = 0;
    scheduleMusic();
    musicState.timer = setInterval(scheduleMusic, 180);
  } catch (error) {
    console.warn("Crownfall music: could not play CEOL music.", error);
  }
}

function stopMusic() {
  if (musicState.timer) clearInterval(musicState.timer);
  musicState.timer = null;
  musicState.started = false;
}

function updateMusicVolume() {
  if (!musicState.gain || !audioContext) return;
  const volume = save.settings.sound === false ? 0 : Math.max(0, Math.min(1, Number(save.settings.musicVolume ?? 60) / 100));
  musicState.gain.gain.setTargetAtTime(volume * 0.18, audioContext.currentTime, 0.08);
}

async function loadCeolSong(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Music file not found: ${path}`);
  return parseCeolSong(await response.text());
}

function parseCeolSong(text) {
  const values = text.split(",").map(value => Number(value.trim())).filter(value => Number.isFinite(value));
  if (values.length < 16) throw new Error("Invalid CEOL data.");
  const bpm = Math.max(40, values[4] || 120);
  const stepsPerPattern = Math.max(8, values[5] || 16);
  const instrumentCount = Math.max(0, values[7] || 0);
  let index = 8 + instrumentCount * 6;
  const patternCount = Math.max(0, values[index++] || 0);
  const patterns = [];

  for (let patternIndex = 0; patternIndex < patternCount && index < values.length; patternIndex++) {
    const header = values.slice(index, index + 5);
    index += 5;
    let noteCount = header[4] || 0;
    if (noteCount === 0 && values[index] > 0 && values[index] < 256) noteCount = values[index++];
    const notes = [];
    for (let noteIndex = 0; noteIndex < noteCount && index + 3 < values.length; noteIndex++) {
      const pitch = values[index++], duration = values[index++], step = values[index++], instrument = values[index++];
      if (pitch >= 0 && step >= 0) notes.push({ pitch, duration: Math.max(1, duration || 1), step: step % stepsPerPattern, instrument: Math.max(0, instrument || 0) });
    }
    patterns.push(notes);
  }

  const arrangement = values.slice(index).filter(value => value >= 0 && value < patterns.length);
  return {
    bpm,
    stepsPerPattern,
    stepSeconds: 60 / bpm / 4,
    patterns,
    sequence: arrangement.length ? arrangement : patterns.map((_, patternIndex) => patternIndex)
  };
}

function scheduleMusic() {
  const ctx = getAudioContext();
  const song = musicState.song;
  if (!ctx || !song || !song.sequence.length) return;
  updateMusicVolume();
  while (musicState.nextTime < ctx.currentTime + 0.7) {
    const patternId = song.sequence[musicState.sequenceIndex % song.sequence.length];
    playCeolPattern(song.patterns[patternId] || [], song, musicState.nextTime);
    musicState.nextTime += song.stepsPerPattern * song.stepSeconds;
    musicState.sequenceIndex += 1;
  }
}

function playCeolPattern(notes, song, startTime) {
  notes.forEach(note => {
    const when = startTime + note.step * song.stepSeconds;
    const duration = Math.max(0.05, note.duration * song.stepSeconds * 0.92);
    playCeolNote(note, when, duration);
  });
}

function playCeolNote(note, when, duration) {
  const ctx = audioContext;
  if (!ctx || !musicState.gain) return;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  const midi = note.pitch + 24;
  const frequency = 440 * Math.pow(2, (midi - 69) / 12);
  const waves = ["triangle", "sine", "square", "sawtooth"];

  osc.type = waves[note.instrument % waves.length];
  osc.frequency.setValueAtTime(Math.max(40, Math.min(2200, frequency)), when);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(900 + (note.instrument % 4) * 420, when);
  amp.gain.setValueAtTime(0.0001, when);
  amp.gain.exponentialRampToValueAtTime(0.08, when + 0.015);
  amp.gain.exponentialRampToValueAtTime(0.0001, when + duration);

  osc.connect(filter);
  filter.connect(amp);
  amp.connect(musicState.gain);
  osc.start(when);
  osc.stop(when + duration + 0.03);
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.();
    fullscreenHint.textContent = "Fullscreen requested.";
  } else {
    document.exitFullscreen?.();
    fullscreenHint.textContent = "Exited fullscreen.";
  }
}

function exitRunToMainMenu() {
  if (run && !confirm("Exit this run and return to the main menu? Earned Essence from this run will be kept.")) return;
  if (run) {
    const essence = Math.max(0, Math.round(run.essenceEarned || 0));
    save.essence += essence;
    addAccountStat("abandonedRuns", 1);
    addAccountStat("runsEnded", 1);
    if (essence) addAccountStat("totalEssenceEarned", essence);
    saveGame();
  }
  stopBattleLoop(); run = null; battle = null; showScreen("menuScreen");
}

function renderAccountStats() {
  const stats = { ...defaultAccountStats(), ...(save.stats || {}) };
  const rows = [["Runs Started", stats.runsStarted], ["Victories", stats.victories], ["Defeats", stats.defeats], ["Highest Clear", `Stage ${save.highestClear}`], ["Stages Cleared", stats.stagesCleared], ["Enemies Defeated", stats.enemiesDefeated], ["Bosses Defeated", stats.bossesDefeated], ["Gold Earned", Math.round(stats.totalGoldEarned)], ["Essence Banked", Math.round(stats.totalEssenceEarned)], ["Damage Dealt", Math.round(stats.totalDamageDealt)], ["Damage Taken", Math.round(stats.totalDamageTaken)], ["Skills Triggered", stats.skillsTriggered]];
  accountStatsGrid.innerHTML = rows.map(([label, value]) => `<div class="account-stat"><small>${label}</small><strong>${value}</strong></div>`).join("");
}

function renderAchievements() {
  checkAchievements();
  achievementGrid.innerHTML = ACHIEVEMENTS.map(achievement => {
    const unlocked = save.achievements && save.achievements[achievement.id];
    return `<div class="achievement-card ${unlocked ? "achievement-unlocked" : "achievement-locked"}"><div class="achievement-medal">${unlocked ? "*" : "?"}</div><div><h3>${achievement.name}</h3><p>${achievement.description}</p><small>${achievement.goal}</small><strong>${unlocked ? formatAchievementReward(achievement) : "Reward hidden"}</strong></div></div>`;
  }).join("");
}

function showUpgradePoolScreen() {
  try {
    renderUpgradePool();
  } catch (error) {
    console.error("Failed to render Unlocks.", error);
  }
  showScreen("upgradePoolScreen");
}

function renderUpgradePool() {
  if (!upgradePoolGrid || !upgradePoolSummary) return;
  save.upgradePool = save.upgradePool || defaultUpgradePool();
  const groups = getUpgradePoolGroups();
  if (!groups.some(group => group.id === selectedUpgradePoolTab)) selectedUpgradePoolTab = groups[0]?.id || "upgrades";
  const selectedGroup = groups.find(group => group.id === selectedUpgradePoolTab) || groups[0];
  const totals = groups.reduce((counts, group) => {
    getUpgradePoolGroupItems(group).forEach(item => {
      if (!isUpgradePoolItemUnlocked(item)) return;
      if (!isUpgradePoolItemActive(item, item.poolCategory || group.id)) return;
      const key = `${item.rarity || "Common"} active`;
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, {});
  upgradePoolSummary.innerHTML = Object.entries(totals).map(([label, count]) => `<div><small>${escapeHtml(label)}</small><strong>${count}</strong></div>`).join("");
  if (upgradePoolTabs) {
    upgradePoolTabs.innerHTML = groups.map(group => `
      <button class="${group.id === selectedUpgradePoolTab ? "active" : ""}" data-pool-tab="${escapeHtml(group.id)}">${escapeHtml(group.name)}</button>
    `).join("");
    upgradePoolTabs.querySelectorAll("[data-pool-tab]").forEach(button => {
      button.onclick = () => {
        selectedUpgradePoolTab = button.dataset.poolTab;
        renderUpgradePool();
      };
    });
  }
  upgradePoolGrid.innerHTML = selectedGroup ? renderUpgradePoolGroup(selectedGroup) : "";
  upgradePoolGrid.querySelectorAll("[data-pool-toggle]").forEach(button => {
    button.onclick = () => toggleUpgradePoolItem(button.dataset.poolCategory, button.dataset.poolId);
  });
}

function getUpgradePoolGroups() {
  const talents = Object.values(CLASS_TALENTS).flat().map(talent => ({ ...talent, rarity: getTalentPoolRarity(talent), poolId: talent.id }));
  const runUpgrades = REWARDS
    .filter(reward => !isHeroSpecificUpgrade(reward))
    .filter(reward => !reward.abilityId)
    .map(reward => ({ ...reward, poolId: getPoolItemId(reward), poolCategory: "upgrades" }));
  const heroChildren = Object.entries(CLASSES).map(([classId, heroClass]) => ({
    id: `hero_${classId}`,
    name: heroClass.name,
    items: sortBuildTestItems(REWARDS
      .filter(reward => isUpgradeForHero(reward, classId))
      .map(reward => ({ ...reward, poolId: getPoolItemId(reward), poolCategory: "upgrades" })))
  })).filter(group => group.items.length);
  return [
    { id: "upgrades", name: "Run Upgrades", items: sortUpgradePoolItems(runUpgrades) },
    { id: "heroes", name: "Hero", children: heroChildren },
    { id: "relics", name: "Relics", items: sortBuildTestItems(RELICS.map(relic => ({ ...relic, poolId: getPoolItemId(relic) }))) },
    { id: "talents", name: "Talents", items: sortBuildTestItems(talents) }
  ];
}

function sortUpgradePoolItems(items) {
  const rank = { Mythic: 5, Legendary: 4, Epic: 3, Rare: 2, Common: 1 };
  return [...items].sort((a, b) =>
    (rank[b.rarity] || 0) - (rank[a.rarity] || 0) ||
    Number(isStarterUpgrade(a)) - Number(isStarterUpgrade(b)) ||
    a.name.localeCompare(b.name)
  );
}

function renderUpgradePoolGroup(group) {
  const sections = group.children?.length ? group.children : [group];
  return sections.map(section => `
    <section class="upgrade-pool-section">
      <h3>${escapeHtml(section.name)}</h3>
      <div class="upgrade-pool-list">
        ${section.items.map(item => renderUpgradePoolItem(item.poolCategory || group.id, item)).join("")}
      </div>
    </section>
  `).join("");
}

function getUpgradePoolGroupItems(group) {
  return group.children?.length ? group.children.flatMap(section => section.items) : (group.items || []);
}

function renderUpgradePoolItem(category, item) {
  const unlocked = isUpgradePoolItemUnlocked(item);
  const active = unlocked && isUpgradePoolItemActive(item, category);
  const starter = isStarterUpgrade(item);
  const lockedText = unlocked ? "" : `<em>${getUpgradePoolUnlockText(item)}</em>`;
  return `<div class="upgrade-pool-item upgrade-pool-${String(item.rarity || "Common").toLowerCase()} ${active ? "" : "upgrade-pool-disabled"} ${starter ? "upgrade-pool-starter" : ""}">
    <div><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(getItemDisplayText(item))}</small>${lockedText}</div>
    <button data-pool-toggle="1" data-pool-category="${category}" data-pool-id="${escapeHtml(item.poolId)}" ${!unlocked || starter ? "disabled" : ""}>${starter ? "Default" : active ? "On" : "Off"}</button>
  </div>`;
}

function toggleUpgradePoolItem(category, id) {
  save.upgradePool = save.upgradePool || defaultUpgradePool();
  save.upgradePool.disabled[category] = save.upgradePool.disabled[category] || {};
  const items = getUpgradePoolItemsForCategory(category);
  const item = items.find(entry => entry.poolId === id);
  if (!item || !isUpgradePoolItemUnlocked(item) || isStarterUpgrade(item)) return;
  if (save.upgradePool.disabled[category][id]) delete save.upgradePool.disabled[category][id];
  else {
    const activeSameRarity = items.filter(entry => (entry.rarity || "Common") === (item.rarity || "Common") && isUpgradePoolItemUnlocked(entry) && isUpgradePoolItemActive(entry, category));
    if (activeSameRarity.length <= getMinimumActivePoolCount(item.rarity || "Common")) return;
    save.upgradePool.disabled[category][id] = true;
  }
  saveGame();
  renderUpgradePool();
}

function getUpgradePoolItemsForCategory(category) {
  return getUpgradePoolGroups().flatMap(group => getUpgradePoolGroupItems(group).filter(item => (item.poolCategory || group.id) === category));
}

function getPoolItemId(item) {
  return item.id || String(item.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "_");
}

function isStarterUpgrade(item) {
  return STARTER_UPGRADE_NAMES.has(item.name);
}

function isHeroSpecificUpgrade(item) {
  return !!(item.classId || item.abilityId || item.requiresAbility);
}

function isUpgradeForHero(item, classId) {
  if (item.classId) return item.classId === classId;
  const abilityId = item.abilityId || item.requiresAbility;
  return abilityId ? RUN_ABILITIES[abilityId]?.classId === classId : false;
}

function getTalentPoolRarity(talent) {
  return talent.tier >= 3 ? "Epic" : talent.tier >= 2 ? "Rare" : "Common";
}

function getRarityUnlockStage(rarity) {
  return ({ Common: 0, Rare: 0, Epic: 10, Legendary: 20, Mythic: 20 })[rarity] || 0;
}

function getUpgradePoolUnlockText(item) {
  if (item.requiresNode && !hasPermanentNode(item.requiresNode)) return "Unlocked in skill tree";
  const requirements = [];
  const stage = getRarityUnlockStage(item.rarity || "Common");
  if ((save.highestClear || 0) < stage) requirements.push(`Beat Stage ${stage} (${save.highestClear || 0} / ${stage})`);
  const challenge = formatRequirement(item.unlockRequirement, { progress: true });
  if (challenge && !isRequirementMet(item.unlockRequirement)) requirements.push(challenge);
  return requirements.length ? requirements.join(" and ") : `Unlocks at Stage ${stage}`;
}

function isUpgradePoolItemUnlocked(item) {
  if (isStarterUpgrade(item)) return true;
  if (item.requiresNode && !hasPermanentNode(item.requiresNode)) return false;
  return (save.highestClear || 0) >= getRarityUnlockStage(item.rarity || "Common") && isRequirementMet(item.unlockRequirement);
}

function isUpgradePoolItemActive(item, category = null) {
  if (isStarterUpgrade(item)) return true;
  const poolCategory = category || (item.effect ? "relics" : item.tier ? "talents" : "upgrades");
  return !save.upgradePool?.disabled?.[poolCategory]?.[item.poolId || getPoolItemId(item)];
}

function getMinimumActivePoolCount() {
  return 5;
}

function filterByUpgradePool(items, category) {
  return items.filter(item => {
    if (item.abilityId) return true;
    const poolItem = { ...item, poolId: getPoolItemId(item), rarity: item.rarity || (item.tier ? getTalentPoolRarity(item) : "Common") };
    return isUpgradePoolItemUnlocked(poolItem) && isUpgradePoolItemActive(poolItem, category);
  });
}

function getAvailablePoolItems(options = {}) {
  const type = options.type || "upgrades";
  const classId = options.classId || run?.hero?.id || run?.classId || "";
  const abilityIds = options.abilityIds || new Set(run?.hero?.runAbilities || []);
  const includeDisabled = !!options.includeDisabled;
  const includeLocked = !!options.includeLocked;
  let items = [];
  if (type === "upgrades") items = REWARDS.filter(reward => options.includeAbilities || !reward.abilityId);
  if (type === "relics") items = RELICS;
  if (type === "talents") items = CLASS_TALENTS[classId] || [];
  return items.filter(item => {
    if (type === "talents" && options.excludeOwnedTalentIds?.has(item.id)) return false;
    if (item.abilityId) return isRunAbilityUnlockedForClass(item.abilityId, classId) && !abilityIds.has(item.abilityId);
    if (!item.abilityId && !isAbilityLockedItemAvailable(item, classId, abilityIds)) return false;
    if (includeLocked) return true;
    const poolItem = { ...item, poolId: getPoolItemId(item), rarity: item.rarity || (item.tier ? getTalentPoolRarity(item) : "Common") };
    if (!isUpgradePoolItemUnlocked(poolItem)) return false;
    return includeDisabled || isUpgradePoolItemActive(poolItem, type);
  });
}

window.showUpgradePoolScreen = showUpgradePoolScreen;

function formatAchievementBonus(bonus = {}) {
  return Object.entries(bonus).map(([key, value]) => (key === "skin" || key === "unlock") ? `Unlocks ${value}` : `${Math.abs(value) < 1 ? `+${Math.round(value * 100)}%` : `+${value}`} ${key}`).join(", ");
}

function formatAchievementReward(achievement) {
  const parts = [formatAchievementBonus(achievement.bonus)].filter(Boolean);
  const essence = getAchievementEssenceReward(achievement);
  if (essence) parts.push(`+${essence} Essence`);
  return parts.join(", ");
}

function showAchievementPopup(achievement) {
  const popup = document.createElement("div");
  popup.className = "achievement-toast";
  popup.innerHTML = `<div class="achievement-toast-medal">!</div><div><small>Achievement Unlocked</small><strong>${escapeHtml(achievement.name)}</strong><p>${escapeHtml(achievement.goal || achievement.description)}</p><em>${escapeHtml(formatAchievementReward(achievement))}</em></div>`;
  document.body.appendChild(popup);
  setTimeout(() => popup.classList.add("achievement-toast-hide"), 3600);
  setTimeout(() => popup.remove(), 4300);
}

function showSanctuaryGainPopup(amount, regen = 0) {
  const popup = document.createElement("div");
  popup.className = "sanctuary-gain-popup";
  popup.textContent = `+${amount} Max HP${regen ? `, +${regen} Regen` : ""}`;
  mapScreen.appendChild(popup);
  setTimeout(() => popup.remove(), 1100);
}

function startRunFlow() {
  renderDifficulties();
  showScreen("difficultyScreen");
}

function renderDifficulties() {
  difficultyTitle.textContent = "Select Difficulty";
  difficultyText.textContent = "Choose a route, enter Endless Mode, or fight in the Gauntlet. Harder paths return more Essence.";
  difficultyCards.innerHTML = Object.entries(DIFFICULTIES).map(([id, difficulty]) => {
    const locked = isDifficultyLocked(difficulty);
    const endless = difficulty.mode === "endless";
    const buildTest = difficulty.mode === "buildTest";
    const gauntlet = difficulty.mode === "gauntlet";
    const icon = gauntlet ? "G" : buildTest ? "BT" : endless ? "&#9760;" : id === "easy" ? "&#9827;" : id === "medium" ? "&#9876;" : "&#9819;";
    const areaNames = getDifficultyThemeNames(difficulty);
    const modeText = locked ? getDifficultyLockReason(difficulty) : gauntlet ? "Ranked 1v1 tournament battles with separate points, coins, and shop upgrades." : buildTest ? "Choose a hero, build freely, then fight only the Eternal Crown." : endless ? "Exponential scaling. Same upgrades and relics, then straight into the next fight." : `Story route: ${areaNames.join(" -> ")}`;
    return `<div class="card choice-card difficulty-card difficulty-${id}${locked ? " choice-card-locked" : ""}" data-difficulty="${id}"><div class="choice-icon">${icon}</div><h3>${difficulty.name}</h3><p>${difficulty.description}</p><p class="subtle">${modeText}</p><button ${locked ? "disabled" : ""}>${locked ? "Locked" : `Select ${difficulty.name}`}</button></div>`;
  }).join("");
  difficultyCards.querySelectorAll("[data-difficulty]").forEach(card => {
    card.querySelector("button").onclick = () => {
      const id = card.dataset.difficulty;
      if (isDifficultyLocked(DIFFICULTIES[id])) return;
      if (DIFFICULTIES[id].mode === "gauntlet") return showGauntletScreen();
      run = createRun(id, DIFFICULTIES[id].mode || "standard"); applyRunTheme(); renderClasses(); showScreen("classScreen");
    };
  });
}

function isDifficultyLocked(difficulty) {
  return !!((difficulty.requiresDifficultyClear && !hasDifficultyClear(difficulty.requiresDifficultyClear)) || (difficulty.requiresNode && !hasPermanentUnlock(difficulty.requiresNode)) || (difficulty.requiresAchievement && !hasAchievement(difficulty.requiresAchievement)));
}

function getDifficultyLockReason(difficulty) {
  if (difficulty.requiresDifficultyClear && !hasDifficultyClear(difficulty.requiresDifficultyClear)) {
    const required = DIFFICULTIES[difficulty.requiresDifficultyClear];
    return `Locked: beat ${required?.name || "the previous difficulty"} first.`;
  }
  if (difficulty.requiresAchievement && !hasAchievement(difficulty.requiresAchievement)) return "Locked: defeat The Eternal Crown to unlock.";
  if (difficulty.requiresNode && !hasPermanentUnlock(difficulty.requiresNode)) return "Locked: unlock it in Skills.";
  return "Locked";
}

function renderClasses() {
  const endless = run?.mode === "endless";
  const buildTest = isBuildTestRun();
  classTitle.textContent = buildTest ? "Select Build Test Hero" : endless ? "Select Endless Hero" : "Select Hero";
  classText.textContent = buildTest
    ? "Choose the champion for the build lab. You will pick skills, upgrades, relics, and talents before the test fight."
    : endless
    ? "Choose the champion for the endless 1v1 gauntlet. Upgrades, relics, and class talents still appear between fights."
    : "Choose the champion who will carry the run. Each class has distinct stats, combat rhythm, and strengths.";
  classCards.innerHTML = Object.entries(CLASSES).map(([id, heroClass]) => {
    const skin = getSelectedHeroSkin(id);
    return `<div class="card choice-card hero-card" data-class="${id}"><div class="hero-preview player ${getHeroSkinClass(id)} sprite-sheet-unit"><div class="sprite" style="${getSpriteBackgroundStyle(SPRITE_SHEETS.heroes[id], "hero", id, skin)};background-size:600% 100%;background-position:0% center;"></div></div><h3>${heroClass.name}</h3><p>${heroClass.description}</p><ul>${heroClass.traits.map(trait => `<li>${getTraitIconMarkup(trait)}<span>${trait}</span></li>`).join("")}</ul><button>${buildTest ? "Build Test as" : endless ? "Begin Endless as" : "Begin as"} ${heroClass.name}</button></div>`;
  }).join("");
  classCards.querySelectorAll("[data-class]").forEach(card => card.querySelector("button").onclick = () => startRun(card.dataset.class));
}

function getHeroSkinClass(classId) {
  const base = CLASSES[classId].colorClass;
  const skin = getSelectedHeroSkin(classId);
  return [base, skin.className].filter(Boolean).join(" ");
}

function setCharacterBrowserTab(tab) {
  characterBrowserTab = tab === "enemies" ? "enemies" : "heroes";
  selectedCharacterId = characterBrowserTab === "heroes" ? "knight" : (getAllCharacterEnemies()[0] || {}).id;
  renderCharacterBrowser();
}

function renderCharacterBrowser() {
  if (!characterList || !characterDetails) return;
  heroCharacterTab.classList.toggle("character-tab-active", characterBrowserTab === "heroes");
  enemyCharacterTab.classList.toggle("character-tab-active", characterBrowserTab === "enemies");
  const items = characterBrowserTab === "heroes"
    ? Object.entries(CLASSES).map(([id, data]) => ({ id, name: data.name, baseSheet: SPRITE_SHEETS.heroes[id], skin: getSelectedHeroSkin(id), className: getHeroSkinClass(id) }))
    : getAllCharacterEnemies().map(enemy => ({ id: enemy.id, name: enemy.name, baseSheet: getEnemySpriteSheet(enemy), skin: getSelectedEnemySkin(enemy.id), className: `enemy ${enemy.className} ${getSelectedEnemySkin(enemy.id).className}` }));
  if (!items.some(item => item.id === selectedCharacterId)) selectedCharacterId = items[0]?.id || "";
  characterList.innerHTML = items.map(item => `<button class="character-list-item ${item.id === selectedCharacterId ? "character-list-selected" : ""}" data-character="${item.id}"><span class="character-list-sprite ${item.className} sprite-sheet-unit"><span class="sprite" style="${getSpriteBackgroundStyle(item.baseSheet, characterBrowserTab === "heroes" ? "hero" : "enemy", item.id, item.skin)};background-size:600% 100%;background-position:0% center;"></span></span><strong>${escapeHtml(item.name)}</strong></button>`).join("");
  characterList.querySelectorAll("[data-character]").forEach(button => button.onclick = () => { selectedCharacterId = button.dataset.character; renderCharacterBrowser(); });
  renderCharacterDetails();
}

function renderCharacterDetails() {
  if (characterBrowserTab === "heroes") return renderHeroCharacterDetails(selectedCharacterId);
  return renderEnemyCharacterDetails(selectedCharacterId);
}

function renderHeroCharacterDetails(classId) {
  const heroClass = CLASSES[classId] || CLASSES.knight;
  const skin = getPreviewSkin("hero", classId) || getSelectedHeroSkin(classId);
  const equippedSkin = getSelectedHeroSkin(classId);
  const previewHero = buildHero(classId);
  const stats = [
    ["HP", Math.round(previewHero.maxHp)],
    ["Damage", previewHero.damage.toFixed(1)],
    ["Atk Spd", previewHero.attackSpeed.toFixed(2)],
    ["Armor", Math.round(previewHero.armor)],
    ["Crit", formatPercentCap(previewHero.crit, STAT_CAPS.crit)]
  ];
  characterDetails.innerHTML = `<div class="character-detail-top"><div class="character-detail-preview player ${[heroClass.colorClass, skin.className].filter(Boolean).join(" ")} sprite-sheet-unit"><div class="sprite" style="${getSpriteBackgroundStyle(SPRITE_SHEETS.heroes[classId], "hero", classId, skin)};background-size:600% 100%;background-position:0% center;"></div></div><div><h3>${heroClass.name}</h3><p>${heroClass.description}</p><small>Equipped: ${escapeHtml(equippedSkin.name)}${skin.id !== equippedSkin.id ? ` | Previewing: ${escapeHtml(skin.name)}` : ""}</small></div></div>${renderCharacterStatGrid(stats)}${renderSkinPicker("hero", classId, HERO_SKINS[classId])}${renderHeroEquipmentPanel(classId)}`;
  wireHeroEquipmentPanel(classId);
  wireSkinPicker("hero", classId);
}

function renderEnemyCharacterDetails(enemyId) {
  const enemy = getAllCharacterEnemies().find(item => item.id === enemyId) || getAllCharacterEnemies()[0];
  if (!enemy) return;
  const skin = getPreviewSkin("enemy", enemy.id) || getSelectedEnemySkin(enemy.id);
  const equippedSkin = getSelectedEnemySkin(enemy.id);
  const difficultyText = getEnemyDifficultyText(enemy);
  const stats = [
    ["HP", Math.round(enemy.hp * ENEMY_BASE_STAT_MULTIPLIER)],
    ["Damage", (enemy.damage * ENEMY_BASE_STAT_MULTIPLIER).toFixed(1)],
    ["Atk Spd", (enemy.attackSpeed * ENEMY_BASE_STAT_MULTIPLIER).toFixed(2)],
    ["Armor", Math.round(enemy.armor * ENEMY_BASE_STAT_MULTIPLIER)],
    ["Armor Piercing", Math.round((enemy.armorPiercing || 0) * ENEMY_BASE_STAT_MULTIPLIER)]
  ];
  characterDetails.innerHTML = `<div class="character-detail-top"><div class="character-detail-preview enemy ${enemy.className} ${skin.className} sprite-sheet-unit"><div class="sprite" style="${getSpriteBackgroundStyle(getEnemySpriteSheet(enemy), "enemy", enemy.id, skin)};background-size:600% 100%;background-position:0% center;"></div></div><div><h3>${enemy.name}</h3><p>${escapeHtml(difficultyText)}</p><small>Equipped: ${escapeHtml(equippedSkin.name)}${skin.id !== equippedSkin.id ? ` | Previewing: ${escapeHtml(skin.name)}` : ""}</small></div></div>${renderCharacterStatGrid(stats)}${renderSkinPicker("enemy", enemy.id, getEnemySkinSet(enemy.id, enemy.name))}`;
  wireSkinPicker("enemy", enemy.id);
}

function getEnemyDifficultyText(enemy) {
  const names = getEnemyDifficulties(enemy);
  return names.length ? `Found in: ${names.join(", ")}.` : "Found in: Unknown route.";
}

function getEnemyDifficulties(enemy) {
  if (!enemy) return [];
  return Object.values(DIFFICULTIES)
    .filter(difficulty => enemyAppearsInDifficulty(enemy, difficulty))
    .map(difficulty => difficulty.name);
}

function enemyAppearsInDifficulty(enemy, difficulty) {
  if (!enemy || !difficulty) return false;
  if (difficulty.mode === "buildTest") return enemy.id === FINAL_BOSS.id;
  if (enemy.finalBoss) return !difficulty.mode;
  if (enemy.boss) return difficulty.mode !== "buildTest";

  const pools = [
    difficulty.enemyPool || [],
    ...(difficulty.themeIds || []).map(themeId => BIOME_THEMES[themeId]?.enemyPool || [])
  ];
  return pools.some(pool => pool.some(candidate => candidate && candidate.id === enemy.id));
}

function renderCharacterStatGrid(stats) {
  return `<div class="character-stat-grid">${stats.map(([label, value]) => `<div><small>${label}</small><strong>${value}</strong></div>`).join("")}</div>`;
}

function renderHeroEquipmentPanel(classId) {
  const equipment = getHeroEquipment(classId);
  const slotFilter = selectedEquipmentSlotTab === "all" ? null : selectedEquipmentSlotTab;
  const slots = EQUIPMENT_SLOTS.map(slot => {
    const item = equipment[slot.id] ? getInventoryItem(equipment[slot.id]) : null;
    return `<div class="equipment-slot">
      <small>${escapeHtml(slot.name)}</small>
      <strong>${item ? escapeHtml(item.name) : "Empty"}</strong>
      <span>${item ? escapeHtml(formatEquipmentItemSummary(item)) : "No item equipped"}</span>
      ${item ? `<button data-unequip-slot="${slot.id}">Unequip</button>` : ""}
    </div>`;
  }).join("");
  const inventoryItems = sortEquipmentItems(getInventoryItemsForHero(classId, slotFilter).filter(item => !isInventoryItemEquipped(item.instanceId)));
  const inventory = inventoryItems.length ? inventoryItems.map(item => {
    return `<div class="inventory-item equipment-rarity-${String(item.rarity || "Common").toLowerCase()}">
      <div>
        <strong>${escapeHtml(item.name)}</strong>
        <span>${escapeHtml(getEquipmentSlotName(item.slot))} / ${escapeHtml(item.rarity)} / Quality ${Math.round((item.quality || 0) * 100)}% / Power ${item.power || 0}</span>
        <span>In Inventory</span>
        <small>${escapeHtml(formatEquipmentItemSummary(item))}</small>
      </div>
      <div class="inventory-actions">
        <button data-equip-item="${escapeHtml(item.instanceId)}">Equip</button>
        <button data-sell-item="${escapeHtml(item.instanceId)}">Sell ${getEquipmentSellValue(item)}e</button>
      </div>
    </div>`;
  }).join("") : `<div class="inventory-empty">No ${slotFilter ? escapeHtml(getEquipmentSlotName(slotFilter).toLowerCase()) : "equipment"} in inventory yet.</div>`;
  const tabs = [{ id: "all", name: "All" }, ...EQUIPMENT_SLOTS].map(tab =>
    `<button class="equipment-tab ${selectedEquipmentSlotTab === tab.id ? "equipment-tab-active" : ""}" data-equipment-tab="${tab.id}">${escapeHtml(tab.name)}</button>`
  ).join("");
  const shopOffers = getEquipmentShopOffers(classId);
  const refreshRemaining = getEquipmentShopRefreshRemainingSeconds(classId);
  scheduleEquipmentShopRefreshRender(classId);
  const shop = shopOffers.map((item, index) => {
    const cost = getEquipmentBuyCost(item);
    return `<div class="equipment-shop-item equipment-rarity-${String(item.rarity || "Common").toLowerCase()}">
      <div>
        <strong>${escapeHtml(item.name)}</strong>
        <span>${escapeHtml(getEquipmentSlotName(item.slot))} / ${escapeHtml(item.rarity)} / Quality ${Math.round((item.quality || 0) * 100)}% / Power ${item.power || 0}</span>
        <small>${escapeHtml(formatEquipmentItemSummary(item))}</small>
      </div>
      <button data-buy-equipment="${index}" ${save.essence < cost ? "disabled" : ""}>Buy ${cost}e</button>
    </div>`;
  }).join("");
  return `<section class="hero-equipment-panel">
    <div class="equipment-panel-header">
      <div>
        <h4>Equipment</h4>
        <p>Persistent slots for this hero. Buy and sell spare gear with Essence.</p>
      </div>
      <div class="equipment-essence">Essence <strong>${Math.floor(save.essence)}</strong></div>
    </div>
    <div class="equipment-slot-grid">${slots}</div>
    <div class="equipment-shop">
      <div class="equipment-panel-header">
        <h4>Essence Gear Shop</h4>
        <button data-refresh-equipment-shop ${refreshRemaining > 0 ? "disabled" : ""}>${refreshRemaining > 0 ? `Refresh ${refreshRemaining}s` : "Refresh"}</button>
      </div>
      <div class="equipment-shop-list">${shop}</div>
    </div>
    <h4 class="inventory-title">Inventory</h4>
    <div class="equipment-tabs">${tabs}</div>
    <div class="inventory-list">${inventory}</div>
  </section>`;
}

function wireHeroEquipmentPanel(classId) {
  characterDetails.querySelectorAll("[data-equip-item]").forEach(button => {
    button.onclick = () => {
      const inventoryScrollTop = characterDetails.querySelector(".inventory-list")?.scrollTop || 0;
      equipInventoryItem(classId, button.dataset.equipItem);
      renderHeroCharacterDetails(classId);
      restoreEquipmentInventoryScroll(inventoryScrollTop);
    };
  });
  characterDetails.querySelectorAll("[data-sell-item]").forEach(button => {
    button.onclick = () => {
      sellEquipmentItem(classId, button.dataset.sellItem);
      renderHeroCharacterDetails(classId);
    };
  });
  characterDetails.querySelectorAll("[data-equipment-tab]").forEach(button => {
    button.onclick = () => {
      selectedEquipmentSlotTab = button.dataset.equipmentTab || "all";
      renderHeroCharacterDetails(classId);
    };
  });
  characterDetails.querySelectorAll("[data-buy-equipment]").forEach(button => {
    button.onclick = () => {
      buyEquipmentOffer(classId, Number(button.dataset.buyEquipment));
      renderHeroCharacterDetails(classId);
    };
  });
  const refreshButton = characterDetails.querySelector("[data-refresh-equipment-shop]");
  if (refreshButton) refreshButton.onclick = () => {
    if (getEquipmentShopRefreshRemainingSeconds(classId) > 0) return;
    equipmentShopOffers[classId] = createEquipmentShopOffers(classId);
    equipmentShopRefreshAvailableAt[classId] = Date.now() + EQUIPMENT_SHOP_REFRESH_COOLDOWN_MS;
    renderHeroCharacterDetails(classId);
    scheduleEquipmentShopRefreshRender(classId);
  };
  characterDetails.querySelectorAll("[data-unequip-slot]").forEach(button => {
    button.onclick = () => {
      const inventoryScrollTop = characterDetails.querySelector(".inventory-list")?.scrollTop || 0;
      unequipHeroSlot(classId, button.dataset.unequipSlot);
      renderHeroCharacterDetails(classId);
      restoreEquipmentInventoryScroll(inventoryScrollTop);
    };
  });
}

function getEquipmentShopOffers(classId) {
  if (!equipmentShopOffers[classId]?.length) equipmentShopOffers[classId] = createEquipmentShopOffers(classId);
  return equipmentShopOffers[classId];
}

function getEquipmentShopRefreshRemainingSeconds(classId) {
  const remaining = (equipmentShopRefreshAvailableAt[classId] || 0) - Date.now();
  return Math.max(0, Math.ceil(remaining / 1000));
}

function scheduleEquipmentShopRefreshRender(classId) {
  if (equipmentShopRefreshTimer) {
    clearTimeout(equipmentShopRefreshTimer);
    equipmentShopRefreshTimer = null;
  }
  if (!updateEquipmentShopRefreshButton(classId)) return;
  equipmentShopRefreshTimer = setTimeout(() => {
    equipmentShopRefreshTimer = null;
    scheduleEquipmentShopRefreshRender(classId);
  }, 1000);
}

function updateEquipmentShopRefreshButton(classId) {
  if (characterBrowserTab !== "heroes" || selectedCharacterId !== classId || getActiveScreenId() !== "charactersScreen") return false;
  const refreshButton = characterDetails?.querySelector("[data-refresh-equipment-shop]");
  if (!refreshButton) return false;
  const remaining = getEquipmentShopRefreshRemainingSeconds(classId);
  refreshButton.disabled = remaining > 0;
  refreshButton.textContent = remaining > 0 ? `Refresh ${remaining}s` : "Refresh";
  return remaining > 0;
}

function createEquipmentShopOffers(classId) {
  const stage = Math.max(1, Math.min(FINAL_BOSS_STAGE, save.highestClear || 1));
  return Array.from({ length: 3 }, () => generateEquipmentDrop({ classId, stage, sourceName: "Essence Gear Shop", rarityBonus: 0.12 }));
}

function getEquipmentBuyCost(item) {
  return Math.max(30, Math.round(35 + getEquipmentRarityRank(item.rarity || "Common") * 55 + (item.power || 0) * 0.75));
}

function getEquipmentSellValue(item) {
  return Math.max(2, Math.round(getEquipmentBuyCost(item) * 0.08));
}

function buyEquipmentOffer(classId, index) {
  const offers = getEquipmentShopOffers(classId);
  const item = offers[index];
  if (!item) return false;
  const cost = getEquipmentBuyCost(item);
  if (save.essence < cost) return false;
  save.essence -= cost;
  addInventoryItem(item);
  offers.splice(index, 1);
  playSound("shop");
  saveGame();
  return true;
}

function sellEquipmentItem(classId, instanceId) {
  const item = getInventoryItem(instanceId);
  if (!item || !canHeroEquipItem(classId, item)) return false;
  save.essence += getEquipmentSellValue(item);
  removeInventoryItem(instanceId);
  playSound("shop");
  saveGame();
  return true;
}

function restoreEquipmentInventoryScroll(scrollTop) {
  requestAnimationFrame(() => {
    const inventoryList = characterDetails.querySelector(".inventory-list");
    if (inventoryList) inventoryList.scrollTop = scrollTop;
  });
}

function sortEquipmentItems(items) {
  const slotOrder = EQUIPMENT_SLOTS.reduce((order, slot, index) => ({ ...order, [slot.id]: index }), {});
  return [...(items || [])].sort((a, b) =>
    (slotOrder[a.slot] ?? 99) - (slotOrder[b.slot] ?? 99) ||
    getRarityRank(b.rarity) - getRarityRank(a.rarity) ||
    (b.power || 0) - (a.power || 0) ||
    a.name.localeCompare(b.name)
  );
}

function getEquipmentSlotName(slotId) {
  return EQUIPMENT_SLOTS.find(slot => slot.id === slotId)?.name || "Equipment";
}

function formatEquipmentItemSummary(item) {
  const stats = Object.entries(item.stats || {});
  if (!stats.length) return item.description || "No stat bonus yet";
  return stats.map(([key, value]) => `${formatEquipmentStatName(key)} ${formatSignedEquipmentValue(key, value)}`).join(", ");
}

function formatEquipmentStatName(key) {
  return ({
    maxHp: "HP",
    damage: "Damage",
    armor: "Armor",
    attackSpeed: "Atk Spd",
    critChance: "Crit"
  })[key] || key.replace(/([A-Z])/g, " $1").replace(/^./, letter => letter.toUpperCase());
}

function formatSignedEquipmentValue(key, value) {
  const number = Number(value) || 0;
  if (key === "attackSpeed" || key.toLowerCase().includes("chance") || Math.abs(number) < 1) return `${number >= 0 ? "+" : ""}${formatDisplayPercent(Math.abs(number))}`;
  const rounded = Math.max(2, Math.round(Math.abs(number) / 2) * 2);
  return `${number >= 0 ? "+" : "-"}${rounded}`;
}

function renderSkinPicker(kind, ownerId, skins) {
  const preview = getPreviewSkin(kind, ownerId);
  const previewId = preview ? preview.id : null;
  return `<div class="skin-picker">${skins.map(skin => {
    const unlocked = isSkinUnlocked(skin);
    const purchased = isSkinPurchased(kind, ownerId, skin.id);
    const selected = kind === "hero" ? (save.skins.heroes[ownerId] || "base") === skin.id : (save.skins.enemies[ownerId] || "base") === skin.id;
    const cost = skin.unlock?.cost || 0;
    const status = !unlocked ? `Locked - ${getSkinUnlockText(skin)}` : purchased ? selected ? "Equipped" : "Unlocked" : `Unowned - ${cost} Essence`;
    return `<button class="skin-option ${selected ? "skin-option-equipped" : ""} ${previewId === skin.id ? "skin-option-selected" : ""}" data-skin-preview="${skin.id}"><strong>${escapeHtml(skin.name)}</strong><span>${escapeHtml(status)}</span></button>`;
  }).join("")}</div>${renderSkinAction(kind, ownerId, preview || skins.find(skin => skin.id === "base") || skins[0])}`;
}

function renderSkinAction(kind, ownerId, skin) {
  if (!skin) return "";
  const unlocked = isSkinUnlocked(skin);
  const purchased = isSkinPurchased(kind, ownerId, skin.id);
  const selected = kind === "hero" ? (save.skins.heroes[ownerId] || "base") === skin.id : (save.skins.enemies[ownerId] || "base") === skin.id;
  const cost = skin.unlock?.cost || 0;
  const disabled = !unlocked || (!purchased && save.essence < cost) || selected;
  const text = !unlocked ? `Locked: ${getSkinUnlockText(skin)}` : selected ? "Equipped" : purchased ? "Equip Previewed Skin" : `Buy & Equip - ${cost} Essence`;
  return `<div class="skin-action"><button data-skin-action="${skin.id}" ${disabled ? "disabled" : ""}>${escapeHtml(text)}</button></div>`;
}

function wireSkinPicker(kind, ownerId) {
  characterDetails.querySelectorAll("[data-skin-preview]").forEach(button => button.onclick = () => previewSkin(kind, ownerId, button.dataset.skinPreview));
  const action = characterDetails.querySelector("[data-skin-action]");
  if (action) action.onclick = () => equipSkin(kind, ownerId, action.dataset.skinAction);
}

function previewSkin(kind, ownerId, skinId) {
  const skin = kind === "hero" ? getHeroSkin(ownerId, skinId) : getEnemySkin(ownerId, skinId);
  if (!skin) return;
  const bucket = kind === "hero" ? "heroes" : "enemies";
  previewSkins[bucket][ownerId] = skinId;
  renderCharacterDetails();
}

function getPreviewSkin(kind, ownerId) {
  const bucket = kind === "hero" ? "heroes" : "enemies";
  const skinId = previewSkins[bucket][ownerId] || (kind === "hero" ? save.skins.heroes[ownerId] : save.skins.enemies[ownerId]) || "base";
  return kind === "hero" ? getHeroSkin(ownerId, skinId) : getEnemySkin(ownerId, skinId);
}

function getSpriteBackgroundStyle(baseSheet, kind, ownerId, skin) {
  const skinSheet = getSkinSpriteSheet(kind, ownerId, skin && skin.id, baseSheet);
  const images = [`url('${skinSheet || baseSheet}')`];
  return `background-image:${images.join(",")}`;
}

function getSpriteSheetPosition(unit) {
  const framePositions = ["0%", "20%", "40%", "60%", "80%", "100%"];
  let frame = 0;
  if (unit && (unit.spriteAnim?.type === "downed" || unit.hp <= 0)) frame = 5;
  else if (unit && (unit.hitFlash || 0) > 0) frame = 3;
  else if (unit && unit.spriteAnim?.type === "block") frame = 2;
  else if (unit && unit.spriteAnim?.type === "attack") frame = 1;
  return `${framePositions[frame]} center`;
}

function equipSkin(kind, ownerId, skinId) {
  const skin = kind === "hero" ? getHeroSkin(ownerId, skinId) : getEnemySkin(ownerId, skinId);
  if (!skin || !isSkinUnlocked(skin)) return;
  const purchased = isSkinPurchased(kind, ownerId, skinId);
  if (!purchased) {
    const cost = skin.unlock?.cost || 0;
    if (save.essence < cost) return;
    save.essence -= cost;
    if (!save.skinPurchases) save.skinPurchases = defaultSkinPurchases();
    const bucket = kind === "hero" ? "heroes" : "enemies";
    if (!save.skinPurchases[bucket][ownerId]) save.skinPurchases[bucket][ownerId] = { base: true };
    save.skinPurchases[bucket][ownerId][skinId] = true;
  }
  if (!save.skins) save.skins = defaultSkins();
  save.skins[kind === "hero" ? "heroes" : "enemies"][ownerId] = skinId;
  previewSkins[kind === "hero" ? "heroes" : "enemies"][ownerId] = skinId;
  saveGame();
  renderCharacterBrowser();
}

function getTraitIconMarkup(trait) {
  const kind = /health|armor|defense/i.test(trait) ? "shield" : /crit|bleed|fast|speed/i.test(trait) ? "dagger" : /magic|splash|burst/i.test(trait) ? "rune" : "charm";
  return getObjectIconMarkup(kind, "Common");
}

function renderBuildTest() {
  if (!run || !buildTestCategories) return;
  if (!run.buildTestSelections) run.buildTestSelections = { skills: {}, upgrades: {}, relics: {}, talents: {} };
  const openCategories = new Set([...buildTestCategories.querySelectorAll(".build-test-category[open]")].map(category => category.dataset.category));
  buildTestText.textContent = `${CLASSES[run.classId].name} build lab. Pick your loadout, then fight the Eternal Crown.`;
  buildTestSummary.innerHTML = renderBuildTestSummary();
  renderBuildTestStats();
  buildTestCategories.innerHTML = getBuildTestCategories().map(category => `
    <details class="build-test-category" data-category="${category.id}" ${openCategories.has(category.id) ? "open" : ""}>
      <summary><span>${category.name}</span><strong>${category.items.length}</strong></summary>
      <div class="build-test-item-list">
        ${category.items.map(item => renderBuildTestItem(category.id, item, category.single)).join("")}
      </div>
    </details>
  `).join("");
  buildTestCategories.querySelectorAll("[data-build-change]").forEach(button => {
    button.onclick = () => changeBuildTestCount(button.dataset.buildCategory, button.dataset.buildId, Number(button.dataset.buildChange));
  });
  buildTestCategories.querySelectorAll("[data-build-count]").forEach(input => {
    input.onchange = () => setBuildTestCount(input.dataset.buildCategory, input.dataset.buildId, input.value);
    input.oninput = () => setBuildTestCount(input.dataset.buildCategory, input.dataset.buildId, input.value, true);
  });
}

function renderBuildTestSummary() {
  const selections = run.buildTestSelections || {};
  const total = ["skills", "upgrades", "relics", "talents"].reduce((sum, key) => sum + Object.values(selections[key] || {}).reduce((inner, count) => inner + count, 0), 0);
  return `<div><small>Hero</small><strong>${escapeHtml(CLASSES[run.classId].name)}</strong></div><div><small>Selected</small><strong>${total}</strong></div><div><small>Test</small><strong>Eternal Crown</strong></div>`;
}

function renderBuildTestStats() {
  if (!buildTestStats || !run?.classId) return;
  const preview = getBuildTestPreviewHero();
  const stats = [
    ["HP", Math.ceil(preview.maxHp)],
    ["Damage", preview.damage.toFixed(1)],
    ["Atk Spd", getHeroAttackSpeed(preview).toFixed(2)],
    ["Armor", Math.round(preview.armor)],
    ["Crit", formatPercentCap(preview.crit, STAT_CAPS.crit)],
    ["Block", formatPercentCap(getHeroBlockChance(preview), STAT_CAPS.block)],
    ["Evasion", formatPercentCap(getHeroEvasionChance(preview), STAT_CAPS.evasion)],
    ["Regen", `${(preview.regen || 0).toFixed(1)}/s`],
    ["Life Steal", formatDisplayPercent(preview.lifeSteal || 0)],
    ["Luck", preview.luck || 0],
    ["Start Shield", Math.round((preview.runStartShield || 0) + getPermanentEffectTotal("battleStartShield", preview.id))],
    ["Skills", (preview.runAbilities || []).length]
  ];
  buildTestStats.innerHTML = stats.map(([label, value]) => `<div><small>${label}</small><strong>${value}</strong></div>`).join("");
}

function getBuildTestPreviewHero() {
  const originalHero = run.hero;
  const originalRelics = run.relics;
  const originalTalents = run.talents;
  const originalStageGrowthRelics = run.stageGrowthRelics;
  const originalRewardNames = run.rewardNames;
  const originalRewardCounts = run.rewardCounts;
  const originalRewardDescriptions = run.rewardDescriptions;
  const originalRewardRarities = run.rewardRarities;
  const originalGold = run.gold;
  const originalSummary = run.summary;
  const preview = buildHero(run.classId);
  run.hero = preview;
  run.relics = [];
  run.talents = [];
  run.stageGrowthRelics = [];
  run.rewardNames = [];
  run.rewardCounts = {};
  run.rewardDescriptions = {};
  run.rewardRarities = {};
  run.gold = 0;
  run.summary = { ...(originalSummary || {}), goldEarned: 0, relicsCollected: 0, talentsChosen: 0 };
  applyBuildTestSelections();
  run.hero = originalHero;
  run.relics = originalRelics;
  run.talents = originalTalents;
  run.stageGrowthRelics = originalStageGrowthRelics;
  run.rewardNames = originalRewardNames;
  run.rewardCounts = originalRewardCounts;
  run.rewardDescriptions = originalRewardDescriptions;
  run.rewardRarities = originalRewardRarities;
  run.gold = originalGold;
  run.summary = originalSummary;
  return preview;
}

function getBuildTestCategories() {
  const classId = run.classId;
  const skillIds = new Set(Object.keys(run.buildTestSelections.skills || {}).filter(id => run.buildTestSelections.skills[id] > 0));
  return [
    { id: "skills", name: "Skills", single: true, items: sortBuildTestItems(Object.values(RUN_ABILITIES).filter(ability => isRunAbilityUnlockedForClass(ability.id, classId)).map(ability => ({ id: ability.id, name: ability.name, description: ability.description, rarity: "Mythic", iconSource: ability }))) },
    { id: "upgrades", name: "Upgrades", items: sortBuildTestItems(getAvailablePoolItems({ type: "upgrades", classId, abilityIds: skillIds }).map(reward => ({ id: getBuildItemId("upgrade", reward.name), source: reward, name: reward.name, description: getItemDisplayText(reward), rarity: reward.rarity || "Common" }))) },
    { id: "relics", name: "Relics", items: sortBuildTestItems(getAvailablePoolItems({ type: "relics", classId, abilityIds: skillIds }).map(relic => ({ id: relic.id, source: relic, name: relic.name, description: getRelicDisplayDescription(relic), rarity: relic.rarity || "Common" }))) },
    { id: "talents", name: "Talents", single: true, items: sortBuildTestItems(getAvailablePoolItems({ type: "talents", classId }).map(talent => ({ id: talent.id, source: talent, name: talent.name, description: getTalentDisplayDescription(talent), rarity: getTalentPoolRarity(talent) }))) }
  ];
}

function sortBuildTestItems(items) {
  const rank = { Mythic: 5, Legendary: 4, Epic: 3, Rare: 2, Common: 1 };
  return [...items].sort((a, b) => (rank[b.rarity] || 0) - (rank[a.rarity] || 0) || a.name.localeCompare(b.name));
}

function renderBuildTestItem(categoryId, item, single = false) {
  const count = (run.buildTestSelections?.[categoryId]?.[item.id]) || 0;
  const max = getBuildTestItemMax(categoryId, single);
  const icon = item.iconSource ? getAbilityIconMarkup(item.iconSource) : item.source ? getItemIconMarkup(item.source) : "";
  return `<div class="build-test-item build-test-${String(item.rarity || "Common").toLowerCase()}">
    <div class="build-test-item-icon">${icon}</div>
    <div class="build-test-item-copy"><strong>${escapeHtml(item.name)}</strong><p>${escapeHtml(item.description || "")}</p></div>
    <div class="build-test-counter">
      <button data-build-category="${categoryId}" data-build-id="${escapeHtml(item.id)}" data-build-change="-1" ${count <= 0 ? "disabled" : ""}>-</button>
      <input data-build-category="${categoryId}" data-build-id="${escapeHtml(item.id)}" data-build-count="1" type="number" min="0" max="${max}" value="${count}" aria-label="${escapeHtml(item.name)} count">
      <button data-build-category="${categoryId}" data-build-id="${escapeHtml(item.id)}" data-build-change="1" ${count >= max ? "disabled" : ""}>+</button>
    </div>
  </div>`;
}

function getBuildTestItemMax(category, single = false) {
  if (single || category === "skills" || category === "talents") return 1;
  if (category === "upgrades" || category === "relics") return BUILD_TEST_STACK_LIMIT;
  return BUILD_TEST_STACK_LIMIT;
}

function getBuildItemId(kind, name) {
  return `${kind}_${String(name).toLowerCase().replace(/[^a-z0-9]+/g, "_")}`;
}

function changeBuildTestCount(category, id, delta) {
  const bucket = run.buildTestSelections?.[category];
  if (!bucket) return;
  const max = getBuildTestItemMax(category);
  bucket[id] = Math.max(0, Math.min(max, (bucket[id] || 0) + delta));
  if (bucket[id] <= 0) delete bucket[id];
  renderBuildTest();
}

function setBuildTestCount(category, id, value, editing = false) {
  const bucket = run.buildTestSelections?.[category];
  if (!bucket) return;
  const max = getBuildTestItemMax(category);
  const count = Math.max(0, Math.floor(Number(value) || 0));
  const next = Math.min(max, count);
  if (next > 0) bucket[id] = next;
  else delete bucket[id];
  if (!editing) renderBuildTest();
  else {
    buildTestSummary.innerHTML = renderBuildTestSummary();
    renderBuildTestStats();
  }
}

function startBuildTestFight() {
  if (!isBuildTestRun()) return;
  run.hero = buildHero(run.classId);
  run.rewardNames = []; run.rewardCounts = {}; run.rewardDescriptions = {}; run.rewardRarities = {};
  run.relics = []; run.talents = []; run.stageGrowthRelics = [];
  applyBuildTestSelections();
  run.stage = FINAL_BOSS_STAGE;
  run.currentNodeId = "build-test-crown";
  addAccountStat("runsStarted", 1);
  addAccountStat(`${run.classId}Runs`, 1);
  saveGame();
  log("Build Test begins. The Eternal Crown answers your build.");
  beginStage("BuildTest");
}

function applyBuildTestSelections() {
  const selections = run.buildTestSelections || {};
  Object.entries(selections.skills || {}).forEach(([id, count]) => {
    if (count > 0 && isRunAbilityUnlockedForClass(id, run.classId)) grantRunAbility(run.hero, id);
  });
  const upgrades = getBuildTestCategories().find(category => category.id === "upgrades")?.items || [];
  upgrades.forEach(item => {
    const count = selections.upgrades?.[item.id] || 0;
    for (let i = 0; i < count; i++) {
      applyRunItemToHero(item.source);
      addRunUpgradeName(item.source.name, getItemDisplayText(item.source), item.source.rarity || "Common");
    }
  });
  const relics = getBuildTestCategories().find(category => category.id === "relics")?.items || [];
  relics.forEach(item => {
    const count = selections.relics?.[item.id] || 0;
    for (let i = 0; i < count; i++) {
      const relic = { ...item.source, claimDescription: getRelicDisplayDescription(item.source) };
      run.relics.push(relic);
      applyRelicToRun(relic);
    }
  });
  (CLASS_TALENTS[run.classId] || []).forEach(talent => {
    if ((selections.talents?.[talent.id] || 0) > 0) {
      run.talents.push(talent);
      applyTalentToRun(talent);
    }
  });
  run.hero.hp = run.hero.maxHp;
}

function getRunStageLabel() {
  if (!run) return "Stage 1";
  if (isGauntletRun()) return run.gauntlet?.challengeRank ? `Rank Challenge #${run.gauntlet.challengeRank}` : "Unranked Duel";
  if (isBuildTestRun()) return "Build Test";
  if (isEndlessRun()) return `Endless Stage ${run.stage}`;
  if (run.stage === FINAL_BOSS_STAGE) return "Final Boss";
  const layer = Math.max(1, Math.ceil(run.stage / MAP_LAYER_SIZE));
  const stageInLayer = ((run.stage - 1) % MAP_LAYER_SIZE) + 1;
  const theme = getRunThemeForStage();
  return `Layer ${layer}: ${theme?.name || "Area"} ${stageInLayer} / ${MAP_LAYER_SIZE}`;
}

function showRewards() {
  showScreen("rewardScreen");
  rewardSubtitle.textContent = `${getRunStageLabel()} cleared. Choose one run upgrade.`;
  renderChoiceHeroStats(rewardHeroStats);
  run.rewardChoices = getRewardChoices(); run.rewardRerollsRemaining = getRunRerollLimit(); renderRewards();
}

function renderRewards() {
  const rerolls = getChoiceRerollsRemaining("reward");
  rewardRerollButton.disabled = rerolls <= 0;
  rewardRerollButton.textContent = `Reroll Rewards (${rerolls})`;
  rewardCards.innerHTML = (run.rewardChoices || []).map((reward, index) => `<div class="card choice-card reward-card reward-${reward.rarity.toLowerCase()}" data-index="${index}" role="button" tabindex="0"><div class="choice-icon">${reward.abilityId ? getAbilityIconMarkup(RUN_ABILITIES[reward.abilityId]) : getItemIconMarkup(reward)}</div><h3>${reward.name}</h3><p>${getItemDisplayText(reward)}</p><p class="subtle">${reward.rarity} upgrade</p><button type="button">Choose</button></div>`).join("");
  rewardCards.querySelectorAll("[data-index]").forEach(card => {
    card.onclick = () => claimRewardChoice(Number(card.dataset.index));
    card.onkeydown = event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        claimRewardChoice(Number(card.dataset.index));
      }
    };
  });
}

function claimRewardChoice(index) {
  if (!run?.hero || run.rewardClaiming) return;
  const reward = run.rewardChoices?.[index];
  if (!reward || typeof reward.apply !== "function") return;
  run.rewardClaiming = true;
  rewardCards.querySelectorAll("button").forEach(button => button.disabled = true);
  try {
    const text = getItemDisplayText(reward);
    applyRunItemToHero(reward);
    addRunUpgradeName(reward.name, text, reward.rarity);
    addAccountStat("rewardsClaimed", 1);
    saveGame();
    run.rewardClaiming = false;
    continueAfterRunChoice();
  } catch (error) {
    console.error("Failed to claim reward.", error);
    run.rewardClaiming = false;
    rewardCards.querySelectorAll("button").forEach(button => button.disabled = false);
  }
}

function rerollRewards() {
  if (!spendChoiceReroll("reward")) return;
  run.rewardChoices = getRewardChoices(); renderRewards();
}

function getRewardChoices() {
  const classId = run?.hero?.id || "";
  const eligible = getAvailablePoolItems({ type: "upgrades", classId, includeAbilities: true });
  const classRewards = eligible.filter(reward => reward.classId === classId);
  const first = classRewards.length ? getWeightedChoices(classRewards, 1) : [];
  const chosenKeys = new Set(first.map(getChoiceItemKey));
  return [...first, ...getWeightedChoices(eligible.filter(reward => !chosenKeys.has(getChoiceItemKey(reward))), 3 - first.length, chosenKeys)];
}

function isRewardUnlocked(reward) {
  const classId = run?.hero?.id || "";
  const abilities = new Set(run?.hero?.runAbilities || []);
  if (reward.abilityId) return isRunAbilityUnlockedForClass(reward.abilityId, classId) && !abilities.has(reward.abilityId);
  return isAbilityLockedItemAvailable(reward, classId, abilities);
}

function isAbilityLockedItemAvailable(item, classId, abilityIds = new Set(run?.hero?.runAbilities || [])) {
  if (item.classId && item.classId !== classId) return false;
  if (item.requiresNode && !hasPermanentNode(item.requiresNode)) return false;
  if (item.requiresAbility && !isRunAbilityActiveForClass(item.requiresAbility, classId, abilityIds)) return false;
  if (item.requiresAnyAbility && !item.requiresAnyAbility.some(id => isRunAbilityActiveForClass(id, classId, abilityIds))) return false;
  return true;
}

function isRunAbilityActiveForClass(abilityId, classId, abilityIds = new Set(run?.hero?.runAbilities || [])) {
  return abilityIds.has(abilityId) && isRunAbilityUnlockedForClass(abilityId, classId);
}

function isRunAbilityUnlockedForClass(abilityId, classId) {
  const ability = RUN_ABILITIES[abilityId];
  if (!ability || ability.classId !== classId) return false;
  const unlock = getRunAbilityUnlockReward(abilityId);
  return !unlock?.requiresNode || hasPermanentNode(unlock.requiresNode);
}

function getRunAbilityUnlockReward(abilityId) {
  return REWARDS.find(reward => reward.abilityId === abilityId);
}

function grantRunAbility(hero, abilityId) {
  const ability = RUN_ABILITIES[abilityId];
  if (!ability) return;
  hero.runAbilities = hero.runAbilities || [];
  if (!hero.runAbilities.includes(abilityId)) hero.runAbilities.push(abilityId);
  if (battle) battle.abilityCooldowns[abilityId] = getAbilityOpeningCooldown(ability);
  log(`${ability.name} ability unlocked for this run.`);
}

function showRelicRewards(message) {
  const choices = getRelicChoices();
  if (!choices.length) return continueAfterRelicChoice();
  showScreen("relicScreen"); relicSubtitle.textContent = message || `Relic earned on ${getRunStageLabel()}. Choose one relic for this run.`;
  renderChoiceHeroStats(relicHeroStats); run.relicChoices = choices; run.relicRerollsRemaining = getRunRerollLimit(); renderRelicRewards();
}

function renderRelicRewards() {
  const rerolls = getChoiceRerollsRemaining("relic");
  relicRerollButton.disabled = rerolls <= 0;
  relicRerollButton.textContent = `Reroll Relics (${rerolls})`;
  relicCards.innerHTML = (run.relicChoices || []).map((relic, index) => `<div class="card choice-card relic-card relic-${relic.rarity.toLowerCase()}" data-index="${index}"><div class="choice-icon">${getItemIconMarkup(relic)}</div><h3>${relic.name}</h3><p>${getRelicDisplayDescription(relic)}</p><p class="subtle">${relic.rarity} Relic</p><button>Claim Relic</button></div>`).join("");
  relicCards.querySelectorAll("[data-index]").forEach(card => card.querySelector("button").onclick = () => claimRelic(run.relicChoices[Number(card.dataset.index)]));
}

function rerollRelics() {
  if (!spendChoiceReroll("relic")) return;
  run.relicChoices = getRelicChoices(); renderRelicRewards();
}

function getRunRerollLimit() {
  return Math.max(0, Math.floor(getPermanentEffectTotal("rerolls", run?.classId) || 0));
}

function getChoiceRerollsRemaining(kind) {
  return Math.max(0, Math.floor(Number(run?.[`${kind}RerollsRemaining`]) || 0));
}

function spendChoiceReroll(kind) {
  const key = `${kind}RerollsRemaining`;
  if (!run || getChoiceRerollsRemaining(kind) <= 0) return false;
  run[key] -= 1;
  return true;
}

function getRelicChoices() { return getWeightedChoices(getAvailablePoolItems({ type: "relics" }), 3); }

function isRelicAvailable(relic) {
  return isAbilityLockedItemAvailable(relic, run?.hero?.id || "");
}

function getWeightedChoices(items, count, existingKeys = new Set()) {
  const pool = items.filter(item => getRarityWeight(item.rarity || "Common") > 0), choices = [];
  const chosenKeys = new Set(existingKeys);
  while (pool.length && choices.length < count) {
    const total = pool.reduce((sum, item) => sum + getRarityWeight(item.rarity || "Common"), 0);
    if (total <= 0) break;
    let roll = Math.random() * total;
    const index = pool.findIndex(item => (roll -= getRarityWeight(item.rarity || "Common")) <= 0);
    const [choice] = pool.splice(Math.max(0, index), 1);
    const key = getChoiceItemKey(choice);
    if (chosenKeys.has(key)) continue;
    chosenKeys.add(key);
    choices.push(choice);
    for (let i = pool.length - 1; i >= 0; i--) {
      if (getChoiceItemKey(pool[i]) === key) pool.splice(i, 1);
    }
  }
  return choices;
}

function getChoiceItemKey(item = {}) {
  return String(item.poolId || item.id || item.name || "").toLowerCase();
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function getStageGrowthValue(stat, value) {
  if (stat === "attackSpeed") return Math.round(value * 1000) / 1000;
  if (stat === "armor") return Math.max(1, Math.round(value));
  return Math.max(1, Math.round(value));
}

function getRarityWeight(rarity) {
  const progress = run ? Math.min(1, run.stage / run.maxStage) : 0, luck = Math.max(0, run?.hero?.luck || 0);
  if (!isRarityAllowedByLuck(rarity, luck)) return 0;
  return Math.max(0.1, ({ Common: 72 - progress * 24 - luck * 1.35, Rare: 18 + progress * 8 + luck * .6, Epic: 2.5 + progress * 5 + luck * .25, Legendary: .15 + progress * .8 + luck * .05, Mythic: .25 + progress * 1.3 + luck * .096 })[rarity] || 70);
}

function escapeHtml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function getItemIconMarkup(item) {
  return getObjectIconMarkup(getItemIconKind(item), item.rarity || "Common");
}

function getObjectIconMarkup(kind, rarity) {
  return `<span class="item-object-icon item-object-${kind} item-object-${String(rarity || "Common").toLowerCase()}"><i></i></span>`;
}

function getItemIconKind(item = {}) {
  const text = `${item.name || ""} ${item.text || ""} ${item.description || ""} ${item.effect?.stat || ""} ${item.effect?.type || ""}`.toLowerCase();
  if (/shield|aegis|ward|armor|plate|jerkin|bastion|guard|block|emblem|seal/.test(text)) return "shield";
  if (/potion|flask|draught|tonic|chalice|heart|ration|bread|supper|health|hp|regen|vitality|apothecary/.test(text)) return "potion";
  if (/coin|gold|purse|merchant|contract|insurance|chart/.test(text)) return "coin";
  if (/rune|magic|spell|curse|ice|lightning|arcane|mana|storm|frost|inferno|meteor|ember|phoenix/.test(text)) return "rune";
  if (/dagger|shiv|bleed|poison|trap|oil|assassin|death|fang|quickstep|evasion/.test(text)) return "dagger";
  if (/luck|fate|dice|charm|crown|star|oracle|clover/.test(text)) return "charm";
  if (/speed|tempo|rhythm|spur|buckle|gear|haste|clockwork|reflex/.test(text)) return "boots";
  return "sword";
}

function getItemDisplayText(item) { return item.effects ? formatItemEffects(item.effects) : item.text || item.description || ""; }
function getTalentDisplayDescription(talent) {
  const effectText = talent.effects?.length ? formatItemEffects(talent.effects) : "";
  return [talent.description || "", effectText ? `Stats: ${effectText}.` : ""].filter(Boolean).join(" ");
}
function applyRunItemToHero(item) {
  if (item.effects) return applyItemEffects(run.hero, item.effects);
  if (typeof item.apply === "function") return item.apply(run.hero);
}
function getRelicDisplayDescription(relic) {
  if (relic.claimDescription) return relic.claimDescription;
  if (relic.effects) return formatItemEffects(relic.effects);
  return relic.description || "";
}
function getUpgradeTooltip(name) { return run?.rewardDescriptions?.[name] || getItemDisplayText(REWARDS.find(r => r.name === name) || SHOP_ITEMS.find(i => i.name === name) || {}); }

function claimRelic(relic) {
  const claimed = { ...relic, claimDescription: getRelicDisplayDescription(relic) };
  run.relics.push(claimed); if (run.summary) run.summary.relicsCollected += 1;
  addAccountStat("relicsClaimed", 1); applyRelicToRun(claimed); playSound("relic"); log(`Claimed relic: ${claimed.name}.`); saveGame(); updateRunHud(); continueAfterRelicChoice();
}

function continueAfterRelicChoice() {
  const action = run.afterRelicAction; run.afterRelicAction = null;
  if (action === "reward") return showRewards();
  return continueAfterRunChoice();
}

function continueAfterRunChoice() {
  if (shouldOfferClassTalent()) return showTalentChoices();
  if (run.afterRewardAction === "completeRun") { run.afterRewardAction = null; return endRun(true); }
  if (run.afterRewardAction === "finalBoss") { run.afterRewardAction = null; recordLayer3VictoryBeforeEternalCrown(); return beginFinalBoss(); }
  if (isEndlessRun()) return beginNextEndlessStage();
  showMap();
}

function beginNextEndlessStage() {
  run.stage += 1;
  save.highestClear = Math.max(save.highestClear, run.stagesCleared);
  saveGame();
  beginStage(getEndlessNodeType(run.stage));
}

function beginFinalBoss() {
  run.stage = FINAL_BOSS_STAGE; run.currentNodeId = "final-boss"; run.chosenNodeIds.push("final-boss"); run.availableNodeIds = [];
  log("The final gate opens. The Eternal Crown descends."); beginStage("FinalBoss");
}

function shouldOfferClassTalent() {
  const talentStages = Array.isArray(window.CLASS_TALENT_STAGES) ? window.CLASS_TALENT_STAGES : (typeof CLASS_TALENT_STAGES !== "undefined" ? CLASS_TALENT_STAGES : []);
  return talentStages.includes(run.stage) && getTalentChoices().length > 0;
}
function showTalentChoices() {
  const choices = getTalentChoices(); if (!choices.length) return continueAfterClassTalent();
  showScreen("talentScreen"); talentSubtitle.textContent = `${getRunStageLabel()}. Strengthen your ${CLASSES[run.classId].name} for this run.`;
  talentCards.innerHTML = choices.map((talent, index) => `<div class="card choice-card talent-card" data-index="${index}"><div class="choice-icon">${getItemIconMarkup(talent)}</div><h3>${talent.name}</h3><p>${getTalentDisplayDescription(talent)}</p><p class="subtle">Tier ${talent.tier} Talent</p><button>Choose Talent</button></div>`).join("");
  talentCards.querySelectorAll("[data-index]").forEach(card => card.querySelector("button").onclick = () => claimTalent(choices[Number(card.dataset.index)]));
}
function getTalentChoices() { const owned = new Set(run.talents.map(t => t.id)); return shuffle(getAvailablePoolItems({ type: "talents", classId: run.classId, excludeOwnedTalentIds: owned })).slice(0, 3); }
function claimTalent(talent) { run.talents.push(talent); if (run.summary) run.summary.talentsChosen += 1; applyTalentToRun(talent); log(`Learned talent: ${talent.name}.`); updateRunHud(); continueAfterClassTalent(); }
function continueAfterClassTalent() {
  if (run.afterRewardAction === "completeRun") { run.afterRewardAction = null; return endRun(true); }
  if (run.afterRewardAction === "finalBoss") { run.afterRewardAction = null; recordLayer3VictoryBeforeEternalCrown(); return beginFinalBoss(); }
  return isEndlessRun() ? beginNextEndlessStage() : showMap();
}
function applyTalentToRun(talent) {
  applyItemEffects(run.hero, talent.effects || []);
}

function applyRelicToRun(relic) {
  applyItemEffects(run.hero, relic.effects || []);
}

function showShop() {
  showScreen("shopScreen"); const surcharge = (run.shopsVisited || 0) * 50;
  shopSubtitle.textContent = `${getRunStageLabel()} merchant. Buy any upgrades you can afford, or continue.${surcharge ? ` Items cost +${surcharge} gold from prior shops.` : ""}`;
  run.shopItems = getShopChoices(surcharge); run.shopsVisited = (run.shopsVisited || 0) + 1; run.shopRerollsRemaining = getRunRerollLimit(); addAccountStat("shopsVisited", 1); saveGame(); renderShop();
}
function renderShop() {
  shopGold.textContent = Math.floor(run.gold); renderChoiceHeroStats(shopHeroStats);
  const rerolls = getChoiceRerollsRemaining("shop");
  shopRerollButton.disabled = rerolls <= 0; shopRerollButton.textContent = `Reroll Shop (${rerolls})`;
  shopCards.innerHTML = run.shopItems.map((item, index) => `<div class="card choice-card shop-card shop-${(item.rarity || "Common").toLowerCase()}" data-index="${index}"><div class="choice-icon">${getItemIconMarkup(item)}</div><h3>${item.name}</h3><p>${getItemDisplayText(item)}</p><p class="subtle">${item.rarity || "Common"}</p><button ${item.bought || run.gold < item.cost ? "disabled" : ""}>${item.bought ? "Bought" : `Buy - ${item.cost}g`}</button></div>`).join("");
  shopCards.querySelectorAll("[data-index]").forEach(card => card.querySelector("button").onclick = () => buyShopItem(run.shopItems[Number(card.dataset.index)]));
}
function getShopChoices(surcharge) { return getWeightedChoices(SHOP_ITEMS.filter(item => isAbilityLockedItemAvailable(item, run?.hero?.id || "")), 3).map(item => ({ ...item, cost: item.cost + surcharge, bought: false })); }
function rerollShop() { if (!spendChoiceReroll("shop")) return; run.shopItems = getShopChoices(Math.max(0, (run.shopsVisited - 1) * 50)); renderShop(); }
function buyShopItem(item) { if (item.bought || run.gold < item.cost) return; run.gold -= item.cost; const text = getItemDisplayText(item); applyRunItemToHero(item); item.bought = true; playSound("shop"); addRunUpgradeName(item.name, text, item.rarity || "Common"); renderShop(); updateRunHud(); }
function leaveShop() { showMap(); }

function renderChoiceHeroStats(target) {
  if (!target || !run?.hero) return; const hero = run.hero;
  target.innerHTML = [["HP", `${Math.ceil(hero.hp)}/${Math.ceil(hero.maxHp)}`], ["Damage", hero.damage.toFixed(1)], ["Atk Spd", getHeroAttackSpeed(hero).toFixed(2)], ["Armor", hero.armor], ["Life Steal", `${Math.round((hero.lifeSteal || 0) * 100)}%`], ["Crit", formatPercentCap(hero.crit, STAT_CAPS.crit)], ["Luck", hero.luck || 0], ["Gold", Math.floor(run.gold)]].map(([l, v]) => `<div class="tooltip-item" data-tooltip="${escapeHtml(getTermTooltip(l))}"><small>${l}</small><strong>${v}</strong></div>`).join("");
}

function addRunUpgradeName(name, description, rarity = "Common") {
  run.rewardCounts = run.rewardCounts || {}; run.rewardNames = run.rewardNames || []; run.rewardDescriptions = run.rewardDescriptions || {}; run.rewardRarities = run.rewardRarities || {};
  if (!run.rewardCounts[name]) run.rewardNames.push(name); run.rewardCounts[name] = (run.rewardCounts[name] || 0) + 1; if (description) run.rewardDescriptions[name] = description; run.rewardRarities[name] = rarity;
}
function getRunUpgradeStacks() { return (run.rewardNames || []).map(name => ({ name, count: run.rewardCounts?.[name] || 1, rarity: run.rewardRarities?.[name] || (REWARDS.find(r => r.name === name) || SHOP_ITEMS.find(i => i.name === name) || {}).rarity || "Common", source: REWARDS.find(r => r.name === name) || SHOP_ITEMS.find(i => i.name === name) || { name } })); }

function renderMapLegend() {
  mapLegend.innerHTML = ["Heal", "Merchant", "Treasure", "Battle", "Elite", "Boss"].filter(type => MAP_TYPES[type] && (type !== "Treasure" || hasPermanentUnlock("unlock_events"))).map(type => `<div class="legend-item"><div class="legend-icon ${MAP_TYPES[type].className}">${MAP_TYPES[type].icon}</div><div><strong>${MAP_TYPES[type].label}</strong><br><span class="subtle">${MAP_TYPES[type].description}</span></div></div>`).join("");
}

function renderRoguelikeMap() {
  mapBoard.innerHTML = "";
  const visibleLayer = getVisibleMapLayer(), firstStage = ((visibleLayer - 1) * MAP_LAYER_SIZE) + 1, lastStage = visibleLayer * MAP_LAYER_SIZE;
  run.map.filter(row => row[0].stage >= firstStage && row[0].stage <= lastStage).reverse().forEach(row => {
    const rowEl = document.createElement("div"); rowEl.className = "map-row"; rowEl.innerHTML = `<div class="map-node-stage"><strong>Stage ${row[0].stage}</strong></div>`;
    getMapRowSlots(row).forEach(node => {
      if (!node) { const spacer = document.createElement("div"); spacer.className = "map-node-spacer"; rowEl.appendChild(spacer); return; }
      const type = MAP_TYPES[node.type], available = run.availableNodeIds.includes(node.id), chosen = run.chosenNodeIds.includes(node.id);
      const el = document.createElement(available ? "button" : "div"); el.className = `${available ? "map-node-button map-node-current" : "map-node-static"} ${type.className} ${chosen ? "map-node-chosen" : ""}`; el.dataset.nodeId = node.id; el.dataset.targets = node.connectsTo.join(",");
      el.innerHTML = `<span class="map-node-icon">${type.icon}</span><span class="map-node-tooltip"><strong>${getMapNodePreviewTitle(node)}</strong><small>${getMapNodePreviewDescription(node)}</small></span>`;
      if (available) el.onclick = () => handleMapChoice(node); rowEl.appendChild(el);
    }); mapBoard.appendChild(rowEl);
  });
  requestAnimationFrame(drawMapConnections);
}
function getMapNodePreviewTitle(node) { return node.type === "Elite" ? "Elite Combat" : node.type === "Boss" ? "Boss Combat" : node.type === "Battle" ? "Combat" : node.type === "Treasure" ? "Treasure Event" : MAP_TYPES[node.type].label; }
function getMapNodePreviewDescription(node) { return node.type === "Elite" ? "Elite fight: 35 base gold, +20% Essence, and a relic reward." : node.type === "Treasure" ? "Gain 35 + 3 per stage gold; 35% relic chance plus Luck." : `${MAP_TYPES[node.type].description}.`; }
function getVisibleMapLayer() { return Math.max(1, Math.ceil(Math.min(run.maxStage, run.stage + 1) / MAP_LAYER_SIZE)); }
function getMapRowSlots(row) { if (row.length === 1) return [null, row[0], null]; if (row.length === 2) return [row[0], null, row[1]]; return row.slice(0, 3); }
function drawMapConnections() {
  if (!run || !mapBoard || !mapConnections) return; const boardRect = mapBoard.getBoundingClientRect(), panelRect = mapConnections.parentElement.getBoundingClientRect();
  mapConnections.style.left = boardRect.left - panelRect.left + "px"; mapConnections.style.top = boardRect.top - panelRect.top + "px"; mapConnections.style.width = boardRect.width + "px"; mapConnections.style.height = boardRect.height + "px"; mapConnections.setAttribute("viewBox", `0 0 ${boardRect.width} ${boardRect.height}`); mapConnections.innerHTML = "";
}

function updateRunHud(force = false) {
  if (!run?.hero) return;
  const hero = run.hero;
  const now = performance.now();
  if (!force && battle && battle.state === "fighting" && now - lastHudRenderAt < 100) return;
  lastHudRenderAt = now;
  if (runGoldLabel) runGoldLabel.textContent = isGauntletRun() ? "Coins" : "Gold";
  if (runEssenceLabel) runEssenceLabel.textContent = isGauntletRun() ? "Points" : "Essence";
  runDifficulty.textContent = DIFFICULTIES[run.difficultyId].name;
  runClass.textContent = CLASSES[run.classId].name;
  runStage.textContent = getRunStageLabel();
  runGold.textContent = isGauntletRun() ? Math.floor(save.gauntlet?.coins || 0) : Math.floor(run.gold);
  runEssence.textContent = isGauntletRun() ? Math.floor(save.gauntlet?.points || 0) : Math.floor(run.essenceEarned);
  if (battleSpeedSelect) battleSpeedSelect.value = String(getBattleSpeedPreference());
  if (!isHudTooltipHovered()) {
    heroStats.innerHTML = [["HP", `${Math.max(0, Math.ceil(hero.hp))}/${Math.ceil(hero.maxHp)}`], ["Armor", hero.armor], ["Damage", hero.damage.toFixed(1)], ["Atk Spd", getHeroAttackSpeed(hero).toFixed(2)], ["Shield", `${Math.ceil(hero.shield || 0)}/${getHeroShieldCap()}`], ["Crit", formatPercentCap(hero.crit, STAT_CAPS.crit)], ["Regen", `${(hero.regen || 0).toFixed(1)}/s`], ["Luck", hero.luck || 0]].map(([l, v]) => statCell(l, v, getTermTooltip(l))).join("");
    heroStats.className = "hero-stat-grid"; renderHeroFullStats(hero);
    const upgrades = sortRunUpgrades(getRunUpgradeStacks()), relics = sortRunRelics(getRunRelicStacks()), talents = sortRunTalents(run.talents);
    heroUpgrades.innerHTML = `<div class="loadout-list-title">Upgrades</div>` + (upgrades.length ? upgrades.map(upgrade => `<div class="pill upgrade-pill upgrade-${upgrade.rarity.toLowerCase()} tooltip-item" data-tooltip="${escapeHtml(getUpgradeTooltip(upgrade.name))}">${getItemIconMarkup(upgrade.source)}<span>${escapeHtml(upgrade.name)}</span>${upgrade.count > 1 ? `<strong>${upgrade.count}x</strong>` : ""}</div>`).join("") : `<div class="pill">No run upgrades yet</div>`);
    heroRelics.innerHTML = `<div class="relic-list-title">Relics</div>` + (relics.length ? relics.map(relic => `<div class="relic-pill relic-${relic.rarity.toLowerCase()} tooltip-item" data-tooltip="${escapeHtml(getRelicDisplayDescription(relic.source))}">${getItemIconMarkup(relic.source)}<strong>${escapeHtml(relic.name)}</strong>${relic.count > 1 ? `<span class="relic-stack-count">${relic.count}x</span>` : ""}</div>`).join("") : `<div class="pill">No relics yet</div>`);
    heroTalents.innerHTML = `<div class="talent-list-title">Class Talents</div>` + (talents.length ? talents.map(talent => `<div class="talent-pill tooltip-item" data-tooltip="${escapeHtml(getTalentDisplayDescription(talent))}">${getItemIconMarkup(talent)}<strong>${escapeHtml(talent.name)}</strong></div>`).join("") : `<div class="pill">No class talents yet</div>`);
  }
  renderEnemyStats();
  updateBuildTestFightHud();
  renderActiveSkills(); renderSpecialSkills();
}

function isHudTooltipHovered() {
  return !!document.querySelector("#heroStats .tooltip-item:hover, #heroFullStats .tooltip-item:hover, #heroUpgrades .tooltip-item:hover, #heroRelics .tooltip-item:hover, #heroTalents .tooltip-item:hover");
}

function sortRunUpgrades(upgrades) {
  return [...(upgrades || [])].sort((a, b) => getRarityRank(b.rarity) - getRarityRank(a.rarity) || b.count - a.count || a.name.localeCompare(b.name));
}

function sortRunRelics(relics) {
  return [...(relics || [])].sort((a, b) => getRarityRank(b.rarity) - getRarityRank(a.rarity) || (b.count || 1) - (a.count || 1) || a.name.localeCompare(b.name));
}

function getRunRelicStacks() {
  const stacks = new Map();
  (run?.relics || []).forEach(relic => {
    const key = relic.id || relic.name;
    const current = stacks.get(key);
    if (current) current.count += 1;
    else stacks.set(key, { ...relic, source: relic, count: 1 });
  });
  return [...stacks.values()];
}

function sortRunTalents(talents) {
  return [...(talents || [])].sort((a, b) => (b.tier || 0) - (a.tier || 0) || a.name.localeCompare(b.name));
}

function getRarityRank(rarity) {
  return RARITY_SORT_RANK[rarity] || 0;
}

function updateBuildTestFightHud() {
  if (!buildTestFightHud) return;
  const visible = !!battle && isBuildTestRun();
  buildTestFightHud.style.display = visible ? "" : "none";
  if (!visible) return;
  buildTestDamageCounter.textContent = Math.round(battle.damageDone || 0).toLocaleString();
  buildTestTimer.textContent = formatBattleTimer(battle.elapsed || 0);
  buildTestPauseButton.textContent = battle.paused ? "Resume" : "Pause";
}

function formatBattleTimer(seconds) {
  const total = Math.max(0, Math.floor(seconds || 0));
  const minutes = Math.floor(total / 60);
  return `${minutes}:${String(total % 60).padStart(2, "0")}`;
}
function renderHeroFullStats(hero) {
  const executeThreshold = getHeroExecuteThreshold(hero);
  const executeDamage = getPermanentEffectTotal("executeDamage", hero.id) + (hero.runExecuteDamage || 0);
  const rows = [
    ["Block", formatPercentCap(getHeroBlockChance(hero), STAT_CAPS.block)],
    ["Evasion", formatPercentCap(getHeroEvasionChance(hero), STAT_CAPS.evasion)],
    ["Execute", `${formatDisplayPercent(executeDamage)} <${formatDisplayPercent(executeThreshold)}`],
    ["Crit Damage", formatDisplayPercent((hero.runCritDamage || 0) + getPermanentEffectTotal("critDamage", hero.id))],
    ["Atk Bonus", formatPercentCap(hero.battleAttackSpeedBonus || 0, getHeroBattleAttackSpeedBonusCap(hero))],
    ["Dmg Bonus", formatPercentCap(hero.battleDamageBonus || 0, STAT_CAPS.battleDamageBonus)],
    ["Life Steal", formatDisplayPercent(hero.lifeSteal || 0)],
    ["Start Shield", `${Math.round((hero.runStartShield || 0) + getPermanentEffectTotal("battleStartShield", hero.id))}`],
    ["Shield Cap", `${getHeroShieldCap()}`]
  ];
  if (hero.id === "rogue") {
    rows.push(["Bleed", `${formatDisplayPercent(getHeroBleedMaxHpPercent(hero))} max HP/s (${Math.round(getHeroBleedDamage(hero))}/s)`]);
    if ((hero.runAbilities || []).includes("rogue_poison") || hero.runPoisonAbilityDamage) rows.push(["Poison", `${Math.round(getRoguePoisonAbilityDamage(hero))}/s`]);
  }
  const burnPercent = getHeroBurnMaxHpPercent(hero);
  const burnParts = [];
  if (hero.id === "wizard") burnParts.push(`${formatDisplayPercent(getWizardBurnChance(hero))} chance`);
  if (hero.runBurnDamage) burnParts.push(`+${Math.round(hero.runBurnDamage)} dmg/s`);
  if (burnPercent) burnParts.push(`${formatDisplayPercent(burnPercent)} max HP/s`);
  if ((hero.runAbilities || []).includes("rogue_burn") && !burnParts.length) burnParts.push("Special stacks");
  if (burnParts.length) {
    rows.push(["Burn", burnParts.join(", ")]);
  }
  if (hero.id === "wizard") rows.push(["Splash Damage", formatDisplayPercent(getHeroSplashDamageMultiplier(hero))]);
  heroFullStats.innerHTML = rows.map(([l, v]) => {
    const scrollClass = l === "Bleed" ? " full-stat-row-scroll" : "";
    const value = l === "Bleed" ? `<span class="full-stat-scroll-text">${escapeHtml(v)}</span>` : escapeHtml(v);
    return `<div class="tooltip-item${scrollClass}" data-tooltip="${escapeHtml(getTermTooltip(l))}"><span>${escapeHtml(l)}</span><strong>${value}</strong></div>`;
  }).join("");
}
function formatDisplayPercent(value) {
  const percent = Math.abs(Number(value) || 0) * 100;
  if (!percent) return "0%";
  const rounded = Math.max(2, Math.round(percent / 2) * 2);
  return `${value < 0 ? "-" : ""}${rounded}%`;
}
function formatPercentCap(value, cap) { return `${formatDisplayPercent(Math.min(value || 0, cap))}/${formatDisplayPercent(cap)}`; }
const STAT_CAPS = { crit: 1, block: 0.85, evasion: 0.45, battleDamageBonus: 0.4 };
const RARITY_SORT_RANK = { Mythic: 6, Legendary: 5, Epic: 4, Rare: 3, Uncommon: 2, Common: 1 };
function getHeroEvasionChance(hero) { return Math.min(STAT_CAPS.evasion, getPermanentEffectTotal("evasion", hero.id) + (hero.runEvasion || 0)); }
function getHeroBattleAttackSpeedBonusCap(hero) { return getPermanentEffectTotal("killAttackSpeedMax", hero.id) || 0.35; }
function getHeroSplashDamageMultiplier(hero) { return 0.25 + getPermanentEffectTotal("splashDamageMultiplier", hero.id) + (hero.runSplashDamageMultiplier || 0); }
function renderEnemyStats() { const enemies = battle?.enemies || []; enemyStats.innerHTML = enemies.length ? enemies.map(e => `<div class="enemy-stat-row"><strong>${escapeHtml(e.name)}</strong><div class="enemy-status">${e.hp > 0 ? "ALIVE" : "DEAD"}</div><div class="enemy-stat-chips"><span>HP ${e.buildTestBoss ? "Infinite" : `${Math.max(0, Math.ceil(e.hp))}/${Math.ceil(e.maxHp)}`}</span><span>DMG ${Number(e.damage).toFixed(1)}</span><span>AS ${getEnemyAttackSpeed(e).toFixed(2)}</span><span>ARM ${e.armor}</span><span>AP ${e.armorPiercing || 0}</span></div></div>`).join("") : `<div class="enemy-stat-empty">No active enemies</div>`; }
function statCell(label, value, tooltip) { return `<div class="tooltip-item" data-tooltip="${escapeHtml(tooltip)}"><small>${label}</small><strong>${value}</strong></div>`; }
function getTermTooltip(term) { return ({ Damage: "How much health an attack removes before armor.", Armor: "Reduces incoming hit damage.", "Armor Piercing": "Ignores this much hero armor when this enemy attacks, down to zero armor.", "Atk Spd": "How many attacks happen each second.", "Attack speed": "How many attacks happen each second.", Crit: "Chance for an attack to deal critical damage.", "Crit chance": "Chance for an attack to deal critical damage.", Shield: "Temporary protection that absorbs damage before health.", Health: "Current and maximum HP.", Luck: "Improves reward, relic, and shop rolls.", Gold: "Currency used during this run at merchants.", Essence: "Currency used between runs to buy permanent upgrades and unlocks.", Block: "Chance to reduce incoming hit damage.", Evasion: "Chance to avoid enemy attacks.", Execute: "Bonus damage against enemies below the listed health threshold.", "Crit Damage": "Extra critical-hit damage from talents, relics, and upgrades.", "Atk Bonus": "Temporary attack speed gained during this battle.", "Dmg Bonus": "Temporary damage gained during this battle.", "Shield Cap": "Maximum shield this hero can hold.", "Life Steal": "Heals for part of the damage you deal.", "Start Shield": "Shield gained at battle start.", Bleed: "Rogue bleed damage per second based on the Rogue's maximum HP. One bleed can be active on each enemy.", Poison: "Damage per second from rogue poison effects.", Burn: "Damage per second from burn effects. New burns stack their damage on an existing burn.", "Splash Damage": "Damage dealt to secondary targets when wizard splash magic triggers." })[term] || "A combat stat or effect."; }
function renderActiveSkills() { activeSkills.innerHTML = battle ? Object.entries(battle.activeSkills || {}).map(([name, time]) => `<div class="active-skill"><b>*</b><strong>${escapeHtml(name)}</strong><span>${time.toFixed(1)}s</span></div>`).join("") : ""; }
function renderSpecialSkills() { const ids = run?.hero?.runAbilities || []; specialSkills.innerHTML = ids.length ? `<div class="special-skill-title">Special Skills</div><div class="special-skill-row">${ids.map(id => `<div class="special-skill"><b>${getAbilityIconMarkup(RUN_ABILITIES[id])}</b><strong>${RUN_ABILITIES[id].name}</strong><span>${Math.max(0, battle?.abilityCooldowns?.[id] || 0).toFixed(1)}s</span></div>`).join("")}</div>` : `<div class="special-skill-empty">No special skills unlocked</div>`; }
function getAbilityIconMarkup(ability) { return `<span class="ability-icon ability-icon-${ability.id}" style="--ability-color:${ability.color}">${ability.icon}</span>`; }

function getSkillSpriteSheet(abilityId, hero = run?.hero) {
  const config = SKILL_SPRITE_SHEETS?.[abilityId];
  if (!config) return "";
  const skinId = hero?.skinId || "base";
  return (config.skins && config.skins[skinId]) || config.base || "";
}

function renderBattle() {
  battlefield.querySelectorAll(".unit,.float-text,.battle-particle,.skill-vfx,.boss-intro-overlay,.battle-result-panel").forEach(node => node.remove());
  if (!battle || !run) return;
  battlefield.appendChild(createUnitEl(run.hero, true)); battle.enemies.filter(e => e.hp > 0 || (e.deathTimer || 0) > 0).forEach(e => battlefield.appendChild(createUnitEl(e, false)));
  battlefield.classList.toggle("boss-intro-shake", battle.bossIntroTimer > 0 && !save.settings.reduceAnimations && !save.settings.disableShake);
  if (battle.bossIntroTimer > 0) renderBossIntro(); if (battle.state === "result") renderBattleResultPanel();
  renderBattleParticles();
  const floats = isBuildTestRun() ? battle.floatingTexts.slice(-24) : battle.floatingTexts;
  floats.forEach(float => { const div = document.createElement("div"), scale = getBattleScale(); div.className = `float-text ${float.variant ? `float-text-${float.variant}` : ""}`; div.style.left = float.x * scale.x + "px"; div.style.top = float.y * scale.y + "px"; div.style.color = float.color; div.textContent = float.text; battlefield.appendChild(div); }); battle.floatingTexts = [];
}
function renderBattleParticles() {
  const scale = getBattleScale();
  const particles = isBuildTestRun() ? (battle.particles || []).slice(-48) : (battle.particles || []);
  particles.forEach(particle => {
    const progress = Math.min(1, particle.age / Math.max(.01, particle.life));
    if (particle.type === "skill") {
      const div = document.createElement("div");
      div.className = `skill-vfx skill-vfx-${particle.theme || "global"}${particle.sprite ? " skill-vfx-sprite" : ""}`;
      div.style.left = particle.x * scale.x + "px";
      div.style.top = (particle.y * scale.y - progress * 28) + "px";
      div.style.setProperty("--skill-color", particle.color || "#ffe2a2");
      div.style.opacity = Math.max(0, 1 - progress).toString();
      div.style.animation = "none";
      div.style.transform = `translate(-50%, -50%) scale(${.65 + progress * .7})`;
      div.innerHTML = particle.sprite
        ? `<img src="${escapeHtml(particle.sprite)}" alt=""><span>${escapeHtml(particle.label || "")}</span>`
        : `<span>${escapeHtml(particle.label || "")}</span>`;
      battlefield.appendChild(div);
      return;
    }
    const div = document.createElement("div");
    div.className = "battle-particle";
    div.style.left = ((particle.x + (particle.vx || 0) * particle.age) * scale.x) + "px";
    div.style.top = ((particle.y + (particle.vy || 0) * particle.age) * scale.y) + "px";
    div.style.background = particle.color || "#ffe2a2";
    div.style.opacity = Math.max(0, 1 - progress).toString();
    battlefield.appendChild(div);
  });
}
function renderBossIntro() { const boss = battle.enemies.find(e => e.boss); if (!boss) return; const progress = 1 - battle.bossIntroTimer / Math.max(.1, battle.bossIntroDuration || battle.bossIntroTimer), opacity = progress < .18 ? progress / .18 : progress > .72 ? Math.max(0, (1 - progress) / .28) : 1; const overlay = document.createElement("div"); overlay.className = `boss-intro-overlay${boss.finalBoss ? " boss-intro-final" : ""}`; overlay.style.opacity = opacity; overlay.style.setProperty("--intro-progress", progress); overlay.innerHTML = `<div class="boss-intro-tint"></div><div class="boss-intro-name"><small>${boss.finalBoss ? "THE CROWN AWAKENS" : "BOSS"}</small><h2>${escapeHtml(boss.name.toUpperCase())}</h2><strong>${boss.finalBoss ? "The Last Encounter" : "Final Encounter"}</strong></div>`; battlefield.appendChild(overlay); }
function renderBattleResultPanel() { const r = battle.result, panel = document.createElement("div"); panel.className = `battle-result-panel${r.victory ? "" : " battle-result-defeat"}`; const finalCrown = battle.nodeType === "FinalBoss" || isFinalBossStage(run.stage), drop = r.equipmentDrop, gauntlet = isGauntletRun(), gauntletPoints = Math.floor(run.gauntlet?.earnedPoints || 0), autosold = !!r.equipmentAutosold; panel.innerHTML = `<div class="battle-result-kicker">${r.victory ? "Enemies Defeated" : finalCrown ? "The Crown Awakens" : "Hero Defeated"}</div><h2>${r.title}</h2><div class="battle-result-gains"><div><small>${gauntlet ? gauntletPoints < 0 ? "Points Lost" : "Points Gained" : "Gold Gained"}</small><strong>${gauntlet ? `${gauntletPoints >= 0 ? "+" : ""}${gauntletPoints}` : `+${Math.floor(r.gold)}`}</strong></div><div><small>${gauntlet ? "Coins Gained" : "Essence Gained"}</small><strong>+${Math.floor(gauntlet ? run.gauntlet?.earnedCoins || 0 : r.essence)}</strong></div>${drop ? `<div class="battle-equipment-drop equipment-rarity-${String(drop.rarity || "Common").toLowerCase()}"><small>${autosold ? "Equipment Autosold" : "Equipment Found"}</small><strong>${escapeHtml(drop.rarity)} ${escapeHtml(drop.name)}</strong><span>${autosold ? `+${Math.floor(r.equipmentAutosellValue || 0)} Essence` : escapeHtml(formatEquipmentItemSummary(drop))}</span></div>` : ""}</div><button onclick="continueBattleResult()">${r.nextLabel}</button>`; battlefield.appendChild(panel); }
function getBattleScale() {
  const x = battlefield.clientWidth / 900;
  const y = battlefield.clientHeight / 430;
  const minUnitScale = battlefield.clientWidth <= 650 ? .46 : .58;
  return { x, y, unit: Math.max(minUnitScale, Math.min(x, y)) };
}
function createUnitEl(unit, isHero) { const el = document.createElement("div"), scale = getBattleScale(), size = (unit.finalBoss ? 156 : unit.boss ? 135.2 : unit.miniBoss ? 101.2 : isHero ? 92.4 : 85.8) * scale.unit; el.className = `unit ${isHero ? "player " + unit.colorClass : `enemy ${unit.className} ${unit.skinClass || ""}`}`; if (unit.spriteAnim?.type === "attack" || unit.spriteAnim?.type === "block") el.classList.add("attack-flash"); if ((unit.hitFlash || 0) > 0) el.classList.add("hit-flash"); if (unit.spriteAnim?.type === "downed" || (unit.hp <= 0 && !isHero)) el.classList.add("unit-downed"); el.style.left = unit.x * scale.x + "px"; el.style.top = unit.y * scale.y + "px"; el.style.width = size + "px"; el.style.height = size + "px"; const hp = Math.max(0, Math.min(100, unit.hp / unit.maxHp * 100)), attackSpeed = isHero ? getHeroAttackSpeed(unit) : getEnemyAttackSpeed(unit), attackWindow = 1 / Math.max(.01, attackSpeed), attackProgress = Math.max(0, Math.min(100, (1 - Math.max(0, unit.attackCooldown || 0) / attackWindow) * 100)), hpText = unit.buildTestBoss ? "Infinite" : `${Math.ceil(Math.max(0, unit.hp))}/${Math.ceil(unit.maxHp)}`; el.innerHTML = `<div class="attackbar"><div class="attackfill" style="width:${attackProgress}%"></div><span class="attacktext">${attackSpeed.toFixed(2)}/s</span></div><div class="hpbar"><div class="hpfill" style="width:${hp}%"></div><span class="hptext">${hpText}</span></div><div class="sprite"></div>`; const baseSheet = isHero ? SPRITE_SHEETS.heroes[unit.id] : getEnemySpriteSheet(unit); const skin = isHero ? getHeroSkin(unit.id, unit.skinId || "base") : getEnemySkin(unit.id, unit.skinId || "base"); if (baseSheet) { el.classList.add("sprite-sheet-unit"); const sprite = el.querySelector(".sprite"); sprite.style.cssText = `${getSpriteBackgroundStyle(baseSheet, isHero ? "hero" : "enemy", unit.id, skin)};background-size:600% 100%;background-position:${getSpriteSheetPosition(unit)};`; } return el; }
function spawnHeroAttackEffect(hero, enemy) { if (hero.id === "wizard") { playSound("magicCast"); spawnAbilityProjectile(hero, enemy, "magic"); return; } spawnSlashEffect(enemy, hero.id === "rogue" ? "rogue" : "sword"); }
function spawnSlashEffect(target, type) { if (!battlefield || save.settings.reduceAnimations || !canSpawnBuildTestEffect(".attack-vfx")) return; const scale = getBattleScale(), slash = document.createElement("div"); slash.className = `attack-vfx ${type}-slash-vfx`; slash.style.left = target.x * scale.x + "px"; slash.style.top = target.y * scale.y + "px"; battlefield.appendChild(slash); setTimeout(() => slash.remove(), isBuildTestRun() ? 150 : 460); }
function spawnAbilityProjectile(source, target, type = "magic") {
  if (!battlefield || save.settings.reduceAnimations || !source || !target || !canSpawnBuildTestEffect(".battle-projectile")) return;
  const scale = getBattleScale(), projectile = document.createElement("div");
  projectile.className = `battle-projectile battle-projectile-${type}`;
  projectile.style.left = source.x * scale.x + "px";
  projectile.style.top = source.y * scale.y + "px";
  battlefield.appendChild(projectile);
  const frames = [
    { left: source.x * scale.x + "px", top: source.y * scale.y + "px", opacity: .35, transform: "translate(-50%, -50%) scale(.72)" },
    { left: target.x * scale.x + "px", top: target.y * scale.y + "px", opacity: 1, transform: "translate(-50%, -50%) scale(1.05)" }
  ];
  const duration = isBuildTestRun() ? 120 : 230;
  projectile.animate(frames, { duration, easing: "cubic-bezier(.2,.85,.2,1)", fill: "forwards" });
  setTimeout(() => { projectile.remove(); spawnAbilityIndicator(target, type); }, duration + 10);
}
function spawnAbilityIndicator(target, type = "magic") {
  if (!battlefield || save.settings.reduceAnimations || !target || !canSpawnBuildTestEffect(".ability-vfx")) return;
  const scale = getBattleScale(), indicator = document.createElement("div");
  indicator.className = `ability-vfx ability-vfx-${type}`;
  indicator.style.left = target.x * scale.x + "px";
  indicator.style.top = target.y * scale.y + "px";
  indicator.style.setProperty("--ability-scale", scale.unit);
  battlefield.appendChild(indicator);
  setTimeout(() => indicator.remove(), isBuildTestRun() ? 170 : 520);
}
function spawnBossSlashEffect(target) { spawnSlashEffect(target, "boss"); }
function spawnShieldImpactEffect(target) {
  if (!battlefield || save.settings.reduceAnimations || !target || !canSpawnBuildTestEffect(".battle-impact")) return;
  const scale = getBattleScale(), impact = document.createElement("div");
  impact.className = "battle-impact battle-impact-shield";
  impact.style.left = target.x * scale.x + "px";
  impact.style.top = target.y * scale.y + "px";
  impact.style.setProperty("--impact-scale", scale.unit);
  battlefield.appendChild(impact);
  setTimeout(() => impact.remove(), isBuildTestRun() ? 150 : 420);
}
function markUnitHit(unit) { if (unit) unit.hitFlash = .16; }
function spawnDeathParticles(unit) {
  if (!battle || save.settings.reduceAnimations || !unit) return;
  if (isBuildTestRun() && battle.particles.length >= 48) return;
  const color = unit.boss ? "#fcd34d" : unit.miniBoss ? "#fca5a5" : "#e7d6b5";
  const count = isBuildTestRun() ? 6 : (unit.boss ? 18 : 10);
  for (let i = 0; i < count; i++) {
    const angle = Math.PI * 2 * (i / count);
    const speed = unit.boss ? 72 : 48;
    battle.particles.push({ x: unit.x, y: unit.y - 4, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, color, age: 0, life: .45 + Math.random() * .24 });
  }
}
function triggerScreenShake(strength) { if (save.settings.disableShake || save.settings.reduceAnimations || !battlefield) return; battlefield.classList.remove("screen-shake-light", "screen-shake-heavy"); void battlefield.offsetWidth; battlefield.classList.add(strength === "heavy" ? "screen-shake-heavy" : "screen-shake-light"); setTimeout(() => battlefield.classList.remove("screen-shake-light", "screen-shake-heavy"), 260); }
function canSpawnBuildTestEffect(selector) {
  if (!isBuildTestRun() || !battlefield) return true;
  return battlefield.querySelectorAll(selector).length < (BUILD_TEST_EFFECT_LIMITS[selector] || 10);
}
function setBattleLogVisible(visible) {
  const panel = battleLog?.closest(".panel");
  if (panel) panel.style.display = visible ? "" : "none";
  if (!visible && battleLog) battleLog.innerHTML = "";
}
function log(message, type = "info") { if (isBuildTestRun()) return; const line = document.createElement("div"); line.className = `log-line log-${type}`; line.innerHTML = `<span>${type[0] || "i"}</span><p>${escapeHtml(message)}</p>`; battleLog.appendChild(line); battleLog.scrollTop = battleLog.scrollHeight; }

function renderTree() {
  if (!treeCards) return;
  const visibleNodes = getVisibleTreeNodes();
  if (!visibleNodes.some(node => node.id === selectedTreeNodeId)) selectedTreeNodeId = TREE_TAB_ROOTS[selectedTreeTab] || "crown_legacy";
  treeEssence.textContent = Math.floor(save.essence);
  renderTreeTabs();
  treeCards.innerHTML = createTreeMenuHtml(visibleNodes);
  bindTreeNodeButtons();
  renderTreeDetails(TREE[selectedTreeNodeId] || TREE.crown_legacy);
  applyTreeCamera();
  refreshTopbar();
}
function getVisibleTreeNodes() {
  return TREE_NODES.filter(node => node.classId === selectedTreeTab);
}
function setTreeTab(tab) {
  selectedTreeTab = TREE_TAB_ROOTS[tab] ? tab : "global";
  selectedTreeNodeId = TREE_TAB_ROOTS[selectedTreeTab];
  renderTree();
  requestAnimationFrame(resetTreeView);
}
function renderTreeTabs() {
  if (!treeTabs) return;
  treeTabs.querySelectorAll("[data-tree-tab]").forEach(button => button.classList.toggle("tree-tab-active", button.dataset.treeTab === selectedTreeTab));
}
function createTreeLinesSvg(nodes = TREE_NODES) {
  const edges = getTreeConnectionEdges(nodes);
  const lines = edges.map(edge => {
    const complete = getTreeLevel(edge.parent.id) > 0 && getTreeLevel(edge.node.id) > 0;
    const available = getTreeLevel(edge.parent.id) > 0 && getTreeLevel(edge.node.id) <= 0;
    return `<path class="skill-tree-line ${complete ? "skill-tree-line-complete" : available ? "skill-tree-line-available" : ""}" d="${getTreeConnectionPath(edge)}" />`;
  });
  return `<svg class="skill-tree-lines" viewBox="0 0 3200 2660" aria-hidden="true">${lines.join("")}</svg>`;
}
function getTreeConnectionEdges(nodes = TREE_NODES) {
  const visibleIds = new Set(nodes.map(node => node.id));
  const childrenByParent = new Map();
  nodes.forEach(node => (node.prerequisites || []).forEach(prereqId => {
    if (!visibleIds.has(prereqId)) return;
    if (!childrenByParent.has(prereqId)) childrenByParent.set(prereqId, []);
    childrenByParent.get(prereqId).push(node);
  }));
  childrenByParent.forEach((children, parentId) => {
    const parent = TREE[parentId] || { x: 0, y: 0 };
    children.sort((a, b) => Math.atan2(a.y - parent.y, a.x - parent.x) - Math.atan2(b.y - parent.y, b.x - parent.x));
  });
  return nodes.flatMap(node => (node.prerequisites || []).map(prereqId => {
    if (!visibleIds.has(prereqId)) return null;
    const parent = TREE[prereqId];
    if (!parent) return null;
    const siblings = childrenByParent.get(prereqId) || [node];
    return { parent, node, siblingIndex: siblings.indexOf(node), siblingCount: siblings.length };
  }).filter(Boolean));
}
function getTreeConnectionPath({ parent, node, siblingIndex, siblingCount }) {
  const { p0, p1, p2, p3 } = getTreeConnectionControls({ parent, node, siblingIndex, siblingCount });
  return `M ${p0.x} ${p0.y} C ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}, ${p3.x} ${p3.y}`;
}
function createTreeMenuHtml(nodes) {
  const branches = new Map();
  getTreeNodesInDependencyOrder(nodes).forEach(node => {
    if (!branches.has(node.branch)) branches.set(node.branch, []);
    branches.get(node.branch).push(node);
  });
  return [...branches.entries()].map(([branch, branchNodes]) => `
    <section class="skill-menu-section">
      <h3>${escapeHtml(branch)}</h3>
      <div class="skill-menu-list">
        ${branchNodes.map(createTreeMenuItemHtml).join("")}
      </div>
    </section>
  `).join("");
}
function createTreeMenuItemHtml(node) {
  const level = getTreeLevel(node.id), locked = isTreeNodeLocked(node), maxed = level >= node.maxLevel, cost = getTreeUpgradeCost(node, level), available = !locked && !maxed && save.essence >= cost;
  const status = locked ? "Locked" : maxed ? "Completed" : available ? "Ready" : `${cost} Essence`;
  return `<button class="skill-menu-item skill-menu-${node.type} skill-menu-${node.classId} ${locked ? "skill-menu-locked" : ""} ${maxed ? "skill-menu-complete" : ""} ${available ? "skill-menu-available" : ""} ${selectedTreeNodeId === node.id ? "skill-menu-selected" : ""}" data-node="${node.id}">
    <span class="skill-menu-icon">${getTreeNodeInitials(node)}</span>
    <span class="skill-menu-copy"><strong>${escapeHtml(node.name)}</strong><small>${escapeHtml(node.description)}</small></span>
    <span class="skill-menu-meta"><b>${level}/${node.maxLevel}</b><em>${escapeHtml(status)}</em></span>
  </button>`;
}
function bindTreeNodeButtons() {
  treeCards.querySelectorAll("[data-node]").forEach(button => {
    button.onclick = () => {
      selectedTreeNodeId = button.dataset.node;
      renderTree();
    };
  });
}
function renderTreeDetails(node) {
  const level = getTreeLevel(node.id);
  const cost = getTreeUpgradeCost(node, level);
  const locked = isTreeNodeLocked(node);
  const maxed = level >= node.maxLevel;
  const prereqs = (node.prerequisites || []).map(id => TREE[id]?.name).filter(Boolean);
  treeDetails.innerHTML = `<div class="tree-detail-kicker">${node.branch}</div><h3>${node.name}</h3><p>${node.description}</p><div class="tree-detail-row"><span>Level</span><strong>${level}/${node.maxLevel}</strong></div><div class="tree-detail-row"><span>Cost</span><strong>${maxed ? "Maxed" : `${cost} Essence`}</strong></div>${prereqs.length ? `<div class="tree-detail-prereqs"><strong>Requires</strong><br>${prereqs.map(escapeHtml).join(", ")}</div>` : ""}<button ${locked || maxed || save.essence < cost ? "disabled" : ""}>${locked ? "Locked" : maxed ? "Completed" : "Purchase"}</button>`;
  treeDetails.querySelector("button").onclick = () => purchaseTreeNode(node.id);
}
function getTreeUpgradeCost(node, level) {
  if (node.costs) return node.costs[Math.min(level, node.costs.length - 1)];
  if (node.type === "ability") return node.cost;
  const multiplier = node.classId === "global" ? GLOBAL_TREE_COST_MULTIPLIER : 1;
  const growth = node.classId === "global" ? GLOBAL_TREE_COST_GROWTH : TREE_COST_GROWTH;
  return Math.ceil((node.cost * multiplier * Math.pow(growth, level)) / 10) * 10;
}
function isTreeNodeLocked(node) { return node.prerequisites.some(id => getTreeLevel(id) <= 0); }
function getTreeNodeInitials(node) { return node.name.split(/\s+/).map(word => word[0]).join("").slice(0, 2).toUpperCase(); }
function purchaseTreeNode(id) { const node = TREE[id], level = getTreeLevel(id), cost = getTreeUpgradeCost(node, level); if (isTreeNodeLocked(node) || level >= node.maxLevel || save.essence < cost) return; save.essence -= cost; save.tree[id] = level + 1; selectedTreeNodeId = id; saveGame(); renderTree(); }
function getTreeNodesInDependencyOrder(nodes) {
  const byId = new Map(nodes.map(node => [node.id, node]));
  const ordered = [];
  const visited = new Set();

  function visit(node) {
    if (!node || visited.has(node.id)) return;
    (node.prerequisites || []).forEach(id => {
      if (byId.has(id)) visit(byId.get(id));
    });
    visited.add(node.id);
    ordered.push(node);
  }

  nodes.forEach(visit);
  return ordered;
}
function resetTreeView() {
  if (!treeViewport || !treeCards) return;
  const selectedItem = treeCards.querySelector(`[data-node="${selectedTreeNodeId}"]`);
  treeViewport.scrollTo({ top: selectedItem ? Math.max(0, selectedItem.offsetTop - 18) : 0, behavior: "smooth" });
  applyTreeCamera();
}
function setupTreeCameraControls() {
  requestAnimationFrame(resetTreeView);
}
function endTreeDrag(event) {
  treePointers.delete(event.pointerId);
  if (treePointers.size < 2) treePinch = null;
  if (treePointer && treePointer.id === event.pointerId) {
    const next = treePointers.entries().next().value;
    treePointer = next ? { id: next[0], x: next[1].x, y: next[1].y, cameraX: treeCamera.x, cameraY: treeCamera.y } : null;
  }
  treeViewport.classList.remove("tree-viewport-dragging");
}
function startTreePinch() {
  const points = [...treePointers.values()].slice(0, 2);
  treePinch = {
    distance: getTreePointerDistance(points),
    zoom: treeCamera.zoom,
    midpoint: getTreePointerMidpoint(points),
    cameraX: treeCamera.x,
    cameraY: treeCamera.y
  };
}
function updateTreePinch() {
  const points = [...treePointers.values()].slice(0, 2);
  const distance = getTreePointerDistance(points);
  if (!treePinch || distance <= 0) return;
  const midpoint = getTreePointerMidpoint(points);
  const factor = distance / Math.max(1, treePinch.distance);
  const beforeZoom = treeCamera.zoom;
  treeCamera.zoom = Math.max(0.32, Math.min(1.25, treePinch.zoom * factor));
  const rect = treeViewport.getBoundingClientRect();
  const worldX = (treePinch.midpoint.x - rect.left - treePinch.cameraX) / treePinch.zoom;
  const worldY = (treePinch.midpoint.y - rect.top - treePinch.cameraY) / treePinch.zoom;
  treeCamera.x = midpoint.x - rect.left - worldX * treeCamera.zoom;
  treeCamera.y = midpoint.y - rect.top - worldY * treeCamera.zoom;
  if (beforeZoom !== treeCamera.zoom) applyTreeCamera();
}
function getTreePointerDistance(points) {
  return Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
}
function getTreePointerMidpoint(points) {
  return { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 };
}
function zoomTreeAt(clientX, clientY, factor) {
  const rect = treeViewport.getBoundingClientRect();
  const beforeX = (clientX - rect.left - treeCamera.x) / treeCamera.zoom;
  const beforeY = (clientY - rect.top - treeCamera.y) / treeCamera.zoom;
  treeCamera.zoom = Math.max(0.32, Math.min(1.25, treeCamera.zoom * factor));
  treeCamera.x = clientX - rect.left - beforeX * treeCamera.zoom;
  treeCamera.y = clientY - rect.top - beforeY * treeCamera.zoom;
}
function applyTreeCamera() {
  if (!treeCards) return;
  treeCards.style.transform = "";
}
function clampTreeCamera() {}
function validateSkillTreeLines() {
  const missing = TREE_NODES.flatMap(node => (node.prerequisites || []).filter(id => !TREE[id]).map(id => `${node.id} -> ${id}`));
  if (missing.length) console.warn("Skill tree has missing prerequisites:", missing);
  const nodeOverlaps = getSkillTreeNodeOverlaps();
  const lineNodeHits = getSkillTreeLineNodeIntersections();
  const lineCrossings = getSkillTreeLineIntersections();
  if (nodeOverlaps.length) console.warn("Skill tree has overlapping nodes:", nodeOverlaps);
  if (lineNodeHits.length) console.warn("Skill tree lines intersect nodes:", lineNodeHits);
  if (lineCrossings.length) console.warn("Skill tree lines intersect each other:", lineCrossings);
  return { missing, nodeOverlaps, lineNodeHits, lineCrossings, valid: !missing.length && !nodeOverlaps.length && !lineNodeHits.length && !lineCrossings.length };
}
function getSkillTreeNodeOverlaps() {
  const overlaps = [];
  for (let i = 0; i < TREE_NODES.length; i += 1) {
    for (let j = i + 1; j < TREE_NODES.length; j += 1) {
      const a = TREE_NODES[i], b = TREE_NODES[j];
      const minDistance = getSkillTreeNodeRadius(a) + getSkillTreeNodeRadius(b) + 18;
      if (Math.hypot(a.x - b.x, a.y - b.y) < minDistance) overlaps.push(`${a.id} <-> ${b.id}`);
    }
  }
  return overlaps;
}
function getSkillTreeLineNodeIntersections() {
  return getSampledTreeEdges().flatMap(edge => {
    return TREE_NODES.filter(node => node.id !== edge.parent.id && node.id !== edge.node.id).filter(node => {
      return edge.segments.some(segment => getPointSegmentDistance(node, segment.a, segment.b) < getSkillTreeNodeRadius(node) + 9);
    }).map(node => `${edge.parent.id} -> ${edge.node.id} crosses ${node.id}`);
  });
}
function getSkillTreeLineIntersections() {
  const edges = getSampledTreeEdges(), hits = [];
  for (let i = 0; i < edges.length; i += 1) {
    for (let j = i + 1; j < edges.length; j += 1) {
      const a = edges[i], b = edges[j];
      if (treeEdgesShareEndpoint(a, b)) continue;
      if (a.segments.some(segmentA => b.segments.some(segmentB => segmentsIntersect(segmentA.a, segmentA.b, segmentB.a, segmentB.b)))) {
        hits.push(`${a.parent.id} -> ${a.node.id} crosses ${b.parent.id} -> ${b.node.id}`);
      }
    }
  }
  return hits;
}
function getSampledTreeEdges() {
  return getTreeConnectionEdges().map(edge => {
    const points = sampleTreeConnection(edge, 18);
    return { ...edge, segments: points.slice(1).map((point, index) => ({ a: points[index], b: point })) };
  });
}
function sampleTreeConnection(edge, steps) {
  const controls = getTreeConnectionControls(edge);
  return Array.from({ length: steps + 1 }, (_, index) => getCubicPoint(controls, index / steps));
}
function getTreeConnectionControls({ parent, node, siblingIndex, siblingCount }) {
  const dx = node.x - parent.x, dy = node.y - parent.y;
  const length = Math.max(1, Math.hypot(dx, dy));
  const nx = -dy / length, ny = dx / length;
  const spread = siblingCount > 1 ? (siblingIndex - (siblingCount - 1) / 2) * 28 : 0;
  const bend = Math.max(-64, Math.min(64, spread));
  return {
    p0: { x: parent.x, y: parent.y },
    p1: { x: parent.x + dx * 0.36 + nx * bend, y: parent.y + dy * 0.36 + ny * bend },
    p2: { x: parent.x + dx * 0.64 + nx * bend, y: parent.y + dy * 0.64 + ny * bend },
    p3: { x: node.x, y: node.y }
  };
}
function getCubicPoint({ p0, p1, p2, p3 }, t) {
  const a = (1 - t) ** 3, b = 3 * (1 - t) ** 2 * t, c = 3 * (1 - t) * t ** 2, d = t ** 3;
  return { x: a * p0.x + b * p1.x + c * p2.x + d * p3.x, y: a * p0.y + b * p1.y + c * p2.y + d * p3.y };
}
function getSkillTreeNodeRadius(node) {
  if (node.type === "ability") return 52;
  if (node.type === "center") return 43;
  if (node.type === "capstone") return 41;
  if (node.type === "unlock") return 38;
  if (node.type === "class") return 37;
  if (node.type === "notable") return 34;
  return 31;
}
function getPointSegmentDistance(point, a, b) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const lengthSq = dx * dx + dy * dy;
  const t = lengthSq ? Math.max(0, Math.min(1, ((point.x - a.x) * dx + (point.y - a.y) * dy) / lengthSq)) : 0;
  return Math.hypot(point.x - (a.x + dx * t), point.y - (a.y + dy * t));
}
function treeEdgesShareEndpoint(a, b) {
  return a.parent.id === b.parent.id || a.parent.id === b.node.id || a.node.id === b.parent.id || a.node.id === b.node.id;
}
function segmentsIntersect(a, b, c, d) {
  const o1 = segmentOrientation(a, b, c), o2 = segmentOrientation(a, b, d), o3 = segmentOrientation(c, d, a), o4 = segmentOrientation(c, d, b);
  return o1 * o2 < 0 && o3 * o4 < 0;
}
function segmentOrientation(a, b, c) {
  return Math.sign((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x));
}
