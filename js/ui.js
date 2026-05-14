const $ = id => document.getElementById(id);
const essenceTop = $("essenceTop"), highestClearTop = $("highestClearTop"), accountStatsGrid = $("accountStatsGrid"), achievementGrid = $("achievementGrid");
const characterList = $("characterList"), characterDetails = $("characterDetails"), heroCharacterTab = $("heroCharacterTab"), enemyCharacterTab = $("enemyCharacterTab");
const difficultyCards = $("difficultyCards"), classCards = $("classCards"), battleScreen = $("battleScreen"), runDifficulty = $("runDifficulty"), runClass = $("runClass"), runStage = $("runStage"), runGold = $("runGold"), runEssence = $("runEssence"), battleSpeedSelect = $("battleSpeedSelect");
const battlefield = $("battlefield"), heroStats = $("heroStats"), heroFullStats = $("heroFullStats"), enemyStats = $("enemyStats"), activeSkills = $("activeSkills"), specialSkills = $("specialSkills"), heroUpgrades = $("heroUpgrades"), heroRelics = $("heroRelics"), heroTalents = $("heroTalents"), battleLog = $("battleLog");
const rewardSubtitle = $("rewardSubtitle"), rewardHeroStats = $("rewardHeroStats"), rewardCards = $("rewardCards"), rewardRerollButton = $("rewardRerollButton"), relicSubtitle = $("relicSubtitle"), relicHeroStats = $("relicHeroStats"), relicCards = $("relicCards"), relicRerollButton = $("relicRerollButton");
const talentSubtitle = $("talentSubtitle"), talentCards = $("talentCards"), mapScreen = $("mapScreen"), mapSubtitle = $("mapSubtitle"), mapConnections = $("mapConnections"), mapBoard = $("mapBoard"), mapLegend = $("mapLegend");
const shopSubtitle = $("shopSubtitle"), shopGold = $("shopGold"), shopHeroStats = $("shopHeroStats"), shopCards = $("shopCards"), shopRerollButton = $("shopRerollButton"), runEndTitle = $("runEndTitle"), runEndText = $("runEndText");
const upgradeScreen = $("upgradeScreen"), treeCards = $("treeCards"), treeViewport = $("treeViewport"), treeDetails = $("treeDetails"), treeEssence = $("treeEssence");
const battleSpeedSetting = $("battleSpeedSetting"), disableShakeSetting = $("disableShakeSetting"), reduceAnimationsSetting = $("reduceAnimationsSetting"), soundSetting = $("soundSetting"), musicVolumeSetting = $("musicVolumeSetting"), sfxVolumeSetting = $("sfxVolumeSetting"), damageNumbersSetting = $("damageNumbersSetting"), tooltipsSetting = $("tooltipsSetting"), fullscreenHint = $("fullscreenHint"), settingsMainMenuButton = $("settingsMainMenuButton");

let settingsReturnScreen = "menuScreen";
let selectedTreeNodeId = "crown_legacy";
let treeCamera = { x: 0, y: 0, zoom: 0.75 };
let treePointer = null;
let treePointers = new Map();
let treePinch = null;
let treeHasInitialCenter = false;
let characterBrowserTab = "heroes";
let selectedCharacterId = "knight";

function refreshTopbar() {
  essenceTop.textContent = Math.floor(save.essence);
  highestClearTop.textContent = "Stage " + save.highestClear;
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(screen => screen.classList.remove("active"));
  $(id).classList.add("active");
  if (id === "upgradeScreen") {
    renderTree();
    if (!treeHasInitialCenter) requestAnimationFrame(() => { resetTreeView(); treeHasInitialCenter = true; });
  }
  if (id === "charactersScreen") renderCharacterBrowser();
  if (id === "statsScreen") renderAccountStats();
  if (id === "achievementScreen") renderAchievements();
}

function applyRunTheme() {
  const theme = run && BIOME_THEMES[run.themeId];
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
  battleSpeedSetting.value = String(getBattleSpeedPreference());
  disableShakeSetting.checked = !!save.settings.disableShake;
  reduceAnimationsSetting.checked = !!save.settings.reduceAnimations;
  soundSetting.checked = save.settings.sound !== false;
  musicVolumeSetting.value = Number(save.settings.musicVolume ?? 60);
  sfxVolumeSetting.value = Number(save.settings.sfxVolume ?? 70);
  damageNumbersSetting.checked = save.settings.damageNumbers !== false;
  tooltipsSetting.checked = save.settings.tooltips !== false;
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
  saveGame();
  if (save.settings.sound === false) stopMusic();
  else updateMusicVolume();
  fullscreenHint.textContent = "Settings saved.";
  updateRunHud();
}

function setupSettingsAutoSave() {
  [battleSpeedSetting, disableShakeSetting, reduceAnimationsSetting, soundSetting, musicVolumeSetting, sfxVolumeSetting, damageNumbersSetting, tooltipsSetting].forEach(control => {
    if (!control) return;
    control.addEventListener("input", saveSettings);
    control.addEventListener("change", saveSettings);
  });
}

function changeBattleSpeed(value) {
  save.settings.battleSpeed = normalizeBattleSpeed(value);
  if (battle) battle.speedMultiplier = save.settings.battleSpeed;
  saveGame();
  updateRunHud();
}

function normalizeBattleSpeed(value) {
  const speed = Number(value) || 1;
  return [1, 2, 3].includes(speed) ? speed : 1;
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
    return `<div class="achievement-card ${unlocked ? "achievement-unlocked" : "achievement-locked"}"><div class="achievement-medal">${unlocked ? "*" : "?"}</div><div><h3>${achievement.name}</h3><p>${achievement.description}</p><small>${achievement.goal}</small><strong>${unlocked ? formatAchievementBonus(achievement.bonus) : "Reward hidden"}</strong></div></div>`;
  }).join("");
}

function formatAchievementBonus(bonus = {}) {
  return Object.entries(bonus).map(([key, value]) => key === "skin" ? `Unlocks ${value}` : `${Math.abs(value) < 1 ? `+${Math.round(value * 100)}%` : `+${value}`} ${key}`).join(", ");
}

