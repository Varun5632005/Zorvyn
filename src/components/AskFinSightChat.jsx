import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboard } from '../context/DashboardContext';
import { MessageSquare, X, Send } from 'lucide-react';

const AskFinSightChat = () => {
  const { transactions, formatCurrency, user } = useDashboard();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef(null);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: `Hi ${user?.name?.split(' ')[0] || 'there'}! I'm your FinSight assistant. Ask me anything about your data.` }
  ]);
  const endOfMessagesRef = useRef(null);
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (isOpen) inputRef.current?.focus();
  }, [messages, isTyping, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    const userMsg = { id: Date.now(), type: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const resp = input.toLowerCase().includes('biggest') 
        ? "Working on it... Your biggest expense seems to be at the top of your list!" 
        : "I'm processing your request. Try asking for specific totals!";
      setMessages(p => [...p, { id: Date.now()+1, type: 'bot', text: resp }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} style={{ position: 'fixed', bottom: '20px', right: '20px', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'white', color: 'black', border: '1px solid var(--border-color)', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', display: isOpen ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, cursor: 'pointer' }}>
        <MessageSquare size={28} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} style={{ position: 'fixed', bottom: '20px', right: 'max(20px, 5%)', width: '350px', maxWidth: '90vw', height: '500px', backgroundColor: 'var(--bg-card)', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', zIndex: 10000, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            <div style={{ background: 'linear-gradient(135deg, var(--primary), #8b5cf6)', padding: '15px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MessageSquare size={18} color="white" /><h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Ask FinSight AI</h3></div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: 'var(--bg-color)' }}>
              {messages.map(m => (
                <div key={m.id} style={{ alignSelf: m.type === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%', padding: '10px 14px', borderRadius: '15px', fontSize: '0.85rem', background: m.type === 'user' ? 'var(--primary)' : 'var(--bg-card)', color: m.type === 'user' ? 'white' : 'var(--text-main)', border: m.type === 'user' ? 'none' : '1px solid var(--border-color)' }}>{m.text}</div>
              ))}
              {isTyping && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Typing...</div>}
              <div ref={endOfMessagesRef} />
            </div>
            <form onSubmit={handleSend} style={{ padding: '15px', display: 'flex', gap: '10px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
              <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message..." style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none' }} />
              <button disabled={!input.trim()} style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '10px', padding: '0 15px', cursor: 'pointer' }}><Send size={18} /></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
export default AskFinSightChat;
