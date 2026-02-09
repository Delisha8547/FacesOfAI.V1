import FaceyLogo from "@/components/FaceyLogo";
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Creator from './components/Creator';
import ChatSession from './components/ChatSession';
import { AIPersona, User } from './types';
import { db } from './services/db';
import { Icons } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'dashboard' | 'creator' | 'chat' | 'about'>('dashboard');
  const [personas, setPersonas] = useState<AIPersona[]>([]);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);
  const [loginForm, setLoginForm] = useState({ name: '', email: '' });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);

  useEffect(() => {
    const activeUser = db.getActiveUser();
    if (activeUser) {
      setUser(activeUser);
      setPersonas(db.getUserPersonas(activeUser.email));
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.name && loginForm.email) {
      setIsLoggingIn(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newUser = { ...loginForm };
      db.saveUser(newUser);
      setUser(newUser);
      setPersonas(db.getUserPersonas(newUser.email));
      setIsLoggingIn(false);
      setShowWelcomeMessage(true);
    }
  };

  const handleLogout = () => {
    db.logout();
    setUser(null);
    setPersonas([]);
    setView('dashboard');
  };

  const handleCreateComplete = (newPersona: AIPersona) => {
    db.savePersona(newPersona);
    setPersonas(db.getUserPersonas(user!.email));
    setSelectedPersonaId(newPersona.id);
    setView('chat');
  };

  const handleDeletePersona = (id: string) => {
    db.deletePersona(id);
    setPersonas(db.getUserPersonas(user!.email));
    if (selectedPersonaId === id) {
      setSelectedPersonaId(null);
      setView('dashboard');
    }
  };

  const handleUpdateKnowledge = (personaId: string, newFact: string) => {
    db.updatePersonaKnowledge(personaId, newFact);
    setPersonas(db.getUserPersonas(user!.email));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
          {isLoggingIn && (
            <div className="absolute inset-0 bg-slate-900/95 z-50 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
              <p className="text-white font-bold tracking-tight mb-2">Securing Authorization...</p>
              <p className="text-slate-400 text-xs animate-pulse uppercase tracking-widest">Opening AI Library...</p>
            </div>
          )}
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-600/20">
              <FaceyLogo className="w-15 h-15" />
            </div>
            <h1 className="text-3xl font-bold text-white font-heading tracking-tight">FacesOfAI</h1>
            <p className="text-slate-500 mt-2 text-center text-sm">Personal AI Assistant Platform</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Full Name</label>
              <input 
                type="text" 
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-600/50 outline-none transition-all"
                value={loginForm.name}
                onChange={e => setLoginForm({...loginForm, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Email Identity</label>
              <input 
                type="email" 
                required
                placeholder="Connect to your projects"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-600/50 outline-none transition-all placeholder:text-slate-700"
                value={loginForm.email}
                onChange={e => setLoginForm({...loginForm, email: e.target.value})}
              />
            </div>
            <button 
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50"
            >
              Unlock My Library
            </button>
          </form>
          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <p className="text-[9px] text-slate-600 uppercase tracking-widest">Safe, Secure & Always Accessible</p>
          </div>
        </div>
      </div>
    );
  }

  const selectedPersona = personas.find(p => p.id === selectedPersonaId) || null;

  return (
    <Layout activeView={view} onNavigate={(v) => {
      setView(v);
      if (v !== 'chat') setSelectedPersonaId(null);
    }}>
      {showWelcomeMessage && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(79,70,229,0.2)]">
            <div className="bg-slate-800/80 px-8 py-4 border-b border-slate-700 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">FA</div>
                <div className="text-left">
                  <p className="text-white text-xs font-bold leading-none">FacesOfAI System</p>
                  <p className="text-slate-500 text-[10px] uppercase tracking-tighter font-bold">Authorized</p>
                </div>
              </div>
            </div>
            <div className="p-10 space-y-6 text-center">
              <h2 className="text-2xl font-bold text-white font-heading">Welcome, {user.name}</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Your AI assistants for <span className="text-indigo-400 font-mono">{user.email}</span> are synchronized and ready for training.
              </p>
              <button 
                onClick={() => setShowWelcomeMessage(false)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-12 py-3 rounded-xl font-bold transition-all shadow-xl shadow-indigo-600/20"
              >
                Access Library
              </button>
            </div>
          </div>
        </div>
      )}

      {view === 'dashboard' && (
        <Dashboard 
          personas={personas} 
          onSelect={(p) => { setSelectedPersonaId(p.id); setView('chat'); }} 
          onDelete={handleDeletePersona}
          onNew={() => setView('creator')} 
        />
      )}
      {view === 'creator' && (
        <Creator 
          onComplete={handleCreateComplete} 
          onCancel={() => setView('dashboard')} 
          user={user}
        />
      )}
      {view === 'chat' && selectedPersona && (
        <ChatSession 
          persona={selectedPersona} 
          onBack={() => setView('dashboard')}
          onUpdateKnowledge={(fact) => handleUpdateKnowledge(selectedPersona.id, fact)}
        />
      )}
      {view === 'about' && (
        <div className="p-8 h-full overflow-y-auto pb-20">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-white mb-4 tracking-tight font-heading">The Vision Behind FacesOfAI</h1>
              <div className="h-1 w-24 bg-indigo-600 mx-auto rounded-full mb-8"></div>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-12 shadow-2xl space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center text-indigo-400"><FaceyLogo className="w-8 h-8" />
</div>
                  Our Mission
                </h2>
                <p className="text-slate-400 leading-relaxed text-lg">
                  FacesOfAI is not just another chatbot builder. It's a platform designed to democratize artificial intelligence. We believe that everyone—regardless of their technical background—should be able to create, train, and own a digital assistant that represents their unique knowledge and personality.
                </p>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800">
                  <h3 className="text-white font-bold mb-3">Founder & Architect</h3>
                  <p className="text-indigo-400 font-bold text-xl mb-4">Delisha Blessy Dinesh</p>
                  <p className="text-slate-500 text-sm">
                    Architected with a focus on simplicity and powerful customization. Delisha's vision is to bridge the gap between complex AI engines and everyday human expertise.
                  </p>
                </div>
                <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800">
                  <h3 className="text-white font-bold mb-3">Privacy & Ownership</h3>
                  <p className="text-slate-500 text-sm">
                    All your AI data is stored securely in your browser's persistent storage. When you download your chatbot, the knowledge stays with you, baked into a standalone file that requires zero cloud dependencies.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Future Roadmap</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold mt-1">✓</div>
                    <div>
                      <p className="text-white font-bold">Personalized Knowledge Training</p>
                      <p className="text-slate-500 text-sm italic">Status: Available Now</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold mt-1">!</div>
                    <div>
                      <p className="text-white font-bold">NLP & Document Processing</p>
                      <p className="text-slate-500 text-sm">Upload PDFs and spreadsheets to teach your AI instantly.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold mt-1">!</div>
                    <div>
                      <p className="text-white font-bold">Visual Intelligence</p>
                      <p className="text-slate-500 text-sm">Teach your AI to recognize products, places, and faces using computer vision.</p>
                    </div>
                  </div>
                </div>
              </section>

              <div className="pt-8 border-t border-slate-800 flex justify-between items-center">
                <button onClick={handleLogout} className="text-red-400 hover:text-red-300 font-bold uppercase text-[10px] tracking-[0.2em] border border-red-500/20 px-6 py-3 rounded-xl transition-colors">Sign Out Permanently</button>
                <button onClick={() => setView('dashboard')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-xl shadow-indigo-600/20">Back to Projects</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
