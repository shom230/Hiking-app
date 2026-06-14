import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  RefreshControl,
  Platform,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../utils/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { COLORS, BORDER_RADIUS, SHADOWS, TYPOGRAPHY } from '../styles/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function RankingTab({ userNickname, totalBadges, totalHeight }) {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRankings = async () => {
    try {
      const snapshot = await getDocs(
        collection(db, 'rankings')
      );
      const data = snapshot.docs
        .map(doc => doc.data())
        .sort((a, b) => {
          if (b.badgeCount !== a.badgeCount) {
            return b.badgeCount - a.badgeCount;
          }
          return (b.totalHeight || 0) - (a.totalHeight || 0);
        })
        .slice(0, 50);
      setRankings(data);
    } catch (e) {
      console.error('랭킹 불러오기 실패:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRankings();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRankings();
  };

  // Find user's rank index in top 50
  const userRankIndex = rankings.findIndex(r => r.nickname === userNickname);
  const userRank = userRankIndex !== -1 ? userRankIndex + 1 : null;
  const isTop50 = userRank !== null;

  // Comma helper
  const formatHeight = (height) => {
    return height.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + 'm';
  };

  const renderRankBadge = (rank) => {
    if (rank === 1) return <Text style={[styles.medalText, { color: '#D4AF37' }]}>🥇 1위</Text>;
    if (rank === 2) return <Text style={[styles.medalText, { color: '#94A3B8' }]}>🥈 2위</Text>;
    if (rank === 3) return <Text style={[styles.medalText, { color: '#B45309' }]}>🥉 3위</Text>;
    return <Text style={styles.normalRankText}>{rank}위</Text>;
  };

  return (
    <View style={styles.container}>
      {/* Upper User Rank Card */}
      <View style={[styles.userCard, SHADOWS.medium]}>
        <View style={styles.userCardHeader}>
          <Ionicons name="ribbon" size={24} color="#FFFFFF" />
          <Text style={styles.userCardTitle}>나의 실시간 랭킹</Text>
        </View>

        <View style={styles.userCardRow}>
          <View style={styles.userCardInfoCol}>
            <Text style={styles.userNicknameText}>{userNickname || '등산객'}</Text>
            <View style={styles.userStatsMetaRow}>
              <Text style={styles.userStatsMetaText}>뱃지 {totalBadges}개</Text>
              <View style={styles.metaDivider} />
              <Text style={styles.userStatsMetaText}>{formatHeight(totalHeight)}</Text>
            </View>
          </View>
          <View style={styles.userRankCol}>
            {isTop50 ? (
              <View style={styles.rankBadgeBg}>
                <Text style={styles.rankBadgeText}>{userRank}위</Text>
              </View>
            ) : (
              <View style={[styles.rankBadgeBg, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                <Text style={[styles.rankBadgeText, { fontSize: 13 }]}>50위 밖</Text>
              </View>
            )}
          </View>
        </View>

        {!isTop50 && (
          <View style={styles.outOfTopBanner}>
            <Text style={styles.outOfTopText}>
              현재 50위 밖입니다. 더 많은 산을 정복해보세요! 🏔️
            </Text>
          </View>
        )}
      </View>

      {/* Leaderboard Title Row */}
      <View style={styles.leaderboardHeader}>
        <Text style={styles.leaderboardTitle}>실시간 명예의 전당 (Top 50)</Text>
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={handleRefresh}
          disabled={loading || refreshing}
        >
          {loading || refreshing ? (
            <ActivityIndicator size="small" color="#2E7D32" />
          ) : (
            <Ionicons name="refresh" size={18} color="#2E7D32" />
          )}
        </TouchableOpacity>
      </View>

      {loading && rankings.length === 0 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loaderText}>랭킹 데이터를 불러오는 중...</Text>
        </View>
      ) : (
        <FlatList
          data={rankings}
          keyExtractor={(item) => item.nickname}
          renderItem={({ item, index }) => {
            const rank = index + 1;
            const isCurrentUser = item.nickname === userNickname;
            return (
              <View style={[
                styles.rankRow,
                isCurrentUser && styles.currentUserRow,
                SHADOWS.soft
              ]}>
                <View style={styles.rankCol}>
                  {renderRankBadge(rank)}
                </View>
                <View style={styles.nicknameCol}>
                  <Text style={[
                    styles.rankNicknameText,
                    isCurrentUser && styles.currentUserNicknameText
                  ]} numberOfLines={1}>
                    {item.nickname} {isCurrentUser && <Text style={styles.myTag}>(나)</Text>}
                  </Text>
                </View>
                <View style={styles.statsCol}>
                  <Text style={styles.rankStatsText}>뱃지 {item.badgeCount}개</Text>
                  <Text style={styles.rankHeightText}>{formatHeight(item.totalHeight)}</Text>
                </View>
              </View>
            );
          }}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#2E7D32']}
              tintColor="#2E7D32"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="alert-circle-outline" size={48} color="#94A3B8" />
              <Text style={styles.emptyText}>랭킹 정보가 아직 없습니다.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  userCard: {
    backgroundColor: '#2E7D32', // Vibrant forest green
    borderRadius: BORDER_RADIUS.xl,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
  },
  userCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  userCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.9)',
    marginLeft: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  userCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userCardInfoCol: {
    flex: 1,
  },
  userNicknameText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  userStatsMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userStatsMetaText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.85)',
  },
  metaDivider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 8,
  },
  userRankCol: {
    marginLeft: 16,
  },
  rankBadgeBg: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankBadgeText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#2E7D32',
  },
  outOfTopBanner: {
    marginTop: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  outOfTopText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  leaderboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  leaderboardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
  },
  refreshButton: {
    padding: 6,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  loaderText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  currentUserRow: {
    borderColor: '#2E7D32',
    backgroundColor: '#F0FDF4',
  },
  rankCol: {
    width: 60,
    justifyContent: 'center',
  },
  medalText: {
    fontSize: 14,
    fontWeight: '900',
  },
  normalRankText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  nicknameCol: {
    flex: 1,
    paddingRight: 10,
  },
  rankNicknameText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  currentUserNicknameText: {
    color: '#1B5E20',
    fontWeight: '800',
  },
  myTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2E7D32',
  },
  statsCol: {
    alignItems: 'flex-end',
  },
  rankStatsText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 2,
  },
  rankHeightText: {
    fontSize: 11,
    color: '#9E9E9E',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
  },
});
