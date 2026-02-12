import { motion } from "motion/react";

const loginImage = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop";
const signupImage = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop";

export default function AuthLayout({ isSignup, children }) {
  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900">
      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left Side - Form when signup, Image when login */}
        <div className="w-1/2 relative">
          {isSignup ? (
            // Form on left for signup
            <div className="min-h-screen flex items-center justify-center px-12 py-10 bg-white overflow-y-auto">
              <div className="w-full max-w-md">{children}</div>
            </div>
          ) : (
            // Image on left for login
            <motion.div
              key="image-left"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="fixed top-0 left-0 w-1/2 h-full"
            >
              <img
                src={loginImage}
                alt="Campus"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-10 left-10 right-10 z-10 text-white max-w-md">
                <div className="flex items-center gap-2 mb-4">
                  <img src="/logo.png" alt="CampusTales" className="w-10 h-10 object-contain rounded-xl" />
                  <span className="text-xl font-semibold tracking-tight">CampusTales</span>
                </div>
                <div className="space-y-4 text-white/90 border-l-4 border-blue-500 pl-4">
                  <p className="text-base font-semibold italic opacity-80">"College life today runs on chaos, CampusTales exists to fix this." ⚙️</p>
                  <ul className="space-y-2 text-sm opacity-90 list-disc ml-4">
                    <li>Important updates are buried in WhatsApp groups.</li>
                    <li>Events are scattered across posters and random links.</li>
                    <li>Clubs struggle with registrations and data.</li>
                  </ul>
                  <p className="text-base font-bold text-blue-400">Building a single platform for how colleges actually work. ✅</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Side - Image when signup, Form when login */}
        <div className="w-1/2 relative">
          {isSignup ? (
            // Image on right for signup
            <motion.div
              key="image-right"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="fixed top-0 right-0 w-1/2 h-full"
            >
              <img
                src={signupImage}
                alt="Campus"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-10 left-10 right-10 z-10 text-white max-w-md">
                <div className="flex items-center gap-2 mb-4">
                  <img src="/logo.png" alt="CampusTales" className="w-10 h-10 object-contain rounded-xl" />
                  <span className="text-xl font-semibold tracking-tight">CampusTales</span>
                </div>
                <div className="space-y-4 text-white/90 border-l-4 border-blue-500 pl-4">
                  <p className="text-base font-semibold italic opacity-80">Why join the community? 🎓</p>
                  <ul className="space-y-2 text-sm opacity-90 list-disc ml-4">
                    <li>College-verified digital platform.</li>
                    <li>Structured and trusted communication.</li>
                    <li>Designed for academic environments.</li>
                    <li>No spam. No confusion. No fragmentation.</li>
                  </ul>
                  <p className="text-base font-bold text-blue-400">One platform for your entire campus. ✅</p>
                </div>
              </div>
            </motion.div>
          ) : (
            // Form on right for login
            <div className="min-h-screen flex items-center justify-center px-12 py-10 bg-white overflow-y-auto">
              <div className="w-full max-w-md">{children}</div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile/Tablet Layout - Form only */}
      <div className="lg:hidden min-h-screen flex items-center justify-center px-6 py-10 bg-white">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
