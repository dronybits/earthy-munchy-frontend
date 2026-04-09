import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Zap, X, Sparkles, ArrowRight, MessageSquare, ShieldCheck, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QUICK_QUERIES = [
  "Why is NMR testing important? 🍯",
  "Explain C5 Ceylon Cinnamon 🌶️",
  "How to track my order? 📦",
  "Are your spices organic? 🌱"
];

// ... (Keep your imports and QUICK_QUERIES constant as they are)

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Welcome to Earthy Munchy.\n\nI am here to assist you in discovering the purity of our natural offerings. How may I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async (text) => {
    const msg = text || input;
    if (!msg.trim() || isLoading) return; // Prevent double-sending

    // 1. Update UI immediately with user message
    const userMessage = { role: 'user', text: msg };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('https://earthy-backend.onrender.com/chat', { // Updated to match your successful health check URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      });

      if (!res.ok) throw new Error('Network response was not ok');

      const data = await res.json();

      // 2. Functional update to avoid losing messages
      setMessages(prev => [...prev, { role: 'ai', text: data.response }]);
    } catch (e) {
      console.error("Connection Error:", e);
      setMessages(prev => [...prev, {
        role: 'ai',
        text: "I apologize, I am unable to connect. Our experts are currently tending to the hives—please try again in a moment."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 font-sans antialiased">
      {/* ... (Launcher remains the same) */}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            /* ... (Framer Motion props) */
            className="w-[460px] h-[750px] max-h-[85vh] bg-[#FDFBF7] rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden border border-[#D4C3A3]/30"
          >
            {/* Header ... */}

            {/* CHAT AREA */}
            <div className="flex-1 overflow-y-auto px-8 py-10 space-y-12 no-scrollbar">
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end pl-14' : 'items-start pr-14'}`}>
                  <div className={`flex items-center gap-2 mb-3 ${msg.role === 'user' ? 'flex-row-reverse text-[#6D5E4D]' : 'text-[#8B7355]'}`}>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                      {msg.role === 'user' ? 'Member Inquiry' : 'Expert Response'}
                    </span>
                  </div>
                  <div className={`p-8 rounded-[2rem] leading-relaxed text-[15px] shadow-sm border ${msg.role === 'user'
                    ? 'bg-[#EAE7E0] text-[#1a1a1a] rounded-tr-none border-[#D4C3A3]/50'
                    : 'bg-white text-[#333] rounded-tl-none border-white shadow-[0_15px_50px_rgba(0,0,0,0.03)] font-medium'
                    }`}>
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-[#D4C3A3] text-[10px] font-black tracking-widest pl-2">
                  <div className="flex gap-1">
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce [animation-delay:0.2s]">.</span>
                    <span className="animate-bounce [animation-delay:0.4s]">.</span>
                  </div>
                  <span>CONSULTING SOURCES...</span>
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            {/* FOOTER */}
            <footer className="p-8 bg-white border-t border-[#D4C3A3]/10">
              <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-2">
                {QUICK_QUERIES.map((q, i) => (
                  <button
                    key={i}
                    disabled={isLoading}
                    onClick={() => handleSend(q)}
                    className="flex items-center gap-2 px-5 py-3 bg-[#F9F7F2] border border-[#D4C3A3]/50 rounded-2xl text-[11px] font-bold text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#ccff00] disabled:opacity-50 transition-all whitespace-nowrap active:scale-95 shadow-sm"
                  >
                    <HelpCircle size={12} />
                    {q}
                  </button>
                ))}
              </div>

              <div className="relative">
                <textarea
                  rows="2"
                  value={input}
                  disabled={isLoading}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isLoading ? "Please wait..." : "How can we assist you today?"}
                  className="w-full bg-[#F5F5F5] p-6 rounded-2xl border-2 border-transparent focus:border-[#1a1a1a] focus:bg-white outline-none transition-all text-[16px] font-medium pr-16 resize-none shadow-inner disabled:cursor-not-allowed"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#1a1a1a] text-[#ccff00] p-4 rounded-xl flex items-center justify-center hover:scale-110 active:scale-90 shadow-xl transition-all disabled:grayscale disabled:opacity-50 disabled:scale-100"
                >
                  <ArrowRight size={22} strokeWidth={3} />
                </button>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;