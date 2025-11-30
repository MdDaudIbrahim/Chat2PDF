import React, { useState } from 'react';
import { Lock, Zap, MessageSquare, ArrowRight, FileText, Shield, Sparkles, CheckCircle2, ChevronDown, Github, Facebook, Star, Copy, Download, Eye } from 'lucide-react';

interface HomePageProps {
  onGetStarted: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onGetStarted }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "Is my data safe?",
      answer: "Absolutely! Chat2PDF processes everything locally in your browser. Your conversations never leave your device - no servers, no uploads, no tracking. It's 100% private by design."
    },
    {
      question: "Which AI platforms are supported?",
      answer: "Chat2PDF works with conversations from ChatGPT, Claude, Gemini, Copilot, Perplexity, and most other AI chat platforms. Simply copy and paste your conversation!"
    },
    {
      question: "Is it free to use?",
      answer: "Yes! Chat2PDF is completely free with no limits. Convert as many conversations as you want, whenever you want."
    },
    {
      question: "How do I copy a conversation?",
      answer: "In most AI chat apps, you can select all text (Ctrl+A or Cmd+A) in the chat and copy it (Ctrl+C or Cmd+C). Then paste it directly into Chat2PDF."
    },
    {
      question: "Does it support code blocks and markdown?",
      answer: "Yes! Chat2PDF fully supports markdown formatting including code blocks with syntax highlighting, lists, tables, bold, italic, and more."
    }
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white overflow-x-hidden overflow-y-auto">
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Chat2PDF
              </span>
            </div>

            {/* Nav Links - Desktop */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">How It Works</a>
              <a href="#faq" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">FAQ</a>
            </nav>

            {/* CTA Button */}
            <button 
              onClick={onGetStarted}
              className="group flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-full hover:bg-slate-800 transition-all duration-200 shadow-lg shadow-slate-900/20"
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 sm:pt-24 sm:pb-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-8">
              <Shield className="w-4 h-4" />
              <span>100% Private • No Upload Required</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight tracking-tight mb-6">
              Turn AI Chats into
              <span className="bg-gradient-to-r from-primary via-blue-600 to-teal-500 bg-clip-text text-transparent"> Beautiful PDFs</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Convert your ChatGPT, Claude, and Gemini conversations into clean, shareable PDF documents. 
              Everything happens in your browser — your data never leaves your device.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button 
                onClick={onGetStarted}
                className="group w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white text-lg font-bold rounded-2xl hover:opacity-90 transition-all duration-200 shadow-xl shadow-primary/30"
              >
                <Sparkles className="w-5 h-5" />
                Start Converting — It's Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a 
                href="#how-it-works"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-slate-100 text-slate-700 text-lg font-semibold rounded-2xl hover:bg-slate-200 transition-all duration-200"
              >
                <Eye className="w-5 h-5" />
                See How It Works
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>No sign-up required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Works offline</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Unlimited conversions</span>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none"></div>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-2 shadow-2xl shadow-slate-900/30 max-w-4xl mx-auto">
              <div className="bg-slate-800 rounded-2xl p-6">
                {/* Browser Header */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="flex-1 mx-4 bg-slate-700 rounded-lg h-8 flex items-center px-4">
                    <span className="text-slate-400 text-sm">chat2pdf.app</span>
                  </div>
                </div>
                
                {/* Mock UI */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Input Side */}
                  <div className="bg-slate-700/50 rounded-xl p-4">
                    <div className="text-xs text-slate-400 mb-3 font-medium">Your Conversation</div>
                    <div className="space-y-2">
                      <div className="h-3 bg-slate-600 rounded w-full"></div>
                      <div className="h-3 bg-slate-600 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-600 rounded w-5/6"></div>
                      <div className="h-3 bg-slate-600 rounded w-2/3"></div>
                    </div>
                  </div>
                  
                  {/* Preview Side */}
                  <div className="bg-white rounded-xl p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-slate-200 rounded-full"></div>
                        <div className="h-3 bg-slate-200 rounded w-16"></div>
                      </div>
                      <div className="pl-8 space-y-1.5">
                        <div className="h-2 bg-slate-100 rounded w-full"></div>
                        <div className="h-2 bg-slate-100 rounded w-4/5"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary/20 rounded-full"></div>
                        <div className="h-3 bg-primary/20 rounded w-20"></div>
                      </div>
                      <div className="pl-8 space-y-1.5">
                        <div className="h-2 bg-primary/10 rounded w-full"></div>
                        <div className="h-2 bg-primary/10 rounded w-3/4"></div>
                        <div className="h-2 bg-primary/10 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Why Choose Chat2PDF?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Built for privacy-conscious users who want a fast, simple way to save their AI conversations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-xl hover:border-primary/20 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-500/25 group-hover:scale-110 transition-transform">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">100% Private</h3>
              <p className="text-slate-600 leading-relaxed">
                Your conversations never leave your device. All processing happens locally in your browser — no servers, no tracking, no data collection.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-xl hover:border-primary/20 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-amber-500/25 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Results</h3>
              <p className="text-slate-600 leading-relaxed">
                Paste your chat and get a beautifully formatted PDF in seconds. No waiting, no processing queues — just instant conversion.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-xl hover:border-primary/20 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-violet-500/25 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Universal Support</h3>
              <p className="text-slate-600 leading-relaxed">
                Works with ChatGPT, Claude, Gemini, Copilot, and all major AI assistants. Just copy, paste, and convert.
              </p>
            </div>
          </div>

          {/* Additional Features Grid */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Copy, text: "Copy & Paste" },
              { icon: Download, text: "One-Click Export" },
              { icon: Star, text: "Markdown Support" },
              { icon: FileText, text: "Code Highlighting" }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200">
                <item.icon className="w-5 h-5 text-primary" />
                <span className="font-medium text-slate-700">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Three simple steps to convert your AI conversations into professional PDFs.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Steps Container */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
              {/* Step 1 */}
              <div className="relative text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-primary/30 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Copy Your Chat</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Select and copy your entire conversation from ChatGPT, Claude, or any AI assistant.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative text-center">
                {/* Connector Left - Desktop */}
                <div className="hidden md:block absolute top-8 -left-4 w-8 h-0.5 bg-gradient-to-r from-primary to-blue-500"></div>
                {/* Connector Right - Desktop */}
                <div className="hidden md:block absolute top-8 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-teal-500"></div>
                
                <div className="relative inline-block mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Paste & Preview</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Paste your conversation and instantly see a beautifully formatted preview.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl shadow-teal-500/30 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Download PDF</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Click the button to save your conversation as a clean, professional PDF document.
                </p>
              </div>
            </div>

            {/* Mobile Step Connectors */}
            <div className="md:hidden absolute left-1/2 top-20 bottom-20 w-0.5 bg-gradient-to-b from-primary via-blue-500 to-teal-500 -translate-x-1/2 -z-10"></div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <button 
              onClick={onGetStarted}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white text-lg font-bold rounded-2xl hover:bg-slate-800 transition-all duration-200 shadow-xl"
            >
              Try It Now — Free Forever
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to know about Chat2PDF.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-semibold text-slate-900">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Convert Your Chats?
              </h2>
              <p className="text-lg text-slate-300 mb-8 max-w-xl mx-auto">
                Join thousands of users who trust Chat2PDF for their AI conversation exports. Free forever, no sign-up required.
              </p>
              <button 
                onClick={onGetStarted}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 text-lg font-bold rounded-2xl hover:bg-slate-100 transition-all duration-200 shadow-xl"
              >
                <Sparkles className="w-5 h-5" />
                Get Started Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-700">Chat2PDF</span>
            </div>

            {/* Copyright */}
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Chat2PDF. Made with ❤️ by{' '}
              <a 
                href="https://daudibrahim.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Md. Daud Ibrahim
              </a>
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a 
                href="https://github.com/MdDaudIbrahim" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://www.facebook.com/md.daud1brahim/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
