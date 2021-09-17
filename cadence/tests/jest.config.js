module.exports = {
  testEnvironment: "node",
  verbose: true,
  coveragePathIgnorePatterns: ["/node_modules/"],
  projects: [{
    "displayName": "MyMarketplace",
    // "testMatch": ["<rootDir>/*.test.js"]
    "testMatch": ["<rootDir>/My*.test.js"]
  }]
};