export const swaggerConfig = {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'Oscar Stars API',
      description: 'API документация для проекта Oscar Stars',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:8000',
        description: 'Development server',
      },
    ],
    tags: [
      { name: 'Articles', description: 'Операции с статьями' },
      { name: 'Telegram', description: 'Telegram webhook' },
      { name: 'Auth', description: 'Авторизация' },
      { name: 'Users', description: 'Операции с пользователями' },
      { name: 'Health', description: 'Проверка состояния сервера' },
      { name: 'Nominants', description: 'Операции с номинантами' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http' as const,
          scheme: 'bearer' as const,
          bearerFormat: 'JWT',
          description: 'Bearer токен для авторизации',
        },
      },
      schemas: {
        Article: {
          type: 'object' as const,
          properties: {
            id: { type: 'integer' as const, description: 'Уникальный идентификатор статьи' },
            title: { type: 'string' as const, description: 'Заголовок статьи' },
            description: { type: 'string' as const, description: 'Описание статьи' },
            created_at: { type: 'string' as const, format: 'date-time', description: 'Дата создания' },
          },
        },
        Nominant: {
          type: 'object' as const,
          properties: {
            id: { type: 'integer' as const, description: 'ID номинанта' },
            name: { type: 'string' as const, description: 'Имя номинанта' },
            description: { type: 'string' as const, description: 'Описание', nullable: true },
            company: { type: 'string' as const, description: 'Компания', nullable: true },
            created_at: { type: 'string' as const, format: 'date-time', description: 'Дата создания' },
            updated_at: { type: 'string' as const, format: 'date-time', description: 'Дата обновления' },
          },
        },
        Error: {
          type: 'object' as const,
          properties: {
            error: { type: 'string' as const, description: 'Сообщение об ошибке' },
          },
        },
        HealthCheck: {
          type: 'object' as const,
          properties: {
            status: { type: 'string' as const, description: 'Статус сервера' },
          },
        },
      },
    },
  },
};

export const swaggerUiConfig = {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'full' as const,
    deepLinking: false,
  },
}; 
