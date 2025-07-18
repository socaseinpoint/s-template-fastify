console.log('DATABASE_URL:', process.env.DATABASE_URL);

import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifyRedis from '@fastify/redis';
// @ts-ignore - типы не доступны
const fastifyFormbody = require('@fastify/formbody');
import { swaggerConfig, swaggerUiConfig } from './config/swagger';
import { registerRoutes } from './routes';
import prisma from './db';
// import { VotesSyncService } from './services/votesSyncService';

const fastify = Fastify({
  logger: true,
});

// Флаг для отслеживания доступности сервисов
let isRedisAvailable = false;
let isPostgresAvailable = false;

// Register form body parser for application/x-www-form-urlencoded
fastify.register(fastifyFormbody);

// Function to check Redis availability
async function checkRedisConnection(): Promise<boolean> {
  try {
    const net = require('net');
    const socket = new net.Socket();
    
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        socket.destroy();
        resolve(false);
      }, 3000);
      
      socket.connect(
        parseInt(process.env.REDIS_PORT || '6379'),
        process.env.REDIS_HOST || '127.0.0.1',
        process.env.REDIS_TOKEN ? {
          password: process.env.REDIS_TOKEN,
        } : undefined,
        () => {
          clearTimeout(timeout);
          socket.destroy();
          resolve(true);
        }
      );
      
      socket.on('error', () => {
        clearTimeout(timeout);
        socket.destroy();
        resolve(false);
      });
    });
  } catch (error) {
    console.warn('⚠️  Network connection test failed:', error instanceof Error ? error.message : String(error));
    return false;
  }
}

// Register Redis only if available
async function registerRedis() {
  console.log('🔍 Checking Redis availability...');
  
  const redisAvailable = await checkRedisConnection();
  
  if (redisAvailable) {
    try {
      await fastify.register(fastifyRedis, {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_TOKEN || undefined,
        connectTimeout: 5000,
      });
      
      isRedisAvailable = true;
      console.log('✅ Redis plugin registered successfully');
    } catch (error) {
      isRedisAvailable = false;
      console.warn('⚠️  Failed to register Redis plugin:', error instanceof Error ? error.message : String(error));
      console.warn('   Server will continue without Redis functionality');
    }
  } else {
    isRedisAvailable = false;
    console.warn('⚠️  Redis is not available');
    console.warn('   Server will continue without Redis functionality');
  }
}

// Check PostgreSQL connection
async function checkPostgresConnection() {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    isPostgresAvailable = true;
    console.log('✅ PostgreSQL connection established');
  } catch (error) {
    isPostgresAvailable = false;
    console.warn('⚠️  PostgreSQL is not available:', error instanceof Error ? error.message : String(error));
    console.warn('   Server will continue with limited functionality');
  }
}

// Register Swagger
fastify.register(fastifySwagger, swaggerConfig);
fastify.register(fastifySwaggerUi, swaggerUiConfig);

const mapCorsOrigin = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://oscarstars.ru'
  }

  if (process.env.NODE_ENV === 'staging') {
    // return 'https://oscar-stars.vercel.app'
    return '*'
  }

  return '*'
}

// Enable CORS
fastify.register(fastifyCors, {
  origin: mapCorsOrigin(),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

// Auth middleware
fastify.addHook('preHandler', async (request, reply) => {
  console.log(`=== Auth middleware: ${request.method} ${request.url} ===`);
  
  // Пропускаем проверку для публичных эндпоинтов
  const publicRoutes = [
    '/health',
    '/docs',
    '/auth/telegram',
    '/telegram/webhook',
    '/docs/json',
    '/docs/yaml',
    '/docs/static',
  ];
  
  const isPublicRoute = publicRoutes.some(route => 
    request.url.startsWith(route) || request.url === '/'
  ) || (request.method === 'GET' && request.url === '/nominants');
  
  if (isPublicRoute) {
    console.log(`Public route detected: ${request.url}`);
    return;
  }

  console.log(`Checking auth for protected route: ${request.url}`);

  // Проверяем доступность PostgreSQL для аутентификации
  if (!isPostgresAvailable) {
    return reply.code(503).send({
      error: 'Database is temporarily unavailable',
      code: 503,
    });
  }
});

// Health check endpoint
fastify.get('/health', async (_, reply) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      redis: isRedisAvailable ? 'available' : 'unavailable',
      postgres: isPostgresAvailable ? 'available' : 'unavailable',
    }
  };
  
  // Если критически важные сервисы недоступны, возвращаем статус degraded
  if (!isPostgresAvailable) {
    health.status = 'degraded';
  }
  
  return reply.send(health);
});

// Register all routes
fastify.register(registerRoutes);

// Start server function
async function startServer() {
  try {
    console.log('🚀 Starting server initialization...');
    
    // Проверяем и регистрируем Redis
    await registerRedis();
    
    // Проверяем подключение к PostgreSQL
    await checkPostgresConnection();
    
    // Запускаем сервер
    const address = await fastify.listen({ 
      port: 8000, 
      host: process.env.HOST || '0.0.0.0' 
    });
    
    console.log(`✅ Server running on ${address}`);
    console.log(`📚 Swagger docs available at ${address}/docs`);

    // Выводим статус сервисов
    console.log('\n=== Services Status ===');
    console.log(`Redis: ${isRedisAvailable ? '✅ Available' : '❌ Unavailable'}`);
    console.log(`PostgreSQL: ${isPostgresAvailable ? '✅ Available' : '❌ Unavailable'}`);
    console.log('=======================');
    
    // Выводим все зарегистрированные роуты
    console.log('\n=== Registered routes ===');
    fastify.printRoutes();
    console.log('========================\n');
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer(); 
