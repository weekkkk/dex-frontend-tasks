module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.html$": "html-loader-jest",
  },
  testMatch: ["**/.tests/**/*.js"],
  setupFilesAfterEnv: ["<rootDir>/.tools/setup-jest.js"],
  reporters: ["<rootDir>/.tools/test-reporter.js"],
};
