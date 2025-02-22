import { useState } from "react";
import { motion } from "framer-motion";
import { FaRobot, FaLightbulb, FaCheck, FaTimes, FaSpinner } from "react-icons/fa";
import axios from 'axios';

// Create API instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

export default function Quiz() {
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [error, setError] = useState(null);

  const handleStartQuiz = async () => {
    if (!topic.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      setQuestions([]);
      setShowScore(false);
      setScore(0);
      setSelectedAnswers({});
      setCurrentQuestion(0);

      const response = await api.post('/ai/generate-quiz', {
        topic: topic.trim()
      });

      if (response.data && response.data.questions) {
        setQuestions(response.data.questions);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error:', err);
      const errorMessage = err.response?.data?.error || err.response?.data?.details || err.message || 'Failed to generate quiz. Please try again.';
      setError(errorMessage);
      
      // If we get an error, clear any partial state
      setQuestions([]);
      setScore(0);
      setSelectedAnswers({});
      setCurrentQuestion(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    if (selectedAnswers[questionIndex] !== undefined) return; // Prevent changing answer

    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));

    if (questions[questionIndex].correctAnswer === answerIndex) {
      setScore(prev => prev + 1);
    }

    // Move to next question after a delay
    setTimeout(() => {
      if (questionIndex === questions.length - 1) {
        setShowScore(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
      }
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleStartQuiz();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Quantum Quiz Challenge
        </h1>

        {/* Topic Input */}
        {!questions.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-gray-700/50"
          >
            <div className="flex flex-col items-center gap-6">
              <FaRobot className="text-5xl text-purple-400" />
              <h2 className="text-xl text-center">
                Enter any topic and I'll generate a quiz for you!
              </h2>
              <div className="w-full max-w-md flex gap-4">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., Quantum Physics, World History, etc."
                  className="flex-1 bg-gray-700/50 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <motion.button
                  onClick={handleStartQuiz}
                  disabled={isLoading || !topic.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-2 rounded-xl flex items-center justify-center gap-2 ${
                    isLoading || !topic.trim()
                      ? 'bg-gray-700 cursor-not-allowed'
                      : 'bg-purple-500 hover:bg-purple-600'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Start Quiz'
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quiz Questions */}
        {questions.length > 0 && !showScore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-gray-700/50"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-purple-400">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-blue-400">
                Score: {score}/{questions.length}
              </span>
            </div>

            <div className="mb-8">
              <h3 className="text-xl mb-6 flex items-center gap-3">
                <FaLightbulb className="text-yellow-400" />
                {questions[currentQuestion].question}
              </h3>

              <div className="space-y-4">
                {questions[currentQuestion].answers.map((answer, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswerSelect(currentQuestion, index)}
                    disabled={selectedAnswers[currentQuestion] !== undefined}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      selectedAnswers[currentQuestion] === undefined
                        ? 'bg-gray-700/50 hover:bg-gray-600/50'
                        : selectedAnswers[currentQuestion] === index
                        ? index === questions[currentQuestion].correctAnswer
                          ? 'bg-green-500/20 border-2 border-green-500'
                          : 'bg-red-500/20 border-2 border-red-500'
                        : index === questions[currentQuestion].correctAnswer
                        ? 'bg-green-500/20 border-2 border-green-500'
                        : 'bg-gray-700/50 opacity-50'
                    }`}
                    whileHover={
                      selectedAnswers[currentQuestion] === undefined
                        ? { scale: 1.02 }
                        : {}
                    }
                  >
                    <div className="flex items-center gap-3">
                      {selectedAnswers[currentQuestion] === index && (
                        index === questions[currentQuestion].correctAnswer
                          ? <FaCheck className="text-green-500" />
                          : <FaTimes className="text-red-500" />
                      )}
                      {answer}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Score Display */}
        {showScore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-gray-700/50 text-center"
          >
            <h2 className="text-2xl mb-4">Quiz Complete!</h2>
            <p className="text-4xl font-bold mb-6 text-purple-400">
              Your Score: {score}/{questions.length}
            </p>
            <motion.button
              onClick={() => {
                setQuestions([]);
                setTopic("");
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-xl"
            >
              Try Another Topic
            </motion.button>
          </motion.div>
        )}

        {error && (
          <div className="mt-4 text-red-400 text-center py-3 bg-red-500/10 rounded-xl">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}