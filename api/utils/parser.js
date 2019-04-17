const { parse } = require("url")
const defaultOptions = require("../../options.json")

const restrictSize = size => {
  const number = parseInt(size)

  if (isNaN(number)) {
    return size
  } else if (number < 10) {
    return 10
  } else if (number > 1000) {
    return 1000
  }
  return number
}

const toArrayIfTruthy = str => {
  return str ? str.split(",").filter(i => i) : str
}

const parseQuery = req => {
  const { query = {} } = parse(req.url || "", true)
  let { username, size, type, mood, color, background } = query
  type = toArrayIfTruthy(type)
  mood = toArrayIfTruthy(mood)
  color = toArrayIfTruthy(color)

  return {
    username: username || defaultOptions.username,
    size: restrictSize(size) || defaultOptions.size,
    type: type || defaultOptions.type,
    mood: mood || defaultOptions.mood,
    color: color || defaultOptions.color,
    background: background || defaultOptions.background
  }
}

module.exports = {
  parseQuery
}
