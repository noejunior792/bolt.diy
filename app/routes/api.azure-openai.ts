import { generateText } from '~/lib/api/azureOpenAI';

export async function action({ request }: { request: Request }) {
  const body = await request.json();
  const { prompt, model, maxTokens, temperature } = body;

  if (!prompt) {
    return new Response('Prompt is required', { status: 400 });
  }

  try {
    const responseText = await generateText({ prompt, model, maxTokens, temperature });
    return new Response(JSON.stringify({ response: responseText }), { status: 200 });
  } catch (error: any) {
    console.error('Failed to generate text:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
