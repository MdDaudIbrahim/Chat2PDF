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
    .replace(/\s*(Copy code|Copied!?)\s*/gi, '\n')
    .replace(/\s*(Read aloud|Stop generating)\s*/gi, ' ')
    .trim();
  
  // Detect and wrap code blocks that aren't already in markdown fences
  cleaned = detectAndWrapCodeBlocks(cleaned);
  
  return cleaned;
}

// Detect code patterns and wrap them in markdown code fences
function detectAndWrapCodeBlocks(content: string): string {
  // If content already has markdown code fences, return as-is
  if (/```[\s\S]*```/.test(content)) {
    return content;
  }

  const lines = content.split('\n');
  const result: string[] = [];
  let inCodeBlock = false;
  let codeBlockLines: string[] = [];
  let consecutiveNonCodeLines = 0;

  // Strong code indicators - these almost certainly indicate code
  const strongCodeIndicators = [
    // C# / .NET
    /^\s*(using\s+System|namespace\s+\w|class\s+\w+\s*[:{]|interface\s+\w+|public\s+class|private\s+class|protected\s+class|internal\s+class)/,
    /^\s*(public|private|protected|internal)\s+(static\s+)?(void|int|string|bool|double|float|decimal|var|async|Task|List|Dictionary|IEnumerable)/,
    /\{\s*get;\s*set;\s*\}/, // Auto-properties
    /^\s*(Console|Debug|Trace)\.(Write|Read|Print)/,
    
    // Java
    /^\s*(public|private|protected)\s+(static\s+)?(void|int|String|boolean|double|float|class|interface)\s+\w+/,
    /^\s*System\.out\.print/,
    /^\s*import\s+java\./,
    
    // Python
    /^\s*def\s+\w+\s*\([^)]*\)\s*:/,
    /^\s*class\s+\w+\s*(\([^)]*\))?\s*:/,
    /^\s*(from\s+\w+\s+)?import\s+\w+/,
    /^\s*print\s*\(/,
    /^\s*if\s+.*:\s*$/,
    /^\s*(elif|else)\s*:/,
    /^\s*for\s+\w+\s+in\s+.*:/,
    /^\s*while\s+.*:/,
    /^\s*try\s*:/,
    /^\s*(except|finally)\s*.*:/,
    /^\s*return\s+/,
    /^\s*@\w+/,  // Decorators
    
    // JavaScript / TypeScript
    /^\s*(const|let|var)\s+\w+\s*=/,
    /^\s*(function|async\s+function)\s+\w+\s*\(/,
    /^\s*(export|import)\s+(default\s+)?(const|let|var|function|class|interface|type)/,
    /^\s*console\.(log|error|warn|info|debug)\s*\(/,
    /=>\s*\{/,  // Arrow functions
    /^\s*(interface|type)\s+\w+\s*[={<]/,
    
    // C / C++
    /^\s*#include\s*[<"]/,
    /^\s*#define\s+\w+/,
    /^\s*(int|void|char|float|double|bool)\s+main\s*\(/,
    /^\s*printf\s*\(/,
    /^\s*scanf\s*\(/,
    /^\s*std::/,
    /^\s*cout\s*<</,
    /^\s*cin\s*>>/,
    
    // SQL
    /^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|TRUNCATE)\s+/i,
    /^\s*(FROM|WHERE|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|ORDER BY|GROUP BY|HAVING)\s+/i,
    
    // HTML/XML/JSX
    /^\s*<[a-zA-Z][a-zA-Z0-9]*(\s+[^>]*)?>.*<\/[a-zA-Z][a-zA-Z0-9]*>\s*$/,
    /^\s*<[a-zA-Z][a-zA-Z0-9]*(\s+[^>]*)?\/>\s*$/,
    /^\s*<\/?[a-zA-Z][a-zA-Z0-9]*[^>]*>\s*$/,
    
    // CSS
    /^\s*\.[a-zA-Z][\w-]*\s*\{/,
    /^\s*#[a-zA-Z][\w-]*\s*\{/,
    /^\s*@(media|keyframes|import|font-face)/,
    
    // Shell / Bash
    /^\s*\$\s+\w+/,
    /^\s*(echo|cd|ls|mkdir|rm|cp|mv|cat|grep|sed|awk|chmod|chown)\s+/,
    /^\s*#!\/bin\/(bash|sh|zsh)/,
    
    // Go
    /^\s*package\s+\w+/,
    /^\s*func\s+(\([^)]+\)\s*)?\w+\s*\(/,
    /^\s*import\s+\(/,
    /^\s*fmt\.(Print|Scan)/,
    
    // Rust
    /^\s*fn\s+\w+\s*\(/,
    /^\s*let\s+(mut\s+)?\w+\s*[=:]/,
    /^\s*use\s+\w+::/,
    /^\s*impl\s+/,
    /^\s*pub\s+(fn|struct|enum|trait)/,
    
    // Ruby
    /^\s*def\s+\w+/,
    /^\s*end\s*$/,
    /^\s*puts\s+/,
    /^\s*require\s+['"]/,
    
    // PHP
    /^\s*<\?php/,
    /^\s*\$\w+\s*=/,
    /^\s*(echo|print|var_dump|print_r)\s+/,
    /^\s*function\s+\w+\s*\(/,
  ];

  // Weak code indicators - need multiple of these together
  const weakCodeIndicators = [
    /^\s*[\{\}]\s*$/,  // Just braces
    /^\s*[\[\]]\s*$/,  // Just brackets
    /^\s*[();,]\s*$/,  // Just punctuation
    /^\s*\/\/.*$/,     // Single line comment
    /^\s*#(?!include|define|!).*$/,  // Hash comment (not preprocessor or shebang)
    /^\s*\/\*|\*\/\s*$/,  // Multi-line comment markers
    /^\s*\*\s+/,       // Javadoc-style comment continuation
    /^\s*\w+\s*\([^)]*\)\s*[;{]?\s*$/,  // Function call or definition
    /^\s*\w+\.\w+\s*\(/,  // Method call
    /^\s*\w+\s+\w+\s*=\s*.+;?\s*$/,  // Variable assignment with type
    /^\s*\w+\s*=\s*.+;?\s*$/,  // Simple assignment
    /^\s*return\s*;?\s*$/,  // Return statement
    /^\s*break\s*;?\s*$/,
    /^\s*continue\s*;?\s*$/,
    /;\s*$/,  // Ends with semicolon
    /^\s+\S/,  // Indented line (starts with whitespace)
  ];

  const languageHints: { pattern: RegExp; lang: string }[] = [
    { pattern: /Console\.(Write|Read)|using\s+System|namespace\s+\w|\{\s*get;\s*set;\s*\}|public\s+(class|interface|enum|struct)/, lang: 'csharp' },
    { pattern: /System\.out\.print|public\s+static\s+void\s+main|import\s+java\./, lang: 'java' },
    { pattern: /def\s+\w+.*:|print\s*\(|import\s+\w+|from\s+\w+\s+import|if\s+.*:$|for\s+\w+\s+in/, lang: 'python' },
    { pattern: /console\.(log|error|warn)|const\s+\w+\s*=|let\s+\w+\s*=|=>\s*[\{(]|require\s*\(|module\.exports/, lang: 'javascript' },
    { pattern: /interface\s+\w+\s*\{|type\s+\w+\s*=|:\s*(string|number|boolean|any)\b/, lang: 'typescript' },
    { pattern: /<html|<div|<span|<p\s*>|className=|onClick=/, lang: 'html' },
    { pattern: /SELECT\s+.*FROM|INSERT\s+INTO|CREATE\s+TABLE|ALTER\s+TABLE/i, lang: 'sql' },
    { pattern: /#include|printf\s*\(|scanf\s*\(|int\s+main\s*\(/, lang: 'c' },
    { pattern: /cout\s*<<|cin\s*>>|std::|#include\s*<iostream>/, lang: 'cpp' },
    { pattern: /func\s+\w+|package\s+main|fmt\.(Print|Scan)|import\s+\(/, lang: 'go' },
    { pattern: /fn\s+\w+|let\s+mut|use\s+\w+::|impl\s+\w+/, lang: 'rust' },
    { pattern: /\$\w+\s*=|<\?php|echo\s+|function\s+\w+\s*\(.*\)\s*\{/, lang: 'php' },
    { pattern: /^\s*\.[a-zA-Z][\w-]*\s*\{|@media|@keyframes/, lang: 'css' },
    { pattern: /^#!\/bin\/(bash|sh)|echo\s+|^\$\s+/, lang: 'bash' },
  ];

  function hasStrongCodeIndicator(line: string): boolean {
    return strongCodeIndicators.some(pattern => pattern.test(line));
  }

  function hasWeakCodeIndicator(line: string): boolean {
    return weakCodeIndicators.some(pattern => pattern.test(line));
  }

  function looksLikeCode(line: string): boolean {
    const trimmed = line.trim();
    if (!trimmed) return false; // Empty lines are neutral
    return hasStrongCodeIndicator(trimmed) || hasWeakCodeIndicator(trimmed);
  }

  function isDefinitelyNotCode(line: string): boolean {
    const trimmed = line.trim();
    if (!trimmed) return false;
    
    // Natural language patterns
    const naturalLanguagePatterns = [
      /^(This|That|The|A|An|It|Here|There|When|Where|What|Why|How|If|For|To|In|On|At|By|With|From|As|Is|Are|Was|Were|Has|Have|Had|Will|Would|Can|Could|Should|May|Might|Must|Do|Does|Did)\s+/i,
      /\?$/,  // Questions
      /^[A-Z][a-z]+\s+[a-z]+\s+[a-z]+/,  // Natural sentence pattern
      /^\d+\.\s+[A-Z]/,  // Numbered list items
      /^[-•]\s+[A-Z]/,   // Bullet points
      /^(Note|Warning|Tip|Important|Example|Output|Result|Summary|Explanation)[:.]?\s*/i,
    ];
    
    // If it matches natural language AND doesn't have code indicators
    if (naturalLanguagePatterns.some(p => p.test(trimmed)) && !hasStrongCodeIndicator(trimmed)) {
      return true;
    }
    
    return false;
  }

  function detectLanguage(codeLines: string[]): string {
    const codeText = codeLines.join('\n');
    for (const { pattern, lang } of languageHints) {
      if (pattern.test(codeText)) {
        return lang;
      }
    }
    return '';
  }

  function shouldStartCodeBlock(lineIndex: number): boolean {
    const line = lines[lineIndex];
    if (hasStrongCodeIndicator(line)) return true;
    
    // Check if multiple consecutive lines look like code
    let codeScore = 0;
    for (let i = lineIndex; i < Math.min(lineIndex + 4, lines.length); i++) {
      const checkLine = lines[i].trim();
      if (!checkLine) continue;
      if (hasStrongCodeIndicator(lines[i])) codeScore += 2;
      else if (hasWeakCodeIndicator(lines[i])) codeScore += 1;
      else if (isDefinitelyNotCode(lines[i])) codeScore -= 2;
    }
    return codeScore >= 3;
  }

  function flushCodeBlock() {
    if (codeBlockLines.length > 0) {
      // Only wrap if we have meaningful code (not just braces or empty lines)
      const meaningfulLines = codeBlockLines.filter(l => l.trim() && !/^[\{\}\[\]\(\)]+$/.test(l.trim()));
      if (meaningfulLines.length >= 1) {
        const lang = detectLanguage(codeBlockLines);
        result.push('```' + lang);
        result.push(...codeBlockLines);
        result.push('```');
      } else {
        // Not enough meaningful code, just add as regular text
        result.push(...codeBlockLines);
      }
    }
    codeBlockLines = [];
    inCodeBlock = false;
    consecutiveNonCodeLines = 0;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Already in markdown code fence
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) flushCodeBlock();
      result.push(line);
      continue;
    }

    if (!inCodeBlock) {
      if (shouldStartCodeBlock(i)) {
        inCodeBlock = true;
        codeBlockLines = [line];
        consecutiveNonCodeLines = 0;
      } else {
        result.push(line);
      }
    } else {
      // In code block - check if we should continue or end
      if (trimmed === '') {
        // Empty line - include in code block but track
        codeBlockLines.push(line);
      } else if (looksLikeCode(line)) {
        codeBlockLines.push(line);
        consecutiveNonCodeLines = 0;
      } else if (isDefinitelyNotCode(line)) {
        consecutiveNonCodeLines++;
        if (consecutiveNonCodeLines >= 1) {
          // Definitely not code - end the block
          flushCodeBlock();
          result.push(line);
        } else {
          codeBlockLines.push(line);
        }
      } else {
        // Ambiguous - include but track
        codeBlockLines.push(line);
        consecutiveNonCodeLines++;
        if (consecutiveNonCodeLines >= 2) {
          flushCodeBlock();
        }
      }
    }
  }

  // Handle remaining code block
  flushCodeBlock();

  return result.join('\n');
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
