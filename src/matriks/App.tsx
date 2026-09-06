import { useState, useMemo } from 'react';
import { LayoutGrid, Presentation, Download, Briefcase, RefreshCw } from 'lucide-react';
import { frameworks } from './data';
import { Item, QuadrantId } from './types';
import { Quadrant } from './components/Quadrant';

export default function App() {
  const [activeFrameworkId, setActiveFrameworkId] = useState<string>(frameworks[0].id);
  
  // Keep state for all frameworks so data isn't lost when switching tabs
  const [itemsState, setItemsState] = useState<Record<string, Record<QuadrantId, Item[]>>>(() => {
    const initialState: Record<string, Record<QuadrantId, Item[]>> = {};
    frameworks.forEach(fw => {
      initialState[fw.id] = { tl: [], tr: [], bl: [], br: [] };
    });
    return initialState;
  });

  const activeFramework = useMemo(() => 
    frameworks.find(f => f.id === activeFrameworkId) || frameworks[0],
  [activeFrameworkId]);

  const activeItems = itemsState[activeFrameworkId] || { tl: [], tr: [], bl: [], br: [] };

  const handleAddItem = (quadrantId: QuadrantId, text: string) => {
    const newItem: Item = { id: crypto.randomUUID(), text };
    setItemsState(prev => ({
      ...prev,
      [activeFrameworkId]: {
        ...prev[activeFrameworkId],
        [quadrantId]: [...(prev[activeFrameworkId]?.[quadrantId] || []), newItem]
      }
    }));
  };

  const handleRemoveItem = (quadrantId: QuadrantId, itemId: string) => {
    setItemsState(prev => ({
      ...prev,
      [activeFrameworkId]: {
        ...prev[activeFrameworkId],
        [quadrantId]: prev[activeFrameworkId]?.[quadrantId]?.filter(i => i.id !== itemId) || []
      }
    }));
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all items in this matrix?')) {
      setItemsState(prev => ({
        ...prev,
        [activeFrameworkId]: { tl: [], tr: [], bl: [], br: [] }
      }));
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-md">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">Consultant Pro</h1>
            <p className="text-xs text-slate-500 font-medium">Matrix Analysis Toolkit</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleClearAll} 
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Clear Matrix
          </button>
          <button 
            className="px-5 py-2 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-2"
            onClick={() => alert('PDF Export would be triggered here.')}
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-80 bg-white border-r border-slate-200 p-6 flex flex-col gap-6 overflow-y-auto z-0">
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-1">Frameworks</h2>
            <div className="space-y-2">
              {frameworks.map((fw) => (
                <button
                  key={fw.id}
                  onClick={() => setActiveFrameworkId(fw.id)}
                  className={`w-full text-left p-4 rounded-2xl transition-all border ${
                    activeFrameworkId === fw.id
                      ? 'bg-slate-50 border-slate-200 shadow-sm'
                      : 'border-transparent hover:bg-slate-50 hover:border-slate-200/60'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${activeFrameworkId === fw.id ? 'bg-white shadow-sm border border-slate-200 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                      <LayoutGrid className="w-4 h-4" />
                    </div>
                    <span className={`font-bold text-sm ${activeFrameworkId === fw.id ? 'text-slate-900' : 'text-slate-700'}`}>
                      {fw.name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed pr-2">
                    {fw.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto p-5 bg-blue-50 rounded-2xl border border-blue-100/50">
            <h3 className="text-sm font-bold text-blue-900 mb-1.5 flex items-center gap-2">
              <Presentation className="w-4 h-4" />
              Live Workshop Mode
            </h3>
            <p className="text-xs text-blue-800/70 leading-relaxed">
              Use this tool during live client sessions. Updates are instant and autosaved to your local session.
            </p>
          </div>
        </aside>

        {/* Main Canvas */}
        <main className="flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="max-w-6xl mx-auto h-full flex flex-col">
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                {activeFramework.name}
              </h2>
              <p className="text-slate-500 max-w-2xl text-sm leading-relaxed font-medium">
                {activeFramework.description}
              </p>
            </div>

            {/* Matrix Grid */}
            <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-6 min-h-[700px]">
              <Quadrant
                data={activeFramework.quadrants.tl}
                items={activeItems.tl}
                onAddItem={(text) => handleAddItem('tl', text)}
                onRemoveItem={(id) => handleRemoveItem('tl', id)}
              />
              <Quadrant
                data={activeFramework.quadrants.tr}
                items={activeItems.tr}
                onAddItem={(text) => handleAddItem('tr', text)}
                onRemoveItem={(id) => handleRemoveItem('tr', id)}
              />
              <Quadrant
                data={activeFramework.quadrants.bl}
                items={activeItems.bl}
                onAddItem={(text) => handleAddItem('bl', text)}
                onRemoveItem={(id) => handleRemoveItem('bl', id)}
              />
              <Quadrant
                data={activeFramework.quadrants.br}
                items={activeItems.br}
                onAddItem={(text) => handleAddItem('br', text)}
                onRemoveItem={(id) => handleRemoveItem('br', id)}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

