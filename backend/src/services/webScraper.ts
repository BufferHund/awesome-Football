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

  // 爬取BBC Sport英超积分榜
  async scrapePremierLeagueStandings(): Promise<any[]> {
    try {
      const response = await axios.get('https://www.bbc.com/sport/football/premier-league/table', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      const $ = cheerio.load(response.data);
      const standings: any[] = [];

      $('.gs-o-table__row').each((index, element) => {
        const position = $(element).find('.gs-o-table__cell--rank').text().trim();
        const team = $(element).find('.gs-o-table__cell--team').text().trim();
        const played = $(element).find('.gs-o-table__cell--played').text().trim();
        const won = $(element).find('.gs-o-table__cell--won').text().trim();
        const drawn = $(element).find('.gs-o-table__cell--drawn').text().trim();
        const lost = $(element).find('.gs-o-table__cell--lost').text().trim();
        const goalsFor = $(element).find('.gs-o-table__cell--for').text().trim();
        const goalsAgainst = $(element).find('.gs-o-table__cell--against').text().trim();
        const goalDiff = $(element).find('.gs-o-table__cell--goal-diff').text().trim();
        const points = $(element).find('.gs-o-table__cell--points').text().trim();

        if (team && position) {
          standings.push({
            position: parseInt(position) || index + 1,
            team,
            played: parseInt(played) || 0,
            won: parseInt(won) || 0,
            drawn: parseInt(drawn) || 0,
            lost: parseInt(lost) || 0,
            goalsFor: parseInt(goalsFor) || 0,
            goalsAgainst: parseInt(goalsAgainst) || 0,
            goalDiff: parseInt(goalDiff) || 0,
            points: parseInt(points) || 0,
          });
        }
      });

      return standings;
    } catch (error) {
      console.error('BBC Sport积分榜爬取失败:', error);
      return [];
    }
  },

  // 爬取ESPN积分榜（通用）
  async scrapeESPNStandings(league: string = 'eng.1'): Promise<any[]> {
    try {
      // ESPN联赛代码: eng.1 (英超), esp.1 (西甲), ger.1 (德甲), ita.1 (意甲), fra.1 (法甲)
      const response = await axios.get(`https://www.espn.com/soccer/standings/_/league/${league}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      const $ = cheerio.load(response.data);
      const standings: any[] = [];

      $('.Table__TR').each((index, element) => {
        const cells = $(element).find('.Table__TD, .Table__TH');
        if (cells.length >= 10) {
          const team = $(cells[1]).text().trim();
          const played = $(cells[2]).text().trim();
          const won = $(cells[3]).text().trim();
          const drawn = $(cells[4]).text().trim();
          const lost = $(cells[5]).text().trim();
          const goalsFor = $(cells[6]).text().trim();
          const goalsAgainst = $(cells[7]).text().trim();
          const goalDiff = $(cells[8]).text().trim();
          const points = $(cells[9]).text().trim();

          if (team && team !== 'Team') {
            standings.push({
              position: index,
              team,
              played: parseInt(played) || 0,
              won: parseInt(won) || 0,
              drawn: parseInt(drawn) || 0,
              lost: parseInt(lost) || 0,
              goalsFor: parseInt(goalsFor) || 0,
              goalsAgainst: parseInt(goalsAgainst) || 0,
              goalDiff: parseInt(goalDiff) || 0,
              points: parseInt(points) || 0,
            });
          }
        }
      });

      return standings;
    } catch (error) {
      console.error('ESPN积分榜爬取失败:', error);
      return [];
    }
  },

  // 爬取BBC Sport足球新闻
  async scrapeBBCFootballNews(): Promise<any[]> {
    try {
      const response = await axios.get('https://www.bbc.com/sport/football', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      const $ = cheerio.load(response.data);
      const news: any[] = [];

      // 尝试多种选择器，BBC网站结构经常变化
      const selectors = [
        '.gs-c-promo',
        'article[class*="promo"]',
        '[data-testid*="card"]',
        '.ssrcss-1f3bvyz-Stack',
        'article'
      ];

      for (const selector of selectors) {
        if (news.length > 0) break; // 如果已经找到新闻，跳出循环

        $(selector).each((index, element) => {
          if (index >= 20) return false; // 最多20条

          // 尝试多种方式提取标题
          const title = $(element).find('.gs-c-promo-heading__title, h2, h3, [class*="heading"], [class*="title"]').first().text().trim();
          const summary = $(element).find('.gs-c-promo-summary, p, [class*="summary"], [class*="description"]').first().text().trim();

          // 提取链接
          const linkElement = $(element).find('a').first();
          const link = linkElement.attr('href');

          // 提取图片
          const image = $(element).find('img').first().attr('src');
          const time = $(element).find('[class*="timestamp"], time').first().text().trim();

          if (title && title.length > 10) { // 确保标题有意义
            let fullUrl = null;
            if (link) {
              fullUrl = link.startsWith('http') ? link : `https://www.bbc.com${link}`;
            }

            news.push({
              title,
              summary: summary || title,
              content: summary || title,
              coverImage: image || null,
              url: fullUrl,
              publishDate: time || new Date().toISOString(),
              category: '足球新闻',
              author: 'BBC Sport',
              views: 0,
            });
          }
        });
      }

      return news.slice(0, 20); // 返回前20条
    } catch (error) {
      console.error('BBC Sport新闻爬取失败:', error);
      return [];
    }
  },

  // 爬取ESPN足球新闻
  async scrapeESPNFootballNews(): Promise<any[]> {
    try {
      const response = await axios.get('https://www.espn.com/soccer/', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      const $ = cheerio.load(response.data);
      const news: any[] = [];

      // 尝试多种选择器以适应ESPN的结构变化
      const selectors = [
        '.contentItem',
        'article',
        '[class*="contentItem"]',
        '.Card'
      ];

      for (const selector of selectors) {
        if (news.length > 0) break;

        $(selector).each((index, element) => {
          if (index >= 20) return false;

          const $el = $(element);
          const title = $el.find('.contentItem__title, h2, h3, [class*="headline"]').first().text().trim();
          const summary = $el.find('.contentItem__subhead, p, [class*="description"]').first().text().trim();

          // 尝试多种方式获取链接
          let link = $el.find('.contentItem__title a, a[href*="/story/"], a[href*="/news/"]').first().attr('href');
          if (!link) {
            link = $el.find('a').first().attr('href');
          }

          const image = $el.find('.contentItem__image img, img').first().attr('src');

          if (title && title.length > 10) {
            // 处理相对URL，确保返回完整URL
            let fullUrl = null;
            if (link) {
              if (link.startsWith('http')) {
                fullUrl = link;
              } else if (link.startsWith('/')) {
                fullUrl = `https://www.espn.com${link}`;
              } else {
                fullUrl = `https://www.espn.com/${link}`;
              }
            }

            console.log(`ESPN新闻: ${title.substring(0, 50)}... | URL: ${fullUrl}`);

            news.push({
              title,
              summary: summary || title,
              content: summary || title,
              coverImage: image || null,
              url: fullUrl,
              publishDate: new Date().toISOString(),
              category: '足球新闻',
              author: 'ESPN',
              views: 0,
            });
          }
        });
      }

      console.log(`ESPN爬虫完成，共获取 ${news.length} 条新闻`);
      return news.slice(0, 20); // 返回前20条
    } catch (error) {
      console.error('ESPN新闻爬取失败:', error);
      return [];
    }
  },

  // 爬取Goal.com足球新闻
  async scrapeGoalNews(): Promise<any[]> {
    try {
      const response = await axios.get('https://www.goal.com/en', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      const $ = cheerio.load(response.data);
      const news: any[] = [];

      $('article').each((index, element) => {
        const title = $(element).find('h3, h2, .article-title').text().trim();
        const summary = $(element).find('.article-summary, p').first().text().trim();
        const link = $(element).find('a').first().attr('href');
        const image = $(element).find('img').first().attr('src');

        if (title) {
          news.push({
            title,
            summary: summary || title,
            content: summary || title,
            coverImage: image || null,
            url: link ? (link.startsWith('http') ? link : `https://www.goal.com${link}`) : null,
            publishDate: new Date().toISOString(),
            category: '足球新闻',
            author: 'Goal.com',
            views: 0,
          });
        }
      });

      return news.slice(0, 20); // 返回前20条
    } catch (error) {
      console.error('Goal.com新闻爬取失败:', error);
      return [];
    }
  },
};
