import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import { SpeechClient } from '@google-cloud/speech';
import OpenAI from 'openai';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const speechClient = new SpeechClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const askAI = async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        if (!process.env.GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY is not set');
            return res.status(500).json({ error: 'AI service configuration error' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        console.log('Sending message to AI:', message);

        const result = await model.generateContent(`You are an expert AI tutor for the Eduverse platform. 
        Help students learn and understand various subjects in a friendly and engaging way.
        
        Student question: ${message}
        
        Please provide a helpful and educational response.`);
        
        const response = await result.response;
        const text = response.text();
        
        console.log('AI Response:', text);
        
        res.json({ response: text });
    } catch (error) {
        console.error('Error in askAI:', error);
        console.error('Error details:', error.message);
        if (error.response) {
            console.error('AI service response:', error.response.data);
        }
        res.status(500).json({ 
            error: 'Failed to get AI response. Please try again.',
            details: error.message
        });
    }
};

export const generateQuiz = async (req, res) => {
    try {
        const { topic } = req.body;
        
        if (!topic) {
            return res.status(400).json({ error: 'Topic is required' });
        }

        if (!process.env.GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY is not set');
            return res.status(500).json({ error: 'AI service configuration error' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const prompt = `Generate a quiz with exactly 4 multiple choice questions about ${topic}.
        Format your response as a JSON array like this example:
        [
          {
            "question": "What is the capital of France?",
            "answers": ["London", "Paris", "Berlin", "Madrid"],
            "correctAnswer": 1
          }
        ]
        Important:
        1. Return exactly 4 questions
        2. Each question must have exactly 4 answer options
        3. correctAnswer must be 0, 1, 2, or 3 (index of correct answer)
        4. Questions should be challenging but fair
        5. Return ONLY the JSON array
        6. Ensure valid JSON format`;

        console.log('Sending prompt to AI:', prompt);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log('Raw AI response:', text);

        // Clean the response text
        const cleanedText = text.trim().replace(/```json|```/g, '').trim();
        console.log('Cleaned response:', cleanedText);
        
        let questions;
        try {
            questions = JSON.parse(cleanedText);
            
            if (!Array.isArray(questions)) {
                console.error('Response is not an array:', cleanedText);
                throw new Error('AI response is not in the correct format (not an array)');
            }
            
            if (questions.length !== 4) {
                console.error(`Wrong number of questions: ${questions.length}`);
                throw new Error(`AI generated ${questions.length} questions instead of 4`);
            }
            
            const validatedQuestions = questions.map((q, i) => {
                if (!q.question || typeof q.question !== 'string') {
                    throw new Error(`Question ${i + 1} is missing or invalid`);
                }
                
                if (!Array.isArray(q.answers) || q.answers.length !== 4) {
                    throw new Error(`Question ${i + 1} does not have exactly 4 answers`);
                }
                
                if (!q.answers.every(a => typeof a === 'string')) {
                    throw new Error(`Question ${i + 1} has invalid answer format`);
                }
                
                const correctAnswer = parseInt(q.correctAnswer);
                if (isNaN(correctAnswer) || correctAnswer < 0 || correctAnswer > 3) {
                    throw new Error(`Question ${i + 1} has invalid correctAnswer: ${q.correctAnswer}`);
                }
                
                return {
                    question: q.question.trim(),
                    answers: q.answers.map(a => a.trim()),
                    correctAnswer: correctAnswer
                };
            });
            
            console.log('Successfully validated questions:', validatedQuestions);
            res.json({ questions: validatedQuestions });
        } catch (error) {
            console.error('Failed to parse or validate AI response:', error);
            console.error('Raw response:', text);
            console.error('Cleaned response:', cleanedText);
            return res.status(500).json({ 
                error: 'Failed to generate valid quiz questions. Please try again.',
                details: error.message
            });
        }
    } catch (error) {
        console.error('Error in generateQuiz:', error);
        console.error('Error details:', error.message);
        if (error.response) {
            console.error('AI service response:', error.response.data);
        }
        res.status(500).json({ 
            error: 'Failed to generate quiz. Please try again.',
            details: error.message
        });
    }
};

export const analyzeLessonSummary = async (req, res) => {
    try {
        const { summary } = req.body;
        
        if (!summary) {
            return res.status(400).json({ error: 'Summary is required' });
        }

        if (!process.env.GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY is not set');
            return res.status(500).json({ error: 'AI service configuration error' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const prompt = `Analyze this lesson summary and provide:
        1. A list of key concepts
        2. A brief explanation suitable for text-to-speech
        3. Three review questions
        4. Learning objectives achieved

        Format the response as a JSON object with these properties:
        {
          "concepts": ["concept1", "concept2", ...],
          "explanation": "Brief, conversational explanation",
          "questions": ["question1", "question2", "question3"],
          "objectives": ["objective1", "objective2", ...]
        }

        Summary to analyze: ${summary}`;

        console.log('Sending prompt to AI:', prompt);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log('Raw AI response:', text);

        // Clean and parse the response
        const cleanedText = text.trim().replace(/```json|```/g, '').trim();
        
        try {
            const analysis = JSON.parse(cleanedText);
            
            // Validate the structure
            if (!analysis.concepts || !Array.isArray(analysis.concepts)) {
                throw new Error('Invalid concepts array');
            }
            if (!analysis.explanation || typeof analysis.explanation !== 'string') {
                throw new Error('Invalid explanation');
            }
            if (!analysis.questions || !Array.isArray(analysis.questions)) {
                throw new Error('Invalid questions array');
            }
            if (!analysis.objectives || !Array.isArray(analysis.objectives)) {
                throw new Error('Invalid objectives array');
            }
            
            res.json({ analysis });
        } catch (error) {
            console.error('Failed to parse AI response:', error);
            console.error('Raw response:', text);
            return res.status(500).json({ 
                error: 'Failed to analyze lesson summary. Please try again.',
                details: error.message
            });
        }
    } catch (error) {
        console.error('Error in analyzeLessonSummary:', error);
        console.error('Error details:', error.message);
        if (error.response) {
            console.error('AI service response:', error.response.data);
        }
        res.status(500).json({ 
            error: 'Failed to analyze lesson. Please try again.',
            details: error.message
        });
    }
};

export const transcribeAudio = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Audio file is required' });
        }

        // Configure the request
        const audio = {
            content: req.file.buffer.toString('base64'),
        };
        const config = {
            encoding: 'LINEAR16',
            sampleRateHertz: 16000,
            languageCode: 'en-US',
        };
        const request = {
            audio: audio,
            config: config,
        };

        // Detects speech in the audio file
        const [response] = await speechClient.recognize(request);
        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');

        res.json({ text: transcription });
    } catch (error) {
        console.error('Error in transcribeAudio:', error);
        res.status(500).json({ 
            error: 'Failed to transcribe audio',
            details: error.message
        });
    }
};

export const analyzeLessonContent = async (req, res) => {
  try {
    const { lessonContent } = req.body;

    if (!lessonContent) {
      return res.status(400).json({ error: 'Lesson content is required' });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert educational analyst. Analyze lesson content and provide structured feedback."
        },
        {
          role: "user",
          content: `
            Analyze the following lesson content and provide:
            1. A brief summary
            2. Key points (maximum 5)
            3. Suggested review questions (maximum 3)
            
            Lesson Content:
            ${lessonContent}
          `
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const analysis = completion.choices[0].message.content;
    
    // Parse the response into structured data
    const sections = analysis.split('\n\n');
    const summary = sections[0];
    const keyPoints = sections[1]
      .split('\n')
      .filter(point => point.trim().startsWith('-'))
      .map(point => point.trim().substring(2));
    const questions = sections[2]
      .split('\n')
      .filter(q => q.trim().startsWith('?'))
      .map(q => q.trim().substring(2));

    res.json({
      summary,
      keyPoints,
      suggestedQuestions: questions
    });

  } catch (error) {
    console.error('Error in lesson analysis:', error);
    res.status(500).json({ error: 'Failed to analyze lesson content' });
  }
};