import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import TicketViewer from './components/TicketViewer.jsx'
import './App.css'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  )
}

function Home() {
  return TicketViewer()
}

function About() {
  return <h1>About Page</h1>
}

function Tickets() {
  return TicketViewer()
}

export default App
