#!/bin/sh
# start.sh - 后端启动脚本

set -e

echo "========================================"
echo "🔧 Football App Backend - 启动中..."
echo "========================================"
echo ""

# 显示环境信息
echo "📋 环境信息:"
echo "  DATABASE_URL: ${DATABASE_URL:-未设置}"
echo "  NODE_ENV: ${NODE_ENV:-development}"
echo ""

# 1. 等待数据库（简单重试）
echo "⏳ 步骤 1/3: 等待数据库连接..."
max_retries=30
counter=0

while [ $counter -lt $max_retries ]; do
  if npx prisma db push --skip-generate --accept-data-loss 2>/dev/null; then
    echo "✅ 数据库连接成功！"
    break
  else
    counter=$((counter + 1))
    if [ $counter -eq $max_retries ]; then
      echo ""
      echo "❌ 数据库连接失败，已达最大重试次数"
      echo "   请检查:"
      echo "   1. PostgreSQL 是否正在运行"
      echo "   2. DATABASE_URL 环境变量是否正确"
      echo "   3. 网络连接是否正常"
      exit 1
    fi
    echo "   ⏳ 数据库未就绪，等待中... ($counter/$max_retries)"
    sleep 2
  fi
done

# 2. 运行数据库迁移
echo ""
echo "🔄 步骤 2/3: 运行数据库迁移..."
if npx prisma migrate deploy 2>&1; then
  echo "✅ 数据库迁移完成！"
else
  echo "⚠️  migrate deploy 失败，尝试使用 db push..."
  if npx prisma db push --skip-generate --accept-data-loss 2>&1; then
    echo "✅ db push 完成！"
  else
    echo "❌ 数据库同步失败"
    exit 1
  fi
fi

# 3. 启动应用
echo ""
echo "🚀 步骤 3/3: 启动应用..."
echo "========================================"
echo ""
exec npx ts-node src/index.ts
