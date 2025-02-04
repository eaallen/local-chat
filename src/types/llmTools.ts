export interface ToolDefinition {
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: Record<string, {
            type: string;
            description: string;
            enum?: string[];
        }>;
        required: string[];
    };
}

export type ToolHandlerParams = Record<string, any>;

export interface ToolCall {
    name: string;
    parameters: ToolHandlerParams;
}

export interface Tool {
    definition: ToolDefinition;
    handler: (params: ToolHandlerParams) => Promise<void>;
}