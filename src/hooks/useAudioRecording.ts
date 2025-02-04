import { useState, useCallback, useEffect, useRef } from 'react';
import { AudioState } from '../types/audio';

// Setup SpeechRecognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'en-US';

export const useAudioRecording = () => {
    const [audioState, setAudioState] = useState<AudioState>({
        isRecording: false,
        error: null,
        transcript: null,
    });
    const [pauseInSpeech, setPauseInSpeech] = useState(false);
    const pauseTimeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        console.log("useEffect");
        
        recognition.onresult = (event: SpeechRecognitionEvent) => {
            console.log('event', event);
            const transcript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');
            console.log('transcript', transcript);

            setPauseInSpeech(false);
            // Clear any existing timeout
            if (pauseTimeoutRef.current) {
                clearTimeout(pauseTimeoutRef.current);
            }

            // Set new timeout for pause detection
            pauseTimeoutRef.current = setTimeout(() => {
                if (transcript.trim()) {
                    console.log('Pause detected');
                    setPauseInSpeech(true);
                }
            }, 2000);

            setAudioState(prev => ({
                ...prev,
                transcript
            }));
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            setAudioState(prev => ({
                ...prev,
                error: 'Error occurred in recognition: ' + event.error,
                isRecording: false,
            }));
        };

        return () => {
            if (pauseTimeoutRef.current) {
                clearTimeout(pauseTimeoutRef.current);
            }
            recognition.stop();
        };
    }, []);

    const startRecording = useCallback(() => {
        try {
            setPauseInSpeech(false);
            recognition.start();
            setAudioState(prev => ({
                ...prev,
                isRecording: true,
                error: null,
            }));
        } catch (error) {
            setAudioState(prev => ({
                ...prev,
                error: 'Failed to start recording',
                isRecording: false,
            }));
        }
    }, []);

    const stopRecording = useCallback(() => {
        if (pauseTimeoutRef.current) {
            clearTimeout(pauseTimeoutRef.current);
        }
        recognition.stop();
        setAudioState(prev => ({
            ...prev,
            isRecording: false,
        }));
        setPauseInSpeech(false);
    }, []);

    return {
        isRecording: audioState.isRecording,
        error: audioState.error,
        transcript: audioState.transcript,
        pauseInSpeech,
        startRecording,
        stopRecording,
    };
}; 