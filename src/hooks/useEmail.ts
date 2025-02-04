import { useCallback } from 'react';
import { useGoogleAuth } from '../contexts/GoogleAuthContext';
import { gmailService, EmailOptions } from '../services/gmail';

export const useEmail = () => {
    const { isSignedIn, contacts } = useGoogleAuth();

    const sendEmail = useCallback(async (options: EmailOptions) => {
        if (!isSignedIn()) {
            throw new Error('Must be signed in to send emails');
        }

        const token = window.gapi.client.getToken()?.access_token;
        if (!token) {
            throw new Error('No access token available');
        }

        await gmailService.sendEmail(token, options);
    }, [isSignedIn]);

    const findContactByName = useCallback((name: string) => {
        return contacts.find(contact => 
            contact.name.toLowerCase().includes(name.toLowerCase())
        );
    }, [contacts]);

    return {
        sendEmail,
        findContactByName,
    };
}; 