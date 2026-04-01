import { motion } from "motion/react";
import { CheckCircle, PieChart, ShieldCheck, TrendingUp, Award, Users, Calendar } from "lucide-react";

export default function TrackingSection() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">
              Co-Curricular <br />
              <span className="text-indigo-600">Tracking & Records</span>
            </h2>
            <div className="space-y-8">
              {[
                { icon: <TrendingUp className="w-6 h-6 text-indigo-500" />, title: "Track Participation", text: "Log every event attended and every role held by students automatically." },
                { icon: <ShieldCheck className="w-6 h-6 text-indigo-500" />, title: "Build Activity Records", text: "Official transcript of student co-curricular achievements for placement data." },
                { icon: <PieChart className="w-6 h-6 text-indigo-500" />, title: "Institutional Visibility", text: "Gain deep insights into campus activity through structured reporting." },
              ].map((benefit) => (
                <div key={benefit.title} className="flex items-start gap-4 p-6 rounded-2xl bg-indigo-50/50 border border-slate-100 shadow-sm shadow-indigo-100/20">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{benefit.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{benefit.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-500 mt-8 mb-8"
            >
              Bring structure to your college activities. Join the <span className="text-indigo-600 font-bold">1</span> forward-thinking institution already transforming their campus.
            </motion.p>
            <motion.a
               href="mailto:support@campustales.com"
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="px-8 py-4 bg-indigo-50 text-indigo-700 font-bold rounded-2xl hover:bg-indigo-600 hover:text-white transition-all inline-block"
            >
              Mail Us to Register Your College
            </motion.a>
          </motion.div>

          {/* Right: Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="bg-slate-900 rounded-[3rem] p-8 shadow-2xl relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="h-2 w-24 bg-slate-700 rounded-full" />
                <div className="flex gap-2">
                  <div className="h-1.5 w-6 bg-slate-700 rounded-full" />
                  <div className="h-1.5 w-6 bg-slate-700 rounded-full" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-6 bg-indigo-600 rounded-3xl text-white">
                  <Users className="w-6 h-6 mb-4 opacity-50" />
                  <p className="text-4xl font-bold mb-1">1000+</p>
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
              <div className="p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl text-indigo-300">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-xs font-bold uppercase tracking-wider">Growth Data</p>
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="flex gap-2 items-end h-24">
                  {[40, 70, 45, 90, 65, 80, 55, 95].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="flex-1 bg-indigo-500/30 rounded-t-lg"
                    />
                  ))}
                </div>
              </div>
            </div>
            {/* Background elements */}
            <div className="absolute -inset-10 bg-indigo-600 blur-[100px] opacity-10 rounded-full -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
