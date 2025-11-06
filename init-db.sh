#!/bin/bash
# init-db.sh - 初始化数据库脚本

echo "🔧 初始化数据库..."

# 等待数据库启动
echo "⏳ 等待PostgreSQL启动..."
sleep 5

# 检查数据库是否存在，如果不存在则创建
docker exec football-postgres psql -U football -tc "SELECT 1 FROM pg_database WHERE datname = 'footballdb'" | grep -q 1 || \
  docker exec football-postgres psql -U football -c "CREATE DATABASE footballdb"

echo "✅ 数据库初始化完成"
