import React from 'react';
import { Box, Button, VStack, Text, Spinner } from '@chakra-ui/react';
import { useGoogleAuth } from '../contexts/GoogleAuthContext';
import { FaUser } from 'react-icons/fa';

export const Contacts: React.FC = () => {
    const { isSignedIn,  contacts, fetchContacts, loadingContacts } = useGoogleAuth();

    return (
        <VStack h="full" spacing={4}>
            <Button
                onClick={fetchContacts}
                isDisabled={!isSignedIn() || loadingContacts }
                colorScheme="blue"
                leftIcon={<FaUser />}
            >
                {loadingContacts ? <Spinner size="sm" /> : 'Fetch Contacts'}
            </Button>

            <Box w="full" overflowY="auto" borderWidth={1} borderRadius="lg" p={4}>
                <VStack spacing={2} align="stretch">
                    {contacts.map((contact) => (
                        <Box
                            key={contact.id}
                            p={3}
                            borderWidth={1}
                            borderRadius="md"
                            _hover={{ bg: 'gray.50' }}
                        >
                            <Text fontWeight="bold">{contact.name}</Text>
                            <Text color="gray.600">{contact.email}</Text>
                        </Box>
                    ))}
                </VStack>
            </Box>
        </VStack>
    );
}; 