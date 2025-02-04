import { ToolCall } from '../types/llmTools';
import tools from './index';

export async function handleToolCall(
    tool: ToolCall,
): Promise<void> {
    const toolHandler = tools.find(toolItem => toolItem.definition.name === tool.name)?.handler;
    if (toolHandler) {
        await toolHandler(tool.parameters);
    } else {
        throw new Error(`Unknown tool: ${tool.name}`);
    }
}

export function parseToolCall(text: string): ToolCall | null {
    // Look for pattern: <tool>sendEmail</tool><parameters>{"recipientName": "John", ...}</parameters>
    const toolMatch = text.match(/<tool>(.*?)<\/tool>/);
    const paramsMatch = text.match(/<parameters>(.*?)<\/parameters>/);

    if (!toolMatch || !paramsMatch) {
        return null;
    }

    try {
        return {
            name: toolMatch[1],
            parameters: JSON.parse(paramsMatch[1]),
        };
    } catch (e) {
        console.error('Failed to parse tool call:', e);
        return null;
    }
} 