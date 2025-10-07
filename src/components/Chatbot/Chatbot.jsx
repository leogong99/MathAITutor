import { useState, useRef, useEffect, useCallback } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';
import ChatMessage from '../ChatMessage/ChatMessage.jsx';
import ChatInput from '../ChatInput/ChatInput.jsx';
import MathMascot from '../MathMascot/MathMascot.jsx';
import ProgressTracker from '../ProgressTracker/ProgressTracker.jsx';
import EnhancedLoading from '../EnhancedLoading/EnhancedLoading.jsx';
import MathTools from '../MathTools/MathTools.jsx';
import './Chatbot.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const FOLLOW_UP_SUGGESTIONS = {
  default: [
    "Tell me more about this",
    "Can you explain it simpler?",
    "Give me a similar problem to practice"
  ],
  practice: [
    "Show me how to solve this",
    "Make it a bit harder",
    "Make it a bit easier"
  ]
};

const Chatbot = ({authToken}) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [voiceInputEnd, setVoiceInputEnd] = useState(false);
  const [transcriptSubmitted, setTranscriptSubmitted] = useState(false);
  const chatEndRef = useRef(null);
  
  // New state for enhanced features
  const [showMathTools, setShowMathTools] = useState(false);
  const [mascotMood, setMascotMood] = useState('happy');
  const [mascotMessage, setMascotMessage] = useState(null);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [progress, setProgress] = useState({
    totalQuestions: 0,
    correctAnswers: 0,
    currentStreak: 0,
    level: 1,
    experience: 0,
    nextLevelExp: 100
  });
  const [showNewThreadConfirm, setShowNewThreadConfirm] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    // Add welcome messages when component mounts
    const welcomeMessages = [
      {
        text: "👋 Hi! I'm Math Buddy, your personal math tutor!",
        sender: 'bot'
      },
      {
        text: "I can help you with any math problem. You can type your question or upload an image of the problem.",
        sender: 'bot'
      },
      {
        text: "What would you like to learn today?",
        sender: 'bot'
      }
    ];
    setMessages(welcomeMessages);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSuggestionClick = (suggestion) => {
    // Use the suggestion directly - context will be handled automatically
    handleSubmit(suggestion, null, false);
    setShowSuggestions(false);
  };

  const startNewThread = () => {
    // Reset all conversation state
    setMessages([
      {
        text: "👋 Hi! I'm Math Buddy, your personal math tutor!",
        sender: 'bot'
      },
      {
        text: "I can help you with any math problem. You can type your question or upload an image of the problem.",
        sender: 'bot'
      },
      {
        text: "What would you like to learn today?",
        sender: 'bot'
      }
    ]);
    setShowSuggestions(false);
    setShowMathTools(false);
    setMascotMood('happy');
    setMascotMessage(null);
    setIsCelebrating(false);
    setShowNewThreadConfirm(false);
    
    // Reset progress for new thread
    setProgress(prev => ({
      ...prev,
      totalQuestions: 0,
      correctAnswers: 0,
      currentStreak: 0
    }));
  };

  const handleNewThreadClick = () => {
    // Only show confirmation if there are messages beyond the welcome messages
    if (messages.length > 3) {
      setShowNewThreadConfirm(true);
    } else {
      startNewThread();
    }
  };

  const handleSubmit = useCallback(async (text, image, isNewQuestion = true) => {
    // Create user message for display
    const userMessage = {
      text: text.startsWith('Previous context:') 
        ? text.split('\n\nFollow-up request: ')[1] // Show only the follow-up part to user
        : text,
      image: image ? URL.createObjectURL(image) : null,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setShowSuggestions(false);
    setMascotMood('thinking');

    // Update progress
    setProgress(prev => ({
      ...prev,
      totalQuestions: prev.totalQuestions + 1
    }));

    try {
      let response;

      if(!authToken) {
        return;
      }

      const headers = {
        Authorization: `Bearer ${authToken}`
      };

      // Build comprehensive conversation context
      const buildContext = () => {
        const recentMessages = messages.slice(-10); // Get last 10 messages for context
        const contextMessages = [];
        
        recentMessages.forEach((msg) => {
          if (msg.sender === 'user') {
            contextMessages.push({
              role: 'user',
              content: msg.text,
              image: msg.image ? 'User uploaded an image' : undefined
            });
          } else if (msg.sender === 'bot') {
            contextMessages.push({
              role: 'assistant',
              content: msg.text
            });
          }
        });
        
        // Add current message
        contextMessages.push({
          role: 'user',
          content: text,
          image: image ? 'User uploaded an image' : undefined
        });
        
        return contextMessages;
      };

      const contextMessages = buildContext();

      if (image) {
        const formData = new FormData();
        formData.append('image', image);
        if (text) {
          formData.append('message', text);
        }
        // Add context to form data
        formData.append('context', JSON.stringify(contextMessages.slice(0, -1))); // Exclude current message
        
        console.log('Sending image with context:', {
          image: image.name || 'drawing.png',
          message: text,
          context: contextMessages.slice(0, -1)
        });
        
        response = await axios.post(`${API_URL}/api/chat/with-image`, formData, {
          headers: {
            ...headers,
            'Content-Type': 'multipart/form-data'
          },
        })
        .catch(err => {
          console.error('Service call error:', err);
          return;
        });
      } else {
        console.log("Sending message with context:", {
          message: text,
          context: contextMessages.slice(0, -1) // Exclude current message
        });
        
        response = await axios.post(`${API_URL}/api/chat`,{
          message: text,
          context: contextMessages.slice(0, -1) // Send previous context
        }, {headers})
        .catch(err => {
          console.error('Service call error:', err);
          return;
        });
      }
      
      console.log('API Response:', response?.data);
      
      const botMessage = {
        text: response.data.message,
        sender: 'bot'
      };
      
      setMessages(prev => [...prev, botMessage]);
      setShowSuggestions(isNewQuestion);
      
      // Celebrate successful response
      setMascotMood('celebrating');
      setIsCelebrating(true);
      setMascotMessage("Great question! I hope that helps! 🎉");
      
      // Update progress for correct answers (simplified logic)
      setProgress(prev => ({
        ...prev,
        correctAnswers: prev.correctAnswers + 1,
        experience: prev.experience + 10,
        currentStreak: prev.currentStreak + 1
      }));
      
      setTimeout(() => {
        setMascotMood('happy');
        setIsCelebrating(false);
        setMascotMessage(null);
      }, 3000);
      
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error.response?.data?.error || "Sorry, I had trouble understanding that. Could you try asking again?";
      setMessages(prev => [...prev, {
        text: errorMessage,
        sender: 'bot'
      }]);
      
      setMascotMood('encouraging');
      setMascotMessage("Don't worry! Let's try again! 💪");
      setTimeout(() => {
        setMascotMood('happy');
        setMascotMessage(null);
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  }, [authToken, messages]);

  useEffect(() => {
    if (transcript && voiceInputEnd && !transcriptSubmitted) {
      handleSubmit(transcript);
      setTranscriptSubmitted(true);
    }
  }, [transcript, voiceInputEnd, transcriptSubmitted, handleSubmit]);

  const startListening = () => {
    setVoiceInputEnd(false);
    setTranscriptSubmitted(false);
    resetTranscript();
    SpeechRecognition.startListening();
  };

  const endListening = () => {
    setTimeout(() => {
      setVoiceInputEnd(true);
      SpeechRecognition.stopListening();
    }, 1000); // Add a delay of 1000ms before stopping the listening
  };

  const handleMathToolResult = (toolType, result) => {
    if (toolType === 'calculation') {
      handleSubmit(`I calculated: ${result}`, null, true);
    } else if (toolType === 'drawing') {
      // Send the drawing as an image to the backend with a math-specific message
      handleSubmit("I drew a handwritten math equation. Please carefully read the numbers and symbols in this image and help me solve the math problem step by step:", result, true);
    }
    setShowMathTools(false);
  };

  return (
    <div className="chatbot-container">
      {/* Progress Tracker */}
      <ProgressTracker 
        totalQuestions={progress.totalQuestions}
        correctAnswers={progress.correctAnswers}
        currentStreak={progress.currentStreak}
        level={progress.level}
        experience={progress.experience}
        nextLevelExp={progress.nextLevelExp}
      />


      <div className="chat-messages">
        <div className="messages-wrapper">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          {!authToken && (
            <ChatMessage message={{ text: "Please login to continue", sender: "bot" }} />
          )}
          {isLoading && (
            <EnhancedLoading 
              message="Working on your math problem..." 
              type="thinking"
            />
          )}
          <div ref={chatEndRef} />
          {showSuggestions && !isLoading && messages.length > 0 && (
            <div className="suggestions">
              {FOLLOW_UP_SUGGESTIONS.default.map((suggestion, index) => (
                <button
                  key={index}
                  className="suggestion-button"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Math Tools */}
      <MathTools 
        onToolResult={handleMathToolResult}
        isVisible={showMathTools}
      />

      {/* Math Tools Toggle Button */}
      <div className="math-tools-toggle">
        <button 
          className="tools-toggle-btn"
          onClick={() => setShowMathTools(!showMathTools)}
        >
          {showMathTools ? '🛠️ Hide Tools' : '🛠️ Math Tools'}
        </button>
      </div>

      <div className="input-container">
        <ChatInput
          onSubmit={handleSubmit}
          onVoiceInput={startListening}
          endVoiceInput={endListening}
          isListening={listening}
          disabled={!authToken}
          showVoiceInput={browserSupportsSpeechRecognition}
        />
        
        {/* New Thread Button - positioned under chat input on the left */}
        <div className="new-thread-container">
          <button 
            className="new-thread-button"
            onClick={handleNewThreadClick}
            title="Start a new conversation"
          >
            🆕 New Thread
          </button>
        </div>
      </div>

      {/* Math Mascot */}
      <MathMascot 
        isThinking={isLoading}
        isCelebrating={isCelebrating}
        isEncouraging={mascotMood === 'encouraging'}
        currentMood={mascotMood}
        message={mascotMessage}
      />

      {/* New Thread Confirmation Modal */}
      {showNewThreadConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Start New Thread?</h3>
            <p>This will clear the current conversation and start fresh. Your progress will be reset for this session.</p>
            <div className="modal-buttons">
              <button 
                className="modal-button cancel"
                onClick={() => setShowNewThreadConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="modal-button confirm"
                onClick={startNewThread}
              >
                Start New Thread
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;