import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
// import './App.css'
import Homepage from './pages/Homepage'
import Login from './pages/Login'
import Register from './pages/Register'
import PLCControl from './PLC/plc_read'



function App() {
 
  return (
   <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Homepage />} />
          <Route path="/register" element={<Register />} />
          <Route path='/plc' element={<PLCControl />} />
        </Routes>
      </AuthProvider>
   </Router>
  )
}

export default App
