import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpinner, FaRobot, FaVolumeUp, FaVolumeMute, FaMagic, FaBrain, FaLightbulb, FaEraser } from 'react-icons/fa';
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import AIAvatar from '../components/AIAvatar';
import axios from 'axios';

// Create a custom axios instance for this component
const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000, // 30 second timeout
  // Add retry configuration
  retry: 3,
  retryDelay: (retryCount) => {
    return retryCount * 1000; // time interval between retries
  }
});

// Add response interceptor for retry logic
api.interceptors.response.use(null, async (error) => {
  if (error.config && error.config.__retryCount < error.config.retry) {
    error.config.__retryCount = error.config.__retryCount || 0;
    error.config.__retryCount += 1;
    
    const backoff = new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, error.config.retryDelay(error.config.__retryCount));
    });
    
    await backoff;
    return api(error.config);
  }
  return Promise.reject(error);
});

export default function LessonAnalysis() {
  const [lessonText, setLessonText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [speechQueue, setSpeechQueue] = useState([]);
  const [currentSpeech, setCurrentSpeech] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const maxRetries = 3;

  // Initialize speech synthesis
  useEffect(() => {
    const synth = window.speechSynthesis;
    // Cancel any ongoing speech when component unmounts
    return () => {
      synth.cancel();
    };
  }, []);

  // Handle speech synthesis
  useEffect(() => {
    if (currentSpeech && audioEnabled && !speaking) {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(currentSpeech);

      // Configure voice settings
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Try to use a good quality voice
      const voices = synth.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Samantha') ||
        voice.name.includes('Female') ||
        voice.lang === 'en-US'
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      // Handle speech events
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => {
        setSpeaking(false);
        if (speechQueue.length > 0) {
          const nextSpeech = speechQueue[0];
          setCurrentSpeech(nextSpeech);
          setSpeechQueue(prev => prev.slice(1));
        }
      };
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setSpeaking(false);
      };

      // Cancel any ongoing speech before starting new one
      synth.cancel();
      synth.speak(utterance);
    }
  }, [currentSpeech, audioEnabled, speaking, speechQueue]);

  const toggleAudio = () => {
    const synth = window.speechSynthesis;
    if (audioEnabled) {
      synth.cancel();
      setSpeaking(false);
    } else {
      // When re-enabling audio, start from current speech if any
      if (currentSpeech) {
        setSpeaking(false); // Reset speaking state to trigger speech
      }
    }
    setAudioEnabled(!audioEnabled);
  };

  // Clear error when component mounts or when retry count changes
  useEffect(() => {
    setError(null);
  }, [retryCount]);

  const analyzeLessonContent = async () => {
    try {
      // Validate input
      if (!lessonText.trim()) {
        setError('Please enter some lesson content to analyze');
        return;
      }

      setLoading(true);
      setError(null);
      
      // Make the API request
      const response = await api.post('/ai/analyze-lesson', {
        lessonContent: lessonText.trim()
      });
      
      // Check if we have valid data
      if (!response.data || (!response.data.summary && !response.data.keyPoints)) {
        throw new Error('Invalid response format from server');
      }

      setAnalysis(response.data);
      
      // Set up speech queue
      setSpeechQueue([
        response.data.summary,
        "Now, let me go through the key points.",
        ...response.data.keyPoints,
        "Finally, here are some review questions to consider:",
        ...response.data.suggestedQuestions
      ]);
      
      // Start with introduction
      setCurrentSpeech("Hello! I've analyzed your lesson content. Let me walk you through it.");
      setSpeaking(false); // Reset speaking state to trigger speech
      setRetryCount(0);
      
    } catch (error) {
      console.error('Error analyzing lesson:', error);
      
      let errorMessage = error.response?.data?.details || 
                        error.response?.data?.error || 
                        error.message || 
                        'Failed to analyze lesson content';
      
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Unable to connect to the server. Please check your connection and try again.';
      }
      
      setError(errorMessage);
      setCurrentSpeech("I apologize, but I encountered an error while analyzing the lesson. Please try again.");
      setSpeaking(false);
    } finally {
      setLoading(false);
    }
  };

  const clearAnalysis = () => {
    setLessonText('');
    setAnalysis(null);
    setError(null);
    setSpeechQueue([]);
    setCurrentSpeech('');
    setSpeaking(false);
    setLoading(false);
    setRetryCount(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-8 pt-24">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent mb-4">
            AI Lesson Analysis
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Transform your study materials into comprehensive insights with our advanced AI analysis
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <GlassCard className="p-6" glow>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <FaBrain className="text-2xl text-white" />
                </div>
                <h2 className="text-2xl font-semibold">Input Your Lesson</h2>
              </div>
              
              <textarea
                className="w-full h-64 p-4 rounded-xl bg-gray-800/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none backdrop-blur-sm"
                placeholder="Paste your lesson content here..."
                value={lessonText}
                onChange={(e) => {
                  setLessonText(e.target.value);
                  setError(null);
                }}
              />
              
              <div className="flex gap-4 mt-4">
                <GlowButton
                  className="flex-1"
                  onClick={analyzeLessonContent}
                  disabled={loading || !lessonText.trim()}
                  icon={loading ? <LoadingSpinner size="sm" /> : <FaMagic />}
                >
                  {loading ? 'Analyzing...' : 'Analyze Lesson'}
                </GlowButton>
                
                <GlowButton
                  variant="secondary"
                  onClick={clearAnalysis}
                  icon={<FaEraser />}
                  disabled={loading || (!lessonText && !analysis)}
                >
                  Clear
                </GlowButton>
              </div>
              
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-red-400 bg-red-400/10 rounded-lg p-4 text-sm"
                >
                  {error}
                  {retryCount > 0 && (
                    <div className="mt-2">
                      Retrying... Attempt {retryCount} of {maxRetries}
                    </div>
                  )}
                </motion.div>
              )}
            </GlassCard>

            {/* Quick Tips */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaLightbulb className="text-yellow-400" />
                Pro Tips
              </h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-400" />
                  Paste clear, well-structured content
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  Include key concepts and definitions
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  Review the AI's analysis thoroughly
                </li>
              </ul>
            </GlassCard>
          </div>

          {/* Avatar Section */}
          <div className="space-y-6">
            <GlassCard className="p-6" glow>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <FaRobot className="text-2xl text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold">AI Tutor</h2>
                </div>
                <GlowButton
                  variant="secondary"
                  onClick={toggleAudio}
                  icon={audioEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
                >
                  {audioEnabled ? 'Mute' : 'Unmute'}
                </GlowButton>
              </div>
              
              <AIAvatar speaking={speaking} />
            </GlassCard>
          </div>
        </div>

        {/* Analysis Results */}
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <GlassCard className="p-6" glow>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <FaLightbulb className="text-2xl text-white" />
                </div>
                <h2 className="text-2xl font-semibold">Analysis Results</h2>
              </div>
              
              <div className="space-y-6">
                {/* Summary */}
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-purple-400">Summary</h3>
                  <p className="text-gray-300">{analysis.summary}</p>
                </div>
                
                {/* Key Points */}
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-blue-400">Key Points</h3>
                  <ul className="space-y-2">
                    {analysis.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300">
                        <div className="w-2 h-2 mt-2 rounded-full bg-blue-400" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Review Questions */}
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-emerald-400">Review Questions</h3>
                  <ul className="space-y-2">
                    {analysis.suggestedQuestions.map((question, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300">
                        <div className="w-2 h-2 mt-2 rounded-full bg-emerald-400" />
                        {question}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}