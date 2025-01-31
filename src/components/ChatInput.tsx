import React from 'react';
import { useState } from 'react';
import { Input, Button, HStack } from '@chakra-ui/react';

interface ChatInputProps {
    onSend: (message: string) => void;
    isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSend(message);
            setMessage('');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <HStack>
                <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    disabled={isLoading}
                />
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