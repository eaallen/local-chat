import React from 'react';
import { HStack, Button } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { FaEnvelope, FaComment, FaAddressBook } from 'react-icons/fa';

export const Navigation: React.FC = () => {
    const location = useLocation();

    return (
        <HStack spacing={4}>
            <Button
                as={Link}
                to="/"
                leftIcon={<FaComment />}
                variant={location.pathname === '/' ? 'solid' : 'ghost'}
            >
                Chat
            </Button>
            <Button
                as={Link}
                to="/emails"
                leftIcon={<FaEnvelope />}
                variant={location.pathname === '/emails' ? 'solid' : 'ghost'}
            >
                Emails
            </Button>
            <Button
                as={Link}
                to="/contacts"
                leftIcon={<FaAddressBook />}
                variant={location.pathname === '/contacts' ? 'solid' : 'ghost'}
            >
                Contacts
            </Button>
        </HStack>
    );
}; 