import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Homepage from './pages/Homepage'
import Login from './pages/Login'
import Register from './pages/Register'
import PLCControl from './PLC/plc_read'
import Dashboard from './pages/Dashboard'
// import Dashboardr from './pages/Dashboardr'
import ForgotPassword from "./pages/ForgotPassword";
import UserProfile from "./pages/UserProfile";
import Feedback from "./pages/Feedback";
import { SensorProvider } from './context/SensorContext'



function App() {
 
  return (
   <Router>
      <AuthProvider>
       
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Homepage />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path='/dashboardr' element={<Dashboardr />} /> */}
          <Route path='/plc' element={<PLCControl />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/feedback" element={<Feedback />} />
        </Routes>
       
      </AuthProvider>
   </Router>
  )
}

export default App
