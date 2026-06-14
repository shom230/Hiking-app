import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Platform,
  useWindowDimensions
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import { db } from './src/utils/firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import NicknameModal from './src/components/NicknameModal';

// Prevent splash screen from auto-hiding immediately
SplashScreen.preventAutoHideAsync().catch(() => {});

const bottomPadding = Platform.select({
  android: 30,
  ios: 0,
  default: 0,
});

const screenWidth = Dimensions.get('window').width;
const BADGE_SIZE = (screenWidth - 24) / 3;

// Data & Styles
import { MOUNTAINS_DATA } from './src/data/mountains';
import { COLORS, BORDER_RADIUS, SHADOWS, TYPOGRAPHY } from './src/styles/theme';

// Custom Components
import Header from './src/components/Header';
import MountainBadge from './src/components/MountainBadge';
import DetailModal from './src/components/DetailModal';
import KoreaMap from './src/components/KoreaMap';
import ChallengeTab from './src/components/ChallengeTab';
import AcquisitionOverlay from './src/components/AcquisitionOverlay';
import RegionConquestOverlay from './src/components/RegionConquestOverlay';
import ProfileModal from './src/components/ProfileModal';
import RankingTab from './src/components/RankingTab';

// Challenge Evaluation utilities
import { evaluateAllChallenges, evaluateBaseTitle, CHALLENGE_DEFINITIONS } from './src/utils/ChallengeEvaluator';

const STORAGE_KEY = '@mountain_encyclopedia_achievements';
const REGIONS_STORAGE_KEY = '@mountain_encyclopedia_completed_regions';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Grouping mapping of 9 macro-provinces to 17 micro-administrative divisions
const MAP_REGION_GROUPS = {
  '경기': ['서울', '인천', '경기'],
  '강원': ['강원'],
  '충북': ['충북'],
  '충남': ['대전', '세종', '충남'],
  '전북': ['전북'],
  '전남': ['광주', '전남'],
  '경북': ['대구', '경북'],
  '경남': ['부산', '울산', '경남'],
  '제주': ['제주']
};

