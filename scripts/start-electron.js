const { spawn } = require("child_process");
const path = require("path");

const electronBin = process.platform === "win32" ? "electron.cmd" : "electron";
const electronPath = path.join(__dirname, "..", "node_modules", ".bin", electronBin);

const child = spawn(electronPath, ["."], {
  cwd: path.resolve(__dirname, ".."),
  stdio: "inherit",
  shell: false
});

child.on("error", error => {
  console.error("Could not start Electron. Run npm install if dependencies are missing.");
  console.error(error.message);
  process.exit(1);
});

child.on("exit", code => {
  process.exit(code || 0);
});
