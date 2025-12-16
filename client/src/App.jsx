import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/home'
import VideoDetails from './components/features/videoDetails'
import AddVideo from './components/features/AddVideo'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/video/:id" element={<VideoDetails />} />
        <Route path="/add-video" element={<AddVideo />} />
      </Routes>
    </Router>
  )
}

export default App
