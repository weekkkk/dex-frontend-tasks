const { execSync } = require("child_process");

// Проверяем наличие id задачи
if (process.argv.length !== 3) {
  console.error("Использование: npm run task <индентификатор задачи>");
  process.exit(1);
}

const getBaseBranch = (taskId) => {
  const [sectionId, row, question] = taskId.split("-");
  let baseBranch = "";
  switch (sectionId) {
    case "1":
      baseBranch += "html";
      break;
  }
  baseBranch += "-develop--single";
  return baseBranch;
};

const taskId = process.argv[2];
const targetBranch = `task/${taskId}--single`;
const baseBranch = getBaseBranch(taskId);
const sourceBranch = `task/${taskId}--solution`;
const excludeMessage = `[${taskId}] Сделать решение задачи согласно документации`;

try {
  // Проверяем, существует ли ветка задачи
  const branchExists = execSync(
    `git show-ref --verify --quiet refs/remotes/origin/${targetBranch}`,
    { stdio: "ignore" }
  );

  if (branchExists === 0) {
    console.log("Работа по задаче уже начата");
    execSync(`git checkout ${targetBranch}`, { stdio: "inherit" });
  }
} catch {
  console.log(`Ветка ${targetBranch} не найдена. Начинаем работу.`);

  // Переход на базовую ветку
  execSync(`git checkout ${baseBranch}`, { stdio: "inherit" });

  // Получение списка коммитов из ветки-источника, исключая коммит с решением задачи
  const logOutput = execSync(
    `git log origin/${sourceBranch} --oneline --format="%H %s"`,
    { encoding: "utf-8" }
  );
  const commits = logOutput
    .split("\n")
    .filter((line) => line && !line.includes(excludeMessage))
    .reverse(); // Обратный порядок коммитов для избежания конфликтов

  // Создание ветки задачи
  execSync(`git checkout -b ${targetBranch}`, { stdio: "inherit" });

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
      console.error(
        `Ошибка при переносе коммита ${commitHash}:`,
        error.message
      );
      continue;
    }
  }

  console.log(
    `Коммиты из ветки ${sourceBranch} успешно перенесены в ветку ${targetBranch}`
  );

  // Установка зависимостей
  console.log("Установка зависимостей");
  execSync("npm install", { stdio: "inherit" });
}

// Запуск проекта
console.log("Запуск проекта");
execSync("npm run dev", { stdio: "inherit" });
