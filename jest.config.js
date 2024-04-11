const config = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.js?(x)", "**/?(*.)+(spec|test).js?(x)"],
  modulePathIgnorePatterns: ["mockModels.js"],
  verbose: true,
  testTimeout: 30000,
};

module.exports = config;
