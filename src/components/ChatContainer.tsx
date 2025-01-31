import React from 'react';
import { VStack, Box, Text } from '@chakra-ui/react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { useChat } from '../hooks/useChat';

export const ChatContainer: React.FC = () => {
    const { messages, isLoading, error, sendMessage } = useChat();

    return (
        <Box h="100vh" p={4}>
            <VStack h="full">
                <Box
                    flex={1}
                    w="full"
                    overflowY="auto"
                    borderWidth={1}
                    borderRadius="lg"
                    p={4}
                >
                    {messages.map((message, index) => (
                        <ChatMessage key={index} message={message} />
                    ))}
                    {error && (
                        <Text color="red.500" textAlign="center">
                            {error}
                        </Text>
                    )}
                </Box>
                <Box w="full" p={4}>
                    <ChatInput onSend={sendMessage} isLoading={isLoading} />
                </Box>
            </VStack>
        </Box>
    );
};