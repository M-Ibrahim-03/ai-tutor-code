import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUpload, 
  FaFile, 
  FaFilePdf, 
  FaFileWord, 
  FaFileAlt, 
  FaBrain, 
  FaMagic, 
  FaEraser,
  FaCloudUploadAlt,
  FaPlay,
  FaPause,
  FaVolumeUp
} from 'react-icons/fa';
import GlassCard from '../../components/GlassCard';
import GlowButton from '../../components/GlowButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import RobotAvatar from '../../components/RobotAvatar';

export default function LessonAnalysis() {
  const [lessonText, setLessonText] = useState('');
  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const [audioQueue, setAudioQueue] = useState([]);
  const [currentAudio, setCurrentAudio] = useState(null);
  const fileInputRef = useRef(null);

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'application/pdf':
        return <FaFilePdf className="text-red-400" />;
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return <FaFileWord className="text-blue-400" />;
      case 'text/plain':
        return <FaFileAlt className="text-gray-400" />;
      default:
        return <FaFile className="text-purple-400" />;
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('File size should be less than 10MB');
        return;
      }
      const allowedTypes = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setUploadError('Only PDF, TXT, DOC, and DOCX files are allowed');
        return;
      }
      setFile(file);
      setUploadError(null);
      setLessonText('');
      setError(null);
    }
  };

  const analyzeContent = async () => {
    try {
      setLoading(true);
      setError(null);
      setAudioQueue([]);
      setCurrentAudio(null);

      let response;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        response = await fetch('http://localhost:5000/api/v1/ai/analyze-file', {
          method: 'POST',
          body: formData
        });
      } else {
        response = await fetch('http://localhost:5000/api/v1/ai/analyze-lesson', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: lessonText })
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const data = await response.json();
      setAnalysis(data.analysis || data);

      // Prepare speech queue
      if (data.analysis?.speechText) {
        const utterance = new SpeechSynthesisUtterance(data.analysis.speechText);
        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => setSpeaking(false);
        setAudioQueue([utterance]);
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSpeech = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    } else if (audioQueue.length > 0) {
      const utterance = audioQueue[0];
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
        >
          Lesson Analysis
        </motion.h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <GlassCard className="p-6">
            {/* File Upload */}
            <div className="mb-8">
              <div 
                className="border-2 border-dashed border-gray-600 rounded-xl p-8 hover:border-purple-500 transition-colors duration-200 cursor-pointer relative group"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const droppedFile = e.dataTransfer.files[0];
                  if (droppedFile) {
                    const changeEvent = { target: { files: [droppedFile] } };
                    handleFileChange(changeEvent);
                  }
                }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-4">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <FaCloudUploadAlt className="text-6xl text-purple-500" />
                  </motion.div>
                  <div className="text-center">
                    <GlowButton
                      icon={<FaUpload />}
                      className="mb-3"
                    >
                      Choose File
                    </GlowButton>
                    <p className="text-gray-300">
                      Drag & drop or click to upload PDF, DOC, DOCX, or TXT (Max 10MB)
                    </p>
                  </div>
                </div>
                {file && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex items-center justify-center gap-2 bg-gray-800/50 rounded-lg p-3"
                  >
                    {getFileIcon(file.type)}
                    <span className="text-gray-300">{file.name}</span>
                  </motion.div>
                )}
              </div>
              {uploadError && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-sm mt-2"
                >
                  {uploadError}
                </motion.p>
              )}
            </div>

            {/* Text Input */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Or paste your text:</h3>
              <textarea
                className="w-full h-48 p-4 rounded-xl bg-gray-800/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
                placeholder="Paste your lesson content here..."
                value={lessonText}
                onChange={(e) => {
                  setLessonText(e.target.value);
                  setFile(null);
                  setError(null);
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <GlowButton
                onClick={analyzeContent}
                disabled={loading || (!lessonText && !file)}
                icon={loading ? <LoadingSpinner size="sm" /> : <FaMagic />}
                className="flex-1"
              >
                {loading ? 'Analyzing...' : 'Analyze'}
              </GlowButton>

              <GlowButton
                variant="secondary"
                onClick={() => {
                  setLessonText('');
                  setFile(null);
                  setError(null);
                  setAnalysis(null);
                  setAudioQueue([]);
                  window.speechSynthesis.cancel();
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                icon={<FaEraser />}
              >
                Clear
              </GlowButton>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-red-400 bg-red-400/10 rounded-lg p-4 text-sm"
              >
                {error}
              </motion.div>
            )}
          </GlassCard>

          {/* Results Section */}
          <div className="relative">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Analysis Results</h2>
                <div className="flex items-center gap-4">
                  {audioQueue.length > 0 && (
                    <GlowButton
                      variant="secondary"
                      onClick={toggleSpeech}
                      icon={speaking ? <FaPause /> : <FaPlay />}
                    >
                      {speaking ? 'Pause' : 'Listen'}
                    </GlowButton>
                  )}
                  <RobotAvatar speaking={speaking} />
                </div>
              </div>

              {analysis ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-purple-400">Summary</h3>
                    <p className="text-gray-300">{analysis.summary}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-blue-400">Key Points</h3>
                    <ul className="space-y-2">
                      {analysis.keyPoints?.map((point, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-300">
                          <div className="w-2 h-2 mt-2 rounded-full bg-blue-400" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-emerald-400">Important Concepts</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.concepts?.map((concept, index) => (
                        <span key={index} className="px-3 py-1 rounded-full bg-emerald-400/10 text-emerald-400 text-sm">
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-orange-400">Review Questions</h3>
                    <ul className="space-y-2">
                      {analysis.questions?.map((question, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-300">
                          <div className="w-2 h-2 mt-2 rounded-full bg-orange-400" />
                          {question}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400 py-12">
                  <FaCloudUploadAlt className="text-6xl mx-auto mb-4" />
                  <p>Upload a file or paste text to see the analysis</p>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
} 