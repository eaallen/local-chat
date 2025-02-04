import { Tool, ToolCall, ToolHandlerParams } from '../types/llmTools';




const emailTool: Tool = {
    definition: {
        name: 'sendEmail',
        description: 'Send an email to a contact from your contact list',
        parameters: {
            type: 'object',
            properties: {
                recipientName: {
                    type: 'string',
                    description: 'The name of the contact to send the email to (must match a name in contacts)',
                },
                subject: {
                    type: 'string',
                    description: 'The subject line of the email',
                },
                body: {
                    type: 'string',
                    description: 'The main content of the email',
                },
            },
            required: ['recipientName', 'subject', 'body'],
        },
    },
    async handler(params){
        const { recipientName, subject, body } = params as { recipientName: string, subject: string, body: string };
        console.log(`Email sent successfully to ${recipientName}`);
        return;
    }
}

export default emailTool;