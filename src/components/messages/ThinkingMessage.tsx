import React from 'react';
import { Box, Text } from '@chakra-ui/react';

interface ThinkingMessageProps {
    message: string;
    displayLength: number;
}

export const ThinkingMessage: React.FC<ThinkingMessageProps> = ({ message, displayLength }) => {
    return (
        <Box
            p={4}
            borderRadius="lg"
            maxW="80%"
            alignSelf="flex-start"
            mb={4}
            bg="gray.50"
            color="gray.600"
        >
            <Text fontStyle="italic">
                Thinking: ...{message.slice(-displayLength)}
            </Text>
        </Box>
    );
}; 