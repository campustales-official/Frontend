import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from '@react-oauth/google'
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient.js';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme='colored'
        toastClassName="!mt-14 !mb-2 !rounded-xl !p-2 !min-h-0 !w-auto !text-xs sm:!text-sm sm:!p-4 shadow-xl font-medium"
        bodyClassName="!p-0 !m-0"
      />
    </GoogleOAuthProvider>
  </StrictMode >,
)
