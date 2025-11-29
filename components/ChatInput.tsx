import React, { useState, useCallback } from 'react';
import { FileText, ArrowRight, Zap, Sparkles } from 'lucide-react';
import { Button } from './Button';

interface ChatInputProps {
  onParse: (text: string) => void;
  isParsing: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onParse, isParsing }) => {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleParse = useCallback(() => {
    if (!text.trim()) return;
    onParse(text);
  }, [text, onParse]);

  const charCount = text.length;
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="relative bg-white rounded-2xl shadow-lg border border-slate-200/60 flex flex-col h-full min-h-[400px] lg:min-h-[520px] overflow-hidden transition-all duration-200 hover:shadow-2xl hover:border-slate-300/60">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-emerald-50/50 to-teal-50/50">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200/50">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-slate-800 text-sm">Instant Parser</h3>
          <p className="text-xs text-slate-500">No API key • Works offline</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${text.trim() ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'} transition-colors duration-200`}>
          {text.trim() ? 'Ready' : 'Empty'}
        </div>
      </div>

      {/* Content Area */}
  <div className="flex-1 p-5 flex flex-col min-h-0 overflow-y-auto">
        <div className="flex-1 flex flex-col">
          <div className="mb-3 bg-blue-50/80 text-blue-800 px-4 py-3 rounded-xl text-xs border border-blue-100/80 flex items-start gap-2 backdrop-blur-sm">
            <div className="mt-0.5"><FileText className="w-4 h-4" /></div>
            <p><strong>Quick tip:</strong> Copy entire chat (Ctrl+A → Ctrl+C) and paste below</p>
          </div>
          
          <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">
            Paste Conversation
          </label>
          <div className="relative flex-1">
            <textarea
              className={`flex-1 w-full h-full min-h-[200px] lg:min-h-[320px] p-4 rounded-xl border-2 ${isFocused ? 'border-emerald-400 bg-white' : 'border-slate-200 bg-slate-50/50'} text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none font-mono text-sm transition-all duration-200 leading-relaxed shadow-inner`}
              placeholder={`Example:

You: How do I center a div in CSS?

ChatGPT: Great question! Here are the best methods:

1. **Flexbox** (Recommended)
\`\`\`css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
\`\`\`

2. **Grid**
\`\`\`css
.container {
  display: grid;
  place-items: center;
}
\`\`\``}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            {text && (
              <div className="absolute bottom-3 right-3 flex items-center gap-2 text-xs text-slate-400 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg border border-slate-200/60">
                <span>{wordCount} words</span>
                <span>•</span>
                <span>{charCount} chars</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-5 border-t border-slate-100 bg-gradient-to-r from-slate-50/70 to-transparent sticky bottom-0 left-0 right-0 shadow-[0_-8px_24px_rgba(15,23,42,0.05)]">
        <Button 
          onClick={handleParse} 
          disabled={!text.trim() || isParsing}
          isLoading={isParsing}
          icon={<ArrowRight className="w-4 h-4" />}
          className="w-full shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {isParsing ? 'Processing...' : 'Generate PDF Preview'}
        </Button>
      </div>
    </div>
  );
};