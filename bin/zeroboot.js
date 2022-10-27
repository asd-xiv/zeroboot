#!/usr/bin/env node

import { exec } from "node:child_process"
import path from "node:path"
import { mkdir } from "node:fs/promises"
import { program, Option } from "commander"
import { isNil } from "rambda"

import chalk from "chalk"
const { cyan, red, green } = chalk

import { CONFIG, SPINNER } from "../src/config.js"
import { build } from "../src/index.js"
import {
  getPackageInfo,
  getNodeVersion,
  checkIfDirectoryIsEmpty,
} from "../src/core.libs/node.js"

/**
 * Node.js version guard
 */

const required = 16
const [major] = getNodeVersion()

if (major < required) {
  SPINNER.fail(
    `You are running Node ${red(`v${major}`)}, Zeroboot requires Node ${green(
      `v${required}`
    )} or higher.`
  )

  process.exit(1)
}

/**
 * Git executable guard
 */

exec("git --version", error => {
  if (error) {
    SPINNER.fail(
      `${cyan(
        '"git"'
      )} executable not found, Zeroboot requires Git to be installed.`
    )

    process.exit(1)
  }
})

const { name, description, version } = await getPackageInfo()

program
  .name(name)
  .description(description)
  .version(version, "-v, --version", "Display version number")
  .helpOption("-h, --help", "Display help for command")

program
  .command("build")
  .option("-d, --debug", "Enable debug mode")
  .argument("[destination]", "Folder path", "./")
  .action((destination, options) => {
    const destinationPath = path.resolve(destination)

    if (!isNil(options.debug)) {
      CONFIG.DEBUG = true
    }

    SPINNER.info(`Destination ${cyan(destinationPath)}`).start(
      "Checking if destination exists and is empty ..."
    )

    return checkIfDirectoryIsEmpty(destinationPath)
      .catch(error => {
        if (error.code === "ENOENT") {
          SPINNER.succeed().start(`Directory does not exist, creating it ...`)

          return mkdir(destinationPath)
        }

        throw error
      })
      .then(() => {
        SPINNER.succeed()

        return build({ destinationPath })
      })
      .catch(error => {
        SPINNER.fail(error.message)
        process.exit(1)
      })
  })

program
  .command("ls")
  .description("List all available templates")
  .addOption(
    new Option("-c, --component [name]", "drink size")
      .choices(["template", "chunk"])
      .default("template")
  )
  .action(options => {
    console.log("ls", { options })
  })

program.parse(process.argv)
