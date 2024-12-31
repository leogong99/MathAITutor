const express = require('express');
const OpenAI = require('openai');
const upload = require('../middleware/upload');

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are Math Buddy, a friendly and encouraging math tutor for kids. 
  Follow these guidelines:
  - Explain concepts in simple terms
  - Use encouraging language
  - Make math fun and engaging
  - Break down problems into simple steps
  - Use emojis and friendly language
  - Keep responses focused on mathematics
  - Provide visual examples when possible using ASCII art
  - Celebrate success and encourage learning from mistakes`;

router.post('/', async (req, res) => {
  if (!openai.apiKey) {
    return res.status(500).json({
      error: "OpenAI API key not configured"
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: SYSTEM_PROMPT
      }, {
        role: "user",
        content: req.body.message
      }],
      temperature: 0.6,
    });

    res.json({ message: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'An error occurred during your request.'
    });
  }
});

router.post('/with-image', upload.single('image'), async (req, res) => {
  console.log('Received image request');
  console.log('File:', req.file);
  console.log('Message:', req.body.message);

  if (!openai.apiKey) {
    return res.status(500).json({
      error: "OpenAI API key not configured"
    });
  }

  try {
    const base64Image = req.file.buffer.toString('base64');
    console.log('Image converted to base64');
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: [
            { type: "text", text: req.body.message || "What math problem do you see in this image?" },
            {
              type: "image_url",
              image_url: {
                url: `data:${req.file.mimetype};base64,${base64Image}`,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    console.log('Got response from OpenAI');
    res.json({ message: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    res.status(500).json({
      error: error.message || 'An error occurred during your request.'
    });
  }
});

exports.chatRouter = router; 