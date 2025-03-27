import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
// import './App.css'
import Homepage from './pages/Homepage'
import Login from './pages/Login'
import Register from './pages/Register'
import PLCControl from './PLC/plc_read'
import Dashboardr from './pages/Dashboardr'
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from './pages/Dashboard'
import { SensorProvider } from './context/SensorContext'



function App() {
 
  return (
   <Router>
      <AuthProvider>
        <SensorProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Homepage />} />
          <Route path="/register" element={<Register />} />
          <Route path='/dashboardr' element={<Dashboardr />} />
          <Route path='/plc' element={<PLCControl />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
        </SensorProvider>
      </AuthProvider>
   </Router>
  )
}

export default App
