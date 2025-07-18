"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerUiConfig = exports.swaggerConfig = void 0;
exports.swaggerConfig = {
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
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Bearer токен для авторизации',
                },
            },
            schemas: {
                Article: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', description: 'Уникальный идентификатор статьи' },
                        title: { type: 'string', description: 'Заголовок статьи' },
                        description: { type: 'string', description: 'Описание статьи' },
                        created_at: { type: 'string', format: 'date-time', description: 'Дата создания' },
                    },
                },
                Nominant: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', description: 'ID номинанта' },
                        name: { type: 'string', description: 'Имя номинанта' },
                        description: { type: 'string', description: 'Описание', nullable: true },
                        company: { type: 'string', description: 'Компания', nullable: true },
                        created_at: { type: 'string', format: 'date-time', description: 'Дата создания' },
                        updated_at: { type: 'string', format: 'date-time', description: 'Дата обновления' },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: { type: 'string', description: 'Сообщение об ошибке' },
                    },
                },
                HealthCheck: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', description: 'Статус сервера' },
                    },
                },
            },
        },
    },
};
exports.swaggerUiConfig = {
    routePrefix: '/docs',
    uiConfig: {
        docExpansion: 'full',
        deepLinking: false,
    },
};
