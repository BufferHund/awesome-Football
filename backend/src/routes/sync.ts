import express from 'express';
import { syncService } from '../services/syncService';
import { webScraperService } from '../services/webScraper';
import { LEAGUES } from '../services/footballApi';

const router = express.Router();

// 统一错误处理函数
function handleError(error: any, res: express.Response, defaultMessage: string) {
  console.error('Sync route error:', error);

  const isAxiosError = error.code === 'ERR_BAD_REQUEST' || error.response;

  const errorResponse: any = {
    success: false,
    message: error.message || defaultMessage,
    error: error.message,
    errorType: error.constructor?.name || 'Error',
  };

  // 如果是Axios错误（API调用失败）
  if (isAxiosError && error.response) {
    errorResponse.apiError = {
      status: error.response.status,
      statusText: error.response.statusText,
      data: error.response.data,
      apiKey: error.config?.headers?.['x-rapidapi-key']
        ? `${error.config.headers['x-rapidapi-key'].substring(0, 8)}...`
        : '未设置',
      endpoint: error.config?.url || '未知',
    };
    errorResponse.message = `API调用失败: ${error.response.status} - ${error.response.statusText}`;

    // 如果API返回了错误信息，使用它
    if (error.response.data?.message) {
      errorResponse.message = error.response.data.message;
    }
    if (error.response.data?.errors) {
      errorResponse.apiErrors = error.response.data.errors;
    }
  }

  // 添加堆栈信息（仅开发环境）
  if (process.env.NODE_ENV === 'development' && error.stack) {
    errorResponse.stack = error.stack;
  }

  res.status(500).json(errorResponse);
}

// 手动触发今日比赛同步
router.post('/matches/today', async (req, res) => {
  try {
    await syncService.syncTodayMatches();
    res.json({ message: '今日比赛同步完成', success: true });
  } catch (error) {
    handleError(error, res, '今日比赛同步失败');
  }
});

// 手动触发直播比赛同步
router.post('/matches/live', async (req, res) => {
  try {
    await syncService.syncLiveMatches();
    res.json({ message: '直播比赛同步完成', success: true });
  } catch (error) {
    handleError(error, res, '直播比赛同步失败');
  }
});

// 手动触发积分榜同步
router.post('/standings/:league', async (req, res) => {
  try {
    const { league } = req.params;
    const leagueMap: { [key: string]: { id: number; name: string } } = {
      'premier-league': { id: LEAGUES.PREMIER_LEAGUE, name: '英超' },
      'la-liga': { id: LEAGUES.LA_LIGA, name: '西甲' },
      'bundesliga': { id: LEAGUES.BUNDESLIGA, name: '德甲' },
      'serie-a': { id: LEAGUES.SERIE_A, name: '意甲' },
      'ligue-1': { id: LEAGUES.LIGUE_1, name: '法甲' },
    };

    const leagueData = leagueMap[league];
    if (!leagueData) {
      return res.status(400).json({
        success: false,
        message: '不支持的联赛',
        supportedLeagues: Object.keys(leagueMap)
      });
    }

    await syncService.syncStandings(leagueData.id, leagueData.name);
    res.json({ message: `${leagueData.name}积分榜同步完成`, success: true });
  } catch (error) {
    handleError(error, res, '积分榜同步失败');
  }
});

// 使用爬虫获取Google比分
router.get('/scrape/google', async (req, res) => {
  try {
    const query = req.query.q as string || 'football scores today';
    const data = await webScraperService.scrapeGoogleScores(query);
    res.json({ data, count: data.length, success: true, message: 'Google爬虫执行成功' });
  } catch (error) {
    handleError(error, res, 'Google爬虫执行失败');
  }
});

// 使用爬虫获取FlashScore比分
router.get('/scrape/flashscore', async (req, res) => {
  try {
    const data = await webScraperService.scrapeFlashScore();
    res.json({ data, count: data.length, success: true, message: 'FlashScore爬虫执行成功' });
  } catch (error) {
    handleError(error, res, 'FlashScore爬虫执行失败');
  }
});

// 使用爬虫获取ESPN比分
router.get('/scrape/espn', async (req, res) => {
  try {
    const data = await webScraperService.scrapeESPN();
    res.json({ data, count: data.length, success: true, message: 'ESPN爬虫执行成功' });
  } catch (error) {
    handleError(error, res, 'ESPN爬虫执行失败');
  }
});

export default router;
