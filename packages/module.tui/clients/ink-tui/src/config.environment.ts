import { join, resolve } from "node:path"
import dotenv from "dotenv"
import dotenvExpand from "dotenv-expand"

dotenvExpand.expand(
  dotenv.config({
    path: resolve(".z3r0bootrc"),
  })
)

const DEFAULTS = {
  ZB_HOME: ".z3r0boot",
  ZB_IGNORE_FILE: ".gitignore",
  ZB_DATABASE_HOME: join(".z3r0boot", "db"),
  ZB_STATE_HOME: join(".z3r0boot", "state"),
} as const

Object.entries(DEFAULTS).forEach(([key, value]) => {
  process.env[key] = process.env[key] ?? value
})

export const getEnvironmentVariable = (key: keyof typeof DEFAULTS): string => {
  const value = process.env[key]

  if (value === undefined) {
    throw new Error(`Missing environment variable: ${key}`)
  }

  return value
}
