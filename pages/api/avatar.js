import Cors from "micro-cors"
import { getHtml } from "../../src/utils/template"
import { getScreenshot } from "../../src/utils/chromium"
import { parseQuery } from "../../src/utils/parser"
import { writeTempFile, pathToFileURL } from "../../src/utils/file"

const cors = Cors()

module.exports = cors(async (req, res) => {
  try {
    const options = parseQuery(req)

    const html = getHtml(options)
    if (process.env.HTML_DEBUG === "1") {
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
