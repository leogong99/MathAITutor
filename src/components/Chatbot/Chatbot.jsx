import { useState, useRef, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';
import ChatMessage from '../ChatMessage/ChatMessage.jsx';
import ChatInput from '../ChatInput/ChatInput.jsx';
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

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const chatEndRef = useRef(null);

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

  useEffect(() => {
    if (transcript) {
      handleSubmit(transcript);
    }
  }, [transcript]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSuggestionClick = (suggestion) => {
    handleSubmit(suggestion);
    setShowSuggestions(false);
  };

  const handleSubmit = async (text, image) => {
    const userMessage = {
      text: text || (image ? "Uploaded an image" : ""),
      image: image ? URL.createObjectURL(image) : null,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      let response;
      if (image) {
        const formData = new FormData();
        formData.append('image', image);
        if (text) {
          formData.append('message', text);
        }
        
        console.log('Sending image:', image);
        response = await axios.post(`${API_URL}/api/chat/with-image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        response = await axios.post(`${API_URL}/api/chat`, {
          message: text
        });
      }
      
      setMessages(prev => [...prev, {
        text: response.data.message,
        sender: 'bot'
      }]);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error.response?.data?.error || "Sorry, I had trouble understanding that. Could you try asking again?";
      setMessages(prev => [...prev, {
        text: errorMessage,
        sender: 'bot'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening();
  };

  return (
    <div className="chatbot-container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        {isLoading && (
          <ChatMessage message={{ text: "Thinking...", sender: "bot" }} />
        )}
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
        <div ref={chatEndRef} />
      </div>

      <ChatInput
        onSubmit={handleSubmit}
        onVoiceInput={startListening}
        isListening={listening}
        showVoiceInput={browserSupportsSpeechRecognition}
      />
    </div>
  );
};

export default Chatbot; 