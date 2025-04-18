import { describe, expect, it } from "vitest"
import { convertToHtml } from "@/libs/converter.ts"

describe("convertToHtml", () => {
  const cases: [any, any][] = [
    [{ html: {} }, '<html dir="ltr" lang="en"><head></head></html>'],
    [
      { html: { lang: "en", dir: "rtl" } },
      '<html dir="rtl" lang="en"><head></head></html>',
    ],
    [{ body: {} }, "<body></body>"],
    [
      { button: {} },
      '<a style="line-height:100%;text-decoration:none;display:inline-block;max-width:100%;mso-padding-alt:0px;padding:0px 0px 0px 0px" target="_blank"><span><!--[if mso]><i style="mso-font-width:0%;mso-text-raise:0" hidden></i><![endif]--></span><span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:0"></span><span><!--[if mso]><i style="mso-font-width:0%" hidden>&#8203;</i><![endif]--></span></a>',
    ],
    [
      {
        button: { href: "https://example.com", style: { color: "red" } },
      },
      '<a href="https://example.com" style="line-height:100%;text-decoration:none;display:inline-block;max-width:100%;mso-padding-alt:0px;color:red;padding:0px 0px 0px 0px" target="_blank"><span><!--[if mso]><i style="mso-font-width:0%;mso-text-raise:0" hidden></i><![endif]--></span><span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:0"></span><span><!--[if mso]><i style="mso-font-width:0%" hidden>&#8203;</i><![endif]--></span></a>',
    ],
    [
      { head: {} },
      '<head><meta content="text/html; charset=UTF-8" http-equiv="Content-Type"/><meta name="x-apple-disable-message-reformatting"/></head>',
    ],
    [
      { container: {} },
      '<table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em"><tbody><tr style="width:100%"><td></td></tr></tbody></table>',
    ],
    [{ column: {} }, '<td data-id="__react-email-column"></td>'],
    [
      { row: {} },
      '<table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation"><tbody style="width:100%"><tr style="width:100%"></tr></tbody></table>',
    ],
    [
      { font: {} },
      "<style> @font-face { font-family: 'undefined'; font-style: normal; font-weight: 400; mso-font-alt: 'undefined'; } * { font-family: 'undefined', undefined; } </style>",
    ],
    [{ heading: {} }, "<h1></h1>"],
    [
      { hr: {} },
      '<hr style="width:100%;border:none;border-top:1px solid #eaeaea"/>',
    ],
    [
      { img: {} },
      '<img style="display:block;outline:none;border:none;text-decoration:none"/>',
    ],
    [
      { link: {} },
      '<a style="color:#067df7;text-decoration-line:none" target="_blank"></a>',
    ],
    [
      { section: {} },
      '<table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation"><tbody><tr><td></td></tr></tbody></table>',
    ],
    [
      { text: {} },
      '<p style="font-size:14px;line-height:24px;margin-bottom:16px;margin-top:16px"></p>',
    ],
  ]
  it.each(cases)("Should convert %j correctly", (input, expected) => {
    const result = convertToHtml(input)

    expect(result.replace(/(\r\n|\n|\r)/gm, "").replace(/\s+/g, " ")).toBe(
      expected,
    )
  })
  it("Should convert component with props correctly", async () => {
    const result = convertToHtml({
      link: { href: "https://example.com" },
    })

    expect(result).toBe(
      '<a href="https://example.com" style="color:#067df7;text-decoration-line:none" target="_blank"></a>',
    )
  })
  it("Should convert component with children correctly", async () => {
    const result = convertToHtml({
      section: {
        children: [
          {
            row: { children: [{ column: { children: [{ text: "asasa" }] } }] },
          },
        ],
      },
    })

    expect(result).toBe(
      '<table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation"><tbody><tr><td><table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation"><tbody style="width:100%"><tr style="width:100%"><td data-id="__react-email-column"><p style="font-size:14px;line-height:24px;margin-bottom:16px;margin-top:16px">asasa</p></td></tr></tbody></table></td></tr></tbody></table>',
    )
  })
})
