import { useState, useEffect } from 'react';
import './MathMascot.css';

const MathMascot = ({ 
  isThinking = false, 
  isCelebrating = false, 
  isEncouraging = false,
  currentMood = 'happy',
  message = null 
}) => {
  const [animationClass, setAnimationClass] = useState('idle');
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (isThinking) {
      setAnimationClass('thinking');
    } else if (isCelebrating) {
      setAnimationClass('celebrating');
      setTimeout(() => setAnimationClass('idle'), 2000);
    } else if (isEncouraging) {
      setAnimationClass('encouraging');
      setTimeout(() => setAnimationClass('idle'), 1500);
    } else {
      setAnimationClass('idle');
    }
  }, [isThinking, isCelebrating, isEncouraging]);

  useEffect(() => {
    if (message) {
      setShowMessage(true);
      const timer = setTimeout(() => setShowMessage(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const getMascotEmoji = () => {
    switch (currentMood) {
      case 'thinking': return '🤔';
      case 'celebrating': return '🎉';
      case 'encouraging': return '💪';
      case 'happy': return '😊';
      case 'excited': return '🤩';
      case 'proud': return '😎';
      default: return '😊';
    }
  };

  return (
    <div className={`math-mascot ${animationClass}`}>
      <div className="mascot-character">
        <div className="mascot-emoji">{getMascotEmoji()}</div>
        <div className="mascot-body">🤖</div>
      </div>
      {showMessage && message && (
        <div className="mascot-message">
          <div className="speech-bubble">
            {message}
          </div>
        </div>
      )}
      {isThinking && (
        <div className="thinking-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}
    </div>
  );
};

export default MathMascot;
