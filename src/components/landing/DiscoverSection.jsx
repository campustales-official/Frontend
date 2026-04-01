import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Search, Filter, Calendar, MapPin, Users } from "lucide-react";

export default function DiscoverSection() {
  const categories = ["All", "Technology", "Art", "Sports", "Academic", "Music"];

  return (
    <section id="discover" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
            Discover <span className="text-indigo-600">Opportunities</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10">
            Find the next big event, workshop, or club to join. The entire campus activities feed at your fingertips.
          </p>

          {/* Search bar & filters */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto p-4 bg-white rounded-[2rem] shadow-xl shadow-indigo-100/50 border border-slate-100 flex flex-col md:flex-row gap-4 items-center mb-12"
          >
            <div className="flex-1 flex items-center gap-3 px-4 w-full">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search for events, clubs, or categories..."
                className="w-full py-3 bg-transparent border-none focus:ring-0 text-slate-700 placeholder:text-slate-400"
              />
            </div>
            <div className="h-8 w-[1px] bg-slate-200 hidden md:block" />
            <div className="flex items-center gap-3 px-4 w-full md:w-auto">
              <Filter className="w-5 h-5 text-slate-400" />
              <select className="py-3 bg-transparent border-none focus:ring-0 text-slate-700 pr-8">
                <option>Filter by Category</option>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <Link to="/signup" className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 text-center">
              Discover
            </Link>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((c, i) => (
              <Link
                key={c}
                to="/signup"
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                  i === 0 
                  ? "bg-indigo-600 text-white" 
                  : "bg-white text-slate-600 hover:bg-indigo-50 border border-slate-200"
                }`}
              >
                {c}
              </Link>
            ))}
          </div>
        </div>

        {/* Mock Event Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 opacity-40">
          {[1, 2].map((i) => (
            <div key={i} className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 group">
              <div className="w-full md:w-48 aspect-video md:aspect-square bg-slate-100 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                 <img src={`https://images.unsplash.com/photo-${i === 1 ? '1540575467063-178a50c2df87' : '1504384308090-c894fdcc538d'}?auto=format&fit=crop&q=80&w=400`} alt="Event" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                   <div className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full uppercase tracking-widest">Upcoming</div>
                   <p className="text-lg font-bold text-slate-800">Campus Tech Summit {2024 + i}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> May {12 + i}, 2024</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Audi 1, Block C</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="flex -space-x-1.5">
                      {[1, 2, 3].map(j => <div key={j} className="w-6 h-6 rounded-full border border-white bg-slate-200 overflow-hidden"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${j*i}`} /></div>)}
                   </div>
                   <p className="text-[10px] text-slate-400 font-medium">120+ registered</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
