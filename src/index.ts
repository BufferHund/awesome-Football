import createServer from './api/server';
import Database from './database/db';
import FootballCrawler from './crawler/footballCrawler';
import { mockTeams, getMockPlayers, getMockMatches } from './data/mockData';
import { mockProducts } from './data/productMockData';
import { mockUsers } from './data/userMockData';

const PORT = process.env.PORT || 3000;

async function main() {
  console.log('\n============================================');
  console.log('  ⚽ 足球应用演示 - 完整版');
  console.log('  数据持久化 + 商品系统 + 趣味赌球');
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

    // 保存商品Mock数据到数据库
    const productIds = await db.saveProducts(mockProducts);
    console.log(`✓ Mock数据: ${productIds.length} 件商品已持久化到数据库`);

    // 保存用户Mock数据到数据库
    const userIds = await Promise.all(mockUsers.map(user => db.saveUser(user)));
    console.log(`✓ Mock数据: ${userIds.length} 个用户已持久化到数据库`);

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

    const allProducts = await db.getAllProducts();
    console.log(`✓ 数据库中共有 ${allProducts.length} 件商品（已持久化）`);

    const allUsers = await db.getAllUsers();
    console.log(`✓ 数据库中共有 ${allUsers.length} 个用户（已持久化）`);

    // 步骤4: 启动API服务器
    console.log('\n【步骤4】启动API服务器...\n');

    const app = createServer();

    app.listen(PORT, () => {
      console.log('============================================');
      console.log(`  ✓ API服务器运行在: http://localhost:${PORT}`);
      console.log('============================================\n');
      console.log('主要功能API端点:');
      console.log('\n📊 数据查询:');
      console.log(`  GET  http://localhost:${PORT}/api/teams          - 获取所有球队`);
      console.log(`  GET  http://localhost:${PORT}/api/players        - 获取所有球员`);
      console.log(`  GET  http://localhost:${PORT}/api/matches        - 获取所有比赛`);
      console.log(`  GET  http://localhost:${PORT}/api/stats          - 获取统计信息`);

      console.log('\n🛍️ 商品系统:');
      console.log(`  GET  http://localhost:${PORT}/api/products       - 获取所有商品`);
      console.log(`  POST http://localhost:${PORT}/api/products       - 创建新商品（持久化）`);

      console.log('\n👥 用户系统:');
      console.log(`  GET  http://localhost:${PORT}/api/users          - 获取所有用户`);
      console.log(`  POST http://localhost:${PORT}/api/users          - 创建新用户`);
      console.log(`  GET  http://localhost:${PORT}/api/users/:id/stats - 获取用户投注统计`);

      console.log('\n🎲 趣味赌球:');
      console.log(`  POST http://localhost:${PORT}/api/bets           - 创建投注（持久化）`);
      console.log(`  GET  http://localhost:${PORT}/api/bets/user/:userId - 获取用户投注`);
      console.log(`  GET  http://localhost:${PORT}/api/leaderboard    - 获取金币排行榜`);
      console.log(`  PUT  http://localhost:${PORT}/api/matches/:id/result - 更新比赛结果（自动结算）`);

      console.log('\n============================================');
      console.log('  ✅ 所有功能已启用：');
      console.log('  ✓ Mock数据已持久化到数据库');
      console.log('  ✓ 爬虫数据已持久化到数据库');
      console.log('  ✓ API创建的数据会持久化到数据库');
      console.log('  ✓ 商品系统（12件商品）');
      console.log('  ✓ 趣味赌球系统（虚拟金币）');
      console.log('  ✓ 用户系统（5个测试用户）');
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
