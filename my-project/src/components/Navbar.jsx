import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaRocket, FaSatellite, FaRobot, FaGraduationCap, FaTrophy, FaHome, FaBook } from "react-icons/fa";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";

// Navbar Component
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home", icon: <FaHome /> },
    { path: "/features", label: "Features", icon: <FaRocket /> },
    { path: "/chat", label: "AI Chat", icon: <FaRobot /> },
    { path: "/lesson-analysis", label: "Lesson Analysis", icon: <FaBook /> },
    { path: "/quiz", label: "Quantum Quiz", icon: <FaGraduationCap /> },
    { path: "/leaderboard", label: "Leaderboard", icon: <FaTrophy /> },
    { path: "/dashboard", label: "Dashboard", icon: <FaSatellite /> },
  ];

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Cosmic Menu Button */}
      <motion.button
        className="fixed top-4 left-4 md:top-6 md:left-6 z-50 p-3 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 shadow-2xl hover:shadow-purple-500/50 transition-all"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1, rotate: 180 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? (
          <FaTimes className="text-xl md:text-2xl text-white animate-pulse" />
        ) : (
          <FaBars className="text-xl md:text-2xl text-white animate-pulse" />
        )}
      </motion.button>

      {/* Animated Space Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="fixed top-0 left-0 h-screen w-64 md:w-80 bg-gradient-to-br from-gray-900/95 to-space-900/95 backdrop-blur-xl shadow-2xl z-40 border-r border-space-500/20"
          >
            {/* Cosmic Background */}
            <div className="absolute inset-0 z-0 opacity-50">
              <Canvas>
                <Stars radius={50} depth={20} count={1000} factor={2} />
              </Canvas>
            </div>

            {/* Navigation Content */}
            <div className="relative z-10 p-6 md:p-8 h-full flex flex-col">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-8 md:mb-12">
                EduVerse Portal
              </h2>

              <ul className="space-y-3 md:space-y-4 flex-1">
                {navItems.map((item, index) => (
                  <motion.li
                    key={item.path}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      onClick={closeMenu}
                      className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-space-800/50 hover:bg-space-700/30 transition-all group"
                    >
                      <span className="text-purple-400 group-hover:text-blue-400 transition-colors">
                        {item.icon}
                      </span>
                      <span className="text-base md:text-lg font-medium text-space-100 group-hover:text-white">
                        {item.label}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>

              {/* Cosmic Footer */}
              <div className="mt-6 md:mt-8 pt-4 md:pt-8 border-t border-space-500/20">
                <p className="text-space-300 text-xs md:text-sm">
                  Exploring the Universe of Knowledge
                </p>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Overlay to close menu on mobile */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeMenu}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
        />
      )}
    </>
  );
}