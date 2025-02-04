import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { Message } from '../../types/chat';

interface UserMessageProps {
    message: Message;
}

export const UserMessage: React.FC<UserMessageProps> = ({ message }) => {
    return (
        <Box
            p={4}
            borderRadius="lg"
            maxW="80%"
            alignSelf="flex-end"
            mb={4}
            bg="blue.500"
            color="white"
        >
            <Text>{message.content}</Text>
        </Box>
    );
}; 