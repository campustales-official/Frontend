import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto relative overflow-hidden rounded-[3rem] bg-indigo-600 shadow-2xl shadow-indigo-300">
        {/* Animated Background Decor */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.4, 0.3],
              rotate: [0, 45, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/2 -right-1/4 w-full h-full bg-gradient-to-br from-indigo-400 to-transparent blur-3xl opacity-30"
          />
          <motion.div
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.3, 0.2],
              rotate: [45, 0, 45]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-1/2 -left-1/4 w-full h-full bg-gradient-to-tr from-blue-400 to-transparent blur-3xl opacity-20"
          />
        </div>

        <div className="relative z-10 px-8 py-20 text-center max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight"
          >
            Bring Structure to Your <br /> College Activities
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-indigo-100 mb-10"
          >
            Join the 600+ students and 12 clubs already in the fastest-growing digital campus ecosystem.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/signup"
              className="px-10 py-5 bg-white text-indigo-600 font-bold rounded-2xl shadow-xl hover:bg-slate-50 hover:scale-105 transition-all text-lg flex items-center gap-2 group"
            >
              Get Started
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/signup"
              className="px-10 py-5 bg-indigo-500 text-white font-bold rounded-2xl border border-indigo-400 hover:bg-indigo-700 transition-all text-lg"
            >
              Discover Events
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
