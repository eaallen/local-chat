import React from 'react';
import { HStack, IconButton } from '@chakra-ui/react';
import { FaPlay, FaPause, FaStop, FaRedo } from 'react-icons/fa';
import { useSpeechSynthesis } from '../contexts/SpeechContext';
import { VoiceSelector } from './VoiceSelector';

interface SpeechControlsProps {
    text: string;
}

export const SpeechControls: React.FC<SpeechControlsProps> = ({ text }) => {
    const { 
        isPlaying, 
        isPaused, 
        currentVoice,
        play, 
        pause, 
        resume, 
        stop, 
        restart,
        setVoice 
    } = useSpeechSynthesis();

    return (
        <HStack spacing={2}>
            <VoiceSelector 
                onVoiceChange={setVoice}
                currentVoice={currentVoice}
            />
            {!isPlaying || isPaused ? (
                <IconButton
                    aria-label="Play"
                    icon={<FaPlay />}
                    size="sm"
                    onClick={() => isPaused ? resume() : play(text)}
                />
            ) : (
                <IconButton
                    aria-label="Pause"
                    icon={<FaPause />}
                    size="sm"
                    onClick={pause}
                />
            )}
            <IconButton
                aria-label="Stop"
                icon={<FaStop />}
                size="sm"
                onClick={stop}
                isDisabled={!isPlaying && !isPaused}
            />
            <IconButton
                aria-label="Restart"
                icon={<FaRedo />}
                size="sm"
                onClick={restart}
                isDisabled={!isPlaying && !isPaused}
            />
        </HStack>
    );
}; 