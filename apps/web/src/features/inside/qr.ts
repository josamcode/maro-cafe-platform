import QRCode from 'qrcode';

export function qrOrigin() {
  const url = new URL(process.env.WEB_ORIGIN ?? 'http://localhost:3100');
  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== '/' ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      'WEB_ORIGIN must be an HTTP(S) origin without credentials, path, query or fragment.',
    );
  }
  return url.origin;
}

export function branchUrl(branchSlug: string) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(branchSlug)) throw new Error('Invalid branch slug');
  return `${qrOrigin()}/in/${branchSlug}`;
}

export function branchQr(branchSlug: string) {
  return QRCode.toString(branchUrl(branchSlug), {
    type: 'svg',
    errorCorrectionLevel: 'M',
    margin: 4,
    width: 320,
    color: { dark: '#0C0B0AFF', light: '#FFFFFFFF' },
  });
}
