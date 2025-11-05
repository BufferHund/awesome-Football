FROM node:20-alpine

WORKDIR /app

# 复制package文件
COPY package*.json ./
COPY tsconfig.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 生成Prisma客户端
RUN npx prisma generate

# 构建TypeScript
RUN npm run build

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && npm start"]
