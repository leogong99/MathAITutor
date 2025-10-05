import { useState, useEffect } from 'react';
import './ProgressTracker.css';

const ProgressTracker = ({ 
  totalQuestions = 0, 
  correctAnswers = 0, 
  currentStreak = 0,
  level = 1,
  experience = 0,
  nextLevelExp = 100
}) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [recentAchievement, setRecentAchievement] = useState(null);

  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const progressToNextLevel = (experience / nextLevelExp) * 100;

  useEffect(() => {
    // Check for achievements
    if (correctAnswers > 0 && correctAnswers % 5 === 0) {
      setRecentAchievement({
        type: 'milestone',
        message: `🎉 ${correctAnswers} questions answered correctly!`,
        icon: '🏆'
      });
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [correctAnswers]);

  useEffect(() => {
    if (currentStreak >= 3) {
      setRecentAchievement({
        type: 'streak',
        message: `🔥 ${currentStreak} day streak! Keep it up!`,
        icon: '🔥'
      });
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [currentStreak]);

  const getLevelColor = (level) => {
    if (level <= 3) return '#4CAF50';
    if (level <= 6) return '#2196F3';
    if (level <= 9) return '#FF9800';
    return '#9C27B0';
  };

  const getLevelTitle = (level) => {
    if (level <= 3) return 'Math Explorer';
    if (level <= 6) return 'Math Wizard';
    if (level <= 9) return 'Math Master';
    return 'Math Genius';
  };

  return (
    <div className="progress-tracker">
      {showCelebration && recentAchievement && (
        <div className="celebration-overlay">
          <div className="celebration-message">
            <div className="celebration-icon">{recentAchievement.icon}</div>
            <div className="celebration-text">{recentAchievement.message}</div>
          </div>
        </div>
      )}
      
      <div className="progress-header">
        <div className="level-info">
          <div className="level-badge" style={{ backgroundColor: getLevelColor(level) }}>
            Level {level}
          </div>
          <div className="level-title">{getLevelTitle(level)}</div>
        </div>
        <div className="streak-info">
          <div className="streak-icon">🔥</div>
          <div className="streak-count">{currentStreak}</div>
        </div>
      </div>

      <div className="progress-stats">
        <div className="stat-item">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{accuracy}%</div>
            <div className="stat-label">Accuracy</div>
          </div>
        </div>
        
        <div className="stat-item">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{correctAnswers}</div>
            <div className="stat-label">Correct</div>
          </div>
        </div>
        
        <div className="stat-item">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <div className="stat-value">{totalQuestions}</div>
            <div className="stat-label">Total</div>
          </div>
        </div>
      </div>

      <div className="level-progress">
        <div className="progress-label">
          <span>Progress to Level {level + 1}</span>
          <span>{experience}/{nextLevelExp} XP</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${progressToNextLevel}%`,
              backgroundColor: getLevelColor(level)
            }}
          ></div>
        </div>
      </div>

      <div className="achievements">
        <div className="achievement-title">Recent Achievements</div>
        <div className="achievement-list">
          {accuracy >= 80 && (
            <div className="achievement-item">
              <span className="achievement-icon">🎯</span>
              <span className="achievement-text">Accuracy Master</span>
            </div>
          )}
          {currentStreak >= 7 && (
            <div className="achievement-item">
              <span className="achievement-icon">🔥</span>
              <span className="achievement-text">Week Warrior</span>
            </div>
          )}
          {level >= 5 && (
            <div className="achievement-item">
              <span className="achievement-icon">⭐</span>
              <span className="achievement-text">Rising Star</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
