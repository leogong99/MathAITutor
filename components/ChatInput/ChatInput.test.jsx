import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatInput from './ChatInput';

describe('ChatInput', () => {
  const mockOnSubmit = jest.fn();
  const mockOnVoiceInput = jest.fn();

  const defaultProps = {
    onSubmit: mockOnSubmit,
    onVoiceInput: mockOnVoiceInput,
    isListening: false,
    showVoiceInput: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input field and buttons', () => {
    render(<ChatInput {...defaultProps} />);
    
    expect(screen.getByPlaceholderText('Ask me any math question!')).toBeInTheDocument();
    expect(screen.getByText('🎤')).toBeInTheDocument();
    expect(screen.getByText('Send')).toBeInTheDocument();
  });

  it('handles text input', () => {
    render(<ChatInput {...defaultProps} />);
    const input = screen.getByPlaceholderText('Ask me any math question!');
    
    fireEvent.change(input, { target: { value: 'test message' } });
    expect(input.value).toBe('test message');
  });

  it('handles form submission', async () => {
    render(<ChatInput {...defaultProps} />);
    const input = screen.getByPlaceholderText('Ask me any math question!');
    const form = screen.getByRole('form');
    
    fireEvent.change(input, { target: { value: 'test message' } });
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith('test message', null);
      expect(input.value).toBe('');
    });
  });

  it('prevents empty submission', () => {
    render(<ChatInput {...defaultProps} />);
    const form = screen.getByRole('form');
    
    fireEvent.submit(form);
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('handles voice input button click', () => {
    render(<ChatInput {...defaultProps} />);
    const voiceButton = screen.getByText('🎤');
    
    fireEvent.click(voiceButton);
    expect(mockOnVoiceInput).toHaveBeenCalled();
  });
}); 