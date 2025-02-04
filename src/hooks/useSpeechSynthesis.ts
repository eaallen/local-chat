import { useState, useCallback, useEffect, useRef } from 'react';

interface SpeechState {
    isPlaying: boolean;
    isPaused: boolean;
    text: string | null;
    currentVoice?: SpeechSynthesisVoice;
}

export const useSpeechSynthesis = () => {
    const [speechState, setSpeechState] = useState<SpeechState>({
        isPlaying: false,
        isPaused: false,
        text: null,
    });
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        // Initialize speech synthesis
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
        console.log('play', text);
        
        const synth = window.speechSynthesis;
        
        // Cancel any ongoing speech
        synth.cancel();
        
        // Create new utterance
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
        console.log("about to speak", utterance);
        
        synth.speak(utterance);
        console.log("spoke");
        
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
        setSpeechState({
            isPlaying: false,
            isPaused: false,
            text: null,
        });
    }, []);

    const restart = useCallback(() => {
        if (speechState.text) {
            play(speechState.text);
        }
    }, [speechState.text, play]);

    return {
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
}; 