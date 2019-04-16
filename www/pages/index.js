import React, { useState, useEffect, useRef } from "react"
import defaultOptions from "../../options.json"

const useInput = (id, initialValue, validate) => {
  const [value, setValue] = useState(initialValue)

  const onChange = e => {
    setValue(e.target.value)
  }

  const timeoutRef = useRef(null)
  useEffect(() => {
    if (validate) {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = window.setTimeout(() => {
        validate(value)
      }, 500)
    }
  }, [value])

  return { id, value, onChange }
}

const Page = ({ origin }) => {
  const [validationMessage, setValidationMessage] = useState({})

  const username = useInput("username", "")
  const size = useInput("size", "", value => {
    let errors = []
    const number = parseInt(value)

    if (value && isNaN(number)) {
      errors.push("Size must be a number")
    }
    if (number < 10 || number > 1000) {
      errors.push("Size must be between 10 and 1000")
    }
    if (errors.length) {
      setValidationMessage(prev => ({ ...prev, size: errors }))
    } else {
      setValidationMessage(prev => ({ ...prev, size: null }))
    }
  })
  const type = useInput("type", "", value => {
    let wrongValues = []
    value.split(",").forEach(item => {
      if (item && !defaultOptions.type.find(str => str === item)) {
        wrongValues.push(item)
      }
    })
    if (wrongValues.length) {
      let errors = []
      errors.push(`Type must be one of the following: ${defaultOptions.type.join(", ")}`)
      errors.push(`Replace the following: ${wrongValues.join(", ")}`)
      setValidationMessage(prev => ({ ...prev, type: errors }))
    } else {
      setValidationMessage(prev => ({ ...prev, type: null }))
    }
  })
  const mood = useInput("mood", "", value => {
    let wrongValues = []
    value.split(",").forEach(item => {
      if (item && !defaultOptions.mood.find(str => str === item)) {
        wrongValues.push(item)
      }
    })
    if (wrongValues.length) {
      let errors = []
      errors.push(`Mood must be one of the following: ${defaultOptions.mood.join(", ")}`)
      errors.push(`Replace the following: ${wrongValues.join(", ")}`)
      setValidationMessage(prev => ({ ...prev, mood: errors }))
    } else {
      setValidationMessage(prev => ({ ...prev, mood: null }))
    }
  })
  const color = useInput("color", "", value => {
    let wrongValues = []
    value.split(",").forEach(item => {
      if (item && item.startsWith("#")) {
        wrongValues.push(item)
      }
    })
    if (wrongValues.length) {
      let errors = []
      errors.push("Use rgb format or color name e.g. 'pink'")
      errors.push(`Replace the following: ${wrongValues.join(", ")}`)
      setValidationMessage(prev => ({ ...prev, color: errors }))
    } else {
      setValidationMessage(prev => ({ ...prev, color: null }))
    }
  })
  const background = useInput("background", "", value => {
    if (value && value.startsWith("#")) {
      let errors = []
      errors.push("Use rgb format or color name e.g. 'pink'")
      setValidationMessage(prev => ({ ...prev, background: errors }))
    } else {
      setValidationMessage(prev => ({ ...prev, background: null }))
    }
  })

  const getImageSource = () => {
    const options = {
      username,
      size,
      type,
      mood,
      color,
      background
    }
    const searchParams = Object.keys(options).map(key =>
      options[key].value ? `${key}=${options[key].value}` : ""
    ).filter(i => i).join("&")
    return `${origin}${searchParams ? "/?" + searchParams : ""}`
  }

  const [imageSrc, setImageSrc] = useState(getImageSource())
  const timeoutRef = useRef(null)
  useEffect(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = window.setTimeout(() => {
      setImageSrc(getImageSource())
    }, 500)
  }, [username, size, type, mood, color, background])

  return (
    <div>
      <header>
        <h1>Kawaii Avatar</h1>
      </header>
      <section className="container">
        <div className="controls">
          {[username, size, type, mood, color, background].map(item => (
            <div key={item.id} className="field">
              <label htmlFor={item.id}>{item.id}</label>
              <input {...item} />
              {validationMessage[item.id] && (
                validationMessage[item.id].map((error, i) => (
                  <p key={i} className="validation-error">{error}</p>
                ))
              )}
            </div>
          ))}
        </div>
        <div className="avatar">
          <img src={imageSrc} alt={`kawaii avatar for ${username.value}`} />
          <h2>Image Link</h2>
          <code>{getImageSource()}</code>
        </div>
      </section>
      <section className="description">
        <h2>What is this?</h2>
        <p>Kawaii-avatar is a deterministic user avatar generator for your projects.</p>
        <h2>Why?</h2>
        <p>Because most default avatar on the web is boring, and not k-kawaii..</p>
        <h2>How to use it?</h2>
        <p>You can inline it on your avatar image source</p>
        <code>&lt;img src="https://kawaii-avatar.now.sh/?username=sthobis" alt="sthobis's avatar" /&gt;</code>
      </section>
      <footer>
        <p>Made by <a href="https://github.com/sthobis">sthobis</a></p>
        <p>Source available on <a href="https://github.com/sthobis/kawaii-avatar">github</a></p>
      </footer>
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html, body {
          height: 100%;
        }

        body {
          margin: 0;
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing:grayscale;
          background-color: #363dc2;
          font-size: 16px;
          line-height: 1.6;
          font-weight: 400;
        }

        a {
          color: white;
        }

        strong {
          color: white;
          font-weight: 600;
        }

        code {
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;
          font-size: 0.9em;
          background: rgba(0, 0, 0, 0.2);
          padding: 10px;
          border-radius: 4px;
        }

        ::selection {
          background: #a031a7;
          color: white;
        }

        ::-moz-selection {
          background: #a031a7;
          color: white;
        }

        h1 {
          text-align: center;
          margin: 40px 0 10px 0;
        }

        section {
          padding: 40px;
          text-align: center;
        }

        .container {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: left;
          padding-bottom: 0;
        }

        .controls {
          width: 240px;
          margin: 0 40px 0 0;
        }

        .field {
          margin: 0 0 10px 0;
        }

        label {
          display: block;
          font-weight: 500;
          text-transform: capitalize;
          margin: 0 0 5px 0;
        }

        input {
          width: 100%;
          border: none;
          border-radius: 4px;
          padding: 8px 10px;
          margin: 0 0 10px 0;
        }

        input:focus {
          outline-color: #a031a7;
        }

        .validation-error {
          font-size: 13px;
          margin: 0 0 2px 0;
        }

        .avatar {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 300px;
          height: 300px;
        }

        img {
          width: auto;
          max-width: 100%;
          border-radius: 4px;
        }

        .avatar h2 {
          margin: 20px 0 10px 0;
        }

        .avatar code {
          word-break: break-all;
        }

        .description h2 {
          margin: 20px 0 5px 0;
        }

        .description p {
          margin: 0 0 10px 0;
        }

        footer {
          padding: 40px;
          text-align: center;
        }

        footer p {
          margin: 0;
        }
      `}</style>
    </div>
  )
}

Page.getInitialProps = ({ req  }) => {
  const isDev = process.env.NOW_REGION === "dev1"
  const protocol = isDev ? "http" : "https"
  const host = isDev ? "localhost:3001" : req.headers.host

  return { origin: `${protocol}://${host}` }
}

export default Page
