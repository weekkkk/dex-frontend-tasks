const chalk = require("chalk");
const { execSync } = require("child_process");

// Получаем список staged файлов
const stagedFiles = execSync("git diff --cached --name-only", {
  encoding: "utf-8",
}).split("\n");

// Проверяем, находятся ли файлы за пределами разрешенной папки
const allowedFolder = "src/";
const invalidFiles = stagedFiles.filter(
  (file) => file && !file.startsWith(allowedFolder)
);

if (invalidFiles.length > 0) {
  console.log(
    chalk.bgRed(" Ошибка "),
    "Разрешены изменения только в папке:",
    chalk.blue(allowedFolder)
  );
  console.log(`Нарушения:\n${chalk.blue(invalidFiles.join("\n"))}`);
  process.exit(1); // Завершаем скрипт с ошибкой
}

console.log("Все изменения находятся в разрешенной папке.");
process.exit(0); // Успешный выход
