import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/home'
import VideoDetails from './components/features/videoDetails'
import AddVideo from './components/features/AddVideo'
import UpdateVideo from './components/features/UpdateVideo'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Profile from './pages/Profile'
import AdminDashboard from './pages/admin/AdminDashboard'
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/video/:id" element={<VideoDetails />} />
        <Route path="/video/:id/edit" element={<UpdateVideo />} />
        <Route path="/add-video" element={<AddVideo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/superadmin" element={<SuperAdminDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
