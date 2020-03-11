const chrome = require("chrome-aws-lambda")
const puppeteer = require("puppeteer-core")

let _page = null
const getPage = async () => {
  if (_page) {
    return _page
  }
  const browser = await puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: chrome.headless,
  })

  _page = await browser.newPage()
  return _page
}

const getScreenshot = async (url, size) => {
  const page = await getPage()
  await page.setViewport({ width: size, height: size })
  await page.goto(url)
  const file = await page.screenshot({ type: "png" })
  return file
}

module.exports = {
  getPage,
  getScreenshot
}
