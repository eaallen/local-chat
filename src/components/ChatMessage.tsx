import React, { useState } from 'react';
import { Box, Text, Button, Collapse } from '@chakra-ui/react';
import Markdown from 'react-markdown';
import { Message } from '../types/chat';

interface ChatMessageProps {
    message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const [showThinking, setShowThinking] = useState(false);

    return (
        <Box
            p={4}
            borderRadius="lg"
            maxW="80%"
            alignSelf={message.role === 'user' ? 'flex-end' : 'flex-start'}
            mb={4}
            bg={message.role === 'user' ? 'blue.500' : 'gray.100'}
            color={message.role === 'user' ? 'white' : 'black'}
        >
            {message.role === 'user' ? (
                <Text>{message.content}</Text>
            ) : (
                <>
                    {message.think && (
                        <Box mb={2}>
                            <Button 
                                size="sm" 
                                onClick={() => setShowThinking(!showThinking)}
                                variant="ghost"
                                mb={2}
                            >
                                {showThinking ? 'Hide Thinking' : 'Show Thinking'}
                            </Button>
                            <Collapse in={showThinking}>
                                <Box
                                    p={2}
                                    bg="gray.200"
                                    borderRadius="md"
                                    fontSize="sm"
                                >
                                    <Text>{message.think}</Text>
                                </Box>
                            </Collapse>
                        </Box>
                    )}
                        <Markdown className="markdown">{message.content}</Markdown>
                </>
            )}
        </Box>
    );
};