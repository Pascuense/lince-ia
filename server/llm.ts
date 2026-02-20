/**
 * LINCE — LLM Integration via Azure OpenAI Service
 * Reemplaza completamente la integración con forge.manus.im
 */
import { AzureOpenAI } from "openai";
import { ENV } from "./env";

let client: AzureOpenAI | null = null;

function getClient(): AzureOpenAI {
  if (!client) {
    if (!ENV.azureOpenaiEndpoint || !ENV.azureOpenaiKey) {
      throw new Error("Azure OpenAI no está configurado. Verifica AZURE_OPENAI_ENDPOINT y AZURE_OPENAI_KEY.");
    }
    client = new AzureOpenAI({
      endpoint: ENV.azureOpenaiEndpoint,
      apiKey: ENV.azureOpenaiKey,
      apiVersion: "2024-08-01-preview",
    });
  }
  return client;
}

// ─── Types ───
export type MessageRole = "system" | "user" | "assistant" | "tool" | "function";

export type TextContent = { type: "text"; text: string };
export type ImageContent = { type: "image_url"; image_url: { url: string; detail?: "auto" | "low" | "high" } };

export type MessageContent = string | TextContent | ImageContent;

export type Message = {
  role: MessageRole;
  name?: string;
  tool_call_id?: string;
  content: MessageContent | MessageContent[];
};

export type Tool = {
  type: "function";
  function: {
    name: string;
    description?: string;
    parameters?: Record<string, unknown>;
  };
};

export type ResponseFormat =
  | { type: "text" }
  | { type: "json_object" }
  | { type: "json_schema"; json_schema: { name: string; schema: Record<string, unknown>; strict?: boolean } };

export interface InvokeParams {
  messages: Message[];
  tools?: Tool[];
  tool_choice?: string | { type: string; function: { name: string } };
  toolChoice?: string | { type: string; function: { name: string } };
  response_format?: ResponseFormat;
  responseFormat?: ResponseFormat;
  max_tokens?: number;
}

export interface InvokeResult {
  choices: Array<{
    message: {
      role: string;
      content: string | null;
      tool_calls?: Array<{
        id: string;
        type: string;
        function: { name: string; arguments: string };
      }>;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// ─── Normalize helpers ───
function normalizeMessages(messages: Message[]): any[] {
  return messages.map((msg) => {
    const parts = Array.isArray(msg.content) ? msg.content : [msg.content];
    const normalized = parts.map((part) => {
      if (typeof part === "string") return { type: "text" as const, text: part };
      return part;
    });
    // If single text, collapse to string for compatibility
    if (normalized.length === 1 && normalized[0].type === "text") {
      return { role: msg.role, content: (normalized[0] as TextContent).text, ...(msg.name ? { name: msg.name } : {}), ...(msg.tool_call_id ? { tool_call_id: msg.tool_call_id } : {}) };
    }
    return { role: msg.role, content: normalized, ...(msg.name ? { name: msg.name } : {}), ...(msg.tool_call_id ? { tool_call_id: msg.tool_call_id } : {}) };
  });
}

/**
 * Invoke Azure OpenAI LLM.
 * Drop-in replacement for the Manus invokeLLM function.
 */
export async function invokeLLM(params: InvokeParams): Promise<InvokeResult> {
  const azureClient = getClient();
  const deployment = ENV.azureOpenaiDeployment;

  const requestParams: any = {
    model: deployment,
    messages: normalizeMessages(params.messages),
    max_tokens: params.max_tokens ?? 4096,
  };

  if (params.tools && params.tools.length > 0) {
    requestParams.tools = params.tools;
  }

  const toolChoice = params.tool_choice || params.toolChoice;
  if (toolChoice) {
    requestParams.tool_choice = toolChoice;
  }

  const responseFormat = params.response_format || params.responseFormat;
  if (responseFormat) {
    requestParams.response_format = responseFormat;
  }

  const response = await azureClient.chat.completions.create(requestParams);

  return response as unknown as InvokeResult;
}