function showAchievementPopup(achievement) {
  const popup = document.createElement("div");
  popup.className = "achievement-toast";
  popup.innerHTML = `<div class="achievement-toast-medal">!</div><div><small>Achievement Unlocked</small><strong>${escapeHtml(achievement.name)}</strong><p>${escapeHtml(achievement.goal || achievement.description)}</p><em>${escapeHtml(formatAchievementBonus(achievement.bonus))}</em></div>`;
  document.body.appendChild(popup);
  setTimeout(() => popup.classList.add("achievement-toast-hide"), 3600);
  setTimeout(() => popup.remove(), 4300);
}

function showSanctuaryGainPopup(amount) {
  const popup = document.createElement("div");
  popup.className = "sanctuary-gain-popup";
  popup.textContent = `+${amount} Max HP`;
  mapScreen.appendChild(popup);
  setTimeout(() => popup.remove(), 1100);
}

function renderDifficulties() {
  difficultyCards.innerHTML = Object.entries(DIFFICULTIES).map(([id, difficulty]) => {
    const locked = difficulty.requiresNode && !hasPermanentUnlock(difficulty.requiresNode);
    const icon = id === "easy" ? "&#9827;" : id === "medium" ? "&#9876;" : "&#9819;";
    return `<div class="card choice-card difficulty-card difficulty-${id}${locked ? " choice-card-locked" : ""}" data-difficulty="${id}"><div class="choice-icon">${icon}</div><h3>${difficulty.name}</h3><p>${difficulty.description}</p><p class="subtle">Biome randomly chosen from: ${difficulty.themeIds.map(themeId => BIOME_THEMES[themeId].name).join(", ")}</p><button ${locked ? "disabled" : ""}>${locked ? "Locked" : `Select ${difficulty.name}`}</button></div>`;
  }).join("");
  difficultyCards.querySelectorAll("[data-difficulty]").forEach(card => {
    card.querySelector("button").onclick = () => {
      const id = card.dataset.difficulty;
      if (DIFFICULTIES[id].requiresNode && !hasPermanentUnlock(DIFFICULTIES[id].requiresNode)) return;
      run = createRun(id); applyRunTheme(); showScreen("classScreen");
    };
  });
}

function renderClasses() {
  classCards.innerHTML = Object.entries(CLASSES).map(([id, heroClass]) => `<div class="card choice-card hero-card" data-class="${id}"><div class="hero-preview player ${getHeroSkinClass(id)} sprite-sheet-unit"><div class="sprite" style="background-image:url('${SPRITE_SHEETS.heroes[id]}');background-size:600% 100%;background-position:0% center;"></div></div><h3>${heroClass.name}</h3><p>${heroClass.description}</p><ul>${heroClass.traits.map(trait => `<li>${getTraitIconMarkup(trait)}<span>${trait}</span></li>`).join("")}</ul><button>Begin as ${heroClass.name}</button></div>`).join("");
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
    ? Object.entries(CLASSES).map(([id, data]) => ({ id, name: data.name, sheet: SPRITE_SHEETS.heroes[id], className: getHeroSkinClass(id) }))
    : getAllCharacterEnemies().map(enemy => ({ id: enemy.id, name: enemy.name, sheet: SPRITE_SHEETS.enemies[enemy.className], className: `enemy ${enemy.className} ${getSelectedEnemySkin(enemy.id).className}` }));
  if (!items.some(item => item.id === selectedCharacterId)) selectedCharacterId = items[0]?.id || "";
  characterList.innerHTML = items.map(item => `<button class="character-list-item ${item.id === selectedCharacterId ? "character-list-selected" : ""}" data-character="${item.id}"><span class="character-list-sprite ${item.className} sprite-sheet-unit"><span class="sprite" style="background-image:url('${item.sheet}');background-size:600% 100%;background-position:0% center;"></span></span><strong>${escapeHtml(item.name)}</strong></button>`).join("");
  characterList.querySelectorAll("[data-character]").forEach(button => button.onclick = () => { selectedCharacterId = button.dataset.character; renderCharacterBrowser(); });
  renderCharacterDetails();
}

function renderCharacterDetails() {
  if (characterBrowserTab === "heroes") return renderHeroCharacterDetails(selectedCharacterId);
  return renderEnemyCharacterDetails(selectedCharacterId);
}

function renderHeroCharacterDetails(classId) {
  const heroClass = CLASSES[classId] || CLASSES.knight;
  const skin = getSelectedHeroSkin(classId);
  const stats = [
    ["HP", Math.round(heroClass.hp * PLAYER_BASE_STAT_MULTIPLIER)],
    ["Damage", (heroClass.damage * PLAYER_BASE_STAT_MULTIPLIER).toFixed(1)],
    ["Atk Spd", (heroClass.attackSpeed * PLAYER_BASE_STAT_MULTIPLIER).toFixed(2)],
    ["Armor", Math.round(heroClass.armor * PLAYER_BASE_STAT_MULTIPLIER)],
    ["Crit", `${Math.round(heroClass.crit * PLAYER_BASE_STAT_MULTIPLIER * 100)}%`]
  ];
  characterDetails.innerHTML = `<div class="character-detail-top"><div class="character-detail-preview player ${getHeroSkinClass(classId)} sprite-sheet-unit"><div class="sprite" style="background-image:url('${SPRITE_SHEETS.heroes[classId]}');background-size:600% 100%;background-position:0% center;"></div></div><div><h3>${heroClass.name}</h3><p>${heroClass.description}</p><small>Equipped: ${escapeHtml(skin.name)}</small></div></div>${renderCharacterStatGrid(stats)}${renderSkinPicker("hero", classId, HERO_SKINS[classId])}`;
  characterDetails.querySelectorAll("[data-skin]").forEach(button => button.onclick = () => equipSkin("hero", classId, button.dataset.skin));
}

