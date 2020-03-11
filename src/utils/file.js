const { writeFile } = require( "fs")
const { join } = require( "path")
const { createHash } = require( "crypto")
const { promisify } = require( "util")
const { tmpdir } = require( "os")

const writeFileAsync = promisify(writeFile)

const writeTempFile =  async (name, contents) => {
  const fileName = createHash("md5").update(name).digest("hex") + ".html"
  const filePath = join(tmpdir(), fileName)
  await writeFileAsync(filePath, contents)
  return filePath
}

const pathToFileURL = (path) => {
  const fileUrl = "file://" + path
  return fileUrl
}

module.exports = {
  writeTempFile,
  pathToFileURL
}