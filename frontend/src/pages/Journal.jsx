import React, { useState, useEffect } from "react";
import { FaSmile, FaMeh, FaFrown } from "react-icons/fa";
import { jsPDF } from "jspdf";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function JournalPage() {
  const navigate = useNavigate();
  const [entry, setEntry] = useState("");
  const [mood, setMood] = useState("");
  const [history, setHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUserName(res.data.name))
      .catch(() => setUserName("User"));
  }, []);

  const fetchEntries = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/api/journal`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data);
    } catch (err) {
      console.error("Error fetching entries", err);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSave = async () => {
    if (!entry || !mood)
      return alert("Please write something and select a mood");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE_URL}/api/journal`,
        { text: entry, mood },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHistory([res.data, ...history]);
      setEntry("");
      setMood("");
    } catch (err) {
      console.error("Error saving entry", err);
    }
  };

  const handlePDFExport = () => {
    const doc = new jsPDF();
    history.forEach((e, i) => {
      doc.text(
        `Date: ${e.date}\nMood: ${e.mood}\n${e.text}\n\n`,
        10,
        10 + i * 40
      );
    });
    doc.save("journal.pdf");
  };

  // Helper to format date/time in IST
  const formatIST = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-purple-200 animate-fade-in">
      <Sidebar
        userName={userName}
        onLogout={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
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
        <button
          className="mb-6 mt-4 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>
        <h2 className="text-3xl font-bold mb-6">📝 Journal & Mood Log</h2>

        <textarea
          rows="6"
          placeholder="Write about your day..."
          className="w-full p-4 border rounded shadow bg-white text-gray-700 resize-none"
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
        ></textarea>

        <div className="flex items-center gap-6 mt-4">
          <span className="text-lg font-semibold">Mood:</span>
          <button
            onClick={() => setMood("Happy")}
            className={`text-2xl ${
              mood === "Happy" ? "scale-125" : "opacity-60"
            }`}
          >
            <FaSmile className="text-yellow-400 hover:scale-110 transition" />
          </button>
          <button
            onClick={() => setMood("Neutral")}
            className={`text-2xl ${
              mood === "Neutral" ? "scale-125" : "opacity-60"
            }`}
          >
            <FaMeh className="text-gray-500 hover:scale-110 transition" />
          </button>
          <button
            onClick={() => setMood("Sad")}
            className={`text-2xl ${
              mood === "Sad" ? "scale-125" : "opacity-60"
            }`}
          >
            <FaFrown className="text-blue-500 hover:scale-110 transition" />
          </button>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 shadow"
          >
            Save Entry
          </button>
          <button
            onClick={handlePDFExport}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 shadow"
          >
            Export as PDF
          </button>
        </div>

        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">📚 Past Entries</h3>
          <ul className="space-y-4">
            {history.map((e, i) => (
              <li
                key={i}
                className="bg-white p-4 rounded shadow border-l-4 border-blue-300"
              >
                <p className="text-sm text-gray-500">
                  {formatIST(e.date)} — Mood: {e.mood}
                </p>
                <p className="mt-2 text-gray-800 whitespace-pre-wrap">
                  {e.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
