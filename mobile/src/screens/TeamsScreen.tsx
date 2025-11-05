import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { teamService } from '../services/api';
import { Team } from '../types';

const TeamsScreen = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadTeams = async () => {
    try {
      setLoading(true);
      const data = await teamService.getAllTeams().catch(() => []);
      setTeams(data);
      setFilteredTeams(data);
    } catch (error) {
      console.error('Error loading teams:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTeams(teams);
    } else {
      const filtered = teams.filter(
        (team) =>
          team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          team.stadium?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTeams(filtered);
    }
  }, [searchQuery, teams]);

  const onRefresh = () => {
    setRefreshing(true);
    loadTeams();
  };

  const renderTeam = ({ item }: { item: Team }) => (
    <TouchableOpacity style={styles.teamCard}>
      <View style={styles.teamHeader}>
        <View style={styles.teamInfo}>
          <Text style={styles.teamName}>{item.name}</Text>
          {item.founded && (
            <Text style={styles.teamDetail}>创建于 {item.founded}</Text>
          )}
        </View>
        <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
      </View>

      {item.stadium && (
        <View style={styles.stadiumRow}>
          <Ionicons name="location" size={16} color="#6b7280" />
          <Text style={styles.stadiumText}>{item.stadium}</Text>
        </View>
      )}

      {item.coach && (
        <View style={styles.coachRow}>
          <Ionicons name="person" size={16} color="#6b7280" />
          <Text style={styles.coachText}>主教练: {item.coach}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={styles.loadingText}>加载球队中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="搜索球队或球场..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9ca3af"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredTeams}
        renderItem={renderTeam}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#16a34a']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="shield-outline" size={64} color="#9ca3af" />
            <Text style={styles.emptyText}>
              {searchQuery ? '未找到相关球队' : '暂无球队数据'}
            </Text>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  teamCard: {
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
  teamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  teamDetail: {
    fontSize: 14,
    color: '#6b7280',
  },
  stadiumRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stadiumText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 6,
  },
  coachRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coachText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 6,
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

export default TeamsScreen;
