const { parse } = require("url")
const defaultOptions = require("../../options.json")

const parseQuery = req => {
  const { query = {} } = parse(req.url || "", true)
  const { username, size, type, mood, color, background } = query

  return {
    username: username || defaultOptions.username,
    size: parseInt(size) || defaultOptions.size,
    type: type || defaultOptions.type,
    mood: mood || defaultOptions.mood,
    color: color || defaultOptions.color,
    background: background || defaultOptions.background
  }
}

module.exports = {
  parseQuery
}
