import React from 'react';
import { Podcast } from 'lucide-react';

export function PodcastsView() {
  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Podcasts</h1>
          <p className="text-slate-500 text-sm mt-1">Listen and subscribe to podcasts.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20">
          Add Podcast
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl bg-white/50 p-8">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
          <Podcast size={32} className="text-blue-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">No podcasts added</h3>
        <p className="text-slate-500 mt-2 max-w-md text-center">Find a podcast to follow.</p>
      </div>
    </div>
  );
}
