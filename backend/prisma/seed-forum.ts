import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const avatars = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
];

const authors = ['红魔死忠', '诺坎普之声', '利物浦传奇', '蓝军先锋', '枪手情缘'];

const categories = ['综合讨论', '战术分析', '球员评价', '赛事预测', '转会爆料'];

const posts = [
  {
    title: '【讨论】曼城本赛季能否完成欧冠三连冠？',
    content: '从目前的阵容配置和战术体系来看，曼城依然是欧冠最大热门。哈兰德的进球效率惊人，德布劳内的组织能力无可挑剔。但欧冠淘汰赛充满变数，皇马、拜仁等豪门也不容小觑。大家怎么看？',
    category: '赛事预测',
    tags: ['曼城', '欧冠', '哈兰德'],
    images: [],
    likes: 156,
    views: 2341,
    commentsCount: 34,
    isHot: true,
  },
  {
    title: '【战术】分析利物浦的高位逼抢体系',
    content: '克洛普的高位逼抢战术一直是利物浦的标志性打法。通过前场快速压迫，在对手半场完成抢断并迅速转换进攻。这套战术对球员的体能要求极高，需要全队协同配合。萨拉赫、努涅斯、加克波等锋线球员的无球跑动非常关键...',
    category: '战术分析',
    tags: ['利物浦', '克洛普', '战术分析'],
    images: [],
    likes: 89,
    views: 1523,
    commentsCount: 21,
    isHot: false,
  },
  {
    title: '【爆料】姆巴佩确认今夏加盟皇马！',
    content: '根据多家西班牙媒体报道，姆巴佩已经和皇马达成口头协议，将在今年夏天以自由身加盟伯纳乌。这笔转会传闻已经持续了多年，终于要成真了！弗洛伦蒂诺的"银河战舰"计划即将实现。大家觉得姆巴佩+维尼修斯的锋线组合能统治欧洲吗？',
    category: '转会爆料',
    tags: ['姆巴佩', '皇马', '转会'],
    images: [],
    likes: 423,
    views: 5677,
    commentsCount: 89,
    isHot: true,
    isPinned: true,
  },
  {
    title: '【数据】哈兰德vs姆巴佩，谁是当今第一前锋？',
    content: '从数据来看：\n\n哈兰德本赛季：42场45球12助攻\n姆巴佩本赛季：38场36球15助攻\n\n哈兰德的进球效率更高，但姆巴佩的全面性更强。你们更看好谁？',
    category: '球员评价',
    tags: ['哈兰德', '姆巴佩', '数据分析'],
    images: [],
    likes: 234,
    views: 3421,
    commentsCount: 67,
    isHot: true,
  },
  {
    title: '【晒图】终于去到了老特拉福德！红魔万岁！',
    content: '昨天终于实现了梦想，亲临梦剧场观看了曼联的比赛！现场氛围太震撼了，7万人齐唱Glory Glory Man United的时候我都热泪盈眶。虽然最后只是2-2平局，但能现场看球已经很满足了。分享几张照片给大家！',
    category: '综合讨论',
    tags: ['曼联', '老特拉福德', '观赛体验'],
    images: [
      'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800',
      'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800',
    ],
    likes: 178,
    views: 2145,
    commentsCount: 42,
    isHot: false,
  },
  {
    title: '【讨论】英超争四形势分析',
    content: '目前英超前四分别是：曼城、利物浦、阿森纳、曼联。但热刺、纽卡斯尔都还有机会。最后几轮比赛太关键了，每一场都是决战。大家预测最终前四会是哪些球队？',
    category: '赛事预测',
    tags: ['英超', '争四', '积分榜'],
    images: [],
    likes: 112,
    views: 1876,
    commentsCount: 28,
    isHot: false,
  },
];

const comments = [
  {
    content: '曼城阵容深度太恐怖了，轮换都是顶级球员。欧冠三连冠有戏！',
    likes: 23,
  },
  {
    content: '欧冠不能只看实力，运气和状态也很重要。皇马永远不能低估。',
    likes: 15,
  },
  {
    content: '高位逼抢确实是利物浦的杀手锏，但对球员体能消耗太大，赛季末可能乏力。',
    likes: 8,
  },
  {
    content: '姆巴佩+维尼修斯+贝林厄姆，这锋线简直无敌！',
    likes: 45,
  },
  {
    content: '我觉得哈兰德更强，进球机器！姆巴佩虽然全面但关键时刻差点意思。',
    likes: 34,
  },
  {
    content: '姆巴佩速度爆表，能自己创造机会。哈兰德更依赖队友传球。各有千秋吧。',
    likes: 28,
  },
];

async function main() {
  console.log('🌱 开始填充论坛数据...');

  // 清空现有数据
  await prisma.forumComment.deleteMany();
  await prisma.forumPost.deleteMany();

  // 创建帖子
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const author = authors[i % authors.length];
    const avatar = avatars[i % avatars.length];

    const createdPost = await prisma.forumPost.create({
      data: {
        ...post,
        author,
        authorAvatar: avatar,
      },
    });

    // 为每个帖子创建一些评论
    const numComments = Math.floor(Math.random() * 3) + 2; // 2-4条评论
    for (let j = 0; j < numComments && j < comments.length; j++) {
      const comment = comments[(i + j) % comments.length];
      const commentAuthor = authors[(i + j + 1) % authors.length];
      const commentAvatar = avatars[(i + j + 1) % avatars.length];

      await prisma.forumComment.create({
        data: {
          ...comment,
          postId: createdPost.id,
          author: commentAuthor,
          authorAvatar: commentAvatar,
        },
      });
    }

    console.log(`✅ 创建帖子: ${post.title}`);
  }

  console.log('🎉 论坛数据填充完成！');
}

main()
  .catch((e) => {
    console.error('❌ 填充数据失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
