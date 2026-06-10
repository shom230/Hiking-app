import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Modal, 
  ScrollView, 
  TouchableOpacity, 
  TouchableWithoutFeedback,
  Dimensions,
  Platform
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, BORDER_RADIUS, SHADOWS, TYPOGRAPHY } from '../styles/theme';
import { CHALLENGE_DEFINITIONS, BASE_TITLE_DEFINITIONS } from '../utils/ChallengeEvaluator';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProfileModal({
  visible,
  onClose,
  currentTitle,
  earnedTitles,
  totalBadges,
  totalHeight,
  onEquipTitle
}) {
  // Combine base and themed titles for rendering (total 24 titles)
  const allTitles = [
    ...BASE_TITLE_DEFINITIONS.map(t => ({ ...t, isBase: true })),
    ...CHALLENGE_DEFINITIONS.map(t => ({ ...t, isBase: false }))
  ];

  const earnedCount = earnedTitles.length;

  // Comma helper
  const formatHeight = (height) => {
    return height.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + 'm';
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>나의 등산 프로필</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              
              {/* Profile Card */}
              <View style={[styles.profileCard, SHADOWS.medium]}>
                <View style={styles.avatarRow}>
                  <View style={styles.avatarOutline}>
                    <View style={styles.avatarInner}>
                      <Ionicons name="person" size={44} color="#FFFFFF" />
                    </View>
                  </View>
                  <View style={styles.avatarRightInfo}>
                    <Text style={styles.activeTitleLabel}>장착 중인 칭호</Text>
                    <Text style={styles.activeTitleValue}>{currentTitle || '🌱 등산 새내기'}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                {/* Dashboard Stats */}
                <View style={styles.statsDashboard}>
                  <View style={styles.statBox}>
                    <Ionicons name="medal" size={20} color="#2E7D32" style={styles.statIcon} />
                    <Text style={styles.statLabel}>총 획득 뱃지</Text>
                    <Text style={styles.statVal}>{totalBadges}개</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Ionicons name="trending-up" size={20} color="#2E7D32" style={styles.statIcon} />
                    <Text style={styles.statLabel}>누적 높이</Text>
                    <Text style={styles.statVal}>{formatHeight(totalHeight)}</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Ionicons name="ribbon" size={20} color="#2E7D32" style={styles.statIcon} />
                    <Text style={styles.statLabel}>획득한 칭호</Text>
                    <Text style={styles.statVal}>{earnedCount}개</Text>
                  </View>
                </View>
              </View>

              {/* Title Section */}
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="trophy-award" size={20} color={COLORS.primaryDark} />
                <Text style={styles.sectionTitle}>등산가 칭호 목록 ({earnedCount} / {allTitles.length})</Text>
              </View>
              <Text style={styles.sectionSub}>챌린지를 달성해 가려진 칭호와 전설적인 타이틀을 획득해 보세요!</Text>

              {/* Title List */}
              <View style={styles.titleListContainer}>
                {allTitles.map((item, idx) => {
                  const titleName = item.titleReward;
                  const isUnlocked = earnedTitles.includes(titleName);
                  const isEquipped = currentTitle === titleName;
                  
                  // Card style state
                  let cardStyle = styles.cardLocked;
                  let badgeIcon = 'lock';
                  let badgeIconColor = '#94A3B8';

                  if (isEquipped) {
                    cardStyle = styles.cardEquipped;
                    badgeIcon = 'check-decagram';
                    badgeIconColor = '#D4AF37';
                  } else if (isUnlocked) {
                    cardStyle = styles.cardUnlocked;
                    badgeIcon = 'lock-open-variant';
                    badgeIconColor = '#2E7D32';
                  }

                  return (
                    <View key={titleName + idx} style={[styles.titleCard, cardStyle]}>
                      <View style={styles.titleCardHeader}>
                        <View style={styles.titleCardLeft}>
                          <MaterialCommunityIcons 
                            name={badgeIcon} 
                            size={20} 
                            color={badgeIconColor} 
                            style={{ marginRight: 8 }} 
                          />
                          <Text style={[
                            styles.titleCardName,
                            isUnlocked ? (isEquipped ? styles.textEquipped : styles.textUnlocked) : styles.textLocked
                          ]}>
                            {isUnlocked ? titleName : '???'}
                          </Text>
                        </View>

                        {/* Equip Action Trigger */}
                        {isUnlocked ? (
                          isEquipped ? (
                            <View style={styles.equippedBadge}>
                              <Text style={styles.equippedText}>장착 중</Text>
                            </View>
                          ) : (
                            <TouchableOpacity 
                              style={styles.equipBtn} 
                              onPress={() => onEquipTitle(titleName)}
                            >
                              <Text style={styles.equipBtnText}>장착하기</Text>
                            </TouchableOpacity>
                          )
                        ) : (
                          <View style={styles.lockedBadge}>
                            <Text style={styles.lockedText}>미획득</Text>
                          </View>
                        )}
                      </View>

                      {/* Title Description */}
                      <Text style={[styles.titleCardDesc, !isUnlocked && { color: '#94A3B8' }]}>
                        {isUnlocked ? item.desc : '???'}
                      </Text>

                      {!isUnlocked && (
                        <View style={styles.lockedHintBox}>
                          <Ionicons name="information-circle-outline" size={12} color="#94A3B8" style={{ marginRight: 4 }} />
                          <Text style={styles.lockedHintText}>달성 챌린지 정보가 아직 가려져 있습니다.</Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>

            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 26, 20, 0.55)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    height: '90%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow: '0px -6px 10px rgba(0, 0, 0, 0.15)',
      }
    })
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.primaryDark,
  },
  closeButton: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.xl,
    padding: 20,
    marginTop: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarOutline: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2.5,
    borderColor: '#2E7D32',
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    backgroundColor: '#64748B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarRightInfo: {
    marginLeft: 16,
    flex: 1,
  },
  activeTitleLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginBottom: 4,
  },
  activeTitleValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1E293B',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 18,
  },
  statsDashboard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  statVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primaryDark,
    marginLeft: 6,
  },
  sectionSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 16,
    lineHeight: 14,
  },
  titleListContainer: {
    width: '100%',
  },
  titleCard: {
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    borderWidth: 1.5,
  },
  cardEquipped: {
    borderColor: '#D4AF37', // Gold
    backgroundColor: '#FFFDF0', // Light Gold
  },
  cardUnlocked: {
    borderColor: '#2E7D32', // Green
    backgroundColor: '#FFFFFF', // White
  },
  cardLocked: {
    borderColor: '#E2E8F0', // Grey
    backgroundColor: '#F8FAFC', // Grey background
  },
  titleCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  titleCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 12,
  },
  titleCardName: {
    fontSize: 14,
  },
  textEquipped: {
    fontWeight: '900',
    color: '#854D0E',
  },
  textUnlocked: {
    fontWeight: '800',
    color: '#1E293B',
  },
  textLocked: {
    fontWeight: '600',
    color: '#64748B',
  },
  equippedBadge: {
    backgroundColor: '#FEF9C3',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  equippedText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#854D0E',
  },
  equipBtn: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(46, 125, 50, 0.25)',
  },
  equipBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2E7D32',
  },
  lockedBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  lockedText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  titleCardDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
  },
  lockedHintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  lockedHintText: {
    fontSize: 10,
    color: '#94A3B8',
  },
});
