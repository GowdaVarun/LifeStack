import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaCheck, FaTrash } from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function TodoListPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userName, setUserName] = useState("");
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

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/api/goals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

 useEffect(() => {
    setSidebarOpen(false);
  }, []);

  const addTask = async () => {
    if (!title || !date || !time) return;
    try {
      const token = localStorage.getItem("token");
      // Combine date and time as a string ("YYYY-MM-DDTHH:mm")
      const deadline = `${date}T${time}`;
      const res = await axios.post(
        `${API_BASE_URL}/api/goals`,
        { title, deadline },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks([res.data, ...tasks]);
      setTitle("");
      setDate("");
      setTime("");
    } catch (err) {
      console.error("Error adding task", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/goals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error("Error deleting task", err);
    }
  };

  const markComplete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `${API_BASE_URL}/api/goals/${id}`,
        { status: "Completed" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map((task) => (task._id === id ? res.data : task)));
    } catch (err) {
      console.error("Error updating task", err);
    }
  };

  const getStatus = (task) => {
    if (task.status === "Completed") return "Completed";
    if (task.deadline && new Date(task.deadline) < new Date()) return "Missed";
    return "Pending";
  };

  const filteredTasks = tasks.filter((task) => {
    const status = getStatus(task);
    if (filter === "all") return true;
    return status === filter;
  });

  // Helper to format date/time in IST (same as Journal.jsx)
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
    <div className="flex min-h-screen bg-gradient-to-br from-green-200 via-blue-100 to-yellow-200 animate-fade-in">
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
        className={`transition-all duration-500 w-full min-h-screen pt-10 px-2 md:px-10`}
      >
        <button
          className="mb-6 mt-4 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>
        <h2 className="text-3xl font-bold mb-6 text-blue-700 text-center">
          📝 Tasks
        </h2>
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-center">
          <input
            type="text"
            placeholder="Task Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 border rounded shadow"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-2 border rounded shadow"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="px-4 py-2 border rounded shadow"
          />
          <button
            onClick={addTask}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 shadow flex items-center gap-2"
          >
            <FaPlus /> Add Task
          </button>
        </div>
        <div className="flex justify-center gap-4 mb-6">
          {["all", "Pending", "Completed", "Missed"].map((f) => (
            <button
              key={f}
              className={`px-4 py-2 rounded-full font-bold shadow transition-all ${
                filter === f
                  ? f === "Completed"
                    ? "bg-green-600 text-white"
                    : f === "Missed"
                    ? "bg-red-600 text-white"
                    : f === "Pending"
                    ? "bg-yellow-500 text-white"
                    : "bg-blue-600 text-white"
                  : `bg-white text-${
                      f === "Completed"
                        ? "green"
                        : f === "Missed"
                        ? "red"
                        : f === "Pending"
                        ? "yellow"
                        : "blue"
                    }-700 border border-${
                      f === "Completed"
                        ? "green"
                        : f === "Missed"
                        ? "red"
                        : f === "Pending"
                        ? "yellow"
                        : "blue"
                    }-300`
              }`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="space-y-4 max-w-2xl mx-auto">
          {filteredTasks.length === 0 && (
            <div className="text-center text-gray-500">No tasks found.</div>
          )}
          {filteredTasks.map((task) => {
            const status = getStatus(task);
            return (
              <div
                key={task._id}
                className={`flex flex-col md:flex-row bg-white rounded-xl p-4 shadow border-l-8 mb-2 ${
                  status === "Completed"
                    ? "border-green-400"
                    : status === "Missed"
                    ? "border-red-400"
                    : "border-yellow-400"
                }`}
              >
                <div className="flex flex-col flex-1 gap-2">
                  <div className="flex flex-row items-center justify-between">
                    <span className="font-bold text-lg text-blue-700">
                      {task.title}
                    </span>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ml-2 ${
                        status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : status === "Missed"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                  <div className="flex flex-row items-center justify-between mt-1">
                    <span className="text-sm text-gray-500">
                      Due:{" "}
                      <span className="font-semibold">
                        {formatIST(task.deadline).split(",")[0]}
                      </span>{" "}
                      {/* <span>
                        {formatIST(task.deadline).split(",")[1]?.trim()}
                      </span> */}
                    </span>
                    <div className="flex flex-row gap-2">
                      {status !== "Completed" && (
                        <button
                          onClick={() => markComplete(task._id)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 shadow flex items-center"
                        >
                          <FaCheck className="mr-1" /> Complete
                        </button>
                      )}
                      <button
                        onClick={() => deleteTask(task._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 shadow flex items-center"
                      >
                        <FaTrash className="mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
