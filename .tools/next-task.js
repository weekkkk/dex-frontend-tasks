const { execSync } = require("child_process");

const getNextTaskBranchName = (ids, index = 2) => {
  if (index < 0) throw new Error();
  const nextTaskId = ids.reduce(
    (str, id, i) => str + (str && "-") + (i === index ? +(id + 1) : id),
    ""
  );
  const nextTaskSolutionBranchName = `task/${nextTaskId}--solution`;
  try {
    execSync(
      `git show-ref --verify --quiet refs/remotes/origin/${nextTaskSolutionBranchName}`,
      { stdio: "ignore" }
    );
    return [nextTaskSolutionBranchName, nextTaskId];
  } catch {
    const nexIds = [...ids];
    nexIds.splice(index, 1, 1);
    return getNextTaskBranchName(nexIds, index - 1);
  }
};

const getTaskId = () => {
  const currentBrunch = execSync("git rev-parse --abbrev-ref HEAD");
  if (
    !currentBrunch.includes("task/") ||
    !currentBrunch.includes("--iterative")
  ) {
    console.error("Эта команта работает только на --iterative задачах");
    console.error("Перейдите на ветку --iterative задачи");
    process.exit();
  }
  const taskId = execSync("git rev-parse --abbrev-ref HEAD")
    .toString()
    .trim()
    .replace("--iterative", "")
    .replace("task/", "");
  return taskId;
};

const getBaseBranch = (taskId) => {
  const [sectionId, row, question] = taskId.split("-");
  let baseBranch = "";
  switch (sectionId) {
    case "1":
      baseBranch += "html";
      break;
  }
  baseBranch += "-develop--iterative";
  return baseBranch;
};

const taskId = getTaskId();

const taskBranchName = `task/${taskId}--iterative`;

const [nextTaskSolutionBranchName, nextTaskId] = getNextTaskBranchName(
  taskId.split("-").map((id) => Number(id))
);

const baseBranch = getBaseBranch(taskId);

execSync("git add --all");
try {
  execSync(
    `git commit -m "[${baseBranch
      .split("-")[0]
      .toUpperCase()}] [${taskId}] Сделать решение задачи согласно документации"`,
    {
      env: { ...process.env, FORCE_COLOR: "1" }, // Включаем цвет
      stdio: "pipe",
    }
  );
  execSync("git push");
} catch (error) {
  console.error(error.stderr.toString()); // Сохраняет цвет
  process.exit(1);
}

execSync(`git checkout ${baseBranch}`);
execSync(`git merge ${taskBranchName} --no-ff`);
execSync("git push");

const nextTaskBranchName = nextTaskSolutionBranchName.replace(
  "solution",
  "iterative"
);

// Получение списка коммитов из ветки-источника, исключая коммит с решением задачи
const logOutput = execSync(
  `git log origin/${nextTaskSolutionBranchName} --oneline --format="%H %s"`,
  { encoding: "utf-8" }
);
const excludeMessage = `[${nextTaskId}] Сделать решение задачи согласно документации`;
const commits = logOutput
  .split("\n")
  .filter(
    (line) =>
      line && line.includes(`[${nextTaskId}]`) && !line.includes(excludeMessage)
  )
  .reverse(); // Обратный порядок коммитов для избежания конфликтов

execSync(`git checkout -b ${nextTaskBranchName}`);

// Перенос коммитов
for (const commit of commits) {
  const commitHash = commit.split(" ")[0];
  console.log(`Перенос коммита: ${commitHash}`);
  try {
    execSync(
      `git cherry-pick --strategy=recursive --strategy-option=theirs -x ${commitHash}`,
      { stdio: "inherit" }
    );
  } catch (error) {
    console.error(`Ошибка при переносе коммита ${commitHash}:`, error.message);
    console.log("Попытка завершить перенос коммитов.");
    execSync("git cherry-pick --abort", { stdio: "inherit" });
    process.exit(1);
  }
}

console.log(
  `Коммиты из ветки ${nextTaskSolutionBranchName} успешно перенесены в ветку ${nextTaskBranchName}`
);
