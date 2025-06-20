import { useState } from "react";
import { Code } from "lucide-react";
import { useNavigate } from "react-router-dom";
const cards = [
  {
    title: "Daily Events",
    icon: "📝",
    desc: "Track your daily events, reflect and grow each day.",
    color: "from-pink-400 to-yellow-300",
  },
  {
    title: "Tasks",
    icon: "🎯",
    desc: "Set SMART  and stay focused on your dreams.",
    color: "from-green-400 to-blue-400",
  },
  {
    title: "Finances",
    icon: "💰",
    desc: "Manage your finances, savings, and spending habits.",
    color: "from-yellow-400 to-orange-400",
  },
  {
    title: "Knowledge Vault",
    icon: "📚",
    desc: "Capture and organize knowledge from articles and videos.",
    color: "from-indigo-400 to-purple-400",
  },
  {
    title: "Ready?",
    icon: "🚀",
    desc: "Ready to take control of your life?",
    color: "from-blue-400 to-purple-400",
  },
];

function Toast({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="fixed top-8 right-8 z-50 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-4 animate-fade-in">
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 text-white font-bold">
        ×
      </button>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showAbout, setShowAbout] = useState(false);
  const [toast, setToast] = useState("");

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % cards.length);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedback.trim()) return setToast("Please enter your feedback.");
    setToast("Thank you for your feedback!");
    setFeedback("");
  };

  return (
    <div className="min-h-screen p-0 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 transition-all">
      <Toast message={toast} onClose={() => setToast("")} />
      <div className="flex justify-between items-center px-4 py-4 md:px-10 md:py-8 bg-white/90 shadow-lg border-b border-blue-200">
        <h1 className="text-2xl md:text-4xl font-extrabold text-blue-700 tracking-widest drop-shadow">
          LIFE - STACK
        </h1>
        <div className="flex items-center gap-2 md:gap-4">
          <button
            className="flex items-center px-3 py-2 md:px-4 md:py-2 rounded-lg border border-blue-200 bg-white text-blue-700 font-semibold hover:bg-blue-50 transition text-sm md:text-base"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <a
            href="https://github.com/GowdaVarun/LifeStack"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-3 py-2 md:px-4 md:py-2 rounded-lg border border-blue-200 bg-white text-blue-700 font-semibold hover:bg-blue-50 transition text-sm md:text-base"
          >
            <Code className="w-4 h-4 md:w-5 md:h-5 mr-2" /> Code
          </a>
        </div>
      </div>

      <div className="mt-8 md:mt-16 flex flex-col md:flex-row justify-center items-center gap-4">
        <button
          onClick={handlePrev}
          className="pb-2 pr-1 md:mr-4 text-2xl md:text-3xl text-blue-400 hover:text-blue-700 transition rounded-full bg-white shadow w-10 h-10 md:w-12 md:h-12 flex items-center justify-center"
        >
          ⟨
        </button>
        <div
          className={`border-0 rounded-2xl md:rounded-3xl p-0 max-w-xs md:max-w-xl w-[90vw] md:w-[650px] h-[200px] md:h-[320px] flex flex-col items-center justify-center shadow-xl bg-gradient-to-br ${cards[currentIndex].color} transition-all duration-500 relative overflow-hidden`}
        >
          <div className="flex flex-col items-center justify-center w-full h-full p-4 md:p-8">
            <div className="text-4xl md:text-6xl mb-2 md:mb-4 drop-shadow-lg">
              {cards[currentIndex].icon}
            </div>
            <div className="text-lg md:text-2xl font-bold text-white mb-1 md:mb-2 drop-shadow">
              {cards[currentIndex].title}
            </div>
            <div className="text-sm md:text-lg text-white/90 mb-2 md:mb-4 drop-shadow text-center">
              {cards[currentIndex].desc}
            </div>
            {currentIndex === cards.length - 1 && (
              <button
                className="text-white bg-gradient-to-r from-blue-500 to-purple-500 px-4 md:px-6 py-2 rounded-lg shadow hover:from-blue-600 hover:to-purple-600 transition font-bold mt-2 text-sm md:text-base"
                onClick={() => navigate("/login")}
              >
                Get Started →
              </button>
            )}
          </div>
        </div>
        <button
          onClick={handleNext}
          className="pb-2 pl-1 md:ml-4 text-2xl md:text-3xl text-blue-400 hover:text-blue-700 transition rounded-full bg-white shadow w-10 h-10 md:w-12 md:h-12 flex items-center justify-center"
        >
          ⟩
        </button>
      </div>

      <div className="flex justify-center mt-4 space-x-2">
        {cards.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
              currentIndex === index ? "bg-blue-600 scale-125" : "bg-blue-200"
            }`}
          />
        ))}
      </div>

      <form
        onSubmit={handleFeedbackSubmit}
        className="mt-8 md:mt-12 flex flex-col items-center gap-2 md:gap-4"
      >
        <label
          htmlFor="feedback"
          className="text-base md:text-lg font-semibold text-blue-700"
        >
          Write to us (Feedback)
        </label>
        <textarea
          id="feedback"
          className="w-full max-w-xs md:max-w-xl min-h-[60px] md:min-h-[80px] border-2 border-blue-200 rounded-lg p-2 md:p-3 focus:outline-none focus:border-blue-500 bg-white/80 shadow text-sm md:text-base"
          placeholder="Your feedback..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 md:px-6 py-2 rounded-lg shadow hover:from-blue-600 hover:to-purple-600 transition font-bold text-sm md:text-base"
        >
          Submit Feedback
        </button>
      </form>

      <div className="mt-6 md:mt-8 flex flex-col items-center">
        <button
          className="mb-5 w-40 md:w-60 text-base md:text-lg px-3 md:px-4 py-2 rounded-lg border border-blue-200 bg-white text-blue-700 font-semibold hover:bg-blue-50 transition"
          onClick={() => setShowAbout(true)}
        >
          About us
        </button>
        {showAbout && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-8 max-w-xs md:max-w-md w-full relative animate-fade-in">
              <button
                className="absolute top-3 right-3 text-xl md:text-2xl text-blue-700 hover:text-blue-900 font-bold"
                onClick={() => setShowAbout(false)}
                aria-label="Close"
              >
                ×
              </button>
              <h2 className="text-xl md:text-2xl font-bold text-blue-700 mb-2">
                About LifeStack
              </h2>
              <p className="text-gray-700 mb-2 text-sm md:text-base">
                LifeStack is your all-in-one platform for journaling, goal
                tracking, finance management, and knowledge vault. Built by
                Varun Gowda R.
              </p>
              <p className="text-gray-500 text-xs md:text-sm">
                Contact: varungowdar2004@gmail.com
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
