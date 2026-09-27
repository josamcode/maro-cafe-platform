import { getApiClient } from '../../../lib/api';
export async function GET() {
  try {
    return Response.json(await getApiClient().getCatalog(), {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return Response.json({ error: 'Catalog unavailable' }, { status: 503 });
  }
}
