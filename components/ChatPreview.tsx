import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, MessageRole } from '../types';
import { User, Bot, FileText, Volume2, Square, MessageSquare, Users, Type, Clock } from 'lucide-react';
import { Button } from './Button';

interface ChatPreviewProps {
  title: string;
  messages: ChatMessage[];
  platform?: string;
}

export const ChatPreview: React.FC<ChatPreviewProps> = ({ title, messages, platform = "AI Conversation" }) => {
  const date = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  const participants = Array.from(new Set(messages.map((m) => m.role)))
    .map((role) => {
      if (role === MessageRole.USER) return 'You';
      if (role === MessageRole.MODEL) return 'Assistant';
      return 'System';
    })
    .join(' • ') || 'Conversation';
  const totalWords = messages.reduce((sum, msg) => sum + msg.content.split(/\s+/).filter(Boolean).length, 0);
  const readingMinutes = Math.max(1, Math.round(totalWords / 180));
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const handleReadAloud = () => {
    if (!synthRef.current) return;

    if (isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    
    const fullText = messages.map(m => {
        const speaker = m.role === 'user' ? 'You said' : 'The assistant replied';
        const cleanContent = m.content.replace(/```[\s\S]*?```/g, "Code block skipped."); 
        return `${speaker}: ${cleanContent}`;
    }).join('. \n\n');
    
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.rate = 1.0; 
    utterance.pitch = 1;
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    synthRef.current.speak(utterance);
  };

  if (messages.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 p-12 rounded-2xl bg-white/60 backdrop-blur-sm border border-dashed border-slate-300">
        <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-5 shadow-inner">
          <MessageSquare className="w-10 h-10 text-slate-400" />
        </div>
        <p className="text-xl font-bold text-slate-600 mb-2">PDF Preview</p>
        <p className="text-sm text-slate-400 text-center max-w-md leading-relaxed">
          Paste your conversation on the left and click <strong>"Generate PDF Preview"</strong> to see the formatted output here.
        </p>
        <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
          <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
          <span>Ready to process</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full print:h-auto print-safe">
      {/* Controls - Hidden in Print */}
      <div className="no-print mb-5 flex justify-end gap-2">
        <Button 
          variant="ghost" 
          onClick={handleReadAloud}
          className={`transition-all duration-200 ${isSpeaking ? "text-red-600 bg-red-50 hover:bg-red-100 shadow-sm" : "text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:shadow-md"}`}
          icon={isSpeaking ? <Square className="w-4 h-4 fill-current" /> : <Volume2 className="w-4 h-4" />}
        >
          {isSpeaking ? "Stop" : "Read Aloud"}
        </Button>
      </div>

  {/* Document Canvas - Premium PDF Style */}
  <div id="print-area" className="bg-white shadow-2xl rounded-3xl border border-slate-200/80 mx-auto w-full max-w-[210mm] print:shadow-none print:w-full print:max-w-none print:rounded-none print:border-0 overflow-hidden transition-shadow duration-300 hover:shadow-3xl">
        
        {/* Document Header */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-10 py-8 print:bg-slate-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/5"></div>
          <div className="relative flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">{platform}</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight leading-tight mb-3">{title}</h1>
              <p className="text-slate-400 text-sm flex items-center gap-3">
                <span>{date}</span>
                <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                <span>{messages.length} messages</span>
              </p>
            </div>
            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/10 shadow-xl">
              <MessageSquare className="w-7 h-7 text-white/90" />
            </div>
          </div>
        </div>

        {/* Quick Summary */}
        <div className="px-10 py-8 bg-gradient-to-br from-slate-50/50 to-white border-b border-slate-200/60 print:border-slate-200">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200/50">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Participants</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{participants}</p>
            </div>
            
            <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200/50">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Messages</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{messages.length}</p>
            </div>
            
            <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200/50">
                  <Type className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Words</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{totalWords.toLocaleString()}</p>
            </div>
            
            <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200/50">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reading Time</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 tracking-tight">~{readingMinutes}<span className="text-lg text-slate-500 ml-1">min</span></p>
            </div>
          </div>
        </div>

        {/* Transcript Intro */}
        <section className="px-10 pt-10 pb-6 bg-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
            <h2 className="text-sm font-extrabold uppercase tracking-[0.2em] text-slate-900">Transcript</h2>
          </div>
          <p className="text-xl font-semibold text-slate-900 leading-relaxed">Chronological log of the imported conversation</p>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">Messages are ordered from earliest to latest with clear role indicators.</p>
        </section>

        {/* Chat Messages */}
        <div className="px-10 py-10 space-y-6 print:space-y-5">
          <div className="relative">
            <div className="hidden md:block absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200" aria-hidden="true"></div>
            <div className="space-y-6">
              {messages.map((msg, index) => {
                const isUser = msg.role === MessageRole.USER;
                const roleLabel = msg.role === MessageRole.SYSTEM ? 'System' : isUser ? 'You' : 'Assistant';
                const accentCard = isUser ? 'border-slate-200/80 bg-white hover:shadow-xl' : 'border-emerald-200/80 bg-gradient-to-br from-emerald-50/40 to-white hover:shadow-xl hover:shadow-emerald-100/50';
                const avatarStyles = isUser 
                  ? 'bg-gradient-to-br from-slate-700 to-slate-900 shadow-lg shadow-slate-300/50' 
                  : 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-300/50';
                return (
                  <article key={index} className="relative md:pl-14 message-block message-card group">
                    <div className="hidden md:flex absolute left-0 top-8 -translate-x-1/2 transition-transform duration-200 group-hover:scale-125">
                      <div className={`w-4 h-4 rounded-full ${isUser ? 'bg-slate-700 border-2 border-white shadow-lg shadow-slate-300/50' : 'bg-emerald-500 border-2 border-white shadow-lg shadow-emerald-300/50'}`}></div>
                    </div>
                    <div className={`rounded-2xl border-2 shadow-lg transition-all duration-200 ${accentCard}`}>
                      <div className={`message-card-header flex flex-wrap items-center justify-between gap-3 px-6 py-4`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white transition-transform duration-200 group-hover:scale-110 ${avatarStyles}`}>
                            {isUser ? <User size={20} strokeWidth={2.5} /> : <Bot size={20} strokeWidth={2.5} />}
                          </div>
                          <div>
                            <p className="text-sm font-extrabold tracking-tight text-slate-900">{roleLabel}</p>
                            <p className="text-xs text-slate-400 font-medium tracking-wide">Message {index + 1} of {messages.length}</p>
                          </div>
                        </div>
                        <div className="text-xs font-semibold text-slate-400 tracking-wider uppercase px-3 py-1.5 rounded-full bg-slate-100">{platform}</div>
                      </div>
                      <div className="px-6 py-6">
                        <div className="prose prose-sm max-w-none prose-slate">
                          <ReactMarkdown 
                            components={{
                              p: ({children}) => <p className="mb-3 last:mb-0 leading-relaxed text-slate-700">{children}</p>,
                              h1: ({children}) => <h1 className="text-xl font-bold text-slate-900 mb-3 mt-4 first:mt-0">{children}</h1>,
                              h2: ({children}) => <h2 className="text-lg font-bold text-slate-900 mb-2 mt-4 first:mt-0">{children}</h2>,
                              h3: ({children}) => <h3 className="text-base font-semibold text-slate-900 mb-2 mt-3 first:mt-0">{children}</h3>,
                              ul: ({children}) => <ul className="list-disc list-inside mb-3 space-y-1 text-slate-700">{children}</ul>,
                              ol: ({children}) => <ol className="list-decimal list-inside mb-3 space-y-1 text-slate-700">{children}</ol>,
                              li: ({children}) => <li className="leading-relaxed">{children}</li>,
                              strong: ({children}) => <strong className="font-semibold text-slate-900">{children}</strong>,
                              em: ({children}) => <em className="italic">{children}</em>,
                              blockquote: ({children}) => (
                                <blockquote className="border-l-4 border-slate-300 pl-4 my-3 italic text-slate-600">
                                  {children}
                                </blockquote>
                              ),
                              code: ({node, inline, className, children, ...props}: any) => {
                                return !inline ? (
                                  <div className="bg-slate-900 text-slate-100 p-4 rounded-lg my-4 overflow-x-auto font-mono text-xs leading-relaxed print:bg-slate-900 print:text-white break-inside-avoid">
                                    <pre className="whitespace-pre-wrap break-words">
                                      <code className={className} {...props}>
                                        {children}
                                      </code>
                                    </pre>
                                  </div>
                                ) : (
                                  <code className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded font-mono text-xs print:bg-slate-200" {...props}>
                                    {children}
                                  </code>
                                )
                              },
                              a: ({href, children}) => (
                                <a href={href} className="text-blue-600 underline hover:text-blue-800" target="_blank" rel="noopener noreferrer">
                                  {children}
                                </a>
                              ),
                              hr: () => <hr className="my-4 border-slate-200" />,
                              table: ({children}) => (
                                <div className="overflow-x-auto my-4">
                                  <table className="min-w-full border border-slate-200 rounded-lg overflow-hidden">
                                    {children}
                                  </table>
                                </div>
                              ),
                              th: ({children}) => <th className="bg-slate-100 px-4 py-2 text-left text-sm font-semibold text-slate-700 border-b border-slate-200">{children}</th>,
                              td: ({children}) => <td className="px-4 py-2 text-sm text-slate-700 border-b border-slate-100">{children}</td>,
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        {/* Document Footer */}
  <div className="border-t border-slate-100 px-8 py-4 bg-slate-50/50 print:bg-white">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Generated by Chat2PDF</span>
            <span>{date}</span>
          </div>
        </div>
      </div>
    </div>
  );
};