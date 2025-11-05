import express from 'express';
import { syncService } from '../services/syncService';
import { webScraperService } from '../services/webScraper';
import { LEAGUES } from '../services/footballApi';

const router = express.Router();

// 手动触发今日比赛同步
router.post('/matches/today', async (req, res) => {
  try {
    await syncService.syncTodayMatches();
    res.json({ message: '今日比赛同步完成', success: true });
  } catch (error) {
    res.status(500).json({ message: '同步失败', error: (error as Error).message });
  }
});

// 手动触发直播比赛同步
router.post('/matches/live', async (req, res) => {
  try {
    await syncService.syncLiveMatches();
    res.json({ message: '直播比赛同步完成', success: true });
  } catch (error) {
    res.status(500).json({ message: '同步失败', error: (error as Error).message });
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
      return res.status(400).json({ message: '不支持的联赛' });
    }

    await syncService.syncStandings(leagueData.id, leagueData.name);
    res.json({ message: `${leagueData.name}积分榜同步完成`, success: true });
  } catch (error) {
    res.status(500).json({ message: '同步失败', error: (error as Error).message });
  }
});

// 使用爬虫获取Google比分
router.get('/scrape/google', async (req, res) => {
  try {
    const query = req.query.q as string || 'football scores today';
    const data = await webScraperService.scrapeGoogleScores(query);
    res.json({ data, count: data.length, success: true });
  } catch (error) {
    res.status(500).json({ message: '爬取失败', error: (error as Error).message });
  }
});

// 使用爬虫获取FlashScore比分
router.get('/scrape/flashscore', async (req, res) => {
  try {
    const data = await webScraperService.scrapeFlashScore();
    res.json({ data, count: data.length, success: true });
  } catch (error) {
    res.status(500).json({ message: '爬取失败', error: (error as Error).message });
  }
});

// 使用爬虫获取ESPN比分
router.get('/scrape/espn', async (req, res) => {
  try {
    const data = await webScraperService.scrapeESPN();
    res.json({ data, count: data.length, success: true });
  } catch (error) {
    res.status(500).json({ message: '爬取失败', error: (error as Error).message });
  }
});

export default router;
