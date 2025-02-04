import React from 'react';
import { Box, IconButton, Text } from '@chakra-ui/react';
import { FaMicrophone, FaStop } from 'react-icons/fa';

interface AudioInputProps {
    onStartRecording: () => void;
    onStopRecording: () => void;
    isRecording: boolean;
}

export const AudioInput: React.FC<AudioInputProps> = ({ onStartRecording, onStopRecording, isRecording }) => {

    return (
        <Box>
            <IconButton
                aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
                icon={isRecording ? <FaStop /> : <FaMicrophone />}
                colorScheme={isRecording ? 'red' : 'blue'}
                onClick={isRecording ? onStopRecording : onStartRecording}
                isRound
                size="lg"
                mx={2}
            />
        </Box>
    );
}; 