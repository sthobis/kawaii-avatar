const chrome = require("chrome-aws-lambda")
const puppeteer = require("puppeteer-core")

const isDev = process.env.NOW_REGION === "dev1"

const exePath = "./node_modules/puppeteer/.local-chromium/win64-641577/chrome-win/chrome.exe"
const getLaunchOptions = async () => {
  return isDev
    ? {
        args: [],
        executablePath: exePath,
        headless: true,
    }
    : {
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless
    }
}

let _page = null
const getPage = async () => {
  if (_page) {
    return _page
  }
  const browser = await puppeteer.launch(await getLaunchOptions())
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
