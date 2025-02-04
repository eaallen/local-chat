import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

interface SpeechState {
    isPlaying: boolean;
    isPaused: boolean;
    text: string | null;
    currentVoice?: SpeechSynthesisVoice;
}

interface SpeechContextType {
    isPlaying: boolean;
    isPaused: boolean;
    currentVoice?: SpeechSynthesisVoice;
    play: (text: string) => void;
    pause: () => void;
    resume: () => void;
    stop: () => void;
    restart: () => void;
    setVoice: (voice: SpeechSynthesisVoice) => void;
}

const SpeechContext = createContext<SpeechContextType | null>(null);

export const SpeechProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [speechState, setSpeechState] = useState<SpeechState>({
        isPlaying: false,
        isPaused: false,
        text: null,
        currentVoice: speechSynthesis.getVoices().find(voice => voice.name === 'Google UK English Male'),
    });
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        const synth = window.speechSynthesis;
        return () => {
            if (utteranceRef.current) {
                utteranceRef.current.onend = null;
                synth.cancel();
            }
        };
    }, []);

    const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
        setSpeechState(prev => ({
            ...prev,
            currentVoice: voice
        }));
    }, []);

    const play = useCallback((text: string) => {
        const synth = window.speechSynthesis;
        synth.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        if (speechState.currentVoice) {
            utterance.voice = speechState.currentVoice;
        }

        utterance.onend = () => {
            setSpeechState(prev => ({
                ...prev,
                isPlaying: false,
                isPaused: false,
            }));
        };
        
        utteranceRef.current = utterance;
        synth.speak(utterance);
        
        setSpeechState(prev => ({
            ...prev,
            isPlaying: true,
            isPaused: false,
            text,
        }));
    }, [speechState.currentVoice]);

    const pause = useCallback(() => {
        const synth = window.speechSynthesis;
        synth.pause();
        setSpeechState(prev => ({
            ...prev,
            isPaused: true,
        }));
    }, []);

    const resume = useCallback(() => {
        const synth = window.speechSynthesis;
        synth.resume();
        setSpeechState(prev => ({
            ...prev,
            isPaused: false,
        }));
    }, []);

    const stop = useCallback(() => {
        const synth = window.speechSynthesis;
        synth.cancel();
        setSpeechState(prev => ({
            ...prev,
            isPlaying: false,
            isPaused: false,
            text: null,
        }));
    }, []);

    const restart = useCallback(() => {
        if (speechState.text) {
            play(speechState.text);
        }
    }, [speechState.text, play]);

    const value = {
        isPlaying: speechState.isPlaying,
        isPaused: speechState.isPaused,
        currentVoice: speechState.currentVoice,
        play,
        pause,
        resume,
        stop,
        restart,
        setVoice,
    };

    return (
        <SpeechContext.Provider value={value}>
            {children}
        </SpeechContext.Provider>
    );
};

export const useSpeechSynthesis = () => {
    const context = useContext(SpeechContext);
    if (!context) {
        throw new Error('useSpeechSynthesis must be used within a SpeechProvider');
    }
    return context;
}; 