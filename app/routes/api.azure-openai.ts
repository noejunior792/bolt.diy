import { generateText } from '~/lib/api/azureOpenAI';

export async function action({ request }: { request: Request }) {
  const body = await request.json();
  const prompt = body.prompt;

  if (!prompt) {
    return new Response('Prompt is required', { status: 400 });
  }

  try {
    const responseText = await generateText({ prompt });
    return new Response(JSON.stringify({ response: responseText }), { status: 200 });
  } catch (error) {
    return new Response('Failed to generate text', { status: 500 });
  }
}
