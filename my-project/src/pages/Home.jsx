import { useEffect, useRef } from "react";
import * as THREE from "three";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaRocket, FaMagic, FaLightbulb } from "react-icons/fa";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Float, OrbitControls, Stars } from "@react-three/drei";
import { EffectComposer, Glitch } from "@react-three/postprocessing";


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
      <EffectComposer>
        <Glitch delay={[1, 2]} duration={[0.1, 0.3]} strength={0.2} />
      </EffectComposer>
      <OrbitControls enableZoom={false} autoRotate />
    </Canvas>
  );
}

// Animated Grid Component
function AnimatedGrid() {
  const gridRef = useRef();

  useFrame(({ clock }) => {
    gridRef.current.position.z = clock.getElapsedTime() * 0.5;
  });

  return (
    <mesh ref={gridRef} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[100, 100, 100, 100]} />
      <meshStandardMaterial
        color="#4f46e5"
        wireframe
        opacity={0.2}
        transparent
        emissive="#818cf8"
      />
    </mesh>
  );
}

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-space-900 to-black text-white relative overflow-hidden">
      
      {/* Cosmic Background */}
      <CosmicBackground />

      {/* Floating Particles */}
      <Canvas className="absolute inset-0 z-10">
        <AnimatedGrid />
        <Stars radius={50} depth={20} count={1000} factor={2} />
      </Canvas>

      {/* Main Content */}
      <motion.div 
        className="relative z-20 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
      >
        {/* Animated Title */}
        <motion.h1 
          className="text-8xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
          style={{ textShadow: '0 0 20px rgba(192, 132, 252, 0.5)' }}
          animate={{
            scale: [1, 1.05, 1],
            textShadow: ['0 0 20px rgba(192, 132, 252, 0.5)', '0 0 30px rgba(192, 132, 252, 0.8)', '0 0 20px rgba(192, 132, 252, 0.5)']
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          EduVerse
        </motion.h1>

        {/* Holographic Subtitle */}
        <motion.p 
          className="mt-6 text-2xl font-light bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Where Learning Defies Gravity
        </motion.p>

        {/* Interactive CTA Button */}
        <motion.div 
          className="mt-12 relative group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-0 bg-purple-500 blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
          <button className="relative px-12 py-4 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full text-xl font-bold shadow-2xl hover:shadow-purple-500/30 transition-all">
            <span className="flex items-center gap-3">
              <FaRocket className="animate-pulse" />
              Launch Learning Journey
              <FaMagic className="animate-spin-slow" />
            </span>
          </button>
        </motion.div>

        {/* Floating Feature Cards */}
        <div className="mt-20 flex gap-8 justify-center">
          {['AI-Powered', 'Offline First', '3D Learning'].map((feature, i) => (
            <motion.div
              key={feature}
              className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl backdrop-blur-lg border border-gray-700 shadow-xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * i, duration: 0.8 }}
              whileHover={{ y: -10 }}
            >
              <div className="text-purple-400 text-4xl mb-4">
                {i === 0 ? <FaLightbulb /> : i === 1 ? <FaMagic /> : <FaRocket />}
              </div>
              <h3 className="text-xl font-semibold">{feature}</h3>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Scrolling Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-8 h-8 border-4 border-purple-400 rounded-full animate-ping" />
      </motion.div>
    </div>
  );
}