import { FastifyInstance } from 'fastify';

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/healthcheck', {
    schema: {
      description: 'Проверка состояния сервера',
      tags: ['Health'],
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string', description: 'Статус сервера' },
          },
        },
      },
    },
  }, async (_, reply) => {
    reply.code(200).send({ status: 'ok' });
  });
} 
