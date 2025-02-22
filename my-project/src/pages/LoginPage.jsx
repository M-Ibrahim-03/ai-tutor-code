import { motion } from "framer-motion";
import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await login({ email, password });
      if (response.token) {
        localStorage.setItem('token', response.token);
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900 text-white relative overflow-hidden">
      
      {/* 3D Background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Canvas className="w-full h-full">
          <ambientLight intensity={0.5} />
          <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <mesh>
              <boxGeometry args={[2, 2, 2]} />
              <meshStandardMaterial color="purple" wireframe />
            </mesh>
          </Float>
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>

      {/* Login Box */}
      <div className="relative z-10 p-10 bg-black/60 backdrop-blur-lg rounded-lg shadow-xl w-96 flex flex-col items-center">
        <h2 className="text-center text-3xl font-bold text-purple-400">Login to EduVerse</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mt-6 p-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mt-4 p-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          onChange={(e) => setPassword(e.target.value)}
        />

        <motion.button
          onClick={handleLogin}
          className="w-full mt-6 bg-purple-500 hover:bg-purple-700 text-white py-3 rounded-lg font-bold transition-all"
          whileHover={{ scale: 1.1 }}
        >
          Login
        </motion.button>

        <p className="text-center mt-4 text-gray-400">
          Don't have an account? <a href="/signup" className="text-purple-400 hover:underline">Sign Up</a>
        </p>
      </div>
    </div>
  );
}
