import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { ChatContainer } from './components/ChatContainer';
import { EmailList } from './components/EmailList';
import { Layout } from './components/Layout';
import { SpeechProvider } from './contexts/SpeechContext';
import { GoogleAuthProvider } from './contexts/GoogleAuthContext';
import { Contacts } from './components/Contacts';

function App() {
    return (
        <BrowserRouter>
            <GoogleAuthProvider>
                <SpeechProvider>
                    <Box>
                        <Routes>
                            <Route path="/" element={<Layout />}>
                                <Route index element={<ChatContainer />} />
                                <Route path="emails" element={<EmailList />} />
                                <Route path="contacts" element={<Contacts />} />
                            </Route>
                        </Routes>
                    </Box>
                </SpeechProvider>
            </GoogleAuthProvider>
        </BrowserRouter>
    );
}

export default App;
