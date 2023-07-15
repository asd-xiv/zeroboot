#!/usr/bin/env node

import { join } from "node:path"
import { getPackageInfo } from "@z3r0boot/pure-utils"
import { Option, program } from "commander"

import "../src/config.environment.js"
import { log } from "../src/config.log.js"
import { converse } from "./cmd.converse.js"
import { generateEmbeddings } from "./cmd.generate-embeddings.js"

const DIRNAME = new URL(".", import.meta.url).pathname
const PKG = await getPackageInfo(join(DIRNAME, "..", "package.json"))

program.name("z3r0boot").version(PKG.version).description(PKG.description)

program
  .command("generate-embeddings")
  .argument("[folder]", "Folder to scan and create embeddings for", "./")
  .addOption(
    new Option("-i, --ignore <file>", "Location of ignore file")
      .default(".gitignore")
      .env("ZB_IGNORE_FILE")
  )
  .option("-c, --clean", "Clean up existing embeddings cache", false)
  .option("-b, --bail", "Exit right after first error", false)
  .action((folder, options) =>
    generateEmbeddings(folder, {
      shouldResetCache: options.clean,
      shouldBailOnFirstError: options.bail,
      shouleGenerateSummaries: true,
      ignoreFile: options.ignore,
      onBail: error => {
        log.error("Exiting due to --bail")
        console.log(error)
        process.exit(1)
      },
    })
  )

program.command("converse").action(() => {
  converse()
})

program.parse(process.argv)
