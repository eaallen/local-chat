import React, { useState, useEffect } from 'react';
import { Input, Button, HStack, useToast } from '@chakra-ui/react';
import { AudioInput } from './AudioInput';
import { useAudioRecording } from '../hooks/useAudioRecording';

interface ChatInputProps {
    onSend: (message: string) => void;
    isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
    const [message, setMessage] = useState('');
    const toast = useToast();
    const { 
        isRecording, 
        error, 
        transcript, 
        pauseInSpeech,
        startRecording, 
        stopRecording 
    } = useAudioRecording();

    useEffect(() => {
        if (error) {
            toast({
                title: 'Error',
                description: error,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    }, [error, toast]);

    useEffect(() => {
        if (transcript) {
            setMessage(transcript);
        }
    }, [transcript]);

    useEffect(() => {
        if (pauseInSpeech && message.trim()) {
            onSend(message);
            setMessage('');
            stopRecording();
        }
    }, [pauseInSpeech, message, onSend, stopRecording]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSend(message);
            setMessage('');
        }
    };

    const handleOnMessageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        stopRecording();
        setMessage(e.target.value);
    }

    return (
        <form onSubmit={handleSubmit}>
            <HStack>
                <Input
                    value={message}
                    onChange={handleOnMessageInput}
                    placeholder="Type your message..."
                    disabled={isLoading}
                />
                <AudioInput
                    onStartRecording={startRecording}
                    onStopRecording={stopRecording}
                    isRecording={isRecording} />
                <Button
                    type="submit"
                    colorScheme="blue"
                    disabled={!message.trim() || isLoading}
                >
                    Send
                </Button>
            </HStack>
        </form>
    );
};