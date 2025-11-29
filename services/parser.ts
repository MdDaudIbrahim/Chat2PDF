import { ChatMessage, MessageRole } from "../types";

// Patterns to identify user messages
const USER_PATTERNS = [
  /^You\s*[:：]\s*/i,
  /^User\s*[:：]\s*/i,
  /^Human\s*[:：]\s*/i,
  /^Me\s*[:：]\s*/i,
  /^H\s*[:：]\s*/i,
  /^\[You\]\s*/i,
  /^\[User\]\s*/i,
  /^You said[:：]?\s*/i,
  /^You\s*$/i,  // Just "You" on its own line (common in ChatGPT exports)
];

// Patterns to identify AI/model messages
const MODEL_PATTERNS = [
  /^ChatGPT\s*[:：]?\s*/i,
  /^GPT[-\s]?4[o]?\s*[:：]?\s*/i,
  /^GPT[-\s]?3\.5\s*[:：]?\s*/i,
  /^Assistant\s*[:：]\s*/i,
  /^Claude\s*[:：]?\s*/i,
  /^Gemini\s*[:：]?\s*/i,
  /^Model\s*[:：]\s*/i,
  /^AI\s*[:：]\s*/i,
  /^Bot\s*[:：]\s*/i,
  /^Copilot\s*[:：]?\s*/i,
  /^GitHub Copilot\s*[:：]?\s*/i,
  /^Bing\s*[:：]?\s*/i,
  /^Perplexity\s*[:：]?\s*/i,
  /^A\s*[:：]\s*/i,
  /^\[Assistant\]\s*/i,
  /^\[ChatGPT\]\s*/i,
  /^ChatGPT said[:：]?\s*/i,
  /^ChatGPT\s*$/i,  // Just "ChatGPT" on its own line
  /^Claude\s*$/i,
  /^Gemini\s*$/i,
  /^Copilot\s*$/i,
];

// Junk patterns to remove (lines that match these are completely removed)
const JUNK_LINE_PATTERNS = [
  /^Copy code$/i,
  /^Copy$/i,
  /^Copied!?$/i,
  /^Regenerate response$/i,
  /^Regenerate$/i,
  /^Bad response$/i,
  /^Good response$/i,
  /^👍\s*$/,
  /^👎\s*$/,
  /^Share$/i,
  /^Edit$/i,
  /^Delete$/i,
  /^\d+\s*\/\s*\d+$/,  // Pagination like "1 / 3"
  /^Today at \d+:\d+\s*(AM|PM)?$/i,
  /^Yesterday at \d+:\d+\s*(AM|PM)?$/i,
  /^\d{1,2}:\d{2}\s*(AM|PM)?$/i,  // Timestamps
  /^Sent \d+ (minutes?|hours?|days?) ago$/i,
  /^•••$/,
  /^\.\.\.$/,
  /^Read aloud$/i,
  /^Stop generating$/i,
  /^Continue generating$/i,
  /^Skip to content$/i,
  /^Chat history$/i,
  /^New chat$/i,
  /^Upgrade plan$/i,
  /^Get Plus$/i,
  /^Upload[ed]?\s*(image|file)?$/i,
  /^Attach[ed]?\s*(image|file)?$/i,
  /^Search$/i,
  /^Reason$/i,
  /^Create image$/i,
  /^Search the web$/i,
  /^Deep research$/i,
  /^Think$/i,
  /^temporary chat$/i,
  /^ChatGPT Plus$/i,
  /^said[:：]?\s*$/i,  // Just "said:" alone
  /^Memory updated$/i,
  /^Generating\.\.\.$/i,
  /^Thinking\.\.\.$/i,
  /^Loading\.\.\.$/i,
];

// Junk phrases to remove from the beginning of content
const JUNK_PREFIXES = [
  /^said[:：]\s*/i,
  /^says[:：]\s*/i,
  /^replied[:：]\s*/i,
];

// Platform detection patterns
const PLATFORM_PATTERNS: { pattern: RegExp; platform: string }[] = [
  { pattern: /ChatGPT|GPT-4|GPT-3\.5/i, platform: 'ChatGPT' },
  { pattern: /Claude/i, platform: 'Claude' },
  { pattern: /Gemini/i, platform: 'Gemini' },
  { pattern: /Copilot|GitHub Copilot/i, platform: 'Copilot' },
  { pattern: /Perplexity/i, platform: 'Perplexity' },
  { pattern: /Bing/i, platform: 'Bing Chat' },
];

interface ParseResult {
  title: string;
  messages: ChatMessage[];
  platform?: string;
}

function isJunkLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return true;
  return JUNK_LINE_PATTERNS.some(pattern => pattern.test(trimmed));
}

function cleanContent(content: string): string {
  let cleaned = content;
  for (const pattern of JUNK_PREFIXES) {
    cleaned = cleaned.replace(pattern, '');
  }
  return cleaned.trim();
}

function detectRole(line: string): { role: MessageRole | null; content: string } {
  const trimmed = line.trim();
  
  // Check for user patterns
  for (const pattern of USER_PATTERNS) {
    if (pattern.test(trimmed)) {
      const content = cleanContent(trimmed.replace(pattern, ''));
      return { role: MessageRole.USER, content };
    }
  }
  
  // Check for model patterns
  for (const pattern of MODEL_PATTERNS) {
    if (pattern.test(trimmed)) {
      const content = cleanContent(trimmed.replace(pattern, ''));
      return { role: MessageRole.MODEL, content };
    }
  }
  
  return { role: null, content: trimmed };
}

