import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Zap, X, Sparkles, ArrowRight, MessageSquare, ShieldCheck, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QUICK_QUERIES = [
  "Why is NMR testing important? 🍯",
  "Explain C5 Ceylon Cinnamon 🌶️",
  "How to track my order? 📦",
  "Are your spices organic? 🌱"
];

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
    if (!msg.trim()) return;
    const newMsgs = [...messages, { role: 'user', text: msg }];
    setMessages(newMsgs);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('https://earthy-munchy-assistant.onrender.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      setMessages([...newMsgs, { role: 'ai', text: data.response }]);
    } catch (e) {
      setMessages([...newMsgs, { role: 'ai', text: "I apologize, I am unable to connect. Please try again or reach out to us directly." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 font-sans antialiased">

      {/* LAUNCHER */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          onClick={() => setIsOpen(true)}
          className="bg-[#1a1a1a] text-[#ccff00] p-6 rounded-[2rem] shadow-2xl border border-white/10 flex items-center gap-4"
        >
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Have a question?</span>
            <span className="text-sm font-bold text-white">Ask Earthy AI</span>
          </div>
          <MessageSquare size={24} />
        </motion.button>
      )}

      {/* CHAT WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="w-[460px] h-[750px] max-h-[85vh] bg-[#FDFBF7] rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden border border-[#D4C3A3]/30"
          >
            {/* Header */}
            <header className="bg-white px-8 py-8 border-b border-[#D4C3A3]/20 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-4">
                <div className="bg-[#1a1a1a] p-3 rounded-2xl shadow-lg">
                  <Zap size={20} className="text-[#ccff00] fill-[#ccff00]" />
                </div>
                <div>
                  <h1 className="text-[#1a1a1a] font-black text-2xl italic tracking-tighter uppercase leading-none">Earthy Munchy</h1>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-2">Authenticity Guaranteed</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="bg-gray-50 p-2 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
                <X size={20} strokeWidth={3} />
              </button>
            </header>

            {/* CHAT AREA WITH COLOR CODING */}
            <div className="flex-1 overflow-y-auto px-8 py-10 space-y-12 no-scrollbar">
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end pl-14' : 'items-start pr-14'}`}>

                  {/* Color-Coded Labels */}
                  <div className={`flex items-center gap-2 mb-3 ${msg.role === 'user' ? 'flex-row-reverse text-[#6D5E4D]' : 'text-[#8B7355]'}`}>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                      {msg.role === 'user' ? 'Member Inquiry' : 'Expert Response'}
                    </span>
                  </div>

                  {/* DISTINCTLY COLORED BUBBLES */}
                  <div className={`p-8 rounded-[2rem] leading-relaxed text-[15px] shadow-sm transition-all border ${msg.role === 'user'
                    ? 'bg-[#EAE7E0] text-[#1a1a1a] rounded-tr-none border-[#D4C3A3]/50' // Warm Neutral for User
                    : 'bg-white text-[#333] rounded-tl-none border-white shadow-[0_15px_50px_rgba(0,0,0,0.03)] font-medium' // Clean White for AI
                    }`}>
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-[#D4C3A3] text-[10px] font-black tracking-widest pl-2">
                  <span className="animate-pulse">CONSULTING SOURCES...</span>
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
                    onClick={() => handleSend(q)}
                    className="flex items-center gap-2 px-5 py-3 bg-[#F9F7F2] border border-[#D4C3A3]/50 rounded-2xl text-[11px] font-bold text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#ccff00] transition-all whitespace-nowrap active:scale-95 shadow-sm"
                  >
                    <HelpCircle size={12} />
                    {q}
                  </button>
                ))}
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative">
                <textarea
                  rows="2"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="How can we assist you today?"
                  className="w-full bg-[#F5F5F5] p-6 rounded-2xl border-2 border-transparent focus:border-[#1a1a1a] focus:bg-white outline-none transition-all text-[16px] font-medium pr-16 resize-none shadow-inner"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#1a1a1a] text-[#ccff00] p-4 rounded-xl flex items-center justify-center hover:scale-110 active:scale-90 shadow-xl transition-all">
                  <ArrowRight size={22} strokeWidth={3} />
                </button>
              </form>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;