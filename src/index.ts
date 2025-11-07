import createServer from './api/server';
import Database from './database/db';
import FootballCrawler from './crawler/footballCrawler';
import { mockTeams, getMockPlayers, getMockMatches } from './data/mockData';

const PORT = process.env.PORT || 3000;

async function main() {
  console.log('\n============================================');
  console.log('  足球应用演示 - 数据持久化完整示例');
  console.log('============================================\n');

  const db = Database.getInstance();
  const crawler = new FootballCrawler();

  try {
    // 步骤1: 清空现有数据并初始化Mock数据
    console.log('【步骤1】清空现有数据并初始化Mock数据...');
    await db.clearAllData();

    // 保存Mock数据到数据库（展示数据持久化）
    console.log('\n--- 保存Mock数据到数据库 ---');
    const teamIds = await db.saveTeams(mockTeams);
    console.log(`✓ Mock数据: ${teamIds.length} 支球队已持久化到数据库`);

    const mockPlayers = getMockPlayers(teamIds);
    const playerIds = await db.savePlayers(mockPlayers);
    console.log(`✓ Mock数据: ${playerIds.length} 名球员已持久化到数据库`);

    const mockMatches = getMockMatches(teamIds);
    const matchIds = await db.saveMatches(mockMatches);
    console.log(`✓ Mock数据: ${matchIds.length} 场比赛已持久化到数据库`);

    // 步骤2: 使用爬虫获取额外数据并持久化
    console.log('\n【步骤2】使用爬虫获取额外数据并持久化到数据库...');
    await crawler.crawlAll();

    // 步骤3: 验证所有数据已持久化
    console.log('【步骤3】验证数据持久化结果...\n');

    const allTeams = await db.getAllTeams();
    console.log(`✓ 数据库中共有 ${allTeams.length} 支球队（已持久化）`);

    const allPlayers = await db.getAllPlayers();
    console.log(`✓ 数据库中共有 ${allPlayers.length} 名球员（已持久化）`);

    const allMatches = await db.getAllMatches();
    console.log(`✓ 数据库中共有 ${allMatches.length} 场比赛（已持久化）`);

    // 步骤4: 启动API服务器
    console.log('\n【步骤4】启动API服务器...\n');

    const app = createServer();

    app.listen(PORT, () => {
      console.log('============================================');
      console.log(`  ✓ API服务器运行在: http://localhost:${PORT}`);
      console.log('============================================\n');
      console.log('可用的API端点:');
      console.log(`  GET  http://localhost:${PORT}/api/teams          - 获取所有球队`);
      console.log(`  POST http://localhost:${PORT}/api/teams          - 创建新球队（持久化到数据库）`);
      console.log(`  GET  http://localhost:${PORT}/api/players        - 获取所有球员`);
      console.log(`  POST http://localhost:${PORT}/api/players        - 创建新球员（持久化到数据库）`);
      console.log(`  GET  http://localhost:${PORT}/api/matches        - 获取所有比赛`);
      console.log(`  POST http://localhost:${PORT}/api/matches        - 创建新比赛（持久化到数据库）`);
      console.log(`  GET  http://localhost:${PORT}/api/stats          - 获取统计信息`);
      console.log('\n============================================');
      console.log('  数据持久化功能已完全实现：');
      console.log('  ✓ Mock数据已持久化到数据库');
      console.log('  ✓ 爬虫数据已持久化到数据库');
      console.log('  ✓ API创建的数据会持久化到数据库');
      console.log('============================================\n');
    });

  } catch (error) {
    console.error('启动应用失败:', error);
    process.exit(1);
  }
}

// 处理退出信号
process.on('SIGINT', async () => {
  console.log('\n正在关闭服务器...');
  const db = Database.getInstance();
  await db.close();
  process.exit(0);
});

// 启动应用
main();
