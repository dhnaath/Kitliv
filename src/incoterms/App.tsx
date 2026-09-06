import React, { useState, useMemo } from 'react';
import { Search, Navigation } from 'lucide-react';
import { incotermData } from './data';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return incotermData;
    const lowerSearch = searchTerm.toLowerCase();
    
    return incotermData.map(group => {
      const filteredTerms = group.terms.filter(term => 
        term.code.toLowerCase().includes(lowerSearch) ||
        term.name.toLowerCase().includes(lowerSearch) ||
        term.description.toLowerCase().includes(lowerSearch)
      );
      
      return { ...group, terms: filteredTerms };
    }).filter(group => group.terms.length > 0 || group.title.toLowerCase().includes(lowerSearch) || group.subtitle.toLowerCase().includes(lowerSearch));
  }, [searchTerm]);

  return (
    <div className="h-full w-full flex flex-col bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Header Section */}
      <header className="h-16 flex flex-shrink-0 items-center justify-between px-6 md:px-8 bg-slate-900 text-white shadow-md z-10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-bold italic">I</div>
          <h1 className="text-lg md:text-xl font-bold tracking-tight hidden sm:block">Panduan Incoterms® 2020</h1>
        </div>
        
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Cari kode (mis. FOB) atau deskripsi..."
              className="block w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-md text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-slate-900 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="hidden lg:flex space-x-4 text-xs font-medium uppercase tracking-widest opacity-80">
          <span>International Chamber of Commerce</span>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar: Groupings */}
        <aside className="w-64 bg-slate-100 border-r border-slate-200 p-6 hidden md:flex flex-col space-y-4 overflow-y-auto shrink-0">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Kategori</h2>
          
          <div className="space-y-2">
            {incotermData.map((group) => {
              const colorClass = 
                group.id === 'E' ? 'text-blue-600' :
                group.id === 'F' ? 'text-emerald-600' :
                group.id === 'C' ? 'text-amber-600' :
                'text-rose-600';
              
              const groupDesc = 
                group.id === 'E' ? 'Penjual menyediakan barang di lokasi mereka sendiri.' :
                group.id === 'F' ? 'Penjual menyerahkan barang ke pengangkut yang ditunjuk pembeli.' :
                group.id === 'C' ? 'Penjual mengontrak pengangkutan tanpa menanggung risiko kehilangan.' :
                'Penjual menanggung semua biaya dan risiko ke tujuan.';

              return (
                <div key={group.id} className="p-3 bg-white border border-slate-300 rounded-lg shadow-sm">
                  <span className={`text-xs font-bold ${colorClass} block mb-1`}>{group.title}: {group.subtitle}</span>
                  <p className="text-[10px] leading-relaxed text-slate-600">{groupDesc}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-auto pt-4">
            <div className="p-4 rounded-lg bg-slate-800 text-white">
              <p className="text-[11px] font-medium opacity-70">Legend:</p>
              <div className="flex items-center space-x-2 mt-2 text-[10px]">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                <span>Tanggung Jawab Pembeli</span>
              </div>
              <div className="flex items-center space-x-2 mt-1 text-[10px]">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                <span>Tanggung Jawab Penjual</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Grid */}
        <main className="flex-1 p-6 overflow-y-auto">
          {filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Navigation className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">Tidak ada hasil ditemukan</h3>
              <p className="text-slate-500 text-sm">Kami tidak dapat menemukan istilah yang cocok dengan "{searchTerm}".</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-6 px-6 py-2.5 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors text-sm"
              >
                Reset Pencarian
              </button>
            </div>
          ) : (
            <div className="space-y-8 max-w-6xl mx-auto">
              {filteredData.map((group) => (
                <section key={group.id} className="scroll-mt-6" id={`group-${group.id}`}>
                  {/* Group Header */}
                  <div className="mb-4 flex items-center border-b border-slate-200 pb-2">
                    <h2 className="text-lg font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
                      {group.title} <span className="text-slate-400 font-medium text-sm ml-1">— {group.subtitle}</span>
                    </h2>
                  </div>

                  {/* Terms Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {group.terms.map((term) => {
                      const badgeColor = 
                        group.id === 'E' ? 'bg-blue-100 text-blue-700' :
                        group.id === 'F' ? 'bg-emerald-100 text-emerald-700' :
                        group.id === 'C' ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700';
                        
                      const borderColor = 
                        group.id === 'E' ? 'border-l-blue-500' :
                        group.id === 'F' ? 'border-l-emerald-500' :
                        group.id === 'C' ? 'border-l-amber-500' :
                        'border-l-rose-500';

                      return (
                        <div 
                          key={term.code}
                          className={`bg-white p-4 border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 transition-colors flex flex-col border-l-4 ${borderColor}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className={`px-2 py-0.5 ${badgeColor} text-[10px] font-bold rounded uppercase`}>
                              {term.code}
                            </span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase">
                              Group {group.id}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-slate-800 leading-tight">
                            {term.name}
                          </h3>
                          <p className="text-[11px] text-slate-500 mt-2 flex-grow">
                            {term.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Footer Bar */}
      <footer className="h-10 bg-slate-200 border-t border-slate-300 flex items-center px-6 md:px-8 justify-between text-[10px] text-slate-500 font-medium shrink-0">
        <div className="flex space-x-6">
          <span>Rules for Any Mode of Transport (EXW, FCA, CPT, CIP, DAP, DPU, DDP)</span>
          <span className="hidden sm:inline">Rules for Sea/Inland Waterway (FAS, FOB, CFR, CIF)</span>
        </div>
        <div>
          © Incoterms® 2020 Reference
        </div>
      </footer>
    </div>
  );
}
