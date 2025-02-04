import axios from 'axios';

const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1/users/me';
const PEOPLE_API_BASE = 'https://people.googleapis.com/v1/people/me/connections';

export interface GmailMessage {
    id: string;
    snippet: string;
    payload?: {
        headers: {
            name: string;
            value: string;
        }[];
    };
}

export interface GmailContact {
    name: string;
    email: string;
    id: string;
}

export interface EmailOptions {
    to: string;
    subject: string;
    body: string;
}

export const gmailService = {
    async getEmails(accessToken: string) {
        try {
            const response = await axios.get<{ messages: { id: string }[] }>(`${GMAIL_API_BASE}/messages`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                params: {
                    maxResults: 10,
                },
            });

            // Get details for each message
            const messages = await Promise.all(
                response.data.messages.map(async (msg) => {
                    const details = await axios.get<GmailMessage>(`${GMAIL_API_BASE}/messages/${msg.id}`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });
                    return details.data;
                })
            );

            return messages;
        } catch (error) {
            console.error('Gmail API Error:', error);
            throw error;
        }
    },

    async getContacts(accessToken: string): Promise<GmailContact[]> {
        try {
            const response = await axios.get(PEOPLE_API_BASE, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                params: {
                    personFields: 'names,emailAddresses',
                    pageSize: 100,
                },
            });

            return response.data.connections?.map((contact: any) => ({
                id: contact.resourceName,
                name: contact.names?.[0]?.displayName || 'No Name',
                email: contact.emailAddresses?.[0]?.value || 'No Email',
            })) || [];
        } catch (error) {
            console.error('Contacts API Error:', error);
            throw error;
        }
    },

    async sendEmail(accessToken: string, { to, subject, body }: EmailOptions): Promise<void> {
        try {
            // Create the email content in base64 format
            const email = [
                'Content-Type: text/plain; charset="UTF-8"\n',
                'MIME-Version: 1.0\n',
                `To: ${to}\n`,
                `Subject: ${subject}\n\n`,
                body
            ].join('');
            
            const encodedEmail = btoa(unescape(encodeURIComponent(email)))
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');

            await window.gapi.client.request({
                path: 'gmail/v1/users/me/messages/send',
                method: 'POST',
                body: {
                    raw: encodedEmail,
                },
            });
        } catch (error) {
            console.error('Failed to send email:', error);
            throw error;
        }
    },
}; 