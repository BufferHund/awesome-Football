#!/bin/bash

echo "======================================="
echo "足球应用 - 服务诊断脚本"
echo "======================================="
echo ""

echo "1. 检查Docker容器状态..."
docker-compose ps
echo ""

echo "2. 检查后端容器日志（最后30行）..."
echo "-----------------------------------"
docker-compose logs --tail=30 backend
echo ""

echo "3. 检查前端容器日志（最后20行）..."
echo "-----------------------------------"
docker-compose logs --tail=20 frontend
echo ""

echo "4. 检查数据库容器状态..."
echo "-----------------------------------"
docker-compose logs --tail=10 postgres
echo ""

echo "5. 测试后端API连接..."
echo "-----------------------------------"
curl -s http://localhost:3000/api/health || echo "❌ 后端API无法连接"
echo ""

echo "6. 测试前端连接..."
echo "-----------------------------------"
curl -s -I http://localhost:5173 | head -1 || echo "❌ 前端无法连接"
echo ""

echo "======================================="
echo "诊断完成！"
echo "======================================="
