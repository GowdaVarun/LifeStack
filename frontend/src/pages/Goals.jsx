import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaTrash, FaCheckCircle } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

export default function GoalTrackerPage() {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");
  const [description, setDescription] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userName, setUserName] = useState("");

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/goals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGoals(res.data);
    } catch (err) {
      console.error("Error fetching goals", err);
    }
  };

  const addGoal = async () => {
    if (!newGoal) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/goals",
        { title: newGoal, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGoals([res.data, ...goals]);
      setNewGoal("");
      setDescription("");
    } catch (err) {
      console.error("Error adding goal", err);
    }
  };

  const deleteGoal = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/goals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGoals(goals.filter((goal) => goal._id !== id));
    } catch (err) {
      console.error("Error deleting goal", err);
    }
  };

  const markComplete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const updated = await axios.patch(
        `http://localhost:5000/api/goals/${id}`,
        { status: "Completed" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGoals(goals.map((g) => (g._id === id ? updated.data : g)));
    } catch (err) {
      console.error("Error updating goal", err);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUserName(res.data.name))
      .catch(() => setUserName("User"));
  }, []);

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
        <h2 className="text-3xl font-bold mb-6">🎯 Goals & Project Tracker</h2>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="New Goal Title..."
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 border rounded shadow"
          />
          <input
            type="text"
            placeholder="Short Description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full md:w-2/3 px-4 py-2 border rounded shadow"
          />
          <button
            onClick={addGoal}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 shadow"
          >
            <FaPlus className="inline mr-2" /> Add Goal
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <div
              key={goal._id}
              className="bg-white rounded-xl p-5 shadow-md border-l-4 border-blue-400 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-bold text-blue-700 mb-2">
                  {goal.title}
                </h3>
                <p className="text-gray-600 mb-3">{goal.description}</p>
                <span
                  className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                    goal.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {goal.status || "Not Started"}
                </span>
              </div>

              <div className="mt-4 flex gap-3">
                {goal.status !== "Completed" && (
                  <button
                    onClick={() => markComplete(goal._id)}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 shadow"
                  >
                    <FaCheckCircle className="inline mr-2" /> Complete
                  </button>
                )}
                <button
                  onClick={() => deleteGoal(goal._id)}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 shadow"
                >
                  <FaTrash className="inline mr-2" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
