import React, { useState, useEffect } from "react";
import { FaSmile, FaMeh, FaFrown } from "react-icons/fa";
import { jsPDF } from "jspdf";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function JournalPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userName, setUserName] = useState("");
  const [eventType, setEventType] = useState("");
  const [events, setEvents] = useState([{ type: "", text: "", time: "" }]); // {type, text, time}
  const [filter, setFilter] = useState("all");

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

  // const handleSave = async () => {
  //   if (!entry || !mood)
  //     return alert("Please write something and select a mood");
  //   try {
  //     const token = localStorage.getItem("token");
  //     const res = await axios.post(
  //       `${API_BASE_URL}/api/journal`,
  //       { text: entry, mood },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     setHistory([res.data, ...history]);
  //     setEntry("");
  //     setMood("");
  //   } catch (err) {
  //     console.error("Error saving entry", err);
  //   }
  // };

  // PDF Export
  const handlePDFExport = () => {
    const doc = new jsPDF();
    let y = 10;
    history.forEach((e, i) => {
      doc.text(
        `Date: ${formatIST(e.date)}\nEvent Type: ${e.mood}\nTime: ${
          e.time || "-"
        }\n${e.text}\n`,
        10,
        y
      );
      y += 30;
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

  useEffect(() => {
    if (window.innerWidth < 768) setSidebarOpen(false);
    else setSidebarOpen(true);
  }, []);

  // Cumulative counts
  const counts = history.reduce(
    (acc, e) => {
      if (e.mood === "good") acc.good++;
      else if (e.mood === "bad") acc.bad++;
      else if (e.mood === "neutral") acc.neutral++;
      return acc;
    },
    { good: 0, bad: 0, neutral: 0 }
  );

  // Add new event input
  const handleAddEvent = () => {
    setEvents([...events, { type: eventType, text: "", time: "" }]);
  };

  // Update event text or time
  const handleEventChange = (idx, value, field = "text") => {
    setEvents(events.map((e, i) => (i === idx ? { ...e, [field]: value } : e)));
  };

  // Save all events
  const handleSaveAll = async () => {
    const validEvents = events.filter((e) => e.text && e.type);
    if (!validEvents.length) return alert("Please enter at least one event.");
    try {
      const token = localStorage.getItem("token");
      const res = await Promise.all(
        validEvents.map((e) =>
          axios.post(
            `${API_BASE_URL}/api/journal`,
            { text: e.text, mood: e.type, time: e.time },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );
      setHistory([...res.map((r) => r.data), ...history]);
      setEvents([]);
      setEventType("");
    } catch (err) {
      console.error("Error saving events", err);
    }
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
        } w-full min-h-screen pt-10 px-2 md:px-10`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition w-fit"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-blue-700 text-center flex-1">
            Daily Events
          </h1>
          <p className="mt-6 text-2xl font-serif text-blue-900 text-center flex-1">
            Select event type to add event
          </p>
        </div>
        <div className="flex gap-4 mb-6 justify-center flex-wrap">
          <button
            className={`px-6 py-2 rounded-full font-bold text-white shadow transition-all ${
              eventType === "good"
                ? "bg-green-600 scale-110"
                : "bg-green-400 hover:bg-green-500"
            }`}
            onClick={() => {
              setEventType("good");
              setEvents([{ type: "good", text: "", time: "" }]);
            }}
          >
            <FaSmile className="inline mr-2" /> Good
          </button>
          <button
            className={`px-6 py-2 rounded-full font-bold text-white shadow transition-all ${
              eventType === "bad"
                ? "bg-red-600 scale-110"
                : "bg-red-400 hover:bg-red-500"
            }`}
            onClick={() => {
              setEventType("bad");
              setEvents([{ type: "bad", text: "", time: "" }]);
            }}
          >
            <FaFrown className="inline mr-2" /> Bad
          </button>
          <button
            className={`px-6 py-2 rounded-full font-bold text-white shadow transition-all ${
              eventType === "neutral"
                ? "bg-orange-500 scale-110"
                : "bg-orange-400 hover:bg-orange-500"
            }`}
            onClick={() => {
              setEventType("neutral");
              setEvents([{ type: "neutral", text: "", time: "" }]);
            }}
          >
            <FaMeh className="inline mr-2" /> Neutral
          </button>
        </div>
        {eventType && (
          <div className="mb-6 flex flex-col items-center gap-4">
            {events.map((e, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-row gap-2 w-full max-w-xl items-center"
              >
                <textarea
                  className="flex-1 px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white/80 shadow h-20 text-base resize-none overflow-y-auto"
                  style={{
                    minHeight: "80px",
                    maxHeight: "200px",
                    width: "100%",
                    overflowX: "hidden",
                  }}
                  placeholder={`Describe your ${eventType} event...`}
                  value={e.text}
                  onChange={(ev) =>
                    handleEventChange(idx, ev.target.value, "text")
                  }
                />
                <input
                  type="time"
                  className="w-32 px-2 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white/80 shadow"
                  value={e.time || ""}
                  onChange={(ev) =>
                    handleEventChange(idx, ev.target.value, "time")
                  }
                />
              </div>
            ))}
            <div className="mt-2">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
                onClick={handleAddEvent}
                type="button"
              >
                + Add Event
              </button>
            </div>
            <div className="flex gap-2 ">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition font-bold"
                onClick={handleSaveAll}
                type="button"
              >
                Save Events
              </button>
            </div>
          </div>
        )}
        {!eventType && events.length > 0 && (
          <div className="mb-6 flex flex-col items-center gap-4">
            {events.map((e, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-row gap-2 w-full max-w-xl items-center"
              >
                <textarea
                  className="flex-1 px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white/80 shadow h-20 text-base resize-none overflow-y-auto"
                  style={{
                    minHeight: "80px",
                    maxHeight: "200px",
                    width: "100%",
                    overflowX: "hidden",
                  }}
                  placeholder="Select an event type above to begin..."
                  value={e.text}
                  onChange={(ev) =>
                    handleEventChange(idx, ev.target.value, "text")
                  }
                  disabled
                />
                <input
                  type="time"
                  className="w-32 px-2 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white/80 shadow"
                  value={e.time || ""}
                  disabled
                />
              </div>
            ))}
          </div>
        )}
        {/* Cumulative Report */}
        <div className="flex justify-center gap-8 mb-8">
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center text-2xl font-bold text-white mb-1">
              {counts.good}
            </div>
            <span className="text-green-700 font-semibold">Good Events</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center text-2xl font-bold text-white mb-1">
              {counts.bad}
            </div>
            <span className="text-red-700 font-semibold">Bad Events</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center text-2xl font-bold text-white mb-1">
              {counts.neutral}
            </div>
            <span className="text-orange-700 font-semibold">Neutral</span>
          </div>
        </div>
        <div className="mb-4 flex justify-center">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition w-fit"
            onClick={handlePDFExport}
          >
            Export PDF
          </button>
        </div>
        {/* Filter and List */}
        <div className="flex justify-between items-center mb-4 max-w-xl mx-auto">
          <span className="font-bold text-lg">Last 30 Days Events</span>
          <select
            className="border px-2 py-1 rounded"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="good">Good</option>
            <option value="bad">Bad</option>
            <option value="neutral">Neutral</option>
          </select>
        </div>
        <div className="space-y-3 max-w-xl mx-auto">
          {history
            .filter((e) => filter === "all" || e.mood === filter)
            .filter((e) => {
              const d = new Date(e.date);
              const now = new Date();
              return (now - d) / (1000 * 60 * 60 * 24) <= 30;
            })
            .map((e, idx) => (
              <div
                key={e._id || idx}
                className={`p-4 rounded-xl shadow flex flex-col md:flex-row md:items-center gap-2 bg-white/80 border-l-8 ${
                  e.mood === "good"
                    ? "border-green-400"
                    : e.mood === "bad"
                    ? "border-red-400"
                    : "border-orange-400"
                }`}
              >
                <span className="font-bold capitalize mr-2">{e.mood}</span>
                <span className="flex-1">{e.text}</span>
                <span className="text-xs text-gray-500 ml-auto">
                  {formatIST(e.date)}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
