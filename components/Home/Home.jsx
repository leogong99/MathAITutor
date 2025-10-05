import Link from 'next/link';
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
          <p>Get step-by-step solutions for any math problem</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">📷</div>
          <h3>Image Recognition</h3>
          <p>Upload photos of math problems for instant help</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🎯</div>
          <h3>Learn Concepts</h3>
          <p>Understand mathematical concepts with clear explanations</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🔄</div>
          <h3>Practice Similar Problems</h3>
          <p>Get personalized practice problems to reinforce your learning</p>
        </div>
      </div>

      <div className="cta">
        <Link href="/chat" className={`start-button ${!isLoggedIn ? 'disabled' : ''}`}>
          {isLoggedIn ? 'Start Learning' : 'Login to Start'}
        </Link>
      </div>
    </div>
  );
};

export default Home; 