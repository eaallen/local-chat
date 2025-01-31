export interface Message {
    role: 'user' | 'assistant';
    content: string;
    think?: string;
}

export interface ChatState {
    messages: Message[];
    isLoading: boolean;
    error: string | null;
}