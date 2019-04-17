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

const getSize = (type, size) => {
  switch (type) {
    case "Browser":
    case "CreditCard":
    case "Mug":
    case "SpeechBubble":
      return size * 0.45
    default:
      return size * 0.6
  }
}

const Avatar = ({ username, size, type, mood, color }) => {
  const serializedProps = serialize(type, mood, color)
  const props = serializedProps[strToAsciiSum(username) % serializedProps.length]
  const Avatar = ReactKawaii[props.type]

  return (
    React.createElement(
      React.Fragment,
      null,
      React.createElement(
        Avatar,
        {
          size: Math.round(getSize(props.type, size)),
          mood: props.mood,
          color: props.color
        },
        null
      ),
      // File type is not centered, so we need to 
      // center it by using css transform
      // https://github.com/miukimiu/react-kawaii/issues/71
      props.type === "File" ? (
        React.createElement(
          "style",
          null,
          "#kawaii-file{transform:translateX(23.6%);}"
        )
      ) : undefined,
      // Slight adjustment for mug position
      // because mug's shape (handle) gives
      // a lot of whitespace on its left side
      // which makes it look not centered
      props.type === "Mug" ? (
        React.createElement(
          "style",
          null,
          "svg{transform:translateX(-3%);}"
        )
      ) : undefined
    )
  )
}

module.exports = {
  Avatar
}
