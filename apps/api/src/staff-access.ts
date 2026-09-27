import type { FastifyRequest } from 'fastify';
import type { StaffAuth } from '@maro/backend';
export async function requireStaff(auth: StaffAuth, request: FastifyRequest) {
  const user = await auth.authenticate(
    request.headers.authorization?.replace(/^Bearer /, '') ?? '',
  );
  if (!user) throw Object.assign(new Error('Sign in required.'), { statusCode: 401 });
  return user;
}