export default function App() {
  const { width: windowWidth } = useWindowDimensions();
  const isLargeScreen = windowWidth >= 768;
  const [loading, setLoading] = useState(true);
  
  // Navigation State
  const [activeTab, setActiveTab] = useState('encyclopedia'); // 'encyclopedia' | 'challenges'
  const [currentScreen, setCurrentScreen] = useState('map'); // 'map' | 'badges'
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [currentPage, setCurrentPage] = useState(0); // 0 for Map, 1 for Cards List
  
  // Scroll Pager Ref for back navigation target focus
  const pagerRef = useRef(null);
  
  // Achievements State (Map of mountainId -> { date, time, photoUri, presetId })
  const [achievements, setAchievements] = useState({});
  
  // Modal Details
  const [selectedMountain, setSelectedMountain] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // New features state
  const [celebVisible, setCelebVisible] = useState(false);
  const [celebMountain, setCelebMountain] = useState(null);
  const [titlePopupVisible, setTitlePopupVisible] = useState(false);
  const [newTitleName, setNewTitleName] = useState('');
  
  // Queued animations states for Conquest expansions
  const [pendingCelebMountain, setPendingCelebMountain] = useState(null);
  const [pendingCelebRegion, setPendingCelebRegion] = useState(null);
  
  // Title & Profile System States
  const [currentTitle, setCurrentTitle] = useState('🌱 등산 새내기');
  const [earnedTitles, setEarnedTitles] = useState(['🌱 등산 새내기']);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [userNickname, setUserNickname] = useState(null);
  const [nicknameModalVisible, setNicknameModalVisible] = useState(false);

  const [regionCelebVisible, setRegionCelebVisible] = useState(false);
  const [regionCelebName, setRegionCelebName] = useState(null);
  const [completedRegions, setCompletedRegions] = useState([]);
  const [shownRegions, setShownRegions] = useState([]);
  
  const oldTitleRef = useRef('');

  // Dynamic Title evaluation & unlock mechanism
  const reEvaluateTitles = async (updatedAchievements) => {
    try {
      const badgeCount = Object.keys(updatedAchievements).length;
      
      // 1. Evaluate base titles
      const baseTitles = [];
      baseTitles.push('🌱 등산 새내기');
      if (badgeCount >= 11) baseTitles.push('🥾 산을 즐기는 자');
      if (badgeCount >= 31) baseTitles.push('🏔️ 산의 정복자');
      if (badgeCount >= 61) baseTitles.push('👑 전설의 등산가');

      // 2. Evaluate 20 themed challenges
      const chResults = evaluateAllChallenges(updatedAchievements);
      const themedTitles = [];
      CHALLENGE_DEFINITIONS.forEach(ch => {
        if (chResults[ch.id]?.isCompleted) {
          themedTitles.push(ch.titleReward);
        }
      });

      // 3. Merge both base and themed titles
      const allEarned = Array.from(new Set([...baseTitles, ...themedTitles]));
      
      // 4. Detect new unlocks compared to current state
      const newlyUnlocked = allEarned.filter(title => !earnedTitles.includes(title));
      
      setEarnedTitles(allEarned);
      await AsyncStorage.setItem('earnedTitles', JSON.stringify(allEarned));

      // Show celebration overlay if a new custom title is unlocked
      if (newlyUnlocked.length > 0) {
        setNewTitleName(newlyUnlocked[0]);
        setTitlePopupVisible(true);
        setTimeout(() => {
          setTitlePopupVisible(false);
        }, 3000);
      }

      // Check currentTitle validity
      let curr = await AsyncStorage.getItem('currentTitle');
      if (!curr || !allEarned.includes(curr)) {
        curr = evaluateBaseTitle(badgeCount);
        setCurrentTitle(curr);
        await AsyncStorage.setItem('currentTitle', curr);
      } else {
        setCurrentTitle(curr);
      }
    } catch (err) {
      console.error('Failed to re-evaluate titles', err);
    }
  };

  // Switch and equip acquired title
  const handleEquipTitle = async (titleName) => {
    try {
      setCurrentTitle(titleName);
      await AsyncStorage.setItem('currentTitle', titleName);
      
      // Trigger dynamic toast popup
      setNewTitleName(titleName);
      setTitlePopupVisible(true);
      setTimeout(() => {
        setTitlePopupVisible(false);
      }, 2000);
    } catch (e) {
      console.error('Failed to equip title', e);
    }
  };

  const handleUpdateProfileImage = async (uri) => {
    try {
      setProfileImage(uri);
      if (uri) {
        await AsyncStorage.setItem('profileImage', uri);
      } else {
        await AsyncStorage.removeItem('profileImage');
      }
    } catch (e) {
      console.error('Failed to update profile image', e);
    }
  };

  const syncRankingData = async (nickname, updatedAchievements) => {
    if (!nickname) return;
    try {
      const badgeCount = Object.keys(updatedAchievements).length;
      const totalHeight = Object.keys(updatedAchievements).reduce((sum, id) => {
        const mountain = MOUNTAINS_DATA.find(m => m.id === id);
        return sum + (mountain ? mountain.height : 0);
      }, 0);

      await setDoc(doc(db, 'rankings', nickname), {
        nickname: nickname,
        badgeCount: badgeCount,
        totalHeight: totalHeight,
        updatedAt: new Date().toISOString()
      });
      console.log('Successfully synchronized rankings database for:', nickname);
    } catch (e) {
      console.error('Failed to update rankings in Firestore:', e);
    }
  };

  const handleUpdateNickname = async (newNickname) => {
    try {
      const oldNickname = userNickname;
      setUserNickname(newNickname);
      await AsyncStorage.setItem('userNickname', newNickname);

      // If there's an old nickname and it's different, delete it from Firestore
      if (oldNickname && oldNickname !== newNickname) {
        try {
          await deleteDoc(doc(db, 'rankings', oldNickname));
          console.log('Successfully deleted old rankings record:', oldNickname);
        } catch (err) {
          console.error('Failed to delete old nickname record from Firestore:', err);
        }
      }

      // Sync the new nickname stats
      await syncRankingData(newNickname, achievements);
    } catch (e) {
      console.error('Failed to update nickname:', e);
    }
  };

  // Check Region Complete Async validator
  const checkRegionComplete = async (regionName) => {
    const subRegions = MAP_REGION_GROUPS[regionName] || [regionName];
    const allMountains = MOUNTAINS_DATA.filter(
      m => subRegions.includes(m.region)
    );
    const totalCount = allMountains.length;

    const stored = await AsyncStorage.getItem('completedMountains');
    const completedList = stored ? JSON.parse(stored) : [];

    const completedInRegion = allMountains.filter(
      m => completedList.includes(m.name)
    );
    const completedCount = completedInRegion.length;

    console.log(
      regionName,
      '완료:', completedCount,
      '전체:', totalCount
    );

    return completedCount === totalCount && totalCount > 0;
  };

  // 1. Load data from AsyncStorage on boot
  useEffect(() => {
    async function loadData() {
      try {
        // 기존 completedRegions 캐시 디스크 키 강제 초기화
        await AsyncStorage.removeItem('@mountain_encyclopedia_completed_regions');
        
        let loadedAchievements = {};
        const storedData = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedData) {
          loadedAchievements = JSON.parse(storedData);
          setAchievements(loadedAchievements);
        }

        // 'completedMountains' 이름 리스트가 존재하지 않으면 achievements 기반으로 새로 동기화 생성
        const completedList = Object.keys(loadedAchievements)
          .map(id => MOUNTAINS_DATA.find(m => m.id === id)?.name)
          .filter(Boolean);
        await AsyncStorage.setItem('completedMountains', JSON.stringify(completedList));

        // 'shownRegionComplete' 로드
        const storedShown = await AsyncStorage.getItem('shownRegionComplete');
        if (storedShown) {
          setShownRegions(JSON.parse(storedShown));
        }

        // 'profileImage' 로드
        const storedProfileImage = await AsyncStorage.getItem('profileImage');
        if (storedProfileImage) {
          setProfileImage(storedProfileImage);
        }

        // 'userNickname' 로드
        const storedNickname = await AsyncStorage.getItem('userNickname');
        if (storedNickname) {
          setUserNickname(storedNickname);
        } else {
          setNicknameModalVisible(true);
        }

        // 각 9개 지역에 대하여 checkRegionComplete 검증하여 completedRegions 상태 업데이트
        const allMacroRegions = ['경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];
        const completedListForMap = [];
        
        for (const macroRegion of allMacroRegions) {
          const isComplete = await checkRegionComplete(macroRegion);
          if (isComplete) {
            completedListForMap.push(macroRegion);
          }
        }
        setCompletedRegions(completedListForMap);

        // --- 칭호 시스템 초기 연산 및 동기화 ---
        const badgeCount = Object.keys(loadedAchievements).length;
        
        // 1. Evaluate base titles
        const baseTitles = [];
        baseTitles.push('🌱 등산 새내기');
        if (badgeCount >= 11) baseTitles.push('🥾 산을 즐기는 자');
        if (badgeCount >= 31) baseTitles.push('🏔️ 산의 정복자');
        if (badgeCount >= 61) baseTitles.push('👑 전설의 등산가');

        // 2. Evaluate 20 themed challenges
        const chResults = evaluateAllChallenges(loadedAchievements);
        const themedTitles = [];
        CHALLENGE_DEFINITIONS.forEach(ch => {
          if (chResults[ch.id]?.isCompleted) {
            themedTitles.push(ch.titleReward);
          }
        });

        // 3. Merge both base and themed titles
        const allEarned = Array.from(new Set([...baseTitles, ...themedTitles]));
        setEarnedTitles(allEarned);
        await AsyncStorage.setItem('earnedTitles', JSON.stringify(allEarned));

        // 4. Load current equipped title
        let curr = await AsyncStorage.getItem('currentTitle');
        if (!curr || !allEarned.includes(curr)) {
          curr = evaluateBaseTitle(badgeCount);
          await AsyncStorage.setItem('currentTitle', curr);
        }
        setCurrentTitle(curr);

      } catch (e) {
        console.error('Failed to load achievements or regions from storage', e);
      } finally {
        setLoading(false);
        setTimeout(() => {
          SplashScreen.hideAsync().catch((err) => {
            console.warn('Failed to hide splash screen', err);
          });
        }, 2000);
      }
    }
    loadData();
  }, []);

  // Calculate Global Stats (All 85 mountains)
  const globalStats = {
    total: MOUNTAINS_DATA.length,
    completed: Object.keys(achievements).length,
  };

  // Calculate Specific Region Stats (Aggregated across sub-regions)
  const getRegionStats = (regionName) => {
    const subRegions = MAP_REGION_GROUPS[regionName] || [regionName];
    const regionMountains = MOUNTAINS_DATA.filter(m => subRegions.includes(m.region));
    const regionCompleted = regionMountains.filter(m => achievements[m.id]).length;
    return {
      total: regionMountains.length,
      completed: regionCompleted,
    };
  };

  // Save new achievement helper
  const handleSaveAchievement = async (mountainId, data) => {
    try {
      const isNewAchievement = !achievements[mountainId];
      
      // Save old title for level up check
      oldTitleRef.current = evaluateBaseTitle(globalStats.completed);

      const updated = {
        ...achievements,
        [mountainId]: data,
      };
      setAchievements(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      // 'completedMountains' 이름 목록 동기화 저장
      const completedList = Object.keys(updated)
        .map(id => MOUNTAINS_DATA.find(m => m.id === id)?.name)
        .filter(Boolean);
      await AsyncStorage.setItem('completedMountains', JSON.stringify(completedList));

      // 칭호 동적 재평가 및 자동 잠금해제 갱신
      await reEvaluateTitles(updated);

      // Defer celebration trigger if it's a new achievement
      if (isNewAchievement) {
        const mountain = MOUNTAINS_DATA.find(m => m.id === mountainId);
        if (mountain) {
          // Defer triggering overlay until user closes details modal completely
          setPendingCelebMountain(mountain);
          
          const macroRegion = Object.keys(MAP_REGION_GROUPS).find(key => 
            MAP_REGION_GROUPS[key].includes(mountain.region)
          ) || mountain.region;

          const isComplete = await checkRegionComplete(macroRegion);

          // 홈 화면 지도용 completedRegions 즉시 동기화
          if (isComplete && !completedRegions.includes(macroRegion)) {
            setCompletedRegions([...completedRegions, macroRegion]);
          }

          // 애니메이션 표시 조건: shownRegionComplete 체크
          if (isComplete && !shownRegions.includes(macroRegion)) {
            console.log('Region Conquest celebration triggers for region:', macroRegion);
            setPendingCelebRegion(macroRegion);
            
            const updatedShown = [...shownRegions, macroRegion];
            setShownRegions(updatedShown);
            await AsyncStorage.setItem('shownRegionComplete', JSON.stringify(updatedShown));
          }
        }
      }

      // Sync Firestore Rankings
      await syncRankingData(userNickname, updated);
    } catch (e) {
      console.error('Failed to save achievement', e);
    }
  };

  // Delete achievement helper
  const handleDeleteAchievement = async (mountainId) => {
    try {
      const mountain = MOUNTAINS_DATA.find(m => m.id === mountainId);
      const updated = { ...achievements };
      delete updated[mountainId];
      setAchievements(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      const completedList = Object.keys(updated)
        .map(id => MOUNTAINS_DATA.find(m => m.id === id)?.name)
        .filter(Boolean);
      await AsyncStorage.setItem('completedMountains', JSON.stringify(completedList));

      // 칭호 동적 재평가 및 자동 잠금해제 갱신
      await reEvaluateTitles(updated);

      if (mountain) {
        const macroRegion = Object.keys(MAP_REGION_GROUPS).find(key => 
          MAP_REGION_GROUPS[key].includes(mountain.region)
        ) || mountain.region;

        const isComplete = await checkRegionComplete(macroRegion);

        // 정복이 깨졌다면 completedRegions 및 shownRegions 캐시에서 제거
        if (!isComplete) {
          if (completedRegions.includes(macroRegion)) {
            setCompletedRegions(completedRegions.filter(r => r !== macroRegion));
          }
          if (shownRegions.includes(macroRegion)) {
            const updatedShown = shownRegions.filter(r => r !== macroRegion);
            setShownRegions(updatedShown);
            await AsyncStorage.setItem('shownRegionComplete', JSON.stringify(updatedShown));
          }
        }
      }

      // Sync Firestore Rankings
      await syncRankingData(userNickname, updated);
    } catch (e) {
      console.error('Failed to delete achievement', e);
    }
  };

  // Manage details modal closure to trigger deferred celebrations
  const handleCloseDetailModal = () => {
    setModalVisible(false);
    
    // Check if we have a pending celebration mountain queued
    if (pendingCelebMountain) {
      setCelebMountain(pendingCelebMountain);
      setCelebVisible(true);
      setPendingCelebMountain(null); // Clear pending
    }
  };

  const getTitleName = (count) => {
    if (count >= 61) return '👑 전설의 등산가';
    if (count >= 31) return '🏔️ 산의 정복자';
    if (count >= 11) return '🥾 산을 즐기는 자';
    return '🌱 등산 새내기';
  };

  // Level up toast triggers checking
  const checkTitleLevelUp = () => {
    const newCount = Object.keys(achievements).length;
    const newTitle = getTitleName(newCount);

    if (oldTitleRef.current &&
        oldTitleRef.current !== newTitle) {
      setNewTitleName(newTitle);
    }
    oldTitleRef.current = newTitle;
  };

  // Handle celebration animation end (Mountain Badge Overlay Closed)
  const handleCelebAnimationEnd = () => {
    setCelebVisible(false);
    
    // Check if a Region Conquest Celebration is pending in the queue
    if (pendingCelebRegion) {
      setRegionCelebName(pendingCelebRegion);
      setRegionCelebVisible(true);
      setPendingCelebRegion(null); // Clear queue
    } else {
      // Navigate to badges list screen and check title levelups
      setCurrentScreen('badges');
      checkTitleLevelUp();
    }
  };

  // Handle Region Conquest Celebration Overlay closed
  const handleRegionCelebEnd = () => {
    setRegionCelebVisible(false);
    
    // Automatically navigate to map screen to observe progress transition
    setCurrentScreen('map');
    setCurrentPage(0);
    
    // Check for level ups
    checkTitleLevelUp();
  };

  // Calculate Cumulative Conquered Elevation
  const cumulativeHeight = Object.keys(achievements).reduce((sum, id) => {
    const mountain = MOUNTAINS_DATA.find(m => m.id === id);
    return sum + (mountain ? mountain.height : 0);
  }, 0);

  // Comma formatting for elevations (e.g. 1,947m)
  const formatHeight = (height) => {
    return height.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + 'm';
  };

  // Filtered mountains for the current view
  const currentRegionMountains = selectedRegion 
    ? MOUNTAINS_DATA.filter(m => {
        const subRegions = MAP_REGION_GROUPS[selectedRegion] || [selectedRegion];
        return subRegions.includes(m.region);
      }) 
    : [];

  const activeRegionStats = selectedRegion ? getRegionStats(selectedRegion) : { total: 0, completed: 0 };

  // Handle Scroll to update paging dots dynamically
  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(contentOffsetX / SCREEN_WIDTH);
    if (pageIndex !== currentPage) {
      setCurrentPage(pageIndex);
    }
  };

  // Handle region selection from SVG Map or Card Deck
  const handleSelectRegion = (region) => {
    setSelectedRegion(region);
    setCurrentScreen('badges');
  };

  // Handle badge press
  const handleSelectMountain = (mountain) => {
    setSelectedMountain(mountain);
    setModalVisible(true);
  };

  // Refined Back Navigation: Instead of Map (Index 0), scroll to Region List (Index 1) on returning
  const handleBackToRegionList = () => {
    setCurrentScreen('map');
    setCurrentPage(1);
    
    // Briefly await layout mount, then perform absolute scroll to index 1
    setTimeout(() => {
      pagerRef.current?.scrollTo({ x: SCREEN_WIDTH, animated: false });
    }, 60);
  };

  // Select PNG asset directly using the clean spacing-stripped name query
  const getCelebBadgeResource = () => {
    if (!celebMountain) return null;
    const clean = celebMountain.name ? celebMountain.name.replace(/\s+/g, '') : '';
    const celebImageMap = {
      '수락산': require('./assets/badges/수락산.png'),
      '인왕산': require('./assets/badges/인왕산.png'),
      '아차산': require('./assets/badges/아차산.png'),
      '금정산': require('./assets/badges/금정산.png'),
      '백양산': require('./assets/badges/백양산.png'),
      '장산': require('./assets/badges/장산.png'),
      '승학산': require('./assets/badges/승학산.png'),
      '황령산': require('./assets/badges/황령산.png'),
      '팔공산': require('./assets/badges/팔공산.png'),
      '비슬산': require('./assets/badges/비슬산.png'),
      '최정산': require('./assets/badges/최정산.png'),
      '앞산': require('./assets/badges/앞산.png'),
      '마니산': require('./assets/badges/마니산.png'),
      '고려산': require('./assets/badges/고려산.png'),
      '해명산': require('./assets/badges/해명산.png'),
      '무등산': require('./assets/badges/무등산.png'),
      '제석산': require('./assets/badges/제석산.png'),
      '식장산': require('./assets/badges/식장산.png'),
      '보문산': require('./assets/badges/보문산.png'),
      '구봉산': require('./assets/badges/구봉산.png'),
      '가지산': require('./assets/badges/가지산.png'),
      '간월산': require('./assets/badges/간월산.png'),
      '대운산': require('./assets/badges/대운산.png'),
      '무룡산': require('./assets/badges/무룡산.png'),
      '꾀꼬리봉': require('./assets/badges/꾀꼬리봉.png'),
      '오봉산': require('./assets/badges/오봉산.png'),
      '전월산': require('./assets/badges/전월산.png'),
      '원수산': require('./assets/badges/원수산.png'),
      '설악산': require('./assets/badges/설악산.png'),
      '태백산': require('./assets/badges/태백산.png'),
      '오대산': require('./assets/badges/오대산.png'),
      '치악산': require('./assets/badges/치악산.png'),
      '삼악산': require('./assets/badges/삼악산.png'),
      '소백산': require('./assets/badges/소백산.png'),
      '민주지산': require('./assets/badges/민주지산.png'),
      '월악산': require('./assets/badges/월악산.png'),
      '속리산': require('./assets/badges/속리산.png'),
      '상당산': require('./assets/badges/상당산.png'),
      '덕유산': require('./assets/badges/덕유산.png'),
      '적상산': require('./assets/badges/적상산.png'),
      '모악산': require('./assets/badges/모악산.png'),
      '내장산': require('./assets/badges/내장산.png'),
      '마이산': require('./assets/badges/마이산.png'),
      '백운산': require('./assets/badges/백운산.png'),
      '조계산': require('./assets/badges/조계산.png'),
      '천관산': require('./assets/badges/천관산.png'),
      '금오산': require('./assets/badges/금오산.png'),
      '청량산': require('./assets/badges/청량산.png'),
      '주왕산': require('./assets/badges/주왕산.png'),
      '한라산': require('./assets/badges/한라산.png'),
      '사라오름': require('./assets/badges/사라오름.png'),
      '어승생악': require('./assets/badges/어승생악.png'),
      '백약이오름': require('./assets/badges/백약이오름.png'), // Corrected mapping path
      '용눈이오름': require('./assets/badges/용눈이오름.png'),
    };
    return celebImageMap[clean] || null;
  };

  // Get color map asset for conquest celebrations
  const getCelebRegionColorSource = () => {
    if (!regionCelebName) return null;
    const regionCelebImageMap = {
      '경기': require('./assets/gyeonggi_color.png'),
      '강원': require('./assets/gangwon_color.png'),
      '충북': require('./assets/chungbuk_color.png'),
      '충남': require('./assets/chungnam_color.png'),
      '전북': require('./assets/jeonbuk_color.png'),
      '전남': require('./assets/jeonnam_color.png'),
      '경북': require('./assets/gyeongbuk_color.png'),
      '경남': require('./assets/gyeongnam_color.png'),
      '제주': require('./assets/jeju_color.png'),
    };
    return regionCelebImageMap[regionCelebName] || null;
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1 }}
        edges={Platform.OS === 'android'
          ? ['top', 'bottom', 'left', 'right']
          : ['top', 'left', 'right']}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>등산 도감을 불러오는 중...</Text>
          </View>
        ) : (
          <View style={styles.appContainer}>
            <StatusBar style="dark" />
          
             {/* Dynamic Header */}
             <Header
               currentScreen={isLargeScreen ? 'map' : (activeTab === 'challenges' ? 'challenges' : (activeTab === 'ranking' ? 'ranking' : currentScreen))}
               selectedRegion={selectedRegion}
               onBack={handleBackToRegionList}
               regionStats={activeRegionStats}
               currentPage={currentPage}
               onPressProfile={() => setProfileModalVisible(true)}
               hidePagerDots={isLargeScreen}
               profileImage={profileImage}
             />
 
             {/* Screen Views */}
             <View style={styles.mainContentContainer}>
               {activeTab === 'challenges' ? (
                 // ================= SCREEN CHALLENGES =================
                 <ChallengeTab achievements={achievements} />
               ) : activeTab === 'ranking' ? (
                 // ================= SCREEN RANKING =================
                 <RankingTab 
                   userNickname={userNickname} 
                   totalBadges={globalStats.completed} 
                   totalHeight={cumulativeHeight} 
                 />
               ) : isLargeScreen ? (
                 // ================= RESPONSIVE SIDE-BY-SIDE LAYOUT FOR WEB =================
                 <View style={styles.webRowLayout}>
                   {/* Left Panel: Map & Global Stats */}
                   <View style={styles.webLeftPanel}>
                     <ScrollView 
                       showsVerticalScrollIndicator={false} 
                       contentContainerStyle={styles.webScrollContent}
                     >
                       <KoreaMap 
                         onSelectRegion={handleSelectRegion}
                         getRegionStats={getRegionStats}
                         completedRegions={completedRegions}
                       />
 
                       {/* Stats Dashboard Card */}
                       <View style={styles.statsCard}>
                         <View style={styles.statsHeaderRow}>
                           <Ionicons name="stats-chart" size={16} color="#2E7D32" />
                           <Text style={styles.statsTitle}>나의 도전 현황</Text>
                         </View>
                         
                         <View style={styles.statsRow}>
                           <View style={[styles.statsIconBox, { backgroundColor: '#F0FDF4' }]}>
                             <Ionicons name="ribbon" size={20} color="#2E7D32" />
                           </View>
                           <Text style={styles.statsLargeText}>
                             현재 칭호: <Text style={[styles.statsHighlight, { color: '#2E7D32' }]}>{currentTitle}</Text>
                           </Text>
                         </View>
 
                         <View style={styles.statsRow}>
                           <View style={[styles.statsIconBox, { backgroundColor: '#F0FDF4' }]}>
                             <Ionicons name="trending-up" size={20} color="#2E7D32" />
                           </View>
                           <Text style={styles.statsLargeText}>
                             누적 높이: <Text style={styles.statsHighlight}>{formatHeight(cumulativeHeight)}</Text>
                           </Text>
                         </View>
 
                         <View style={styles.statsRow}>
                           <View style={[styles.statsIconBox, { backgroundColor: '#F0FDF4' }]}>
                             <Ionicons name="medal" size={20} color="#2E7D32" />
                           </View>
                           <Text style={styles.statsLargeText}>
                             획득한 뱃지 수: <Text style={styles.statsHighlight}>{globalStats.completed} <Text style={styles.statsSlash}>/</Text> {globalStats.total}개</Text>
                           </Text>
                         </View>
                       </View>
                     </ScrollView>
                   </View>
 
                   {/* Right Panel: Region List or Mountain Badges List */}
                   {selectedRegion === null ? (
                     <View style={styles.webRightPanel}>
                       <ScrollView 
                         showsVerticalScrollIndicator={false} 
                         contentContainerStyle={styles.webScrollContent}
                       >
                         <Text style={styles.webPanelTitle}>지역별 산 도감</Text>
                         {['경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'].map((regionName) => {
                           const stats = getRegionStats(regionName);
                           return (
                             <TouchableOpacity
                               key={regionName}
                               style={styles.regionCard}
                               onPress={() => handleSelectRegion(regionName)}
                               activeOpacity={0.8}
                             >
                               <Text style={styles.regionCardName}>{regionName}</Text>
                               <View style={styles.regionCardStatsBox}>
                                 <Text style={styles.regionCardStatsText}>
                                   {stats.completed} <Text style={styles.regionCardSlash}>/</Text> {stats.total}개
                                 </Text>
                                 <Ionicons name="chevron-forward" size={16} color="#2E7D32" style={{ marginLeft: 6 }} />
                               </View>
                             </TouchableOpacity>
                           );
                         })}
                       </ScrollView>
                     </View>
                   ) : (
                     <View style={styles.webRightPanel}>
                       <TouchableOpacity 
                         style={styles.webPanelBackHeader}
                         onPress={() => {
                           setSelectedRegion(null);
                           setCurrentScreen('map');
                         }}
                       >
                         <Ionicons name="chevron-back" size={16} color={COLORS.primary} style={{ marginRight: 4 }} />
                         <Text style={styles.webPanelBackText}>지역 목록으로</Text>
                       </TouchableOpacity>
 
                       <View style={styles.webProgressCard}>
                         <Text style={styles.webProgressRegionTitle}>
                           {selectedRegion === '경기' ? '경기도' : 
                            selectedRegion === '강원' ? '강원도' : 
                            selectedRegion === '충북' ? '충청북도' : 
                            selectedRegion === '충남' ? '충청남도' : 
                            selectedRegion === '전북' ? '전라북도' : 
                            selectedRegion === '전남' ? '전라남도' : 
                            selectedRegion === '경북' ? '경상북도' : 
                            selectedRegion === '경남' ? '경상남도' : 
                            selectedRegion === '제주' ? '제주도' : selectedRegion}의 산들
                         </Text>
                         <View style={styles.webProgressBarRow}>
                           <Text style={styles.webProgressPercentText}>
                             {activeRegionStats.completed} / {activeRegionStats.total}개 획득
                           </Text>
                           <View style={styles.webProgressBarBg}>
                             <View style={[styles.webProgressBarFill, { width: `${(activeRegionStats.completed / activeRegionStats.total) * 100}%` }]} />
                           </View>
                         </View>
                       </View>
 
                        <FlatList
                          data={currentRegionMountains}
                          numColumns={3}
                          keyExtractor={(item) => item.name}
                          contentContainerStyle={{
                            paddingHorizontal: 4,
                            paddingTop: 8,
                            paddingBottom: 20,
                          }}
                          removeClippedSubviews={true}
                          maxToRenderPerBatch={9}
                          windowSize={5}
                          initialNumToRender={9}
                          showsVerticalScrollIndicator={false}
                          columnWrapperStyle={{
                            justifyContent: 'flex-start',
                            paddingHorizontal: 4,
                            marginBottom: 4,
                          }}
                          renderItem={({ item: mountain }) => {
                            const isUnlocked = !!achievements[mountain.id];
                            return (
                              <MountainBadge
                                mountain={mountain}
                                isUnlocked={isUnlocked}
                                achievement={achievements[mountain.id]}
                                onPress={() => handleSelectMountain(mountain)}
                                badgeSize={BADGE_SIZE}
                              />
                            );
                          }}
                        />
                     </View>
                   )}
                 </View>
               ) : currentScreen === 'map' ? (
                 // ================= MAIN PAGER WRAPPER (Horizontal Swipe) =================
                 <ScrollView
                   ref={pagerRef}
                   horizontal={true}
                   pagingEnabled={true}
                   showsHorizontalScrollIndicator={false}
                   onScroll={handleScroll}
                   scrollEventThrottle={16}
                   style={styles.pagerContainer}
                 >
                   {/* SCREEN 1: MAIN HOME (MAP & GLOBAL STATS) */}
                   <View style={styles.pageScreen}>
                     <ScrollView 
                       showsVerticalScrollIndicator={false} 
                       contentContainerStyle={styles.regionsScrollContent}
                     >
                       <KoreaMap 
                         onSelectRegion={handleSelectRegion}
                         getRegionStats={getRegionStats}
                         completedRegions={completedRegions}
                       />
 
                       {/* BAC style Athletic Stats Dashboard Card */}
                       <View style={styles.statsCard}>
                         <View style={styles.statsHeaderRow}>
                           <Ionicons name="stats-chart" size={16} color="#2E7D32" />
                           <Text style={styles.statsTitle}>나의 도전 현황</Text>
                         </View>
                         
                         {/* Title System Line */}
                         <View style={styles.statsRow}>
                           <View style={[styles.statsIconBox, { backgroundColor: '#F0FDF4' }]}>
                             <Ionicons name="ribbon" size={20} color="#2E7D32" />
                           </View>
                           <Text style={styles.statsLargeText}>
                             현재 칭호: <Text style={[styles.statsHighlight, { color: '#2E7D32' }]}>{currentTitle}</Text>
                           </Text>
                         </View>
 
                         <View style={styles.statsRow}>
                           <View style={[styles.statsIconBox, { backgroundColor: '#F0FDF4' }]}>
                             <Ionicons name="trending-up" size={20} color="#2E7D32" />
                           </View>
                           <Text style={styles.statsLargeText}>
                             누적 높이: <Text style={styles.statsHighlight}>{formatHeight(cumulativeHeight)}</Text>
                           </Text>
                         </View>
 
                         <View style={styles.statsRow}>
                           <View style={[styles.statsIconBox, { backgroundColor: '#F0FDF4' }]}>
                             <Ionicons name="medal" size={20} color="#2E7D32" />
                           </View>
                           <Text style={styles.statsLargeText}>
                             획득한 뱃지 수: <Text style={styles.statsHighlight}>{globalStats.completed} <Text style={styles.statsSlash}>/</Text> {globalStats.total}개</Text>
                           </Text>
                         </View>
                       </View>
                     </ScrollView>
                   </View>
 
                   {/* SCREEN 2: 9 REGIONS CARD DECK (Vertical Scroll List) */}
                   <View style={styles.pageScreen}>
                     <ScrollView 
                       showsVerticalScrollIndicator={false} 
                       contentContainerStyle={styles.regionListScrollContent}
                     >
                       {['경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'].map((regionName) => {
                         const stats = getRegionStats(regionName);
                         return (
                           <TouchableOpacity
                             key={regionName}
                             style={styles.regionCard}
                             onPress={() => handleSelectRegion(regionName)}
                             activeOpacity={0.8}
                           >
                             <Text style={styles.regionCardName}>{regionName}</Text>
                             <View style={styles.regionCardStatsBox}>
                               <Text style={styles.regionCardStatsText}>
                                 {stats.completed} <Text style={styles.regionCardSlash}>/</Text> {stats.total}개
                               </Text>
                               <Ionicons name="chevron-forward" size={16} color="#2E7D32" style={{ marginLeft: 6 }} />
                             </View>
                           </TouchableOpacity>
                         );
                       })}
                     </ScrollView>
                   </View>
                 </ScrollView>
               ) : (
                 // ================= SCREEN 2: MOUNTAIN BADGES GRID =================
                  <FlatList
                    data={currentRegionMountains}
                    numColumns={3}
                    keyExtractor={(item) => item.name}
                    contentContainerStyle={{
                      paddingHorizontal: 4,
                      paddingTop: 8,
                      paddingBottom: 20,
                    }}
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={9}
                    windowSize={5}
                    initialNumToRender={9}
                    showsVerticalScrollIndicator={false}
                    columnWrapperStyle={{
                      justifyContent: 'flex-start',
                      paddingHorizontal: 4,
                      marginBottom: 4,
                    }}
                    ListHeaderComponent={
                      <View style={styles.badgesHeaderRow}>
                        <Text style={styles.sectionTitle}>
                          {selectedRegion === '경기' ? '경기도' : 
                           selectedRegion === '강원' ? '강원도' : 
                           selectedRegion === '충북' ? '충청북도' : 
                           selectedRegion === '충남' ? '충청남도' : 
                           selectedRegion === '전북' ? '전라북도' : 
                           selectedRegion === '전남' ? '전라남도' : 
                           selectedRegion === '경북' ? '경상북도' : 
                           selectedRegion === '경남' ? '경상남도' : 
                           selectedRegion === '제주' ? '제주도' : selectedRegion}의 산들
                        </Text>
                        <Text style={styles.badgesSubtitle}>
                          각 뱃지를 눌러 상세 정보를 확인하고 등산 인증을 등록하세요!
                        </Text>
                      </View>
                    }
                    renderItem={({ item: mountain }) => {
                      const isUnlocked = !!achievements[mountain.id];
                      return (
                        <MountainBadge
                          mountain={mountain}
                          isUnlocked={isUnlocked}
                          achievement={achievements[mountain.id]}
                          onPress={() => handleSelectMountain(mountain)}
                          badgeSize={BADGE_SIZE}
                        />
                      );
                    }}
                  />
               )}
             </View>

            {/* Premium Tab Bar Navigation */}
            <View style={[styles.bottomTabBar, {
              paddingBottom: Platform.OS === 'android' ? 30 : 8,
              height: Platform.OS === 'android' ? 82 : 60
            }]}>
              <TouchableOpacity 
                style={[styles.tabButton, activeTab === 'encyclopedia' && styles.tabButtonActive]}
                onPress={() => setActiveTab('encyclopedia')}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name={activeTab === 'encyclopedia' ? "book" : "book-outline"} 
                  size={22} 
                  color={activeTab === 'encyclopedia' ? '#2E7D32' : '#64748B'} 
                />
                <Text style={[styles.tabButtonText, activeTab === 'encyclopedia' && styles.tabButtonTextActive]}>
                  도감
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.tabButton, activeTab === 'challenges' && styles.tabButtonActive]}
                onPress={() => setActiveTab('challenges')}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name={activeTab === 'challenges' ? "ribbon" : "ribbon-outline"} 
                  size={22} 
                  color={activeTab === 'challenges' ? '#2E7D32' : '#64748B'} 
                />
                <Text style={[styles.tabButtonText, activeTab === 'challenges' && styles.tabButtonTextActive]}>
                  챌린지
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.tabButton, activeTab === 'ranking' && styles.tabButtonActive]}
                onPress={() => setActiveTab('ranking')}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name={activeTab === 'ranking' ? "trophy" : "trophy-outline"} 
                  size={22} 
                  color={activeTab === 'ranking' ? '#2E7D32' : '#64748B'} 
                />
                <Text style={[styles.tabButtonText, activeTab === 'ranking' && styles.tabButtonTextActive]}>
                  랭킹
                </Text>
              </TouchableOpacity>
            </View>

            {/* Shared Detail Modal */}
            {selectedMountain && (
              <DetailModal
                visible={modalVisible}
                mountain={selectedMountain}
                achievement={achievements[selectedMountain.id]}
                onClose={handleCloseDetailModal}
                onSaveAchievement={handleSaveAchievement}
                onDeleteAchievement={handleDeleteAchievement}
              />
            )}

            {/* Celebratory Animation Overlay */}
            {celebMountain && (
              <AcquisitionOverlay
                visible={celebVisible}
                mountain={celebMountain}
                badgeResource={getCelebBadgeResource()}
                onAnimationEnd={handleCelebAnimationEnd}
              />
            )}

            {/* Region Conquest Celebration Overlay */}
            {regionCelebName && (
              <RegionConquestOverlay
                visible={regionCelebVisible}
                regionName={regionCelebName}
                regionColorSource={getCelebRegionColorSource()}
                onAnimationEnd={handleRegionCelebEnd}
              />
            )}

            {/* Custom Title Change Toast Popup */}
            {titlePopupVisible && (
              <View style={[styles.titleToast, SHADOWS.medium]}>
                <Text style={styles.titleToastText}>
                  🏆 칭호가 변경되었습니다! <Text style={styles.titleToastHighlight}>{newTitleName}</Text>
                </Text>
              </View>
            )}

            {/* Profile Details Modal sheet */}
            <ProfileModal
              visible={profileModalVisible}
              onClose={() => setProfileModalVisible(false)}
              currentTitle={currentTitle}
              earnedTitles={earnedTitles}
              totalBadges={globalStats.completed}
              totalHeight={cumulativeHeight}
              onEquipTitle={handleEquipTitle}
              profileImage={profileImage}
              onUpdateProfileImage={handleUpdateProfileImage}
              userNickname={userNickname}
              onUpdateNickname={handleUpdateNickname}
            />

            {/* Onboarding Nickname Modal */}
            <NicknameModal
              visible={nicknameModalVisible}
              onSave={(nickname) => {
                setNicknameModalVisible(false);
                handleUpdateNickname(nickname);
              }}
            />
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textMuted,
  },
  mainContentContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primaryDark,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  regionsScrollContent: {
    paddingBottom: 40,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      android: { marginBottom: 30 },
      ios: { marginBottom: 0 }
    })
  },
  badgesScrollContent: {
    paddingBottom: 40,
    ...Platform.select({
      android: { marginBottom: 30 },
      ios: { marginBottom: 0 }
    })
  },
  badgesHeaderRow: {
    marginBottom: 8,
  },
  badgesSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginHorizontal: 20,
    marginTop: -8,
    marginBottom: 16,
    lineHeight: 16,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
  },
  pagerContainer: {
    flex: 1,
    width: '100%',
  },
  pageScreen: {
    width: SCREEN_WIDTH,
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  regionListScrollContent: {
    paddingBottom: 40,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      android: { marginBottom: 30 },
      ios: { marginBottom: 0 }
    })
  },
  regionCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#F1F5F9', // Subtle grey border
    borderWidth: 1.5,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  regionCardName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  regionCardStatsBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  regionCardStatsText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B', // Soft gray/slate color instead of Red accent
  },
  regionCardSlash: {
    color: '#CBD5E1',
    fontWeight: '400',
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.xl,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 20,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    ...SHADOWS.soft,
  },
  statsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10,
  },
  statsTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#475569',
    marginLeft: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  statsIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  statsLargeText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#475569',
  },
  statsHighlight: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  statsSlash: {
    color: '#94A3B8',
    fontWeight: '400',
  },
  
  // Premium Tab Bar styles
  bottomTabBar: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    // Optional active button background tint
  },
  tabButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  tabButtonTextActive: {
    color: '#1B5E20',
    fontWeight: '800',
  },
  
  // New Title Toast popup styling
  titleToast: {
    position: 'absolute',
    bottom: 90,
    alignSelf: 'center',
    backgroundColor: '#1E293B', // Sleek slate dark background
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: BORDER_RADIUS.lg,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1000,
    borderWidth: 1,
    borderColor: '#334155',
  },
  titleToastText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  titleToastHighlight: {
    color: '#10B981', // Emerald green
    fontWeight: '900',
  },
  webRowLayout: {
    flexDirection: 'row',
    flex: 1,
    width: '100%',
  },
  webLeftPanel: {
    flex: 1.2,
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    backgroundColor: '#FAFAFA',
  },
  webRightPanel: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  webScrollContent: {
    paddingBottom: 40,
  },
  webPanelTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primaryDark,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  webPanelBackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FAFAFA',
  },
  webPanelBackText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    marginLeft: 6,
  },
  webProgressCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: BORDER_RADIUS.md,
    padding: 14,
    margin: 16,
  },
  webProgressRegionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primaryDark,
    marginBottom: 8,
  },
  webProgressBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  webProgressPercentText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textDark,
    marginRight: 10,
  },
  webProgressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: BORDER_RADIUS.round,
    overflow: 'hidden',
  },
  webProgressBarFill: {
    height: '100%',
    backgroundColor: '#2E7D32',
    borderRadius: BORDER_RADIUS.round,
  },
  webGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
  },
});
