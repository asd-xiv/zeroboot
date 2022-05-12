import async from "async"
import metalsmith, { Plugin } from "metalsmith"
import { handlebars } from "consolidate"
import inquirer from "inquirer"

const __dirname = new URL("../", import.meta.url).pathname

const template: Plugin = (files, m) => {
  const filePaths = Object.keys(files)
  const metadata = m.metadata() as Record<string, string>

  async.each(filePaths, (file, nextFile) => {
    const fileContent = files[file].contents.toString()

    handlebars.render(fileContent, metadata, (error, response) => {
      if (error) {
        return nextFile(error)
      }

      files[file].contents = Buffer.from(response)
      nextFile()
    })
  })
}

inquirer
  .prompt([
    {
      type: "checkbox",
      message: "Select toppings",
      name: "toppings",
      choices: [
        new inquirer.Separator(" = The Meats = "),
        { name: "Pepperoni" },
        { name: "Ham" },
        { name: "Ground Meat" },
        { name: "Bacon" },
        new inquirer.Separator(" = The Cheeses = "),
        { name: "Mozzarella", checked: true },
        { name: "Cheddar" },
        { name: "Parmesan" },
        new inquirer.Separator(" = The usual ="),
        { name: "Mushroom" },
        { name: "Tomato" },
        new inquirer.Separator(" = The extras = "),
        { name: "Pineapple" },
        { name: "Olives", disabled: "out of stock" },
        { name: "Extra cheese" },
      ],
      validate: (answer: string) => {
        if (answer.length === 0) {
          return "You must choose at least one topping."
        }

        return true
      },
    },
  ])
  .then(answers => {
    console.log({ answers })

    metalsmith(__dirname)
      .use(template)
      .build(error => {
        if (error) {
          throw error
        }
      })
  })
  .catch(error => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  })
