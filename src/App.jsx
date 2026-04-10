import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Zap, ArrowRight, MessageCircle, X, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CHIPS = ["NMR Tested? 🍯", "C5 Cinnamon 🌶️", "Support 📱"];

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Namaste! 🙏 Earthy Munchy vibes here. How can I help you today?" }
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
      setMessages([...newMessages, { role: 'ai', text: "Server ghosted us. Try again? 💀" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans selection:bg-[#ccff00] selection:text-black">

      {/* 1. CHAT LAUNCHER BUTTON */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 45 }}
            onClick={() => setIsOpen(true)}
            className="bg-[#ccff00] p-4 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-2 border-black flex items-center justify-center text-black group"
          >
            <div className="absolute -top-2 -right-2 bg-red-500 w-5 h-5 rounded-full border-2 border-black animate-bounce" />
            <MessageCircle size={28} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 2. CHAT WINDOW (Mobile Size) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="w-[380px] h-[600px] max-h-[85vh] bg-[#0a0a0a] rounded-[2.5rem] border-2 border-white/10 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header - Fixed */}
            <header className="bg-[#ccff00] p-4 flex justify-between items-center border-b-4 border-black">
              <div className="flex items-center gap-3">
                <div className="bg-black p-1.5 rounded-lg">
                  <Zap size={18} className="text-[#ccff00] fill-[#ccff00]" />
                </div>
                <div>
                  <h1 className="text-black font-black text-lg tracking-tight leading-none">EARTHY MUNCHY</h1>
                  <span className="text-black/60 text-[9px] font-bold uppercase tracking-wider">Online • Pure Vibes</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-black hover:bg-black/10 p-1 rounded-lg transition-colors">
                <X size={24} strokeWidth={3} />
              </button>
            </header>

            {/* Chat Area - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar bg-[#0f0f0f]">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`p-4 max-w-[85%] text-sm font-medium ${msg.role === 'user'
                    ? 'bg-[#ccff00] text-black rounded-2xl rounded-tr-none shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)] border border-black'
                    : 'bg-[#1a1a1a] text-gray-200 rounded-2xl rounded-tl-none border border-white/5'
                    }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isLoading && <div className="text-[#ccff00] text-[10px] font-black tracking-widest animate-pulse">REASONING...</div>}
              <div ref={scrollRef} />
            </div>

            {/* Input & Chips - Fixed Bottom */}
            <div className="p-4 bg-[#121212] border-t border-white/5">
              <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3">
                {CHIPS.map((chip, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(chip)}
                    className="px-3 py-1.5 bg-white/5 hover:bg-[#ccff00] hover:text-black rounded-full border border-white/10 text-[9px] font-black uppercase tracking-wider transition-all whitespace-nowrap"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything..."
                  className="w-full bg-[#1a1a1a] p-4 rounded-xl border border-white/10 focus:border-[#ccff00] outline-none transition-all pr-12 text-sm"
                />
                <button className="absolute right-2 top-2 bottom-2 px-3 bg-[#ccff00] text-black rounded-lg hover:scale-105 active:scale-95 transition-all">
                  <ArrowRight size={18} strokeWidth={3} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;