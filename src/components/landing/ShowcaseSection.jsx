import { motion } from "motion/react";
import { ExternalLink, Tag } from "lucide-react";
import { Link } from "react-router-dom";

const items = [
  { title: "Coding Club", category: "Technology", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400" },
  { title: "Robotics Workshop", category: "Engineering", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400" },
  { title: "Cultural Fest 2024", category: "Art & Culture", image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=400" },
  { title: "Hackathon 4.0", category: "Competition", image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=400" },
  { title: "Design Mini-Course", category: "Design", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400" },
  { title: "FinTech Summit", category: "Business", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400" },
];

export default function ShowcaseSection() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
          Vibrant <span className="text-indigo-600">Communities</span> & Events
        </h2>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Explore the wide range of clubs and events already flourishing on CampusTales.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-100"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-4 h-4 text-indigo-500" />
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{item.category}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <div className="flex justify-between items-center mt-6">
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
                  <Link to="/signup" className="bg-indigo-50 text-indigo-600 p-2 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <ExternalLink className="w-5 h-5" />
                  </Link>
                </div>
              </div>
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-colors pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
