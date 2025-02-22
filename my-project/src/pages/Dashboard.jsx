import { motion } from "framer-motion";
import { FaUserGraduate, FaBookOpen, FaTrophy } from "react-icons/fa";

export default function Dashboard() {
  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 to-black text-white p-12">
      <h2 className="text-5xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Welcome to Your Cosmic Dashboard 🚀
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
        <motion.div
          className="p-8 rounded-2xl backdrop-blur-xl bg-gray-800/50 border border-gray-500/20 hover:border-purple-400/30 transition-all text-center"
          whileHover={{ scale: 1.1 }}
        >
          <FaUserGraduate className="text-6xl text-blue-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold">Profile</h3>
          <p>View and manage your student profile</p>
        </motion.div>

        <motion.div
          className="p-8 rounded-2xl backdrop-blur-xl bg-gray-800/50 border border-gray-500/20 hover:border-purple-400/30 transition-all text-center"
          whileHover={{ scale: 1.1 }}
        >
          <FaBookOpen className="text-6xl text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold">Courses</h3>
          <p>Browse and start your AI-powered courses</p>
        </motion.div>

        <motion.div
          className="p-8 rounded-2xl backdrop-blur-xl bg-gray-800/50 border border-gray-500/20 hover:border-purple-400/30 transition-all text-center"
          whileHover={{ scale: 1.1 }}
        >
          <FaTrophy className="text-6xl text-yellow-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold">Leaderboard</h3>
          <p>Compete with others and climb the ranks</p>
        </motion.div>
      </div>
    </div>
  );
}
