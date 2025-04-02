import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Homepage from './pages/Homepage'
import Login from './pages/Login'
import Register from './pages/Register'
import PLCControl from './PLC/plc_read'
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from './pages/Dashboard'
import UserProfile from "./pages/UserProfile";
import Feedback from "./pages/Feedback";
import ProtectedRoute from './routes/ProtectedRoutes'
import UsePagePreservation from './hooks/UsePagePreservation'



function App() {

  return (
    <Router>
      <AuthProvider>
        <UsePagePreservation /> {/* saving the currentPath so upon refresh or reload will not render to login page*/}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path='/' element={<ProtectedRoute />}>
            <Route path='/' element={<Homepage />}/>
            <Route path='/plc' element={<PLCControl />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/feedback" element={<Feedback />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
