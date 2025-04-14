import TicketViewer from './components/TicketViewer.jsx'
import AboutPage from './main/index.jsx'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/tickets" element={<Tickets />} />
    </Routes>
  )
}

function Home() {
  return AboutPage()
}

function About() {
  return <h1>About Page</h1>
}

function Tickets() {
  return TicketViewer()
}

export default App
