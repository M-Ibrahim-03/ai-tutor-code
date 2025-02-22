import { generateAIResponse } from '../utils/openAi.js';

export const askAI = async (req, res) => {
  try {
    const { message } = req.body;
    
    // Set CORS headers explicitly
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', true);
    
    const response = await generateAIResponse(message);
    
    res.json({
      success: true,
      response
    });

  } catch (error) {
    console.error('AI Controller Error:', error);
    res.status(500).json({
      success: false,
      message: 'AI Service Error',
      error: error.message
    });
  }
};