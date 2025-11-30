import React, { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { ChatInput } from './components/ChatInput';
import { ChatPreview } from './components/ChatPreview';
import { Button } from './components/Button';
import { HistorySidebar } from './components/HistorySidebar';
import { parseConversationLocal, validateInput } from './services/parser';
import { getHistory, saveSession, deleteSession } from './services/storage';
import { ChatSession, ParsingStatus } from './types';
import { Sparkles, Printer, AlertCircle, Menu, Plus, Download } from 'lucide-react';

const App: React.FC = () => {
  const [showHomePage, setShowHomePage] = useState(() => {
    // Check if URL has #app hash to show converter directly
    return window.location.hash !== '#app';
  });
  const [status, setStatus] = useState<ParsingStatus>(ParsingStatus.IDLE);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [history, setHistory] = useState<ChatSession[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileView, setMobileView] = useState<'input' | 'preview'>('input');

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const isApp = window.location.hash === '#app';
      setShowHomePage(!isApp);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleGetStarted = () => {
    // Push to browser history so back button works
    window.history.pushState({ page: 'app' }, '', '#app');
    setShowHomePage(false);
  };

  const handleBackToHome = () => {
    // Go back in history or update hash
    if (window.history.state?.page === 'app') {
      window.history.back();
    } else {
      window.history.pushState({ page: 'home' }, '', '/');
      setShowHomePage(true);
    }
    setSession(null);
    setStatus(ParsingStatus.IDLE);
    setError(null);
    setIsHistoryOpen(false);
  };

  const handleParse = async (rawText: string) => {
    setError(null);
    
    const validation = validateInput(rawText);
    if (!validation.valid) {
      setError(validation.error || "Invalid input");
      setStatus(ParsingStatus.ERROR);
      return;
    }

    setStatus(ParsingStatus.PARSING);
    
    try {
      const result = parseConversationLocal(rawText);
      
      if (result.messages.length === 0) {
        throw new Error("Could not detect any messages in the text. Please make sure you're pasting a conversation with clear speaker indicators.");
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
      setMobileView('preview');
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
    setMobileView('input');
  };

  const handleSelectHistory = (selectedSession: ChatSession) => {
    setSession(selectedSession);
    setIsHistoryOpen(false);
    setStatus(ParsingStatus.SUCCESS);
    setError(null);
    setMobileView('preview');
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

  // Show homepage if user hasn't started
  if (showHomePage) {
    return <HomePage onGetStarted={handleGetStarted} />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden print:h-auto print:overflow-visible print:block">
      {/* History Sidebar - ChatGPT Style */}
      <HistorySidebar 
        history={history}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelect={handleSelectHistory}
        onDelete={handleDeleteHistory}
        onNewChat={handleNewChat}
        currentId={session?.id}
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Mobile Overlay */}
      {isHistoryOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-200 no-print" 
          onClick={() => setIsHistoryOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden print:h-auto print:overflow-visible print:block">
        {/* Top Navigation Bar */}
        <header className="no-print sticky top-0 z-10 w-full border-b border-border-light bg-surface-light/80 backdrop-blur-sm h-16">
          <div className="container mx-auto px-4 h-full">
            <div className="flex items-center justify-between h-full">
              {/* Left: Logo & Menu */}
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Toggle menu"
                >
                  <Menu className="w-5 h-5" />
                </button>
                
                <button 
                  onClick={handleBackToHome}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                  title="Back to Home"
                >
                  <div className="text-primary">
                    <svg className="h-7 w-7" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                      <path clipRule="evenodd" d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z" fill="currentColor" fillRule="evenodd"/>
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold tracking-tight">Chat2PDF</h2>
                </button>

                {/* New button - only on mobile/tablet */}
                <button 
                  onClick={handleNewChat}
                  className="lg:hidden flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">New</span>
                </button>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-3">
                {/* Mobile Tab Switcher */}
                {session && (
                  <div className="lg:hidden flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                    <button
                      onClick={() => setMobileView('input')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                        mobileView === 'input'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600'
                      }`}
                    >
                      Input
                    </button>
                    <button
                      onClick={() => setMobileView('preview')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                        mobileView === 'preview'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600'
                      }`}
                    >
                      Preview
                    </button>
                  </div>
                )}

                {session && (
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-sm"
                  >
                    <Printer className="w-4 h-4" />
                    <span className="hidden sm:inline">Print / Save PDF</span>
                    <span className="sm:hidden">Export</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Grid */}
        <main className="flex-1 w-full overflow-y-auto print:overflow-visible print:h-auto bg-background-light">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8 no-print">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                Privacy-First AI Chat to PDF Converter
              </h1>
              <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                Paste your chat conversation from ChatGPT, Claude, Gemini, etc. The preview will update instantly.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start print:block print:h-auto">
              {/* Left: Input Panel */}
              <div className={`flex flex-col gap-4 no-print h-full ${
                session && mobileView === 'preview' ? 'hidden lg:flex' : 'flex'
              }`}>
                <ChatInput 
                  onParse={handleParse} 
                  isParsing={status === ParsingStatus.PARSING}
                />

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">Error Processing Input</p>
                      <p className="text-xs">{error}</p>
                    </div>
                  </div>
                )}

                <p className="text-sm text-gray-500 text-center lg:text-left">
                  Markdown and code blocks are supported.
                </p>
              </div>

              {/* Right: Preview Panel */}
              <div className={`flex flex-col min-h-[600px] lg:min-h-[700px] ${
                session && mobileView === 'input' ? 'hidden lg:flex' : 'flex'
              } print:block print:overflow-visible`}>
                <div className="flex-1 print:overflow-visible">
                  <ChatPreview 
                    title={session?.title || "Untitled Conversation"} 
                    messages={session?.messages || []} 
                    platform={session?.platform}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
