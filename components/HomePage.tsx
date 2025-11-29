import React from 'react';
import { Lock, Zap, MessageSquare, ArrowRight } from 'lucide-react';

interface HomePageProps {
  onGetStarted: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onGetStarted }) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light overflow-x-hidden overflow-y-auto">
      <div className="layout-container flex grow flex-col">
        <div className="flex flex-1 justify-center py-5 px-4 sm:px-6 md:px-10 lg:px-20">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1 w-full">
            
            {/* Top Navigation Bar */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 px-4 md:px-10 py-3">
              <div className="flex items-center gap-4 text-slate-900">
                <div className="w-6 h-6 text-primary">
                  <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path clipRule="evenodd" d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z" fill="currentColor" fillRule="evenodd"/>
                  </svg>
                </div>
                <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-tight">Chat2PDF</h2>
              </div>
              <div className="hidden md:flex flex-1 justify-end gap-8">
                <div className="flex items-center gap-9">
                  <a className="text-slate-800 text-sm font-medium leading-normal hover:text-primary transition-colors" href="#features">Features</a>
                  <a className="text-slate-800 text-sm font-medium leading-normal hover:text-primary transition-colors" href="#how-it-works">How It Works</a>
                  <a className="text-slate-800 text-sm font-medium leading-normal hover:text-primary transition-colors" href="#faq">FAQ</a>
                </div>
                <button 
                  onClick={onGetStarted}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-wide hover:opacity-90 transition-opacity"
                >
                  <span className="truncate">Get Started</span>
                </button>
              </div>
            </header>

            {/* Hero Section */}
            <div className="py-10 md:py-20">
              <div className="flex flex-col gap-6 px-4 py-10 md:flex-row-reverse md:gap-8">
                {/* Hero Image */}
                <div className="w-full bg-gradient-to-br from-teal-600 to-teal-700 bg-center bg-no-repeat aspect-video rounded-lg flex items-center justify-center md:min-w-[400px]">
                  <div className="text-white/20">
                    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="40" y="60" width="120" height="100" rx="8" stroke="currentColor" strokeWidth="3"/>
                      <path d="M50 80 L150 80 M50 100 L150 100 M50 120 L150 120 M50 140 L110 140" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="140" cy="50" r="20" fill="currentColor" opacity="0.5"/>
                      <path d="M140 40 L140 60 M130 50 L150 50" stroke="white" strokeWidth="3"/>
                    </svg>
                  </div>
                </div>
                
                {/* Hero Content */}
                <div className="flex flex-col gap-6 md:min-w-[400px] md:justify-center">
                  <div className="flex flex-col gap-2 text-left">
                    <h1 className="text-slate-900 text-4xl md:text-5xl font-black leading-tight tracking-tight">
                      Turn Your AI Chats into Clean, Printable PDFs. Instantly.
                    </h1>
                    <h2 className="text-slate-600 text-base font-normal leading-normal mt-2">
                      100% private. All conversion happens securely in your browser. No data ever leaves your device.
                    </h2>
                  </div>
                  <button 
                    onClick={onGetStarted}
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-wide hover:opacity-90 transition-opacity shadow-lg"
                  >
                    <span className="truncate">Convert Your Chat Now</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div id="features" className="flex flex-col gap-10 px-4 py-10">
              <div className="flex flex-col gap-4">
                <h1 className="text-slate-900 text-3xl md:text-4xl font-bold leading-tight max-w-[720px]">
                  Privacy-First, Fast, and Universal
                </h1>
                <p className="text-slate-600 text-base font-normal leading-normal max-w-[720px]">
                  Chat2PDF is designed from the ground up to be secure, simple, and compatible with your favorite AI chat platforms.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-1 gap-3 rounded-xl border border-slate-200 bg-white p-6 flex-col hover:shadow-lg transition-shadow">
                  <div className="text-primary">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-slate-900 text-base font-bold leading-tight">100% Privacy First</h2>
                    <p className="text-slate-600 text-sm font-normal leading-normal">
                      All processing is done locally in your browser. Your conversations are never uploaded or stored.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-1 gap-3 rounded-xl border border-slate-200 bg-white p-6 flex-col hover:shadow-lg transition-shadow">
                  <div className="text-primary">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-slate-900 text-base font-bold leading-tight">Instant Conversion</h2>
                    <p className="text-slate-600 text-sm font-normal leading-normal">
                      Generate your PDF on-the-fly with no waiting time. Your document is ready the moment you are.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-1 gap-3 rounded-xl border border-slate-200 bg-white p-6 flex-col hover:shadow-lg transition-shadow">
                  <div className="text-primary">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-slate-900 text-base font-bold leading-tight">Universal Support</h2>
                    <p className="text-slate-600 text-sm font-normal leading-normal">
                      Works with conversations from ChatGPT, Claude, and other major AI chat platforms.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* How It Works Section */}
            <div id="how-it-works" className="py-10 md:py-20">
              <h2 className="text-slate-900 text-2xl font-bold leading-tight tracking-tight px-4 pb-5 pt-5 text-center">
                How It Works
              </h2>
              
              <div className="grid grid-cols-[40px_1fr] gap-x-4 px-4 max-w-md mx-auto">
                <div className="flex flex-col items-center gap-1 pt-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="font-bold">1</span>
                  </div>
                  <div className="w-[1.5px] bg-slate-300 h-2 grow"></div>
                </div>
                <div className="flex flex-1 flex-col py-3">
                  <p className="text-slate-900 text-base font-medium leading-normal">Paste Your Chat</p>
                  <p className="text-slate-500 text-base font-normal leading-normal">
                    Copy the entire conversation from your AI chat platform and paste it here.
                  </p>
                </div>
                
                <div className="flex flex-col items-center gap-1">
                  <div className="w-[1.5px] bg-slate-300 h-2"></div>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="font-bold">2</span>
                  </div>
                  <div className="w-[1.5px] bg-slate-300 h-2 grow"></div>
                </div>
                <div className="flex flex-1 flex-col py-3">
                  <p className="text-slate-900 text-base font-medium leading-normal">Preview & Generate</p>
                  <p className="text-slate-500 text-base font-normal leading-normal">
                    The app instantly generates a formatted preview with beautiful styling.
                  </p>
                </div>
                
                <div className="flex flex-col items-center gap-1 pb-3">
                  <div className="w-[1.5px] bg-slate-300 h-2"></div>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="font-bold">3</span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col py-3">
                  <p className="text-slate-900 text-base font-medium leading-normal">Download Instantly</p>
                  <p className="text-slate-500 text-base font-normal leading-normal">
                    Get your clean, formatted PDF document ready for sharing or printing.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <footer id="faq" className="mt-20 border-t border-slate-200 py-8 px-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-sm text-slate-500">© 2024 Chat2PDF. All rights reserved.</p>
                <div className="flex items-center gap-6">
                  <a className="text-sm font-medium text-slate-600 hover:text-primary transition-colors" href="#">Privacy Policy</a>
                  <a className="text-sm font-medium text-slate-600 hover:text-primary transition-colors" href="#">Terms of Service</a>
                  <a className="text-sm font-medium text-slate-600 hover:text-primary transition-colors" href="#">Contact</a>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};
