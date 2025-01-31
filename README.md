# AI Chat App

A React-based chat interface for interacting with locally hosted Large Language Models (LLMs) via Ollama.

## Features

- Clean, modern UI built with React and Chakra UI
- TypeScript for type safety
- Markdown rendering for AI responses
- Collapsible "thinking" process display
- Real-time chat interface
- Integration with locally hosted LLMs through Ollama

## Prerequisites

- Node.js (v18+ recommended)
- [Ollama](https://ollama.ai/) installed locally
- DeepSeek model pulled in Ollama (`ollama pull deepseek-r1:7b`)

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-chat-app
```

2. Install dependencies:
```bash
npm install
```

3. Start Ollama in a separate terminal:
```bash
ollama serve
```

4. Start the development server:
```bash
npm start
```

The app will be available at `http://localhost:3000`

## Project Structure

```
src/
├── components/          # React components
│   ├── ChatContainer.tsx
│   ├── ChatInput.tsx
│   └── ChatMessage.tsx
├── services/           # API services
│   └── api.ts
├── hooks/              # Custom React hooks
│   └── useChat.ts
├── types/              # TypeScript types
│   └── chat.ts
└── App.tsx            # Root component
```

## Technologies Used

- React
- TypeScript
- Chakra UI
- Axios
- React Markdown
- Ollama API

## Development

The project uses:
- Create React App with TypeScript template
- Chakra UI for styling
- Axios for API calls
- React Markdown for rendering LLM responses

## License

MIT
