import React, { useState, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';

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
    <div className="flex flex-col gap-4">
      {/* Label */}
      <label className="text-sm sm:text-base font-medium" htmlFor="conversation-input">
        Your Conversation
      </label>

      {/* Textarea */}
      <div className="relative min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
        <textarea
          id="conversation-input"
          className={`w-full h-full p-4 rounded-lg border ${
            isFocused ? 'border-primary ring-2 ring-primary/20' : 'border-border-light'
          } bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none resize-none font-mono text-sm transition-all shadow-sm`}
          placeholder="Paste your AI chat conversation here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {text && (
          <div className="absolute bottom-3 right-3 flex items-center gap-2 text-xs text-gray-500 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md border border-gray-200">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{charCount} chars</span>
          </div>
        )}
      </div>

      {/* Generate Button */}
      <button
        onClick={handleParse}
        disabled={!text.trim() || isParsing}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isParsing ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <ArrowRight className="w-4 h-4" />
            <span>Generate PDF Preview</span>
          </>
        )}
      </button>
    </div>
  );
};