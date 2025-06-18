import { useNavigate } from "react-router-dom";
import React from "react";

export default function DashboardCard({ title, route, icon, color }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(route)}
      className={`w-52 h-52 bg-gradient-to-br ${color} rounded-3xl shadow-xl flex flex-col items-center justify-center text-xl font-bold text-white cursor-pointer transform hover:scale-105 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden animate-fade-in`}
    >
      <span className="text-5xl mb-3 drop-shadow-lg group-hover:rotate-12 transition-transform">
        {icon}
      </span>
      <span className="drop-shadow-lg">{title}</span>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity rounded-3xl" />
    </div>
  );
}
