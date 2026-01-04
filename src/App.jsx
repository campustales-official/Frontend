import { BrowserRouter, Route, Routes } from "react-router-dom"
import AuthPage from "./pages/Auth/AuthPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route path="/signup" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  )
}