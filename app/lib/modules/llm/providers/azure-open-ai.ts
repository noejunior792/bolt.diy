import axios from 'axios';

interface OpenAIRequest {
  prompt: string;
  max_tokens?: number;
  temperature?: number;
}

interface OpenAIResponse {
  id: string;
  choices: Array<{ text: string }>;
}

const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT || '';
const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY || '';

if (!AZURE_OPENAI_ENDPOINT || !AZURE_OPENAI_API_KEY) {
  throw new Error('Azure OpenAI API endpoint or key is not configured.');
}

export async function generateText(request: OpenAIRequest): Promise<string> {
  try {
    const response = await axios.post<OpenAIResponse>(
      `${AZURE_OPENAI_ENDPOINT}/openai/deployments/YOUR_DEPLOYMENT_NAME/completions?api-version=2023-03-15-preview`,
      {
        prompt: request.prompt,
        max_tokens: request.max_tokens || 100,
        temperature: request.temperature || 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': AZURE_OPENAI_API_KEY,
        },
      },
    );

    return response.data.choices[0]?.text || '';
  } catch (error) {
    console.error('Error generating text with Azure OpenAI:', error);
    throw error;
  }
}
