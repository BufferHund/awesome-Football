FROM node:20-slim

# 安装OpenSSL和其他必要的系统依赖
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 复制package文件
COPY package*.json ./
COPY tsconfig.json ./

# 安装依赖
RUN npm install

# 复制Prisma schema
COPY prisma ./prisma

# 生成Prisma客户端
RUN npx prisma generate

# 复制源代码
COPY src ./src

# 构建TypeScript - 添加详细日志
RUN echo "Building TypeScript..." && \
    npm run build && \
    echo "Build complete. Checking output..." && \
    ls -la dist/ && \
    test -f dist/index.js && echo "✓ dist/index.js exists" || (echo "✗ dist/index.js not found!" && exit 1)

# 复制其他必要文件
COPY .env* ./

# 暴露端口
EXPOSE 3000

# 启动命令：运行迁移并启动服务器
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
