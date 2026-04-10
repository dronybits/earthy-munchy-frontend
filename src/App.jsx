import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, User, Zap, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CHIPS = ["Why NMR tested? 🍯", "C5 Cinnamon vs Regular 🌶️", "Is it really wild? 🌿", "WhatsApp Support 📱"];

function App() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Yo! Welcome to Earthy Munchy. We're serving nothing but pure vibes and NMR-tested goodness. What's the move?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async (text) => {
    // 1. Prioritize the chip text, fallback to input, and ensure it's a string
    const messageToSend = (typeof text === 'string' ? text : input).trim();

    // 2. Stop if input is empty or if the AI is currently thinking
    if (!messageToSend || isLoading) return;

    // 3. Immediately update UI and clear input
    setMessages(prev => [...prev, { role: 'user', text: messageToSend }]);
    setInput('');
    setIsLoading(true);

    try {
      // 4. Updated URL to match your working backend
      const response = await fetch('https://earthy-munchy-assistant.onrender.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageToSend }),
      });

      if (!response.ok) throw new Error('Network error');

      const data = await response.json();

      // 5. Safely append the AI response to the LATEST state
      setMessages(prev => [...prev, { role: 'ai', text: data.response }]);
    } catch (error) {
      console.error("Fetch Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "Oof, the server ghosted us. Check your connection? 💀" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center p-4 md:p-8 font-sans selection:bg-[#ccff00] selection:text-black">

      {/* Floating Header */}
      <header className="w-full max-w-2xl bg-[#ccff00] p-5 rounded-3xl mb-8 flex justify-between items-center border-b-[6px] border-r-[6px] border-black shadow-[10px_10px_0px_0px_rgba(255,255,255,0.05)] transform -rotate-1">
        <div>
          <h1 className="text-black font-black text-3xl tracking-tighter leading-none">EARTHY MUNCHY</h1>
          <p className="text-black/60 text-[10px] font-bold uppercase tracking-widest mt-1">Wild by origin • Honest by nature</p>
        </div>
        <Zap className="text-black fill-black animate-pulse" size={28} />
      </header>

      {/* Chat Container */}
      <main className="w-full max-w-2xl flex-1 flex flex-col gap-6 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-2 space-y-8 no-scrollbar pb-10">
          <AnimatePresence mode='popLayout'>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: msg.role === 'user' ? 50 : -50, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'user' ? (
                  <div className="relative group">
                    <div className="bg-[#ccff00] text-black px-6 py-4 rounded-[2rem] rounded-tr-none font-bold text-lg shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] border-2 border-black max-w-sm">
                      {msg.text}
                    </div>
                    <div className="absolute -top-3 -right-2 bg-white text-black p-1 rounded-full border-2 border-black">
                      <User size={14} strokeWidth={3} />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4 max-w-[90%] md:max-w-[80%]">
                    <div className="mt-2 bg-[#ccff00] p-2 rounded-xl shrink-0 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]">
                      <Sparkles size={18} className="text-black" />
                    </div>
                    <div className="bg-[#1a1a1a] border border-white/10 p-6 rounded-[2.5rem] rounded-tl-none backdrop-blur-xl shadow-2xl">
                      <div className="text-gray-200 leading-relaxed text-md font-medium whitespace-pre-wrap">
                        {msg.text}
                      </div>
                      <div className="mt-4 flex gap-2">
                        <span className="h-1 w-8 bg-[#ccff00] rounded-full opacity-50"></span>
                        <span className="h-1 w-3 bg-[#ccff00] rounded-full opacity-30"></span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 items-center text-[#ccff00] font-black italic tracking-widest text-xs ml-14">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ccff00] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ccff00]"></span>
              </span>
              REASONING...
            </motion.div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Missing Footer / Input Section Added Here */}
        <footer className="w-full shrink-0">
          {/* Quick Queries (Chips) */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-2 px-2">
            {CHIPS.map((chip, idx) => (
              <button
                key={idx}
                disabled={isLoading}
                onClick={() => handleSend(chip)}
                className="whitespace-nowrap px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded-full text-xs font-bold hover:bg-[#ccff00] hover:text-black hover:border-[#ccff00] transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="relative px-2"
          >
            <input
              type="text"
              value={input}
              disabled={isLoading}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isLoading ? "Vibing with the servers..." : "Type your message..."}
              className="w-full bg-[#1a1a1a] text-white p-5 pr-16 rounded-[2rem] border-2 border-white/10 focus:border-[#ccff00] outline-none transition-all placeholder:text-gray-600 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#ccff00] text-black p-3 rounded-full hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 disabled:hover:scale-100"
            >
              <ArrowRight size={20} strokeWidth={3} />
            </button>
          </form>
        </footer>
      </main>
    </div>
  );
}

export default App;