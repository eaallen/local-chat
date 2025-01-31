import { useState, useCallback } from 'react';
import { Message, ChatState } from '../types/chat';
import { chatService } from '../services/api';

export const useChat = () => {
    const [chatState, setChatState] = useState<ChatState>({
        messages: [],
        isLoading: false,
        error: null,
    });

    const sendMessage = useCallback(async (content: string) => {
        const userMessage: Message = {
            role: 'user',
            content,
        };

        setChatState(prev => ({
            ...prev,
            messages: [...prev.messages, userMessage],
            isLoading: true,
            error: null,
        }));

        try {
            const response = await chatService.generateResponse([...chatState.messages, userMessage]);
            const [think, content] = response.split("</think>");
            const assistantMessage: Message = {
                role: 'assistant',
                content: content,
                think: think,
            };

            setChatState(prev => ({
                ...prev,
                messages: [...prev.messages, assistantMessage],
                isLoading: false,
            }));
        } catch (error) {
            setChatState(prev => ({
                ...prev,
                isLoading: false,
                error: 'Failed to get response',
            }));
        }
    }, [chatState.messages]);

    return {
        messages: chatState.messages,
        isLoading: chatState.isLoading,
        error: chatState.error,
        sendMessage,
    };
};