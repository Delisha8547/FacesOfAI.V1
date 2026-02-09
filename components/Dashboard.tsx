
import React from 'react';
import { AIPersona } from '../types';
import { Icons } from '../constants';
import FaceyLogo from "@/components/FaceyLogo";
interface DashboardProps {
  personas: AIPersona[];
  onSelect: (persona: AIPersona) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ personas, onSelect, onDelete, onNew }) => {
  return (
    <div className="p-8 h-full overflow-y-auto pb-20">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 font-heading tracking-tight">AI Assistant Library</h1>
          <p className="text-slate-500 text-sm font-medium">You have {personas.length} personalized AI projects active.</p>
        </div>
        <button 
          onClick={onNew}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-bold flex items-center space-x-3 shadow-xl transition-all transform hover:scale-105"
        >
          <Icons.Plus />
          <span>Create New AI</span>
        </button>
      </header>

      {personas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 bg-slate-900/40 border border-slate-800/50 rounded-[3rem]">
          <div className="w-20 h-20 bg-slate-800/50 rounded-3xl flex items-center justify-center mb-6 text-slate-700">
            <FaceyLogo className="w-8 h-8" />

          </div>
          <h3 className="text-xl font-bold text-slate-300">Start Your First AI Journey</h3>
          <p className="text-slate-500 mt-2 text-center max-w-sm px-6 text-sm leading-relaxed">
            Create an AI that knows your business, your hobby, or your personality. Teach it facts and deploy it in seconds.
          </p>
          <button 
            onClick={onNew}
            className="mt-8 text-indigo-400 hover:text-indigo-300 font-bold tracking-[0.2em] uppercase text-[10px]"
          >
            Create Your First Assistant &rarr;
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {personas.map((p) => (
            <div 
              key={p.id}
              onClick={() => onSelect(p)}
              className="group bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 cursor-pointer hover:border-indigo-500/50 hover:bg-slate-800/40 transition-all duration-300 shadow-2xl relative overflow-hidden flex flex-col h-full"
            >
              <div className="flex-1">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                   <FaceyLogo className="w-8 h-8" />

                </div>

                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-700 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all font-mono font-bold">
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors font-heading">{p.name}</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{p.character} Personality</p>
                  </div>
                </div>

                <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.1em] mb-6">{p.role}</p>
              </div>
              
              <div className="flex items-center justify-between pt-6 border-t border-slate-800/50 mt-auto">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{p.knowledgeBase.length} Taught Facts</span>
                </div>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // VERY IMPORTANT: Prevent opening chat
                      if(window.confirm(`Permanently delete ${p.name}? This cannot be undone.`)) {
                        onDelete(p.id);
                      }
                    }}
                    className="z-20 p-3 bg-slate-800 hover:bg-red-600/20 text-slate-500 hover:text-red-500 rounded-xl transition-all border border-transparent hover:border-red-500/20"
                    title="Delete Project"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
                  <button 
                    className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg shadow-indigo-600/20"
                  >
                     <Icons.Send />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
