import dotenv from "dotenv"
import dotenvExpand from "dotenv-expand"
import { render } from "ink"

dotenvExpand.expand(dotenv.config())

import { ComputerTUI } from "./app.js"

export const startTUIApp = () => render(<ComputerTUI />)
