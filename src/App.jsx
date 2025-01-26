import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home/Home';
import Chatbot from './components/Chatbot/Chatbot';
import './App.css';
import { GoogleLogin } from '@react-oauth/google';
import { useState } from 'react';


import logo from './images/logo.png';

function App() {
  const [authToken, setAuthToken] = useState(null);

  const savedToken = localStorage.getItem('authToken');
  if (authToken === null) {
    setAuthToken(savedToken);
  }

  const responseMessage = (response) => {
    console.log(response);
    const idToken = response.credential;
    localStorage.setItem('authToken', idToken);
    setAuthToken(idToken);
  };
  const errorMessage = (error) => {
      console.log(error);
  };
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="app-header-title">
            <img src={logo} alt="logo" className='logo'/>
            <h1>Math Buddy</h1>
          </div>
          <nav className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/chat" className="nav-link">Chat</Link>
            <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
            </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chatbot authToken={authToken} />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 