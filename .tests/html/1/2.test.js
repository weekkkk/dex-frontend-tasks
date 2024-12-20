const fs = require("fs");
require("@testing-library/jest-dom");
const { JSDOM } = require("jsdom");

describe("[HTML] [1-1-2] Что такое <meta>, <script>?", () => {
  let $html;
  let alertSpy;
  beforeAll(() => {
    const html = fs.readFileSync("src/index.html", "utf8");

    const dom = new JSDOM(html, {
      runScripts: "dangerously",
      resources: "usable",
      beforeParse(window) {
        alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
      },
    });

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
    let $btn;
    beforeAll(() => {
      $btn = $html.querySelector("button");
    });

    jest.setTimeout(10000); // Устанавливаем тайм-аут в 10 секунд для теста

    test("Использовать [alert] для вывода диалогового окна с тестом [Приветствуем в нашем блоге]", () => {
      expect(alertSpy).toHaveBeenCalledWith("Приветствуем в нашем блоге");
      alertSpy.mockRestore();
    });
  });
});
