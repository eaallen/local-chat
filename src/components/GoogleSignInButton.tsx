import React from 'react';
import { Button } from '@chakra-ui/react';
import { FaGoogle } from 'react-icons/fa';
import { useGoogleAuth } from '../contexts/GoogleAuthContext';

export const GoogleSignInButton: React.FC = () => {
    const { isSignedIn, signIn, signOut } = useGoogleAuth();

    return (
        <Button
            leftIcon={<FaGoogle />}
            colorScheme="red"
            onClick={isSignedIn() ? signOut : signIn}
        >
            {isSignedIn() ? 'Sign Out' : 'Sign in with Google'}
        </Button>
    );
}; 