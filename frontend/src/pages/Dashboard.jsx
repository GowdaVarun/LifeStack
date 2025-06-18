import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardCard from "../components/DashboardCard";
import axios from "axios";

const funFacts = [
  "Did you know? Journaling boosts mental clarity!",
  "Set a goal today and achieve greatness!",
  "Track your finances for a brighter future!",
  "Expand your mind in the Knowledge Vault!",
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
    else {
      axios
        .get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUserName(res.data.name))
        .catch(() => {
          localStorage.removeItem("token");
          navigate("/login");
        });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100 transition-all duration-700">
      {sidebarOpen && (
        <Sidebar
          userName={userName}
          onLogout={handleLogout}
          onToggle={() => setSidebarOpen(false)}
          sidebarOpen={sidebarOpen}
        />
      )}
      {!sidebarOpen && (
        <button
          className="fixed top-2 left-2 z-30 text-2xl text-blue-700 p-2 hover:text-blue-900 focus:outline-none"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open Sidebar"
        >
          ☰
        </button>
      )}
      <div
        className={`transition-all duration-500 ${
          sidebarOpen ? "ml-64" : "ml-0"
        } w-full min-h-screen pt-10 px-10`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-24">
          <DashboardCard
            title="Journal"
            route="/journal"
            icon="📝"
            color="from-pink-400 to-yellow-300"
          />
          <DashboardCard
            title="Goals"
            route="/goals"
            icon="🎯"
            color="from-green-400 to-blue-400"
          />
          <DashboardCard
            title="Finances"
            route="/finance"
            icon="💰"
            color="from-yellow-400 to-orange-400"
          />
          <DashboardCard
            title="Knowledge Vault"
            route="/vault"
            icon="📚"
            color="from-indigo-400 to-purple-400"
          />
        </div>
        <div className="mt-10 w-full bg-white/80 p-6 rounded-2xl shadow-lg text-center text-lg animate-fade-in">
          <span className="font-semibold text-purple-700">
            {funFacts[Math.floor(Math.random() * funFacts.length)]}
          </span>
          <div className="mt-4 text-gray-500">
            Chatbot coming soon — stay tuned for more features!
          </div>
        </div>
      </div>
    </div>
  );
}
