const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export interface User {
  id: number;
  username: string;
  email: string;
  emailVerified: boolean;
  membershipTier: string;
  membershipExpiresAt?: string | null;
  avatar?: string | null;
  createdAt: string;
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
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  /**
   * 用户注册
   */
  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || '注册失败');
    }

    // 保存token和用户信息
    this.setToken(data.data.token);
    this.setUser(data.data.user);

    return data.data;
  }

  /**
   * 用户登录
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || '登录失败');
    }

    // 保存token和用户信息
    this.setToken(data.data.token);
    this.setUser(data.data.user);

    return data.data;
  }

  /**
   * 用户注销
   */
  async logout(): Promise<void> {
    const token = this.getToken();

    if (token) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    // 清除本地存储
    this.clearAuth();
  }

  /**
   * 验证邮箱
   */
  async verifyEmail(token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/verify-email/${token}`, {
      method: 'GET',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || '验证失败');
    }

    // 刷新用户信息
    await this.refreshUserInfo();
  }

  /**
   * 重新发送验证邮件
   */
  async resendVerification(email: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || '发送失败');
    }

    return data.verificationToken;
  }

  /**
   * 删除账户
   */
  async deleteAccount(password: string): Promise<void> {
    const token = this.getToken();

    if (!token) {
      throw new Error('未登录');
    }

    const response = await fetch(`${API_BASE_URL}/auth/account`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || '删除失败');
    }

    // 清除本地存储
    this.clearAuth();
  }

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(): Promise<User> {
    const token = this.getToken();

    if (!token) {
      throw new Error('未登录');
    }

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || '获取用户信息失败');
    }

    this.setUser(data.data);
    return data.data;
  }

  /**
   * 更新用户头像
   */
  async updateAvatar(avatarUrl: string): Promise<User> {
    const token = this.getToken();

    if (!token) {
      throw new Error('未登录');
    }

    const response = await fetch(`${API_BASE_URL}/auth/avatar`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ avatarUrl }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || '更新头像失败');
    }

    this.setUser(data.data);
    return data.data;
  }

  /**
   * 刷新用户信息
   */
  async refreshUserInfo(): Promise<void> {
    try {
      await this.getCurrentUser();
    } catch (error) {
      console.error('Refresh user info error:', error);
    }
  }

  /**
   * 检查是否已登录
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * 获取token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * 设置token
   */
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * 获取用户信息
   */
  getUser(): AuthResponse['user'] | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  /**
   * 设置用户信息
   */
  private setUser(user: AuthResponse['user']): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * 清除认证信息
   */
  private clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
}

export const authServiceClient = new AuthService();
