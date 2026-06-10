import { MOUNTAINS_DATA } from '../data/mountains';

export const CHALLENGE_DEFINITIONS = [
  // 1. Region Challenges
  { 
    id: 'region_gyeonggi', 
    title: '수도권 정복', 
    category: '지역', 
    titleReward: '서울 근교의 지배자', 
    desc: '경기 전체 완등',
    icon: 'compass-outline',
    iconType: 'Ionicons'
  },
  { 
    id: 'region_gangwon', 
    title: '강원 설산 정복', 
    category: '지역', 
    titleReward: '설악의 후예', 
    desc: '강원 전체 완등',
    icon: 'snowflake',
    iconType: 'MaterialCommunityIcons'
  },
  { 
    id: 'region_namdo', 
    title: '남도 탐험가', 
    category: '지역', 
    titleReward: '남도 유랑객', 
    desc: '전남 + 전북 전체 완등',
    icon: 'water-outline',
    iconType: 'Ionicons'
  },
  { 
    id: 'region_yeongnam', 
    title: '영남 정복자', 
    category: '지역', 
    titleReward: '영남 호걸', 
    desc: '경남 + 경북 전체 완등',
    icon: 'image-filter-hdr',
    iconType: 'MaterialCommunityIcons'
  },
  { 
    id: 'region_jeju', 
    title: '제주 완등', 
    category: '지역', 
    titleReward: '한라의 전설', 
    desc: '제주 전체 완등',
    icon: 'island',
    iconType: 'MaterialCommunityIcons'
  },
  
  // 2. Height Challenges
  { 
    id: 'height_1000m', 
    title: '하늘 아래 첫 동네', 
    category: '높이', 
    titleReward: '구름 위의 등산가', 
    desc: '1000m 이상 산 10개 완등',
    icon: 'trending-up',
    iconType: 'Ionicons'
  },
  { 
    id: 'height_1500m', 
    title: '구름 위의 산책', 
    category: '높이', 
    titleReward: '하늘을 걷는 자', 
    desc: '1500m 이상 산 5개 완등',
    icon: 'cloud-outline',
    iconType: 'Ionicons'
  },

  // 3. Difficulty Challenges
  { 
    id: 'diff_easy', 
    title: '초보 탈출', 
    category: '난이도', 
    titleReward: '등산 입문자', 
    desc: '초급 산 10개 완등',
    icon: 'sprout-outline',
    iconType: 'MaterialCommunityIcons'
  },
  { 
    id: 'diff_medium', 
    title: '중급자의 길', 
    category: '난이도', 
    titleReward: '산을 아는 자', 
    desc: '중급 산 20개 완등',
    icon: 'footsteps-outline',
    iconType: 'Ionicons'
  },
  { 
    id: 'diff_hard', 
    title: '고수의 여정', 
    category: '난이도', 
    titleReward: '산의 고수', 
    desc: '고급 산 10개 완등',
    icon: 'skull-outline',
    iconType: 'Ionicons'
  },

  // 4. Season Challenges
  { 
    id: 'season_spring', 
    title: '봄의 등산가', 
    category: '계절', 
    titleReward: '봄바람 등산가', 
    desc: '3~5월 사이 10개 완등',
    icon: 'flower-outline',
    iconType: 'MaterialCommunityIcons'
  },
  { 
    id: 'season_summer', 
    title: '여름 산악인', 
    category: '계절', 
    titleReward: '여름 산악인', 
    desc: '6~8월 사이 10개 완등',
    icon: 'sunny-outline',
    iconType: 'Ionicons'
  },
  { 
    id: 'season_autumn', 
    title: '가을 단풍 사냥꾼', 
    category: '계절', 
    titleReward: '단풍 사냥꾼', 
    desc: '9~11월 사이 10개 완등',
    icon: 'leaf-outline',
    iconType: 'Ionicons'
  },
  { 
    id: 'season_winter', 
    title: '겨울 설산 정복자', 
    category: '계절', 
    titleReward: '설산의 전사', 
    desc: '12~2월 사이 5개 완등',
    icon: 'snowflake',
    iconType: 'MaterialCommunityIcons'
  },

  // 5. Special Challenges
  { 
    id: 'special_dawn', 
    title: '새벽 등산가', 
    category: '특수', 
    titleReward: '새벽을 여는 자', 
    desc: '오전 6시 이전 인증 5회',
    icon: 'alarm-outline',
    iconType: 'Ionicons'
  },
  { 
    id: 'special_weekend', 
    title: '주말 등산왕', 
    category: '특수', 
    titleReward: '주말 산악왕', 
    desc: '주말에만 10개 완등',
    icon: 'calendar-outline',
    iconType: 'Ionicons'
  },
  { 
    id: 'special_consistent', 
    title: '꾸준한 등산가', 
    category: '특수', 
    titleReward: '산의 수호자', 
    desc: '한 달에 4번 이상 3개월 연속',
    icon: 'heart-half-outline',
    iconType: 'Ionicons'
  },
  { 
    id: 'special_all_regions', 
    title: '전국 일주', 
    category: '특수', 
    titleReward: '전국 유랑객', 
    desc: '9개 지역 모두 1개 이상 완등',
    icon: 'map-outline',
    iconType: 'Ionicons'
  },
  { 
    id: 'special_30_peaks', 
    title: '명산 30 완등', 
    category: '특수', 
    titleReward: '명산 정복자', 
    desc: '산 30개 완등',
    icon: 'ribbon-outline',
    iconType: 'Ionicons'
  },
  { 
    id: 'special_legend', 
    title: '전설의 등산가', 
    category: '특수', 
    titleReward: '대한민국 산의 왕', 
    desc: '전체 85개 산 완등',
    icon: 'crown-outline',
    iconType: 'MaterialCommunityIcons'
  }
];

