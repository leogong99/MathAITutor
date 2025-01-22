import { useState, useRef } from 'react';
import ImageUpload from '../ImageUpload/ImageUpload';
import './ChatInput.css';

const ChatInput = ({ onSubmit, onVoiceInput, endVoiceInput, isListening, showVoiceInput }) => {
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault(); // Prevent default form submission
      return;
    }

    e.preventDefault();
    if (!input.trim() && !selectedImage) return;
    
    setIsUploading(true);
    await onSubmit(input, selectedImage);
    setInput('');
    setSelectedImage(null);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsUploading(false);
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


  return (
    <form onSubmit={handleSubmit} className="input-form">
      <div className="input-container">
        <textarea
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={selectedImage ? "Ask about the image..." : "Ask me any math question!"}
          className="message-input"
        />
        <ImageUpload 
          onImageSelect={handleImageSelect}
          isUploading={isUploading}
          selectedImage={selectedImage}
          onClearImage={handleClearImage}
          fileInputRef={fileInputRef}
        />
      </div>
      <div className="button-container">
        {showVoiceInput && (
          <button
            type="button"
            onTouchStart={onVoiceInput}
            onMouseDown={onVoiceInput}
            onTouchEnd={endVoiceInput}
            onMouseUp={endVoiceInput}
            className={`voice-button ${isListening ? 'listening' : ''}`}
          >
            🎤
          </button>
        )}
        <button type="submit" className="send-button" disabled={isUploading}>
          Send
        </button>
      </div>
    </form>
  );
};

export default ChatInput; 