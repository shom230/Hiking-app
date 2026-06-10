import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, Image, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { BORDER_RADIUS, SHADOWS } from '../styles/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAP_WIDTH = SCREEN_WIDTH - 40;
const MAP_HEIGHT = MAP_WIDTH; // Square layout to center the map puzzle pieces perfectly

// Require all 18 puzzle assets dynamically
const REGION_ASSETS = {
  '경기': {
    gray: require('../../assets/gyeonggi_gray.png'),
    color: require('../../assets/gyeonggi_color.png')
  },
  '강원': {
    gray: require('../../assets/gangwon_gray.png'),
    color: require('../../assets/gangwon_color.png')
  },
  '충북': {
    gray: require('../../assets/chungbuk_gray.png'),
    color: require('../../assets/chungbuk_color.png')
  },
  '충남': {
    gray: require('../../assets/chungnam_gray.png'),
    color: require('../../assets/chungnam_color.png')
  },
  '전북': {
    gray: require('../../assets/jeonbuk_gray.png'),
    color: require('../../assets/jeonbuk_color.png')
  },
  '전남': {
    gray: require('../../assets/jeonnam_gray.png'),
    color: require('../../assets/jeonnam_color.png')
  },
  '경북': {
    gray: require('../../assets/gyeongbuk_gray.png'),
    color: require('../../assets/gyeongbuk_color.png')
  },
  '경남': {
    gray: require('../../assets/gyeongnam_gray.png'),
    color: require('../../assets/gyeongnam_color.png')
  },
  '제주': {
    gray: require('../../assets/jeju_gray.png'),
    color: require('../../assets/jeju_color.png')
  }
};

export default function KoreaMap({ onSelectRegion, getRegionStats, completedRegions = [] }) {
  const [activeRegion, setActiveRegion] = useState(null);

  // Mappings of the 9 macro regions to their SVG polygonal path coordinates
  // Hand-calibrated to align perfectly with the assets outlines in a 340x460 ViewBox
  const REGION_PATHS = [
    {
      id: '경기',
      d: 'M 70,50 L 155,40 L 165,115 L 140,150 L 95,150 L 70,120 Z',
    },
    {
      id: '강원',
      d: 'M 155,40 L 285,40 L 290,120 L 310,165 L 230,155 L 165,115 Z',
    },
    {
      id: '충남',
      d: 'M 70,120 L 95,150 L 140,150 L 130,200 L 95,215 L 60,205 Z',
    },
    {
      id: '충북',
      d: 'M 140,150 L 165,115 L 230,155 L 205,215 L 175,230 L 155,215 L 130,200 Z',
    },
    {
      id: '경북',
      d: 'M 230,155 L 310,165 L 320,240 L 325,290 L 260,280 L 210,265 L 175,230 L 205,215 Z',
    },
    {
      id: '전북',
      d: 'M 60,205 L 95,215 L 130,200 L 155,215 L 175,230 L 210,265 L 205,280 L 195,285 L 140,280 L 80,265 Z',
    },
    {
      id: '경남',
      d: 'M 210,265 L 260,280 L 325,290 L 305,355 L 285,365 L 250,370 L 220,330 L 195,285 Z',
    },
    {
      id: '전남',
      d: 'M 80,265 L 140,280 L 195,285 L 220,330 L 250,370 L 205,380 L 165,380 L 120,365 L 95,335 Z',
    },
    {
      id: '제주',
      d: 'M 115,430 C 115,410 205,410 205,430 C 205,450 115,450 115,430 Z',
    },
  ];

  const handleRegionPress = (regionId) => {
    setActiveRegion(regionId);
    setTimeout(() => {
      setActiveRegion(null);
      onSelectRegion(regionId);
    }, 120); // Responsive feedback delay
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.mapContainer}>
          {/* Stacking 9 absolute image layers to build South Korea's puzzle map seamlessly */}
          {REGION_PATHS.map((region) => {
            const isCompleted = completedRegions.includes(region.id);
            const imageSource = isCompleted 
              ? REGION_ASSETS[region.id].color 
              : REGION_ASSETS[region.id].gray;

            return (
              <TouchableOpacity 
                key={region.id} 
                style={styles.puzzlePieceWrapper}
                onPress={() => handleRegionPress(region.id)}
                activeOpacity={0.9}
              >
                <Image 
                  source={imageSource}
                  style={styles.puzzlePiece}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            );
          })}
          
          {/* Svg Touch Overlay Layer (COMPLETELY CLEAN - No text overlays) */}
          <Svg
            style={styles.svgOverlay}
            viewBox="0 0 340 460"
            pointerEvents="none" // Forward touch down to puzzlePieceWrapper TouchableOpacity directly
          >
            {REGION_PATHS.map((region) => {
              const isPressed = activeRegion === region.id;

              return (
                <Path
                  key={region.id}
                  d={region.d}
                  fill={isPressed ? 'rgba(222, 10, 38, 0.18)' : 'rgba(0,0,0,0.01)'}
                />
              );
            })}
          </Svg>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginTop: 20,
    width: '100%',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.xl,
    width: '100%',
    height: MAP_HEIGHT + 32,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.soft,
  },
  mapContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  puzzlePieceWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  puzzlePiece: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  svgOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
});
