import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";
import { FaRocket } from "react-icons/fa";

export default function Footer() {
    return (
      <motion.footer
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        className="relative bg-gradient-to-t from-space-900 to-gray-900/50 border-t border-space-500/20"
      >
        <div className="absolute inset-0 backdrop-blur-xl z-0" />
        
        <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
          {/* Cosmic Grid */}
          <div className="absolute inset-0 opacity-10">
            <Canvas>
              <gridHelper args={[100, 100, "#4f46e5", "#4f46e5"]} />
            </Canvas>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-space-200">
            {/* Footer Sections */}
            {['Explore', 'Systems', 'Galaxy', 'Quasar'].map((section, index) => (
              <motion.div
                key={section}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="space-y-4"
              >
                <h4 className="text-lg font-bold text-purple-400">{section}</h4>
                <ul className="space-y-2">
                  {Array(4).fill().map((_, i) => (
                    <li key={i} className="hover:text-blue-400 transition-colors">
                      <a href="#" className="text-sm">Cosmic Link {i+1}</a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
  
          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-12 pt-8 border-t border-space-500/20 text-center"
          >
            <p className="text-space-400 text-sm">
              &copy; {new Date().getFullYear()} EduVerse - Transcending Digital Education
            </p>
            <div className="flex justify-center gap-4 mt-4">
              {[...Array(4)].map((_, i) => (
                <motion.a
                  key={i}
                  href="#"
                  className="text-space-300 hover:text-purple-400 transition-colors"
                  whileHover={{ y: -2 }}
                >
                  <FaRocket className="text-xl" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.footer>
    );
  }
  