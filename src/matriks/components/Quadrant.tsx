import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Item, QuadrantData } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface QuadrantProps {
  data: QuadrantData;
  items: Item[];
  onAddItem: (text: string) => void;
  onRemoveItem: (id: string) => void;
}

const themeStyles = {
  emerald: 'bg-emerald-50/50 border-emerald-200 text-emerald-900',
  blue: 'bg-blue-50/50 border-blue-200 text-blue-900',
  amber: 'bg-amber-50/50 border-amber-200 text-amber-900',
  rose: 'bg-rose-50/50 border-rose-200 text-rose-900',
  slate: 'bg-slate-50 border-slate-200 text-slate-900',
};

const headerStyles = {
  emerald: 'text-emerald-800',
  blue: 'text-blue-800',
  amber: 'text-amber-800',
  rose: 'text-rose-800',
  slate: 'text-slate-800',
};

export function Quadrant({ data, items, onAddItem, onRemoveItem }: QuadrantProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      onAddItem(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className={`flex flex-col h-full min-h-[300px] rounded-2xl border p-5 transition-colors shadow-sm ${themeStyles[data.theme]}`}>
      <div className="mb-4">
        <h3 className={`text-xl font-bold tracking-tight ${headerStyles[data.theme]}`}>{data.title}</h3>
        <p className="text-sm opacity-70 font-medium mt-0.5">{data.subtitle}</p>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-2 pr-1 custom-scrollbar">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group flex items-start gap-3 bg-white/80 backdrop-blur-sm border border-black/5 p-3 rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex-1 text-sm leading-relaxed text-slate-800 whitespace-pre-wrap">
                {item.text}
              </div>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-white flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {items.length === 0 && (
          <div className="h-full flex items-center justify-center opacity-40 text-sm font-medium italic">
            No items added yet
          </div>
        )}
      </div>

      <div className="relative mt-auto pt-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add an item and press enter..."
          className="w-full bg-white/90 border border-black/10 rounded-xl pl-4 pr-10 py-3 text-sm outline-none focus:ring-2 focus:ring-black/5 focus:border-black/20 transition-all shadow-sm"
        />
        <button
          onClick={() => {
            if (inputValue.trim()) {
              onAddItem(inputValue.trim());
              setInputValue('');
            }
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 mt-1 text-slate-400 hover:text-slate-700 p-2"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
