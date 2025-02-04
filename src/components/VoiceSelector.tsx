import React, { useEffect, useState } from 'react';
import { Select } from '@chakra-ui/react';

interface VoiceSelectorProps {
    onVoiceChange: (voice: SpeechSynthesisVoice) => void;
    currentVoice?: SpeechSynthesisVoice;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({ onVoiceChange, currentVoice }) => {
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();

            setVoices(availableVoices.filter(voice => voice.lang.startsWith('en')));
        };

        // Load voices immediately
        loadVoices();

        // Add event listener for when voices change
        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => {
            window.speechSynthesis.onvoiceschanged = null;
        };
    }, []);

    return (
        <Select
            size="sm"
            value={currentVoice?.name || ''}
            onChange={(e) => {
                const selectedVoice = voices.find(voice => voice.name === e.target.value);
                if (selectedVoice) {
                    onVoiceChange(selectedVoice);
                }
            }}
            placeholder="Select voice"
            width="auto"
            minWidth="150px"
        >
            {voices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                </option>
            ))}
        </Select>
    );
}; 