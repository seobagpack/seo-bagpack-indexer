import React, { ReactNode } from 'react';
import { LayoutDashboard, Send, Settings, BookOpen, LogOut, Package2 } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  activeTab: 'submit' | 'dashboard';
  setActiveTab: (tab: 'submit' | 'dashboard') => void;
  onLogout: () => void;
}

export function Layout({ children, activeTab, setActiveTab, onLogout }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <Package2 className="w-6 h-6 text-indigo-600 mr-2" />
          <span className="font-bold text-lg text-slate-800 tracking-tight">SEO Bagpack</span>
        </div>
        
        <nav className="flex-1 p-4 text-sm font-medium">
          <p className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-2">Indexer</p>
          <button 
             onClick={() => setActiveTab('submit')}
             className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'submit' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>
            <Send className="w-4 h-4 mr-3" />
            Submit URLs
          </button>
          <button 
             onClick={() => setActiveTab('dashboard')}
             className={`w-full flex items-center px-3 py-2.5 rounded-lg mt-1 transition-colors ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'}`}>
            <LayoutDashboard className="w-4 h-4 mr-3" />
            Live Dashboard
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
           <button onClick={onLogout} className="flex w-full items-center px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            <LogOut className="w-4 h-4 mr-3" />
             Exit
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden pb-16 md:pb-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8 shrink-0">
          <h1 className="text-xl font-semibold text-slate-800">
            {activeTab === 'submit' ? 'Submit URLs for Indexing' : 'Indexing Dashboard'}
          </h1>
          <div className="flex items-center space-x-4">
             <div className="flex items-center px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                Bot Simulation
             </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] z-10">
         <button 
             onClick={() => setActiveTab('submit')}
             className={`flex-1 flex flex-col items-center justify-center py-3 text-xs font-medium ${activeTab === 'submit' ? 'text-indigo-600' : 'text-slate-500'}`}>
            <Send className="w-5 h-5 mb-1" />
            Submit
          </button>
          <button 
             onClick={() => setActiveTab('dashboard')}
             className={`flex-1 flex flex-col items-center justify-center py-3 text-xs font-medium ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-500'}`}>
            <LayoutDashboard className="w-5 h-5 mb-1" />
            Dashboard
          </button>
      </div>
    </div>
  );
}
