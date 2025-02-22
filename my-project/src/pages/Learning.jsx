import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls, Text } from "@react-three/drei";
import { FaDownload, FaBookOpen, FaRobot, FaSearch } from "react-icons/fa";

const subjects = [
  { 
    grade: "Class 10",
    title: "Science - NCERT",
    chapters: 16,
    size: "45MB",
    progress: 100,
    downloaded: true
  },
  {
    grade: "Class 9",
    title: "Mathematics",
    chapters: 15,
    size: "38MB",
    progress: 75,
    downloaded: false
  },
  // Add more subjects...
];

function FloatingBook() {
  return (
    <Canvas className="absolute inset-0 z-0">
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <mesh rotation={[0, 0, 0]}>
        <boxGeometry args={[3, 4, 0.5]} />
        <meshStandardMaterial 
          color="#7c3aed"
          emissive="#4f46e5"
          emissiveIntensity={0.5}
        />
        <Text
          position={[0, 0, 0.3]}
          fontSize={0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          NCERT
        </Text>
      </mesh>
      <OrbitControls enableZoom={false} autoRotate />
    </Canvas>
  );
}

export default function LearnPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("All");
  const [downloading, setDownloading] = useState(null);

  const handleDownload = (index) => {
    setDownloading(index);
    setTimeout(() => {
      setDownloading(null);
      const updated = [...subjects];
      updated[index].downloaded = true;
      // Update state with downloaded content
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-900 to-black text-white relative overflow-hidden">
      {/* Cosmic Background */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <Stars radius={100} depth={50} count={2000} factor={4} fade />
          <FloatingBook />
        </Canvas>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Cosmic Library
          </h1>
          <p className="mt-4 text-xl text-space-200">
            Offline Knowledge Repository
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          className="mb-12 flex flex-col md:flex-row gap-4 items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="relative flex-1 max-w-2xl w-full">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-space-300" />
            <input
              type="text"
              placeholder="Search across galaxies of knowledge..."
              className="w-full pl-12 pr-6 py-4 bg-space-800/50 backdrop-blur-lg rounded-xl border border-space-500/30 focus:border-purple-400/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Grade Filter */}
        <div className="flex flex-wrap gap-4 mb-8">
          {['All', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map((grade) => (
            <motion.button
              key={grade}
              className={`px-6 py-2 rounded-full ${
                selectedGrade === grade
                  ? 'bg-purple-500/30 border border-purple-400/50'
                  : 'bg-space-800/50 border border-space-500/30'
              }`}
              onClick={() => setSelectedGrade(grade)}
              whileHover={{ scale: 1.05 }}
            >
              {grade}
            </motion.button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, index) => (
            <motion.div
              key={index}
              className="p-6 rounded-2xl backdrop-blur-xl bg-space-800/50 border border-space-500/20 relative overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              {/* Download Status */}
              {subject.downloaded && (
                <div className="absolute top-4 right-4 text-purple-400 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Offline Ready
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <FaBookOpen className="text-3xl text-purple-400" />
                  <h3 className="text-xl font-bold">{subject.grade}</h3>
                </div>
                
                <h4 className="text-lg font-semibold">{subject.title}</h4>
                
                <div className="flex justify-between text-space-300 text-sm">
                  <span>{subject.chapters} Chapters</span>
                  <span>{subject.size}</span>
                </div>

                {/* Progress Bar */}
                <div className="relative h-2 bg-space-700 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute h-full bg-gradient-to-r from-purple-500 to-blue-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${subject.progress}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>

                {/* Download Button */}
                <motion.button
                  className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 ${
                    subject.downloaded 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-purple-500/30 hover:bg-purple-500/40'
                  }`}
                  onClick={() => handleDownload(index)}
                  disabled={subject.downloaded || downloading === index}
                  whileHover={!subject.downloaded ? { scale: 1.05 } : {}}
                >
                  {downloading === index ? (
                    <span className="animate-spin">⏳</span>
                  ) : subject.downloaded ? (
                    'Available Offline'
                  ) : (
                    <>
                      <FaDownload />
                      Download Module
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Assistant */}
        <div className="fixed bottom-8 right-8 flex items-end gap-4">
          <motion.div
            className="bg-space-800/50 backdrop-blur-lg p-4 rounded-xl border border-space-500/30"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm text-purple-300 max-w-xs">
              Need help finding materials? Try searching by chapter number or topic!
            </p>
          </motion.div>
          <motion.div
            className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-500 rounded-full flex items-center justify-center text-2xl cursor-pointer"
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <FaRobot className="animate-pulse" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}