import { Link } from 'react-router-dom';
import './Home.css';

const Home = ({ isLoggedIn }) => {
  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to Math Buddy</h1>
        <p className="subtitle">Your Personal AI Math Tutor</p>
        {!isLoggedIn && (
          <div className="login-message">
            <p>Please log in to start learning with Math Buddy!</p>
            <div className="login-emoji">🔒</div>
          </div>
        )}
      </div>
      
      <div className="features">
        <div className="feature-card">
          <div className="feature-icon">📝</div>
          <h3>Solve Math Problems</h3>
          <p>Get step-by-step solutions for any math problem with our friendly AI tutor</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">📷</div>
          <h3>Image Recognition</h3>
          <p>Upload photos of math problems for instant help and visual explanations</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🎯</div>
          <h3>Learn Concepts</h3>
          <p>Understand mathematical concepts with clear explanations and interactive tools</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🛠️</div>
          <h3>Math Tools</h3>
          <p>Use our built-in calculator and drawing board to work through problems</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🏆</div>
          <h3>Track Progress</h3>
          <p>Earn points, badges, and level up as you master different math topics</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🎮</div>
          <h3>Fun Learning</h3>
          <p>Learn with our friendly mascot and engaging animations that make math fun</p>
        </div>
      </div>

      <div className="cta">
        <Link to="/chat" className={`start-button ${!isLoggedIn ? 'disabled' : ''}`}>
          {isLoggedIn ? 'Start Learning' : 'Login to Start'}
        </Link>
      </div>
    </div>
  );
};

export default Home; 