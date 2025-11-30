import React from 'react';
import { ChatSession } from '../types';
import { MessageSquare, Trash2, Plus, PanelLeftClose, PanelLeft, X, History } from 'lucide-react';

interface HistorySidebarProps {
  history: ChatSession[];
  onSelect: (session: ChatSession) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onNewChat: () => void;
  currentId?: string;
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  isCollapsed: boolean;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ 
  history, 
  onSelect, 
  onDelete,
  onNewChat,
  currentId,
  isOpen,
  onClose,
  onToggle,
  isCollapsed
}) => {
  // Group history by date
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  const groupedHistory = {
    today: history.filter(s => new Date(s.createdAt).toDateString() === today.toDateString()),
    yesterday: history.filter(s => new Date(s.createdAt).toDateString() === yesterday.toDateString()),
    lastWeek: history.filter(s => {
      const date = new Date(s.createdAt);
      return date > lastWeek && date.toDateString() !== today.toDateString() && date.toDateString() !== yesterday.toDateString();
    }),
    older: history.filter(s => new Date(s.createdAt) <= lastWeek)
  };

  const HistoryContent = ({ onItemSelect, isMobile = false }: { onItemSelect: (s: ChatSession) => void, isMobile?: boolean }) => (
    <div className="flex-1 overflow-y-auto px-2 pb-4">
      {history.length === 0 ? (
        <div className="text-center py-12 px-4">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
            <History className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm font-medium text-gray-700">No chat history</p>
          <p className="text-xs text-gray-500 mt-1">Your conversations will appear here</p>
        </div>
      ) : (
        <>
          {groupedHistory.today.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">Today</p>
              {groupedHistory.today.map((session) => (
                <ChatHistoryItem 
                  key={session.id} 
                  session={session} 
                  isActive={currentId === session.id}
                  onSelect={onItemSelect}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
          
          {groupedHistory.yesterday.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">Yesterday</p>
              {groupedHistory.yesterday.map((session) => (
                <ChatHistoryItem 
                  key={session.id} 
                  session={session} 
                  isActive={currentId === session.id}
                  onSelect={onItemSelect}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
          
          {groupedHistory.lastWeek.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">Previous 7 Days</p>
              {groupedHistory.lastWeek.map((session) => (
                <ChatHistoryItem 
                  key={session.id} 
                  session={session} 
                  isActive={currentId === session.id}
                  onSelect={onItemSelect}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
          
          {groupedHistory.older.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">Older</p>
              {groupedHistory.older.map((session) => (
                <ChatHistoryItem 
                  key={session.id} 
                  session={session} 
                  isActive={currentId === session.id}
                  onSelect={onItemSelect}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar - Light Theme */}
      <div className={`no-print hidden lg:flex flex-col bg-white border-r border-gray-200 h-screen transition-all duration-300 ease-in-out ${isCollapsed ? 'w-0 overflow-hidden' : 'w-[280px]'}`}>
        {/* Top Bar */}
        <div className="flex items-center justify-between p-3 h-16 border-b border-gray-100">
          <button 
            onClick={onToggle}
            className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 hover:text-gray-700 transition-all"
            title="Close sidebar"
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
          
          <button 
            onClick={onNewChat}
            className="flex items-center gap-2 px-3 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-all shadow-sm"
            title="New chat"
          >
            <Plus className="w-4 h-4" />
            <span>New</span>
          </button>
        </div>

        {/* History List */}
        <HistoryContent onItemSelect={onSelect} />
      </div>

      {/* Collapsed Toggle Button - Desktop */}
      {isCollapsed && (
        <div className="no-print hidden lg:flex flex-col items-center py-3 px-2 bg-white border-r border-gray-200 h-screen">
          <button 
            onClick={onToggle}
            className="p-2.5 hover:bg-gray-100 rounded-xl text-gray-500 hover:text-primary transition-all"
            title="Open sidebar"
          >
            <PanelLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={onNewChat}
            className="p-2.5 hover:bg-primary/10 rounded-xl text-primary transition-all mt-2"
            title="New chat"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Mobile Sidebar - Slide in with Light Theme */}
      <div className={`no-print lg:hidden fixed inset-y-0 left-0 w-[85vw] max-w-[320px] bg-white z-50 flex flex-col transform transition-transform duration-300 ease-out shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-3 h-16 border-b border-gray-100 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center gap-2">
            <div className="text-primary">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z" fill="currentColor" fillRule="evenodd"/>
              </svg>
            </div>
            <span className="font-bold text-gray-900">History</span>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 hover:text-gray-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button - Mobile */}
        <div className="p-3 border-b border-gray-100">
          <button 
            onClick={() => { onNewChat(); onClose(); }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-all shadow-sm"
          >
            <Plus className="w-5 h-5" />
            <span>New Conversation</span>
          </button>
        </div>

        {/* Mobile History */}
        <HistoryContent 
          onItemSelect={(s) => { onSelect(s); onClose(); }} 
          isMobile={true}
        />
      </div>
    </>
  );
};

// Separate component for history items - Light Theme
const ChatHistoryItem: React.FC<{
  session: ChatSession;
  isActive: boolean;
  onSelect: (session: ChatSession) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}> = ({ session, isActive, onSelect, onDelete }) => {
  return (
    <div 
      onClick={() => onSelect(session)}
      className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all mb-1 ${
        isActive 
          ? 'bg-primary/10 text-primary border border-primary/20' 
          : 'text-gray-700 hover:bg-gray-100 border border-transparent'
      }`}
    >
      <MessageSquare className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
      <span className="text-sm truncate flex-1 font-medium">{session.title}</span>
      
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(session.id, e); }}
        className={`absolute right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all ${
          isActive 
            ? 'text-primary/60 hover:text-red-500 hover:bg-red-50' 
            : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
        }`}
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};