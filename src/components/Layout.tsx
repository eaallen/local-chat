import React from 'react';
import { Box, HStack, VStack } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';
import { GoogleSignInButton } from './GoogleSignInButton';

export const Layout: React.FC = () => {
    return (
        <Box h="100vh" p={4}>
            <VStack h="full" spacing={4}>
                <HStack w="full" justify="space-between">
                    <Navigation />
                    <GoogleSignInButton />
                </HStack>
                <Box flex={1} w="full">
                    <Outlet />
                </Box>
            </VStack>
        </Box>
    );
}; 