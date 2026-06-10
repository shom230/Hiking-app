import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Modal, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Dimensions,
  Platform
} from 'react-native';

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { COLORS, SHADOWS, BORDER_RADIUS, TYPOGRAPHY } from '../styles/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DETAIL_BADGE_SIZE = Math.floor(SCREEN_WIDTH * 0.6);

// Beautiful built-in preset images for users to choose if they don't want to upload from gallery
const PHOTO_PRESETS = [
  { id: 'preset_1', uri: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80', label: '푸른 봉우리' },
  { id: 'preset_2', uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80', label: '계곡과 숲' },
  { id: 'preset_3', uri: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80', label: '자욱한 안개' },
];

// Clean 85-mountain exhaustive imageMap.
// All keys and require paths are strictly unified to spacing-stripped solid Hangul forms.
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

const getBadgeImage = (mountainName, isCompleted) => {
  if (!isCompleted) return null;
  const image = imageMap[mountainName];
  if (!image) return null;
  return image;
};

function DetailModal({ 
  visible, 
  mountain, 
  achievement, 
  onClose, 
  onSaveAchievement, 
  onDeleteAchievement 
}) {
  const [modalStep, setModalStep] = useState('view');
  const [usePreset, setUsePreset] = useState(null);
  const [imageLoadError, setImageLoadError] = useState(false);

  // Tab & Lightbox states
  const [activeTab, setActiveTab] = useState('basic');
  const [selectedLightboxImage, setSelectedLightboxImage] = useState(null);

  // Live Location & GPS distance states
  const [currentLocation, setCurrentLocation] = useState(null); // { latitude, longitude, altitude }
  const [locationPermission, setLocationPermission] = useState(null);
  const [locationError, setLocationError] = useState(null);

  // Defensive callback wrappers for web/navigation safety
  const safeOnClose = () => {
    if (typeof onClose === 'function') {
      try {
        onClose();
      } catch (e) {
        console.warn('Error inside onClose callback:', e);
      }
    }
  };

  const safeOnSaveAchievement = (mountainId, data) => {
    if (typeof onSaveAchievement === 'function') {
      try {
        onSaveAchievement(mountainId, data);
      } catch (e) {
        console.warn('Error inside onSaveAchievement callback:', e);
      }
    }
  };

  const safeOnDeleteAchievement = (mountainId) => {
    if (typeof onDeleteAchievement === 'function') {
      try {
        onDeleteAchievement(mountainId);
      } catch (e) {
        console.warn('Error inside onDeleteAchievement callback:', e);
      }
    }
  };

  // Web-compatible alert utility
  const showAlert = (title, message, onPress) => {
    if (Platform.OS === 'web') {
      alert(`${title}\n\n${message}`);
      if (onPress) onPress();
    } else {
      Alert.alert(title, message, onPress ? [{ text: '확인', onPress }] : undefined);
    }
  };

  useEffect(() => {
    let subscriber = null;
    let isMounted = true;

    const startTracking = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (!isMounted) return;

        setLocationPermission(status);
        if (status !== 'granted') {
          setLocationError('위치 권한이 거부되었습니다.');
          return;
        }

        const sub = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 3000,
            distanceInterval: 2,
          },
          (location) => {
            if (location.coords && isMounted) {
              setCurrentLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                altitude: location.coords.altitude,
              });
              setLocationError(null);
            }
          }
        );

        if (!isMounted) {
          if (sub && typeof sub.remove === 'function') {
            try {
              sub.remove();
            } catch (e) {
              console.warn('Failed to remove subscriber immediately after unmount:', e);
            }
          }
          return;
        }

        subscriber = sub;

        // Fetch initial location to populate UI immediately
        Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        }).then((location) => {
          if (isMounted && location && location.coords) {
            setCurrentLocation((prev) => {
              if (prev) return prev;
              return {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                altitude: location.coords.altitude,
              };
            });
          }
        }).catch((err) => {
          console.warn('Initial location fetch failed:', err);
        });
      } catch (err) {
        console.warn(err);
        if (isMounted) {
          setLocationError('위치 정보를 측정할 수 없습니다.');
        }
      }
    };

    if (visible) {
      startTracking();
    }

    return () => {
      isMounted = false;
      if (subscriber) {
        if (typeof subscriber.remove === 'function') {
          try {
            subscriber.remove();
          } catch (e) {
            console.warn('Failed to remove location subscriber:', e);
          }
        }
      }
      if (!visible) {
        setCurrentLocation(null);
        setLocationPermission(null);
        setLocationError(null);
      }
    };
  }, [visible]);

  // Haversine formula to compute geodesic distances in meters
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(
      Math.sqrt(a), Math.sqrt(1-a)
    )
    return Math.round(R * c)
  };

  const getRemainingDistance = () => {
    if (!currentLocation || !mountain.lat || !mountain.lng) return null;
    const dist = getDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      mountain.lat,
      mountain.lng
    );
    return dist;
  };

  const getRemainingAltitude = () => {
    if (!currentLocation || currentLocation.altitude === null || currentLocation.altitude === undefined) return null;
    return Math.round(mountain.height - currentLocation.altitude);
  };

  useEffect(() => {
    if (visible) {
      setModalStep('view');
      setImageLoadError(false);
      setActiveTab('basic');
      setSelectedLightboxImage(null);
      if (achievement) {
        setUsePreset(achievement.presetId || null);
      } else {
        setUsePreset(null);
      }
    }
  }, [achievement, visible]);

  if (!mountain) return null;

  const getMigratedPhotos = () => {
    if (!achievement) return [];
    if (achievement.photos) return achievement.photos;
    
    // Auto-migrate legacy photo URI
    const legacyUri = achievement.photoUri || (achievement.presetId ? PHOTO_PRESETS.find(p => p.id === achievement.presetId)?.uri : null);
    if (legacyUri) {
      return [{ id: 'legacy_1', uri: legacyUri, likes: 0, date: achievement.date || '' }];
    }
    return [];
  };

  const currentPhotos = getMigratedPhotos();

  const handleLikePhoto = (photoId) => {
    const updatedPhotos = currentPhotos.map(p => {
      if (p.id === photoId) {
        return { ...p, likes: (p.likes || 0) + 1 };
      }
      return p;
    });
    
    safeOnSaveAchievement(mountain.id, {
      ...achievement,
      photos: updatedPhotos
    });
  };

  const getStars = (difficulty) => {
    if (difficulty === '하') return 1;
    if (difficulty === '중') return 2;
    if (difficulty === '상') return 3;
    return 1;
  };

  const getStarRating = (difficulty) => {
    const stars = getStars(difficulty);
    if (stars === 1) return { stars: '★☆☆', label: '낮은 난이도 (산책 코스)' };
    if (stars === 2) return { stars: '★★☆', label: '중간 난이도 (추천 등산)' };
    return { stars: '★★★', label: '높은 난이도 (도전 코스)' };
  };

  const ratingInfo = getStarRating(mountain.difficulty);

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      showAlert('권한 필요', '사진 인증을 위해 카메라 접근 권한이 필요합니다.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      savePhotoToAchievement(result.assets[0].uri, null);
    }
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showAlert('권한 필요', '사진 인증을 위해 앨범 접근 권한이 필요합니다.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      savePhotoToAchievement(result.assets[0].uri, null);
    }
  };

  const handleSelectPreset = (presetId) => {
    const nextPreset = usePreset === presetId ? null : presetId;
    setUsePreset(nextPreset);
  };

  const savePhotoToAchievement = (photoUri, presetId) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
    const targetUri = photoUri || PHOTO_PRESETS.find(p => p.id === presetId)?.uri;
    if (!targetUri) return;

    const newPhoto = {
      id: 'photo_' + Date.now(),
      uri: targetUri,
      likes: 0,
      date: formattedDate
    };

    const currentAchievement = achievement || {
      date: formattedDate,
      time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    };

    const updatedPhotos = [...currentPhotos, newPhoto];
    safeOnSaveAchievement(mountain.id, {
      ...currentAchievement,
      photos: updatedPhotos
    });

    setModalStep('view');
    setActiveTab('certification');
    showAlert('사진 추가 완료!', '인증 사진이 성공적으로 추가되었습니다. 📸');
  };

  const handleSaveOnlyPreset = () => {
    savePhotoToAchievement(null, usePreset);
  };

  const handleCertify = () => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
    const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    safeOnSaveAchievement(mountain.id, {
      date: formattedDate,
      time: formattedTime,
      photos: [],
    });

    showAlert(
      '등산 완료 인증 성공!', 
      '성공적으로 방문이 기록되었습니다. 인증 탭에서 추억을 남길 인증 사진을 등록해 보세요! 🎉'
    );
  };

  const handleCancelClimb = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('정말로 등산 인증을 취소하고 뱃지를 잠그시겠습니까?');
      if (confirmed) {
        safeOnDeleteAchievement(mountain.id);
        safeOnClose();
      }
    } else {
      Alert.alert(
        '인증 취소',
        '정말로 등산 인증을 취소하고 뱃지를 잠그시겠습니까?',
        [
          { text: '취소', style: 'cancel' },
          { 
            text: '확인', 
            style: 'destructive', 
            onPress: () => {
              safeOnDeleteAchievement(mountain.id);
              safeOnClose();
            } 
          }
        ]
      );
    }
  };

  const remainingDistance = getRemainingDistance();
  const isWithinRange = remainingDistance !== null && remainingDistance <= 50;

  // Determine top center illustration PNG resource using clean spacing-stripped name query
  const cleanName = mountain.name ? mountain.name.replace(/\s+/g, '') : '';
  const badgeResource = imageLoadError ? null : imageMap[cleanName];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={safeOnClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={safeOnClose}
      >
        <TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            
            {/* Header Bar */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>
                {modalStep === 'photo_upload' ? '인증 사진 등록' : '산 상세 정보'}
              </Text>
              <TouchableOpacity onPress={safeOnClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>

            {/* dynamic Sub-Tabs selector bar under step view mode */}
            {modalStep === 'view' && (
              <View style={styles.tabContainer}>
                <TouchableOpacity 
                  style={[styles.tabButton, activeTab === 'basic' && styles.tabButtonActive]}
                  onPress={() => setActiveTab('basic')}
                >
                  <Text style={[styles.tabText, activeTab === 'basic' && styles.tabTextActive]}>기본정보</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.tabButton, activeTab === 'certification' && styles.tabButtonActive]}
                  onPress={() => setActiveTab('certification')}
                >
                  <Text style={[styles.tabText, activeTab === 'certification' && styles.tabTextActive]}>인증</Text>
                </TouchableOpacity>
              </View>
            )}

            {modalStep === 'view' ? (
              activeTab === 'basic' ? (
                /* 기본정보 탭 */
                <ScrollView 
                  showsVerticalScrollIndicator={false} 
                  contentContainerStyle={styles.scrollContent}
                >
                  {/* Custom Mountain PNG Badge image */}
                  <View style={styles.badgeHeaderWrapper}>
                    <View style={[
                      styles.badgeOutlineCircle,
                      achievement && badgeResource ? { borderWidth: 0, backgroundColor: 'transparent' } : null
                    ]}>
                      {achievement && badgeResource ? (
                        <Image 
                          source={badgeResource} 
                          style={styles.badgeMainImage}
                          onError={() => setImageLoadError(true)}
                          fadeDuration={0}
                          progressiveRenderingEnabled={true}
                        />
                      ) : null}
                    </View>
                  </View>

                  {/* Basic Info Card */}
                  <View style={styles.infoCard}>
                    <View style={styles.titleRow}>
                      <Text style={styles.mountainName}>{mountain.name}</Text>
                      <View style={[styles.regionTag, { backgroundColor: mountain.badgeColor || COLORS.primary }]}>
                        <Text style={styles.regionTagText}>{mountain.region}</Text>
                      </View>
                    </View>

                    <Text style={styles.mountainDescription}>{mountain.description}</Text>

                    <View style={styles.divider} />

                    <View style={styles.statsRow}>
                      <View style={styles.statCol}>
                        <Text style={styles.statLabel}>높이</Text>
                        <Text style={styles.statVal}>{mountain.height} m</Text>
                      </View>
                      <View style={styles.statCol}>
                        <Text style={styles.statLabel}>난이도</Text>
                        <Text style={[
                          styles.statVal, 
                          mountain.difficulty === '상' ? { color: COLORS.accentOrange } : 
                          mountain.difficulty === '중' ? { color: COLORS.primary } : { color: COLORS.sage }
                        ]}>
                          {mountain.difficulty}
                        </Text>
                      </View>
                      <View style={styles.statCol}>
                        <Text style={styles.statLabel}>등반 등급</Text>
                        <Text style={[styles.statVal, { color: COLORS.accentGold, fontSize: 16 }]}>{ratingInfo.stars}</Text>
                      </View>
                    </View>
                    <Text style={ratingInfo.label ? styles.ratingHelper : { display: 'none' }}>{ratingInfo.label}</Text>
                  </View>

                  {/* Real-time Summit Distance Analyzer Card */}
                  <View style={styles.distanceCard}>
                    <View style={styles.altitudeHeader}>
                      <Ionicons name="navigate-circle-outline" size={20} color={COLORS.primary} />
                      <Text style={styles.altitudeTitle}>실시간 고도 분석</Text>
                    </View>
                    
                    {locationPermission === 'denied' || locationError ? (
                      <Text style={styles.altitudeText}>
                        {locationError || '위치 서비스 권한이 비활성화되어 고도 계산을 제공할 수 없습니다.'}
                      </Text>
                    ) : currentLocation === null ? (
                      <View style={styles.altitudeLoadingRow}>
                        <ActivityIndicator size="small" color={COLORS.primary} style={{ marginRight: 8 }} />
                        <Text style={styles.altitudeText}>현재 위치를 파악하는 중입니다...</Text>
                      </View>
                    ) : (
                      <View>
                        <View style={styles.altitudeInfoRow}>
                          <Text style={styles.altitudeLabel}>현재 고도</Text>
                          <Text style={[styles.altitudeValue, { color: COLORS.primary }]}>
                            {currentLocation.altitude !== null && currentLocation.altitude !== undefined 
                              ? `${Math.round(currentLocation.altitude)}m` 
                              : '측정 불가'}
                          </Text>
                        </View>
                        <View style={styles.altitudeInfoRow}>
                          <Text style={styles.altitudeLabel}>정상 고도</Text>
                          <Text style={[styles.altitudeValue, { color: '#000000' }]}>{mountain.height}m</Text>
                        </View>
                        <View style={styles.dividerMini} />
                        <Text style={styles.altitudeResultText}>
                          {getRemainingDistance() !== null ? (
                            getRemainingDistance() <= 50 ? (
                              <Text style={styles.distanceHighlightGreen}>정상 근처입니다! 인증 가능합니다 ✅</Text>
                            ) : getRemainingDistance() < 1000 ? (
                              <Text style={styles.altitudeText}>
                                정상까지 약 <Text style={styles.distanceHighlightOrange}>{getRemainingDistance()}m</Text> 남았습니다.
                              </Text>
                            ) : (
                              <Text style={styles.altitudeText}>
                                정상까지 약 <Text style={styles.distanceHighlightOrange}>{(getRemainingDistance() / 1000).toFixed(1)}km</Text> 남았습니다.
                              </Text>
                            )
                          ) : (
                            <Text style={styles.altitudeText}>위치 정보를 받아오는 중입니다...</Text>
                          )}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Achievement Panel */}
                  {achievement ? (
                    <View style={[styles.statusCard, styles.statusCardUnlocked]}>
                      <View style={styles.statusHeader}>
                        <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                        <Text style={styles.statusTitle}>등산 완료 인증 완료!</Text>
                      </View>
                      
                      <View style={styles.detailsBox}>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>인증 날짜</Text>
                          <Text style={styles.detailVal}>{achievement.date}</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>인증 시간</Text>
                          <Text style={styles.detailVal}>{achievement.time}</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>인증 상태</Text>
                          <Text style={[styles.detailVal, { color: COLORS.primary }]}>정복 완료</Text>
                        </View>
                      </View>
 
                      <TouchableOpacity 
                        onPress={handleCancelClimb}
                        style={styles.btnDanger}
                      >
                        <Ionicons name="trash-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                        <Text style={styles.btnDangerText}>등산 인증 취소하기</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.statusCard}>
                      <View style={styles.notVisitedHeader}>
                        <MaterialCommunityIcons name="alert-circle-outline" size={26} color="#EF4444" />
                        <Text style={styles.notVisitedText}>아직 방문하지 않은 산입니다</Text>
                      </View>
                      
                      <Text style={styles.promptText}>
                        산에 직접 등반하여 정상 정복을 완료하셨다면 아래의 등산 인증을 진행하세요. (정상 50m 이내만 가능)
                      </Text>
 
                      <TouchableOpacity 
                        onPress={handleCertify}
                        disabled={!isWithinRange}
                        style={isWithinRange ? styles.btnPrimary : styles.btnDisabled}
                      >
                        <Ionicons 
                          name="checkmark-done-circle" 
                          size={18} 
                          color={isWithinRange ? "#FFFFFF" : "#94A3B8"} 
                          style={{ marginRight: 6 }} 
                        />
                        <Text style={isWithinRange ? styles.btnPrimaryText : styles.btnDisabledText}>
                          등산 완료 인증하기
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </ScrollView>
              ) : (
                /* 인증 탭 */
                <ScrollView 
                  showsVerticalScrollIndicator={false} 
                  contentContainerStyle={styles.scrollContent}
                >
                  <View style={styles.certifyTabContainer}>
                    {achievement ? (
                      <>
                        <Text style={styles.certifyTitle}>📸 등산 인증 사진 피드</Text>
                        
                        {currentPhotos.length > 0 ? (
                          <View style={styles.photoGrid}>
                            {currentPhotos.map((photo) => (
                              <View key={photo.id} style={styles.photoCard}>
                                <TouchableOpacity 
                                  activeOpacity={0.9} 
                                  onPress={() => setSelectedLightboxImage(photo.uri)}
                                >
                                  <Image source={{ uri: photo.uri }} style={styles.gridImage} />
                                </TouchableOpacity>
                                
                                <View style={styles.photoFooter}>
                                  <TouchableOpacity 
                                    style={styles.likeButton} 
                                    onPress={() => handleLikePhoto(photo.id)}
                                  >
                                    <Ionicons name="heart" size={16} color="#EF4444" />
                                    <Text style={styles.likeCountText}>{(photo.likes || 0)}</Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            ))}
                          </View>
                        ) : (
                          <View style={styles.emptyPhotosBox}>
                            <MaterialCommunityIcons name="image-off" size={48} color="#CBD5E1" />
                            <Text style={styles.emptyPhotosText}>아직 등록된 인증 사진이 없습니다.</Text>
                          </View>
                        )}

                        <TouchableOpacity 
                          onPress={() => setModalStep('photo_upload')} 
                          style={[styles.btnPrimary, { marginTop: 24, backgroundColor: COLORS.primary }]}
                        >
                          <Ionicons name="camera" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                          <Text style={styles.btnPrimaryText}>인증 사진 추가</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <View style={styles.emptyPhotosBox}>
                        <MaterialCommunityIcons name="lock-outline" size={48} color="#CBD5E1" />
                        <Text style={styles.emptyPhotosText}>등산 인증 완료 후 사진을 등록하실 수 있습니다.</Text>
                      </View>
                    )}
                  </View>
                </ScrollView>
              )
            ) : (
              /* 인증 사진 등록 폼 */
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.photoUploadContainer}>
                  <Text style={styles.photoUploadMainPrompt}>
                    축하합니다! 등산 인증을 완료하셨습니다. {'\n'}산 정상의 아름다운 추억을 업로드해 보세요! ⛰️
                  </Text>

                  <View style={styles.photoPickerRow}>
                    <TouchableOpacity 
                      onPress={handleTakePhoto}
                      style={styles.pickerOptionCard}
                    >
                      <View style={[styles.pickerIconBg, { backgroundColor: '#F0FDF4' }]}>
                        <Ionicons name="camera" size={28} color="#2E7D32" />
                      </View>
                      <Text style={styles.pickerOptionLabel}>직접 카메라로 촬영</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      onPress={handlePickImage}
                      style={styles.pickerOptionCard}
                    >
                      <View style={[styles.pickerIconBg, { backgroundColor: '#F0FDFA' }]}>
                        <Ionicons name="images" size={28} color="#0D9488" />
                      </View>
                      <Text style={styles.pickerOptionLabel}>갤러리에서 선택</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.presetsBox}>
                    <Text style={styles.presetsLabel}>또는 앱 내 등산 감성 프리셋 선택:</Text>
                    <View style={styles.presetsRow}>
                      {PHOTO_PRESETS.map((p) => (
                        <TouchableOpacity 
                          key={p.id}
                          onPress={() => handleSelectPreset(p.id)}
                          style={[
                            styles.presetCard,
                            usePreset === p.id && styles.presetCardActive
                          ]}
                        >
                          <Image source={{ uri: p.uri }} style={styles.presetThumb} />
                          <Text style={[styles.presetText, usePreset === p.id && styles.presetTextActive]}>
                            {p.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {usePreset && (
                      <TouchableOpacity 
                        onPress={handleSaveOnlyPreset}
                        style={[styles.btnPrimary, { marginTop: 16 }]}
                      >
                        <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                        <Text style={styles.btnPrimaryText}>선택한 프리셋으로 등록 완료</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={styles.photoActionButtonsRow}>
                    <TouchableOpacity 
                      onPress={() => setModalStep('view')}
                      style={styles.btnSkipPhoto}
                    >
                      <Text style={styles.btnSkipPhotoText}>건너뛰기</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>

      {/* Immersive Fullscreen Lightbox Overlay */}
      {selectedLightboxImage && (
        <Modal
          visible={!!selectedLightboxImage}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setSelectedLightboxImage(null)}
        >
          <TouchableOpacity 
            style={styles.lightboxOverlay}
            activeOpacity={1}
            onPress={() => setSelectedLightboxImage(null)}
          >
            <Image source={{ uri: selectedLightboxImage }} style={styles.lightboxImage} resizeMode="contain" />
            <TouchableOpacity 
              style={styles.lightboxCloseBtn}
              onPress={() => setSelectedLightboxImage(null)}
            >
              <Ionicons name="close" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}
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
    height: '88%',
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
    borderBottomColor: COLORS.border,
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
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#2E7D32',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#2E7D32',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  badgeHeaderWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    backgroundColor: '#FAFAFA',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  badgeOutlineCircle: {
    width: DETAIL_BADGE_SIZE,
    height: DETAIL_BADGE_SIZE,
    borderRadius: DETAIL_BADGE_SIZE / 2,
    borderWidth: 3,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.12)',
      }
    })
  },
  badgeMainImage: {
    width: '100%',
    height: '100%',
    borderRadius: DETAIL_BADGE_SIZE / 2,
    resizeMode: 'cover',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    padding: 20,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.soft,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mountainName: {
    fontSize: TYPOGRAPHY.sizes.xxl - 2,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.primaryDark,
  },
  regionTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  regionTagText: {
    color: '#FFFFFF',
    fontSize: TYPOGRAPHY.sizes.xs + 1,
    fontWeight: TYPOGRAPHY.weights.bold,
  },
  mountainDescription: {
    fontSize: TYPOGRAPHY.sizes.base - 1,
    color: COLORS.textDark,
    lineHeight: 20,
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCol: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  statVal: {
    fontSize: TYPOGRAPHY.sizes.base,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.textDark,
  },
  ratingHelper: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 8,
    padding: 20,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.soft,
  },
  statusCardUnlocked: {
    borderColor: '#DCFCE7',
    backgroundColor: '#F0FDF4',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primaryDark,
    marginLeft: 8,
  },
  notVisitedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  notVisitedText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#EF4444',
    marginLeft: 8,
  },
  promptText: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 16,
  },
  detailsBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.md,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  detailVal: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  btnPrimary: {
    backgroundColor: '#2E7D32',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  btnDanger: {
    backgroundColor: '#EF4444',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnDangerText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  certifyTabContainer: {
    padding: 16,
  },
  certifyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primaryDark,
    marginBottom: 16,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  photoCard: {
    width: '50%',
    padding: 4,
    marginBottom: 8,
  },
  gridImage: {
    width: '100%',
    height: 140,
    borderRadius: BORDER_RADIUS.md,
    resizeMode: 'cover',
  },
  photoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#F8FAFC',
    borderBottomLeftRadius: BORDER_RADIUS.md,
    borderBottomRightRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderTopWidth: 0,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  likeCountText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EF4444',
    marginLeft: 4,
  },
  emptyPhotosBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#F8FAFC',
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#E2E8F0',
  },
  emptyPhotosText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 10,
    textAlign: 'center',
  },
  photoUploadContainer: {
    padding: 20,
    alignItems: 'center',
  },
  photoUploadMainPrompt: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primaryDark,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  photoPickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  pickerOptionCard: {
    flex: 0.48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: BORDER_RADIUS.lg,
    padding: 16,
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  pickerIconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  pickerOptionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textDark,
    textAlign: 'center',
  },
  presetsBox: {
    width: '100%',
    marginTop: 10,
  },
  presetsLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 12,
  },
  presetsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  presetCard: {
    flex: 0.31,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: BORDER_RADIUS.md,
    padding: 6,
    alignItems: 'center',
  },
  presetCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#F0FDF4',
  },
  presetThumb: {
    width: '100%',
    height: 60,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: 6,
  },
  presetText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  presetTextActive: {
    color: COLORS.primary,
  },
  photoActionButtonsRow: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  btnSkipPhoto: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  btnSkipPhotoText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '700',
  },
  lightboxOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightboxImage: {
    width: '94%',
    height: '80%',
  },
  lightboxCloseBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
  distanceCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    borderRadius: BORDER_RADIUS.md,
    padding: 16,
    marginTop: 16,
    marginHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#1B5E20',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(27, 94, 32, 0.05)',
      }
    })
  },
  altitudeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  altitudeTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primaryDark,
    marginLeft: 6,
  },
  altitudeText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  altitudeLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  altitudeInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  altitudeLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  altitudeValue: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  dividerMini: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 8,
  },
  altitudeResultText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textDark,
    textAlign: 'center',
    marginTop: 4,
  },
  distanceHighlightOrange: {
    color: COLORS.accentOrange,
    fontSize: 16,
    fontWeight: '900',
  },
  distanceHighlightGreen: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '900',
  },
  btnDisabled: {
    backgroundColor: '#E2E8F0',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnDisabledText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '800',
  },
});

export default React.memo(DetailModal);
