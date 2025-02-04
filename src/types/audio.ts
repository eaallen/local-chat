export interface AudioState {
    isRecording: boolean;
    error: string | null;
    transcript: string | null;
}

export interface WitAiResponse {
    text: string;
    intents: Array<{
        name: string;
        confidence: number;
    }>;
    entities: Record<string, any>;
}

// Add type definitions for the Web Speech API
declare global {
    interface Window {
        SpeechRecognition: typeof SpeechRecognition;
        webkitSpeechRecognition: typeof SpeechRecognition;
    }
} 