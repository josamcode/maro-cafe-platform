import Fastify, { type FastifyError } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import {
  branchParamsSchema,
  branchesResponseSchema,
  menuResponseSchema,
  errorResponseSchema,
  healthSchema,
} from '@maro/contracts';
import {
  BranchNotFoundError,
  createCatalogService,
  type BranchRepository,
  type CatalogRepository,
} from '@maro/backend';

export interface AppDependencies {
  branches: BranchRepository;
  catalog: CatalogRepository;
  checkReady: () => Promise<void>;
}

export async function buildApp(
  deps: AppDependencies,
  options: { webOrigin?: string; logger?: boolean; logLevel?: string; docs?: boolean } = {},
) {
  const app = Fastify({
    logger:
      options.logger === false
        ? false
        : {
            level: options.logLevel ?? 'info',
            redact: ['req.headers.authorization', 'req.headers.cookie'],
          },
    bodyLimit: 1024 * 1024,
    requestTimeout: 10000,
  }).withTypeProvider<ZodTypeProvider>();
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  await app.register(cors, { origin: options.webOrigin ?? 'http://localhost:3100' });
  await app.register(helmet);
  await app.register(rateLimit, {
    max: 120,
    timeWindow: '1 minute',
    allowList: (request) => request.url.startsWith('/health/'),
  });
  await app.register(swagger, {
    openapi: { info: { title: 'MARO API', version: '0.1.0' } },
    transform: jsonSchemaTransform,
  });
  if (options.docs) await app.register(swaggerUi, { routePrefix: '/docs' });

  app.setErrorHandler((error, request, reply) => {
    if (error instanceof BranchNotFoundError) {
      return reply.code(404).send({
        error: { code: 'BRANCH_NOT_FOUND', message: error.message, requestId: request.id },
      });
    }
    const requestError = error instanceof Error ? (error as FastifyError) : undefined;
    const status = requestError?.validation
      ? 400
      : requestError?.statusCode && requestError.statusCode >= 400 && requestError.statusCode < 500
        ? requestError.statusCode
        : 500;
    if (status === 500) request.log.error({ err: error }, 'Request failed');
    return reply.code(status).send({
      error: {
        code:
          status === 400
            ? 'INVALID_REQUEST'
            : status === 429
              ? 'RATE_LIMITED'
              : status === 500
                ? 'INTERNAL_ERROR'
                : 'REQUEST_REJECTED',
        message:
          status === 500
            ? 'Something went wrong.'
            : status === 400
              ? 'Invalid request.'
              : 'Request rejected.',
        requestId: request.id,
      },
    });
  });
  app.setNotFoundHandler((request, reply) =>
    reply
      .code(404)
      .send({ error: { code: 'NOT_FOUND', message: 'Route not found.', requestId: request.id } }),
  );

  app.get('/health/live', { schema: { response: { 200: healthSchema } } }, async () => ({
    status: 'ok' as const,
  }));
  app.get(
    '/health/ready',
    { schema: { response: { 200: healthSchema, 503: healthSchema } } },
    async (request, reply) => {
      try {
        await deps.checkReady();
        return { status: 'ok' as const };
      } catch (error) {
        request.log.warn({ err: error }, 'Readiness check failed');
        return reply.code(503).send({ status: 'unavailable' as const });
      }
    },
  );
  app.get(
    '/v1/branches',
    { schema: { tags: ['Branches'], response: { 200: branchesResponseSchema } } },
    async () => ({ data: await deps.branches.list() }),
  );
  const catalog = createCatalogService(deps.branches, deps.catalog);
  app.get(
    '/v1/branches/:slug/menu',
    {
      schema: {
        tags: ['Catalog'],
        params: branchParamsSchema,
        response: { 200: menuResponseSchema, 400: errorResponseSchema, 404: errorResponseSchema },
      },
    },
    async (request) => catalog.getMenu(request.params.slug),
  );
  return app;
}
