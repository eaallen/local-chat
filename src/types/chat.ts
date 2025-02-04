export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
    think?: string;
}

export interface ChatState {
    messages: Message[];
    isLoading: boolean;
    error: string | null;
}