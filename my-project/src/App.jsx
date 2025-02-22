import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Features from "./pages/Features";
import Quiz from "./pages/Quiz";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound";
import Learning from "./pages/Learning";
import Chatbot from "./pages/Chatbot";
import Courses from "./pages/Courses";
import Dashboard from "./pages/Dashboard";
import LessonAnalysis from "./pages/LessonAnalysis";

function App() {
  return (
    <>
      <Navbar />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/chat" element={<Chatbot />} />
          <Route path="/course" element={<Courses />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/lesson-analysis" element={<LessonAnalysis />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;