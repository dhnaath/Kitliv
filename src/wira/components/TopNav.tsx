import { User, Users, Smile, Banknote, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

interface TopNavProps {
  onOpenTools: () => void;
}

export function TopNav({ onOpenTools }: TopNavProps) {
  return (
    <div className="px-6 pt-12 pb-4">
      <div className="flex items-center justify-between mb-8">
        <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
          <User size={20} />
        </button>
        
        <div className="flex bg-slate-100 rounded-full p-1 border border-slate-200/50">
          <button className="w-12 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors">
            <Users size={18} />
          </button>
          <button className="w-12 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-800">
            <Smile size={18} />
          </button>
          <button className="w-12 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors">
            <Banknote size={18} />
          </button>
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Today</h1>
          <p className="text-slate-500 font-medium mt-1">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
        </div>
        
        <button 
          onClick={onOpenTools}
          className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
}
