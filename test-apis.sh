#!/bin/bash

echo "================================="
echo "测试所有后端API端点"
echo "================================="
echo ""

echo "1. 测试健康检查"
curl -s http://localhost:3000/api/health | jq
echo ""

echo "2. 测试日志API"
curl -s http://localhost:3000/api/logs | jq '.count'
echo ""

echo "3. 测试同步今日比赛"
curl -s -X POST http://localhost:3000/api/sync/matches/today
echo ""

echo "4. 测试同步直播比赛"
curl -s -X POST http://localhost:3000/api/sync/matches/live
echo ""

echo "5. 测试同步英超积分榜"
curl -s -X POST http://localhost:3000/api/sync/standings/premier-league
echo ""

echo "6. 测试同步意甲积分榜"
curl -s -X POST http://localhost:3000/api/sync/standings/serie-a
echo ""

echo "7. 测试Google爬虫"
curl -s http://localhost:3000/api/sync/scrape/google
echo ""

echo "8. 测试FlashScore爬虫"
curl -s http://localhost:3000/api/sync/scrape/flashscore
echo ""

echo "9. 测试ESPN爬虫"
curl -s http://localhost:3000/api/sync/scrape/espn
echo ""

echo "================================="
echo "测试完成"
echo "================================="
