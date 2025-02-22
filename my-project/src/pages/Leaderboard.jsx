import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";

const users = [
  { name: "Rahul", xp: 90, avatar: "🚀" },
  { name: "Sara", xp: 75, avatar: "🎓" },
  { name: "Amit", xp: 50, avatar: "💡" }
];

export default function LeaderboardPage() {
  const controls = useAnimation();
  const ref = useRef(null);

  // Remove TypeScript type
  const getRankColor = (index) => {
    switch (index) {
      case 0: return "from-yellow-400 to-amber-600";
      case 1: return "from-slate-300 to-slate-500";
      case 2: return "from-amber-700 to-amber-900";
      default: return "from-purple-500 to-indigo-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-spaceBlack to-galaxyBlue pt-28 px-4 md:px-10 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 animate-pulse-slow" />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-cyan-500/10 to-transparent mix-blend-screen" />

      <motion.h2 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="text-5xl md:text-7xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent"
      >
        Galactic Leaderboard
        <p className="text-xl md:text-2xl mt-4 font-light text-stellarPurple">Climb the ranks, conquer the universe</p>
      </motion.h2>

      <div ref={ref} className="max-w-4xl mx-auto space-y-6 relative">
        {users.map((user, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={controls}
            whileHover={{ scale: 1.02 }}
            className="group relative p-1 rounded-2xl bg-gradient-to-r from-cyan-500/30 to-purple-500/30 hover:from-cyan-500/50 hover:to-purple-500/50 transition-all duration-300 shadow-galactic"
          >
            <div className="bg-spaceBlack/90 backdrop-blur-xl rounded-xl p-6 flex items-center space-x-6 relative overflow-hidden">
              {/* Rank Badge */}
              <div className={`w-16 h-16 flex items-center justify-center rounded-xl bg-gradient-to-br ${getRankColor(index)}`}>
                <span className="text-2xl font-bold text-stellarWhite">#{index + 1}</span>
              </div>

              {/* Avatar */}
              <div className="w-20 h-20 flex items-center justify-center text-3xl bg-gradient-to-br from-spaceBlack to-galaxyBlue rounded-full border-2 border-stellarPurple/50">
                {user.avatar}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h3 className="text-2xl font-semibold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  {user.name}
                </h3>
                <p className="text-stellarGray mt-1">Knowledge Explorer</p>
              </div>

              {/* XP Progress Bar */}
              <div className="w-48 relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${user.xp}%` }}
                  transition={{ duration: 1.5, delay: index * 0.2 }}
                  className="h-3 bg-gradient-to-r from-cyan-400 to-teal-500 rounded-full relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 animate-shine" />
                </motion.div>
                <span className="text-xl font-bold text-stellarWhite mt-2 block">
                  {user.xp} XP
                </span>
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 pointer-events-none" />
            </div>

            {/* Particle Effect */}
            {index === 0 && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -40],
                      opacity: [0.8, 0],
                      scale: [1, 1.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3
                    }}
                    className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Floating Stars */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.8, 0.2]
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity
          }}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
        />
      ))}
    </div>
  );
}