import TicketViewer from './components/TicketViewer.jsx';
import AboutPage from './main/index.jsx';
import login from './main/login.jsx';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Dashboard from './components/dashboard.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/tickets" element={<Tickets />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboardjsx />} />
      <Route path="/login/callback" element={<AuthCallback />} />
      {/* Add more routes as needed */}
    </Routes>
  );
}

function Home() {
  return AboutPage();
}

function About() {
  return <h1>About Page</h1>;
}

function Tickets() {
  return TicketViewer();
}

function Login() {
  return login();
}

function Dashboardjsx() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    if (!isAuthenticated) {
      console.log('User is not authenticated');
      // Redirect to the login page if not authenticated
      navigate('/login');
    }
  }, [navigate]);

  return <Dashboard />;
}

// New AuthCallback component to handle Discord OAuth callback
function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('userId');
    const username = params.get('username');

    if (userId && username) {
      // Save user data to localStorage
      localStorage.setItem('user', JSON.stringify({ userId, username }));
      localStorage.setItem('isAuthenticated', 'true');
      console.log('User authenticated:', userId, username);
      navigate('/dashboard'); // Redirect to dashboard after successful login
    } else {
      console.log('Authentication failed or user data missing');
      navigate('/login'); // Redirect to login if authentication fails
    }
  }, [navigate]);

  return <h1>Authenticating...</h1>;
}

export default App;