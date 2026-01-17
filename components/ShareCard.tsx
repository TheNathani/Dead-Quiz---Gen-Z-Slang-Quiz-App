import React, { forwardRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SkullMascot, SkullExpression } from './SkullMascot';

interface ShareCardProps {
  percentage: number;
  tier: string;
  accessory: SkullExpression;
}

export const ShareCard = forwardRef<View, ShareCardProps>(
  ({ percentage, tier, accessory }, ref) => {
    return (
      <View ref={ref} style={styles.container} collapsable={false}>
        <LinearGradient
          colors={['#8B5CF6', '#EC4899']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <SkullMascot expression={accessory} size={100} />

            <Text style={styles.percentage}>{percentage}%</Text>

            <View style={styles.tierBadge}>
              <Text style={styles.tierText}>{tier}</Text>
            </View>

            <Text style={styles.watermark}>Dead - Gen Z Slang Quiz</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }
);

ShareCard.displayName = 'ShareCard';

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 400,
    borderRadius: 24,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  percentage: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 72,
    color: '#FFFFFF',
    marginTop: 16,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tierBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 16,
  },
  tierText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  watermark: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    position: 'absolute',
    bottom: 20,
  },
});
