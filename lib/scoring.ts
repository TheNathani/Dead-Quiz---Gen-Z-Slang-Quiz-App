import { supabase } from './supabase';

export type SkullAccessory = 'neutral' | 'crown' | 'sunglasses' | 'glasses' | 'clown';

export interface ScoreTier {
  tier: string;
  accessory: SkullAccessory;
  description: string;
}

export function getTier(score: number, total: number): ScoreTier {
  const percent = (score / total) * 100;

  if (percent >= 91) {
    return {
      tier: 'Main Character',
      accessory: 'crown',
      description: "You're giving main character energy fr fr",
    };
  }
  if (percent >= 71) {
    return {
      tier: 'Lowkey Slay',
      accessory: 'sunglasses',
      description: 'You understood most of the assignment',
    };
  }
  if (percent >= 51) {
    return {
      tier: 'Undercover Millennial',
      accessory: 'glasses',
      description: "You're trying to blend in, we see you",
    };
  }
  if (percent >= 31) {
    return {
      tier: "You're Trying",
      accessory: 'neutral',
      description: "At least you're making an effort bestie",
    };
  }
  return {
    tier: 'Certified Boomer',
    accessory: 'clown',
    description: 'Touch grass and open TikTok immediately',
  };
}

export function getPercentage(score: number, total: number): number {
  return Math.round((score / total) * 100);
}

export async function saveScore(
  deviceId: string,
  score: number,
  tier: string
): Promise<boolean> {
  try {
    const { error } = await supabase.from('scores').insert({
      device_id: deviceId,
      score,
      tier,
    });

    if (error) {
      console.error('Error saving score:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Error saving score:', e);
    return false;
  }
}

export function generateDeviceId(): string {
  return 'device_' + Math.random().toString(36).substring(2, 15);
}
