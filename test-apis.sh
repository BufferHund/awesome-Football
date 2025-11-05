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

echo "10. 测试ESPN积分榜爬虫（英超）"
curl -s http://localhost:3000/api/sync/scrape/standings/espn/premier-league | jq '.count'
echo ""

echo "11. 测试ESPN积分榜爬虫（西甲）"
curl -s http://localhost:3000/api/sync/scrape/standings/espn/la-liga | jq '.count'
echo ""

echo "12. 测试BBC Sport积分榜爬虫"
curl -s http://localhost:3000/api/sync/scrape/standings/bbc | jq '.count'
echo ""

echo "13. 测试BBC Sport新闻爬虫"
curl -s http://localhost:3000/api/sync/scrape/news/bbc | jq '.count'
echo ""

echo "14. 测试ESPN新闻爬虫"
curl -s http://localhost:3000/api/sync/scrape/news/espn | jq '.count'
echo ""

echo "15. 测试Goal.com新闻爬虫"
curl -s http://localhost:3000/api/sync/scrape/news/goal | jq '.count'
echo ""

echo "================================="
echo "测试完成"
echo "================================="
