import React, { useState } from 'react';
import { Box, Button, VStack, Text, Spinner } from '@chakra-ui/react';
import { useGoogleAuth } from '../contexts/GoogleAuthContext';
import { gmailService, GmailMessage } from '../services/gmail';

export const EmailList: React.FC = () => {
    const { getAccessToken, isSignedIn } = useGoogleAuth();
    const [emails, setEmails] = useState<GmailMessage[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchEmails = async () => {
        if (!isSignedIn) return;
        
        const token = getAccessToken();
        if (!token) return;

        setLoading(true);
        try {
            const messages = await gmailService.getEmails(token);
            setEmails(messages);
        } catch (error) {
            console.error('Failed to fetch emails:', error);
        } finally {
            setLoading(false);
        }
    };

    const getEmailSubject = (email: GmailMessage) => {
        return email.payload?.headers.find(h => h.name === 'Subject')?.value || 'No Subject';
    };

    const getEmailFrom = (email: GmailMessage) => {
        return email.payload?.headers.find(h => h.name === 'From')?.value || 'Unknown Sender';
    };

    return (
        <Box>
            <Button 
                onClick={fetchEmails} 
                isDisabled={!isSignedIn || loading}
                colorScheme="blue"
                mb={4}
            >
                {loading ? <Spinner size="sm" /> : 'Fetch Recent Emails'}
            </Button>

            <VStack spacing={2} align="stretch">
                {emails.map((email) => (
                    <Box 
                        key={email.id} 
                        p={4} 
                        borderWidth={1} 
                        borderRadius="md"
                        _hover={{ bg: 'gray.50' }}
                    >
                        <Text fontWeight="bold">{getEmailSubject(email)}</Text>
                        <Text fontSize="sm" color="gray.600">{getEmailFrom(email)}</Text>
                        <Text fontSize="sm" noOfLines={2}>{email.snippet}</Text>
                    </Box>
                ))}
            </VStack>
        </Box>
    );
}; 