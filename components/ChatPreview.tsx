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
    <div className="print:h-auto print:overflow-visible">
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

      {/* Document Canvas - Clean PDF Style */}
      <div id="print-area" className="bg-white shadow-2xl rounded-3xl border border-slate-200/80 mx-auto w-full max-w-[210mm] overflow-auto transition-shadow duration-300 hover:shadow-3xl print:shadow-none print:rounded-none print:border-none print:max-w-none print:m-0 print:p-0 print:overflow-visible">

        {/* Chat Messages - Clean Layout */}
        <div className="px-8 py-4 space-y-3 print:px-0 print:py-0 print:space-y-1">
          {messages.map((msg, index) => {
            const isUser = msg.role === MessageRole.USER;
            const roleLabel = msg.role === MessageRole.SYSTEM ? 'System' : isUser ? 'You' : 'Assistant';
            
            return (
              <article key={index} className="message-block message-card border-l-4 pl-4 print:border-l-2 print:pl-2 print:mb-2" style={{
                borderLeftColor: isUser ? '#64748b' : '#10b981'
              }}>
                {/* Simple Header */}
                <div className="flex items-center gap-2 mb-1 print:mb-0.5">
                  <span className="text-sm font-bold print:text-xs" style={{
                    color: isUser ? '#64748b' : '#10b981'
                  }}>{roleLabel}</span>
                </div>
                
                {/* Message Content */}
                <div className="prose prose-sm max-w-none prose-slate">
                  <ReactMarkdown 
                            components={{
                              p: ({children}) => <p className="mb-1 print:mb-0.5 last:mb-0 leading-normal print:leading-snug text-slate-700">{children}</p>,
                              h1: ({children}) => <h1 className="text-xl font-bold text-slate-900 mb-1 mt-2 print:mt-1 first:mt-0">{children}</h1>,
                              h2: ({children}) => <h2 className="text-lg font-bold text-slate-900 mb-1 mt-2 print:mt-1 first:mt-0">{children}</h2>,
                              h3: ({children}) => <h3 className="text-base font-semibold text-slate-900 mb-1 mt-1.5 print:mt-1 first:mt-0">{children}</h3>,
                              ul: ({children}) => <ul className="list-disc list-inside mb-1.5 print:mb-1 space-y-0.5 text-slate-700">{children}</ul>,
                              ol: ({children}) => <ol className="list-decimal list-inside mb-1.5 print:mb-1 space-y-0.5 text-slate-700">{children}</ol>,
                              li: ({children}) => <li className="leading-normal print:leading-snug">{children}</li>,
                              strong: ({children}) => <strong className="font-semibold text-slate-900">{children}</strong>,
                              em: ({children}) => <em className="italic">{children}</em>,
                              blockquote: ({children}) => (
                                <blockquote className="border-l-4 border-slate-300 pl-4 my-1.5 print:my-1 italic text-slate-600">
                                  {children}
                                </blockquote>
                              ),
                              code: ({node, inline, className, children, ...props}: any) => {
                                return !inline ? (
                                  <div className="bg-slate-900 text-slate-100 p-3 print:p-2 rounded-lg my-2 print:my-1.5 overflow-x-auto font-mono text-xs leading-normal print:leading-snug print:bg-slate-900 print:text-white break-inside-avoid">
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
                              hr: () => <div className="my-2 h-px bg-slate-200 print:hidden print:m-0 print:h-0" aria-hidden="true" />,
                              table: ({children}) => (
                                <div className="overflow-x-auto my-2 print:my-1.5">
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
              </article>
            );
          })}
        </div>

        {/* Document Footer - Simple */}
        <div className="border-t border-slate-200 px-8 py-3 print:px-0 print:py-1">
          <div className="flex items-center justify-between text-xs text-slate-500 print:text-[8pt]">
            <span>Chat2PDF</span>
            <span>{date}</span>
          </div>
        </div>
      </div>
    </div>
  );
};