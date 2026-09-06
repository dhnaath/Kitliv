import React from 'react';
import { Droplet } from 'lucide-react';
import { HabitTracker } from '../wira/components/HabitTracker';

export default function App() {
  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#1C1C1C] font-sans selection:bg-[#1C1C1C] selection:text-[#F4F1EA] pb-16">
      {/* Header */}
      <header className="bg-[#F4F1EA] sticky top-0 z-20">
        <div className="border-b-2 border-[#1C1C1C]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-60 mb-2">Kesehatan</span>
              <div className="flex items-center gap-3">
                <Droplet className="w-8 h-8 text-blue-500" />
                <h1 className="text-4xl md:text-5xl font-serif tracking-tighter leading-none text-[#1C1C1C]">
                  Water Tracker
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8 max-w-lg">
        <HabitTracker />

        <footer className="mt-12 pt-6 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">
          <div>© 2024 Water Tracker</div>
          <div>Kesehatan & Produktivitas</div>
        </footer>
      </main>
    </div>
  );
}
