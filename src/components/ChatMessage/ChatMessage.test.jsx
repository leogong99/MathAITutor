import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatMessage from './ChatMessage';

describe('ChatMessage', () => {
  it('renders user message', () => {
    const message = {
      text: 'Hello',
      sender: 'user'
    };
    
    render(<ChatMessage message={message} />);
    const messageElement = screen.getByText('Hello');
    
    expect(messageElement).toBeInTheDocument();
    expect(messageElement.closest('.message')).toHaveClass('user-message');
  });

  it('renders bot message', () => {
    const message = {
      text: 'Hi there!',
      sender: 'bot'
    };
    
    render(<ChatMessage message={message} />);
    const messageElement = screen.getByText('Hi there!');
    
    expect(messageElement).toBeInTheDocument();
    expect(messageElement.closest('.message')).toHaveClass('bot-message');
  });

  it('renders message with image', () => {
    const message = {
      text: 'Check this image',
      sender: 'user',
      image: 'test-image-url'
    };
    
    render(<ChatMessage message={message} />);
    
    expect(screen.getByText('Check this image')).toBeInTheDocument();
    expect(screen.getByAltText('Uploaded')).toHaveAttribute('src', 'test-image-url');
  });
}); 