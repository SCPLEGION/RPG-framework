import TicketViewer from './main/TicketViewer.jsx';
import AboutPage from './main/index.jsx';
import login from './main/login.jsx';
import { 
  Routes, 
  Route, 
  useNavigate, 
  useLocation, 
  BrowserRouter,
  useNavigationType, 
  createRoutesFromChildren, 
  matchRoutes, 
} from 'react-router-dom';
import React, { useEffect } from 'react';
import Dashboard from './main/dashboard.jsx';
import Docs from './main/docs.jsx';
import BJ from './main/casino/games/BJ.jsx';
import Gameselector from './main/casino/mainsite.jsx'
import Roulette from './main/casino/games/Roullet.jsx';
import CbcCalc from './main/cbccalc.jsx';
import * as Sentry from "@sentry/react";
import AIPage from './main/ai.jsx';

Sentry.init({
  dsn: "https://6f43f40b70527b69c77e70088e62d62e@o4508206956478464.ingest.de.sentry.io/4509587125698640",
  integrations: [
    Sentry.reactRouterV7BrowserTracingIntegration({
      useEffect: React.useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
  ],
  tracesSampleRate: 1.0,
});

const SentryRoutes = Sentry.withSentryReactRouterV7Routing(Routes);

function App() {
  return (
    <SentryRoutes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/tickets" element={<Tickets />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboardjsx />} />
      <Route path="/login/callback" element={<AuthCallback />} />
      <Route path="/docs" element={<Docs />} />
      <Route path="/casino" element={<Gameselector />} />
      <Route path="/casino/blackjack" element={<BJ />} />
      <Route path="/casino/roulette" element={<Roulette />} />
      <Route path="/cbccalc" element={<CbcCalc />} />
      <Route path="/ai" element={<Ai />} />
      {/* Add more routes as needed */}
    </SentryRoutes>
  );
}

function Home() {
  return AboutPage();
}

function About() {
  return <h1>About Page</h1>;
}

function Tickets() {
    let navigate = useNavigate();
    if (localStorage.getItem('user')) {
        return TicketViewer();
    } else {
        navigate('/login');
    }
}

function Login() {
  return login();
}

function Ai() {
  return <AIPage />;
}

function Dashboardjsx() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    if (!isAuthenticated) {
      console.error('Dash User is not authenticated');
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
    const token = params.get('token'); // Get the token from the URL
    const avatar = params.get('avatar'); // Get the token from the URL

    if (userId && username) {
      // Save user data to localStorage
      localStorage.setItem('user', JSON.stringify({ userId, username, token,  avatar}));
      localStorage.setItem('isAuthenticated', 'true');
      console.log('User authenticated:', userId, username);
      
      // Pass params to dashboard route
      navigate(`/login?userId=${encodeURIComponent(userId)}&username=${encodeURIComponent(username)}&token=${encodeURIComponent(token)}&avatar=${encodeURIComponent(avatar)}`);
    } else {
      console.log('1Authentication failed or user data missing');
      navigate('/login'); // Redirect to login if authentication fails
    }
  }, [navigate]);

  return <h1>Authenticating...</h1>;
}

export default App;