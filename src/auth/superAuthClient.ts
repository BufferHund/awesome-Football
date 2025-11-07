import axios, { AxiosResponse } from 'axios';

// SuperAuth Gateway客户端
export class SuperAuthClient {
  private gatewayUrl: string;
  private portalUrl: string;

  constructor(gatewayUrl?: string, portalUrl?: string) {
    this.gatewayUrl = gatewayUrl || process.env.GATEWAY_URL || 'http://gateway:4000';
    this.portalUrl = portalUrl || process.env.PORTAL_URL || 'http://localhost';
  }

  /**
   * 验证用户Token
   */
  async verifyToken(token: string): Promise<{
    success: boolean;
    user?: any;
    message?: string;
  }> {
    try {
      console.log(`[SuperAuth] 验证Token: ${this.gatewayUrl}/api/auth/verify`);

      const response = await axios.post(
        `${this.gatewayUrl}/api/auth/verify`,
        {},
        {
          headers: { Cookie: `auth_token=${token}` },
          validateStatus: status => status === 200 || status === 401,
          timeout: 5000
        }
      );

      console.log(`[SuperAuth] 验证结果: ${response.status}`, response.data);
      return response.data;
    } catch (error: any) {
      console.error('[SuperAuth] Token验证失败:', error.message);
      return {
        success: false,
        message: '认证服务暂时不可用'
      };
    }
  }

  /**
   * 用户登录 (Direct API方式)
   */
  async login(username: string, password: string): Promise<{
    success: boolean;
    user?: any;
    message?: string;
    setCookie?: string[];
  }> {
    try {
      console.log(`[SuperAuth] 登录请求: ${this.gatewayUrl}/api/auth/login`);

      const response: AxiosResponse = await axios.post(
        `${this.gatewayUrl}/api/auth/login`,
        { username, password },
        {
          validateStatus: status => status === 200 || status === 400 || status === 401,
          timeout: 5000
        }
      );

      console.log(`[SuperAuth] 登录结果: ${response.status}`, response.data);

      // 提取Set-Cookie头
      const setCookie = response.headers['set-cookie'];

      return {
        ...response.data,
        setCookie
      };
    } catch (error: any) {
      console.error('[SuperAuth] 登录失败:', error.message);
      return {
        success: false,
        message: '登录服务暂时不可用'
      };
    }
  }

  /**
   * 用户注册 (Direct API方式)
   */
  async register(username: string, email: string, password: string): Promise<{
    success: boolean;
    user?: any;
    message?: string;
    setCookie?: string[];
  }> {
    try {
      console.log(`[SuperAuth] 注册请求: ${this.gatewayUrl}/api/auth/register`);

      const response: AxiosResponse = await axios.post(
        `${this.gatewayUrl}/api/auth/register`,
        { username, email, password },
        {
          validateStatus: status => status === 200 || status === 201 || status === 400,
          timeout: 5000
        }
      );

      console.log(`[SuperAuth] 注册结果: ${response.status}`, response.data);

      // 提取Set-Cookie头
      const setCookie = response.headers['set-cookie'];

      return {
        ...response.data,
        setCookie
      };
    } catch (error: any) {
      console.error('[SuperAuth] 注册失败:', error.message);
      return {
        success: false,
        message: '注册服务暂时不可用'
      };
    }
  }

  /**
   * 用户登出
   */
  async logout(token: string): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      console.log(`[SuperAuth] 登出请求: ${this.gatewayUrl}/api/auth/logout`);

      const response = await axios.post(
        `${this.gatewayUrl}/api/auth/logout`,
        {},
        {
          headers: { Cookie: `auth_token=${token}` },
          validateStatus: status => status === 200,
          timeout: 5000
        }
      );

      console.log(`[SuperAuth] 登出结果: ${response.status}`, response.data);
      return response.data;
    } catch (error: any) {
      console.error('[SuperAuth] 登出失败:', error.message);
      return {
        success: false,
        message: '登出失败'
      };
    }
  }

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(token: string): Promise<{
    success: boolean;
    user?: any;
    message?: string;
  }> {
    try {
      console.log(`[SuperAuth] 获取用户信息: ${this.gatewayUrl}/api/auth/me`);

      const response = await axios.get(
        `${this.gatewayUrl}/api/auth/me`,
        {
          headers: { Cookie: `auth_token=${token}` },
          validateStatus: status => status === 200 || status === 401,
          timeout: 5000
        }
      );

      console.log(`[SuperAuth] 用户信息: ${response.status}`, response.data);
      return response.data;
    } catch (error: any) {
      console.error('[SuperAuth] 获取用户信息失败:', error.message);
      return {
        success: false,
        message: '获取用户信息失败'
      };
    }
  }

  /**
   * 生成Portal登录URL (Portal重定向模式)
   */
  getPortalLoginUrl(redirectUrl: string): string {
    const encodedRedirect = encodeURIComponent(redirectUrl);
    return `${this.portalUrl}/?redirect=${encodedRedirect}`;
  }

  /**
   * 生成Portal注册URL (Portal重定向模式)
   */
  getPortalRegisterUrl(redirectUrl: string): string {
    const encodedRedirect = encodeURIComponent(redirectUrl);
    return `${this.portalUrl}/register?redirect=${encodedRedirect}`;
  }
}

// 导出单例实例
export const superAuthClient = new SuperAuthClient();
