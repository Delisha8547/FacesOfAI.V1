
import React, { useState, useRef, useEffect } from 'react';
import { AIPersona, ChatMessage } from '../types';
import { Icons } from '../constants';
import { geminiService } from '../services/geminiService';

interface ChatSessionProps {
  persona: AIPersona;
  onBack: () => void;
  onUpdateKnowledge: (fact: string) => void;
}

// Fix: Corrected component structure and string escaping to ensure valid React element return
const ChatSession: React.FC<ChatSessionProps> = ({ persona, onBack, onUpdateKnowledge }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'deploy'>('chat');
  const [mode, setMode] = useState<'probe' | 'teach'>('teach');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ 
        role: 'assistant', 
        content: persona.knowledgeBase.length === 0 
          ? `Hello! I am ${persona.name}. My knowledge is currently empty. Use TEACH mode to tell me some facts!` 
          : `Hello! I'm ready. I have ${persona.knowledgeBase.length} facts in my memory. How can I help?` 
      }]);
    }
  }, [persona.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');

    if (mode === 'teach') {
      setIsTyping(true);
      setTimeout(() => {
        onUpdateKnowledge(currentInput);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `New fact learned: "${currentInput}". I'll remember this forever.` 
        }]);
        setIsTyping(false);
      }, 600);
    } else {
      setIsTyping(true);
      try {
        const response = await geminiService.chat(persona, messages, currentInput);
        setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      } catch (err) {
        setMessages(prev => [...prev, { role: 'assistant', content: "My connection is a bit unstable. Please try again." }]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const downloadChatbot = () => {
    // Fix: Escaping backticks and interpolation inside nested template literals correctly
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${persona.name} Chatbot</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background: #0f172a; color: #f8fafc; font-family: sans-serif; }
    </style>
</head>
<body class="flex items-center justify-center min-h-screen p-4">
    <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col h-[600px] overflow-hidden">
        <header class="bg-indigo-600 p-6 flex items-center space-x-4">
            <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center font-bold text-white text-xl uppercase">${persona.name.charAt(0)}</div>
            <div>
                <h1 class="text-white font-bold text-lg">${persona.name}</h1>
                <p class="text-indigo-200 text-xs font-bold uppercase tracking-tighter">${persona.role}</p>
            </div>
        </header>
        <div id="chat-box" class="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth">
            <div class="bg-slate-800 text-slate-100 p-4 rounded-2xl rounded-tl-none text-sm shadow-sm">
                Hi! I am your personalized assistant. Ask me anything I've been taught!
            </div>
        </div>
        <div class="p-4 bg-slate-900 border-t border-slate-800 flex space-x-2">
            <input id="user-input" type="text" placeholder="Ask a question..." class="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500">
            <button id="send-btn" class="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-500 transition-colors">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </button>
        </div>
    </div>

    <script>
        const chatBox = document.getElementById('chat-box');
        const userInput = document.getElementById('user-input');
        const sendBtn = document.getElementById('send-btn');
        const knowledge = ${JSON.stringify(persona.knowledgeBase)};

        function appendMessage(role, text) {
            const div = document.createElement('div');
            div.className = \`flex \${role === 'user' ? 'justify-end' : 'justify-start'}\`;
            div.innerHTML = \`<div class="max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-md \${role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'}">\${text}</div>\`;
            chatBox.appendChild(div);
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        function findBestMatch(query) {
            const queryWords = query.toLowerCase().split(/\\W+/).filter(w => w.length > 2);
            if (queryWords.length === 0) return null;

            let bestMatch = null;
            let highestScore = 0;

            knowledge.forEach(fact => {
                let score = 0;
                const factLower = fact.toLowerCase();
                
                // Direct phrase match is best
                if (factLower.includes(query.toLowerCase())) score += 10;
                
                // Keyword overlap
                queryWords.forEach(word => {
                    if (factLower.includes(word)) score += 2;
                });

                if (score > highestScore) {
                    highestScore = score;
                    bestMatch = fact;
                }
            });

            return highestScore > 1 ? bestMatch : null;
        }

        sendBtn.addEventListener('click', () => {
            const val = userInput.value.trim();
            if (!val) return;
            appendMessage('user', val);
            userInput.value = '';

            setTimeout(() => {
                const match = findBestMatch(val);
                const response = match || "I haven't been taught that specific information yet.";
                appendMessage('assistant', response);
            }, 600);
        });

        userInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') sendBtn.click(); });
    </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // Fix: Corrected regex and template literal syntax outside of string literals
    a.download = `${persona.name.replace(/\s+/g, '_')}_Chatbot.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden">
      <header className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/20 font-mono">
            {persona.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-white font-bold tracking-tight font-heading">{persona.name}</h2>
            <div className="flex items-center space-x-2">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-indicator shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
               <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-[0.1em]">
                 Assistant Online
               </span>
            </div>
          </div>
        </div>

        <div className="flex bg-slate-800/50 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'chat' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
          >
            TRAINING
          </button>
          <button 
            onClick={() => setActiveTab('deploy')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'deploy' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
          >
            DEPLOY
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'chat' && (
          <div className="flex flex-col h-full">
            <div className="bg-slate-900/40 px-6 py-3 border-b border-slate-800/50 flex items-center justify-center space-x-4">
              <button 
                onClick={() => setMode('teach')}
                className={`flex items-center space-x-2 px-6 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${mode === 'teach' ? 'bg-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]' : 'bg-slate-800 text-slate-500'}`}
              >
                <div className={`w-2 h-2 rounded-full ${mode === 'teach' ? 'bg-white animate-pulse' : 'bg-slate-600'}`}></div>
                <span>TEACH MODE</span>
              </button>
              <button 
                onClick={() => setMode('probe')}
                className={`flex items-center space-x-2 px-6 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${mode === 'probe' ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-slate-800 text-slate-500'}`}
              >
                <div className={`w-2 h-2 rounded-full ${mode === 'probe' ? 'bg-white animate-pulse' : 'bg-slate-600'}`}></div>
                <span>TEST MODE</span>
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto space-y-8">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-[1.5rem] px-6 py-4 shadow-xl ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-900 text-slate-100 rounded-tl-none border border-slate-800'}`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-900 text-slate-100 rounded-2xl px-6 py-4 rounded-tl-none border border-slate-800 shadow-lg">
                    <div className="flex items-center space-x-3 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                      AI is thinking...
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className={`p-8 border-t border-slate-800 transition-colors duration-500 ${mode === 'teach' ? 'bg-violet-900/10' : 'bg-slate-900/50'}`}>
              <div className="relative max-w-4xl mx-auto">
                <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder={mode === 'teach' ? "Teach a new fact..." : "Test your AI with a question..."}
                  className={`w-full bg-slate-800 border rounded-2xl pl-6 pr-14 py-5 text-white placeholder-slate-600 focus:outline-none transition-all font-mono text-sm ${mode === 'teach' ? 'border-violet-500/40 ring-2 ring-violet-500/10' : 'border-slate-700 focus:border-emerald-500/40'}`}
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl transition-all shadow-lg ${mode === 'teach' ? 'bg-violet-600 hover:bg-violet-500 shadow-violet-600/20' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'} text-white disabled:bg-slate-700`}
                >
                  <Icons.Send />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'deploy' && (
          <div className="p-10 max-w-4xl mx-auto space-y-10 overflow-y-auto h-full pb-20 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-indigo-600/20 border border-indigo-500/30 rounded-3xl flex items-center justify-center text-indigo-400 mb-6 shadow-[0_0_30px_rgba(79,70,229,0.2)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-white mb-4 tracking-tight font-heading">Deploy Your AI Standalone</h3>
              <p className="text-slate-500 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                Download your AI assistant as a complete, styled HTML file. It includes your taught facts and works without any server. Just open it in your browser!
              </p>
              <button 
                onClick={downloadChatbot}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-12 py-5 rounded-[2rem] font-bold text-lg shadow-2xl shadow-indigo-600/40 transition-all transform hover:scale-105 flex items-center space-x-4 mx-auto group"
              >
                <span>Download My Assistant Webpage</span>
                <div className="group-hover:translate-y-1 transition-transform">
                  <Icons.Send />
                </div>
              </button>
            </div>
            <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
              <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl text-left hover:bg-slate-800/50 transition-colors">
                <p className="text-white font-bold mb-2">Instant Setup</p>
                <p className="text-slate-500 text-xs">No coding or hosting required. Just download and run.</p>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl text-left hover:bg-slate-800/50 transition-colors">
                <p className="text-white font-bold mb-2">Modern UI</p>
                <p className="text-slate-500 text-xs">Features a sleek, dark-themed chat interface built for desktop and mobile.</p>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl text-left hover:bg-slate-800/50 transition-colors">
                <p className="text-white font-bold mb-2">Built-in Intelligence</p>
                <p className="text-slate-500 text-xs">Includes a smart matching engine to find the right facts based on questions.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSession;
