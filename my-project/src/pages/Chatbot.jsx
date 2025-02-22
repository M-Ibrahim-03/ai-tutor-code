import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane, FaRobot, FaUser, FaSpinner } from "react-icons/fa";
import axios from 'axios';

// Create API instance with consistent configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true,
  timeout: 30000 // 30 second timeout
});

// Rate limiter class to manage API request frequency
class RateLimiter {
  constructor(maxRequests = 3, timeWindow = 60000) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.requests = [];
  }

  async acquireToken() {
    const now = Date.now();
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

export default function Chatbot() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const [rateLimiter] = useState(() => new RateLimiter());
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    try {
      await rateLimiter.acquireToken();
      setIsLoading(true);
      setError(null);
      
      // Add user message
      const userMessage = { type: 'user', content: message.trim() };
      setMessages(prev => [...prev, userMessage]);
      
      // Store message and clear input
      const currentMessage = message.trim();
      setMessage('');

      // Send message to AI
      const response = await api.post('/ai/ask', {
        message: currentMessage
      });

      // Add AI response
      if (response.data && (response.data.response || response.data.message)) {
        setMessages(prev => [...prev, { 
          type: 'ai', 
          content: response.data.response || response.data.message 
        }]);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to get response. Please try again.';
      setError(errorMessage);
      
      // Add error message to chat
      setMessages(prev => [...prev, { 
        type: 'ai', 
        content: 'I apologize, but I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Chat with EduVerse AI
        </h1>

        {/* Chat Container */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-700/50 h-[calc(100vh-12rem)] md:h-[calc(100vh-14rem)] flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 mt-8">
                <FaRobot className="text-4xl mx-auto mb-4" />
                <p>Hi! I'm your AI tutor. Ask me anything about your studies!</p>
              </div>
            )}
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-start gap-3 ${
                  msg.type === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.type === 'user' ? 'bg-purple-500' : 'bg-blue-500'
                }`}>
                  {msg.type === 'user' ? <FaUser /> : <FaRobot />}
                </div>
                <div className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 ${
                  msg.type === 'user' 
                    ? 'bg-purple-500/30 ml-auto' 
                    : 'bg-blue-500/30'
                }`}>
                  <p className="text-sm md:text-base whitespace-pre-wrap">{msg.content}</p>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-gray-400">
                <FaSpinner className="animate-spin" />
                <span>AI is thinking...</span>
              </div>
            )}
            {error && (
              <div className="text-red-400 text-center py-2 bg-red-500/10 rounded-xl">
                {error}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-700/50">
            <div className="flex gap-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything about your studies..."
                className="flex-1 bg-gray-700/50 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none h-12 md:h-14"
                style={{ minHeight: '3rem' }}
              />
              <motion.button
                onClick={handleSendMessage}
                disabled={isLoading || !message.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 rounded-xl flex items-center justify-center gap-2 ${
                  isLoading || !message.trim()
                    ? 'bg-gray-700 cursor-not-allowed'
                    : 'bg-purple-500 hover:bg-purple-600'
                }`}
              >
                {isLoading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaPaperPlane />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}