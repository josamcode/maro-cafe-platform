import { offersSchema, offerQuerySchema } from '@maro/contracts';
export async function GET(request: Request) {
  const input = offerQuerySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!input.success) return new Response(null, { status: 400 });
  try {
    const params = new URLSearchParams({ context: input.data.context });
    if (input.data.branch) params.set('branch', input.data.branch);
    const response = await fetch(new URL(`/v1/offers?${params}`, process.env.API_BASE_URL), {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error('Unavailable');
    return Response.json(offersSchema.parse(await response.json()), {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return Response.json([], { status: 503 });
  }
}
