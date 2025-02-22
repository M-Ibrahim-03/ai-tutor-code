import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../api";
import { Toast } from "../components/Toast";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Basic validation
      if (!formData.username || !formData.email || !formData.password) {
        setError("All fields are required");
        return;
      }

      const response = await authAPI.register(formData);
      
      if (response.success) {
        setShowToast(true);
        // Store token
        localStorage.setItem('token', response.token);
        // Redirect after successful registration
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900 text-white">
      <div className="p-10 bg-black/60 backdrop-blur-lg rounded-lg shadow-xl w-96">
        <h2 className="text-center text-3xl font-bold text-blue-400">Create an Account</h2>

        {error && (
          <div className="mt-4 p-2 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full mt-6 p-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full mt-4 p-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full mt-4 p-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
          />

          <motion.button
            type="submit"
            className="w-full mt-6 bg-blue-500 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition-all"
            whileHover={{ scale: 1.05 }}
          >
            Sign Up
          </motion.button>
        </form>

        <p className="text-center mt-4 text-gray-400">
          Already have an account? <a href="/login" className="text-blue-400 hover:underline">Login</a>
        </p>
      </div>

      {showToast && (
        <Toast 
          message="Registration successful! Redirecting to login..." 
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