export const BASE_TITLE_DEFINITIONS = [
  { id: 'base_beginner', titleReward: '🌱 등산 새내기', desc: '완등 뱃지 0~10개 획득' },
  { id: 'base_active', titleReward: '🥾 산을 즐기는 자', desc: '완등 뱃지 11~30개 획득' },
  { id: 'base_conqueror', titleReward: '🏔️ 산의 정복자', desc: '완등 뱃지 31~60개 획득' },
  { id: 'base_legendary', titleReward: '👑 전설의 등산가', desc: '완등 뱃지 61~85개 획득' },
];

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

export const evaluateAllChallenges = (achievements, mountainsData = MOUNTAINS_DATA) => {
  const result = {};

  CHALLENGE_DEFINITIONS.forEach(ch => {
    let total = 0;
    let completed = 0;

    switch (ch.id) {
      // 1. Region
      case 'region_gyeonggi': {
        const targets = MAP_REGION_GROUPS['경기'];
        const groupMountains = mountainsData.filter(m => targets.includes(m.region));
        total = groupMountains.length;
        completed = groupMountains.filter(m => achievements[m.id]).length;
        break;
      }
      case 'region_gangwon': {
        const targets = MAP_REGION_GROUPS['강원'];
        const groupMountains = mountainsData.filter(m => targets.includes(m.region));
        total = groupMountains.length;
        completed = groupMountains.filter(m => achievements[m.id]).length;
        break;
      }
      case 'region_namdo': {
        const targets = [...MAP_REGION_GROUPS['전남'], ...MAP_REGION_GROUPS['전북']];
        const groupMountains = mountainsData.filter(m => targets.includes(m.region));
        total = groupMountains.length;
        completed = groupMountains.filter(m => achievements[m.id]).length;
        break;
      }
      case 'region_yeongnam': {
        const targets = [...MAP_REGION_GROUPS['경남'], ...MAP_REGION_GROUPS['경북']];
        const groupMountains = mountainsData.filter(m => targets.includes(m.region));
        total = groupMountains.length;
        completed = groupMountains.filter(m => achievements[m.id]).length;
        break;
      }
      case 'region_jeju': {
        const targets = MAP_REGION_GROUPS['제주'];
        const groupMountains = mountainsData.filter(m => targets.includes(m.region));
        total = groupMountains.length;
        completed = groupMountains.filter(m => achievements[m.id]).length;
        break;
      }

      // 2. Height
      case 'height_1000m': {
        const targetMountains = mountainsData.filter(m => m.height >= 1000);
        const actualCompleted = targetMountains.filter(m => achievements[m.id]).length;
        total = 10;
        completed = Math.min(actualCompleted, total);
        break;
      }
      case 'height_1500m': {
        const targetMountains = mountainsData.filter(m => m.height >= 1500);
        const actualCompleted = targetMountains.filter(m => achievements[m.id]).length;
        total = 5;
        completed = Math.min(actualCompleted, total);
        break;
      }

      // 3. Difficulty
      case 'diff_easy': {
        const targetMountains = mountainsData.filter(m => m.difficulty === '하');
        const actualCompleted = targetMountains.filter(m => achievements[m.id]).length;
        total = 10;
        completed = Math.min(actualCompleted, total);
        break;
      }
      case 'diff_medium': {
        const targetMountains = mountainsData.filter(m => m.difficulty === '중');
        const actualCompleted = targetMountains.filter(m => achievements[m.id]).length;
        total = 20;
        completed = Math.min(actualCompleted, total);
        break;
      }
      case 'diff_hard': {
        const targetMountains = mountainsData.filter(m => m.difficulty === '상');
        const actualCompleted = targetMountains.filter(m => achievements[m.id]).length;
        total = 10;
        completed = Math.min(actualCompleted, total);
        break;
      }

      // 4. Season
      case 'season_spring': {
        const actualCompleted = mountainsData.filter(m => {
          const ach = achievements[m.id];
          if (!ach || !ach.date) return false;
          const month = parseInt(ach.date.split('.')[1], 10);
          return month >= 3 && month <= 5;
        }).length;
        total = 10;
        completed = Math.min(actualCompleted, total);
        break;
      }
      case 'season_summer': {
        const actualCompleted = mountainsData.filter(m => {
          const ach = achievements[m.id];
          if (!ach || !ach.date) return false;
          const month = parseInt(ach.date.split('.')[1], 10);
          return month >= 6 && month <= 8;
        }).length;
        total = 10;
        completed = Math.min(actualCompleted, total);
        break;
      }
      case 'season_autumn': {
        const actualCompleted = mountainsData.filter(m => {
          const ach = achievements[m.id];
          if (!ach || !ach.date) return false;
          const month = parseInt(ach.date.split('.')[1], 10);
          return month >= 9 && month <= 11;
        }).length;
        total = 10;
        completed = Math.min(actualCompleted, total);
        break;
      }
      case 'season_winter': {
        const actualCompleted = mountainsData.filter(m => {
          const ach = achievements[m.id];
          if (!ach || !ach.date) return false;
          const month = parseInt(ach.date.split('.')[1], 10);
          return month === 12 || month === 1 || month === 2;
        }).length;
        total = 5;
        completed = Math.min(actualCompleted, total);
        break;
      }

      // 5. Special
      case 'special_dawn': {
        const actualCompleted = mountainsData.filter(m => {
          const ach = achievements[m.id];
          if (!ach || !ach.time) return false;
          const hour = parseInt(ach.time.split(':')[0], 10);
          return hour < 6;
        }).length;
        total = 5;
        completed = Math.min(actualCompleted, total);
        break;
      }
      case 'special_weekend': {
        const actualCompleted = mountainsData.filter(m => {
          const ach = achievements[m.id];
          if (!ach || !ach.date) return false;
          const parts = ach.date.split('.').map(Number);
          if (parts.length < 3) return false;
          const day = new Date(parts[0], parts[1] - 1, parts[2]).getDay();
          return day === 0 || day === 6; // 0: Sunday, 6: Saturday
        }).length;
        total = 10;
        completed = Math.min(actualCompleted, total);
        break;
      }
      case 'special_consistent': {
        // "꾸준한 등산가: 한 달에 4번 이상 3개월 연속"
        total = 3;
        
        // 1. Group achievements count by YYYY.MM
        const monthlyCounts = {};
        mountainsData.forEach(m => {
          const ach = achievements[m.id];
          if (!ach || !ach.date) return;
          const parts = ach.date.split('.');
          if (parts.length < 2) return;
          const key = `${parts[0]}.${parts[1]}`; // YYYY.MM
          monthlyCounts[key] = (monthlyCounts[key] || 0) + 1;
        });

        // 2. Generate month indices sorted chronologically
        const monthlyIndices = Object.keys(monthlyCounts).map(ym => {
          const [y, m] = ym.split('.').map(Number);
          return {
            key: ym,
            index: y * 12 + m,
            count: monthlyCounts[ym]
          };
        }).sort((a, b) => a.index - b.index);

        // 3. Find max consecutive streak of months with >= 4 achievements
        let maxStreak = 0;
        let currentStreak = 0;
        let lastIdx = -1;

        monthlyIndices.forEach(item => {
          if (item.count >= 4) {
            if (lastIdx === -1 || item.index === lastIdx + 1) {
              currentStreak += 1;
            } else {
              currentStreak = 1;
            }
            lastIdx = item.index;
            if (currentStreak > maxStreak) {
              maxStreak = currentStreak;
            }
          } else {
            currentStreak = 0;
            lastIdx = -1;
          }
        });

        completed = Math.min(maxStreak, total);
        break;
      }
      case 'special_all_regions': {
        total = 9;
        const macroRegions = ['경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];
        let activeMacroRegions = 0;
        
        macroRegions.forEach(mr => {
          const targets = MAP_REGION_GROUPS[mr];
          const hasUnlockedInRegion = mountainsData.some(m => targets.includes(m.region) && achievements[m.id]);
          if (hasUnlockedInRegion) {
            activeMacroRegions += 1;
          }
        });
        completed = activeMacroRegions;
        break;
      }
      case 'special_30_peaks': {
        const actualCompleted = mountainsData.filter(m => achievements[m.id]).length;
        total = 30;
        completed = Math.min(actualCompleted, total);
        break;
      }
      case 'special_legend': {
        const actualCompleted = mountainsData.filter(m => achievements[m.id]).length;
        total = 85;
        completed = Math.min(actualCompleted, total);
        break;
      }
      default:
        break;
    }

    const progress = total > 0 ? (completed / total) : 0;
    const isCompleted = completed === total && total > 0;

    result[ch.id] = { total, completed, progress, isCompleted };
  });

  return result;
};

// Evaluates base bracket title according to completed badge count
export const evaluateBaseTitle = (completedCount) => {
  if (completedCount <= 10) return '🌱 등산 새내기';
  if (completedCount <= 30) return '🥾 산을 즐기는 자';
  if (completedCount <= 60) return '🏔️ 산의 정복자';
  return '👑 전설의 등산가';
};
