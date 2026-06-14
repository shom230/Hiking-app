import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Animated, Image, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, BORDER_RADIUS, TYPOGRAPHY } from '../styles/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const badgeSize = (SCREEN_WIDTH - 48) / 3;
const BADGE_SIZE = badgeSize;

// Beautiful built-in preset images for resolving preset IDs to urls
const PHOTO_PRESETS = [
  { id: 'preset_1', uri: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80' },
  { id: 'preset_2', uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80' },
  { id: 'preset_3', uri: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80' },
];

// Clean 85-mountain exhaustive imageMap (extracted from DetailModal).
const imageMap = {
  '앞산': require('../../assets/badges/앞산.png'),
  '장산': require('../../assets/badges/장산.png'),
  '가야산': require('../../assets/badges/가야산.png'),
  '가지산': require('../../assets/badges/가지산.png'),
  '간월산': require('../../assets/badges/간월산.png'),
  '계룡산': require('../../assets/badges/계룡산.png'),
  '계양산': require('../../assets/badges/계양산.png'),
  '계족산': require('../../assets/badges/계족산.png'),
  '고려산': require('../../assets/badges/고려산.png'),
  '관악산': require('../../assets/badges/관악산.png'),
  '괴화산': require('../../assets/badges/괴화산.png'),
  '구봉산': require('../../assets/badges/구봉산.png'),
  '금당산': require('../../assets/badges/금당산.png'),
  '금오산': require('../../assets/badges/금오산.png'),
  '금정산': require('../../assets/badges/금정산.png'),
  '내장산': require('../../assets/badges/내장산.png'),
  '대운산': require('../../assets/badges/대운산.png'),
  '덕유산': require('../../assets/badges/덕유산.png'),
  '도봉산': require('../../assets/badges/도봉산.png'),
  '마니산': require('../../assets/badges/마니산.png'),
  '마이산': require('../../assets/badges/마이산.png'),
  '모악산': require('../../assets/badges/모악산.png'),
  '무등산': require('../../assets/badges/무등산.png'),
  '무룡산': require('../../assets/badges/무룡산.png'),
  '무학산': require('../../assets/badges/무학산.png'),
  '백마산': require('../../assets/badges/백마산.png'),
  '백양산': require('../../assets/badges/백양산.png'),
  '백운산': require('../../assets/badges/백운산.png'),
  '보문산': require('../../assets/badges/보문산.png'),
  '북한산': require('../../assets/badges/북한산.png'),
  '비슬산': require('../../assets/badges/비슬산.png'),
  '빈계산': require('../../assets/badges/빈계산.png'),
  '삼악산': require('../../assets/badges/삼악산.png'),
  '상당산': require('../../assets/badges/상당산.png'),
  '설악산': require('../../assets/badges/설악산.png'),
  '소래산': require('../../assets/badges/소래산.png'),
  '소백산': require('../../assets/badges/소백산.png'),
  '속리산': require('../../assets/badges/속리산.png'),
  '수락산': require('../../assets/badges/수락산.png'),
  '승학산': require('../../assets/badges/승학산.png'),
  '식장산': require('../../assets/badges/식장산.png'),
  '아차산': require('../../assets/badges/아차산.png'),
  '어등산': require('../../assets/badges/어등산.png'),
  '오대산': require('../../assets/badges/오대산.png'),
  '오봉산': require('../../assets/badges/오봉산.png'),
  '와룡산': require('../../assets/badges/와룡산.png'),
  '용문산': require('../../assets/badges/용문산.png'),
  '운악산': require('../../assets/badges/운악산.png'),
  '원수산': require('../../assets/badges/원수산.png'),
  '월악산': require('../../assets/badges/월악산.png'),
  '월출산': require('../../assets/badges/월출산.png'),
  '인왕산': require('../../assets/badges/인왕산.png'),
  '적상산': require('../../assets/badges/적상산.png'),
  '전월산': require('../../assets/badges/전월산.png'),
  '제석산': require('../../assets/badges/제석산.png'),
  '재약산': require('../../assets/badges/제약산.png'),
  '조계산': require('../../assets/badges/조계산.png'),
  '주왕산': require('../../assets/badges/주왕산.png'),
  '주흘산': require('../../assets/badges/주흘산.png'),
  '지리산': require('../../assets/badges/지리산.png'),
  '천관산': require('../../assets/badges/천관산.png'),
  '청계산': require('../../assets/badges/청계산.png'),
  '청량산': require('../../assets/badges/청량산.png'),
  '최정산': require('../../assets/badges/최정산.png'),
  '축령산': require('../../assets/badges/축령산.png'),
  '치악산': require('../../assets/badges/치악산.png'),
  '칠갑산': require('../../assets/badges/칠갑산.png'),
  '태백산': require('../../assets/badges/태백산.png'),
  '팔공산': require('../../assets/badges/팔공산.png'),
  '팔영산': require('../../assets/badges/팔영산.png'),
  '학가산': require('../../assets/badges/학가산.png'),
  '한라산': require('../../assets/badges/한라산.png'),
  '해명산': require('../../assets/badges/해명산.png'),
  '화왕산': require('../../assets/badges/화왕산.png'),
  '황령산': require('../../assets/badges/황령산.png'),
  '꾀꼬리봉': require('../../assets/badges/꾀꼬리봉.png'),
  '민주지산': require('../../assets/badges/민주지산.png'),
  '사라오름': require('../../assets/badges/사라오름.png'),
  '어승생악': require('../../assets/badges/어승생악.png'),
  '백약이오름': require('../../assets/badges/백약이오름.png'),
  '용눈이오름': require('../../assets/badges/용눈이오름.png'),
};

// Unified badge image selector
const getBadgeImage = (mountainName, isCompleted) => {
  if (!isCompleted) return null;
  const image = imageMap[mountainName];
  if (!image) return null;
  return image;
};

function MountainBadge(props) {
  const { mountain, isUnlocked, achievement, onPress, badgeSize: propBadgeSize } = props;
  const scaleValue = useRef(new Animated.Value(1)).current;

  // Image load error fallback trigger
  const [imageLoadError, setImageLoadError] = useState(false);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.93,
      useNativeDriver: true,
      tension: 150,
      friction: 5,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 150,
      friction: 5,
    }).start();
  };

  const screenWidth = Dimensions.get('window').width;
  const badgeSize = propBadgeSize || (screenWidth - 24) / 3;

  // Retrieve asset using clean spacing-stripped query directly
  const cleanName = mountain.name ? mountain.name.replace(/\s+/g, '') : '';
  const badgeResource = getBadgeImage(cleanName, isUnlocked);

  const handlePress = () => {
    onPress();
  };

  return (
    <Animated.View style={[styles.badgeContainer, { width: badgeSize, transform: [{ scale: scaleValue }] }]}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.pressableArea}
      >
        <View style={[styles.cardContainer, { width: badgeSize, height: badgeSize }]}>
          {/* Badge Number Overlay */}
          <Text style={styles.badgeNoText}>{`No.${mountain.no}`}</Text>
          
          <View style={[
            styles.circleBadge,
            { width: badgeSize, height: badgeSize, borderRadius: badgeSize / 2 },
            isUnlocked 
              ? { backgroundColor: 'transparent', borderWidth: 0, padding: 0, margin: 0 } 
              : styles.circleBadgeLocked,
            isUnlocked && SHADOWS.badge
          ]}>
            {isUnlocked && badgeResource && !imageLoadError ? (
              <Image 
                source={badgeResource} 
                style={[styles.badgeImage, { borderRadius: badgeSize / 2 }]} 
                onError={() => setImageLoadError(true)}
                fadeDuration={0}
                progressiveRenderingEnabled={true}
              />
            ) : isUnlocked && (!badgeResource || imageLoadError) ? (
              // 획득했지만 이미지 없음: 회색 테두리선 + 연한 회색 원
              <View style={[styles.emptyCompletedBadge, { borderRadius: badgeSize / 2 }]} />
            ) : (
              // 미획득: 회색 원 + 자물쇠 (circleBadgeLocked 배경에 자물쇠 아이콘)
              <MaterialCommunityIcons name="lock" size={40} color="#FFFFFF" style={styles.centralLockIcon} />
            )}
          </View>
        </View>
        
        {/* Mountain Name Label */}
        <Text 
          style={[
            styles.mountainName,
            { width: badgeSize },
            isUnlocked ? styles.mountainNameUnlocked : styles.mountainNameLocked
          ]}
        >
          {mountain.name}
        </Text>
        
        {/* Elevation Subtext */}
        <Text style={styles.elevationText}>{mountain.height}m</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 8,
    marginRight: 4,
  },
  pressableArea: {
    alignItems: 'center',
    width: '100%',
  },
  cardContainer: {
    position: 'relative',
  },
  cardSide: {
    backfaceVisibility: 'hidden',
  },
  circleBadge: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    padding: 0,
    margin: 0,
  },
  emptyCompletedBadge: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E8E8E8',
    borderWidth: 2,
    borderColor: '#BDBDBD',
  },
  circleBadgeBack: {
    backgroundColor: '#F8FAFC',
    borderWidth: 2.5,
    borderColor: '#2E7D32',
  },
  circleBadgeLocked: {
    backgroundColor: '#CBD5E1', // 회색 배경으로 표시
    borderWidth: 1.5,
    borderColor: '#94A3B8',
  },
  glowOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  checkOverlay: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#16A34A',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    ...SHADOWS.soft,
  },
  centralLockIcon: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.35,
      shadowRadius: 3,
    },
    android: {
      elevation: 4,
    },
    web: {
      textShadow: '0px 2px 3px rgba(0, 0, 0, 0.35)',
    },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.35,
      shadowRadius: 3,
    }
  }),
  btnDetailOverlay: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(15, 26, 20, 0.75)',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    ...SHADOWS.medium,
  },
  heightTextInside: {
    fontSize: 9,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 2,
  },
  mountainName: {
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '800',
    marginTop: 10,
  },
  mountainNameUnlocked: {
    color: COLORS.primaryDark,
  },
  mountainNameLocked: {
    color: COLORS.textMuted,
  },
  elevationText: {
    fontSize: 11,
    textAlign: 'center',
    color: '#9E9E9E',
    marginTop: 2,
  },
  badgeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badgeNoText: {
    position: 'absolute',
    top: 4,
    left: 4,
    fontSize: 10,
    color: '#9E9E9E',
    zIndex: 10,
  },
});

export default React.memo(MountainBadge);
