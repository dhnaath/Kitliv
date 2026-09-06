import { useState } from 'react';
import { Plus, FileText, ArrowLeft, Save, Sparkles, Code2, Grid, List, MoreHorizontal, Calendar, Folder } from 'lucide-react';
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { cn } from '../../lib/utils';
import { CustomSlashEditor } from '../CustomSlashEditor';
import { motion, AnimatePresence } from 'motion/react';

interface Note {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
}

const DUMMY_NOTES: Note[] = [
  { id: '1', title: 'Q3 Product Roadmap', excerpt: 'Planning out the upcoming features for the quarter including the new editor integration.', date: 'Oct 12, 2026', category: 'Product' },
  { id: '2', title: 'Meeting Notes: Design Sync', excerpt: 'Discussed the typography changes and the new color palette for the dashboard.', date: 'Oct 14, 2026', category: 'Meetings' },
  { id: '3', title: 'Marketing Strategy 2027', excerpt: 'High-level goals for the upcoming year focusing on enterprise outreach.', date: 'Oct 15, 2026', category: 'Marketing' },
  { id: '4', title: 'Engineering Guidelines', excerpt: 'Best practices for React components and state management.', date: 'Oct 18, 2026', category: 'Engineering' },
];

export function NotesView() {
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [noteTitle, setNoteTitle] = useState('Untitled Note');
  const [isSaving, setIsSaving] = useState(false);
  const [editorType, setEditorType] = useState<'blocknote' | 'custom'>('custom');
  const [layoutMode, setLayoutMode] = useState<"list" | "grid">("grid");
  const [notes, setNotes] = useState<Note[]>(DUMMY_NOTES);
  
  // Initialize BlockNote editor (Library Version)
  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: "paragraph",
        content: "Welcome to your new note! Type '/' to see available blocks.",
      },
    ],
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Get the current blocks from the editor
    const blocks = editor.document;
    
    // Simulating save to Supabase (our backend API)
    console.log("Saving blocks to database in JSON format:", JSON.stringify(blocks, null, 2));
    
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  const handleCreateNew = () => {
    setNoteTitle('Untitled Note');
    setActiveNote('new');
  };

  const handleOpenNote = (note: Note) => {
    setNoteTitle(note.title);
    setActiveNote(note.id);
  };

  if (activeNote) {
    return (
      <div className="p-6 md:p-10 max-w-4xl mx-auto w-full h-full flex flex-col">
        {/* Editor Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => setActiveNote(null)}
            className="text-slate-500 hover:text-slate-900 transition-colors flex items-center text-sm font-medium"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Notes
          </button>
          
          <div className="flex items-center gap-3">
            {/* Editor Switcher for Demonstration */}
            <div className="bg-slate-100 p-1 rounded-lg flex text-xs font-medium mr-4">
               <button 
                 onClick={() => setEditorType('custom')} 
                 className={cn("px-3 py-1.5 rounded-md flex items-center transition-colors", editorType === 'custom' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700")}
               >
                 <Code2 size={14} className="mr-1.5" /> Vanilla JS (Custom)
               </button>
               <button 
                 onClick={() => setEditorType('blocknote')} 
                 className={cn("px-3 py-1.5 rounded-md flex items-center transition-colors", editorType === 'blocknote' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700")}
               >
                 <Sparkles size={14} className="mr-1.5" /> BlockNote (Library)
               </button>
            </div>

            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-70"
            >
              <Save size={16} className="mr-2" /> {isSaving ? 'Saving...' : 'Save Note'}
            </button>
          </div>
        </div>

        {/* Note Title */}
        <input 
          type="text"
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
          className="text-4xl font-bold text-slate-900 mb-8 border-none outline-none bg-transparent placeholder-gray-300 ml-10"
          placeholder="Note Title"
        />
        
        {/* Editor Canvas */}
        {editorType === 'blocknote' ? (
          <div className="flex-1 rounded-2xl overflow-hidden py-6">
            <BlockNoteView editor={editor} theme="light" />
          </div>
        ) : (
          <div className="flex-1 mt-2">
            <CustomSlashEditor />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Notes & Docs</h1>
          <p className="text-slate-500 text-sm mt-1">Wikis, meeting minutes, and project plans.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-md">
            <button 
              onClick={() => setLayoutMode("list")}
              className={cn("p-1.5 rounded text-slate-500 transition-colors", layoutMode === "list" ? "bg-white text-slate-800 shadow-sm" : "hover:text-slate-700")}
            >
              <List size={16} />
            </button>
            <button 
              onClick={() => setLayoutMode("grid")}
              className={cn("p-1.5 rounded text-slate-500 transition-colors", layoutMode === "grid" ? "bg-white text-slate-800 shadow-sm" : "hover:text-slate-700")}
            >
              <Grid size={16} />
            </button>
          </div>
          <button 
            onClick={handleCreateNew}
            className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Plus size={16} className="mr-2" /> New Page
          </button>
        </div>
      </div>
      
      {notes.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
           <FileText size={48} className="text-gray-300 mb-4" />
           <h3 className="text-lg font-semibold text-slate-700">No notes yet</h3>
           <p className="text-sm text-slate-500 mt-2 max-w-sm text-center">Create a space to capture your ideas, meeting minutes, and project plans.</p>
        </div>
      ) : layoutMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {notes.map((note) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -4 }}
                onClick={() => handleOpenNote(note)}
                className="group relative flex flex-col p-5 rounded-2xl cursor-pointer transition-all border border-slate-200 bg-white hover:shadow-md hover:border-slate-300 h-48"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-600">
                    <Folder size={12} />
                    {note.category}
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
                <h3 className="font-semibold text-lg text-slate-800 leading-tight mb-2 line-clamp-2">{note.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-3 mb-auto">{note.excerpt}</p>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs font-medium text-slate-400">
                  <Calendar size={12} className="mr-1.5" />
                  {note.date}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {notes.map((note) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => handleOpenNote(note)}
                className="group flex items-center p-4 rounded-xl cursor-pointer transition-all border border-slate-200 bg-white hover:shadow-md hover:border-slate-300"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mr-4">
                  <FileText size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-slate-800 truncate mb-1">{note.title}</h3>
                  <p className="text-sm text-slate-500 truncate">{note.excerpt}</p>
                </div>
                <div className="flex items-center gap-6 ml-4 shrink-0">
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-600 hidden md:flex">
                    <Folder size={12} />
                    {note.category}
                  </div>
                  <div className="flex items-center text-xs font-medium text-slate-400">
                    <Calendar size={12} className="mr-1.5" />
                    {note.date}
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

