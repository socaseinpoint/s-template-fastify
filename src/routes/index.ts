import { FastifyInstance } from 'fastify';
import { healthRoutes } from './health';

export async function registerRoutes(fastify: FastifyInstance) {
  // Регистрируем все роуты
  console.log('Registering health routes...');
  await fastify.register(healthRoutes);

  console.log('All routes registered successfully');

  // Обработчик для неизвестных роутов
  fastify.setNotFoundHandler((request, reply) => {
    console.log(`Not found handler triggered for: ${request.method} ${request.url}`);
    reply.code(404).send({ 
      error: 'Route not found',
      method: request.method,
      url: request.url,
      message: 'Hello from 404!' 
    });
  });
} 
