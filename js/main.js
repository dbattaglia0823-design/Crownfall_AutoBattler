function initGame() {
  applyRunTheme();

  renderDifficulties();
  renderClasses();
  applySettings();
  refreshTopbar();
  renderTree();
  setupSettingsAutoSave();
  setupGlobalSoundHandlers();
  setupTreeCameraControls();
  installDevTools();
  validateSkillTreeLines();
  validateDifficultyProgression();
  registerServiceWorker();

  window.addEventListener("resize", () => {
    if (battleScreen.classList.contains("active")) renderBattle();
    if (mapScreen.classList.contains("active")) requestAnimationFrame(drawMapConnections);
    if (upgradeScreen.classList.contains("active")) requestAnimationFrame(applyTreeCamera);
  });
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    console.info("Crownfall PWA: service workers are not available in this browser.");
    return;
  }
  if (location.protocol === "file:") {
    console.info("Crownfall PWA: service worker skipped for file://. Use npm run serve for PWA testing.");
    return;
  }
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js", { scope: "./" })
      .then(registration => {
        console.info("Crownfall PWA: service worker registered.", registration.scope);
      })
      .catch(error => {
        console.warn("Crownfall PWA: service worker registration failed.", error);
      });
  });
}

initGame();
