import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, BORDER_RADIUS, SHADOWS, TYPOGRAPHY } from '../styles/theme';
import { MOUNTAINS_DATA } from '../data/mountains';
import { CHALLENGE_DEFINITIONS, evaluateAllChallenges } from '../utils/ChallengeEvaluator';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CATEGORIES = ['전체', '지역', '높이', '난이도', '계절', '특수'];

export default function ChallengeTab({ achievements }) {
  const [activeCategory, setActiveCategory] = useState('전체');

  // Evaluate progress for all 20 challenges reactively
  const evaluation = evaluateAllChallenges(achievements, MOUNTAINS_DATA);

  // Filter challenges based on active segment tab
  const filteredChallenges = activeCategory === '전체'
    ? CHALLENGE_DEFINITIONS
    : CHALLENGE_DEFINITIONS.filter(ch => ch.category === activeCategory);

  return (
    <View style={styles.outerContainer}>
      {/* Dynamic Header */}
      <View style={styles.headerBox}>
        <Text style={styles.mainTitle}>테마 챌린지</Text>
        <Text style={styles.subTitle}>
          특정 한계에 도전하고 영광스러운 칭호와 골드 크라운 뱃지를 획득하세요!
        </Text>
      </View>

      {/* Horizontal Scroll Filter Chips segment */}
      <View style={styles.segmentContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.segmentScroll}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setActiveCategory(cat)}
                style={[
                  styles.chipBtn,
                  isActive ? styles.chipBtnActive : styles.chipBtnInactive
                ]}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.chipText,
                  isActive ? styles.chipTextActive : styles.chipTextInactive
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main List */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <View style={styles.listContainer}>
          {filteredChallenges.map((challenge) => {
            const metrics = evaluation[challenge.id] || { total: 0, completed: 0, progress: 0, isCompleted: false };
            const { total, completed, progress, isCompleted } = metrics;
            const pct = Math.round(progress * 100);

            return (
              <View 
                key={challenge.id} 
                style={[
                  styles.challengeCard,
                  isCompleted ? styles.cardCompleted : styles.cardIncomplete
                ]}
              >
                {/* Complete Highlight Ribbon */}
                {isCompleted && (
                  <View style={styles.completedRibbon}>
                    <Text style={styles.ribbonText}>COMPLETE</Text>
                  </View>
                )}

                <View style={styles.cardHeader}>
                  <View style={[
                    styles.iconContainer,
                    isCompleted ? styles.iconContainerGold : styles.iconContainerGrey
                  ]}>
                    {challenge.iconType === 'Ionicons' ? (
                      <Ionicons 
                        name={challenge.icon} 
                        size={22} 
                        color={isCompleted ? '#D4AF37' : '#94A3B8'} 
                      />
                    ) : (
                      <MaterialCommunityIcons 
                        name={challenge.icon} 
                        size={22} 
                        color={isCompleted ? '#D4AF37' : '#94A3B8'} 
                      />
                    )}
                  </View>

                  <View style={styles.titleContainer}>
                    <Text style={[
                      styles.challengeTitle,
                      isCompleted ? styles.textGoldBold : styles.textSlateDark
                    ]}>
                      {challenge.title}
                    </Text>
                    <Text style={styles.challengeSubtitle} numberOfLines={2}>
                      {challenge.desc}
                    </Text>
                  </View>
                </View>

                {/* Progress Panel */}
                <View style={styles.progressSection}>
                  <View style={styles.progressLabelRow}>
                    <Text style={styles.progressPercent}>{pct}% 진행됨</Text>
                    <Text style={styles.progressCounts}>
                      <Text style={isCompleted ? styles.countGold : styles.countActive}>{completed}</Text> / {total} {challenge.category === '지역' || challenge.category === '높이' || challenge.category === '난이도' || challenge.id === 'special_weekend' || challenge.id === 'special_30_peaks' || challenge.id === 'special_legend' ? '산' : challenge.id === 'special_dawn' ? '회' : challenge.id === 'special_consistent' ? '개월' : '지역'}
                    </Text>
                  </View>

                  <View style={styles.progressBg}>
                    <View style={[
                      styles.progressFill, 
                      { width: `${pct}%` },
                      isCompleted ? styles.progressFillGold : styles.progressFillGreen
                    ]} />
                  </View>
                </View>

                {/* Gold Crown Badge Overlay */}
                {isCompleted && (
                  <View style={styles.badgeBanner}>
                    <MaterialCommunityIcons name="trophy" size={16} color="#D4AF37" />
                    <Text style={styles.badgeBannerText}>칭호 획득: "{challenge.titleReward}" 🏅</Text>
                    <MaterialCommunityIcons name="trophy" size={16} color="#D4AF37" style={{ transform: [{ scaleX: -1 }] }} />
                  </View>
                )}
              </View>
            );
          })}

          {filteredChallenges.length === 0 && (
            <View style={styles.emptyView}>
              <MaterialCommunityIcons name="trophy-outline" size={48} color="#CBD5E1" />
              <Text style={styles.emptyText}>해당 카테고리의 챌린지가 없습니다.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    paddingBottom: 40,
    ...Platform.select({
      android: { marginBottom: 30 },
      ios: { marginBottom: 0 }
    })
  },
  headerBox: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  subTitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 16,
  },
  segmentContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  segmentScroll: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  chipBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  chipBtnActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#2E7D32',
  },
  chipBtnInactive: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  chipTextActive: {
    color: '#2E7D32',
  },
  chipTextInactive: {
    color: '#64748B',
  },
  listContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  challengeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.xl,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1.5,
    position: 'relative',
    overflow: 'hidden',
    ...SHADOWS.soft,
  },
  cardIncomplete: {
    borderColor: '#E2E8F0',
  },
  cardCompleted: {
    borderColor: '#D4AF37', // Gold border
    backgroundColor: '#FFFDF0', // Soft gold tint
    ...Platform.select({
      ios: {
        shadowColor: '#D4AF37',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 4px 8px rgba(212, 175, 55, 0.12)',
      }
    })
  },
  completedRibbon: {
    position: 'absolute',
    top: 12,
    right: -24,
    backgroundColor: '#D4AF37',
    paddingVertical: 3,
    paddingHorizontal: 26,
    transform: [{ rotate: '45deg' }],
  },
  ribbonText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconContainerGrey: {
    backgroundColor: '#F1F5F9',
  },
  iconContainerGold: {
    backgroundColor: '#FEF9C3', // Golden background
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.25)',
  },
  titleContainer: {
    flex: 1,
    paddingRight: 20,
  },
  challengeTitle: {
    fontSize: 16,
    letterSpacing: -0.2,
  },
  textSlateDark: {
    fontWeight: '800',
    color: '#1E293B',
  },
  textGoldBold: {
    fontWeight: '900',
    color: '#854D0E', // Deeper gold text for readability
  },
  challengeSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginTop: 3,
    lineHeight: 15,
  },
  progressSection: {
    width: '100%',
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  progressPercent: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  progressCounts: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  countActive: {
    fontWeight: '800',
    color: '#1E293B',
  },
  countGold: {
    fontWeight: '900',
    color: '#854D0E',
  },
  progressBg: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressFillGreen: {
    backgroundColor: COLORS.primary,
  },
  progressFillGold: {
    backgroundColor: '#D4AF37', // Gold progress indicator
  },
  badgeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(212, 175, 55, 0.15)',
  },
  badgeBannerText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#854D0E',
    marginHorizontal: 6,
  },
  emptyView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 10,
    fontWeight: '600',
  },
});
