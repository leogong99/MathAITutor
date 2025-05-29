import { useState, useRef } from 'react';
import ImageUpload from '../ImageUpload/ImageUpload';
import './ChatInput.css';

const ChatInput = ({ onSubmit, onVoiceInput, endVoiceInput, isListening, showVoiceInput, disabled }) => {
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const fileInputRef = useRef(null);

  const handleEnter = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); 
      handleSubmit(e)
    } 
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() && !selectedImage) return;
    
    // Clear input immediately
    const currentInput = input;
    setInput('');
    
    setIsWaitingForResponse(true);
    // Only set isUploading to true if there's an image
    if (selectedImage) {
      setIsUploading(true);
    }
    
    await onSubmit(currentInput, selectedImage);
    setSelectedImage(null);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsUploading(false);
    setIsWaitingForResponse(false);
  };

  const handleImageSelect = (file) => {
    setSelectedImage(file);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isDisabled = disabled || isWaitingForResponse;

  return (
    <form onSubmit={handleSubmit} className="input-form">
      <div className="input-container">
        <textarea
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={selectedImage ? "Ask about the image..." : "Ask me any math question!"}
          className="message-input"
          onKeyDown={handleEnter}
          disabled={isDisabled}
        />
        <button type="submit" className="send-button" disabled={isDisabled || isUploading}>
          Send
        </button>
      </div>
      <div className="button-container">
        {showVoiceInput && (
          <button
            type="button"
            onTouchStart={onVoiceInput}
            onMouseDown={onVoiceInput}
            onTouchEnd={endVoiceInput}
            onMouseUp={endVoiceInput}
            disabled={isDisabled}
            className={`voice-button ${isListening ? 'listening' : ''}`}
          >
            🎤
          </button>
        )}
        <ImageUpload 
          onImageSelect={handleImageSelect}
          isUploading={isUploading}
          selectedImage={selectedImage}
          onClearImage={handleClearImage}
          fileInputRef={fileInputRef}
          disabled={isDisabled}
        />
      </div>
    </form>
  );
};

export default ChatInput; 