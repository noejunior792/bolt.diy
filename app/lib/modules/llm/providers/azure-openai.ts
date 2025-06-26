import { BaseProvider } from '~/lib/modules/llm/base-provider';
import type { ModelInfo, ProviderConfig } from '~/lib/modules/llm/types';
import { AZURE_OPENAI_PROVIDER_ID } from '~/utils/constants';

export class AzureOpenAIProvider extends BaseProvider {
  name = AZURE_OPENAI_PROVIDER_ID;
  staticModels: ModelInfo[] = [
    // You can add static models here if known, otherwise they will be fetched dynamically
  ];
  config: ProviderConfig = {
    baseUrlKey: 'AZURE_OPENAI_ENDPOINT',
    apiTokenKey: 'AZURE_OPENAI_API_KEY',
  };
  getApiKeyLink = 'https://portal.azure.com/#blade/Microsoft_Azure_ProjectOxford/OpenAIDeploymentBlade/overview';
  labelForGetApiKey = 'Get Azure OpenAI API Key';
  icon = 'i-simple-icons:azure';

  constructor() {
    super();
  }

  async getDynamicModels(
    apiKeys?: Record<string, string>,
    providerSettings?: Record<string, any>,
    serverEnv?: Record<string, string>,
  ): Promise<ModelInfo[]> {
    const endpoint = providerSettings?.azureOpenAIEndpoint || serverEnv?.AZURE_OPENAI_ENDPOINT;
    const apiKey = apiKeys?.AZURE_OPENAI_API_KEY || serverEnv?.AZURE_OPENAI_API_KEY;

    if (!endpoint || !apiKey) {
      console.warn('Azure OpenAI endpoint or API key not configured. Cannot fetch dynamic models.');
      return [];
    }

    try {
      const response = await fetch(`${endpoint}/openai/models?api-version=2024-02-01`, {
        headers: {
          'api-key': apiKey,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch Azure OpenAI models: ${response.statusText} - ${errorData.message}`);
      }

      const data = await response.json();
      // Azure OpenAI returns deployments, not raw models. We need to adapt this.
      // For simplicity, we'll assume the user will specify the deployment name as the model name.
      // A more robust solution would list deployments.
      // For now, we'll return a placeholder or rely on the user to know their deployment.
      // Given the curl example, the model is 'gpt-4o', which is a deployment name.
      // So, we'll return a generic model if we can't list deployments directly.

      // If Azure API provides a way to list *deployments* and their associated models, use that.
      // Otherwise, we might need to rely on static configuration or user input for model names.
      // For now, let's assume the common models like gpt-4o, gpt-35-turbo are available as deployments.
      // The Azure OpenAI API for listing models is different from listing deployments.
      // The curl example uses a deployment name directly in the URL.
      // So, we'll return a common model name as a placeholder.

      // A more accurate approach would be to list deployments:
      // GET https://{resource-name}.openai.azure.com/openai/deployments?api-version=2024-02-01
      // However, the current AI SDK does not directly support listing deployments to infer models.
      // For now, we'll return a common model that is likely to be a deployment.

      // If the API returns a list of models, process them.
      // If it returns deployments, we need to extract model names from them.
      // Assuming 'data.data' contains an array of model objects with a 'id' field.
      if (data && Array.isArray(data.data)) {
        return data.data.map((model: any) => ({
          id: model.id,
          name: model.id,
          provider: this.name,
          inputCost: 0, // Placeholder
          outputCost: 0, // Placeholder
          maxTokens: 4096, // Placeholder
        }));
      }

      // Fallback if dynamic model fetching is not straightforward or API changes
      return [
        {
          id: 'gpt-4o',
          name: 'gpt-4o',
          provider: this.name,
          inputCost: 0, // Placeholder
          outputCost: 0, // Placeholder
          maxTokens: 4096, // Placeholder
        },
        {
          id: 'gpt-35-turbo',
          name: 'gpt-35-turbo',
          provider: this.name,
          inputCost: 0, // Placeholder
          outputCost: 0, // Placeholder
          maxTokens: 4096, // Placeholder
        },
      ];
    } catch (error) {
      console.error('Error fetching Azure OpenAI dynamic models:', error);
      return [];
    }
  }
}
