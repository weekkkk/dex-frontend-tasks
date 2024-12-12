const chalk = require("chalk");
const { execSync, exec } = require("child_process");

const getCurrentTaskTestPath = () => {
  const taskId = execSync("git rev-parse --abbrev-ref HEAD")
    .toString()
    .trim()
    .replace("--solution", "")
    .replace("task/", "");
  let path = ".tests";
  const [sectionId, row, question] = taskId.split("-");
  switch (sectionId) {
    case "1":
      path += "/html";
      break;
  }
  path += `/${row}/${question}.test.js`;
  return path;
};

const currentTaskTestPath = getCurrentTaskTestPath();

const prevCommand = `jest --color --failuresOnly="true" --testPathIgnorePatterns="${currentTaskTestPath}" `;
const currentCommand = `jest --color --runTestsByPath "${currentTaskTestPath}"`;

const titleStyle = chalk.bold.underline;
const PREV_TASKS_TITLE = titleStyle(
  "\nВаша реализация привела к ошибкам в предыдущих задачах"
);
const TAKSK_TITLE = titleStyle("\nИнформация по текущей задаче");

exec(currentCommand, (currentTaskError, stdout, currentTaskStderr) => {
  if (currentTaskStderr) {
    console.log(TAKSK_TITLE);
    console.log(currentTaskStderr);
    exec(prevCommand, (error, stdout, prevTasksStderr) => {
      if (prevTasksStderr) {
        console.log(PREV_TASKS_TITLE);
        console.log(prevTasksStderr);
      }

      if (currentTaskError || prevTasksStderr) process.exit(1);
      else process.exit(0);
    });
  }
});
