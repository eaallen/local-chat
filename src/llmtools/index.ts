import emailTool from './email';
import { handleToolCall } from './handleCallForTool';


const tools = [
    emailTool,
];
export default tools;

export const handlers = tools.map(tool => tool.handler);

export const definitions = tools.map(tool => tool.definition);
export const callTool = handleToolCall
