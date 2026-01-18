import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface DefinitionCardProps {
  word: string;
  parentTip: string;
  cringeLevel: number;
  isCorrect: boolean;
}

export function DefinitionCard({ word, parentTip, cringeLevel, isCorrect }: DefinitionCardProps) {
  // Get cringe meter label
  const getCringeLabel = (level: number): string => {
    if (level <= 2) return 'Safe to use';
    if (level <= 4) return 'Use carefully';
    if (level <= 6) return 'Risky';
    if (level <= 8) return 'Very cringe';
    return 'DO NOT SAY';
  };

  // Get cringe meter color
  const getCringeColor = (level: number): string => {
    if (level <= 2) return '#84CC16'; // green
    if (level <= 4) return '#EAB308'; // yellow
    if (level <= 6) return '#F97316'; // orange
    if (level <= 8) return '#EF4444'; // red
    return '#DC2626'; // dark red
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { borderColor: isCorrect ? '#84CC16' : '#0F172A' }
      ]}
      entering={FadeInUp.delay(200).duration(300)}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.whyLabel}>Why?</Text>
        <Text style={styles.wordLabel}>"{word}"</Text>
      </View>

      {/* Parent Tip */}
      <Text style={styles.tipText}>{parentTip}</Text>

      {/* Cringe Meter */}
      <View style={styles.cringeMeterContainer}>
        <Text style={styles.cringeMeterLabel}>Cringe-o-Meter:</Text>
        <View style={styles.meterTrack}>
          <View
            style={[
              styles.meterFill,
              {
                width: `${cringeLevel * 10}%`,
                backgroundColor: getCringeColor(cringeLevel)
              }
            ]}
          />
        </View>
        <View style={styles.cringeLabelContainer}>
          <Text style={[styles.cringeLevelText, { color: getCringeColor(cringeLevel) }]}>
            {cringeLevel}/10
          </Text>
          <Text style={[styles.cringeStatusText, { color: getCringeColor(cringeLevel) }]}>
            {getCringeLabel(cringeLevel)}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginHorizontal: 4,
    // Neubrutalist shadow
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  whyLabel: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    color: '#8B5CF6',
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#0F172A',
    overflow: 'hidden',
  },
  wordLabel: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 18,
    color: '#0F172A',
  },
  tipText: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 16,
  },
  cringeMeterContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  cringeMeterLabel: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  meterTrack: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#0F172A',
    overflow: 'hidden',
  },
  meterFill: {
    height: '100%',
    borderRadius: 4,
  },
  cringeLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  cringeLevelText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 14,
  },
  cringeStatusText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 13,
  },
});
