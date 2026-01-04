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
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <span className="text-xl font-semibold tracking-tight">CollegeConnect</span>
                </div>
                <p className="text-base leading-relaxed text-white/90 border-l-4 border-blue-500 pl-4">
                  "CollegeConnect has completely transformed how our student body collaborates on inter-disciplinary projects. It's the digital campus we always needed."
                </p>
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
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <span className="text-xl font-semibold tracking-tight">CollegeConnect</span>
                </div>
                <p className="text-base leading-relaxed text-white/90 border-l-4 border-blue-500 pl-4">
                  "Joining CollegeConnect opened doors to research opportunities I didn't know existed. It's the ultimate network for ambitious students."
                </p>
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
