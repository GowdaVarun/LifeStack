import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Journal from "./pages/Journal";
import Goals from "./pages/Goals";
import Finance from "./pages/Finance";
import KnowledgeVault from "./pages/KnowledgeVault";
import "./App.css"; 
import LandingPage from "./pages/LandingPage";
import Profile from "./pages/Profile";

export default function App() {
 return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/vault" element={<KnowledgeVault />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}
