import { Link } from "react-router-dom";
import { Twitter, Instagram, Linkedin, Mail } from "lucide-react";

export default function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <img src="/logo.png" alt="CampusTales" className="h-8 w-auto" />
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                Campus<span className="text-indigo-600">Tales</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Empowering colleges with a centralized digital ecosystem for clubs,
              events, and co-curricular excellence.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white rounded-lg shadow-sm text-slate-400 hover:text-indigo-600 transition-colors border border-slate-100">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-white rounded-lg shadow-sm text-slate-400 hover:text-indigo-600 transition-colors border border-slate-100">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-white rounded-lg shadow-sm text-slate-400 hover:text-indigo-600 transition-colors border border-slate-100">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-slate-900 font-bold mb-6">Platform</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#features" className="hover:text-indigo-600 transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How it Works</a></li>
              <li><a href="#discover" className="hover:text-indigo-600 transition-colors">Discover Events</a></li>
              <li><Link to="/signup" className="hover:text-indigo-600 transition-colors">For Colleges</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-slate-900 font-bold mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link to="/privacy-policy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-conditions" className="hover:text-indigo-600 transition-colors">Terms of Service</Link></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Cookie Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-slate-900 font-bold mb-6">Contact</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-500" />
                <a href="mailto:support@campustales.com" className="hover:text-indigo-600 transition-colors">support@campustales.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-xs text-center">
            &copy; {currentYear} CampusTales. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-slate-400">
            <a href="#" className="hover:text-indigo-600 transition-colors">Security</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">System Status</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
