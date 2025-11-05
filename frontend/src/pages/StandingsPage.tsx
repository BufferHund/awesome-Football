import { useEffect, useState } from 'react';
import { Standing } from '../types';
import { standingService, scraperService } from '../services/api';

type StandingsSource = 'database' | 'espn';

interface LeagueOption {
  name: string;
  code: string;
}

const LEAGUES: LeagueOption[] = [
  { name: '英超', code: 'eng.1' },
  { name: '西甲', code: 'esp.1' },
  { name: '德甲', code: 'ger.1' },
  { name: '意甲', code: 'ita.1' },
  { name: '法甲', code: 'fra.1' },
];

const StandingsPage = () => {
  const [standings, setStandings] = useState<any[]>([]);
  const [competitions, setCompetitions] = useState<string[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [selectedSource, setSelectedSource] = useState<StandingsSource>('database');
  const [scraping, setScraping] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState<string>(LEAGUES[0].code);

  useEffect(() => {
    loadCompetitions();
  }, []);

  useEffect(() => {
    if (selectedCompetition && selectedSource === 'database') {
      loadStandings(selectedCompetition);
    }
  }, [selectedCompetition]);

  const loadCompetitions = async () => {
    try {
      const response = await standingService.getCompetitions();
      const comps = response.data;
      setCompetitions(comps);
      if (comps.length > 0) {
        setSelectedCompetition(comps[0]);
      } else {
        // 如果数据库没有数据，自动切换到爬虫模式
        console.log('数据库没有积分榜数据，切换到爬虫模式');
        setSelectedSource('espn');
        scrapeStandings('espn', selectedLeague);
      }
    } catch (error) {
      console.error('加载联赛列表失败:', error);
      // 发生错误时也切换到爬虫模式
      setSelectedSource('espn');
      scrapeStandings('espn', selectedLeague);
    } finally {
      setLoading(false);
    }
  };

  const loadStandings = async (competition: string) => {
    setLoading(true);
    try {
      const response = await standingService.getByCompetition(competition);
      setStandings(response.data);
    } catch (error) {
      console.error('加载积分榜失败:', error);
      setStandings([]);
    } finally {
      setLoading(false);
    }
  };

  const scrapeStandings = async (source: 'espn', league?: string) => {
    setScraping(true);
    setSelectedSource(source);
    try {
      const response = await scraperService.scrapeESPNStandings(league);

      // 后端返回格式: { data: [...], count: N, success: true }
      const standingsData = response.data.data || [];

      // 转换爬虫数据格式为统一格式
      const scrapedStandings = standingsData.map((item: any, index: number) => ({
        id: `scraped-${source}-${index}`,
        position: item.position || index + 1,
        team: {
          id: `team-${index}`,
          name: item.team,
          shortName: item.team,
          logo: null,
          country: '',
        },
        competition: league || 'Premier League',
        played: item.played || 0,
        won: item.won || 0,
        drawn: item.drawn || 0,
        lost: item.lost || 0,
        goalsFor: item.goalsFor || 0,
        goalsAgainst: item.goalsAgainst || 0,
        goalDiff: item.goalDiff || 0,
        points: item.points || 0,
        form: item.form || null,
      }));

      setStandings(scrapedStandings);
    } catch (error) {
      console.error(`从${source.toUpperCase()}爬取积分榜失败:`, error);
      setStandings([]);
    } finally {
      setScraping(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">积分榜</h1>

        {/* 数据源选择 */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">数据源:</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSelectedSource('database');
                if (selectedCompetition) {
                  loadStandings(selectedCompetition);
                }
              }}
              disabled={loading || scraping}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedSource === 'database'
                  ? 'bg-green-600 text-white'
                  : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700'
              } disabled:opacity-50`}
            >
              数据库
            </button>
            <button
              onClick={() => scrapeStandings('espn', selectedLeague)}
              disabled={loading || scraping}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedSource === 'espn'
                  ? 'bg-green-600 text-white'
                  : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700'
              } disabled:opacity-50`}
            >
              ESPN 爬虫
            </button>
          </div>
        </div>
      </div>

      {/* 联赛选择器 - 仅在使用爬虫时显示 */}
      {selectedSource !== 'database' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            选择联赛:
          </label>
          <div className="flex flex-wrap gap-2">
            {LEAGUES.map((league) => (
              <button
                key={league.code}
                onClick={() => {
                  setSelectedLeague(league.code);
                  if (selectedSource === 'espn') {
                    scrapeStandings('espn', league.code);
                  }
                }}
                disabled={scraping}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedLeague === league.code
                    ? 'bg-green-600 text-white'
                    : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700'
                } disabled:opacity-50`}
              >
                {league.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 数据库模式的联赛选择器 */}
      {selectedSource === 'database' && competitions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {competitions.map((comp) => (
            <button
              key={comp}
              onClick={() => setSelectedCompetition(comp)}
              disabled={loading}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCompetition === comp
                  ? 'bg-green-600 text-white'
                  : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700'
              } disabled:opacity-50`}
            >
              {comp}
            </button>
          ))}
        </div>
      )}

      {/* 积分榜表格 */}
      {(loading || scraping) ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              {scraping ? `正在从 ${selectedSource.toUpperCase()} 获取积分榜...` : '加载中...'}
            </p>
          </div>
        </div>
      ) : standings.length > 0 ? (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">排名</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">球队</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">赛</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">胜</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">平</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">负</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">进球</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">失球</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">净胜球</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">积分</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">状态</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((standing) => (
                <tr key={standing.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <span
                      className={`font-bold ${
                        standing.position <= 4
                          ? 'text-green-600'
                          : standing.position <= 6
                          ? 'text-blue-600'
                          : standing.position >= standings.length - 2
                          ? 'text-red-600'
                          : ''
                      }`}
                    >
                      {standing.position}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      {standing.team.logo && (
                        <img src={standing.team.logo} alt={standing.team.name} className="w-8 h-8" />
                      )}
                      <span className="font-medium">{standing.team.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">{standing.played}</td>
                  <td className="px-4 py-4 text-center">{standing.won}</td>
                  <td className="px-4 py-4 text-center">{standing.drawn}</td>
                  <td className="px-4 py-4 text-center">{standing.lost}</td>
                  <td className="px-4 py-4 text-center">{standing.goalsFor}</td>
                  <td className="px-4 py-4 text-center">{standing.goalsAgainst}</td>
                  <td className="px-4 py-4 text-center">
                    <span className={standing.goalDiff >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {standing.goalDiff >= 0 ? '+' : ''}{standing.goalDiff}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="font-bold text-green-600">{standing.points}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {standing.form && (
                      <div className="flex space-x-1 justify-center">
                        {standing.form.split('').map((result, idx) => (
                          <span
                            key={idx}
                            className={`w-5 h-5 rounded-full text-xs flex items-center justify-center text-white font-bold ${
                              result === 'W'
                                ? 'bg-green-500'
                                : result === 'D'
                                ? 'bg-gray-400'
                                : 'bg-red-500'
                            }`}
                          >
                            {result}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">暂无积分榜数据</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">
            {selectedSource === 'espn'
              ? '爬虫暂时无法获取积分榜数据，网站结构可能已更新'
              : '数据库中暂无积分榜数据，请尝试使用爬虫获取'}
          </p>
          {selectedSource === 'espn' && (
            <p className="text-xs text-gray-400 dark:text-gray-500">
              提示：积分榜爬虫功能正在维护中
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default StandingsPage;