function renderEnemyCharacterDetails(enemyId) {
  const enemy = getAllCharacterEnemies().find(item => item.id === enemyId) || getAllCharacterEnemies()[0];
  if (!enemy) return;
  const skin = getSelectedEnemySkin(enemy.id);
  const stats = [
    ["HP", Math.round(enemy.hp * ENEMY_BASE_STAT_MULTIPLIER)],
    ["Damage", (enemy.damage * ENEMY_BASE_STAT_MULTIPLIER).toFixed(1)],
    ["Atk Spd", (enemy.attackSpeed * ENEMY_BASE_STAT_MULTIPLIER).toFixed(2)],
    ["Armor", Math.round(enemy.armor * ENEMY_BASE_STAT_MULTIPLIER)]
  ];
  characterDetails.innerHTML = `<div class="character-detail-top"><div class="character-detail-preview enemy ${enemy.className} ${skin.className} sprite-sheet-unit"><div class="sprite" style="background-image:url('${SPRITE_SHEETS.enemies[enemy.className]}');background-size:600% 100%;background-position:0% center;"></div></div><div><h3>${enemy.name}</h3><p>Known enemy profile from the Crownfall routes.</p><small>Equipped: ${escapeHtml(skin.name)}</small></div></div>${renderCharacterStatGrid(stats)}${renderSkinPicker("enemy", enemy.id, getEnemySkinSet(enemy.id, enemy.name))}`;
  characterDetails.querySelectorAll("[data-skin]").forEach(button => button.onclick = () => equipSkin("enemy", enemy.id, button.dataset.skin));
}

function renderCharacterStatGrid(stats) {
  return `<div class="character-stat-grid">${stats.map(([label, value]) => `<div><small>${label}</small><strong>${value}</strong></div>`).join("")}</div>`;
}

function renderSkinPicker(kind, ownerId, skins) {
  return `<div class="skin-picker">${skins.map(skin => {
    const unlocked = isSkinUnlocked(skin);
    const purchased = isSkinPurchased(kind, ownerId, skin.id);
    const selected = kind === "hero" ? (save.skins.heroes[ownerId] || "base") === skin.id : (save.skins.enemies[ownerId] || "base") === skin.id;
    const cost = skin.unlock?.cost || 0;
    const disabled = !unlocked || (!purchased && save.essence < cost);
    const action = purchased ? selected ? "Equipped" : "Equip" : `Buy - ${cost} Essence`;
    return `<button class="skin-option ${selected ? "skin-option-selected" : ""}" data-skin="${skin.id}" ${disabled ? "disabled" : ""}><strong>${escapeHtml(skin.name)}</strong><span>${unlocked ? action : escapeHtml(getSkinUnlockText(skin))}</span></button>`;
  }).join("")}</div>`;
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
  saveGame();
  renderCharacterBrowser();
}

function getTraitIconMarkup(trait) {
  const kind = /health|armor|defense/i.test(trait) ? "shield" : /crit|bleed|fast|speed/i.test(trait) ? "dagger" : /magic|splash|burst/i.test(trait) ? "rune" : "charm";
  return getObjectIconMarkup(kind, "Common");
}

function showRewards() {
  showScreen("rewardScreen");
  rewardSubtitle.textContent = `Stage ${run.stage} cleared. Choose one run upgrade.`;
  renderChoiceHeroStats(rewardHeroStats);
  run.rewardChoices = getRewardChoices(); run.rewardRerolled = false; renderRewards();
}

function renderRewards() {
  rewardRerollButton.disabled = !!run.rewardRerolled;
  rewardRerollButton.textContent = run.rewardRerolled ? "Rerolled" : "Reroll Rewards";
  rewardCards.innerHTML = (run.rewardChoices || []).map((reward, index) => `<div class="card choice-card reward-card reward-${reward.rarity.toLowerCase()}" data-index="${index}"><div class="choice-icon">${reward.abilityId ? getAbilityIconMarkup(RUN_ABILITIES[reward.abilityId]) : getItemIconMarkup(reward)}</div><h3>${reward.name}</h3><p>${getItemDisplayText(reward)}</p><p class="subtle">${reward.rarity} upgrade</p><button>Choose</button></div>`).join("");
  rewardCards.querySelectorAll("[data-index]").forEach(card => card.querySelector("button").onclick = () => {
    const reward = run.rewardChoices[Number(card.dataset.index)];
    const text = getItemDisplayText(reward);
    reward.apply(run.hero); addRunUpgradeName(reward.name, text, reward.rarity); addAccountStat("rewardsClaimed", 1); saveGame(); continueAfterRunChoice();
  });
}

function rerollRewards() {
  if (run.rewardRerolled) return;
  run.rewardRerolled = true; run.rewardChoices = getRewardChoices(); renderRewards();
}

function getRewardChoices() {
  const classId = run?.hero?.id || "";
  const eligible = REWARDS.filter(reward => (!reward.classId || reward.classId === classId) && isRewardUnlocked(reward));
  const classRewards = eligible.filter(reward => reward.classId === classId);
  const first = classRewards.length ? getWeightedChoices(classRewards, 1) : [];
  return [...first, ...getWeightedChoices(eligible.filter(reward => !first.includes(reward)), 3 - first.length)];
}

function isRewardUnlocked(reward) {
  if (reward.requiresNode && !hasPermanentNode(reward.requiresNode)) return false;
  if (reward.abilityId && run?.hero?.runAbilities?.includes(reward.abilityId)) return false;
  if (reward.requiresAbility && !run?.hero?.runAbilities?.includes(reward.requiresAbility)) return false;
  return true;
}

function grantRunAbility(hero, abilityId) {
  const ability = RUN_ABILITIES[abilityId];
  if (!ability) return;
  hero.runAbilities = hero.runAbilities || [];
  if (!hero.runAbilities.includes(abilityId)) hero.runAbilities.push(abilityId);
  if (battle) battle.abilityCooldowns[abilityId] = ability.cooldown;
  log(`${ability.name} ability unlocked for this run.`);
}

function showRelicRewards(message) {
  const choices = getRelicChoices();
  if (!choices.length) return continueAfterRelicChoice();
  showScreen("relicScreen"); relicSubtitle.textContent = message || `Relic earned on Stage ${run.stage}. Choose one relic for this run.`;
  renderChoiceHeroStats(relicHeroStats); run.relicChoices = choices; run.relicRerolled = false; renderRelicRewards();
}

