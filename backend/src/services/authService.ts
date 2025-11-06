import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../prisma';
import { logService } from './logService';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d'; // JWT过期时间：7天

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: number;
    username: string;
    email: string;
    emailVerified: boolean;
    membershipTier: string;
    avatar?: string | null;
  };
  token: string;
}

class AuthService {
  /**
   * 用户注册
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    logService.info('AuthService', `注册新用户: ${data.email}`);

    // 检查用户名是否已存在
    const existingUsername = await prisma.user.findUnique({
      where: { username: data.username }
    });

    if (existingUsername) {
      throw new Error('用户名已被使用');
    }

    // 检查邮箱是否已存在
    const existingEmail = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingEmail) {
      throw new Error('邮箱已被注册');
    }

    // 密码哈希
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 生成邮箱验证令牌
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24小时后过期

    // 创建用户
    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        verificationToken,
        verificationExpires,
        emailVerified: false,
        membershipTier: 'FREE',
      },
    });

    logService.info('AuthService', `用户注册成功: ${user.id} - ${user.email}`);

    // 生成JWT
    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        emailVerified: user.emailVerified,
        membershipTier: user.membershipTier,
        avatar: user.avatar,
      },
      token,
    };
  }

  /**
   * 用户登录
   */
  async login(data: LoginData): Promise<AuthResponse> {
    logService.info('AuthService', `用户登录: ${data.email}`);

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error('邮箱或密码错误');
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(data.password, user.password);

    if (!isValidPassword) {
      throw new Error('邮箱或密码错误');
    }

    logService.info('AuthService', `用户登录成功: ${user.id} - ${user.email}`);

    // 生成JWT
    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        emailVerified: user.emailVerified,
        membershipTier: user.membershipTier,
        avatar: user.avatar,
      },
      token,
    };
  }

  /**
   * 验证邮箱
   */
  async verifyEmail(token: string): Promise<void> {
    logService.info('AuthService', '验证邮箱令牌');

    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationExpires: {
          gt: new Date(), // 令牌未过期
        },
      },
    });

    if (!user) {
      throw new Error('验证令牌无效或已过期');
    }

    // 更新用户状态
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationExpires: null,
      },
    });

    logService.info('AuthService', `邮箱验证成功: ${user.id} - ${user.email}`);
  }

  /**
   * 重新发送验证邮件
   */
  async resendVerification(email: string): Promise<string> {
    logService.info('AuthService', `重新发送验证邮件: ${email}`);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('用户不存在');
    }

    if (user.emailVerified) {
      throw new Error('邮箱已经验证过了');
    }

    // 生成新的验证令牌
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        verificationExpires,
      },
    });

    logService.info('AuthService', `验证邮件已重新发送: ${user.email}`);

    return verificationToken;
  }

  /**
   * 注销用户（前端删除token即可，这里主要用于记录日志）
   */
  async logout(userId: number): Promise<void> {
    logService.info('AuthService', `用户注销: ${userId}`);
  }

  /**
   * 删除账户
   */
  async deleteAccount(userId: number, password: string): Promise<void> {
    logService.info('AuthService', `删除账户: ${userId}`);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('用户不存在');
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new Error('密码错误');
    }

    // 删除用户
    await prisma.user.delete({
      where: { id: userId },
    });

    logService.info('AuthService', `账户已删除: ${userId}`);
  }

  /**
   * 获取用户信息
   */
  async getUserById(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        emailVerified: true,
        membershipTier: true,
        membershipExpiresAt: true,
        avatar: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error('用户不存在');
    }

    return user;
  }

  /**
   * 更新用户头像
   */
  async updateAvatar(userId: number, avatarUrl: string) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
      select: {
        id: true,
        username: true,
        email: true,
        emailVerified: true,
        membershipTier: true,
        avatar: true,
      },
    });

    logService.info('AuthService', `用户头像已更新: ${userId}`);

    return user;
  }

  /**
   * 生成JWT
   */
  private generateToken(userId: number): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  /**
   * 验证JWT
   */
  verifyToken(token: string): { userId: number } {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
      return decoded;
    } catch (error) {
      throw new Error('无效的令牌');
    }
  }
}

export const authService = new AuthService();
