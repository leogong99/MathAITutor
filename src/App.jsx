import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './components/Home/Home';
import Chatbot from './components/Chatbot/Chatbot';
import MobileOptimizations from './components/MobileOptimizations/MobileOptimizations';
import './App.css';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
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
    console.log('Google OAuth response:', response);
    const idToken = response.credential;
    localStorage.setItem('authToken', idToken);
    setAuthToken(idToken);
  };

  const errorMessage = (error) => {
    console.error('Google OAuth error:', error);
    alert(`Google OAuth Error: ${error.error || 'Unknown error'}\n\nPlease check your Google OAuth configuration.`);
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

  // Check if Google Client ID is configured
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  
  if (!googleClientId) {
    return (
      <div className="error-screen">
        <div className="error-content">
          <h2>⚠️ Configuration Error</h2>
          <p>Google OAuth Client ID is not configured.</p>
          <p>Please create a <code>.env</code> file with:</p>
          <pre>REACT_APP_GOOGLE_CLIENT_ID=your_actual_client_id_here</pre>
          <p>Get your Client ID from <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">Google Cloud Console</a></p>
        </div>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Router>
        <div className="App">
          <MobileOptimizations />
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
              <Route path="/" element={<Home isLoggedIn={!!authToken} />} />
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
              <Route path="*" element={<Home isLoggedIn={!!authToken} />} />
            </Routes>
          </main>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;