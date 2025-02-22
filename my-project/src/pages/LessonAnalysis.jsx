import React, { useState } from 'react';
import AIAvatar from '../components/AIAvatar';
import axios from 'axios';

export default function LessonAnalysis() {
  const [lessonText, setLessonText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentSpeech, setCurrentSpeech] = useState('');
  const [speaking, setSpeaking] = useState(false);

  const analyzeLessonContent = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/v1/ai/analyze-lesson', {
        lessonContent: lessonText
      });
      
      setAnalysis(response.data);
      // Start with introduction
      setCurrentSpeech("Hello! I've analyzed your lesson content. Let me walk you through the key points.");
      setSpeaking(true);
    } catch (error) {
      console.error('Error analyzing lesson:', error);
      setCurrentSpeech("I apologize, but I encountered an error while analyzing the lesson. Please try again.");
      setSpeaking(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeechFinished = () => {
    setSpeaking(false);
    if (analysis) {
      // Queue next section of analysis
      if (!speaking) {
        setCurrentSpeech(analysis.summary);
        setSpeaking(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center mb-8">Lesson Analysis</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Input Your Lesson</h2>
            <textarea
              className="w-full h-64 p-4 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Paste your lesson content here..."
              value={lessonText}
              onChange={(e) => setLessonText(e.target.value)}
            />
            <button
              className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
                loading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              onClick={analyzeLessonContent}
              disabled={loading || !lessonText.trim()}
            >
              {loading ? 'Analyzing...' : 'Analyze Lesson'}
            </button>
          </div>

          {/* Avatar and Analysis Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">AI Analysis</h2>
            <div className="bg-gray-800 rounded-xl p-4">
              <AIAvatar 
                text={currentSpeech}
                emotion={speaking ? 'talking' : 'neutral'}
                onFinishSpeaking={handleSpeechFinished}
              />
            </div>
            
            {analysis && (
              <div className="space-y-4 bg-gray-800/50 rounded-xl p-4">
                <h3 className="text-xl font-semibold">Key Points</h3>
                <ul className="list-disc list-inside space-y-2">
                  {analysis.keyPoints?.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
                
                <h3 className="text-xl font-semibold mt-4">Suggested Questions</h3>
                <ul className="list-disc list-inside space-y-2">
                  {analysis.suggestedQuestions?.map((question, index) => (
                    <li key={index}>{question}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 