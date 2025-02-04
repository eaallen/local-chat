interface Window {
    google: {
        accounts: {
            oauth2: {
                initTokenClient(config: {
                    client_id: string;
                    scope: string;
                    callback: (response: { access_token: string }) => void;
                }): {
                    requestAccessToken(): void;
                };
                revoke(token: string, callback: () => void): void;
            };
        };
    };
    gapi: {
        load(api: string, callback: () => void): void;
        client: {
            init(config: {
                apiKey: string;
                discoveryDocs: string[];
            }): Promise<void>;
            getToken(): { access_token: string } | null;
            setToken(token: { access_token: string } | null): void;
            people: {
                people: {
                    connections: {
                        list(params: {
                            resourceName: string;
                            pageSize: number;
                            personFields: string;
                        }): Promise<{
                            result: {
                                connections: Array<{
                                    resourceName?: string;
                                    names?: Array<{ displayName: string }>;
                                    emailAddresses?: Array<{ value: string }>;
                                }>;
                            };
                        }>;
                    };
                };
            };
        };
    };
} 