module.exports = {
  testEnvironment: "node",
  verbose: true,
  coveragePathIgnorePatterns: ["/node_modules/"],
  projects: [{
    "displayName": "MyWorld Cadence Tests",
    "testMatch": ["<rootDir>/**/*.test.js"]
    // "testMatch": ["<rootDir>/My*.test.js"]
  }]
};