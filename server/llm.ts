import { AzureOpenAI } from "openai";
import { ENV } from "./env";

// Recent API version: supports json_schema, tools and max_completion_tokens
// for gpt-4o, gpt-4.1 and gpt-5 deployments alike.
const API_VERSION = "2025-04-01-preview";

let client: AzureOpenAI | null = null;

export function getAzureOpenAI(): AzureOpenAI {
  if (!client) {
    if (!ENV.azureOpenaiEndpoint || !ENV.azureOpenaiKey) {
      throw new Error(
        "Azure OpenAI no está configurado. Verifica AZURE_OPENAI_ENDPOINT y AZURE_OPENAI_KEY."
      );
    }
    client = new AzureOpenAI({
      endpoint: ENV.azureOpenaiEndpoint,
      apiKey: ENV.azureOpenaiKey,
      apiVersion: API_VERSION,
    });
  }
  return client;
}

export type Role = "system" | "user" | "assistant" | "tool" | "function";

export type TextContent = { type: "text"; text: string };
export type ImageContent = {
  type: "image_url";
  image_url: { url: string; detail?: "auto" | "low" | "high" };
};
export type FileContent = {
  type: "file_url";
  file_url: { url: string; mime_type?: string };
};

export type MessageContent = string | TextContent | ImageContent | FileContent;

export type Message = {
  role: Role;
  content: MessageContent | MessageContent[];
  name?: string;
  tool_call_id?: string;
};

export type Tool = {
  type: "function";
  function: {
    name: string;
    description?: string;
    parameters?: Record<string, unknown>;
  };
};

export type ToolChoice =
  | "none"
  | "auto"
  | "required"
  | { name: string }
  | { type: "function"; function: { name: string } };

export type JsonSchema = {
  name: string;
  schema: Record<string, unknown>;
  strict?: boolean;
};

export type ResponseFormat =
  | { type: "text" }
  | { type: "json_object" }
  | { type: "json_schema"; json_schema: JsonSchema };

export type InvokeParams = {
  messages: Message[];
  tools?: Tool[];
  toolChoice?: ToolChoice;
  tool_choice?: ToolChoice;
  maxTokens?: number;
  max_tokens?: number;
  outputSchema?: JsonSchema;
  output_schema?: JsonSchema;
  responseFormat?: ResponseFormat;
  response_format?: ResponseFormat;
};

export type InvokeResult = {
  id: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: Role;
      content: string | Array<TextContent | ImageContent | FileContent>;
      tool_calls?: Array<{
        id: string;
        type: "function";
        function: { name: string; arguments: string };
      }>;
    };
    finish_reason: string | null;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

// Azure chat completions accept text and image parts only; files are passed as links.
function normalizePart(part: MessageContent): TextContent | ImageContent {
  if (typeof part === "string") return { type: "text", text: part };
  if (part.type === "file_url") {
    return { type: "text", text: `[Archivo adjunto: ${part.file_url.url}]` };
  }
  return part;
}

function normalizeMessage(message: Message) {
  const { role, name, tool_call_id } = message;
  const parts = Array.isArray(message.content)
    ? message.content
    : [message.content];

  if (role === "tool" || role === "function") {
    return {
      role: "tool" as const,
      tool_call_id,
      content: parts
        .map(p => (typeof p === "string" ? p : JSON.stringify(p)))
        .join("\n"),
    };
  }

  const normalized = parts.map(normalizePart);
  const content =
    normalized.length === 1 && normalized[0].type === "text"
      ? normalized[0].text
      : normalized;
  return { role, content, ...(name ? { name } : {}) };
}

function normalizeToolChoice(choice: ToolChoice | undefined, tools?: Tool[]) {
  if (!choice) return undefined;
  if (choice === "none" || choice === "auto") return choice;
  if (choice === "required") {
    return tools?.length === 1
      ? { type: "function" as const, function: { name: tools[0].function.name } }
      : "required";
  }
  if ("name" in choice) {
    return { type: "function" as const, function: { name: choice.name } };
  }
  return choice;
}

export async function invokeLLM(params: InvokeParams): Promise<InvokeResult> {
  const schema = params.outputSchema || params.output_schema;
  const responseFormat =
    params.responseFormat ||
    params.response_format ||
    (schema ? { type: "json_schema" as const, json_schema: schema } : undefined);

  const request: Record<string, unknown> = {
    model: ENV.azureOpenaiDeployment,
    messages: params.messages.map(normalizeMessage),
    max_completion_tokens: params.maxTokens ?? params.max_tokens ?? 4096,
  };
  if (params.tools?.length) request.tools = params.tools;
  const toolChoice = normalizeToolChoice(
    params.toolChoice || params.tool_choice,
    params.tools
  );
  if (toolChoice) request.tool_choice = toolChoice;
  if (responseFormat) request.response_format = responseFormat;

  const response = await getAzureOpenAI().chat.completions.create(
    request as never
  );
  return response as unknown as InvokeResult;
}
