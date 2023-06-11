import { join, resolve } from "node:path"
import dotenv from "dotenv"
import dotenvExpand from "dotenv-expand"

dotenvExpand.expand(
  dotenv.config({
    path: resolve(".z3r0bootrc"),
  })
)

const DEFAULTS: Array<[string, string]> = [
  ["ZB_HOME", ".z3r0boot"],
  ["ZB_IGNORE_FILE", ".gitignore"],
  ["ZB_DATABASE_HOME", join(".z3r0boot", "db")],
]

DEFAULTS.forEach(([key, value]) => {
  process.env[key] = process.env[key] ?? value
})
