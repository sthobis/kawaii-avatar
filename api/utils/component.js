const React = require("react")
const ReactKawaii = require("react-kawaii")

const strToAsciiSum = str => {
  if (typeof str !== "string" || !str) {
    return 0
  }

  return str.split("")
    .map(char => char.charCodeAt(0))
    .reduce((sum, current) => sum + current)
}

const serialize = (type, mood, color) => {
  let typeSelection = Array.isArray(type) ? type : [type]
  let moodSelection = Array.isArray(mood) ? mood : [mood]
  let colorSelection = Array.isArray(color) ? color : [color]

  let avatarSelection = []
  typeSelection.forEach(t => {
    moodSelection.forEach(m => {
      colorSelection.forEach(c => {
        avatarSelection.push({
          type: t,
          mood: m,
          color: c
        })
      })
    })
  })

  return avatarSelection
}

const Avatar = ({ username, size, type, mood, color }) => {
  const serializedProps = serialize(type, mood, color)
  const props = serializedProps[strToAsciiSum(username) % serializedProps.length]
  const Avatar = ReactKawaii[props.type]

  return (
    React.createElement(
      Avatar,
      {
        size: Math.round(size * 0.6),
        mood: props.mood,
        color: props.color
      },
      null
    )
  )
}

module.exports = {
  Avatar
}
