import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const VAULT_TYPES = ["Article", "Video", "Tutorial", "Other"];
const API_BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function KnowledgeVault() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [url, setUrl] = useState("");
  const [type, setType] = useState(VAULT_TYPES[0]);
  const [notes, setNotes] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userName, setUserName] = useState("");

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/api/vault`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching vault", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUserName(res.data.name))
      .catch(() => setUserName("User"));
  }, []);

  const handleSave = async () => {
    if (!url || !type) return alert("Please enter all fields");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE_URL}/api/vault`,
        { url, type, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems([res.data, ...items]);
      setUrl("");
      setType(VAULT_TYPES[0]);
      setNotes("");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        alert("Error: " + err.response.data.message);
      } else {
        alert("Error saving item. Please check your input and try again.");
      }
      console.error("Error saving item", err);
    }
  };

    useEffect(() => {
    if (window.innerWidth < 768) setSidebarOpen(false);
    else setSidebarOpen(true);
  }, []);
  
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-200 via-purple-100 to-pink-200 animate-fade-in">
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
        <h2 className="text-3xl font-bold mb-6">📚 Knowledge Vault</h2>

        <input
          type="text"
          placeholder="Bookmark URL (article or YouTube)"
          className="w-full mb-4 p-3 border rounded shadow"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full mb-4 p-3 border rounded shadow"
        >
          {VAULT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <textarea
          rows="4"
          placeholder="Add personal notes or takeaways..."
          className="w-full p-3 border rounded shadow mb-4"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        ></textarea>

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 shadow"
        >
          Save to Vault
        </button>

        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">🔖 Your Bookmarks</h3>
          <ul className="space-y-4">
            {items.map((item, i) => (
              <li
                key={i}
                className="bg-white p-4 rounded shadow border-l-4 border-blue-300"
              >
                <p className="text-sm text-gray-500">
                  {item.type} — {new Date(item.date).toLocaleString()}
                </p>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 font-semibold underline"
                >
                  {item.url}
                </a>
                <p className="mt-2 text-gray-800 whitespace-pre-wrap">
                  {item.notes}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
