import { useState } from 'react'
import './App.css'
import Btn from './btn'
import Login from "./pages/login";

function App() {
  const [count, setCount] = useState(0)

  return (
    <Login></Login>
  )
}

export default App
