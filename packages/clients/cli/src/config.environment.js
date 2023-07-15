import { join, resolve } from "node:path"
import * as dotenv from "dotenv"

dotenv.config({
  path: resolve(process.cwd(), ".z3r0bootrc"),
})

/** @type {[string, string][]} */
const DEFAULTS = [
  ["ZB_HOME", ".z3r0boot"],
  ["ZB_IGNORE_FILE", ".gitignore"],
  ["ZB_DATABASE_HOME", join(".z3r0boot", "db")],
]

DEFAULTS.forEach(([key, value]) => {
  process.env[key] = process.env[key] ?? value
})
