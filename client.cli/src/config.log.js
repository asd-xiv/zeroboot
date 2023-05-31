import debug from "debug"

const debuger = debug("zb")

debug.enable("zb:*")

export const log = {
  info: debuger.extend("info"),
  warn: debuger.extend("warn"),
  error: debuger.extend("error"),
  verbose: debuger.extend("verbose"),
}
