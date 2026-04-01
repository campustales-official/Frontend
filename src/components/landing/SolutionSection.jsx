import { motion } from "motion/react";
import { CheckCircle2, Layout, Megaphone, ClipboardCheck, Award, TrendingUp } from "lucide-react";

const features = [
  { icon: <Layout className="w-5 h-5" />, text: "Club Management", color: "indigo" },
  { icon: <Megaphone className="w-5 h-5" />, text: "Event Hosting", color: "indigo" },
  { icon: <CheckCircle2 className="w-5 h-5" />, text: "Announcements", color: "indigo" },
  { icon: <ClipboardCheck className="w-5 h-5" />, text: "Event Registrations", color: "indigo" },
  { icon: <Award className="w-5 h-5" />, text: "Automated Certificates", color: "indigo" },
  { icon: <TrendingUp className="w-5 h-5" />, text: "Participation Tracking", color: "indigo" },
];

export default function SolutionSection() {
  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">
              CampusTales Brings <br />
              <span className="text-indigo-600">Everything Together</span>
            </h2>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              We provide a centralized digital platform that streamlines communication, 
              organizes club activities, and tracks official participation data—all in one place.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    {feature.icon}
                  </div>
                  <span className="font-semibold text-slate-700">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Scrolling Mock UI */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden relative z-10"
            >
              <div className="h-10 bg-slate-50 border-b border-slate-100 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-200" />
                <div className="w-3 h-3 rounded-full bg-slate-200" />
                <div className="w-12 h-2 bg-slate-200 rounded-full ml-auto" />
              </div>
              <div className="p-8 h-[500px] overflow-hidden relative">
                <motion.div
                  animate={{ y: [0, -300, 0] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="space-y-6"
                >
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-100" />
                      <div className="space-y-2 flex-1">
                        <div className="w-1/2 h-3 bg-slate-200 rounded-full" />
                        <div className="w-1/3 h-2 bg-slate-100 rounded-full" />
                      </div>
                    </div>
                  ))}
                </motion.div>
                {/* Overlay Gradient */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />
              </div>
            </motion.div>
            {/* Background elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-100/50 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-blue-100/50 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
