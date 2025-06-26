import { generateText } from '~/lib/api/azureOpenAI';
import type { ChatMessage } from '~/types/azure-openai';

export async function action({ request }: { request: Request }) {
  const body = await request.json();
  const { messages, model, maxTokens, temperature } = body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return new Response('Messages are required and must be an array', { status: 400 });
  }

  try {
    const responseText = await generateText({ messages, model, maxTokens, temperature });
    return new Response(JSON.stringify({ response: responseText }), { status: 200 });
  } catch (error: any) {
    console.error('Failed to generate text:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
