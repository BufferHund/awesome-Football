import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const newsData = [
  {
    title: '英超：曼城3-1战胜利物浦',
    summary: '哈兰德梅开二度，曼城在安菲尔德取得关键胜利',
    content: '在昨晚的英超焦点战中，曼城客场3-1战胜利物浦。哈兰德上下半场各进一球，德布劳内助攻并打入一球。这场胜利让曼城在积分榜上领先优势扩大到5分。',
    category: '英超',
    author: 'Football',
    coverImage: null,
    views: 1250,
  },
  {
    title: '皇马官宣：签下年轻中场新星',
    summary: '皇马从切尔西签下18岁中场，转会费达到7000万欧元',
    content: '皇马官方宣布，从切尔西签下了18岁的英格兰中场新星。这笔转会费高达7000万欧元，创下了俱乐部引援纪录。球员将身披8号球衣。',
    category: '转会',
    author: 'Football',
    coverImage: null,
    views: 980,
  },
  {
    title: '欧冠抽签结果出炉',
    summary: '拜仁将对阵巴黎，皇马遭遇曼城',
    content: '今天进行的欧冠淘汰赛抽签仪式上，拜仁慕尼黑抽到了巴黎圣日耳曼，而皇马将对阵卫冕冠军曼城。这些对决都将是火星撞地球的精彩比赛。',
    category: '欧冠',
    author: 'Football',
    coverImage: null,
    views: 1520,
  },
  {
    title: '梅西谈退役计划：还想再踢2年',
    summary: '阿根廷球星在接受采访时表示希望继续职业生涯',
    content: '在最新的采访中，梅西表示自己的身体状态依然良好，希望能够再踢至少2年。他目前在迈阿密国际效力，帮助球队取得了多项荣誉。',
    category: '球员',
    author: 'Football',
    coverImage: null,
    views: 2100,
  },
  {
    title: '西甲：巴萨战平马竞',
    summary: '莱万进球，格列兹曼扳平比分',
    content: '在西甲第23轮的比赛中，巴塞罗那主场1-1战平马德里竞技。莱万多夫斯基上半场为巴萨取得领先，格列兹曼下半场扳平比分。',
    category: '西甲',
    author: 'Football',
    coverImage: null,
    views: 890,
  },
  {
    title: '曼联主帅：我们需要在转会窗口补强',
    summary: '滕哈赫呼吁俱乐部在冬季转会期引援',
    content: '曼联主帅在赛后新闻发布会上表示，球队需要在即将到来的冬季转会窗口进行补强，尤其是中场和边锋位置。俱乐部已经与多名球员进行了接触。',
    category: '英超',
    author: 'Football',
    coverImage: null,
    views: 760,
  },
  {
    title: '金球奖候选名单公布',
    summary: '哈兰德、姆巴佩、维尼修斯入围',
    content: '2025年金球奖候选名单今天正式公布，曼城前锋哈兰德、巴黎球星姆巴佩和皇马边锋维尼修斯等30名球员入围。颁奖典礼将于下个月在巴黎举行。',
    category: '奖项',
    author: 'Football',
    coverImage: null,
    views: 1680,
  },
  {
    title: '拜仁慕尼黑8连胜领跑德甲',
    summary: '凯恩帽子戏法，拜仁4-0大胜多特蒙德',
    content: '在德国国家德比中，拜仁慕尼黑主场4-0大胜多特蒙德，取得联赛8连胜。凯恩上演帽子戏法，穆勒打入一球。拜仁目前领先第二名6分。',
    category: '德甲',
    author: 'Football',
    coverImage: null,
    views: 1120,
  },
];

async function main() {
  console.log('开始填充新闻数据...');

  for (const news of newsData) {
    // 检查是否已存在相同标题的新闻
    const existing = await prisma.news.findFirst({
      where: { title: news.title },
    });

    if (!existing) {
      await prisma.news.create({
        data: news,
      });
      console.log(`✓ 已添加: ${news.title}`);
    } else {
      console.log(`- 已存在: ${news.title}`);
    }
  }

  console.log('新闻数据填充完成！');
}

main()
  .catch((e) => {
    console.error('填充新闻数据失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
