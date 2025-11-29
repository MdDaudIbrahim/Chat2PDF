import React from 'react';
import { ChatSession } from '../types';
import { MessageSquare, Trash2, Clock, ChevronLeft } from 'lucide-react';

interface HistorySidebarProps {
  history: ChatSession[];
  onSelect: (session: ChatSession) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  currentId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ 
  history, 
  onSelect, 
  onDelete, 
  currentId,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="no-print fixed inset-y-0 left-0 w-80 bg-white border-r border-slate-200 shadow-2xl z-50 transform transition-transform duration-300 flex flex-col">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <h2 className="font-semibold text-slate-800 flex items-center gap-2">
          <Clock className="w-4 h-4 text-brand-600" />
          History
        </h2>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {history.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <p className="text-sm">No history yet.</p>
            <p className="text-xs mt-1">Chats you parse will appear here.</p>
          </div>
        ) : (
          history.map((session) => (
            <div 
              key={session.id}
              onClick={() => onSelect(session)}
              className={`group relative p-3 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                currentId === session.id 
                  ? 'bg-brand-50 border-brand-200 ring-1 ring-brand-200' 
                  : 'bg-white border-slate-100 hover:border-brand-100'
              }`}
            >
              <div className="pr-8">
                <h3 className={`font-medium text-sm truncate ${currentId === session.id ? 'text-brand-700' : 'text-slate-700'}`}>
                  {session.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(session.createdAt).toLocaleDateString()} • {session.messages.length} messages
                </p>
              </div>
              
              <button
                onClick={(e) => onDelete(session.id, e)}
                className="absolute right-2 top-3 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                title="Delete from history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};