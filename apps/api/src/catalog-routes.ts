import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { z } from 'zod';
import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import type { CatalogEditor, StaffAuth } from '@maro/backend';
import {
  catalogResponseSchema,
  productWriteSchema,
  loginSchema,
  sessionSchema,
  staffSchema,
} from '@maro/contracts';

export async function registerCatalogRoutes(
  server: FastifyInstance,
  editor: CatalogEditor,
  auth: StaffAuth,
  uploadDir: string,
) {
  const app = server.withTypeProvider<ZodTypeProvider>();
  const token = (request: FastifyRequest) =>
    request.headers.authorization?.replace(/^Bearer /, '') ?? '';
  async function staff(request: FastifyRequest) {
    const user = await auth.authenticate(token(request));
    if (!user) throw Object.assign(new Error('Sign in required.'), { statusCode: 401 });
    return user;
  }
  app.get(
    '/v1/catalog',
    {
      config: { rateLimit: { max: 1000, timeWindow: '1 minute' } },
      schema: { response: { 200: catalogResponseSchema } },
    },
    () => editor.read(),
  );
  app.post(
    '/v1/staff/login',
    {
      config: { rateLimit: { max: 10, timeWindow: '1 minute' } },
      schema: { body: loginSchema, response: { 200: sessionSchema } },
    },
    async (request) => {
      const session = await auth.login(request.body.username, request.body.password);
      if (!session) throw Object.assign(new Error('Invalid credentials.'), { statusCode: 401 });
      return session;
    },
  );
  app.get('/v1/staff/me', { schema: { response: { 200: staffSchema } } }, staff);
  app.post('/v1/staff/logout', async (request, reply) => {
    await staff(request);
    await auth.logout(token(request));
    return reply.code(204).send();
  });
  app.get(
    '/v1/staff/catalog',
    {
      schema: { response: { 200: catalogResponseSchema } },
    },
    async (request) => {
      await staff(request);
      return editor.read(true);
    },
  );
  app.post(
    '/v1/staff/products',
    { schema: { body: productWriteSchema, response: { 200: z.object({ id: z.uuid() }) } } },
    async (request) => {
      const user = await staff(request);
      return { id: await editor.save(null, request.body, user.id) };
    },
  );
  app.put(
    '/v1/staff/products/:id',
    {
      schema: {
        params: z.object({ id: z.uuid() }),
        body: productWriteSchema,
        response: { 200: z.object({ id: z.uuid() }) },
      },
    },
    async (request) => {
      const user = await staff(request);
      return { id: await editor.save(request.params.id, request.body, user.id) };
    },
  );
  app.post(
    '/v1/staff/images',
    {
      bodyLimit: 7 * 1024 * 1024,
      schema: {
        body: z.object({ data: z.string().max(7 * 1024 * 1024) }).strict(),
        response: { 200: z.object({ src: z.string() }) },
      },
    },
    async (request) => {
      await staff(request);
      const bytes = Buffer.from(request.body.data, 'base64');
      if (bytes.length > 5 * 1024 * 1024)
        throw Object.assign(new Error('Image too large.'), { statusCode: 413 });
      let output: Buffer;
      try {
        const image = sharp(bytes, { limitInputPixels: 25000000, animated: false });
        const metadata = await image.metadata();
        if (!['jpeg', 'png', 'webp'].includes(metadata.format ?? ''))
          throw new Error('Unsupported image');
        output = await image
          .rotate()
          .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 85 })
          .toBuffer();
      } catch {
        throw Object.assign(new Error('Invalid image.'), { statusCode: 400 });
      }
      const name = `${randomUUID()}.webp`;
      await mkdir(uploadDir, { recursive: true });
      await writeFile(join(uploadDir, name), output, { flag: 'wx' });
      return { src: `/media/${name}` };
    },
  );
  app.get(
    '/v1/media/:name',
    { schema: { params: z.object({ name: z.string().regex(/^[a-f0-9-]{36}\.webp$/) }) } },
    async (request, reply) => {
      try {
        const bytes = await readFile(join(uploadDir, request.params.name));
        return reply
          .header('Cache-Control', 'public, max-age=31536000, immutable')
          .type('image/webp')
          .send(bytes);
      } catch {
        return reply.code(404).send();
      }
    },
  );
}
