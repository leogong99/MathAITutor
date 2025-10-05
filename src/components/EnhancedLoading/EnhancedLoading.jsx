import { useState, useEffect } from 'react';
import './EnhancedLoading.css';

const EnhancedLoading = ({ 
  message = "Thinking...", 
  type = "thinking",
  showProgress = false,
  progress = 0 
}) => {
  const [dots, setDots] = useState('');
  const [currentMessage, setCurrentMessage] = useState(message);

  const thinkingMessages = [
    "Let me think about this...",
    "Working on your math problem...",
    "Calculating the solution...",
    "Almost there...",
    "Just a moment more..."
  ];

  const celebratingMessages = [
    "Great job! 🎉",
    "Excellent work! ⭐",
    "You're doing amazing! 🌟",
    "Keep it up! 💪",
    "Fantastic! 🚀"
  ];

  useEffect(() => {
    if (type === 'thinking') {
      const interval = setInterval(() => {
        setDots(prev => prev.length >= 3 ? '' : prev + '.');
      }, 500);

      const messageInterval = setInterval(() => {
        setCurrentMessage(thinkingMessages[Math.floor(Math.random() * thinkingMessages.length)]);
      }, 2000);

      return () => {
        clearInterval(interval);
        clearInterval(messageInterval);
      };
    } else if (type === 'celebrating') {
      setCurrentMessage(celebratingMessages[Math.floor(Math.random() * celebratingMessages.length)]);
    }
  }, [type]);

  const getLoadingIcon = () => {
    switch (type) {
      case 'thinking':
        return '🤔';
      case 'calculating':
        return '🧮';
      case 'celebrating':
        return '🎉';
      case 'processing':
        return '⚙️';
      default:
        return '🤔';
    }
  };

  return (
    <div className={`enhanced-loading ${type}`}>
      <div className="loading-container">
        <div className="loading-icon">
          <div className="icon-wrapper">
            {getLoadingIcon()}
          </div>
          {type === 'thinking' && (
            <div className="thinking-rings">
              <div className="ring ring-1"></div>
              <div className="ring ring-2"></div>
              <div className="ring ring-3"></div>
            </div>
          )}
          {type === 'calculating' && (
            <div className="calculation-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
        </div>
        
        <div className="loading-content">
          <div className="loading-message">
            {currentMessage}
            {type === 'thinking' && <span className="dots">{dots}</span>}
          </div>
          
          {showProgress && (
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="progress-text">{Math.round(progress)}%</div>
            </div>
          )}
          
          {type === 'thinking' && (
            <div className="loading-tips">
              <div className="tip-item">
                <span className="tip-icon">💡</span>
                <span className="tip-text">I&apos;m working through each step carefully</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedLoading;
