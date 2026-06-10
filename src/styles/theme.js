import { Platform } from 'react-native';

// Premium Forest / Nature Theme Design Tokens
export const COLORS = {
  // Brand Colors (Deep Emerald & Sage Greens)
  primary: '#2D6A4F',       // Forest Green (Primary Brand)
  primaryDark: '#1B4332',   // Deep Forest (Dark text, headers)
  primaryLight: '#40916C',  // Medium Green (Accents)
  primaryLightest: '#E8F5E9',// Light green background fill
  sage: '#52B788',          // Vibrant Sage
  mint: '#74C69D',          // Soft Mint
  glassMint: 'rgba(116, 198, 157, 0.15)',

  // Secondary Accents
  accentGold: '#FFB703',    // Gold for Stars & Achievements
  accentOrange: '#FB8500',  // Warm orange for special highlights
  accentRed: '#E63946',     // Red for delete / alert actions
  
  // Grayscale & System
  bgLight: '#FFFFFF',       // Clean White organic background
  bgDark: '#0B130F',        // Soft obsidian background (dark)
  cardLight: '#FFFFFF',     // Clean White for cards
  textDark: '#1E293B',      // Slate 800 (Very readable dark text)
  textMuted: '#64748B',     // Slate 500 (Subtle helper text)
  textLight: '#F8FAFC',     // Slate 50 (Light text on dark backgrounds)
  border: '#E2E8F0',        // Slate 200 (Clean borders)
  
  // Grayscale locked state
  lockedBg: '#E2E8F0',
  lockedText: '#94A3B8',
  lockedBadge: '#CBD5E1',
};

export const GRADIENTS = {
  // Beautiful organic gradients for unlocked badges
  forest: ['#1B4332', '#40916C'],
  emerald: ['#064E3B', '#10B981'],
  teal: ['#115E59', '#14B8A6'],
  leaf: ['#2F855A', '#48BB78'],
  earth: ['#78350F', '#D97706'],
  ocean: ['#1E3A8A', '#3B82F6'],
  sunset: ['#881337', '#F43F5E'],
  mountainSky: ['#312E81', '#6366F1'],
  goldBadge: ['#B45309', '#F59E0B'],
};

// Preset colors assigned to mountains to give them unique vibrant looks
export const BADGE_COLORS = [
  '#2D6A4F', '#064E3B', '#115E59', '#2F855A', '#1E3A8A',
  '#881337', '#78350F', '#4338CA', '#3730A3', '#0F766E'
];

export const TYPOGRAPHY = {
  fontFamily: {
    // Falls back to system fonts, prioritizing clean sans-serif/Gothic
    regular: 'System',
  },
  sizes: {
    xs: 11,
    sm: 13,
    base: 15,
    lg: 18,
    xl: 22,
    xxl: 28,
  },
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  }
};

export const SHADOWS = {
  soft: Platform.select({
    ios: {
      shadowColor: '#1B4332',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
    },
    android: {
      elevation: 2,
    },
    web: {
      boxShadow: '0px 4px 10px rgba(27, 67, 50, 0.08)',
    },
    default: {
      shadowColor: '#1B4332',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 2,
    }
  }),
  medium: Platform.select({
    ios: {
      shadowColor: '#0B130F',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
    },
    android: {
      elevation: 4,
    },
    web: {
      boxShadow: '0px 6px 12px rgba(11, 19, 15, 0.12)',
    },
    default: {
      shadowColor: '#0B130F',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 4,
    }
  }),
  badge: Platform.select({
    ios: {
      shadowColor: '#2D6A4F',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
    },
    android: {
      elevation: 6,
    },
    web: {
      boxShadow: '0px 8px 8px rgba(45, 106, 79, 0.25)',
    },
    default: {
      shadowColor: '#2D6A4F',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 6,
    }
  })
};

export const BORDER_RADIUS = {
  sm: 6,
  md: 12,
  lg: 18,
  xl: 24,
  round: 9999,
};
