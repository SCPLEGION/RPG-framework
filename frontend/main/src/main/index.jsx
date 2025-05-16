import React, { useState, useEffect } from 'react';

const AboutPage = () => {
    const [theme, setTheme] = useState('dark'); // 'light', 'dark', or 'amoled'

    const toggleTheme = () => {
        setTheme((prevTheme) => 
            prevTheme === 'light' ? 'dark' : prevTheme === 'dark' ? 'amoled' : 'light'
        );
    };

    useEffect(() => {
        if (theme === 'dark') {
            document.body.style.backgroundColor = '#333';
            document.body.style.color = '#f9f9f9';
        } else if (theme === 'amoled') {
            document.body.style.backgroundColor = '#000';
            document.body.style.color = '#fff';
        } else {
            document.body.style.backgroundColor = '#f9f9f9';
            document.body.style.color = '#333';
        }
    }, [theme]);

    const themeStyles = {
        backgroundColor: theme === 'dark' ? '#333' : theme === 'amoled' ? '#000' : '#f9f9f9',
        color: theme === 'dark' ? '#f9f9f9' : theme === 'amoled' ? '#fff' : '#333',
    };

    return (
        <div style={{ 
            ...themeStyles, 
            padding: '20px', 
            fontFamily: 'Arial, sans-serif', 
            borderRadius: '8px', 
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
            maxWidth: '800px', 
            margin: '40px auto', 
            textAlign: 'center' 
        }}>
            <nav style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                padding: '10px 0', 
                borderBottom: `2px solid ${theme === 'dark' ? '#555' : theme === 'amoled' ? '#222' : '#3498db'}` 
            }}>
                <button 
                    onClick={toggleTheme} 
                    style={{ 
                        padding: '10px 20px', 
                        fontSize: '1rem', 
                        cursor: 'pointer', 
                        borderRadius: '5px', 
                        border: 'none', 
                        backgroundColor: theme === 'dark' ? '#555' : theme === 'amoled' ? '#222' : '#3498db', 
                        color: '#fff' 
                    }}
                >
                    {theme === 'light' ? 'Dark Theme' : theme === 'dark' ? 'AMOLED Theme' : 'Light Theme'}
                </button>
            </nav>
            <h1 style={{ 
                fontSize: '2.5rem', 
                color: theme === 'dark' ? '#f9f9f9' : theme === 'amoled' ? '#fff' : '#2c3e50', 
                borderBottom: `2px solid ${theme === 'dark' ? '#555' : theme === 'amoled' ? '#222' : '#3498db'}`, 
                paddingBottom: '10px' 
            }}>
                About Us
            </h1>
            <img 
                src="https://via.placeholder.com/150" 
                alt="SCP Logo" 
                style={{ 
                    width: '150px', 
                    height: '150px', 
                    borderRadius: '50%', 
                    margin: '20px 0' 
                }} 
            />
            <p style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
                Welcome to the SCP RPG Discord Bot! This project is designed to enhance your SCP role-playing experience by providing tools, features, and automation for your Discord server.
            </p>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
                Our goal is to create a seamless and immersive experience for SCP enthusiasts, allowing you to focus on storytelling and gameplay while the bot handles the rest.
            </p>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
                If you have any questions, feedback, or suggestions, feel free to reach out to us. Thank you for being a part of our community!
            </p>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '20px', 
                marginTop: '20px' 
            }}>
                <img 
                    src="https://via.placeholder.com/100" 
                    alt="Feature 1" 
                    style={{ borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }} 
                />
                <img 
                    src="https://via.placeholder.com/100" 
                    alt="Feature 2" 
                    style={{ borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }} 
                />
                <img 
                    src="https://via.placeholder.com/100" 
                    alt="Feature 3" 
                    style={{ borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }} 
                />
            </div>
        </div>
    );
};

export default AboutPage;