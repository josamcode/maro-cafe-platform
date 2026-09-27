import { intentSchema } from '@maro/contracts';
export async function POST(request: Request) {
  if (request.headers.get('sec-fetch-site') === 'cross-site')
    return new Response(null, { status: 403 });
  if (request.headers.get('dnt') === '1' || request.headers.get('sec-gpc') === '1')
    return new Response(null, { status: 204 });
  try {
    const reader = request.body?.getReader();
    if (!reader) return new Response(null, { status: 400 });
    const decoder = new TextDecoder();
    let text = '',
      bytes = 0;
    for (;;) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > 1024) {
        await reader.cancel();
        return new Response(null, { status: 413 });
      }
      text += decoder.decode(chunk.value, { stream: true });
    }
    text += decoder.decode();
    const data = intentSchema.safeParse(JSON.parse(text));
    if (!data.success) return new Response(null, { status: 400 });
    const response = await fetch(new URL('/v1/intent', process.env.API_BASE_URL), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data.data),
      signal: AbortSignal.timeout(3000),
    });
    return new Response(null, { status: response.ok ? 204 : response.status });
  } catch {
    return new Response(null, { status: 503 });
  }
}
