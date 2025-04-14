import React, { useState, useEffect } from 'react';

const login = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
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
    <div>
      {user ? (
        <div>
          <h1>Welcome, {user.username}!</h1>
          <p>Your User ID: {user.userId}</p>
        </div>
      ) : (
        <button onClick={handleLogin}>Login with Discord</button>
      )}
    </div>
  );
};

export default login;