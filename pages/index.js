import React, { useState, useEffect, useRef } from "react"
import Head from "next/head"
import copy from "copy-text-to-clipboard"
import defaultOptions from "../src/options.json"

const useInput = ({
  id,
  value: initialValue,
  placeholder,
  validator,
  tag = "input"
}) => {
  const [value, setValue] = useState(initialValue)

  const onChange = e => {
    setValue(e.target.value)
  }

  const imageTimeoutRef = useRef(null)
  useEffect(() => {
    if (validator) {
      if (imageTimeoutRef.current) {
        window.clearTimeout(imageTimeoutRef.current)
      }
      imageTimeoutRef.current = window.setTimeout(() => {
        validator(value)
      }, 500)
    }
  }, [value])

  return { id, value, onChange, placeholder, tag }
}

const Page = () => {
  const [validationMessage, setValidationMessage] = useState({})

  const username = useInput({
    id: "username",
    value: "",
    placeholder: defaultOptions.username
  })
  const size = useInput({
    id: "size",
    value: "",
    placeholder: defaultOptions.size,
    validator: value => {
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
    }
  })
  const type = useInput({
    id: "type",
    value: "",
    placeholder: defaultOptions.type.join(", "),
    validator: value => {
      let wrongValues = []
      value.replace(/ /g, "").split(",").forEach(item => {
        if (item && !defaultOptions.type.find(str => str === item)) {
          wrongValues.push(item)
        }
      })
      if (wrongValues.length) {
        let errors = []
        errors.push(`Replace the following: ${wrongValues.join(", ")}`)
        errors.push(`Type must be part of: ${defaultOptions.type.join(", ")} (case-sensitive)`)
        setValidationMessage(prev => ({ ...prev, type: errors }))
      } else {
        setValidationMessage(prev => ({ ...prev, type: null }))
      }
    },
    tag: "textarea"
  })
  const mood = useInput({
    id: "mood",
    value: "",
    placeholder: defaultOptions.mood.join(", "),
    validator: value => {
      let wrongValues = []
      value.replace(/ /g, "").split(",").forEach(item => {
        if (item && !defaultOptions.mood.find(str => str === item)) {
          wrongValues.push(item)
        }
      })
      if (wrongValues.length) {
        let errors = []
        errors.push(`Replace the following: ${wrongValues.join(", ")}`)
        errors.push(`Mood must be part of: ${defaultOptions.mood.join(", ")} (case-sensitive)`)
        setValidationMessage(prev => ({ ...prev, mood: errors }))
      } else {
        setValidationMessage(prev => ({ ...prev, mood: null }))
      }
    },
    tag: "textarea"
  })
  const color = useInput({
    id: "color",
    value: "",
    placeholder: defaultOptions.color.join(", "),
    tag: "textarea"
  })
  const background = useInput({
    id: "background",
    value: "",
    placeholder: defaultOptions.background
  })

  const getImageSrc = () => {
    const options = {
      username,
      size,
      type,
      mood,
      color,
      background
    }
    const searchParams = Object.keys(options).filter(key => options[key].value)
      .map(key => {
        // remove whitespace and encode # (hash) character
        let value = options[key].value.replace(/ /g, "")
          .replace(/#/g, "%23")
        return `${key}=${value}`
      })
      .join("&")
    return `/api/avatar${searchParams ? "?" + searchParams : ""}`
  }

  const imageSrc = getImageSrc()
  const [debouncedImageSrc, setDebouncedImageSrc] = useState(imageSrc)
  const imageTimeoutRef = useRef(null)
  useEffect(() => {
    if (imageTimeoutRef.current) {
      window.clearTimeout(imageTimeoutRef.current)
    }
    imageTimeoutRef.current = window.setTimeout(() => {
      setDebouncedImageSrc(imageSrc)
    }, 500)
  }, [username, size, type, mood, color, background])

  const initialCopyText = "Click to copy"
  const [copyText, setCopyText] = useState(initialCopyText)
  const copyTimeoutRef = useRef(null)
  const onCopy = e => {
    copy("https://kawaii-avatar.now.sh" + imageSrc)
    setCopyText("copied!")
    if (copyTimeoutRef.current) {
      window.clearTimeout(copyTimeoutRef.current)
    }
    copyTimeoutRef.current = window.setTimeout(() => {
      setCopyText(initialCopyText)
    }, 1500)
  }

  return (
    <div>
      <Head>
        <title>Kawaii Avatar</title>
        <meta name="title" content="Deterministic user avatar generator for your projects" />
        <meta name="title" content="With Kawaii Avatar you can create custom illustration for your users default avatar" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kawaii-avatar.now.sh/" />
        <meta property="og:title" content="Deterministic user avatar generator for your projects" />
        <meta property="og:description" content="With Kawaii Avatar you can create custom illustration for your users default avatar" />
        <meta property="og:image" content="https://kawaii-avatar.now.sh/avatar?username=sthobis&type=CreditCard" />
        <link rel="icon" href="/icon.png" type="image/png" />
      </Head>
      <header>
        <h1>Kawaii Avatar</h1>
        <p>Kawaii (かわいい, pronounced [kaɰaiꜜi]; means "lovable", "cute", or "adorable")</p>
      </header>
      <section className="container">
        <div className="controls">
          {[username, size, background, type, mood, color].map(item => {
            const Tag = item.tag
            return (
              <div key={item.id} className="field">
                <label htmlFor={item.id}>{item.id}</label>
                <Tag {...item} />
                {validationMessage[item.id] && (
                  validationMessage[item.id].map((error, i) => (
                    <p key={i} className="validation-error">{error}</p>
                  ))
                )}
              </div>
            )
          })}
        </div>
        <div className="avatar">
          <img src={debouncedImageSrc} alt={`kawaii avatar for ${username.value}`} />
          <h2>Image Link</h2>
          <code onClick={onCopy}>
            https://kawaii-avatar.now.sh{imageSrc}
            <span className="copy">{copyText}</span>
          </code>
        </div>
      </section>
      <section className="description">
        <h2>What is this?</h2>
        <p>
          Kawaii Avatar is a deterministic user avatar generator for your projects.<br/>
          The same url will always produce the same image which means you can provide consistent avatar for your users.<br/>
          Illustrations are provided by <a href="https://react-kawaii.now.sh">react-kawaii</a>.
        </p>
        <h2>Why?</h2>
        <p>Because most default avatar on the web is not k-kawaii enough?</p>
        <h2>How to use it?</h2>
        <p>You can inline Kawaii Avatar url on your user avatar image source</p>
        <code>&lt;img src="https://kawaii-avatar.now.sh/avatar?username=sthobis" alt="sthobis's avatar" /&gt;</code>
      </section>
      <footer>
        <p>Made by <a href="https://sthobis.github.io">sthobis</a></p>
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
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing:grayscale;
          background-color: #363dc2;
          font-size: 16px;
          line-height: 1.6;
          font-weight: 400;
          --font-primary: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
          --color-accent: #ff78c1;
        }

        body,
        input,
        textarea {
          font-family: var(--font-primary);
        }

        a {
          color: white;
          transition: .3s;
        }

        a:visited {
          color: currentColor;
        }

        a:hover {
          color: var(--color-accent);
        }

        strong {
          color: white;
          font-weight: 600;
        }

        code {
          display: inline-block;
          text-align: left;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;
          font-size: 0.9em;
          background: rgba(0, 0, 0, 0.2);
          padding: 10px;
          border-radius: 4px;
        }

        ::selection {
          background: var(--color-accent);
          color: white;
        }

        ::-moz-selection {
          background: var(--color-accent);
          color: white;
        }

        header {
          padding: 0 40px;
          text-align: center;
        }

        header p {
          font-size: 14px;
          margin: 0 0 10px 0;
        }

        h1 {
          margin: 60px 0 0 0;
        }

        h1, h2 {
          color: var(--color-accent);
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
          width: 300px;
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

        input,
        textarea {
          width: 100%;
          font-size: 16px;
          border: none;
          border-radius: 4px;
          padding: 8px 10px;
          margin: 0 0 10px 0;
        }

        textarea {
          height: 82px;
          resize: none;
        }

        input:focus,
        textarea:focus {
          outline-color: var(--color-accent);
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
        }

        img {
          width: auto;
          max-width: 300px;
          border-radius: 4px;
        }

        .avatar h2 {
          color: white;
          margin: 20px 0 10px 0;
        }

        .avatar code {
          position: relative;
          word-break: break-all;
          cursor: pointer;
          padding-bottom: 15px;
        }

        .avatar code:hover .copy {
          opacity: 1;
        }

        .copy {
          position: absolute;
          right: 0;
          bottom: 0;
          color: #111;
          font-size: 11px;
          font-weight: 500;
          padding: 0px 6px;
          background-color: rgba(255, 255, 255, 0.7);
          font-family: var(--font-primary);
          border-radius: 4px;
          opacity: 0;
          transition: .3s;
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

        @media (max-width: 767px) {
          .container {
            flex-direction: column-reverse;
          }

          .controls {
            width: 100%;
            margin: 0;
          }

          .avatar {
            width: 100%;
            margin: 0 0 30px 0;
          }

          .avatar code .copy {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

export default Page
