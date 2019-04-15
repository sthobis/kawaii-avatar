import Time from '../components/time'
import 'isomorphic-unfetch'

const langs = [
  { name: 'Node.js', path: 'node', ext: '.js' }
]

const Page = ({nows}) => <div className="container">
    <div className="logo">
      <svg width={40} height={36}>
        <path
          d="M20 .1L.1 35.8h39.7L20 0zm-1.7 7.2l14.5 26.4H3.6L18.3 7.3z"
          fill="#fff"
          fillRule="nonzero"
        />
      </svg>
    </div>
    <div className="clocks">
      {nows.map(({name, path, ext, now}) => 
        <a href={`https://zeit.co/now-examples/monorepo/4csp3st7w/source?f=src/${path}/index${ext}`} target="_blank" title={name} key={path}>
          <Time 
            name={name}
            path={path}
            now={now}
          />
        </a>
      )}
    </div>
    <div className="intro">
      <hr/>
      <h2>What is this?</h2>
      <p>We built this deployment to showcase the power and flexibility of <a href="https://zeit.co/blog/now-2" target="_blank">Now 2.0</a>. It's organized as a monorepo that combines multiple technologies.</p>
      <p>The entrypoint to this deployment is a Next.js application, compiled to serverless functions that server-render on-demand.</p>
      <p>Thanks to our <a href="https://zeit.co/docs/v2/deployments/builders/overview" title="builders" target="_blank">builders</a>, you are not limited to just static or dynamic, Go or Node.js. The possibilities are endless.</p>
    </div>
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
        background: radial-gradient(circle, #333, #333 1px, #000 1px, #000);
        background-size: 28px 28px;
        background-position: center;
        font-size: 18px;
        line-height: 1.6;
        font-weight: 400;
      }
      a {
        text-decoration: none;
        color: white;
      }
      strong {
        color: white;
        font-weight: 600;
      }
      code {
        font-family: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;
        font-size: 0.9em;
      }
      code::before,
      code::after {
        content: '\`';
      }
      ::selection{ background: #f81ce5; color: white; }
      ::-moz-selection{ background: #f81ce5; color: white; }
      .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        max-width: 100%;
        width: 1080px;
        min-height: 100vh;
        margin: auto;
        padding: 30px 20px;
      }
      .logo {
        margin: 30px 0 20px;
      }
      .intro {
        text-align: left;
        max-width: 640px;
      }
      .intro a {
        margin-right: .15em;
        border-bottom: 1px solid;
      }
      h2 {
        font-size: 30px;
      }
      hr {
        display: none;
        border: none;
        border-bottom: 1px solid #666;
        width: 100px;
        margin: 30px 0;
      }
      .clocks {
        display: flex;
        flex-wrap: wrap;
        flex: 1;
        align-items: center;
        justify-content: center;
        width: 100%;
        margin: 0 -10px;
        padding: 40px 0;
        max-height: 500px;
      }
      .clocks a {
        position: relative;
        flex: 1 0 25%;
        text-align: center;
        padding: 10px;
        margin: 20px 0;
        font-size: 17px;
        transition: all .1s ease;
      }
      .clocks a:hover {
        box-shadow: 0 0 0 1px #666;
      }
      .clock span {
        font-weight: 700;
      }
      .clock time {
        display: block;
        height: 3.2em;
        font-weight: 700;
        color: #fff;
        animation: pulse 1s forwards;
      }
      @keyframes pulse {
        from {
          color: #fff;
        }
        to {
          color: #bbb;
        }
      }
      @media screen and (max-width: 960px) {
        .clocks a {
          flex: 1 0 50%;
          font-size: 20px;
        }
      }
      @media screen and (max-width: 480px) {
        .clocks a {
          flex: 1 0 100%;
        }
        .clocks {
          max-height: unset;
        }
        hr {
          display: block;
        }
      }
    `}</style>
  </div>

Page.getInitialProps = async ({req}) => {
  const protocol = process.env.NOW_REGION === 'dev1' ? 'http' : 'https';
  const baseUrl = `${protocol}://${req.headers.host}/api`
  const nows = await Promise.all(langs.map(async ({name, path, ext}) => {
    const now = await (await fetch(`${baseUrl}/${path}`)).text()
    return {name, path, now, ext}
  }))

  return { nows }
}

export default Page
