// jest.config.ts
import type { Config } from "@jest/types"

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  automock: false,
  setupFiles: [
    "./jest.setup.ts",
    "jest-localstorage-mock"
  ]
}
export default config
