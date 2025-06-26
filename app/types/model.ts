import type { ModelInfo } from '~/lib/modules/llm/types';

export type ProviderInfo = {
  staticModels: ModelInfo[];
  name: string;
  getDynamicModels?: (
    providerName: string,
    apiKeys?: Record<string, string>,
    providerSettings?: IProviderSetting,
    serverEnv?: Record<string, string>,
  ) => Promise<ModelInfo[]>;
  getApiKeyLink?: string;
  labelForGetApiKey?: string;
  icon?: string;
};

export interface IProviderSetting {
  enabled?: boolean;
  baseUrl?: string;
  azureOpenAIEndpoint?: string;
  azureOpenAIApiKey?: string;
}

export type IProviderConfig = ProviderInfo & {
  settings: IProviderSetting;
};

export type TextPart = {
  type: 'text';
  text: string;
};

export type ImagePart = {
  type: 'image_url';
  image_url: { url: string };
};

export type Part = TextPart | ImagePart;

export type MessageContent = string | Part[];

export type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: MessageContent;
};
