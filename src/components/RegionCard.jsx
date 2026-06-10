import React, { useRef } from 'react';
import { StyleSheet, Text, View, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, BORDER_RADIUS, TYPOGRAPHY } from '../styles/theme';

export default function RegionCard({ region, totalCount, completedCount, onPress }) {
  // Micro-interaction: Press Scale Animation
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
      tension: 100,
      friction: 6,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 6,
    }).start();
  };

  // Calculate completion percentage
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isFullyCompleted = completedCount === totalCount && totalCount > 0;

  // Choose sub-theme colors dynamically based on region name to add excitement
  const getRegionTheme = () => {
    if (isFullyCompleted) return { bg: '#E8F5E9', border: COLORS.sage, iconColor: COLORS.primary };
    if (completedCount > 0) return { bg: '#F1F8F5', border: 'rgba(45, 106, 79, 0.3)', iconColor: COLORS.primaryLight };
    return { bg: '#FFFFFF', border: 'rgba(226, 232, 240, 0.8)', iconColor: '#94A3B8' };
  };

  const theme = getRegionTheme();

  return (
    <Animated.View style={[styles.cardContainer, { transform: [{ scale: scaleValue }] }]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: theme.bg,
            borderColor: theme.border,
          },
        ]}
      >
        {/* Card Header with Region Name and Lock/Completion status */}
        <View style={styles.header}>
          <Text style={styles.regionName}>{region}</Text>
          {isFullyCompleted ? (
            <View style={styles.badgeLabelContainer}>
              <Ionicons name="ribbon" size={16} color={COLORS.accentGold} />
              <Text style={styles.badgeLabelText}>완료</Text>
            </View>
          ) : completedCount > 0 ? (
            <View style={[styles.badgeLabelContainer, { backgroundColor: 'rgba(45, 106, 79, 0.1)' }]}>
              <Text style={[styles.badgeLabelText, { color: COLORS.primary }]}>진행중</Text>
            </View>
          ) : null}
        </View>

        {/* Progress statistics */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            산 뱃지 <Text style={styles.statsHighlight}>{completedCount}</Text> / {totalCount}
          </Text>
          <Text style={styles.percentText}>{percent}%</Text>
        </View>

        {/* Mini progress bar */}
        <View style={styles.progressBarBg}>
          <View 
            style={[
              styles.progressBarFill, 
              { 
                width: `${percent}%`,
                backgroundColor: percent === 100 ? COLORS.accentGold : COLORS.sage
              }
            ]} 
          />
        </View>

        {/* Footer Icon */}
        <View style={styles.footer}>
          <Text style={styles.exploreText}>도감 보기</Text>
          <Ionicons name="arrow-forward" size={14} color={theme.iconColor} />
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '47%', // Fits 2 cards per row with margins
    marginBottom: 16,
    ...SHADOWS.soft,
  },
  card: {
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1.5,
    padding: 16,
    height: 140,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  regionName: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.primaryDark,
  },
  badgeLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  badgeLabelText: {
    fontSize: 10,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.accentOrange,
    marginLeft: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 8,
  },
  statsText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.textMuted,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  statsHighlight: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.weights.bold,
  },
  percentText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.primary,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: BORDER_RADIUS.round,
    overflow: 'hidden',
    marginTop: 6,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.round,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(226, 232, 240, 0.5)',
    paddingTop: 8,
  },
  exploreText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
});
