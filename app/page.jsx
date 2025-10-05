'use client';

import { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import Link from 'next/link';
import Image from 'next/image';
import Home from '../components/Home/Home';
import '../app/App.css';
import logo from '/public/images/logo.png';

export default function HomePage() {
  const [authToken, setAuthToken] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      setAuthToken(savedToken);
    }
    setIsLoading(false);
  }, []);

  const responseMessage = (response) => {
    const idToken = response.credential;
    localStorage.setItem('authToken', idToken);
    setAuthToken(idToken);
  };

  const errorMessage = (error) => {
    console.error('Login error:', error);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading Math Buddy...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="app-header-title">
          <Image src={logo} alt="logo" className='logo' width={40} height={40} />
          <h1>Math Buddy</h1>
        </div>
        <nav className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          <Link href="/" className="nav-link" onClick={toggleMobileMenu}>Home</Link>
          <Link href="/chat" className="nav-link" onClick={toggleMobileMenu}>Chat</Link>
          {authToken ? (
            <button className="nav-link logout-button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <GoogleLogin 
              onSuccess={responseMessage} 
              onError={errorMessage}
              theme="filled_blue"
              shape="pill"
              text="signin_with"
              size="large"
            />
          )}
        </nav>
        <button className="hamburger-menu" onClick={toggleMobileMenu}>
          ☰
        </button>
      </header>
      <main>
        <Home isLoggedIn={!!authToken} />
      </main>
    </div>
  );
}
