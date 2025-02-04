import axios from 'axios';
import { Message } from '../types/chat';
import { definitions } from '../llmtools';

const API_URL = 'http://localhost:11434';

export const chatService = {
    async generateResponse(messages: Message[]): Promise<string> {
        try {
            const response = await axios.post(`${API_URL}/api/generate`, {
                model: "deepseek-r1:7b",
                prompt: messages[messages.length - 1].content,
                stream: false
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            return response.data.response;
        } catch (error) {
            console.error('Ollama API error:', error);
            throw new Error('Failed to generate response');
        }
    },

    chat: async (messages: Message[]): Promise<Message> => {
        const messagesToSend = messages.map(msg => ({
            role: msg.role,
            content: msg.content
        }));
        const lastMessage = messagesToSend[messagesToSend.length - 1];
        if (lastMessage) {
            lastMessage.content += "\n keep your response concise and to the point.";
        }
        try {
            const response = await axios.post(`${API_URL}/api/chat`, {
                model: "deepseek-r1:7b",
                messages: messagesToSend,
                stream: false,
                tools: definitions
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log("chat response", response)

            return response.data.message;
        } catch (error) {
            console.error('Ollama API error:', error);
            throw new Error('Failed to generate response');
        }
    },
    chatStream: async (messages: Message[], onChunk: (chunk: string) => void) => {
        const messagesToSend = messages.map(msg => ({
            role: msg.role,
            content: msg.content
        }));
        // messagesToSend.unshift({
        //     role: "system",
        //     content: `You are a helpful assistant. You have been given tools to help. You can ask for help if you are missing information to use a tool.
        //     `
        // })
        const lastMessage = messagesToSend[messagesToSend.length - 1];
        if (lastMessage) {
            // lastMessage.content += `\n keep your response concise and to the point.`
            
        }

        console.log("tools",  definitions.map(tool => ({
            type: "function",
            function: tool
        })))

        const response = await fetch(`${API_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: "llama3.2:3b",
                messages: messagesToSend,
                stream: true,
                tools: definitions.map(tool => ({
                    type: "function",
                    function: tool
                }))
            })
        });

        const reader = response.body?.getReader();
        if (!reader) return;

        const decoder = new TextDecoder();
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            onChunk(chunk);
        }
    }
};
