import axios from 'axios';
import { Message } from '../types/chat';

const API_URL = 'http://localhost:11434/api';

export const chatService = {
    async generateResponse(messages: Message[]): Promise<string> {
        try {
            const response = await axios.post(`${API_URL}/generate`, {
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
    }
};