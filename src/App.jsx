import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Zap, ArrowRight } from 'lucide-react';
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
    const messageToSend = text || input;
    if (!messageToSend.trim()) return;

    const newMessages = [...messages, { role: 'user', text: messageToSend }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://earthy-munchy-assistant.onrender.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageToSend }),
      });
      const data = await response.json();
      setMessages([...newMessages, { role: 'ai', text: data.response }]);
    } catch (error) {
      setMessages([...newMessages, { role: 'ai', text: "Oof, the server ghosted us. Check your connection? 💀" }]);
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
                  /* USER QUESTION STYLE: Bold, Punchy, Neo-Brutalism */
                  <div className="relative group">
                    <div className="bg-[#ccff00] text-black px-6 py-4 rounded-[2rem] rounded-tr-none font-bold text-lg shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] border-2 border-black max-w-sm">
                      {msg.text}
                    </div>
                    <div className="absolute -top-3 -right-2 bg-white text-black p-1 rounded-full border-2 border-black">
                      <User size={14} strokeWidth={3} />
                    </div>
                  </div>
                ) : (
                  /* AI ANSWER STYLE: Premium Glassmorphism */
                  <div className="flex items-start gap-4 max-w-[90%] md:max-w-[80%]">
                    <div className="mt-2 bg-[#ccff00] p-2 rounded-xl shrink-0 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]">
                      <Sparkles size={18} className="text-black" />
                    </div>
                    <div className="bg-[#1a1a1a] border border-white/10 p-6 rounded-[2.5rem] rounded-tl-none backdrop-blur-xl shadow-2xl">
                      <p className="text-gray-200 leading-relaxed text-md font-medium">
                        {msg.text}
                      </p>
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

        {/* Input & Chips Section */}
        <div className="bg-[#121212]/80 backdrop-blur-2xl p-6 rounded-[3rem] border border-white/5 shadow-[0_-20px_40px_rgba(0,0,0,0.5)]">
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
            {CHIPS.map((chip, i) => (
              <button
                key={i}
                onClick={() => handleSend(chip)}
                className="px-5 py-2.5 bg-white/5 hover:bg-[#ccff00] hover:text-black rounded-full border border-white/10 text-[11px] font-black uppercase tracking-wider transition-all duration-300 whitespace-nowrap active:scale-90"
              >
                {chip}
              </button>
            ))}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Spill the tea on honey..."
              className="w-full bg-[#1a1a1a] p-6 rounded-[2rem] border-2 border-white/5 focus:border-[#ccff00] outline-none transition-all pr-20 text-md font-medium placeholder:text-gray-600"
            />
            <button
              className="absolute right-3 top-3 bottom-3 px-5 bg-[#ccff00] text-black rounded-2xl font-black hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group-focus-within:shadow-[0_0_20px_rgba(204,255,0,0.4)]"
            >
              <span className="hidden md:block text-xs uppercase">Send</span>
              <ArrowRight size={18} strokeWidth={3} />
            </button>
          </form>
          <p className="text-[9px] text-center text-gray-600 mt-4 font-bold tracking-[0.2em] uppercase">
            Native Sourced • Verified Pure • Bengaluru, IN
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;