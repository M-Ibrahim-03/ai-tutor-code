import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
  withCredentials: true
});

// Export the api instance
export default api;

export const courseAPI = {
  getAllCourses: () => api.get('/courses'),
  getCourseById: (id) => api.get(`/courses/${id}`),
  enrollCourse: (courseId) => api.post(`/courses/${courseId}/enroll`)
};

export const quizAPI = {
  getQuizzes: () => api.get('/quizzes'),
  submitQuiz: (quizId, answers) => api.post(`/quizzes/${quizId}/submit`, { answers })
};
