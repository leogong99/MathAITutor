import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import Chatbot from './Chatbot';

jest.mock('axios');
jest.mock('react-speech-recognition', () => ({
  useSpeechRecognition: () => ({
    transcript: '',
    listening: false,
    resetTranscript: jest.fn(),
    browserSupportsSpeechRecognition: true
  }),
  default: {
    startListening: jest.fn()
  }
}));

describe('Chatbot', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders chat interface', () => {
    render(<Chatbot />);
    expect(screen.getByPlaceholderText('Ask me any math question!')).toBeInTheDocument();
  });

  it('handles text message submission', async () => {
    axios.post.mockResolvedValueOnce({ data: { message: 'Bot response' } });
    
    render(<Chatbot />);
    const input = screen.getByPlaceholderText('Ask me any math question!');
    
    fireEvent.change(input, { target: { value: 'test question' } });
    fireEvent.submit(screen.getByRole('form'));
    
    await waitFor(() => {
      expect(screen.getByText('test question')).toBeInTheDocument();
      expect(screen.getByText('Bot response')).toBeInTheDocument();
    });
  });

  it('handles API error', async () => {
    axios.post.mockRejectedValueOnce(new Error('API Error'));
    
    render(<Chatbot />);
    const input = screen.getByPlaceholderText('Ask me any math question!');
    
    fireEvent.change(input, { target: { value: 'test question' } });
    fireEvent.submit(screen.getByRole('form'));
    
    await waitFor(() => {
      expect(screen.getByText('Sorry, I had trouble understanding that. Could you try asking again?')).toBeInTheDocument();
    });
  });

  it('handles image upload', async () => {
    axios.post.mockResolvedValueOnce({ data: { message: 'Image analysis response' } });
    
    render(<Chatbot />);
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const input = document.querySelector('input[type="file"]');
    
    fireEvent.change(input, { target: { files: [file] } });
    const form = screen.getByRole('form');
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/api/chat/with-image'), expect.any(FormData), expect.any(Object));
      expect(screen.getByText('Image analysis response')).toBeInTheDocument();
    });
  });

  beforeEach(() => {
    URL.createObjectURL = jest.fn(() => 'blob:test-url');
    URL.revokeObjectURL = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
}); 