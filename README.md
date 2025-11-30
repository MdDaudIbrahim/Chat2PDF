<p align="center">
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
</p>

<h1 align="center">📄 Chat2PDF</h1>

<p align="center">
  <strong>Convert AI chat conversations into beautiful, printable PDFs — instantly and privately.</strong>
</p>

<p align="center">
  <a href="https://chat2pdfs.netlify.app/">🌐 Live Demo</a> •
  <a href="#-features">Features</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-tech-stack">Tech Stack</a>
</p>

---

## 🎯 What is Chat2PDF?

Chat2PDF is a **privacy-first** web application that transforms your conversations with AI assistants (ChatGPT, Claude, Gemini, Copilot, etc.) into professional, clean PDF documents. 

**Everything happens in your browser** — your conversations never leave your device.

<p align="center">
  <img src="https://img.shields.io/badge/✓-No_Sign_Up_Required-success?style=flat-square" />
  <img src="https://img.shields.io/badge/✓-100%25_Free-success?style=flat-square" />
  <img src="https://img.shields.io/badge/✓-Works_Offline-success?style=flat-square" />
  <img src="https://img.shields.io/badge/✓-No_Data_Collection-success?style=flat-square" />
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔒 **100% Private** | All processing happens locally in your browser. No servers, no uploads, no tracking. |
| ⚡ **Instant Conversion** | Paste your chat and get a beautiful preview in milliseconds. No API calls or waiting. |
| 🌐 **Universal Support** | Works with ChatGPT, Claude, Gemini, Copilot, Perplexity, and any text-based conversation. |
| 💻 **Code Highlighting** | Automatic syntax highlighting for code blocks in 20+ programming languages. |
| 📱 **Fully Responsive** | Beautiful experience on desktop, tablet, and mobile devices. |
| 📚 **Chat History** | Save and manage multiple conversations locally with a ChatGPT-style sidebar. |
| 🎨 **Markdown Support** | Renders bold, italic, lists, tables, and other markdown formatting. |
| 🖨️ **Print Optimized** | Professional A4 output with proper margins and page breaks. |

---

## 🚀 Quick Start

### Use Online (Recommended)
Simply visit **[chat2pdfs.netlify.app](https://chat2pdfs.netlify.app/)** — no installation required!

### Run Locally

```bash
# Clone the repository
git clone https://github.com/MdDaudIbrahim/Chat2PDF.git

# Navigate to the project
cd Chat2PDF

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

---

## 📖 How to Use

<table>
<tr>
<td align="center" width="33%">

### 1️⃣ Copy
Select and copy your entire conversation from ChatGPT, Claude, or any AI assistant.

</td>
<td align="center" width="33%">

### 2️⃣ Paste
Open Chat2PDF and paste your conversation into the text area.

</td>
<td align="center" width="33%">

### 3️⃣ Export
Click "Print / Save PDF" to download or print your beautifully formatted conversation.

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | Frontend UI framework |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS** | Utility-first styling |
| **Vite** | Fast build tool & dev server |
| **Lucide Icons** | Beautiful icon library |
| **LocalStorage API** | Browser-based data persistence |

---

## 📁 Project Structure

```
Chat2PDF/
├── components/
│   ├── Button.tsx          # Reusable button component
│   ├── ChatInput.tsx       # Text input area for conversations
│   ├── ChatPreview.tsx     # PDF preview with markdown rendering
│   ├── HistorySidebar.tsx  # ChatGPT-style history sidebar
│   └── HomePage.tsx        # Landing page with features & FAQ
├── services/
│   ├── parser.ts           # Chat parsing & code detection logic
│   ├── storage.ts          # LocalStorage management
│   └── gemini.ts           # API service (optional)
├── App.tsx                 # Main application component
├── types.ts                # TypeScript type definitions
├── index.tsx               # Application entry point
└── index.html              # HTML template with print styles
```

---

## 💡 Use Cases

- 📚 **Learning & Documentation** — Save technical tutorials and explanations
- 💼 **Professional Records** — Archive work-related AI consultations  
- ✍️ **Creative Writing** — Preserve story ideas and writing collaborations
- 🔬 **Research** — Document research discussions and findings
- 🎓 **Education** — Create study materials from AI tutoring sessions
- 📋 **Interviews** — Save mock interview practice sessions

---

## 🌟 Why Chat2PDF?

| Other Solutions | Chat2PDF |
|-----------------|----------|
| ❌ Require API keys | ✅ No API keys needed |
| ❌ Need account signup | ✅ No registration required |
| ❌ Send data to servers | ✅ 100% local processing |
| ❌ Monthly subscriptions | ✅ Completely free forever |
| ❌ Limited exports | ✅ Unlimited conversions |

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  <strong>Made with ❤️ by <a href="https://daudibrahim.com/">Md. Daud Ibrahim</a></strong>
</p>

<p align="center">
  <a href="https://github.com/MdDaudIbrahim">
    <img src="https://img.shields.io/badge/GitHub-MdDaudIbrahim-181717?style=for-the-badge&logo=github" alt="GitHub" />
  </a>
  <a href="https://www.facebook.com/md.daud1brahim/">
    <img src="https://img.shields.io/badge/Facebook-md.daud1brahim-1877F2?style=for-the-badge&logo=facebook&logoColor=white" alt="Facebook" />
  </a>
  <a href="https://daudibrahim.com/">
    <img src="https://img.shields.io/badge/Website-daudibrahim.com-2b6cee?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Website" />
  </a>
</p>