function renderRelicRewards() {
  relicRerollButton.disabled = !!run.relicRerolled;
  relicRerollButton.textContent = run.relicRerolled ? "Rerolled" : "Reroll Relics";
  relicCards.innerHTML = (run.relicChoices || []).map((relic, index) => `<div class="card choice-card relic-card relic-${relic.rarity.toLowerCase()}" data-index="${index}"><div class="choice-icon">${getItemIconMarkup(relic)}</div><h3>${relic.name}</h3><p>${getRelicDisplayDescription(relic)}</p><p class="subtle">${relic.rarity} Relic</p><button>Claim Relic</button></div>`).join("");
  relicCards.querySelectorAll("[data-index]").forEach(card => card.querySelector("button").onclick = () => claimRelic(run.relicChoices[Number(card.dataset.index)]));
}

function rerollRelics() {
  if (run.relicRerolled) return;
  run.relicRerolled = true; run.relicChoices = getRelicChoices(); renderRelicRewards();
}

function getRelicChoices() {
  const owned = new Set(run.relics.map(relic => relic.id));
  return getWeightedChoices(RELICS.filter(relic => !owned.has(relic.id) && isRelicAvailable(relic)), 3);
}

function isRelicAvailable(relic) {
  const abilities = run?.hero?.runAbilities || [];
  if (relic.classId && relic.classId !== run?.hero?.id) return false;
  if (relic.requiresNode && !hasPermanentNode(relic.requiresNode)) return false;
  if (relic.requiresAbility && !abilities.includes(relic.requiresAbility)) return false;
  if (relic.requiresAnyAbility && !relic.requiresAnyAbility.some(id => abilities.includes(id))) return false;
  return true;
}

function getWeightedChoices(items, count) {
  const pool = [...items], choices = [];
  while (pool.length && choices.length < count) {
    const total = pool.reduce((sum, item) => sum + getRarityWeight(item.rarity || "Common"), 0);
    let roll = Math.random() * total;
    const index = pool.findIndex(item => (roll -= getRarityWeight(item.rarity || "Common")) <= 0);
    choices.push(pool.splice(Math.max(0, index), 1)[0]);
  }
  return choices;
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
  return Math.max(0.1, ({ Common: 70 - progress * 32 - luck * 2.24, Rare: 24 + progress * 12 + luck, Epic: 5.5 + progress * 12.5 + luck * .72, Legendary: .45 + progress * 2.6 + luck * .18, Mythic: .25 + progress * 1.3 + luck * .096 })[rarity] || 70);
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

function getItemDisplayText(item) { return item.text || item.description || ""; }
function getRelicDisplayDescription(relic) { return relic.claimDescription || relic.description || ""; }
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
  if (run.afterRewardAction === "finalBoss") { run.afterRewardAction = null; return beginFinalBoss(); }
  showMap();
}

function beginFinalBoss() {
  run.stage = FINAL_BOSS_STAGE; run.currentNodeId = "final-boss"; run.chosenNodeIds.push("final-boss"); run.availableNodeIds = [];
  log("The final gate opens. The Eternal Crown descends."); beginStage("FinalBoss");
}

function shouldOfferClassTalent() { return CLASS_TALENT_STAGES.includes(run.stage) && getTalentChoices().length > 0; }
function showTalentChoices() {
  const choices = getTalentChoices(); if (!choices.length) return showMap();
  showScreen("talentScreen"); talentSubtitle.textContent = `Strengthen your ${CLASSES[run.classId].name} for this run.`;
  talentCards.innerHTML = choices.map((talent, index) => `<div class="card choice-card talent-card" data-index="${index}"><div class="choice-icon">${getItemIconMarkup(talent)}</div><h3>${talent.name}</h3><p>${talent.description}</p><p class="subtle">Tier ${talent.tier} Talent</p><button>Choose Talent</button></div>`).join("");
  talentCards.querySelectorAll("[data-index]").forEach(card => card.querySelector("button").onclick = () => claimTalent(choices[Number(card.dataset.index)]));
}
function getTalentChoices() { const owned = new Set(run.talents.map(t => t.id)); return shuffle(CLASS_TALENTS[run.classId].filter(t => !owned.has(t.id))).slice(0, 3); }
function claimTalent(talent) { run.talents.push(talent); if (run.summary) run.summary.talentsChosen += 1; applyTalentToRun(talent); log(`Learned talent: ${talent.name}.`); updateRunHud(); showMap(); }
function applyTalentToRun(talent) {
  const hero = run.hero, effect = talent.effect;
  if (effect.armor) hero.armor += effect.armor; if (effect.regen) hero.regen = (hero.regen || 0) + effect.regen;
  if (effect.attackSpeedMultiplier) hero.attackSpeed *= 1 + effect.attackSpeedMultiplier; if (effect.damageMultiplier) hero.damage *= 1 + effect.damageMultiplier;
  if (effect.maxHpMultiplier) { const change = Math.round(hero.maxHp * effect.maxHpMultiplier); hero.maxHp = Math.max(1, hero.maxHp + change); hero.hp = Math.min(hero.hp, hero.maxHp); }
}

function applyRelicToRun(relic) {
  const hero = run.hero, effect = relic.effect || {};
  if (effect.type === "stat") {
    if (effect.stat === "damageMultiplier") hero.damage *= 1 + effect.value;
    if (effect.stat === "attackSpeedMultiplier") hero.attackSpeed *= 1 + effect.value;
    if (effect.stat === "damage") hero.damage += effect.value;
    if (effect.stat === "attackSpeed") hero.attackSpeed += effect.value;
    if (effect.stat === "armor") hero.armor += effect.value;
    if (effect.stat === "luck") hero.luck = (hero.luck || 0) + effect.value;
    if (effect.stat === "lifeSteal") hero.lifeSteal = (hero.lifeSteal || 0) + effect.value;
    if (effect.stat === "blockChance") hero.runBlockChance = (hero.runBlockChance || 0) + effect.value;
    if (effect.stat === "maxHp") { hero.maxHp += effect.value; hero.hp += effect.value; }
    if (effect.critChance) hero.crit += effect.critChance; if (effect.regen) hero.regen = (hero.regen || 0) + effect.regen;
    if (effect.essenceMultiplier) hero.runEssenceMultiplier = (hero.runEssenceMultiplier || 0) + effect.essenceMultiplier;
    if (effect.battleStartShield) hero.runStartShield = (hero.runStartShield || 0) + effect.battleStartShield;
  }
  if (effect.type === "glassDagger") { hero.damage *= 1 + effect.damageMultiplier; hero.maxHp = Math.max(1, hero.maxHp + effect.maxHp); hero.hp = Math.min(hero.hp, hero.maxHp); }
  if (effect.type === "gold") { run.gold += effect.value; if (run.summary) run.summary.goldEarned += effect.value; }
  if (effect.type === "abilityStat") hero[effect.stat] = (hero[effect.stat] || 0) + effect.value;
  if (effect.type === "stageGrowth") { run.stageGrowthRelics = run.stageGrowthRelics || []; run.stageGrowthRelics.push({ id: relic.id, stat: effect.stat, value: effect.value, stages: 0 }); }
}

