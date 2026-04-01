import { motion } from "motion/react";
import { MessageSquareOff, BellOff, LineChart } from "lucide-react";

const problems = [
  {
    icon: <MessageSquareOff className="w-8 h-8 text-amber-500" />,
    title: "WhatsApp Clutter",
    description: "Important information gets buried in hundreds of informal group chats and spam.",
  },
  {
    icon: <BellOff className="w-8 h-8 text-rose-500" />,
    title: "Missed Announcements",
    description: "Fragmented communication leads to students missing crucial event deadlines and updates.",
  },
  {
    icon: <LineChart className="w-8 h-8 text-indigo-500" />,
    title: "No Participation Tracking",
    description: "Colleges struggle to maintain official records of student co-curricular participation.",
  },
];

export default function ProblemSection() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold text-slate-900 mb-6"
        >
          College Activities Are <span className="text-rose-500">Scattered</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-slate-500 max-w-2xl mx-auto"
        >
          Traditional methods of managing college life are outdated, disorganized, and difficult to track.
        </motion.p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {problems.map((problem, index) => (
          <motion.div
            key={problem.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="p-10 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 hover:bg-white transition-all group"
          >
            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-8 border border-slate-100 group-hover:scale-110 transition-transform">
              {problem.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">{problem.title}</h3>
            <p className="text-slate-500 leading-relaxed">
              {problem.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
