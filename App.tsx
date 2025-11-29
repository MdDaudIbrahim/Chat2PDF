import React, { useState, useEffect } from 'react';
import { ChatInput } from './components/ChatInput';
import { ChatPreview } from './components/ChatPreview';
import { Button } from './components/Button';
import { HistorySidebar } from './components/HistorySidebar';
import { parseConversationLocal, validateInput } from './services/parser';
import { getHistory, saveSession, deleteSession } from './services/storage';
import { ChatSession, ParsingStatus } from './types';
import { Sparkles, Printer, AlertCircle, History, Plus } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<ParsingStatus>(ParsingStatus.IDLE);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [history, setHistory] = useState<ChatSession[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleParse = async (rawText: string) => {
    setError(null);
    
    // Validate input first
    const validation = validateInput(rawText);
    if (!validation.valid) {
      setError(validation.error || "Invalid input");
      setStatus(ParsingStatus.ERROR);
      return;
    }

    setStatus(ParsingStatus.PARSING);
    
    try {
      // Use local parser - instant, no API needed
      const result = parseConversationLocal(rawText);
      
      if (result.messages.length === 0) {
        throw new Error("Could not detect any messages in the text. Please make sure you're pasting a conversation with clear speaker indicators (like 'You:', 'ChatGPT:', etc.)");
      }

      const newSession: ChatSession = {
        id: crypto.randomUUID(),
        title: result.title,
        messages: result.messages,
        platform: result.platform || 'Imported Chat',
        createdAt: Date.now()
      };
      
      setSession(newSession);
      const updatedHistory = saveSession(newSession);
      setHistory(updatedHistory);
      setStatus(ParsingStatus.SUCCESS);
      // On mobile, close history if it was somehow open
      setIsHistoryOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to parse conversation. Please check the format of your text.");
      setStatus(ParsingStatus.ERROR);
    }
  };

  const handleNewChat = () => {
    setSession(null);
    setStatus(ParsingStatus.IDLE);
    setError(null);
    setIsHistoryOpen(false);
  };

  const handleSelectHistory = (selectedSession: ChatSession) => {
    setSession(selectedSession);
    setIsHistoryOpen(false);
    setStatus(ParsingStatus.SUCCESS);
    setError(null);
  };

  const handleDeleteHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteSession(id);
    setHistory(updated);
    if (session?.id === id) {
      setSession(null);
      setStatus(ParsingStatus.IDLE);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* History Sidebar */}
      <HistorySidebar 
        history={history}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelect={handleSelectHistory}
        onDelete={handleDeleteHistory}
        currentId={session?.id}
      />

      {/* Header - Hidden in Print */}
      <header className="no-print bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className={`p-2 rounded-lg transition-all duration-200 ${isHistoryOpen ? 'bg-brand-50 text-brand-600 shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              title="View History"
            >
              <History className="w-5 h-5" />
            </button>
            
            <div className="h-6 w-px bg-slate-200"></div>

            <div className="flex items-center gap-3 cursor-pointer group" onClick={handleNewChat}>
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200/50 group-hover:shadow-blue-300/60 transition-all duration-200">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight hidden sm:block">Chat2PDF</span>
            </div>
            
            <button 
              onClick={handleNewChat}
              className="ml-2 flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all duration-200 hover:shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New</span>
            </button>
          </div>
          
          <div className="flex items-center gap-3">
             {session && (
               <Button 
                onClick={handlePrint} 
                variant="primary" 
                icon={<Printer className="w-4 h-4" />}
                className="shadow-lg shadow-blue-200/50 hover:shadow-blue-300/60 transition-all duration-200"
              >
                <span className="hidden sm:inline">Print / Save PDF</span>
                <span className="sm:hidden">Export</span>
              </Button>
             )}
          </div>
        </div>
      </header>

  {/* Main Content */}
  <main className="flex-1 overflow-hidden relative bg-gradient-to-br from-slate-50 via-white to-slate-50 print-safe print:overflow-visible print:static print:bg-white">
        {/* Overlay when history is open on mobile */}
        {isHistoryOpen && (
          <div 
            className="fixed inset-0 bg-black/30 z-30 no-print lg:hidden backdrop-blur-sm transition-opacity duration-200" 
            onClick={() => setIsHistoryOpen(false)}
          />
        )}

  <div className="h-full flex flex-col lg:flex-row print:h-auto">
          
          {/* Left Panel: Input - Hidden in Print */}
          <div className="no-print w-full lg:w-[440px] xl:w-[500px] border-r border-slate-200/60 bg-white/50 backdrop-blur-sm p-5 lg:p-6 flex flex-col overflow-y-auto overscroll-contain z-20">
            <div className="mb-5 flex-shrink-0">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                Input Source
              </h2>
              <p className="text-sm text-slate-500 mt-1">Paste your conversation to create a beautiful PDF.</p>
            </div>
            
            <div className="flex-1 min-h-0 flex flex-col">
              <ChatInput onParse={handleParse} isParsing={status === ParsingStatus.PARSING} />
            </div>
            
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300 flex-shrink-0">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">Error Processing Input</p>
                  <p className="opacity-90 text-xs leading-relaxed">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel: Preview */}
       <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50/50 via-transparent to-blue-50/30 p-6 lg:p-10 print:p-0 print:bg-white print:overflow-visible print:h-auto print:max-h-none">
         <div className="w-full max-w-[210mm] mx-auto print:max-w-full">
               <ChatPreview 
                  title={session?.title || "Untitled Conversation"} 
                  messages={session?.messages || []} 
                  platform={session?.platform}
               />
             </div>
          </div>

        </div>
      </main>
    </>
  );
};

export default App;