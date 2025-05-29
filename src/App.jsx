import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './components/Home/Home';
import Chatbot from './components/Chatbot/Chatbot';
import './App.css';
import { GoogleLogin } from '@react-oauth/google';
import { useState, useEffect } from 'react';
import logo from './images/logo.png';

function App() {
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
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="app-header-title">
            <img src={logo} alt="logo" className='logo'/>
            <h1>Math Buddy</h1>
          </div>
          <nav className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
            <Link to="/" className="nav-link" onClick={toggleMobileMenu}>Home</Link>
            <Link to="/chat" className="nav-link" onClick={toggleMobileMenu}>Chat</Link>
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
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/chat" 
              element={
                authToken ? (
                  <Chatbot authToken={authToken} />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;