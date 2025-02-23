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
  FaPause
} from 'react-icons/fa';
import RobotAvatar from '../components/RobotAvatar';

export default function LessonAnalysis() {
  const [lessonText, setLessonText] = useState('');
  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const [audioQueue, setAudioQueue] = useState([]);
  const fileInputRef = useRef(null);

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'application/pdf':
        return <FaFilePdf className="text-red-400 text-2xl" />;
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return <FaFileWord className="text-blue-400 text-2xl" />;
      case 'text/plain':
        return <FaFileAlt className="text-gray-400 text-2xl" />;
      default:
        return <FaFile className="text-purple-400 text-2xl" />;
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setUploadError('File size should be less than 10MB');
        return;
      }
      setFile(file);
      setUploadError(null);
      setLessonText('');
      setError(null);
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

  const analyzeFile = async () => {
    try {
      setLoading(true);
      setError(null);
      setUploadError(null);
      setAudioQueue([]);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:5000/api/v1/ai/analyze-file', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze file');
      }

      const data = await response.json();
      setAnalysis(data.analysis);

      // Prepare speech queue
      if (data.analysis?.summary) {
        const utterance = new SpeechSynthesisUtterance(data.analysis.summary);
        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => setSpeaking(false);
        setAudioQueue([utterance]);
      }
    } catch (error) {
      console.error('Error analyzing file:', error);
      setUploadError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const analyzeLessonContent = async () => {
    try {
      setLoading(true);
      setError(null);
      setAudioQueue([]);

      const response = await fetch('http://localhost:5000/api/v1/ai/analyze-lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: lessonText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze lesson');
      }

      const data = await response.json();
      setAnalysis(data);

      // Prepare speech queue
      if (data.summary) {
        const utterance = new SpeechSynthesisUtterance(data.summary);
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

  const clearAnalysis = () => {
    setAnalysis(null);
    setLessonText('');
    setFile(null);
    setError(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Lesson Analysis</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <FaBrain className="text-2xl text-white" />
              </div>
              <h2 className="text-2xl font-semibold">Input Your Lesson</h2>
            </div>

            {/* File Upload Section */}
            <div className="mb-8">
              <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 hover:border-purple-500 transition-colors duration-200">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-4">
                  <FaCloudUploadAlt className="text-6xl text-purple-500" />
                  <div className="text-center">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-xl font-medium text-white mb-3 flex items-center gap-2 mx-auto"
                    >
                      <FaUpload />
                      Choose File
                    </button>
                    <p className="text-gray-300">
                      Drag & drop your file here or click to browse
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Supported formats: PDF, DOC, DOCX, TXT (Max 10MB)
                    </p>
                  </div>
                </div>
                {file && (
                  <div className="mt-4 flex items-center justify-center gap-2 bg-gray-800 rounded-lg p-3">
                    {getFileIcon(file.type)}
                    <span className="text-gray-300">{file.name}</span>
                  </div>
                )}
                {uploadError && (
                  <p className="text-red-400 text-sm mt-2 text-center">{uploadError}</p>
                )}
              </div>
            </div>

            {/* Text Input Section */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-white mb-4">Or paste your text:</h3>
              <textarea
                className="w-full h-48 p-4 rounded-xl bg-gray-800/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none backdrop-blur-sm"
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
              <button
                className={`
                  flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium
                  ${loading || (!lessonText.trim() && !file)
                    ? 'bg-gray-700 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400'}
                `}
                onClick={file ? analyzeFile : analyzeLessonContent}
                disabled={loading || (!lessonText.trim() && !file)}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FaMagic />
                    Analyze
                  </>
                )}
              </button>

              <button
                className={`
                  px-6 py-3 rounded-xl font-medium flex items-center gap-2
                  ${loading || (!lessonText && !file)
                    ? 'bg-gray-700 cursor-not-allowed opacity-50'
                    : 'bg-gray-700 hover:bg-gray-600'}
                `}
                onClick={clearAnalysis}
                disabled={loading || (!lessonText && !file)}
              >
                <FaEraser />
                Clear
              </button>
            </div>

            {error && (
              <div className="mt-4 text-red-400 bg-red-400/10 rounded-lg p-4 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Analysis Display Section */}
          <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Analysis Results</h2>
              <div className="flex items-center gap-4">
                {audioQueue.length > 0 && (
                  <button
                    onClick={toggleSpeech}
                    className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center gap-2"
                  >
                    {speaking ? <FaPause className="text-purple-400" /> : <FaPlay className="text-purple-400" />}
                    <span>{speaking ? 'Pause' : 'Listen'}</span>
                  </button>
                )}
                <RobotAvatar speaking={speaking} />
              </div>
            </div>

            {analysis ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-purple-400">Summary</h3>
                  <p className="text-gray-300">{analysis.summary}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-blue-400">Key Points</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {analysis.keyPoints?.map((point, index) => (
                      <li key={index} className="text-gray-300">{point}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-green-400">Important Concepts</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.concepts?.map((concept, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-green-400/10 text-green-400 text-sm"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-orange-400">Review Questions</h3>
                  <ul className="list-decimal list-inside space-y-2">
                    {analysis.questions?.map((question, index) => (
                      <li key={index} className="text-gray-300">{question}</li>
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
          </div>
        </div>
      </div>
    </div>
  );
}