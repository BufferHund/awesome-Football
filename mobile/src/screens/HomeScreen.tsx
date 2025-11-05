import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { matchService, newsService } from '../services/api';
import { Match, News } from '../types';

const HomeScreen = () => {
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [latestNews, setLatestNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [matches, news] = await Promise.all([
        matchService.getLiveMatches().catch(() => []),
        newsService.getAllNews().catch(() => []),
      ]);
      setLiveMatches(matches.slice(0, 3));
      setLatestNews(news.slice(0, 5));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#16a34a']} />
      }
    >
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>懂球帝</Text>
        <Text style={styles.heroSubtitle}>你的足球世界</Text>
      </View>

      {/* Live Matches Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="radio-outline" size={24} color="#ef4444" />
          <Text style={styles.sectionTitle}>正在直播</Text>
        </View>

        {liveMatches.length > 0 ? (
          liveMatches.map((match) => (
            <TouchableOpacity key={match.id} style={styles.matchCard}>
              <View style={styles.matchCardHeader}>
                <Text style={styles.matchLeague}>{match.league}</Text>
                <View style={styles.liveBadge}>
                  <Text style={styles.liveBadgeText}>LIVE</Text>
                </View>
              </View>
              <View style={styles.matchTeams}>
                <View style={styles.teamContainer}>
                  <Text style={styles.teamName}>{match.homeTeam}</Text>
                  <Text style={styles.teamScore}>{match.homeScore ?? '-'}</Text>
                </View>
                <Text style={styles.vs}>vs</Text>
                <View style={styles.teamContainer}>
                  <Text style={styles.teamName}>{match.awayTeam}</Text>
                  <Text style={styles.teamScore}>{match.awayScore ?? '-'}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="football-outline" size={48} color="#9ca3af" />
            <Text style={styles.emptyText}>暂无直播比赛</Text>
          </View>
        )}
      </View>

      {/* Latest News Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="newspaper-outline" size={24} color="#3b82f6" />
          <Text style={styles.sectionTitle}>最新资讯</Text>
        </View>

        {latestNews.length > 0 ? (
          latestNews.map((news) => (
            <TouchableOpacity key={news.id} style={styles.newsCard}>
              <Text style={styles.newsTitle} numberOfLines={2}>
                {news.title}
              </Text>
              <Text style={styles.newsSummary} numberOfLines={2}>
                {news.summary}
              </Text>
              <View style={styles.newsFooter}>
                <Text style={styles.newsAuthor}>{news.author}</Text>
                <Text style={styles.newsDate}>
                  {new Date(news.publishedAt).toLocaleDateString('zh-CN')}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="newspaper-outline" size={48} color="#9ca3af" />
            <Text style={styles.emptyText}>暂无新闻</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  heroSection: {
    backgroundColor: '#16a34a',
    padding: 24,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#d1fae5',
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 8,
  },
  matchCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  matchCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  matchLeague: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  liveBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  liveBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  matchTeams: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamContainer: {
    flex: 1,
    alignItems: 'center',
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  teamScore: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  vs: {
    fontSize: 14,
    color: '#9ca3af',
    marginHorizontal: 16,
  },
  newsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  newsSummary: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newsAuthor: {
    fontSize: 12,
    color: '#9ca3af',
  },
  newsDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#9ca3af',
  },
});

export default HomeScreen;
