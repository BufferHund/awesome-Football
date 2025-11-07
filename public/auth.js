/**
 * 前端认证工具库
 * 提供登录、注册、登出、认证检查等功能
 */

// API基础URL
const API_BASE = '';

/**
 * 检查当前用户认证状态
 * @returns {Promise<Object|null>} 用户对象或null
 */
async function checkAuth() {
    try {
        const response = await fetch('/api/auth/me', {
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success && data.authenticated) {
                return data.user;
            }
        }

        return null;
    } catch (error) {
        console.error('检查认证状态失败:', error);
        return null;
    }
}

/**
 * 用户登录 (Direct API模式)
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @returns {Promise<Object>} 登录结果
 */
async function login(username, password) {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('登录失败:', error);
        return {
            success: false,
            message: '登录失败，请稍后重试'
        };
    }
}

/**
 * 用户注册 (Direct API模式)
 * @param {string} username - 用户名
 * @param {string} email - 邮箱
 * @param {string} password - 密码
 * @returns {Promise<Object>} 注册结果
 */
async function register(username, email, password) {
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('注册失败:', error);
        return {
            success: false,
            message: '注册失败，请稍后重试'
        };
    }
}

/**
 * 用户登出
 * @returns {Promise<Object>} 登出结果
 */
async function logout() {
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('登出失败:', error);
        return {
            success: false,
            message: '登出失败'
        };
    }
}

/**
 * 更新导航栏认证状态
 */
async function updateNavAuth() {
    const navAuth = document.getElementById('navAuth');
    if (!navAuth) return;

    const user = await checkAuth();

    if (user) {
        // 已登录，显示用户信息和登出按钮
        const userType = user.isVirtual ? '<span class="badge badge-warning">虚拟</span>' : '<span class="badge badge-success">正式</span>';

        navAuth.innerHTML = `
            <span style="color: var(--text-light);">
                ${user.username} ${userType}
            </span>
            <button id="logoutBtn" class="btn btn-danger">登出</button>
        `;

        // 绑定登出按钮事件
        document.getElementById('logoutBtn').addEventListener('click', async () => {
            const result = await logout();
            if (result.success) {
                window.location.reload();
            } else {
                alert('登出失败');
            }
        });
    } else {
        // 未登录，显示登录和注册按钮
        navAuth.innerHTML = `
            <a href="/login.html" class="btn btn-primary">登录</a>
            <a href="/register.html" class="btn btn-success">注册</a>
        `;
    }
}

/**
 * 获取Portal登录URL
 * @param {string} returnUrl - 登录后返回的URL
 * @returns {Promise<string|null>} Portal登录URL
 */
async function getPortalLoginUrl(returnUrl) {
    try {
        const url = `/api/auth/portal-login?return=${encodeURIComponent(returnUrl)}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.success && data.portalUrl) {
            return data.portalUrl;
        }

        return null;
    } catch (error) {
        console.error('获取Portal登录URL失败:', error);
        return null;
    }
}

/**
 * 获取Portal注册URL
 * @param {string} returnUrl - 注册后返回的URL
 * @returns {Promise<string|null>} Portal注册URL
 */
async function getPortalRegisterUrl(returnUrl) {
    try {
        const url = `/api/auth/portal-register?return=${encodeURIComponent(returnUrl)}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.success && data.portalUrl) {
            return data.portalUrl;
        }

        return null;
    } catch (error) {
        console.error('获取Portal注册URL失败:', error);
        return null;
    }
}

/**
 * 要求用户认证（用于受保护的页面）
 * @param {boolean} allowVirtual - 是否允许虚拟用户访问
 * @returns {Promise<Object|null>} 用户对象或null（并重定向到登录页）
 */
async function requireAuth(allowVirtual = false) {
    const user = await checkAuth();

    if (!user) {
        // 未登录，重定向到登录页
        window.location.href = '/login.html?return=' + encodeURIComponent(window.location.pathname);
        return null;
    }

    if (!allowVirtual && user.isVirtual) {
        // 不允许虚拟用户，重定向到登录页
        alert('此功能需要真实用户登录');
        window.location.href = '/login.html?return=' + encodeURIComponent(window.location.pathname);
        return null;
    }

    return user;
}

// 页面加载时自动更新导航栏
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateNavAuth);
} else {
    updateNavAuth();
}
