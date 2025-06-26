import { generateText as generate } from '@ai-sdk/openai';
import { getProviderSettings } from '~/lib/api/settings';
import { AZURE_OPENAI_PROVIDER_ID } from '~/utils/constants';
import type { ChatMessage } from '~/types/azure-openai';

interface GenerateTextOptions {
  messages: ChatMessage[];
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export async function generateText({
  messages,
  model = 'gpt-4o', // Default model for Azure OpenAI
  maxTokens = 4096,
  temperature = 0.7,
}: GenerateTextOptions): Promise<string> {
  const settings = await getProviderSettings(AZURE_OPENAI_PROVIDER_ID);

  if (!settings?.azureOpenAIEndpoint || !settings?.azureOpenAIApiKey) {
    throw new Error('Azure OpenAI endpoint and API key are not configured.');
  }

  const result = await generate({
    model: model,
    messages: messages,
    maxTokens: maxTokens,
    temperature: temperature,
    baseUrl: `${settings.azureOpenAIEndpoint}/openai/deployments/${model}`,
    headers: {
      'api-key': settings.azureOpenAIApiKey,
    },
    defaultHeaders: {
      'api-version': '2024-05-01-preview',
    },
  });

  return result.text;
}