function showShop() {
  showScreen("shopScreen"); const surcharge = (run.shopsVisited || 0) * 50;
  shopSubtitle.textContent = `Stage ${run.stage} merchant. Buy any upgrades you can afford, or continue.${surcharge ? ` Items cost +${surcharge} gold from prior shops.` : ""}`;
  run.shopItems = getShopChoices(surcharge); run.shopsVisited = (run.shopsVisited || 0) + 1; run.shopRerolled = false; addAccountStat("shopsVisited", 1); saveGame(); renderShop();
}
function renderShop() {
  shopGold.textContent = Math.floor(run.gold); renderChoiceHeroStats(shopHeroStats);
  shopRerollButton.disabled = !!run.shopRerolled; shopRerollButton.textContent = run.shopRerolled ? "Rerolled" : "Reroll Shop";
  shopCards.innerHTML = run.shopItems.map((item, index) => `<div class="card choice-card shop-card shop-${(item.rarity || "Common").toLowerCase()}" data-index="${index}"><div class="choice-icon">${getItemIconMarkup(item)}</div><h3>${item.name}</h3><p>${getItemDisplayText(item)}</p><p class="subtle">${item.rarity || "Common"}</p><button ${item.bought || run.gold < item.cost ? "disabled" : ""}>${item.bought ? "Bought" : `Buy - ${item.cost}g`}</button></div>`).join("");
  shopCards.querySelectorAll("[data-index]").forEach(card => card.querySelector("button").onclick = () => buyShopItem(run.shopItems[Number(card.dataset.index)]));
}
function getShopChoices(surcharge) { return getWeightedChoices(SHOP_ITEMS.filter(item => !item.requiresNode || hasPermanentNode(item.requiresNode)), 3).map(item => ({ ...item, cost: item.cost + surcharge, bought: false })); }
function rerollShop() { if (run.shopRerolled) return; run.shopRerolled = true; run.shopItems = getShopChoices(Math.max(0, (run.shopsVisited - 1) * 50)); renderShop(); }
function buyShopItem(item) { if (item.bought || run.gold < item.cost) return; run.gold -= item.cost; const text = getItemDisplayText(item); item.apply(run.hero); item.bought = true; playSound("shop"); addRunUpgradeName(item.name, text, item.rarity || "Common"); renderShop(); updateRunHud(); }
function leaveShop() { showMap(); }

