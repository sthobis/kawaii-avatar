const cors = require("micro-cors")()
const { getHtml } = require("./utils/template")
const { getScreenshot } = require("./utils/chromium")
const { parseQuery } = require("./utils/parser")
const { writeTempFile, pathToFileURL } = require("./utils/file")

const isHtmlDebug = process.env.HTML_DEBUG === "1"

module.exports = cors(async (req, res) => {
  try {
    const options = parseQuery(req)

    const html = getHtml(options)
    if (isHtmlDebug) {
      res.statusCode = 200
      res.setHeader('Content-Type', 'text/html')
      res.end(html)
      return
    }

    const { username, size } = options
    const filePath = await writeTempFile(username, html)
    const fileUrl = pathToFileURL(filePath)
    const file = await getScreenshot(fileUrl, size)

    res.statusCode = 200
    res.setHeader('Content-Type', `image/png`)
    res.setHeader('Cache-Control', `public, immutable, no-transform, max-age=31536000`)
    res.end(file)
  } catch (err) {
    console.error(err)
    res.statusCode = 500
    res.end()
  }
})
