import React, { useCallback, useEffect, useState, useRef } from 'react';
import { VStack, Box, Text } from '@chakra-ui/react';
import { ChatInput } from './ChatInput';
import { useChatStream } from '../hooks/useChat';
import { UserMessage } from './messages/UserMessage';
import { AssistantMessage } from './messages/AssistantMessage';
import { ThinkingMessage } from './messages/ThinkingMessage';
import { GoogleSignInButton } from './GoogleSignInButton';
import { useEmail } from '../hooks/useEmail';

export const ChatContainer: React.FC = () => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { sendMessageStream, messages, isLoading, error } = useChatStream();
    const { sendEmail, findContactByName } = useEmail();
    const [assistantResponse] = useState<string>("");
    const [thinking, setThinking] = useState<string>("");
    const [isDone, setIsDone] = useState<boolean>(false);

    const onResponse = useCallback((message: string, done: boolean) => {
        setIsDone(done);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, assistantResponse, thinking]);

    useEffect(() => {
        console.log('messages', messages);
        const lastMessage = messages.at(-1);
        if (lastMessage && lastMessage.role === 'assistant') {
            console.log('lastMessage', lastMessage);
        }
    }, [messages]);

    // const handleSendMessage = useCallback((message: string) => {
    //     sendMessageStream(
    //         message, 
    //         onResponse, 
    //         setThinking, 
    //         { sendEmail, findContactByName }
    //     );
    // }, [sendMessageStream, onResponse, setThinking, sendEmail, findContactByName]);

    return (
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
                    message.role === 'assistant' ? (
                        <AssistantMessage
                            key={index}
                            message={message}
                            isLastMessage={index === messages.length - 1}
                        />
                    ) : <UserMessage key={index} message={message} />
                ))}

                {!isDone && thinking && (
                    <ThinkingMessage
                        message={thinking}
                        displayLength={100}
                    />
                )}
                {error && (
                    <Text color="red.500" textAlign="center">
                        {error}
                    </Text>
                )}
                <div ref={messagesEndRef} />
            </Box>
            <Box w="full" p={4}>
                <ChatInput onSend={(message) => {
                    setIsDone(false);
                    setThinking("");
                    sendMessageStream(message, onResponse, setThinking)
                }} isLoading={isLoading} />
            </Box>
        </VStack>
    );
};