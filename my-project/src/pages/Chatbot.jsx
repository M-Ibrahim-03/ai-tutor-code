import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Rate limiter class to manage API request frequency
class RateLimiter {
  constructor(maxRequests = 3, timeWindow = 60000) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.requests = [];
  }

  async acquireToken() {
    const now = Date.now();
    // Clean up expired timestamps
    this.requests = this.requests.filter(
      timestamp => now - timestamp < this.timeWindow
    );

    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.timeWindow - (now - oldestRequest);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return this.acquireToken();
    }

    this.requests.push(now);
    return true;
  }
}

// Update API configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Important for CORS with credentials
});

// Add request interceptor for token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default function Chatbot() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rateLimiter] = useState(() => new RateLimiter());
  
  // Message history for context
  const [messageHistory, setMessageHistory] = useState([]);
  
  // Retry configuration
  const MAX_RETRIES = 3;
  const INITIAL_RETRY_DELAY = 1000;

  // Update makeApiCall function
  const makeApiCall = useCallback(async (retryCount = 0, delay = INITIAL_RETRY_DELAY) => {
    try {
      await rateLimiter.acquireToken();
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await api.post('/ai/ask', 
        { message },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data && response.data.response) {
        return response.data.response;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('API Error:', error);
      if (error.message === 'No authentication token found') {
        navigate('/login');
        return;
      }
      if (error.response?.status === 429 && retryCount < MAX_RETRIES) {
        // Get retry delay from headers or use exponential backoff
        const retryAfter = parseInt(error.response.headers['retry-after']) * 1000 || delay;
        
        setError(`Rate limited. Retrying in ${retryAfter / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, retryAfter));
        
        // Retry with exponential backoff
        return makeApiCall(retryCount + 1, delay * 2);
      }
      throw error;
    }
  }, [message, rateLimiter, navigate]);

  // Main ask function with enhanced error handling
  const askAI = async () => {
    if (!message.trim()) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const aiResponse = await makeApiCall();
      setResponse(aiResponse);
      
      // Update message history
      setMessageHistory(prev => [
        ...prev,
        { role: "user", content: message },
        { role: "assistant", content: aiResponse }
      ]);
      
      setMessage(""); // Clear input after successful response
    } catch (error) {
      console.error("Error:", error);
      
      // Provide user-friendly error messages
      if (error.response?.status === 401) {
        setError("Authentication failed. Please check your API key.");
      } else if (error.response?.status === 429) {
        setError("Too many requests. Please try again in a moment.");
      } else if (error.code === "ECONNABORTED") {
        setError("Request timed out. Please check your connection.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      askAI();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-spaceBlack to-galaxyBlue text-white p-4">
      <div className="glass-container w-full max-w-2xl p-8 rounded-3xl backdrop-blur-xl">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
          Eduverse AI Tutor
        </h2>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Ask about quantum physics..."
            className="w-full p-4 rounded-xl bg-white/5 border border-cyan-500/30 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          
          <button
            className={`absolute right-2 top-2 px-6 py-2 rounded-lg ${
              isLoading 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-cyan-500 hover:bg-cyan-400'
            } transition-all`}
            onClick={askAI}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Thinking...
              </span>
            ) : 'Ask'}
          </button>
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {/* Response Display */}
        {response && (
          <div className="mt-6 p-4 bg-white/5 rounded-xl border border-cyan-500/20 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center">
                <span className="text-cyan-400">AI</span>
              </div>
              <p className="flex-1 text-stellarGray whitespace-pre-wrap">{response}</p>
            </div>
          </div>
        )}

        {/* Message History */}
        {messageHistory.length > 0 && (
          <div className="mt-6 space-y-4">
            {messageHistory.map((msg, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl ${
                  msg.role === "user" 
                    ? "bg-cyan-500/10 ml-auto" 
                    : "bg-white/5"
                }`}
              >
                <p className="text-sm text-stellarGray">{msg.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}