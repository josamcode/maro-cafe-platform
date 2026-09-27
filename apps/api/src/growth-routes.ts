import { z } from 'zod';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import type { GrowthService, StaffAuth } from '@maro/backend';
import {
  offersSchema,
  offerWriteSchema,
  offerQuerySchema,
  intentSchema,
  insightSchema,
  insightQuerySchema,
} from '@maro/contracts';
import { requireStaff } from './staff-access.js';
export async function registerGrowthRoutes(
  server: FastifyInstance,
  service: GrowthService,
  auth: StaffAuth,
) {
  const app = server.withTypeProvider<ZodTypeProvider>();
  app.get(
    '/v1/offers',
    {
      config: { rateLimit: { max: 1000 } },
      schema: { querystring: offerQuerySchema, response: { 200: offersSchema } },
    },
    (req) => service.list(req.query.context, req.query.branch),
  );
  app.get('/v1/staff/offers', { schema: { response: { 200: offersSchema } } }, async (req) => {
    await requireStaff(auth, req);
    return service.list();
  });
  app.post(
    '/v1/staff/offers',
    { schema: { body: offerWriteSchema, response: { 200: z.object({ id: z.uuid() }) } } },
    async (req) => {
      const staff = await requireStaff(auth, req);
      return { id: await service.save(null, req.body, staff.id) };
    },
  );
  app.put(
    '/v1/staff/offers/:id',
    {
      schema: {
        params: z.object({ id: z.uuid() }),
        body: offerWriteSchema,
        response: { 200: z.object({ id: z.uuid() }) },
      },
    },
    async (req) => {
      const staff = await requireStaff(auth, req);
      return { id: await service.save(req.params.id, req.body, staff.id) };
    },
  );
  app.post(
    '/v1/intent',
    { config: { rateLimit: { max: 600 } }, bodyLimit: 1024, schema: { body: intentSchema } },
    async (req, reply) => {
      await service.record(req.body);
      return reply.code(204).send();
    },
  );
  app.get(
    '/v1/staff/insights',
    { schema: { querystring: insightQuerySchema, response: { 200: insightSchema } } },
    async (req) => {
      await requireStaff(auth, req);
      return service.insights(Number(req.query.days), req.query.context, req.query.branch);
    },
  );
}
