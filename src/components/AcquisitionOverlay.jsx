import React, { useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Modal, 
  Animated, 
  Dimensions, 
  Image,
  TouchableWithoutFeedback,
  Platform,
  Easing
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SHADOWS } from '../styles/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BADGE_CELEB_SIZE = Math.floor(SCREEN_WIDTH * 0.5);

export default function AcquisitionOverlay({ 
  visible, 
  mountain, 
  badgeResource, 
  onAnimationEnd 
}) {
  if (!visible || !mountain) return null;

  // Animation values
  const badgeScale = useRef(new Animated.Value(0.1)).current;
  const badgeTranslateY = useRef(new Animated.Value(300)).current;
  const textScale = useRef(new Animated.Value(0.5)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  
  // Independent content opacity to fade text and badge details immediately on tap
  const contentOpacity = useRef(new Animated.Value(1)).current;

  // Capture mounted timestamp to track particle duration before overlay unmounts
  const mountedTime = useRef(0);

  // Particle configurations: 30 particles with random physics properties, color, and size
  const numParticles = 30;
  const particleColors = [
    '#FF0000', '#FF7F00', '#FFFF00', 
    '#00FF00', '#0000FF', '#8B00FF', 
    '#FF69B4', '#FFD700', '#00FFFF'
  ];

  const particles = useRef(
    Array.from({ length: numParticles }).map(() => {
      const color = particleColors[Math.floor(Math.random() * particleColors.length)];
      const size = Math.floor(Math.random() * 5) + 8; // Random size from 8px to 12px
      const angle = Math.random() * 2 * Math.PI;
      const speed = Math.random() * 160 + 90; // Spread speed/factor
      
      const targetX = Math.cos(angle) * speed;
      
      // Upward burst (negative Y) peaking between -120 and -250
      const peakY = -120 - Math.random() * 130;
      
      // Gravity falling phase (positive Y) below the screen
      const finalY = peakY + 500 + Math.random() * 250;

      return {
        x: new Animated.Value(0),
        y: new Animated.Value(0),
        scale: new Animated.Value(0.1),
        opacity: new Animated.Value(1),
        color,
        size,
        targetX,
        peakY,
        finalY,
      };
    })
  ).current;

  useEffect(() => {
    mountedTime.current = Date.now();
    
    // Reset animatable values on reload
    contentOpacity.setValue(1);
    overlayOpacity.setValue(0);
    badgeScale.setValue(0.1);
    badgeTranslateY.setValue(300);
    textScale.setValue(0.5);
    textOpacity.setValue(0);
    
    particles.forEach(p => {
      p.x.setValue(0);
      p.y.setValue(0);
      p.scale.setValue(0.1);
      p.opacity.setValue(1);
    });

    // 1. Overlay Fade In
    Animated.timing(overlayOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // 2. Badge Slide-up & Zoom In
    Animated.parallel([
      Animated.spring(badgeScale, {
        toValue: 1.1,
        tension: 80,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.spring(badgeTranslateY, {
        toValue: 0,
        tension: 80,
        friction: 6,
        useNativeDriver: true,
      })
    ]).start();

    // 3. Celebration Text pop
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.spring(textScale, {
          toValue: 1.1,
          tension: 100,
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

    // 4. Parabolic Fireworks explosion animation (exactly 1.5s/1500ms)
    const particleAnimations = particles.map((p) => {
      return Animated.parallel([
        // Horizontal movement with deceleration
        Animated.timing(p.x, {
          toValue: p.targetX,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
        // Parabolic vertical movement (Burst up -> Fall down)
        Animated.sequence([
          Animated.timing(p.y, {
            toValue: p.peakY,
            duration: 600,
            useNativeDriver: true,
            easing: Easing.out(Easing.quad),
          }),
          Animated.timing(p.y, {
            toValue: p.finalY,
            duration: 900,
            useNativeDriver: true,
            easing: Easing.in(Easing.quad),
          }),
        ]),
        // Scale grows quickly, then shrinks to 0.1 at 1.5s
        Animated.sequence([
          Animated.timing(p.scale, {
            toValue: 1.0,
            duration: 200,
            useNativeDriver: true,
            easing: Easing.out(Easing.quad),
          }),
          Animated.timing(p.scale, {
            toValue: 0.1,
            duration: 1300,
            useNativeDriver: true,
            easing: Easing.in(Easing.quad),
          }),
        ]),
        // Opacity fades out to 0 over 1500ms
        Animated.timing(p.opacity, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.in(Easing.quad),
        }),
      ]);
    });

    Animated.parallel(particleAnimations).start();
  }, [mountain]);

  // Graceful interactive fade out sequence
  const handleDismiss = () => {
    // 1. Fade out the text and badge content immediately (300ms)
    Animated.timing(contentOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // 2. Allow particles to complete their 1.5s animation naturally, then fade out background overlay
    const elapsedTime = Date.now() - mountedTime.current;
    const remainingTime = Math.max(0, 1500 - elapsedTime);

    Animated.sequence([
      Animated.delay(remainingTime),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      onAnimationEnd();
    });
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none"
    >
      <TouchableWithoutFeedback onPress={handleDismiss}>
        <Animated.View style={[styles.overlayContainer, { opacity: overlayOpacity }]}>
          
          {/* Celebratory circular fireworks particles */}
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
                    width: p.size,
                    height: p.size,
                    borderRadius: p.size / 2,
                    backgroundColor: p.color,
                  }
                ]}
              />
            ))}
          </View>

          {/* Main content block that fades out immediately on user tap */}
          <Animated.View style={{ opacity: contentOpacity, alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
            {/* Badge Render Stack */}
            <Animated.View 
              style={[
                styles.badgeWrapper,
                { transform: [{ scale: badgeScale }, { translateY: badgeTranslateY }] }
              ]}
            >
              {/* badgeContainer has no border and clips tightly as a clean circular frame */}
              <View style={styles.badgeContainer}>
                {badgeResource ? (
                  <Image source={badgeResource} style={styles.badgeImage} />
                ) : (
                  <View style={styles.fallbackCircle}>
                    <Ionicons name="trophy" size={54} color="#16A34A" />
                  </View>
                )}
              </View>
            </Animated.View>

            {/* Celebration Typography */}
            <Animated.View style={[styles.textBlock, { opacity: textOpacity, transform: [{ scale: textScale }] }]}>
              <Text style={styles.badgeTitleText}>뱃지 획득!</Text>
              <Text style={styles.mountainNameText}>{mountain.name}</Text>
              <Text style={styles.mountainHeightText}>{mountain.height}m 정복 완료</Text>
              <Text style={styles.tapToDismissText}>화면을 터치하면 도감으로 돌아갑니다</Text>
            </Animated.View>
          </Animated.View>

        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.94)', // Solid dark premium glass-like filter
    justifyContent: 'center',
    alignItems: 'center',
  },
  particlesContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  particle: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    zIndex: 10,
  },
  badgeContainer: {
    width: BADGE_CELEB_SIZE,
    height: BADGE_CELEB_SIZE,
    borderRadius: BADGE_CELEB_SIZE / 2,
    overflow: 'hidden', // Circular crop cleanly
    padding: 0,
    margin: 0,
    backgroundColor: 'transparent',
    ...SHADOWS.medium,
  },
  badgeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Fills perfectly inside
    borderRadius: BADGE_CELEB_SIZE / 2,
  },
  fallbackCircle: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: BADGE_CELEB_SIZE / 2,
  },
  textBlock: {
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 10,
  },
  badgeTitleText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#34D399', // Rich celebratory green
    letterSpacing: -0.5,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
      },
      android: {
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
      },
      web: {
        textShadow: '0px 2px 4px rgba(0, 0, 0, 0.4)',
      },
      default: {
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
      }
    })
  },
  mountainNameText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  mountainHeightText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
    marginBottom: 20,
  },
  tapToDismissText: {
    fontSize: 12,
    color: '#64748B',
    fontStyle: 'italic',
    fontWeight: '500',
  },
});
