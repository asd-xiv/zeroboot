import test from "tape"

test("command build: empty test", t => {
  t.equal(1, 1, "given [multiple parameter] should [return the correct sum]")

  t.end()
})
