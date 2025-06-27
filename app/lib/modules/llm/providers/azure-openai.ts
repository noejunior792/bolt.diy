import { BaseProvider } from '~/lib/modules/llm/base-provider';
import type { ModelInfo } from '~/lib/modules/llm/types';
import type { IProviderSetting } from '~/types/model';
import type { LanguageModelV1 } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export default class AzureOpenAIProvider extends BaseProvider {
  name = 'Azure OpenAI';
  getApiKeyLink = 'https://portal.azure.com/';

  config = {
    baseUrlKey: 'AZURE_OPENAI_ENDPOINT',
    apiTokenKey: 'AZURE_OPENAI_API_KEY',
    deploymentNameKey: 'AZURE_OPENAI_DEPLOYMENT_NAME',
    apiVersionKey: 'AZURE_OPENAI_API_VERSION',
  };

  staticModels: ModelInfo[] = []; // Azure models are typically dynamic based on deployment

  async getDynamicModels(
    apiKeys?: Record<string, string>,
    settings?: IProviderSetting,
    serverEnv?: Record<string, string>,
  ): Promise<ModelInfo[]> {
    const baseUrl =
      settings?.baseUrl ||
      serverEnv?.AZURE_OPENAI_ENDPOINT;

    const apiKey =
      apiKeys?.[this.name] ||
      serverEnv?.AZURE_OPENAI_API_KEY;

    const deploymentName =
      settings?.customConfiguration?.AZURE_OPENAI_DEPLOYMENT_NAME ||
      serverEnv?.AZURE_OPENAI_DEPLOYMENT_NAME;

    const apiVersion =
      settings?.customConfiguration?.AZURE_OPENAI_API_VERSION ||
      serverEnv?.AZURE_OPENAI_API_VERSION;

    if (!baseUrl || !apiKey || !deploymentName || !apiVersion) {
      return [];
    }

    // Azure OpenAI does not have a public API to list deployments/models directly.
    // Models are tied to deployments. We'll assume the deployment name is the model name.
    // In a real scenario, you might have a predefined list or fetch from a custom management API.
    return [
      {
        name: deploymentName,
        label: `${deploymentName} (Azure)`,
        provider: this.name,
        maxTokenAllowed: 8000, // Default, can be overridden if known
      },
    ];
  }

  getModelInstance(options: {
    model: string;
    serverEnv: Env;
    apiKeys?: Record<string, string>;
    providerSettings?: Record<string, IProviderSetting>;
  }): LanguageModelV1 {
    const { model, serverEnv, apiKeys, providerSettings } = options;

    const { baseUrl, apiKey } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings: providerSettings?.[this.name],
      serverEnv: serverEnv as any,
      defaultBaseUrlKey: 'AZURE_OPENAI_ENDPOINT',
      defaultApiTokenKey: 'AZURE_OPENAI_API_KEY',
    });

    const deploymentName =
      providerSettings?.[this.name]?.customConfiguration?.AZURE_OPENAI_DEPLOYMENT_NAME ||
      serverEnv?.AZURE_OPENAI_DEPLOYMENT_NAME;

    const apiVersion =
      providerSettings?.[this.name]?.customConfiguration?.AZURE_OPENAI_API_VERSION ||
      serverEnv?.AZURE_OPENAI_API_VERSION;

    if (!baseUrl || !apiKey || !deploymentName || !apiVersion) {
      throw new Error(`Missing configuration for ${this.name} provider. Ensure AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY, AZURE_OPENAI_DEPLOYMENT_NAME, and AZURE_OPENAI_API_VERSION are set.`);
    }

    const azureOpenai = createOpenAI({
      baseURL: `${baseUrl}/openai/deployments/${deploymentName}`,
      apiKey,
      defaultHeaders: { 'api-key': apiKey },
      defaultQuery: { 'api-version': apiVersion },
    });

    return azureOpenai(deploymentName);
  }
}
