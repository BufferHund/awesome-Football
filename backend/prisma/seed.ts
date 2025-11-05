import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 开始填充数据...');

  // 创建球队
  const teams = await Promise.all([
    prisma.team.create({
      data: {
        name: '曼彻斯特城',
        shortName: '曼城',
        country: '英格兰',
        founded: 1880,
        stadium: '伊蒂哈德球场',
        logo: 'https://via.placeholder.com/150?text=MCI',
      },
    }),
    prisma.team.create({
      data: {
        name: '阿森纳',
        shortName: '阿森纳',
        country: '英格兰',
        founded: 1886,
        stadium: '酋长球场',
        logo: 'https://via.placeholder.com/150?text=ARS',
      },
    }),
    prisma.team.create({
      data: {
        name: '利物浦',
        shortName: '利物浦',
        country: '英格兰',
        founded: 1892,
        stadium: '安菲尔德球场',
        logo: 'https://via.placeholder.com/150?text=LIV',
      },
    }),
    prisma.team.create({
      data: {
        name: '皇家马德里',
        shortName: '皇马',
        country: '西班牙',
        founded: 1902,
        stadium: '伯纳乌球场',
        logo: 'https://via.placeholder.com/150?text=RMA',
      },
    }),
    prisma.team.create({
      data: {
        name: '巴塞罗那',
        shortName: '巴萨',
        country: '西班牙',
        founded: 1899,
        stadium: '诺坎普球场',
        logo: 'https://via.placeholder.com/150?text=FCB',
      },
    }),
    prisma.team.create({
      data: {
        name: '拜仁慕尼黑',
        shortName: '拜仁',
        country: '德国',
        founded: 1900,
        stadium: '安联球场',
        logo: 'https://via.placeholder.com/150?text=FCB',
      },
    }),
  ]);

  console.log(`✅ 创建了 ${teams.length} 支球队`);

  // 创建球员
  const players = await Promise.all([
    // 曼城球员
    prisma.player.create({
      data: {
        name: '埃尔林·哈兰德',
        position: '前锋',
        number: 9,
        nationality: '挪威',
        age: 23,
        teamId: teams[0].id,
        photo: 'https://via.placeholder.com/150?text=Haaland',
      },
    }),
    prisma.player.create({
      data: {
        name: '凯文·德布劳内',
        position: '中场',
        number: 17,
        nationality: '比利时',
        age: 32,
        teamId: teams[0].id,
        photo: 'https://via.placeholder.com/150?text=KDB',
      },
    }),
    // 阿森纳球员
    prisma.player.create({
      data: {
        name: '布卡约·萨卡',
        position: '边锋',
        number: 7,
        nationality: '英格兰',
        age: 22,
        teamId: teams[1].id,
        photo: 'https://via.placeholder.com/150?text=Saka',
      },
    }),
    // 利物浦球员
    prisma.player.create({
      data: {
        name: '穆罕默德·萨拉赫',
        position: '前锋',
        number: 11,
        nationality: '埃及',
        age: 31,
        teamId: teams[2].id,
        photo: 'https://via.placeholder.com/150?text=Salah',
      },
    }),
    // 皇马球员
    prisma.player.create({
      data: {
        name: '维尼修斯',
        position: '边锋',
        number: 20,
        nationality: '巴西',
        age: 23,
        teamId: teams[3].id,
        photo: 'https://via.placeholder.com/150?text=Vini',
      },
    }),
    // 巴萨球员
    prisma.player.create({
      data: {
        name: '罗伯特·莱万多夫斯基',
        position: '前锋',
        number: 9,
        nationality: '波兰',
        age: 35,
        teamId: teams[4].id,
        photo: 'https://via.placeholder.com/150?text=Lewa',
      },
    }),
  ]);

  console.log(`✅ 创建了 ${players.length} 名球员`);

  // 创建比赛
  const now = new Date();
  const matches = await Promise.all([
    // 今日比赛
    prisma.match.create({
      data: {
        homeTeamId: teams[0].id,
        awayTeamId: teams[1].id,
        homeScore: 2,
        awayScore: 1,
        status: 'LIVE',
        matchDate: now,
        venue: '伊蒂哈德球场',
        competition: '英超',
        round: '第15轮',
      },
    }),
    prisma.match.create({
      data: {
        homeTeamId: teams[2].id,
        awayTeamId: teams[0].id,
        status: 'SCHEDULED',
        matchDate: new Date(now.getTime() + 3 * 60 * 60 * 1000), // 3小时后
        venue: '安菲尔德球场',
        competition: '英超',
        round: '第15轮',
      },
    }),
    // 昨日比赛
    prisma.match.create({
      data: {
        homeTeamId: teams[3].id,
        awayTeamId: teams[4].id,
        homeScore: 3,
        awayScore: 2,
        status: 'FINISHED',
        matchDate: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        venue: '伯纳乌球场',
        competition: '西甲',
        round: '第16轮',
      },
    }),
    // 未来比赛
    prisma.match.create({
      data: {
        homeTeamId: teams[5].id,
        awayTeamId: teams[3].id,
        status: 'SCHEDULED',
        matchDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
        venue: '安联球场',
        competition: '欧冠',
        round: '小组赛第6轮',
      },
    }),
  ]);

  console.log(`✅ 创建了 ${matches.length} 场比赛`);

  // 创建比赛事件
  await prisma.matchEvent.createMany({
    data: [
      {
        matchId: matches[0].id,
        type: 'GOAL',
        player: '哈兰德',
        minute: 23,
        detail: '助攻：德布劳内',
      },
      {
        matchId: matches[0].id,
        type: 'GOAL',
        player: '萨卡',
        minute: 45,
        detail: '点球',
      },
      {
        matchId: matches[0].id,
        type: 'GOAL',
        player: '哈兰德',
        minute: 67,
        detail: '头球',
      },
    ],
  });

  console.log('✅ 创建了比赛事件');

  // 创建积分榜
  await prisma.standing.createMany({
    data: [
      {
        teamId: teams[0].id,
        competition: '英超',
        position: 1,
        played: 14,
        won: 11,
        drawn: 2,
        lost: 1,
        goalsFor: 35,
        goalsAgainst: 12,
        goalDiff: 23,
        points: 35,
        form: 'WWDWW',
      },
      {
        teamId: teams[1].id,
        competition: '英超',
        position: 2,
        played: 14,
        won: 10,
        drawn: 3,
        lost: 1,
        goalsFor: 32,
        goalsAgainst: 15,
        goalDiff: 17,
        points: 33,
        form: 'WWDWL',
      },
      {
        teamId: teams[2].id,
        competition: '英超',
        position: 3,
        played: 14,
        won: 9,
        drawn: 4,
        lost: 1,
        goalsFor: 30,
        goalsAgainst: 16,
        goalDiff: 14,
        points: 31,
        form: 'WDWDW',
      },
      {
        teamId: teams[3].id,
        competition: '西甲',
        position: 1,
        played: 15,
        won: 13,
        drawn: 1,
        lost: 1,
        goalsFor: 40,
        goalsAgainst: 10,
        goalDiff: 30,
        points: 40,
        form: 'WWWWW',
      },
      {
        teamId: teams[4].id,
        competition: '西甲',
        position: 2,
        played: 15,
        won: 11,
        drawn: 2,
        lost: 2,
        goalsFor: 35,
        goalsAgainst: 15,
        goalDiff: 20,
        points: 35,
        form: 'WWLWW',
      },
    ],
  });

  console.log('✅ 创建了积分榜数据');

  // 创建新闻
  await prisma.news.createMany({
    data: [
      {
        title: '哈兰德梅开二度！曼城2-1力克阿森纳',
        summary: '英超焦点战，曼城主场2-1战胜阿森纳，哈兰德梅开二度成为比赛英雄',
        content: '在今晚进行的英超第15轮焦点战中，曼城主场迎战阿森纳。挪威前锋哈兰德表现出色，梅开二度帮助球队2-1战胜对手，继续领跑积分榜...',
        category: '赛事',
        author: '足球编辑部',
        coverImage: 'https://via.placeholder.com/600x400?text=Match',
        views: 1250,
      },
      {
        title: '皇马3-2战胜巴萨，维尼修斯闪耀国家德比',
        summary: '国家德比激情上演，皇马主场3-2险胜巴萨',
        content: '昨晚的国家德比堪称经典，皇马在伯纳乌球场3-2战胜巴塞罗那。维尼修斯贡献一传一射，帮助皇马在积分榜上继续领先...',
        category: '赛事',
        author: '足球编辑部',
        coverImage: 'https://via.placeholder.com/600x400?text=Derby',
        views: 2100,
      },
      {
        title: '曼城有意冬窗引进新中场，目标锁定法甲新星',
        summary: '据报道，曼城正在关注法甲某新星中场球员',
        content: '根据可靠消息，曼城俱乐部正在密切关注一位法甲联赛的中场新星。这位年仅21岁的球员本赛季表现出色，吸引了多家豪门关注...',
        category: '转会',
        author: '转会专家',
        coverImage: 'https://via.placeholder.com/600x400?text=Transfer',
        views: 890,
      },
      {
        title: '萨拉赫：我会继续为利物浦战斗',
        summary: '利物浦前锋萨拉赫接受采访谈未来',
        content: '在最近的采访中，利物浦前锋萨拉赫表示他会继续为俱乐部全力以赴。埃及球星强调他对球队的承诺不变...',
        category: '采访',
        author: '记者团',
        coverImage: 'https://via.placeholder.com/600x400?text=Interview',
        views: 650,
      },
    ],
  });

  console.log('✅ 创建了新闻数据');
  console.log('🎉 数据填充完成！');
}

main()
  .catch((e) => {
    console.error('❌ 数据填充失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
