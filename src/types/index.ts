export interface TelegramUser {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  language_code?: string;
  is_premium?: boolean;
}

export interface TelegramWebhookData {
  message?: {
    from?: TelegramUser;
    text?: string;
    photo?: Array<{
      file_id: string;
      file_unique_id: string;
      width: number;
      height: number;
      file_size?: number;
    }>;
    caption?: string;
  };
  user?: TelegramUser;
  from?: TelegramUser;
  id?: number;
}

export interface UserCreateData {
  telegram_id: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  language_code?: string;
  photo_url?: string;
  is_premium?: boolean;
  referral_code?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Article {
  id: number;
  title: string;
  description: string;
  created_at: Date;
}

export interface AuthenticatedUser {
  id: number;
  telegram_id: string;
  username?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  language_code?: string | null;
  photo_url?: string | null;
  is_premium?: boolean | null;
  stars: number;
  diamonds: number;
  last_daily_silver?: Date | null;
  referral_code?: string | null;
  referred_by_id?: number | null;
  referrals_count: number;
  created_at: Date;
  updated_at: Date;
}

import type { FastifyRedis } from '@fastify/redis';

// Расширение типов Fastify для добавления пользователя в request
declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthenticatedUser;
  }
  
  interface FastifyInstance {
    redis: FastifyRedis;
  }
} 
