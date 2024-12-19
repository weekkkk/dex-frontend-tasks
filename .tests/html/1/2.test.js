const fs = require("fs");
require("@testing-library/jest-dom");
const { TextEncoder, TextDecoder } = require("util");

// Глобально определяем TextEncoder и TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
const { JSDOM } = require("jsdom");

describe("[HTML] [1-1-2] Что такое <meta>, <script>?", () => {
  let $html;
  let alertSpy;
  beforeAll(() => {
    const html = fs.readFileSync("src/index.html", "utf8");

    const dom = new JSDOM(html, {
      runScripts: "dangerously", // Выполнение скриптов
      resources: "usable", // Подключение ресурсов
    });
    global.window = dom.window;

    alertSpy = jest.spyOn(global.window, "alert").mockImplementation(() => {});

    // window.document.documentElement.innerHTML = html;
    $html = dom.window.document.documentElement;
  });

  describe("<meta>", () => {
    let $head;
    beforeAll(() => {
      $head = $html.querySelector("head");
    });

    describe("Название приложения", () => {
      let $meta;
      beforeAll(() => {
        $meta = $head.querySelector('meta[name="application-name"]');
      });

      test('Использовать <meta> c атрибутом [name="application-name"]', () => {
        expect($meta).toBeInTheDocument();
      });
      test("Использовать <meta> c уставленным атрибутом [content]", () => {
        expect($meta).toHaveAttribute("content");
      });
    });

    describe("Автора приложения", () => {
      let $meta;
      beforeAll(() => {
        $meta = $head.querySelector('meta[name="author"]');
      });

      test('Использовать <meta> c атрибутом [name="author"]', () => {
        expect($meta).toBeInTheDocument();
      });
      test("Использовать <meta> c уставленным атрибутом [content]", () => {
        expect($meta).toHaveAttribute("content");
      });
    });

    describe("Описание страницы", () => {
      let $meta;
      beforeAll(() => {
        $meta = $head.querySelector('meta[name="description"]');
      });

      test('Использовать <meta> c атрибутом [name="description"]', () => {
        expect($meta).toBeInTheDocument();
      });
      test("Использовать <meta> c уставленным атрибутом [content]", () => {
        expect($meta).toHaveAttribute("content");
      });
    });

    describe("Ключевые слова страницы", () => {
      let $meta;
      beforeAll(() => {
        $meta = $head.querySelector('meta[name="keywords"]');
      });

      test('Использовать <meta> c атрибутом [name="keywords"]', () => {
        expect($meta).toBeInTheDocument();
      });
      test("Использовать <meta> c уставленным атрибутом [content]", () => {
        expect($meta).toHaveAttribute("content");
      });
    });
  });

  describe("<script>", () => {
    let $script;
    beforeAll(() => {
      $script = $html.querySelector("head script");
    });

    jest.setTimeout(10000); // Устанавливаем тайм-аут в 10 секунд для теста

    test("Использовать [alert] для вывода диалогового окна с тестом [Приветствуем в нашем блоге]", () => {
      expect(alertSpy).toHaveBeenCalledWith("Приветствуем в нашем блоге");
      alertSpy.mockRestore();
    });
  });
});
