import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Mic, Sparkles, Bot } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'jarvis';
  text: string;
  timestamp: Date;
}

interface JarvisChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const FINANCIAL_DATA = {
  mrr_month_6: '$847,000',
  year_1_revenue: '$501,000',
  ltv_cac_ratio: '9.8:1',
  seed_ask: '$1.2M'
};

export const JarvisChatPanel: React.FC<JarvisChatPanelProps> = ({
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addMessage('jarvis', "Hello! I'm JARVIS, your AI financial assistant. Ask me about our metrics, business model, or navigate the dashboard.");
    }
  }, [isOpen]);

  const addMessage = (type: 'user' | 'jarvis', text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type,
      text,
      timestamp: new Date()
    }]);
  };

  const processQuery = useCallback(async (query: string) => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const lowerQuery = query.toLowerCase();
    let response = '';
    
    if (lowerQuery.includes('mrr')) {
      response = `Month 6 MRR: ${FINANCIAL_DATA.mrr_month_6}. Driven by 34,000 leads at 9% conversion.`;
    } else if (lowerQuery.includes('ltv') || lowerQuery.includes('cac')) {
      response = `LTV:CAC ratio is ${FINANCIAL_DATA.ltv_cac_ratio}. We earn $9.80 for every $1 spent acquiring customers.`;
    } else if (lowerQuery.includes('revenue')) {
      response = `Year 1 revenue: ${FINANCIAL_DATA.year_1_revenue}. Month 12 MRR: $1.42M.`;
    } else if (lowerQuery.includes('seed')) {
      response = `Raising ${FINANCIAL_DATA.seed_ask} Seed at $6.8M pre-money. 18 months runway to profitability.`;
    } else {
      response = "I can help with: MRR projections, LTV:CAC ratio, revenue, seed round, or business model. What would you like to know?";
    }
    
    addMessage('jarvis', response);
    setIsProcessing(false);
  }, []);

  const handleSend = () => {
    if (!inputText.trim()) return;
    addMessage('user', inputText);
    processQuery(inputText);
    setInputText('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-24 right-6 w-96 h-[500px] bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl z-50 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-violet-600/20 to-cyan-600/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">JARVIS</h3>
                <p className="text-xs text-white/50">AI Financial Assistant</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-3 rounded-2xl ${
                  msg.type === 'user' 
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white' 
                    : 'bg-white/10 text-white border border-white/10'
                }`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </motion.div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
                  <div className="flex gap-1">
                    {[1,2,3].map(i => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-cyan-400 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10 bg-black/20">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about MRR, LTV:CAC, revenue..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-violet-500"
              />
              <button
                onClick={handleSend}
                className="p-2 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-xl hover:opacity-90 transition-opacity"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JarvisChatPanel;
