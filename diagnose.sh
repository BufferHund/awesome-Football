#!/bin/bash

echo "======================================"
echo "Football App - 诊断脚本"
echo "======================================"
echo ""

echo "📊 检查容器状态..."
docker-compose ps
echo ""

echo "📝 后端日志（全部）："
echo "--------------------------------------"
docker logs football-backend 2>&1
echo ""

echo "📝 数据库日志（最后30行）："
echo "--------------------------------------"
docker logs --tail 30 football-postgres 2>&1
echo ""

echo "🔍 检查数据库连接..."
docker exec football-postgres pg_isready -U football 2>&1
echo ""

echo "🔍 检查后端进程..."
docker-compose ps backend
echo ""

echo "======================================"
echo "诊断完成"
echo "======================================"
