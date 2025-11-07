# 多阶段构建 Dockerfile
# 阶段1: 构建阶段
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 编译 TypeScript
RUN npm run build

# 阶段2: 生产阶段
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 安装 dumb-init (用于正确处理信号)
RUN apk add --no-cache dumb-init

# 复制 package.json
COPY package*.json ./

# 只安装生产依赖
RUN npm ci --only=production

# 从构建阶段复制编译后的代码
COPY --from=builder /app/dist ./dist

# 创建数据目录用于存放数据库文件
RUN mkdir -p /app/data

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=2000

# 暴露端口
EXPOSE 2000

# 使用非root用户运行
USER node

# 使用 dumb-init 启动应用
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
