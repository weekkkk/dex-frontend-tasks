const chalk = require("chalk");
const MARKER_FOR_STATUS = {
  passed: chalk.green("•"),
  failed: chalk.red("•"),
};

const MARKER_FOR_SUMMARY_STATUS = {
  passed: chalk.bgGreen(" Успешно "),
  failed: chalk.bgRed(" Ошибки "),
};
const INDENT = "  ";

class TestReporter {
  /**
   * @param {*} globalConfig
   * @param {*} options
   */
  constructor({ rootDir }) {
    this._rootDir = rootDir;
    this._failuresOnly = false;
    this._testResults = [];
  }

  onTestResult(test, testResult) {
    const result = testResult.testResults.reduce(
      (obj, { ancestorTitles, status, failureMessages, title }) => {
        const test = [...ancestorTitles].reverse().reduce(
          (acc, key, index, { length }) => {
            const prev =
              ancestorTitles
                .slice(0, length - index)
                .reduce((val, a) => val?.[a], obj) || [];
            return {
              [key]: { ...prev, ...acc },
            };
          },
          {
            [title]: status,
          }
        );

        return { ...obj, ...test };
      },
      {}
    );
    this._testResults = [...this._testResults, result];
  }
  onRunStart() {
    this._failuresOnly = process.argv.includes("--failuresOnly=true");
  }
  onRunComplete() {
    for (let r of this._testResults) {
      let message = this.resultText(r);
      if (!message) continue;
      this.log(message);
    }
  }

  log(message, end = "\n") {
    process.stderr.write(message + end);
  }
  resultText(res, depth = 0) {
    let message = "";

    for (let [key, value] of Object.entries(res)) {
      const status = this.summaryStatusByResult(value);

      if (this._failuresOnly && status === "passed") continue;
      message += "\n";
      for (let i = 0; i < depth; i++) message += INDENT;

      message +=
        (!depth ? MARKER_FOR_SUMMARY_STATUS : MARKER_FOR_STATUS)[status] + " ";

      message += `${this.highlightHTMLTag(this.highlightTextTag(key))}`;
      if (typeof value !== "string")
        message += this.resultText(value, depth + 1);
    }

    return message;
  }
  summaryStatusByResult(res) {
    if (typeof res === "string")
      if (res !== "passed") return "failed";
      else return "passed";

    for (let value of Object.values(res)) {
      if (this.summaryStatusByResult(value) === "failed") return "failed";
    }

    return "passed";
  }

  highlightTextTag(text) {
    const backgroundColor = "\x1b[48;5;235m"; // Цвет фона (серый)
    const reset = "\x1b[0m"; // Сброс форматирования
    const padding = " "; // Пробелы с двух сторон

    // Определяем тип скобок, которые нужно обрабатывать
    const openBracket = "\\[";
    const closeBracket = "\\]";

    // Создаём регулярное выражение для поиска текста в скобках
    const regex = new RegExp(
      `${openBracket}([^${closeBracket}]+)${closeBracket}`,
      "g"
    );

    // Заменяем найденный текст без скобок, добавляя фон и пробелы
    return text.replace(regex, (match, content) => {
      return `${backgroundColor}${padding}${content}${padding}${reset}`;
    });
  }
  highlightHTMLTag(text) {
    const textColor = "\x1b[38;5;6m"; // Цвет текста (белый)
    const reset = "\x1b[0m"; // Сброс форматирования

    // Определяем тип скобок, которые нужно обрабатывать
    const openBracket = "\\<";
    const closeBracket = "\\>";

    // Создаём регулярное выражение для поиска текста в скобках
    const regex = new RegExp(
      `${openBracket}([^${closeBracket}]+)${closeBracket}`,
      "g"
    );

    // Заменяем найденный текст без скобок, добавляя фон и пробелы
    return text.replace(regex, (match) => {
      return `${textColor}${match}${reset}`;
    });
  }
}

module.exports = TestReporter;
