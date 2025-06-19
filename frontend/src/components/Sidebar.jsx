import React from "react";
import { useNavigate } from "react-router-dom";
import Profile from "../pages/Profile";

export default function Sidebar({ userName, onLogout, onToggle, sidebarOpen }) {
  const navigate = useNavigate();
  return (
    <aside
      className={`fixed left-0 top-0 h-screen z-30 flex flex-col items-center py-8 transition-all duration-500 ${
        sidebarOpen ? "w-64" : "w-0 overflow-hidden"
      }`}
      style={{ minWidth: sidebarOpen ? 256 : 0 }}
    >
      <button
        className="absolute top-4 left-4 text-2xl text-blue-700 hover:text-blue-900 focus:outline-none"
        onClick={onToggle}
        aria-label="Toggle Sidebar"
      >
        ☰
      </button>
      <button
        className="mt-5 mb-10 text-3xl font-extrabold text-blue-700 tracking-widest drop-shadow-lg hover:scale-105 transition-transform"
        onClick={() => navigate("/dashboard")}
      >
        LifeStack
      </button>
      <div className="flex flex-col items-center gap-4 mt-10 w-full">
        <div
          onClick={() => navigate("/profile")}
          className="w-14 h-14 rounded-full border-4 border-blue-400 flex items-center justify-center text-3xl text-blue-600 bg-white shadow-lg cursor-pointer transition-transform hover:scale-110"
        >
          <span role="img" aria-label="profile">
            👤
          </span>
        </div>
        <span className="font-semibold text-blue-700 text-lg">
          {userName || "User"}
        </span>
        <button
          onClick={onLogout}
          className="mt-2 text-blue-700 font-bold bg-white hover:bg-blue-100 px-5 py-2 rounded-lg shadow border border-blue-300 transition-all duration-300 text-lg"
        >
          Logout
        </button>
      </div>
      <div className="mt-auto w-full px-6">
        <div className="bg-blue-50 rounded-xl p-4 text-blue-700 text-center text-sm mt-10 animate-fade-in border border-blue-100">
          <span>Tip: Explore all features!</span>
        </div>
      </div>
    </aside>
  );
}
