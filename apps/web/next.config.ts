import type { NextConfig } from 'next';
import { fileURLToPath } from 'node:url';

const nextConfig: NextConfig = {
  outputFileTracingRoot: fileURLToPath(new URL('../../', import.meta.url)),
  transpilePackages: ['@maro/ui', '@maro/contracts', '@maro/api-client'],
  poweredByHeader: false,
  experimental: { serverActions: { bodySizeLimit: '8mb' } },
};
export default nextConfig;
