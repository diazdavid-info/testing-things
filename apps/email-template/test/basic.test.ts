import { assert, describe, expect, it, test } from "vitest"

describe("basic", () => {
  it("Should nothing", async () => {
    expect(true).toBe(true)
  })

  test("Math.sqrt()", () => {
    expect(Math.sqrt(4)).toBe(2)
    expect(Math.sqrt(144)).toBe(12)
    expect(Math.sqrt(2)).toBe(Math.SQRT2)
  })

  test("JSON", () => {
    const input = {
      foo: "hello",
      bar: "world",
    }

    const output = JSON.stringify(input)

    expect(output).eq('{"foo":"hello","bar":"world"}')
    assert.deepEqual(JSON.parse(output), input, "matches original")
  })
})
