import React, { useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Modal, 
  Animated, 
  Dimensions, 
  TouchableWithoutFeedback,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function RegionConquestOverlay({ 
  visible, 
  regionName, 
  regionColorSource, // Kept for prop compatibility, but no longer used for image
  onAnimationEnd 
}) {
  if (!visible || !regionName) return null;

  // Animation values
  const textScale = useRef(new Animated.Value(0.5)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  // Gold Star Particle animations
  const numParticles = 24;
  const particles = useRef(
    Array.from({ length: numParticles }).map(() => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      scale: new Animated.Value(0.2),
      opacity: new Animated.Value(1),
    }))
  ).current;

  useEffect(() => {
    // 1. Overlay Fade In
    Animated.timing(overlayOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // 2. Texts fade-in pop
    Animated.sequence([
      Animated.delay(100),
      Animated.parallel([
        Animated.spring(textScale, {
          toValue: 1.0,
          tension: 90,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        })
      ])
    ]).start();

    // 3. Gold Star Particle explosion
    const particleAnimations = particles.map((p, index) => {
      const angle = (index / numParticles) * 2 * Math.PI + (Math.random() * 0.3 - 0.15);
      const distance = Math.floor(Math.random() * 130) + 100;
      const targetX = Math.cos(angle) * distance;
      const targetY = Math.sin(angle) * distance;

      return Animated.sequence([
        Animated.delay(150),
        Animated.parallel([
          Animated.timing(p.x, {
            toValue: targetX,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(p.y, {
            toValue: targetY,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(p.scale, {
            toValue: Math.random() * 0.9 + 0.6,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(p.opacity, {
            toValue: 0,
            duration: 1100,
            useNativeDriver: true,
          })
        ])
      ]);
    });

    Animated.parallel(particleAnimations).start();
  }, [regionName]);

  // Handle touch closure with fadeout
  const handleDismiss = () => {
    Animated.timing(overlayOpacity, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start(() => {
      onAnimationEnd();
    });
  };

  const getRegionFriendlyName = (name) => {
    if (name === '경기') return '경기도';
    if (name === '강원') return '강원도';
    if (name === '충북') return '충청북도';
    if (name === '충남') return '충청남도';
    if (name === '전북') return '전라북도';
    if (name === '전남') return '전라남도';
    if (name === '경북') return '경상북도';
    if (name === '경남') return '경상남도';
    if (name === '제주') return '제주도';
    return name;
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none"
    >
      <TouchableWithoutFeedback onPress={handleDismiss}>
        <Animated.View style={[styles.goldOverlayContainer, { opacity: overlayOpacity }]}>
          
          {/* Luxury Gold Halo Layer */}
          <View style={styles.goldGlowBackground}>
            <View style={styles.goldLayer1} />
            <View style={styles.goldLayer2} />
          </View>

          {/* Golden Starburst Particles */}
          <View style={styles.particlesContainer}>
            {particles.map((p, idx) => (
              <Animated.View
                key={idx}
                style={[
                  styles.particle,
                  {
                    transform: [
                      { translateX: p.x },
                      { translateY: p.y },
                      { scale: p.scale }
                    ],
                    opacity: p.opacity,
                  }
                ]}
              >
                <Ionicons name="star" size={16} color="#FBBF24" />
              </Animated.View>
            ))}
          </View>

          {/* Typography */}
          <Animated.View style={[styles.textBlock, { opacity: textOpacity, transform: [{ scale: textScale }] }]}>
            <Text style={styles.conquestTitleText}>지역 정복! 🏆</Text>
            <Text style={styles.conquestRegionText}>{getRegionFriendlyName(regionName)} 정복 완료!</Text>
            <Text style={styles.conquestSubText}>해당 지역의 모든 산을 정복했습니다!</Text>
            <Text style={styles.tapToDismissText}>화면을 터치하면 돌아갑니다</Text>
          </Animated.View>

        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  goldOverlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.96)', // Luxurious dark gold silhouette filter
    justifyContent: 'center',
    alignItems: 'center',
  },
  goldGlowBackground: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goldLayer1: {
    position: 'absolute',
    width: SCREEN_WIDTH * 1.5,
    height: SCREEN_WIDTH * 1.5,
    borderRadius: (SCREEN_WIDTH * 1.5) / 2,
    backgroundColor: 'rgba(181, 137, 37, 0.1)', // Luxurious radial bronze layer
  },
  goldLayer2: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    borderRadius: SCREEN_WIDTH / 2,
    backgroundColor: 'rgba(251, 191, 36, 0.05)', // Glow halo layer
  },
  particlesContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  particle: {
    position: 'absolute',
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBlock: {
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 10,
  },
  conquestTitleText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FBBF24', // Amber/gold celebratory tone
    letterSpacing: -0.5,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        textShadowColor: 'rgba(0, 0, 0, 0.6)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
      },
      android: {
        textShadowColor: 'rgba(0, 0, 0, 0.6)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
      },
      web: {
        textShadow: '0px 2px 4px rgba(0, 0, 0, 0.6)',
      },
      default: {
        textShadowColor: 'rgba(0, 0, 0, 0.6)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
      }
    }),
    textAlign: 'center',
  },
  conquestRegionText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  conquestSubText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 32,
    textAlign: 'center',
  },
  tapToDismissText: {
    fontSize: 12,
    color: '#FBBF24', // 금색
    fontWeight: '600',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});
