import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";

const questions = [
  { 
    question: "What is photosynthesis?", 
    options: ["Energy absorption", "Food production", "Oxygen release"], 
    correct: 1,
    aiTip: "Remember plants convert light energy to chemical energy"
  },
  { 
    question: "What is the capital of India?", 
    options: ["Mumbai", "Delhi", "Chennai"], 
    correct: 1,
    aiTip: "Think about administrative centers vs financial hubs"
  }
];

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selected, setSelected] = useState(null);
  const progress = useMotionValue(0);
  const progressText = useTransform(progress, value => `${Math.round(value * 100)}%`);

  const handleAnswer = (index) => {
    setSelected(index);
    animate(progress, (currentQuestion + 1) / questions.length, { duration: 0.8 });
    
    setTimeout(() => {
      setSelected(null);
      setCurrentQuestion(prev => (prev + 1) % questions.length);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0c1b] text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 animate-pulse-slow" />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-cyan-500/10 to-transparent" />

      {/* Holographic Progress Ring */}
      <motion.div 
        className="relative w-48 h-48 mb-12"
        initial={{ rotate: -90 }}
      >
        <svg className="w-full h-full">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="transparent"
            stroke="url(#progressGradient)"
            strokeWidth="4"
            strokeDasharray="283"
            strokeDashoffset={progress.get() * 283}
            className="transition-all duration-700"
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f7ff" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
        </svg>
        <motion.span 
          className="absolute inset-0 flex items-center justify-center text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
          style={{ scale: useTransform(progress, [0, 1], [0.8, 1.2]) }}
        >
          {progressText}
        </motion.span>
      </motion.div>

      {/* AI Assistant Bubble */}
      <div className="absolute top-8 right-8 flex items-start space-x-4">
        <motion.div 
          className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-2xl"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🤖
        </motion.div>
        <motion.div
          className="bg-black/50 backdrop-blur-lg p-4 rounded-2xl max-w-xs border border-cyan-500/30"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <p className="text-cyan-400 text-sm">{questions[currentQuestion].aiTip}</p>
        </motion.div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: -90, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-container p-8 rounded-3xl w-11/12 max-w-2xl backdrop-blur-xl border border-cyan-500/20 relative"
        >
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            {questions[currentQuestion].question}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questions[currentQuestion].options.map((option, index) => (
              <motion.button
                key={index}
                className={`p-6 rounded-xl text-left transition-all duration-300 ${
                  selected !== null 
                    ? index === questions[currentQuestion].correct 
                      ? "bg-green-500/20 border-2 border-green-500/50" 
                      : "bg-red-500/20 border-2 border-red-500/50"
                    : "bg-white/5 hover:bg-cyan-500/20 border-2 border-transparent hover:border-cyan-500/30"
                }`}
                whileHover={selected === null ? { scale: 1.05 } : {}}
                onClick={() => handleAnswer(index)}
                disabled={selected !== null}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-4">
                  <span className="text-cyan-400 text-xl">▹</span>
                  <span className="text-lg">{option}</span>
                </div>
                {selected !== null && (
                  <motion.div
                    className="absolute top-2 right-2 text-2xl"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    {index === questions[currentQuestion].correct ? "✅" : "❌"}
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Floating Particles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full"
          initial={{
            x: Math.random() * 100,
            y: Math.random() * 100,
            scale: Math.random()
          }}
          animate={{
            x: ["0%", `${Math.random() * 100}%`],
            y: ["0%", `${Math.random() * 100}%`],
            transition: {
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              repeatType: 'mirror'
            }
          }}
        />
      ))}
    </div>
  );
}