import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, MessageRole } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

export const parseConversation = async (input: string): Promise<{ title: string, messages: ChatMessage[] }> => {
  const ai = getClient();
  const isUrl = input.trim().startsWith('http');

  let prompt = '';
  let tools = [];

  if (isUrl) {
    prompt = `
      I will provide you with a URL.
      Your task is to:
      1. Access the URL using Google Search.
      2. If it is a public chat log (like OpenAI Share, Gemini Public link), extract the conversation.
      3. If the content is behind a login wall or inaccessible, return a title of "Error" and a single system message explaining that the URL could not be read and the user should paste the text instead.
      4. If accessible, structure it into the JSON format specified.
      5. Identify the speakers (User/Model).
      6. Create a relevant title.
      
      URL to parse: ${input}
    `;
    tools = [{ googleSearch: {} }];
  } else {
    prompt = `
      You are an expert data parser. Your task is to take a raw, unstructured text dump of a conversation between a human (User) and an AI (Model) and structure it into a clean JSON format.
      
      The text is likely a "Select All + Copy" dump from ChatGPT, Claude, Gemini, or GitHub Copilot. 
      It may contain timestamps like "Today at 2:00 PM", avatars, "Copy code" buttons text, or messy formatting.
      
      Rules:
      1. Identify the speakers. "You", "User" -> user. "ChatGPT", "Claude", "Gemini", "Model" -> model.
      2. Extract the message content strictly. 
      3. **Important**: Preserve all markdown (code blocks, bolding, lists) inside the content. Do not summarize the content.
      4. Remove "junk" text like "Regenerate response", "Copy code", "Bad response", or UI elements that got copied.
      5. Create a short, professional title for the conversation based on the topic.
      
      Return strictly JSON matching the schema.
    `;
  }

  const userContent = isUrl 
    ? { role: 'user', parts: [{ text: prompt }] }
    : { role: 'user', parts: [{ text: prompt }, { text: `Here is the raw text to parse:\n\n${input}` }] };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: isUrl ? [userContent] : [
        { role: 'user', parts: [{ text: prompt }] },
        { role: 'user', parts: [{ text: `Here is the raw text to parse:\n\n${input}` }] }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A short title for the chat session" },
            messages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  role: { type: Type.STRING, enum: ["user", "model", "system"] },
                  content: { type: Type.STRING, description: "The verbatim content of the message" }
                },
                required: ["role", "content"]
              }
            }
          },
          required: ["title", "messages"]
        },
        ...(isUrl ? { tools } : {})
      }
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      
      // Basic validation for empty URL results
      if (parsed.messages.length === 0) {
        throw new Error("Could not extract any messages. Please try pasting the text instead.");
      }

      return {
        title: parsed.title,
        messages: parsed.messages.map((m: any) => ({
          role: m.role as MessageRole,
          content: m.content
        }))
      };
    }
    throw new Error("No valid JSON response from model.");
  } catch (error) {
    console.error("Error parsing conversation:", error);
    throw error;
  }
};