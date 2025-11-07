#!/bin/bash

echo "==================================="
echo "Football App - 重启和修复脚本"
echo "==================================="

# 1. 停止所有容器
echo ""
echo "1️⃣  停止所有容器..."
docker-compose down -v

# 2. 清理Docker缓存（可选）
echo ""
echo "2️⃣  清理Docker缓存..."
docker system prune -f

# 3. 重新构建并启动
echo ""
echo "3️⃣  重新构建并启动容器..."
docker-compose up -d --build

# 4. 等待数据库就绪
echo ""
echo "4️⃣  等待数据库启动（15秒）..."
sleep 15

# 5. 检查容器状态
echo ""
echo "5️⃣  检查容器状态..."
docker-compose ps

# 6. 查看后端日志
echo ""
echo "6️⃣  后端日志（最后30行）："
echo "-----------------------------------"
docker logs --tail 30 football-backend

# 7. 测试API
echo ""
echo "7️⃣  测试API连接..."
echo ""
echo "测试 /api/health:"
curl -s http://localhost:1999/api/health || echo "❌ 后端未响应"
echo ""

echo "测试 /api/teams:"
curl -s http://localhost:1999/api/teams | head -c 200
echo ""

echo ""
echo "==================================="
echo "✅ 重启完成！"
echo "==================================="
echo ""
echo "查看完整后端日志："
echo "  docker logs -f football-backend"
echo ""
echo "查看数据库："
echo "  docker exec -it football-backend npx prisma studio"
echo ""
echo "访问应用："
echo "  前端: http://localhost:2000"
echo "  后端: http://localhost:1999"
echo ""
