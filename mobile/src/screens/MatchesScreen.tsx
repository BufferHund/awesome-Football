import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { matchService } from '../services/api';
import { Match } from '../types';

const MatchesScreen = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const data = await matchService.getTodayMatches().catch(() => []);
      setMatches(data);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadMatches();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return '#ef4444';
      case 'finished':
        return '#6b7280';
      default:
        return '#3b82f6';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'live':
        return 'LIVE';
      case 'finished':
        return '已结束';
      default:
        return '未开始';
    }
  };

  const renderMatch = ({ item }: { item: Match }) => (
    <TouchableOpacity style={styles.matchCard}>
      <View style={styles.matchHeader}>
        <Text style={styles.matchLeague}>{item.league}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.matchBody}>
        <View style={styles.team}>
          <Text style={styles.teamName}>{item.homeTeam}</Text>
          <Text style={styles.score}>{item.homeScore ?? '-'}</Text>
        </View>

        <Text style={styles.vs}>VS</Text>

        <View style={styles.team}>
          <Text style={styles.teamName}>{item.awayTeam}</Text>
          <Text style={styles.score}>{item.awayScore ?? '-'}</Text>
        </View>
      </View>

      <View style={styles.matchFooter}>
        <Ionicons name="time-outline" size={16} color="#9ca3af" />
        <Text style={styles.time}>
          {new Date(item.startTime).toLocaleString('zh-CN', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
        {item.venue && (
          <>
            <Ionicons name="location-outline" size={16} color="#9ca3af" style={{ marginLeft: 16 }} />
            <Text style={styles.venue}>{item.venue}</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={styles.loadingText}>加载比赛中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={matches}
        renderItem={renderMatch}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#16a34a']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="football-outline" size={64} color="#9ca3af" />
            <Text style={styles.emptyText}>今日暂无比赛</Text>
          </View>
        }
      />
    </View>
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
  listContent: {
    padding: 16,
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
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  matchLeague: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  matchBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  team: {
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
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  vs: {
    fontSize: 14,
    color: '#9ca3af',
    marginHorizontal: 16,
  },
  matchFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 12,
    color: '#9ca3af',
    marginLeft: 4,
  },
  venue: {
    fontSize: 12,
    color: '#9ca3af',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 48,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#9ca3af',
  },
});

export default MatchesScreen;
