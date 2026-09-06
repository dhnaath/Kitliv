import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Calendar, Flag, Trash2, AlignLeft } from 'lucide-react';
import { cn } from '../lib/utils';

interface Task {
  id: number;
  title: string;
  priority: string;
  date: string;
  group: string;
  completed: boolean;
  description?: string;
}

interface TaskItemProps {
  task: Task;
  isSelected: boolean;
  onClick: () => void;
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

export function TaskItem({ task, isSelected, onClick, onComplete, onDelete }: TaskItemProps) {
  const [isChecked, setIsChecked] = useState(task.completed);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleCheck = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isChecked) return;
    setIsChecked(true);
    setTimeout(() => {
      onComplete(task.id);
    }, 500);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isSelected) return;
      if (e.key === 'e' || e.key === 'E') {
        onClick();
      } else if (e.key === 'd' || e.key === 'D') {
        if (!isChecked) {
          setIsChecked(true);
          setTimeout(() => {
            onComplete(task.id);
          }, 500);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSelected, task.id, isChecked, onComplete, onClick]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileTap={{ scale: 0.99 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={cn(
        "group flex items-start py-2.5 px-3 -mx-3 rounded-xl cursor-pointer transition-colors border border-transparent outline-none overflow-hidden",
        isSelected ? "bg-blue-50/50 border-blue-100/50 shadow-sm" : "hover:bg-slate-50",
        isChecked ? "opacity-50" : "opacity-100"
      )}
      tabIndex={0}
    >
      {/* Checkbox */}
      <button 
        onClick={handleCheck}
        className="mr-3 mt-0.5 shrink-0 relative flex items-center justify-center w-[18px] h-[18px] rounded-sm border-2 border-gray-300 hover:border-blue-500 transition-colors bg-white focus:outline-none"
      >
        <AnimatePresence>
          {isChecked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute inset-0 bg-blue-500 rounded-sm flex items-center justify-center"
            >
              <motion.div
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                <Check size={12} className="text-white" strokeWidth={3} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Task Content */}
      <div className="flex-1 flex flex-col min-w-0 pr-2">
        <span className={cn(
          "text-[15px] font-medium text-slate-800 truncate transition-all duration-300",
          isChecked && "line-through text-slate-500"
        )}>
          {task.title}
        </span>
        <div className="flex flex-wrap gap-2 mt-1.5 items-center">
          <span className={cn("text-[11px] font-semibold flex items-center", task.group === 'Overdue' ? 'text-rose-500' : 'text-blue-500')}>
            {task.date}
          </span>
          {task.priority !== 'none' && (
            <>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span className={cn("text-[11px] font-semibold flex items-center", 
                task.priority === 'high' ? 'text-rose-500' : 
                task.priority === 'medium' ? 'text-amber-500' : 'text-blue-500'
              )}>
                <Flag size={10} className="mr-1" strokeWidth={3} /> {task.priority}
              </span>
            </>
          )}
          {task.description && (
            <>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <AlignLeft size={12} className="text-slate-400" />
            </>
          )}
        </div>
      </div>

      {/* Hover Actions */}
      <AnimatePresence>
        {isHovered && !isChecked && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1 bg-gradient-to-l from-gray-50 via-gray-50 to-transparent pl-4 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-md transition-colors" title="Set Date">
              <Calendar size={16} />
            </button>
            <button className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-200 rounded-md transition-colors" title="Set Priority">
              <Flag size={16} />
            </button>
            <button 
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors" 
              title="Delete Task"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
            >
              <Trash2 size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
