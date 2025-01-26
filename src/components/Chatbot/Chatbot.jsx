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

const Chatbot = ({authToken}) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [voiceInputEnd, setVoiceInputEnd] = useState(false);
  const [transcriptSubmitted, setTranscriptSubmitted] = useState(false);
  const chatEndRef = useRef(null);
  const [conversationContext, setConversationContext] = useState([]);

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
    if (transcript && voiceInputEnd && !transcriptSubmitted) {
      handleSubmit(transcript);
      setTranscriptSubmitted(true);
    }
  }, [transcript, voiceInputEnd, transcriptSubmitted, authToken]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSuggestionClick = (suggestion) => {
    // Get the last question and its response
    const recentContext = messages
      .slice(-2) // Get last two messages (user question and bot response)
      .map(msg => msg.text)
      .join('\n');

    const contextualizedQuestion = `Previous context:\n${recentContext}\n\nFollow-up request: ${suggestion}`;
    handleSubmit(contextualizedQuestion, null, false);
    setShowSuggestions(false);
  };

  const handleSubmit = async (text, image, isNewQuestion = true) => {
    // Update conversation context
    if (!text.startsWith('Previous context:')) {
      setConversationContext(prev => [...prev, text]);
    }

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

    try {
      let response;

      if(!authToken) {
        return;
      }

      const headers = {
        Authorization: `Bearer ${authToken}`
      };


      if (image) {
        const formData = new FormData();
        formData.append('image', image);
        if (text) {
          formData.append('message', text);
        }
        
        console.log('Sending image:', image);
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
        console.log("testing", `${API_URL}/api/chat`);
        response = await axios.post(`${API_URL}/api/chat`,{
          message: text,
          context: conversationContext.slice(-3)
        }, {headers})
        .catch(err => {
          console.error('Service call error:', err);
          return;
        });
      }
      
      setMessages(prev => [...prev, {
        text: response.data.message,
        sender: 'bot'
      }]);
      setShowSuggestions(isNewQuestion);
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
  }

  return (
    <div className="chatbot-container">
      <div className="chat-messages">
        <div className="messages-wrapper">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          {!authToken && (
            <ChatMessage message={{ text: "Please login to continue", sender: "bot" }} />
          )}
          {isLoading && (
            <ChatMessage message={{ text: "Thinking...", sender: "bot" }} />
          )}
          <div ref={chatEndRef} />
          {showSuggestions && !isLoading && messages.length > 0 && (
            <div className="suggestions">
              {FOLLOW_UP_SUGGESTIONS.default.map((suggestion, index) => (
                <button
                  key={index}
                  className="suggestion-button"
                  onClick={() => handleSuggestionClick(`With above problem, ${suggestion}`)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <ChatInput
        onSubmit={handleSubmit}
        onVoiceInput={startListening}
        endVoiceInput={endListening}
        isListening={listening}
        showVoiceInput={browserSupportsSpeechRecognition}
      />
    </div>
  );
};

export default Chatbot;