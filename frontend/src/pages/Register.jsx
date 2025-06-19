import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

const API_BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [toast, setToast] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/register`,
        formData
      );
      localStorage.setItem("token", res.data.token);
      setToast("Registered successfully! Welcome " + res.data.user.name);
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      setToast(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 transition-all">
      <Toast message={toast} onClose={() => setToast("")} />
      <div className="bg-white/90 p-10 rounded-3xl shadow-2xl w-full max-w-md flex flex-col items-center border border-blue-100">
        <button
          className="self-start flex items-center px-4 py-2 rounded-lg border border-blue-200 bg-white text-blue-700 font-semibold hover:bg-blue-50 transition mb-4"
          onClick={() => navigate("/login")}
        >
          ← Back
        </button>
        <h2 className="text-3xl font-extrabold mb-6 text-blue-700 drop-shadow text-center">
          Create LifeStack Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white/80 shadow"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white/80 shadow"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white/80 shadow"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg shadow hover:from-blue-600 hover:to-purple-600 transition font-bold"
          >
            Register
          </button>
        </form>
        <p className="mt-6 text-sm text-center">
          Already have an account?{" "}
          <button
            type="button"
            className="text-blue-600 hover:underline bg-transparent border-none p-0 m-0 font-semibold"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
