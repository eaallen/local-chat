import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface GoogleAuthContextType {
    isSignedIn: () => boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
    getAccessToken: () => string | null;
    contacts: Contact[];
    fetchContacts: () => Promise<void>;
    loadingContacts: boolean;
}

interface Contact {
    name: string;
    email: string;
    id: string;
}

const GoogleAuthContext = createContext<GoogleAuthContextType | null>(null);

const API_KEY = 'AIzaSyBJm2pNr7blx8R4NFvcwai-EslGlog6c2c';
const CLIENT_ID = '224994154044-9heg8fcotdv8l4fe926mts03eqsifjju.apps.googleusercontent.com';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/people/v1/rest';
const SCOPES = 'https://www.googleapis.com/auth/contacts.readonly https://www.googleapis.com/auth/gmail.readonly';

export const GoogleAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [gapiInited, setGapiInited] = useState(false);
    const [gisInited, setGisInited] = useState(false);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loadingContacts, setLoadingContacts] = useState(false);

    const initializeGapiClient = async () => {
        console.log("initializing gapi client");
        await window.gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: [DISCOVERY_DOC],
        });
        setGapiInited(true);
    };

    useEffect(() => {
        // Load the Google API client library
        window.gapi.load('client', initializeGapiClient);
    }, []);

    const signIn = useCallback(async () => {
        try {
            const client = window.google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: SCOPES,
                callback: (response) => {
                    setAccessToken(response.access_token);
                },
            });
            client.requestAccessToken();
        } catch (error) {
            console.error('Google Sign In Error:', error);
            throw error;
        }
    }, []);

    const signOut = useCallback(async () => {
        const token = window.gapi.client.getToken();
        if (token) {
            window.google.accounts.oauth2.revoke(token.access_token, () => {
                window.gapi.client.setToken(null);
                setAccessToken(null);
            });
        }
    }, []);

    const getAccessToken = useCallback(() => accessToken, [accessToken]);

    const fetchContacts = useCallback(async () => {
        if (!isSignedIn()) return;
        setLoadingContacts(true);
        try {
            const response = await window.gapi.client.people.people.connections.list({
                resourceName: 'people/me',
                pageSize: 1000,
                personFields: 'names,emailAddresses',
            });

            const connections = response.result.connections || [];
            const formattedContacts = connections
                .filter(person => person.emailAddresses && person.emailAddresses.length > 0)
                .map(person => ({
                    id: person.resourceName || '',
                    name: person.names?.[0]?.displayName || 'No Name',
                    email: person.emailAddresses?.[0]?.value || 'No Email',
                }))
                .sort((a, b) => a.name.localeCompare(b.name));

            setContacts(formattedContacts);
        } catch (error) {
            console.error('Failed to fetch contacts:', error);
        } finally {
            setLoadingContacts(false);
        }
    }, []);

    const isSignedIn = () => (window.gapi?.client?.getToken()?.access_token?.length ?? 0) > 0 && gapiInited;

    return (
        <GoogleAuthContext.Provider value={{
            isSignedIn,
            signIn,
            signOut,
            getAccessToken,
            contacts,
            fetchContacts,
            loadingContacts,
        }}>
            {children}
        </GoogleAuthContext.Provider>
    );
};

export const useGoogleAuth = () => {
    const context = useContext(GoogleAuthContext);
    if (!context) {
        throw new Error('useGoogleAuth must be used within a GoogleAuthProvider');
    }
    return context;
}; 