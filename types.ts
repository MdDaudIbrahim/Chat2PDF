export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system'
}

export interface ChatMessage {
  role: MessageRole;
  content: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  platform?: string; // 'ChatGPT' | 'Claude' | 'Gemini' etc.
  createdAt: number;
}

export enum ParsingStatus {
  IDLE = 'idle',
  PARSING = 'parsing',
  SUCCESS = 'success',
  ERROR = 'error'
}