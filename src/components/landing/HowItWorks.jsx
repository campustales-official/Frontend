import { motion } from "motion/react";
import { UserPlus, PlusSquare, Search, BarChart3, Award } from "lucide-react";

const steps = [
  { icon: <UserPlus className="w-6 h-6" />, title: "Colleges Onboard", description: "Institutions join and set up their digital ecosystem." },
  { icon: <PlusSquare className="w-6 h-6" />, title: "Clubs Create Events", description: "Official clubs manage their space and host activities." },
  { icon: <Search className="w-6 h-6" />, title: "Discover & Register", description: "Students find opportunities and sign up instantly." },
  { icon: <BarChart3 className="w-6 h-6" />, title: "Participation Tracked", description: "Every interaction is logged for official reporting." },
  { icon: <Award className="w-6 h-6" />, title: "Certificates Issued", description: "Automated official recognition for student achievements." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
          How <span className="text-indigo-600">CampusTales</span> Works
        </h2>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          A seamless transition from traditional chaos to a structured digital ecosystem.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Connecting Lines (Desktop) */}
          <div className="hidden md:block absolute top-[50px] left-[10%] right-[10%] h-[2px] bg-slate-100 -z-10 overflow-hidden">
            <motion.div
              initial={{ x: "-100%" }}
              whileInView={{ x: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "linear", repeat: Infinity }}
              className="w-full h-full bg-gradient-to-r from-transparent via-indigo-400 to-transparent"
            />
          </div>

          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group text-center"
            >
              <div className="w-24 h-24 rounded-full bg-white shadow-xl shadow-indigo-100 border border-slate-100 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 relative">
                <div className="absolute inset-0 rounded-full bg-indigo-50 group-hover:bg-indigo-500 -z-10 blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
                {step.icon}
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center border-4 border-white">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-[200px] mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
