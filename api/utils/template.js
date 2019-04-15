const React = require("react")
const ReactDOMServer = require("react-dom/server")
const { sanitizeHtml } = require("./sanitizer")
const { Avatar } = require("./component")

const getCss = ({ size, background }) => {
  return `
    body {
      margin: 0;
    }

    .avatar {
      display: flex;
      justify-content: center;
      align-items: center;
      width: ${sanitizeHtml(size)}px;
      height: ${sanitizeHtml(size)}px;
      background: ${sanitizeHtml(background)};
    }
  `
}

const getHtml = (options) => {
  return (`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>Kawaii Avatar</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          ${getCss(options)}
        </style>
      </head>
      <body>
        <div class="avatar">
          ${ReactDOMServer.renderToString(
            React.createElement(Avatar, options, null)
          )}
        </div>
      </body>
    </html>
  `)
}

module.exports = {
  getHtml
}
