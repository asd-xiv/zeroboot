import { promisify } from "node:util"
import { handlebars } from "consolidate"
import metalsmith, { Plugin } from "metalsmith"
import inquirer from "inquirer"
import glob from "glob"
import { pipe, map, join, groupBy } from "rambda"

import { Template } from "./core.types/template.js"
import { Chunk } from "./core.types/chunk.js"

const globP = promisify(glob)
const __dirname = new URL("../", import.meta.url).pathname

type FindTemplates = () => Promise<Template[]>

const findTemplates: FindTemplates = () =>
  globP(`${__dirname}/src/template.*`).then(
    pipe(
      map((filePath: string) =>
        import(filePath).then(
          (template: { default: Template }) => template.default
        )
      ),
      fileTuples => Promise.all(fileTuples)
    )
  )

type PickTemplate = (templates: Template[]) => Promise<Template>

const pickTemplate: PickTemplate = templates =>
  inquirer
    .prompt([
      {
        name: "template",
        type: "rawlist",
        message: "Select template",
        choices: map(
          template => ({ value: template, name: template.name }),
          templates
        ),
      },
    ])
    .then(({ template }) => template)

type ChooseChunks = (template: Template) => Promise<string[]>

const chooseChunks: ChooseChunks = template =>
  inquirer
    .prompt([
      {
        name: "chunks",
        type: "checkbox",
        message: "Select chunks",
        suffix: ` (${join(", ", template.init.chunks.required)})`,
        choices: template.init.chunks.optional,
      },
    ])
    .then(({ chunks }) => [...template.init.chunks.required, ...chunks])

type FindFilesByChunk = (chunks: string[]) => {
  chunks: string[]
  filesByChunk: Record<string, string[]>
}

const findFilesByChunk: FindFilesByChunk = chunks => {
  const files = pipe(
    join("|"),
    chunksPattern => `${__dirname}/src/chunk.?(${chunksPattern})/content/**/*`,
    filePattern => glob.sync(filePattern, { dot: true }),
    groupBy(
      (file: string) => chunks.find(chunk => file.includes(chunk)) as string
    )
  )(chunks)

  return {
    chunks,
    filesByChunk: files,
  }
}

type RenderTemplates = (input: {
  chunks: string[]
  filesByChunk: Record<string, string[]>
}) => void

const renderTemplates: RenderTemplates = () => {}

findTemplates()
  .then(pickTemplate)
  .then(chooseChunks)
  .then(findFilesByChunk)
  .then(renderTemplates)
  .catch(error => {
    console.log(error)
  })
