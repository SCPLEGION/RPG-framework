import AboutPage from './pages/AboutPage.jsx';
import login from './pages/login.jsx';
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
import * as Sentry from "@sentry/react";

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
      <Route path="/demo" element={<Demo />} />
      <Route path="/login" element={<Login />} />
      <Route path="/login/callback" element={<AuthCallback />} />
    </SentryRoutes>
  );
}

function Home() {
  useEffect(() => {
    document.title = 'SCP RPG Discord Bot - Home';
  }, []);
  return <AboutPage />;
}

function Login() {
  useEffect(() => {
    document.title = 'SCP RPG Discord Bot - Login';
  }, []);
  return login();
}

function Demo() {
  useEffect(() => {
    document.title = 'SCP RPG Discord Bot - Demo';
  }, []);
  return (
    <div>
      <h1>Demo Page</h1>
      <p>This is a demo page.</p>
    </div>
  );
}

// New AuthCallback component to handle Discord OAuth callback
function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'SCP RPG Discord Bot - Authenticating...';
    
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('userId');
    const username = params.get('username');
    const token = params.get('token'); // Get the token from the URL
    const avatar = params.get('avatar'); // Get the token from the URL

    if (userId && username) {
      // Save user data to localStorage
      localStorage.setItem('user', JSON.stringify({ userId, username, token,  avatar}));
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