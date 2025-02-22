import { motion } from "framer-motion";
import { Star, Rocket, GraduationCap } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-spaceBlack to-galaxyBlue text-white flex flex-col items-center p-4 md:p-10 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 animate-pulse-slow" />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-cyan-500/10 to-transparent mix-blend-screen" />
      
      {/* Profile Header */}
      <motion.div 
        className="flex flex-col items-center mt-16 mb-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="relative w-32 h-32 rounded-full border-4 border-cyan-500/30 mb-6 overflow-hidden"
          whileHover={{ scale: 1.05 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-purple-600 opacity-30" />
          <img 
            src="/avatar.png" 
            alt="Profile" 
            className="w-full h-full object-cover rounded-full"
          />
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400/50 animate-pulse" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent"
        >
          John Scholar
        </motion.h2>
        <p className="mt-2 text-stellarGray">AI Learning Enthusiast</p>
      </motion.div>

      {/* Progress Galaxy */}
      <motion.div 
        className="w-full max-w-4xl p-8 glass-container rounded-3xl mb-8"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Learning Progress</h3>
          <Rocket className="text-cyan-400 w-6 h-6" />
        </div>

        <motion.div
          className="relative h-4 bg-white/10 rounded-full overflow-hidden"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="absolute h-full bg-gradient-to-r from-cyan-400 to-teal-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "80%" }}
            transition={{ duration: 2, delay: 0.5 }}
          >
            <div className="absolute inset-0 bg-white/20 animate-shimmer" />
          </motion.div>
        </motion.div>

        <div className="flex justify-between mt-4 text-stellarGray">
          <span>XP Level</span>
          <span className="text-cyan-400">80%</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="glass-container p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <h4 className="text-stellarGray">Courses Completed</h4>
            <GraduationCap className="text-green-400" />
          </div>
          <p className="text-3xl font-bold mt-4">24</p>
        </div>

        <div className="glass-container p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <h4 className="text-stellarGray">Current Streak</h4>
            <div className="flex items-center">
              <Star className="text-yellow-400 fill-yellow-400" />
              <Star className="text-yellow-400 fill-yellow-400" />
              <Star className="text-yellow-400 fill-yellow-400" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-4">58 Days</p>
        </div>

        <div className="glass-container p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <h4 className="text-stellarGray">Achievements</h4>
            <div className="w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center">
              <span className="text-black text-sm">🏆</span>
            </div>
          </div>
          <p className="text-3xl font-bold mt-4">15</p>
        </div>
      </motion.div>

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
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