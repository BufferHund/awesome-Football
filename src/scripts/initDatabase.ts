import Database from '../database/db';
import { mockTeams, getMockPlayers, getMockMatches } from '../data/mockData';

// 初始化数据库并填充Mock数据
async function initDatabase() {
  console.log('\n========================================');
  console.log('  初始化数据库并填充Mock数据');
  console.log('========================================\n');

  const db = Database.getInstance();

  try {
    // 清空现有数据
    console.log('正在清空现有数据...');
    await db.clearAllData();

    // 保存Mock球队数据
    console.log('\n--- 保存Mock球队数据 ---');
    const teamIds = await db.saveTeams(mockTeams);
    console.log(`✓ 已保存 ${teamIds.length} 支球队`);

    // 保存Mock球员数据
    console.log('\n--- 保存Mock球员数据 ---');
    const mockPlayers = getMockPlayers(teamIds);
    const playerIds = await db.savePlayers(mockPlayers);
    console.log(`✓ 已保存 ${playerIds.length} 名球员`);

    // 保存Mock比赛数据
    console.log('\n--- 保存Mock比赛数据 ---');
    const mockMatches = getMockMatches(teamIds);
    const matchIds = await db.saveMatches(mockMatches);
    console.log(`✓ 已保存 ${matchIds.length} 场比赛`);

    // 显示统计信息
    console.log('\n========================================');
    console.log('  数据库初始化完成！');
    console.log('========================================');
    console.log(`总球队数: ${teamIds.length}`);
    console.log(`总球员数: ${playerIds.length}`);
    console.log(`总比赛数: ${matchIds.length}`);
    console.log('========================================\n');

    // 验证数据
    console.log('验证数据是否已持久化到数据库...\n');

    const allTeams = await db.getAllTeams();
    console.log(`✓ 数据库中共有 ${allTeams.length} 支球队`);

    const allPlayers = await db.getAllPlayers();
    console.log(`✓ 数据库中共有 ${allPlayers.length} 名球员`);

    const allMatches = await db.getAllMatches();
    console.log(`✓ 数据库中共有 ${allMatches.length} 场比赛`);

    console.log('\n✓ 数据已成功持久化到数据库！\n');

    process.exit(0);
  } catch (error) {
    console.error('初始化数据库失败:', error);
    process.exit(1);
  }
}

// 运行初始化
initDatabase();
