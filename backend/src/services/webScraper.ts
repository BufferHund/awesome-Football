import axios from 'axios';
import * as cheerio from 'cheerio';

// Google搜索爬虫服务
export const webScraperService = {
  // 爬取Google足球比分
  async scrapeGoogleScores(query: string = 'football scores today'): Promise<any[]> {
    try {
      const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      const $ = cheerio.load(response.data);
      const matches: any[] = [];

      // Google体育比分通常在特定的div中
      $('.imso_mh__l-tm-stc').each((index, element) => {
        const homeTeam = $(element).find('.imso_mh__first-tn-ed').text().trim();
        const awayTeam = $(element).find('.imso_mh__second-tn-ed').text().trim();
        const homeScore = $(element).find('.imso_mh__l-tm-sc').first().text().trim();
        const awayScore = $(element).find('.imso_mh__r-tm-sc').first().text().trim();
        const time = $(element).find('.imso_mh__vs-at-t').text().trim();

        if (homeTeam && awayTeam) {
          matches.push({
            homeTeam,
            awayTeam,
            homeScore: homeScore || null,
            awayScore: awayScore || null,
            time,
          });
        }
      });

      return matches;
    } catch (error) {
      console.error('Google爬取失败:', error);
      return [];
    }
  },

  // 爬取FlashScore
  async scrapeFlashScore(): Promise<any[]> {
    try {
      const response = await axios.get('https://www.flashscore.com/football/', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      const $ = cheerio.load(response.data);
      const matches: any[] = [];

      // FlashScore的比赛数据结构
      $('.event__match').each((index, element) => {
        const homeTeam = $(element).find('.event__participant--home').text().trim();
        const awayTeam = $(element).find('.event__participant--away').text().trim();
        const homeScore = $(element).find('.event__score--home').text().trim();
        const awayScore = $(element).find('.event__score--away').text().trim();
        const time = $(element).find('.event__time').text().trim();

        if (homeTeam && awayTeam) {
          matches.push({
            homeTeam,
            awayTeam,
            homeScore: homeScore || null,
            awayScore: awayScore || null,
            time,
          });
        }
      });

      return matches;
    } catch (error) {
      console.error('FlashScore爬取失败:', error);
      return [];
    }
  },

  // 爬取ESPN足球数据
  async scrapeESPN(): Promise<any[]> {
    try {
      const response = await axios.get('https://www.espn.com/soccer/scoreboard', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      const $ = cheerio.load(response.data);
      const matches: any[] = [];

      $('.Scoreboard').each((index, element) => {
        const teams = $(element).find('.ScoreCell__TeamName');
        const scores = $(element).find('.ScoreCell__Score');

        if (teams.length >= 2) {
          matches.push({
            homeTeam: $(teams[0]).text().trim(),
            awayTeam: $(teams[1]).text().trim(),
            homeScore: $(scores[0]).text().trim() || null,
            awayScore: $(scores[1]).text().trim() || null,
          });
        }
      });

      return matches;
    } catch (error) {
      console.error('ESPN爬取失败:', error);
      return [];
    }
  },
};
