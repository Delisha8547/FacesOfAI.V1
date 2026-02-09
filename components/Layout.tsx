
import React, { useState } from 'react';
import { Icons } from '../constants';
import FaceyLogo from "@/components/FaceyLogo";

interface LayoutProps {
  children: React.ReactNode;
  activeView: 'dashboard' | 'creator' | 'chat' | 'about';
  onNavigate: (view: 'dashboard' | 'creator' | 'chat' | 'about') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onNavigate }) => {
  const [showFacey, setShowFacey] = useState(false);
  const [faceyChat, setFaceyChat] = useState<{q: string, a: string}[]>([]);
  const [faceyInput, setFaceyInput] = useState('');

  const handleUpgrade = () => {
    alert("Pro Tier: We are currently working on advanced Image Processing and NLP (Natural Language Processing) capabilities. You will soon be able to teach your AI using documents and images. Stay tuned for the update!");
  };

  const askFacey = () => {
    if (!faceyInput.trim()) return;
    const q = faceyInput.toLowerCase();
    let a = "I'm still learning about FacesOfAI! You can ask me how to create an AI, or how to download your chatbot.";
    
    if (q.includes('founder') || q.includes('who created') || q.includes('delisha')) {
      a = "FacesOfAI was founded and architected by the visionary Delisha Blessy Dinesh!";
    } else if (q.includes('how to') || q.includes('create')) {
      a = "Simply click 'Create New AI' on your dashboard. Give it a name, a role, and choose its personality!";
    } else if (q.includes('deploy') || q.includes('download')) {
      a = "In the 'Deploy' tab of your AI assistant, you can download a standalone webpage. It works everywhere!";
    } else if (q.includes('price') || q.includes('cost')) {
      a = "FacesOfAI is currently free! We're building a Pro tier for high-performance needs like Image Processing.";
    }

    setFaceyChat([...faceyChat, { q: faceyInput, a }]);
    setFaceyInput('');
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900 flex flex-col hidden md:flex">
        <div className="p-6">
          <div onClick={() => onNavigate('dashboard')} className="flex items-center space-x-2 cursor-pointer">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <FaceyLogo className="w-8 h-8" />

            </div>
            <span className="text-xl font-bold tracking-tight text-white font-heading">FacesOfAI</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <button 
            onClick={() => onNavigate('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeView === 'dashboard' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
          >
            <Icons.Layers />
            <span className="font-medium">My AI Projects</span>
          </button>
          <button 
            onClick={() => onNavigate('creator')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeView === 'creator' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
          >
            <Icons.Plus />
            <span className="font-medium">Create New AI</span>
          </button>
          <button 
            onClick={() => onNavigate('about')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeView === 'about' ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
          >
            <Icons.Info />
            <span className="font-medium">About </span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="p-4 bg-slate-800/50 rounded-xl">
            <p className="text-xs text-slate-500 mb-2 uppercase font-bold tracking-wider">Plan Status</p>
            <p className="text-sm text-slate-200 font-medium">Free Tier</p>
            <button 
              onClick={handleUpgrade}
              className="mt-3 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20"
            >
              Unlock Pro
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        {children}
      </main>

      {/* Facey Chatbot UI */}
      <div className="fixed bottom-6 right-6 z-[100]">
        {showFacey && (
          <div className="absolute bottom-20 right-0 w-80 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-indigo-600 p-4 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <FaceyLogo className="w-8 h-8" />
              </div>
              <div>
                <p className="text-white text-sm font-bold">Facey </p>
                <p className="text-indigo-200 text-[10px] uppercase font-bold tracking-tighter">Online</p>
              </div>
            </div>
            <div className="h-64 overflow-y-auto p-4 space-y-4 bg-slate-950/50">
              <div className="bg-slate-800 text-slate-200 p-3 rounded-2xl rounded-tl-none text-xs">
                Hi! I'm Facey. I can answer questions about the platform !
              </div>
              {faceyChat.map((chat, idx) => (
                <React.Fragment key={idx}>
                  <div className="flex justify-end">
                    <div className="bg-indigo-600 text-white p-3 rounded-2xl rounded-tr-none text-xs max-w-[80%]">
                      {chat.q}
                    </div>
                  </div>
                  <div className="bg-slate-800 text-slate-200 p-3 rounded-2xl rounded-tl-none text-xs max-w-[80%]">
                    {chat.a}
                  </div>
                </React.Fragment>
              ))}
            </div>
            <div className="p-3 border-t border-slate-800 bg-slate-900 flex space-x-2">
              <input 
                type="text" 
                value={faceyInput}
                onChange={e => setFaceyInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && askFacey()}
                placeholder="Ask Facey..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <button onClick={askFacey} className="bg-indigo-600 p-2 rounded-xl text-white">
                <Icons.Send />
              </button>
            </div>
          </div>
        )}
        <button 
          onClick={() => setShowFacey(!showFacey)}
          className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-2xl"
        >
         <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center overflow-hidden">
  <FaceyLogo className="w-12 h-12" />
</div>




        </button>
      </div>
    </div>
  );
};

export default Layout;
