import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { api } from './backend_hook.ts'
import 'vite/modulepreload-polyfill'

function App() {
  const [count, setCount] = useState(0)

  async function clickButton() { 
    console.log("Clicked! Notifying backend.")
    await api("/inc")
    console.log("Backend notified, getting new value!")
    var c = (await api("/")).count
    console.log("New value Recieved" + c)
    setCount(c)
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={clickButton}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
