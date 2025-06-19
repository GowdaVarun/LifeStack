import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    axios
      .get(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="bg-white/90 p-10 rounded-3xl shadow-2xl w-full max-w-md flex flex-col items-center border border-blue-100">
        <div className="w-20 h-20 rounded-full border-4 border-blue-400 flex items-center justify-center text-5xl text-blue-600 bg-white shadow-lg mb-4">
          <span role="img" aria-label="profile">
            👤
          </span>
        </div>
        <h2 className="text-2xl font-extrabold text-blue-700 mb-2">
          {user?.name || "User"}
        </h2>
        <div className="text-gray-700 mb-1">
          Email: <span className="font-semibold">{user?.email}</span>
        </div>
        <div className="text-gray-500 text-sm mb-6">
          Welcome to your profile page!
        </div>
        <button
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg shadow hover:from-blue-600 hover:to-purple-600 transition font-bold"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
