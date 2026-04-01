import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Network, Database, FileSpreadsheet, ShieldAlert, GraduationCap, Building2, ExternalLink } from "lucide-react";

const benefits = [
  { icon: <Network className="w-6 h-6" />, title: "Centralized Communication", description: "Official channel for all club and event announcements." },
  { icon: <Database className="w-6 h-6" />, title: "Organized Data", description: "All club member lists and event data in one structured DB." },
  { icon: <FileSpreadsheet className="w-6 h-6" />, title: "Structured Reporting", description: "Generate official reports for institutional audits and NAAC." },
  { icon: <ShieldAlert className="w-6 h-6" />, title: "Secure & Official", description: "Authenticated access ensures only college students participate." },
  { icon: <GraduationCap className="w-6 h-6" />, title: "Student Success", description: "Help students build official co-curricular portfolios for resumes." },
  { icon: <Building2 className="w-6 h-6" />, title: "Admin Control", description: "Manage all college entities from a single unified panel." },
];

export default function CollegesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Left: Heading */}
          <div className="lg:w-1/3 text-left">
            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight"
            >
              For <span className="text-indigo-600">Institutions</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-500 mb-8"
            >
              Bring structure to your college activities. Join the <span className="text-indigo-600 font-bold">1</span> forward-thinking institution already transforming their campus.
            </motion.p>
            <motion.a
               href="mailto:support@campustales.com"
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all inline-block shadow-lg shadow-indigo-200"
            >
              Mail Us to Register
            </motion.a>
          </div>

          {/* Right: Grid */}
          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-[2rem] border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-xl hover:shadow-indigo-100/50 transition-all group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                    {benefit.icon}
                  </div>
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * index}`} alt="User" />
                      </div>
                    ))}
                    <div className="w-7 h-7 rounded-full border-2 border-white bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                      +42
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{benefit.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">{benefit.description}</p>
                <Link to="/signup" className="inline-flex items-center text-indigo-600 font-semibold text-sm hover:gap-2 transition-all">
                  Learn more <ExternalLink className="w-4 h-4 ml-1" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
