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
            const message = await chatService.chat([...chatState.messages, userMessage]);
            const [think, content] = message.content.split("</think>");
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

export const useChatStream = () => {
    const [chatState, setChatState] = useState<ChatState>({
        messages: [],
        isLoading: false,
        error: null,
    });

    const sendMessageStream = useCallback((
        content: string,
        onResponse: (message: string, done: boolean) => void,
        onThought: (thought: string) => void
    ) => {
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

        let message = "";
        chatService.chatStream([...chatState.messages, userMessage], (chunk) => {
            console.log("chunk callback", JSON.parse(chunk))
            const data = JSON.parse(chunk);
            message += data.message.content;
            if (message.includes("</think>")) {
                // this is the full content, after the think
                onResponse(message.split("</think>")[1], data.done);
            } else if (message.includes("<think>")) {
                const thought = message.split("<think>")[1].split("</think>")[0];
                onThought(thought);
            } else {
                // there is no think
                onResponse(message, data.done);
            }
            if (data.done) {
                let think = "";
                let content = message;
                if (message.includes("</think>")) {
                    [think, content] = message.split("</think>");
                }

                setChatState(prev => ({
                    ...prev,
                    messages: [...prev.messages, { role: 'assistant', content, think }],
                    isLoading: false,
                }));
            }
        });

    }, [chatState.messages]);

    return {
        messages: chatState.messages,
        isLoading: chatState.isLoading,
        error: chatState.error,
        sendMessageStream,
    };
}