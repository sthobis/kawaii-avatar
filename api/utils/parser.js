const { parse } = require("url")

const defaultOptions = {
  size: 300,
  type: [
    "Backpack",
    "Browser",
    "Cat",
    "CreditCard",
    "File",
    "Ghost",
    "IceCream",
    "Mug",
    "Planet",
    "SpeechBubble"
  ],
  mood: ["blissful", "lovestruck", "happy", "excited", "sad", "shocked"],
  color: [
    "rgb(252,203,126)",
    "rgb(166,225,145)",
    "rgb(253,167,220)",
    "rgb(224,228,232)",
    "rgb(131,209,251)"
  ],
  background: "rgba(255,255,255)"
}

const parseQuery = req => {
  const { query = {} } = parse(req.url || "", true)
  const { username, size, type, mood, color, background } = query

  return {
    username,
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
