import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function handleChat(req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured",
      }
    });
    return;
  }

  const message = req.body.message || '';
  
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: `You are Math Buddy, a friendly and encouraging math tutor for kids. 
                    Follow these guidelines:
                    - Explain concepts in simple terms
                    - Use encouraging language
                    - Make math fun and engaging
                    - Break down problems into simple steps
                    - Use emojis and friendly language
                    - Keep responses focused on mathematics
                    - Provide visual examples when possible using ASCII art
                    - Celebrate success and encourage learning from mistakes`
      }, {
        role: "user",
        content: message
      }],
      temperature: 0.6,
    });

    res.status(200).json({ message: completion.data.choices[0].message.content });
  } catch(error) {
    console.error(`Error with OpenAI API request: ${error.message}`);
    res.status(500).json({
      error: {
        message: 'An error occurred during your request.',
      }
    });
  }
} 