// Add this import at the top
import { OrbitControls } from "@react-three/drei";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaBrain, FaBook, FaGamepad, FaRobot } from "react-icons/fa";
import { Canvas } from "@react-three/fiber";
import { Stars, Float, Text } from "@react-three/drei";
// import * as THREE from "three";

const cosmicFeatures = [
  { 
    icon: <FaBrain className="text-6xl" />,
    title: "Neural Quizzes", 
    desc: "AI-powered adaptive learning paths",
    color: "#8B5CF6",
    effect: "animate-pulse"
  },
  { 
    icon: <FaBook className="text-6xl" />,
    title: "Dark Matter Storage", 
    desc: "Learn anywhere, zero connectivity needed",
    color: "#3B82F6",
    effect: "animate-float"
  },
  { 
    icon: <FaGamepad className="text-6xl" />,
    title: "Quantum Leaderboards", 
    desc: "Compete across parallel learning dimensions",
    color: "#10B981",
    effect: "animate-spin-slow"
  },
  { 
    icon: <FaRobot className="text-6xl" />,
    title: "Hologram Tutor", 
    desc: "3D AI assistant with voice synthesis",
    color: "#EC4899",
    effect: "animate-ping"
  },
];

function CosmicBackground() {
  return (
    <Canvas className="absolute inset-0 z-0">
      <ambientLight intensity={0.5} />
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade />
      <Float speed={3} rotationIntensity={0.5} floatIntensity={2}>
        <Text
          font="/fonts/space-age.woff"
          fontSize={1.5}
          position={[0, 0, -10]}
          color="#7C3AED"
        >
          Knowledge Singularity
          <meshStandardMaterial color="#7C3AED" />
        </Text>
      </Float>
    </Canvas>
  );
}

export default function FeaturesPage() {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1.2]);

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-space-900 to-black text-white relative overflow-hidden"
      style={{ scale }}
    >
      <CosmicBackground />
      
      <div className="relative z-10 container mx-auto px-6 py-24">
        <motion.h2 
          className="text-center text-6xl font-bold mb-20 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Cosmic Learning Features
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cosmicFeatures.map((feature, index) => (
            <motion.div
              key={index}
              className="p-8 rounded-2xl backdrop-blur-xl bg-space-800/50 border border-space-500/20 hover:border-purple-400/30 transition-all relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "0px 0px -100px 0px" }}
              transition={{ delay: index * 0.2, type: "spring" }}
              whileHover={{ y: -10 }}
            >
              {/* Particle Effect */}
              <div className={`absolute inset-0 opacity-20 ${feature.effect}`}>
                <Canvas>
                  <Stars radius={10} depth={5} count={50} factor={2} />
                </Canvas>
              </div>

              <div className="relative z-10 text-center space-y-6">
                <motion.div 
                  className="inline-block"
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    y: [0, -10, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <span style={{ color: feature.color }}>
                    {feature.icon}
                  </span>
                </motion.div>
                
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                  {feature.title}
                </h3>
                
                <p className="text-space-200 text-lg leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Interactive 3D Element */}
        <div className="mt-20 h-96 w-full">
          <Canvas>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Float speed={3} rotationIntensity={0.5} floatIntensity={2}>
              <mesh>
                <dodecahedronGeometry args={[3, 0]} />
                <meshStandardMaterial 
                  color="#7C3AED" 
                  emissive="#4F46E5"
                  emissiveIntensity={0.5}
                  wireframe
                />
              </mesh>
            </Float>
            <OrbitControls enableZoom={false} />
          </Canvas>
        </div>
      </div>
    </motion.div>
  );
}