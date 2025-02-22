import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layouts/MainLayout";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Features from "./pages/Features";
import Quiz from "./pages/Quiz";
import Leaderboard from "./pages/Leaderboard";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound";
import Chatbot from "./pages/Chatbot";
import Dashboard from "./pages/Dashboard";
import LessonAnalysis from "./pages/LessonAnalysis";

function App() {
  return (
    <MainLayout>
      <Navbar />
      <div className="min-h-screen pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/chat" element={<Chatbot />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/lesson-analysis" element={<LessonAnalysis />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </MainLayout>
  );
}

export default App;