import React, { useEffect, useState } from 'react';
import { Box, Button, Collapse, Text, HStack } from '@chakra-ui/react';
import Markdown from 'react-markdown';
import { Message } from '../../types/chat';
import { SpeechControls } from '../SpeechControls';
import { useSpeechSynthesis } from '../../contexts/SpeechContext';

interface AssistantMessageProps {
    message: Message;
    isLastMessage?: boolean;
}

export const AssistantMessage: React.FC<AssistantMessageProps> = ({ message, isLastMessage = false }) => {
    const [showThinking, setShowThinking] = useState(false);
    const { play } = useSpeechSynthesis();

    useEffect(() => {
        if (isLastMessage) {
            console.log("playing message");
            play(message.content);
        }
    }, [isLastMessage, message.content, play]);

    return (
        <Box
            p={4}
            borderRadius="lg"
            maxW="80%"
            alignSelf="flex-start"
            mb={4}
            bg="gray.100"
            color="black"
        >
            <HStack justify="space-between" mb={2}>
                {message.think && (
                    <Button 
                        size="sm" 
                        onClick={() => setShowThinking(!showThinking)}
                        variant="ghost"
                    >
                        {showThinking ? 'Hide Thinking' : 'Show Thinking'}
                    </Button>
                )}
                <SpeechControls text={message.content} />
            </HStack>
            
            {message.think && (
                <Collapse in={showThinking}>
                    <Box
                        p={2}
                        bg="gray.200"
                        borderRadius="md"
                        fontSize="sm"
                        mb={2}
                    >
                        <Text>{message.think}</Text>
                    </Box>
                </Collapse>
            )}
            <Markdown className="markdown">{message.content}</Markdown>
        </Box>
    );
}; 