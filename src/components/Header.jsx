import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, BORDER_RADIUS, TYPOGRAPHY } from '../styles/theme';

const REGION_FULL_NAMES = {
  '경기': '경기도',
  '강원': '강원도',
  '충북': '충청북도',
  '충남': '충청남도',
  '전북': '전라북도',
  '전남': '전라남도',
  '경북': '경상북도',
  '경남': '경상남도',
  '제주': '제주도'
};

export default function Header({ 
  currentScreen, 
  selectedRegion, 
  onBack, 
  regionStats,
  currentPage, // 0 for Map, 1 for Region Cards list
  onPressProfile,
  hidePagerDots
}) {
  const isHomeScreen = currentScreen === 'map' || currentScreen === 'challenges';

  return (
    <View style={styles.headerContainer}>
      {isHomeScreen ? (
        <View style={styles.homeHeaderRow}>
          <Text style={styles.appTitle}>등산도감</Text>
          
          {currentScreen !== 'challenges' && !hidePagerDots ? (
            <View style={styles.pagerDotsContainer}>
              <View style={[styles.pagerDot, currentPage === 0 ? styles.pagerDotActive : styles.pagerDotInactive]} />
              <View style={[styles.pagerDot, currentPage === 1 ? styles.pagerDotActive : styles.pagerDotInactive]} />
            </View>
          ) : currentScreen === 'challenges' ? (
            <Text style={styles.challengeTabSubtitle}>테마 챌린지</Text>
          ) : null}
          
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={onPressProfile}
          >
            <View style={styles.profileCircle}>
              <Ionicons name="person" size={16} color="#64748B" />
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.regionHeaderContainer}>
          <View style={styles.topRow}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={COLORS.primaryDark} />
            </TouchableOpacity>
            <Text style={styles.regionTitle}>{REGION_FULL_NAMES[selectedRegion] || selectedRegion}</Text>
            <View style={{ width: 32 }} />
          </View>

          <View style={styles.regionProgressBox}>
            <View style={styles.regionProgressTextRow}>
              <Text style={styles.regionProgressLabel}>이 지역 뱃지</Text>
              <Text style={styles.regionProgressCount}>
                <Text style={styles.regionProgressHighlight}>{regionStats.completed}</Text> / {regionStats.total}
              </Text>
            </View>
            
            <View style={styles.regionProgressBarBg}>
              <View style={[styles.regionProgressBarFill, { width: `${(regionStats.completed / regionStats.total) * 100}%` }]} />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#FFFFFF', // Clean white background
    paddingTop: 12, // Reduced double-padding to support SafeAreaView notch insets
    paddingBottom: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  homeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B', // Deep Slate
    letterSpacing: -0.5,
  },
  pagerDotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pagerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },
  pagerDotActive: {
    backgroundColor: '#2E7D32', // Active indicator is Green
    width: 14, // Slightly elongated to show emphasis
  },
  pagerDotInactive: {
    backgroundColor: '#CBD5E1', // Inactive is grey
  },
  profileButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: '#2E7D32', // Vibrant Green border
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
    backgroundColor: '#CBD5E1', // Grey avatar background
    justifyContent: 'center',
    alignItems: 'center',
  },
  regionHeaderContainer: {
    width: '100%',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  regionTitle: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.primaryDark,
  },
  regionProgressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  regionProgressTextRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginRight: 12,
  },
  regionProgressLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginRight: 4,
  },
  regionProgressCount: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.textDark,
  },
  regionProgressHighlight: {
    fontWeight: TYPOGRAPHY.weights.bold,
    color: '#2E7D32',
  },
  regionProgressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: BORDER_RADIUS.round,
    overflow: 'hidden',
  },
  regionProgressBarFill: {
    height: '100%',
    backgroundColor: '#2E7D32',
    borderRadius: BORDER_RADIUS.round,
  },
  challengeTabSubtitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#854D0E', // Gold contrast
    backgroundColor: '#FEF9C3',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
});