function detectPlatform(text: string): string {
  for (const { pattern, platform } of PLATFORM_PATTERNS) {
    if (pattern.test(text)) {
      return platform;
    }
  }
  return 'AI Chat';
}

function generateTitle(messages: ChatMessage[]): string {
  // Find the first user message with meaningful content
  const firstUserMessage = messages.find(m => m.role === MessageRole.USER && m.content.length > 5);
  
  if (firstUserMessage) {
    // Take the first line or first ~50 characters
    let content = firstUserMessage.content.split('\n')[0].trim();
    // Remove common prefixes that got captured
    content = content.replace(/^(Skip to content|Chat history|You said[:：]?)\s*/i, '').trim();
    
    if (content.length <= 50) {
      return content || 'Conversation';
    }
    // Truncate at word boundary
    const truncated = content.substring(0, 50);
    const lastSpace = truncated.lastIndexOf(' ');
    return (lastSpace > 25 ? truncated.substring(0, lastSpace) : truncated) + '...';
  }
  
  return 'Imported Conversation';
}

function cleanMessageContent(content: string): string {
  // Remove common junk that gets mixed into messages
  let cleaned = content
    .replace(/^(Skip to content|Chat history)\s*/gi, '')
    .replace(/\s*(Copy code|Copied!?)\s*/gi, ' ')
    .replace(/\s*(Read aloud|Stop generating)\s*/gi, ' ')
    .trim();
  
  return cleaned;
}

export function parseConversationLocal(input: string): ParseResult {
  const lines = input.split('\n');
  const messages: ChatMessage[] = [];
  let currentRole: MessageRole | null = null;
  let currentContent: string[] = [];
  const platform = detectPlatform(input);
  let foundRoleIndicator = false;

  const pushCurrentMessage = () => {
    if (currentRole && currentContent.length > 0) {
      const rawContent = currentContent.join('\n').trim();
      const content = cleanMessageContent(rawContent);
      if (content && content.length > 0) {
        messages.push({
          role: currentRole,
          content
        });
      }
    }
    currentContent = [];
  };

  // First pass: check if there are ANY role indicators in the text
  for (const line of lines) {
    const { role } = detectRole(line);
    if (role !== null) {
      foundRoleIndicator = true;
      break;
    }
  }

  // If no role indicators found, treat the entire text as a single message
  if (!foundRoleIndicator) {
    const cleanedContent = cleanMessageContent(input.trim());
    if (cleanedContent) {
      messages.push({
        role: MessageRole.USER,
        content: cleanedContent
      });
    }
    const title = generateTitle(messages);
    return { title, messages, platform: 'Document' };
  }

  // Normal parsing when role indicators are found
  for (const line of lines) {
    // Skip junk lines entirely
    if (isJunkLine(line)) {
      continue;
    }

    const { role, content } = detectRole(line);

    if (role !== null) {
      // New speaker detected, save previous message
      pushCurrentMessage();
      currentRole = role;
      if (content) {
        currentContent.push(content);
      }
    } else if (currentRole !== null) {
      // Continue current message
      currentContent.push(line);
    } else {
      // No role detected yet, accumulate content
      if (line.trim()) {
        currentContent.push(line);
      }
    }
  }

  // Don't forget the last message
  pushCurrentMessage();

  // If we have accumulated content without a role at the start, prepend it
  if (messages.length === 0 && currentContent.length > 0) {
    const content = cleanMessageContent(currentContent.join('\n').trim());
    if (content) {
      messages.push({
        role: MessageRole.USER,
        content
      });
    }
  }

  // Clean up messages - merge consecutive messages from same role
  const mergedMessages = mergeConsecutiveMessages(messages);

  // If still no messages, treat entire input as a single message
  if (mergedMessages.length === 0 && input.trim()) {
    mergedMessages.push({
      role: MessageRole.USER,
      content: cleanMessageContent(input.trim())
    });
  }

  const title = generateTitle(mergedMessages);
  return { title, messages: mergedMessages, platform };
}

function mergeConsecutiveMessages(messages: ChatMessage[]): ChatMessage[] {
  if (messages.length === 0) return [];
  
  const merged: ChatMessage[] = [];
  let current = { ...messages[0] };
  
  for (let i = 1; i < messages.length; i++) {
    if (messages[i].role === current.role) {
      // Same role, merge content
      current.content += '\n\n' + messages[i].content;
    } else {
      // Different role, push current and start new
      merged.push(current);
      current = { ...messages[i] };
    }
  }
  merged.push(current);
  
  return merged;
}

// Simple validation
export function validateInput(input: string): { valid: boolean; error?: string } {
  const trimmed = input.trim();
  
  if (!trimmed) {
    return { valid: false, error: 'Please paste some text to convert.' };
  }
  
  if (trimmed.length < 10) {
    return { valid: false, error: 'The text is too short. Please paste a complete conversation.' };
  }

  // Check if it's a URL (we don't support URLs in offline mode)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return { valid: false, error: 'URL importing is not supported in offline mode. Please copy and paste the conversation text directly.' };
  }

  return { valid: true };
}