function renderChoiceHeroStats(target) {
  if (!target || !run?.hero) return; const hero = run.hero;
  target.innerHTML = [["HP", `${Math.ceil(hero.hp)}/${Math.ceil(hero.maxHp)}`], ["Damage", hero.damage.toFixed(1)], ["Atk Spd", getHeroAttackSpeed(hero).toFixed(2)], ["Armor", hero.armor], ["Life Steal", `${Math.round((hero.lifeSteal || 0) * 100)}%`], ["Crit", `${Math.round(hero.crit * 100)}%`], ["Luck", hero.luck || 0], ["Gold", Math.floor(run.gold)]].map(([l, v]) => `<div class="tooltip-item" data-tooltip="${escapeHtml(getTermTooltip(l))}"><small>${l}</small><strong>${v}</strong></div>`).join("");
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
    const rowEl = document.createElement("div"); rowEl.className = "map-row"; rowEl.innerHTML = `<div class="map-node-stage"><strong>${row[0].type === "Boss" ? "Boss" : "Stage " + row[0].stage}</strong><span>${[...new Set(row.map(node => MAP_TYPES[node.type].label))].join(" / ")}</span></div>`;
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
function getMapNodePreviewDescription(node) { return node.type === "Elite" ? "Harder fight. Better gold and Essence." : node.type === "Treasure" ? "Find gold, supplies, or a chance at a relic." : `${MAP_TYPES[node.type].description}.`; }
function getVisibleMapLayer() { return Math.max(1, Math.ceil(Math.min(run.maxStage, run.stage + 1) / MAP_LAYER_SIZE)); }
function getMapRowSlots(row) { if (row.length === 1) return [null, row[0], null]; if (row.length === 2) return [row[0], null, row[1]]; return row.slice(0, 3); }
function drawMapConnections() {
  if (!run || !mapBoard || !mapConnections) return; const boardRect = mapBoard.getBoundingClientRect(), panelRect = mapConnections.parentElement.getBoundingClientRect();
  mapConnections.style.left = boardRect.left - panelRect.left + "px"; mapConnections.style.top = boardRect.top - panelRect.top + "px"; mapConnections.style.width = boardRect.width + "px"; mapConnections.style.height = boardRect.height + "px"; mapConnections.setAttribute("viewBox", `0 0 ${boardRect.width} ${boardRect.height}`); mapConnections.innerHTML = "";
}

function updateRunHud() {
  if (!run?.hero) return; const hero = run.hero, layer = Math.max(1, Math.ceil(run.stage / MAP_LAYER_SIZE)), stageInLayer = ((run.stage - 1) % MAP_LAYER_SIZE) + 1;
  runDifficulty.textContent = DIFFICULTIES[run.difficultyId].name; runClass.textContent = CLASSES[run.classId].name; runStage.textContent = run.stage === FINAL_BOSS_STAGE ? "Final Boss" : `Layer ${layer}: ${stageInLayer} / ${MAP_LAYER_SIZE}`; runGold.textContent = Math.floor(run.gold); runEssence.textContent = Math.floor(run.essenceEarned); if (battleSpeedSelect) battleSpeedSelect.value = String(getBattleSpeedPreference());
  heroStats.innerHTML = [["HP", `${Math.max(0, Math.ceil(hero.hp))}/${Math.ceil(hero.maxHp)}`], ["Armor", hero.armor], ["Damage", hero.damage.toFixed(1)], ["Atk Spd", getHeroAttackSpeed(hero).toFixed(2)], ["Shield", Math.ceil(hero.shield || 0)], ["Crit", `${Math.round(hero.crit * 100)}%`], ["Regen", `${(hero.regen || 0).toFixed(1)}/s`], ["Luck", hero.luck || 0]].map(([l, v]) => statCell(l, v, getTermTooltip(l))).join("");
  heroStats.className = "hero-stat-grid"; renderHeroFullStats(hero); renderEnemyStats();
  heroUpgrades.innerHTML = getRunUpgradeStacks().length ? getRunUpgradeStacks().map(upgrade => `<div class="pill upgrade-pill upgrade-${upgrade.rarity.toLowerCase()} tooltip-item" data-tooltip="${escapeHtml(getUpgradeTooltip(upgrade.name))}">${getItemIconMarkup(upgrade.source)}<span>${escapeHtml(upgrade.name)}</span>${upgrade.count > 1 ? `<strong>${upgrade.count}x</strong>` : ""}</div>`).join("") : `<div class="pill">No run upgrades yet</div>`;
  heroRelics.innerHTML = `<div class="relic-list-title">Relics</div>` + (run.relics.length ? run.relics.map(relic => `<div class="relic-pill relic-${relic.rarity.toLowerCase()} tooltip-item" data-tooltip="${escapeHtml(getRelicDisplayDescription(relic))}">${getItemIconMarkup(relic)}<strong>${escapeHtml(relic.name)}</strong></div>`).join("") : `<div class="pill">No relics yet</div>`);
  heroTalents.innerHTML = `<div class="talent-list-title">Class Talents</div>` + (run.talents.length ? run.talents.map(talent => `<div class="talent-pill tooltip-item" data-tooltip="${escapeHtml(talent.description)}">${getItemIconMarkup(talent)}<strong>${escapeHtml(talent.name)}</strong></div>`).join("") : `<div class="pill">No class talents yet</div>`);
  renderActiveSkills(); renderSpecialSkills();
}
function renderHeroFullStats(hero) { heroFullStats.innerHTML = [["Boss Damage", `${Math.round((getPermanentEffectTotal("bossDamage", hero.id) + getAchievementBonusTotal("bossDamage", hero.id) + getRelicEffectTotal("eliteBossDamage")) * 100)}%`], ["Life Steal", `${Math.round((hero.lifeSteal || 0) * 100)}%`], ["Start Shield", `${Math.round((hero.runStartShield || 0) + getPermanentEffectTotal("battleStartShield", hero.id))}`]].map(([l, v]) => `<div class="tooltip-item" data-tooltip="${escapeHtml(getTermTooltip(l))}"><span>${l}</span><strong>${v}</strong></div>`).join(""); }
function renderEnemyStats() { const enemies = battle?.enemies || []; enemyStats.innerHTML = enemies.length ? enemies.map(e => `<div class="enemy-stat-row"><strong>${escapeHtml(e.name)}</strong><div class="enemy-status">${e.hp > 0 ? "ALIVE" : "DEAD"}</div><div class="enemy-stat-chips"><span>HP ${Math.max(0, Math.ceil(e.hp))}/${Math.ceil(e.maxHp)}</span><span>DMG ${Number(e.damage).toFixed(1)}</span><span>AS ${getEnemyAttackSpeed(e).toFixed(2)}</span><span>ARM ${e.armor}</span></div></div>`).join("") : `<div class="enemy-stat-empty">No active enemies</div>`; }
function statCell(label, value, tooltip) { return `<div class="tooltip-item" data-tooltip="${escapeHtml(tooltip)}"><small>${label}</small><strong>${value}</strong></div>`; }
function getTermTooltip(term) { return ({ Damage: "How much health an attack removes before armor.", Armor: "Reduces incoming hit damage.", "Atk Spd": "How many attacks happen each second.", "Attack speed": "How many attacks happen each second.", Crit: "Chance for an attack to deal critical damage.", "Crit chance": "Chance for an attack to deal critical damage.", Shield: "Temporary protection that absorbs damage before health.", Health: "Current and maximum HP.", Luck: "Improves reward, relic, and shop rolls.", Gold: "Currency used during this run at merchants.", Essence: "Currency used between runs to buy permanent upgrades and unlocks.", "Boss Damage": "Extra damage dealt to bosses.", "Life Steal": "Heals for part of the damage you deal.", "Start Shield": "Shield gained at battle start." })[term] || "A combat stat or effect."; }
function renderActiveSkills() { activeSkills.innerHTML = battle ? Object.entries(battle.activeSkills || {}).map(([name, time]) => `<div class="active-skill"><b>*</b><strong>${escapeHtml(name)}</strong><span>${time.toFixed(1)}s</span></div>`).join("") : ""; }
function renderSpecialSkills() { const ids = run?.hero?.runAbilities || []; specialSkills.innerHTML = ids.length ? `<div class="special-skill-title">Special Skills</div><div class="special-skill-row">${ids.map(id => `<div class="special-skill"><b>${getAbilityIconMarkup(RUN_ABILITIES[id])}</b><strong>${RUN_ABILITIES[id].name}</strong><span>${Math.max(0, battle?.abilityCooldowns?.[id] || 0).toFixed(1)}s</span></div>`).join("")}</div>` : `<div class="special-skill-empty">No special skills unlocked</div>`; }
function getAbilityIconMarkup(ability) { return `<span class="ability-icon ability-icon-${ability.id}" style="--ability-color:${ability.color}">${ability.icon}</span>`; }

function renderBattle() {
  battlefield.querySelectorAll(".unit,.float-text,.battle-particle,.battle-projectile,.battle-impact,.skill-vfx,.boss-intro-overlay,.battle-result-panel").forEach(node => node.remove());
  if (!battle || !run) return;
  battlefield.appendChild(createUnitEl(run.hero, true)); battle.enemies.filter(e => e.hp > 0 || (e.deathTimer || 0) > 0).forEach(e => battlefield.appendChild(createUnitEl(e, false)));
  battlefield.classList.toggle("boss-intro-shake", battle.bossIntroTimer > 0 && !save.settings.reduceAnimations && !save.settings.disableShake);
  if (battle.bossIntroTimer > 0) renderBossIntro(); if (battle.state === "result") renderBattleResultPanel();
  battle.floatingTexts.forEach(float => { const div = document.createElement("div"), scale = getBattleScale(); div.className = `float-text ${float.variant ? `float-text-${float.variant}` : ""}`; div.style.left = float.x * scale.x + "px"; div.style.top = float.y * scale.y + "px"; div.style.color = float.color; div.textContent = float.text; battlefield.appendChild(div); }); battle.floatingTexts = [];
}
function renderBossIntro() { const boss = battle.enemies.find(e => e.boss); if (!boss) return; const progress = 1 - battle.bossIntroTimer / Math.max(.1, battle.bossIntroDuration || battle.bossIntroTimer), opacity = progress < .18 ? progress / .18 : progress > .72 ? Math.max(0, (1 - progress) / .28) : 1; const overlay = document.createElement("div"); overlay.className = `boss-intro-overlay${boss.finalBoss ? " boss-intro-final" : ""}`; overlay.style.opacity = opacity; overlay.style.setProperty("--intro-progress", progress); overlay.innerHTML = `<div class="boss-intro-tint"></div><div class="boss-intro-name"><small>${boss.finalBoss ? "THE CROWN AWAKENS" : "BOSS"}</small><h2>${escapeHtml(boss.name.toUpperCase())}</h2><strong>${boss.finalBoss ? "The Last Encounter" : "Final Encounter"}</strong></div>`; battlefield.appendChild(overlay); }
function renderBattleResultPanel() { const r = battle.result, panel = document.createElement("div"); panel.className = `battle-result-panel${r.victory ? "" : " battle-result-defeat"}`; panel.innerHTML = `<div class="battle-result-kicker">${r.victory ? "Enemies Defeated" : "Hero Defeated"}</div><h2>${r.title}</h2><div class="battle-result-gains"><div><small>Gold Gained</small><strong>+${Math.floor(r.gold)}</strong></div><div><small>Essence Gained</small><strong>+${Math.floor(r.essence)}</strong></div></div><button onclick="continueBattleResult()">${r.nextLabel}</button>`; battlefield.appendChild(panel); }
function getBattleScale() { return { x: battlefield.clientWidth / 900, y: battlefield.clientHeight / 430, unit: Math.max(.58, Math.min(battlefield.clientWidth / 900, battlefield.clientHeight / 430)) }; }
function createUnitEl(unit, isHero) { const el = document.createElement("div"), scale = getBattleScale(), size = (unit.boss ? 104 : unit.miniBoss ? 92 : isHero ? 84 : 78) * scale.unit; el.className = `unit ${isHero ? "player " + unit.colorClass : `enemy ${unit.className} ${unit.skinClass || ""}`}`; el.style.left = unit.x * scale.x + "px"; el.style.top = unit.y * scale.y + "px"; el.style.width = size + "px"; el.style.height = size + "px"; const hp = Math.max(0, Math.min(100, unit.hp / unit.maxHp * 100)); el.innerHTML = `<div class="hpbar"><div class="hpfill" style="width:${hp}%"></div><span class="hptext">${Math.ceil(Math.max(0, unit.hp))}/${Math.ceil(unit.maxHp)}</span></div><div class="sprite"></div>`; const sheet = isHero ? SPRITE_SHEETS.heroes[unit.id] : unit.boss ? SPRITE_SHEETS.enemies.boss : SPRITE_SHEETS.enemies[unit.className]; if (sheet) { el.classList.add("sprite-sheet-unit"); const sprite = el.querySelector(".sprite"); sprite.style.backgroundImage = `url("${sheet}")`; sprite.style.backgroundSize = "600% 100%"; sprite.style.backgroundPosition = "0% center"; } return el; }
function spawnHeroAttackEffect(hero, enemy) { if (hero.id === "wizard") { playSound("magicCast"); return; } spawnSlashEffect(enemy, hero.id === "rogue" ? "rogue" : "sword"); }
function spawnSlashEffect(target, type) { if (!battlefield || save.settings.reduceAnimations) return; const scale = getBattleScale(), slash = document.createElement("div"); slash.className = `attack-vfx ${type}-slash-vfx`; slash.style.left = target.x * scale.x + "px"; slash.style.top = target.y * scale.y + "px"; battlefield.appendChild(slash); setTimeout(() => slash.remove(), 460); }
function spawnAbilityProjectile() {}
function spawnAbilityIndicator() {}
function spawnBossSlashEffect(target) { spawnSlashEffect(target, "boss"); }
function spawnShieldImpactEffect() {}
function markUnitHit(unit) { if (unit) unit.hitFlash = .16; }
function spawnDeathParticles() {}
function triggerScreenShake(strength) { if (save.settings.disableShake || save.settings.reduceAnimations || !battlefield) return; battlefield.classList.remove("screen-shake-light", "screen-shake-heavy"); void battlefield.offsetWidth; battlefield.classList.add(strength === "heavy" ? "screen-shake-heavy" : "screen-shake-light"); setTimeout(() => battlefield.classList.remove("screen-shake-light", "screen-shake-heavy"), 260); }
function log(message, type = "info") { const line = document.createElement("div"); line.className = `log-line log-${type}`; line.innerHTML = `<span>${type[0] || "i"}</span><p>${escapeHtml(message)}</p>`; battleLog.appendChild(line); battleLog.scrollTop = battleLog.scrollHeight; }

function renderTree() { if (!treeCards) return; treeEssence.textContent = Math.floor(save.essence); treeCards.innerHTML = createTreeLinesSvg() + TREE_NODES.map(node => createTreeNodeButtonHtml(node)).join(""); renderTreeDetails(TREE[selectedTreeNodeId] || TREE.crown_legacy); applyTreeCamera(); refreshTopbar(); }
function createTreeLinesSvg() {
  const lines = TREE_NODES.flatMap(node => (node.prerequisites || []).map(prereqId => {
    const parent = TREE[prereqId];
    if (!parent) return "";
    const complete = getTreeLevel(parent.id) > 0 && getTreeLevel(node.id) > 0;
    const available = getTreeLevel(parent.id) > 0 && getTreeLevel(node.id) <= 0;
    return `<line class="skill-tree-line ${complete ? "skill-tree-line-complete" : available ? "skill-tree-line-available" : ""}" x1="${parent.x}" y1="${parent.y}" x2="${node.x}" y2="${node.y}" />`;
  }));
  return `<svg class="skill-tree-lines" viewBox="0 0 3200 2660" aria-hidden="true">${lines.join("")}</svg>`;
}
function createTreeNodeButtonHtml(node) { const level = getTreeLevel(node.id), locked = isTreeNodeLocked(node), maxed = level >= node.maxLevel, cost = getTreeUpgradeCost(node, level), available = !locked && !maxed && save.essence >= cost; return `<button class="skill-node skill-node-${node.type} skill-node-${node.classId} ${locked ? "skill-node-locked" : ""} ${maxed ? "skill-node-complete" : ""} ${available ? "skill-node-available" : ""} ${selectedTreeNodeId === node.id ? "skill-node-selected" : ""}" style="left:${node.x}px;top:${node.y}px" data-node="${node.id}"><span>${getTreeNodeInitials(node)}</span><small>${level}/${node.maxLevel}</small></button>`; }
function renderTreeDetails(node) { const level = getTreeLevel(node.id), cost = getTreeUpgradeCost(node, level), locked = isTreeNodeLocked(node), maxed = level >= node.maxLevel, prereqs = (node.prerequisites || []).map(id => TREE[id]?.name).filter(Boolean); treeDetails.innerHTML = `<div class="tree-detail-kicker">${node.branch}</div><h3>${node.name}</h3><p>${node.description}</p><div class="tree-detail-row"><span>Level</span><strong>${level}/${node.maxLevel}</strong></div><div class="tree-detail-row"><span>Cost</span><strong>${maxed ? "Maxed" : `${cost} Essence`}</strong></div>${prereqs.length ? `<div class="tree-detail-prereqs"><strong>Requires</strong><br>${prereqs.map(escapeHtml).join(", ")}</div>` : ""}<button ${locked || maxed || save.essence < cost ? "disabled" : ""}>${locked ? "Locked" : maxed ? "Completed" : "Purchase"}</button>`; treeDetails.querySelector("button").onclick = () => purchaseTreeNode(node.id); treeCards.querySelectorAll("[data-node]").forEach(button => button.onclick = () => { selectedTreeNodeId = button.dataset.node; renderTree(); }); }
function getTreeUpgradeCost(node, level) { if (node.type === "ability") return node.cost; return Math.ceil((node.cost * (node.classId === "global" ? GLOBAL_TREE_COST_MULTIPLIER : 1) * Math.pow(node.classId === "global" ? GLOBAL_TREE_COST_GROWTH : TREE_COST_GROWTH, level)) / 10) * 10; }
function isTreeNodeLocked(node) { return node.prerequisites.some(id => getTreeLevel(id) <= 0); }
function getTreeNodeInitials(node) { return node.name.split(/\s+/).map(word => word[0]).join("").slice(0, 2).toUpperCase(); }
function purchaseTreeNode(id) { const node = TREE[id], level = getTreeLevel(id), cost = getTreeUpgradeCost(node, level); if (isTreeNodeLocked(node) || level >= node.maxLevel || save.essence < cost) return; save.essence -= cost; save.tree[id] = level + 1; selectedTreeNodeId = id; saveGame(); renderTree(); }
function resetTreeView() {
  if (!treeViewport || !treeCards) return;
  const target = TREE[selectedTreeNodeId] || TREE.crown_legacy || { x: 1600, y: 1330 };
  treeCamera.zoom = treeViewport.clientWidth < 760 ? 0.58 : 0.75;
  treeCamera.x = treeViewport.clientWidth / 2 - target.x * treeCamera.zoom;
  treeCamera.y = treeViewport.clientHeight / 2 - target.y * treeCamera.zoom;
  applyTreeCamera();
}
function setupTreeCameraControls() {
  if (!treeViewport || treeViewport.dataset.cameraReady) return;
  treeViewport.dataset.cameraReady = "true";
  treeViewport.addEventListener("pointerdown", event => {
    if (event.target.closest(".skill-node, .tree-details, .tree-toolbar, .actions")) return;
    treePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    treePointer = { id: event.pointerId, x: event.clientX, y: event.clientY, cameraX: treeCamera.x, cameraY: treeCamera.y };
    treeViewport.setPointerCapture(event.pointerId);
    treeViewport.classList.add("tree-viewport-dragging");
    if (treePointers.size === 2) startTreePinch();
  });
  treeViewport.addEventListener("pointermove", event => {
    if (!treePointers.has(event.pointerId)) return;
    treePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (treePointers.size >= 2 && treePinch) {
      updateTreePinch();
      return;
    }
    if (!treePointer || treePointer.id !== event.pointerId) return;
    treeCamera.x = treePointer.cameraX + event.clientX - treePointer.x;
    treeCamera.y = treePointer.cameraY + event.clientY - treePointer.y;
    applyTreeCamera();
  });
  treeViewport.addEventListener("pointerup", endTreeDrag);
  treeViewport.addEventListener("pointercancel", endTreeDrag);
  treeViewport.addEventListener("wheel", event => {
    event.preventDefault();
    zoomTreeAt(event.clientX, event.clientY, event.deltaY > 0 ? 0.9 : 1.1);
    applyTreeCamera();
  }, { passive: false });
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
  treeCards.style.transform = `translate(${treeCamera.x}px, ${treeCamera.y}px) scale(${treeCamera.zoom})`;
}
function clampTreeCamera() {}
function validateSkillTreeLines() {
  const missing = TREE_NODES.flatMap(node => (node.prerequisites || []).filter(id => !TREE[id]).map(id => `${node.id} -> ${id}`));
  if (missing.length) console.warn("Skill tree has missing prerequisites:", missing);
}
