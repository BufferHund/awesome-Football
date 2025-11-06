import { PrismaClient } from '@prisma/client';

/**
 * 全局 Prisma 客户端实例
 * 确保整个应用使用同一个数据库连接池
 */
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});
