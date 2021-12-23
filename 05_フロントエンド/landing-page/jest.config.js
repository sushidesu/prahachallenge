const hq = require("alias-hq")

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  testEnvironment: "jsdom",
  moduleNameMapper: hq.get('jest'),
  transform: {
    "^.+\\.tsx?$": "esbuild-jest"
  }
}

module.exports = config
