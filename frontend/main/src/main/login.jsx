import React, { useState, useEffect } from 'react';

const login = () => {
  const [User, setUser] = useState(null); // eslint-disable-line

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
    <div>
      {User ? (
        <div>
          <h1>Welcome, {User.username}!</h1>
          <p>Your User ID: {User.userId}</p>
        </div>
      ) : (
        <button onClick={handleLogin}>Login with Discord</button>
      )}
    </div>
  );
};

export default login;