const request = require('supertest');
const express = require('express');
const { chatRouter } = require('../chat');
const OpenAI = require('openai');
const multer = require('multer');

jest.mock('openai');
jest.mock('multer');
jest.mock('../middleware/upload', () => {
  const multer = require('multer');
  return multer();
});

const app = express();
app.use(express.json());
app.use('/api/chat', chatRouter);

describe('Chat Router', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    multer.mockImplementation(() => ({
      single: () => (req, res, next) => {
        req.file = {
          buffer: Buffer.from('test'),
          mimetype: 'image/png'
        };
        next();
      }
    }));
  });

  it('handles text chat requests', async () => {
    const mockResponse = {
      choices: [{ message: { content: 'Test response' } }]
    };
    
    OpenAI.prototype.chat.completions.create = jest.fn().mockResolvedValue(mockResponse);
    
    const response = await request(app)
      .post('/api/chat')
      .send({ message: 'test question' });
    
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Test response');
  });

  it('handles image analysis requests', async () => {
    const mockResponse = {
      choices: [{ message: { content: 'Image analysis response' } }]
    };
    
    OpenAI.prototype.chat.completions.create = jest.fn().mockResolvedValue(mockResponse);
    
    const response = await request(app)
      .post('/api/chat/with-image')
      .attach('image', Buffer.from('test'), 'test.png')
      .field('message', 'analyze this');
    
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Image analysis response');
    expect(OpenAI.prototype.chat.completions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'gpt-4-vision-preview',
        messages: expect.arrayContaining([
          expect.objectContaining({
            role: 'user',
            content: expect.arrayContaining([
              expect.objectContaining({ type: 'text' }),
              expect.objectContaining({ type: 'image_url' })
            ])
          })
        ])
      })
    );
  });

  it('handles API errors', async () => {
    OpenAI.prototype.chat.completions.create = jest.fn().mockRejectedValue(new Error('API Error'));
    
    const response = await request(app)
      .post('/api/chat')
      .send({ message: 'test question' });
    
    expect(response.status).toBe(500);
    expect(response.body.error).toBeTruthy();
  });
}); 