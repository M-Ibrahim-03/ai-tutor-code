import { motion } from "framer-motion";

const courses = [
  { title: "AI & Machine Learning", desc: "Learn how AI works", color: "blue" },
  { title: "Cybersecurity Basics", desc: "Protect yourself online", color: "green" },
  { title: "Web Development", desc: "Build amazing websites", color: "purple" },
];

export default function Course() {
  return (
    <div className="h-screen bg-black text-white p-12">
      <h2 className="text-5xl font-bold text-center bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
        Explore Cosmic Courses 🚀
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
        {courses.map((course, index) => (
          <motion.div
            key={index}
            className={`p-6 rounded-2xl bg-${course.color}-900 text-white`}
            whileHover={{ scale: 1.1 }}
          >
            <h3 className="text-xl font-bold">{course.title}</h3>
            <p>{course.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
