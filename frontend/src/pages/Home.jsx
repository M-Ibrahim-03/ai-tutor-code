import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaRobot, FaBrain, FaGraduationCap, FaArrowRight, FaChalkboardTeacher, FaRocket, FaBook } from "react-icons/fa";
import { Canvas } from "@react-three/fiber";
import { Text, Float, OrbitControls, Stars } from "@react-three/drei";

// Quick access features
const quickFeatures = [
  {
    id: 'chat',
    title: 'AI Chat Tutor',
    description: 'Get instant help with any subject',
    icon: <FaRobot className="text-3xl" />,
    color: 'from-purple-500 to-blue-500',
    link: '/chat'
  },
  {
    id: 'analysis',
    title: 'Lesson Analysis',
    description: 'Transform text into smart summaries',
    icon: <FaBrain className="text-3xl" />,
    color: 'from-blue-500 to-cyan-500',
    link: '/lesson-analysis'
  },
  {
    id: 'quiz',
    title: 'Quantum Quiz',
    description: 'Test your knowledge dynamically',
    icon: <FaGraduationCap className="text-3xl" />,
    color: 'from-emerald-500 to-teal-500',
    link: '/quiz'
  }
];

// Cosmic Background Component
function CosmicBackground() {
  return (
    <Canvas className="absolute inset-0 z-0">
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
      <Float speed={3} rotationIntensity={0.5} floatIntensity={2}>
        <Text
          fontSize={2}
          color="#7c3aed"
          position={[0, 0, -10]}
          font="https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf"
        >
          EduVerse
          <meshBasicMaterial color="#7c3aed" />
        </Text>
      </Float>
      <OrbitControls enableZoom={false} autoRotate />
    </Canvas>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <CosmicBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Welcome to EduVerse
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Your AI-powered learning companion. Experience the future of education with personalized tutoring, smart analysis, and interactive quizzes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {quickFeatures.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Link to={feature.link}>
                <div className={`p-6 rounded-xl bg-gradient-to-br ${feature.color} hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300`}>
                  <div className="text-white mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-100">{feature.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center"
        >
          <Link to="/features">
            <button className="group flex items-center gap-2 mx-auto px-6 py-3 bg-purple-600 rounded-full text-white hover:bg-purple-700 transition-colors">
              Explore All Features
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}