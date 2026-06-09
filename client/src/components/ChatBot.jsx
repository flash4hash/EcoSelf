import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Leaf } from 'lucide-react';

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am EcoBot. Ask me anything about carbon footprints, food emissions, or eco-friendly habits in India!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const drawerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when drawer opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Focus Trapping Logic
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;

      const focusableElements = drawerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      // Gather history (last 3 turns)
      // Filter out system greetings or empty roles if any, mapping to `{ sender, text }`
      const history = messages
        .slice(1, -0 || undefined).slice(-6); // exclude index 0 (greeting), take last 6

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMsg,
          history: history
        })
      });

      if (!response.ok) {
        throw new Error('Server error');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { sender: 'bot', text: "I'm having a connection issue. Please try again soon! Meanwhile, remember that choosing public transport saves around 40 kg CO2e monthly." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open EcoBot Assistant"
          className="w-14 h-14 bg-[#2D6A4F] hover:bg-[#1B4332] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#74C69D]"
        >
          <Leaf className="w-6 h-6 animate-pulse" />
        </button>
      )}

      {/* Chat Drawer Drawer */}
      {isOpen && (
        <div 
          ref={drawerRef}
          role="dialog"
          aria-label="EcoBot Chatbot"
          className="w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden transition-all duration-300 transform scale-100"
        >
          {/* Header */}
          <div className="bg-[#2D6A4F] p-4 flex items-center justify-between text-white">
            <div className="flex items-center space-x-2">
              <Leaf className="w-5 h-5 text-[#74C69D]" />
              <div>
                <h2 className="font-bold text-sm">EcoBot Assistant</h2>
                <span className="text-xs text-[#74C69D] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#74C69D] rounded-full animate-ping"></span> Online
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close EcoBot Chatbot"
              className="text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-55">
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                    m.sender === 'user'
                      ? 'bg-[#2D6A4F] text-white rounded-tr-none'
                      : 'bg-gray-100 text-[#1B2A1E] rounded-tl-none border border-gray-200'
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 border border-gray-200 text-gray-500 rounded-2xl rounded-tl-none px-4 py-2 text-sm flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form 
            onSubmit={handleSend} 
            className="p-3 border-t border-gray-200 bg-white flex items-center space-x-2"
          >
            <label htmlFor="ecobot-chat-input" className="sr-only">Type a message to EcoBot</label>
            <input
              id="ecobot-chat-input"
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about emissions or tips..."
              className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
            />
            <button
              type="submit"
              aria-label="Send Message"
              className="p-2 bg-[#2D6A4F] hover:bg-[#1B4332] text-white rounded-xl transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ChatBot;
