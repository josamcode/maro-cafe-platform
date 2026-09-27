import { getPublicBranch } from '../../../../lib/catalog';
import { branchQr } from '../../../../features/inside/qr';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ branchSlug: string }> },
) {
  const { branchSlug } = await params;
  if (!(await getPublicBranch(branchSlug))) return new Response('Unknown branch', { status: 404 });
  const download = new URL(request.url).searchParams.get('download') === '1';
  return new Response(await branchQr(branchSlug), {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="maro-${branchSlug}-qr.svg"`,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
