const { exec } = require("child_process");

const onChange = () => {
  console.log("\nПроверка...");

  exec("npm run test", (error, stdout) => console.log(stdout));
};

const liveServer = require("live-server");

const params = {
  root: "src",
  open: false,
  ignore: "scss,my/templates",
  file: "index.html",
  logLevel: 2,
};
liveServer.start(params);

liveServer.watcher.on("change", () => onChange());
liveServer.watcher.on("ready", () => onChange());
