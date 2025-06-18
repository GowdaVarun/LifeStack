import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
ChartJS.register(ArcElement, Tooltip, Legend);

const API_BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function FinanceManager() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
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

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/api/finance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data);
    } catch (err) {
      console.error("Error loading transactions", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async () => {
    if (!amount || !category) return alert("Fill all fields");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE_URL}/api/finance`,
        { amount, type, category, note },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTransactions([res.data, ...transactions]);
      setAmount("");
      setCategory("");
      setNote("");
    } catch (err) {
      console.error("Error adding transaction", err);
    }
  };

  const pieData = {
    labels: [...new Set(transactions.map((t) => t.category))],
    datasets: [
      {
        data: transactions.reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount);
          return acc;
        }, {}),
        backgroundColor: [
          "#3B82F6",
          "#10B981",
          "#F59E0B",
          "#EF4444",
          "#8B5CF6",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-yellow-200 via-orange-100 to-pink-200 animate-fade-in">
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
        <h2 className="text-3xl font-bold mb-6">💰 Personal Finance Manager</h2>

        <div className="bg-white p-6 rounded shadow mb-6">
          <h3 className="text-xl font-semibold mb-4">Add Transaction</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <input
              type="number"
              placeholder="Amount"
              className="border p-2 rounded"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <select
              className="border p-2 rounded"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <input
              type="text"
              placeholder="Category (e.g. Food, Travel)"
              className="border p-2 rounded"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <input
              type="text"
              placeholder="Note (optional)"
              className="border p-2 rounded"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <button
            onClick={handleAdd}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Add Transaction
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-bold mb-4">Transaction History</h3>
            <ul className="space-y-2 max-h-96 overflow-y-auto">
              {transactions.map((t, i) => (
                <li
                  key={i}
                  className={`flex justify-between border-l-4 pl-4 pr-2 py-2 rounded shadow-sm ${
                    t.type === "income" ? "border-green-400" : "border-red-400"
                  } bg-gray-50`}
                >
                  <div>
                    <p className="font-medium">
                      {t.category} - {t.note || "No note"}
                    </p>
                    <p className="text-xs text-gray-500">{t.date}</p>
                  </div>
                  <div
                    className={`font-semibold ${
                      t.type === "income" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {t.type === "income" ? "+" : "-"}${t.amount}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-bold mb-4">Spending Breakdown</h3>
            <Pie
              data={{
                ...pieData,
                datasets: [
                  {
                    ...pieData.datasets[0],
                    data: Object.values(pieData.datasets[0].data),
                  },
                ],
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
