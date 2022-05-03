module.exports = {
  roots: ["<rootDir>/tests"],
  setupFiles: ["<rootDir>/tests/setup.js"],
  collectCoverageFrom: ["<rootDir>/src/**/*.s", "!**/node_modules/**"],
};
