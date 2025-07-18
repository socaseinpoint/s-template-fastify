"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthRoutes = healthRoutes;
async function healthRoutes(fastify) {
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
