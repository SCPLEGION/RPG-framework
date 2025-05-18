import React, { useState, useEffect } from 'react';

const fadeInStyle = {
  animation: 'fadeInCard 0.8s cubic-bezier(.68,-0.55,.27,1.55)',
};

const buttonStyle = {
  padding: '12px 28px',
  fontSize: '1.2rem',
  borderRadius: '8px',
  border: 'none',
  background: 'linear-gradient(90deg, #7289da 0%, #99aab5 100%)',
  color: '#fff',
  cursor: 'pointer',
  boxShadow: '0 4px 16px rgba(114,137,218,0.2)',
  transition: 'transform 0.2s, box-shadow 0.2s',
};

const buttonHoverStyle = {
  transform: 'scale(1.08)',
  boxShadow: '0 0 16px 4px #7289da, 0 4px 16px rgba(114,137,218,0.2)',
};

const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #23272a 0%, #2c2f33 100%)',
  overflow: 'hidden',
};

const cardStyle = {
  background: 'rgba(44,47,51,0.95)',
  borderRadius: '16px',
  padding: '48px 36px 36px 36px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
  textAlign: 'center',
  position: 'relative',
  minWidth: '340px',
};

const headingStyle = {
  background: 'linear-gradient(90deg, #7289da 0%, #99aab5 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 700,
  fontSize: '2rem',
  marginBottom: '12px',
  letterSpacing: '1px',
  animation: 'gradientMove 2.5s infinite linear',
};

const textStyle = {
  color: '#fff',
  marginBottom: '8px',
};

const logoStyle = {
  width: '64px',
  height: '64px',
  marginBottom: '-32px',
  marginTop: '-32px',
  animation: 'floatLogo 2.5s ease-in-out infinite',
  filter: 'drop-shadow(0 0 12px #7289da88)',
};

const Login = () => {
  const [User, setUser] = useState(null); // eslint-disable-line
  const [hover, setHover] = useState(false);

  useEffect(() => { // eslint-disable-line
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('userId');
    const username = params.get('username');

    if (userId && username) {
      setUser({ userId, username });
    }
  }, []);

  const handleLogin = () => {
    window.location.href = '/auth/discord';
  };

  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes fadeInCard {
            0% { opacity: 0; transform: scale(0.95) translateY(30px);}
            80% { opacity: 1; transform: scale(1.03) translateY(0);}
            100% { opacity: 1; transform: scale(1) translateY(0);}
          }
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
          }
          @keyframes floatLogo {
            0%, 100% { transform: translateY(0);}
            50% { transform: translateY(-18px);}
          }
        `}
      </style>
      <img
        src="/discordv4.png"
        alt="Discord Logo"
        style={logoStyle}
        draggable={false}
      />
      <div style={{ ...cardStyle, ...fadeInStyle }}>
        {User ? (
          <div>
            <h1 style={headingStyle}>Welcome, {User.username}!</h1>
            <p style={textStyle}>Your User ID: {User.userId}</p>
          </div>
        ) : (
          <button
            style={hover ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={handleLogin}
          >
            Login with Discord
          </button>
        )}
      </div>
    </div>
  );
};

export default Login;