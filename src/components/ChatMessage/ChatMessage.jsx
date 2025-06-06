import './ChatMessage.css';
import MathExpression from '../MathExpression/MathExpression';

const ChatMessage = ({ message }) => {
  const { text, sender, image } = message;
  
  return (
    <div className={`message-wrapper ${sender === 'user' ? 'user' : 'bot'}`}>
      <div className={`message ${sender === 'user' ? 'user-message' : 'bot-message'}`}>
        {image && (
          <div className="message-image">
            <img src={image} alt="Uploaded" />
          </div>
        )}
        <MathExpression text={text} />
      </div>
    </div>
  );
};

export default ChatMessage; 