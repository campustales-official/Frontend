import { motion } from "motion/react";
import { ChevronRight, Calendar, Users, Award, Bell } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingHero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden flex items-center">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-indigo-50/50 clip-path-hero" />
      <div className="absolute top-1/4 -left-20 -z-10 w-96 h-96 bg-blue-50/50 blur-3xl rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-left"
          >
            <motion.a
               href="mailto:support@campustales.com"
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="px-8 py-4 bg-indigo-50 text-indigo-700 font-bold rounded-2xl hover:bg-indigo-600 hover:text-white transition-all inline-block mb-6"
            >
              Mail Us to Register Your College
            </motion.a>
            
            <motion.h1
              variants={itemVariants}
              className="text-5xl lg:text-7xl font-bold text-slate-900 leading-[1.1] mb-6"
            >
              All Your College Activities. <br />
              <span className="text-indigo-600">One Platform.</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg text-slate-600 mb-10 max-w-xl leading-relaxed"
            >
              Manage clubs, events, and co-curricular participation in a structured digital ecosystem. Replace the chaos of scattered announcements with one unified home for your campus life.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/signup"
                className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group"
              >
                Get Started
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/signup"
                className="px-8 py-4 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-indigo-200 transition-all text-center"
              >
                Login / Sign Up
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="User" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-500">
                Joined by <span className="text-indigo-600 font-bold">600+</span> students from <span className="text-indigo-600 font-bold">1</span> college
              </p>
            </motion.div>
          </motion.div>

          {/* Animated Illustration */}
          <div className="relative h-[500px] lg:h-[650px] flex items-center justify-center">
            {/* Main Mockup Card */}
            <motion.div
              layoutId="main-mock"
              className="relative w-full max-w-[400px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10"
              initial={{ opacity: 0, scale: 0.8, rotateY: -10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="h-12 bg-slate-50 border-b border-slate-100 flex items-center px-6 justify-between">
                <div className="p-6 bg-indigo-600 rounded-3xl text-white">
                  <Users className="w-6 h-6 mb-4 opacity-50" />
                  <p className="text-4xl font-bold mb-1">600+</p>
                  <p className="text-xs text-indigo-200">Active Students</p>
                </div>
                <div className="p-6 bg-slate-800 rounded-3xl text-white">
                  <Calendar className="w-6 h-6 mb-4 opacity-50 text-indigo-400" />
                  <p className="text-4xl font-bold mb-1">12</p>
                  <p className="text-xs text-slate-400">Official Clubs</p>
                </div>
              </div>
              <div className="p-6 bg-slate-800 rounded-3xl text-white mb-4 flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold mb-1">1000+</p>
                  <p className="text-xs text-slate-400">Total Registrations</p>
                </div>
                <Award className="w-10 h-10 text-indigo-500 opacity-20" />
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="w-32 h-3 bg-slate-200 rounded-full mb-2" />
                    <div className="w-20 h-2 bg-slate-100 rounded-full" />
                  </div>
                </div>
                <div className="w-full h-40 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-sm font-medium">
                  Recent Activities Feed
                </div>
                <div className="space-y-2">
                  <div className="w-full h-12 bg-slate-50 rounded-xl border border-slate-100" />
                  <div className="w-full h-12 bg-slate-50 rounded-xl border border-slate-100" />
                </div>
              </div>
            </motion.div>

            {/* Floating Cards */}
            <motion.div
              variants={floatingVariants}
              animate="animate"
              style={{ top: "10%", right: "5%" }}
              className="absolute z-20 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100"
            >
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Certificate Issued</p>
                <p className="text-[10px] text-slate-500">Hackathon 2024</p>
              </div>
            </motion.div>

            <motion.div
              variants={floatingVariants}
              animate="animate"
              style={{ bottom: "15%", left: "0%", animationDelay: "1s" }}
              className="absolute z-20 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">New Members</p>
                <p className="text-[10px] text-slate-500">Coding Club +14</p>
              </div>
            </motion.div>

            <motion.div
              variants={floatingVariants}
              animate="animate"
              style={{ top: "50%", left: "-10%", animationDelay: "2s" }}
              className="absolute z-20 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Event Starting</p>
                <p className="text-[10px] text-slate-500">Design Workshop in 2h</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
