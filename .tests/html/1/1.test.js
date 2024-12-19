const fs = require("fs");
const path = require("path");
require("@testing-library/jest-dom");

describe("[HTML] [1-1-1] Какие основные элементы существуют?", () => {
  describe("<html>", () => {
    let $html;
    let html;
    beforeAll(() => {
      html = fs.readFileSync("src/index.html", "utf8");

      document.documentElement.innerHTML = html;
      $html = document.documentElement;
    });

    describe("<head>", () => {
      let $head;
      beforeAll(() => {
        $head =
          ((html.includes("<head>") && html.includes("</head>")) || null) &&
          $html.querySelector("head");
      });

      test("Использовать элемент", () => {
        expect($head).toBeInTheDocument();
      });

      describe("<meta>", () => {
        let $meta;
        beforeAll(() => {
          $meta = $head.querySelector("meta");
        });

        test("Использовать элемент", () => {
          expect($meta).toBeInTheDocument();
        });

        test("Установить кодировку [UTF-8]", () => {
          expect($meta).toHaveAttribute("charset", "UTF-8");
        });
      });

      describe("<title>", () => {
        let $title;
        beforeAll(() => {
          $title = $head.querySelector("title");
        });

        test("Использовать элемент", () => {
          expect($title).toBeInTheDocument();
        });

        test("Установить заголовок страницы [dex-blog]", () => {
          expect($title).toHaveTextContent("dex-blog");
        });
      });

      describe("<link>", () => {
        let $link;
        beforeAll(() => {
          $link = $head.querySelector("link");
        });

        test("Использовать элемент", () => {
          expect($link).toBeInTheDocument();
        });
      });

      describe("<style>", () => {
        let $style;
        beforeAll(() => {
          $style = $head.querySelector("style");
        });

        test("Использовать элемент", () => {
          expect($style).toBeInTheDocument();
        });
      });

      describe("<script>", () => {
        let $script;
        beforeAll(() => {
          $script = $head.querySelector("script");
        });

        test("Использовать элемент", () => {
          expect($script).toBeInTheDocument();
        });
      });
    });

    describe("<body>", () => {
      let $body;
      beforeAll(() => {
        $body =
          ((html.includes("<body>") && html.includes("</body>")) || null) &&
          $html.querySelector("body");
      });

      test("Использовать элемент", () => {
        expect($body).toBeInTheDocument();
      });
    });
  });
});
