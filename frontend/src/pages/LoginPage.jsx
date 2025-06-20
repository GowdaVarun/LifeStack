import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Toast({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="fixed top-8 right-8 z-50 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-4 animate-fade-in">
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 text-white font-bold">
        ×
      </button>
    </div>
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState("");
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:5000";

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      setToast("Welcome back!");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      setToast(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 transition-all">
      <Toast message={toast} onClose={() => setToast("")} />
      <div className="bg-white/90 p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-xs md:max-w-md flex flex-col items-center border border-blue-100">
        <button
          className="self-start flex items-center px-3 py-2 md:px-4 md:py-2 rounded-lg border border-blue-200 bg-white text-blue-700 font-semibold hover:bg-blue-50 transition mb-3 md:mb-4 text-sm md:text-base"
          onClick={() => navigate("/")}
        >
          ← Back
        </button>
        <h2 className="text-2xl md:text-3xl font-extrabold mb-4 md:mb-6 text-blue-700 drop-shadow text-center">
          Life-Stack Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-3 md:space-y-4 w-full">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-3 py-2 md:px-4 md:py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white/80 shadow text-sm md:text-base"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 md:px-4 md:py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white/80 shadow text-sm md:text-base"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 md:py-3 rounded-lg shadow hover:from-blue-600 hover:to-purple-600 transition font-bold text-sm md:text-base"
          >
            Login
          </button>
        </form>
        <p className="mt-4 md:mt-6 text-xs md:text-sm text-center">
          Don't have an account?{" "}
          <button
            type="button"
            className="text-blue-600 hover:underline bg-transparent border-none p-0 m-0 font-semibold"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
