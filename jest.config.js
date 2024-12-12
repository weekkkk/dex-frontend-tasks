module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.html$": "html-loader-jest",
  },
  testMatch: ["**/.tests/**/*.js"],
  reporters: ["<rootDir>/.tools/test-reporter.js"],
};
