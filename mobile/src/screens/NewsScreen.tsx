import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { newsService } from '../services/api';
import { News } from '../types';

const NewsScreen = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNews = async () => {
    try {
      setLoading(true);
      const data = await newsService.getAllNews().catch(() => []);
      setNews(data);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadNews();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}分钟前`;
    } else if (diffHours < 24) {
      return `${diffHours}小时前`;
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else {
      return date.toLocaleDateString('zh-CN', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const renderNewsItem = ({ item }: { item: News }) => (
    <TouchableOpacity style={styles.newsCard}>
      <View style={styles.newsContent}>
        <View style={styles.newsTextContainer}>
          <Text style={styles.newsTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.newsContent} numberOfLines={2}>
            {item.content}
          </Text>
          <View style={styles.newsFooter}>
            <View style={styles.sourceContainer}>
              <Ionicons name="newspaper-outline" size={14} color="#9ca3af" />
              <Text style={styles.sourceText}>{item.source}</Text>
            </View>
            <View style={styles.timeContainer}>
              <Ionicons name="time-outline" size={14} color="#9ca3af" />
              <Text style={styles.timeText}>{formatDate(item.publishedAt)}</Text>
            </View>
          </View>
        </View>
        {item.imageUrl && (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.newsImage}
            resizeMode="cover"
          />
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={styles.loadingText}>加载新闻中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={news}
        renderItem={renderNewsItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#16a34a']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="newspaper-outline" size={64} color="#9ca3af" />
            <Text style={styles.emptyText}>暂无新闻</Text>
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
  newsContent: {
    flexDirection: 'row',
    gap: 12,
  },
  newsTextContainer: {
    flex: 1,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    lineHeight: 22,
  },
  newsContent: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sourceText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  newsImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
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

export default NewsScreen;
