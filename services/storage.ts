import { ChatSession } from "../types";

const STORAGE_KEY = 'chat2pdf_history';

export const getHistory = (): ChatSession[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load history", e);
    return [];
  }
};

export const saveSession = (session: ChatSession): ChatSession[] => {
  try {
    const history = getHistory();
    // Check if session already exists, update it
    const index = history.findIndex(h => h.id === session.id);
    let newHistory;
    
    if (index >= 0) {
      newHistory = [...history];
      newHistory[index] = session;
    } else {
      newHistory = [session, ...history];
    }

    // Limit to last 50 items
    if (newHistory.length > 50) {
      newHistory = newHistory.slice(0, 50);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    return newHistory;
  } catch (e) {
    console.error("Failed to save session", e);
    return getHistory();
  }
};

export const deleteSession = (id: string): ChatSession[] => {
  try {
    const history = getHistory();
    const newHistory = history.filter(h => h.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    return newHistory;
  } catch (e) {
    console.error("Failed to delete session", e);
    return getHistory();
  }
};