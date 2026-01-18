import { supabase } from './supabase';

export type SkullAccessory = 'neutral' | 'crown' | 'sunglasses' | 'glasses' | 'clown';

export interface ScoreTier {
  tier: string;
  accessory: SkullAccessory;
  description: string;
}

export interface SaveScoreResult {
  success: boolean;
  error?: string;
  errorCode?: string;
}

export function getTier(score: number, total: number): ScoreTier {
  // Validate inputs
  if (typeof score !== 'number' || isNaN(score)) {
    console.error('getTier: Invalid score value, defaulting to 0');
    score = 0;
  }

  if (typeof total !== 'number' || isNaN(total) || total <= 0) {
    console.error('getTier: Invalid total value, defaulting to 10');
    total = 10;
  }

  // Clamp score to valid range
  if (score < 0) {
    console.error('getTier: Negative score detected, clamping to 0');
    score = 0;
  }

  if (score > total) {
    console.error('getTier: Score exceeds total, clamping to total');
    score = total;
  }

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
  // Validate inputs
  if (typeof score !== 'number' || isNaN(score)) {
    console.error('getPercentage: Invalid score value, defaulting to 0');
    score = 0;
  }

  if (typeof total !== 'number' || isNaN(total) || total <= 0) {
    console.error('getPercentage: Invalid total value, defaulting to 10');
    total = 10;
  }

  // Clamp score to valid range
  if (score < 0) score = 0;
  if (score > total) score = total;

  return Math.round((score / total) * 100);
}

export async function saveScore(
  deviceId: string,
  score: number,
  tier: string
): Promise<SaveScoreResult> {
  // Validate inputs
  if (!deviceId || typeof deviceId !== 'string') {
    const errorMsg = 'Invalid device ID: must be a non-empty string';
    console.error('saveScore:', errorMsg);
    return { success: false, error: errorMsg, errorCode: 'INVALID_DEVICE_ID' };
  }

  if (typeof score !== 'number' || isNaN(score) || score < 0) {
    const errorMsg = 'Invalid score: must be a non-negative number';
    console.error('saveScore:', errorMsg);
    return { success: false, error: errorMsg, errorCode: 'INVALID_SCORE' };
  }

  if (!tier || typeof tier !== 'string') {
    const errorMsg = 'Invalid tier: must be a non-empty string';
    console.error('saveScore:', errorMsg);
    return { success: false, error: errorMsg, errorCode: 'INVALID_TIER' };
  }

  try {
    const { error } = await supabase.from('scores').insert({
      device_id: deviceId,
      score,
      tier,
    });

    if (error) {
      console.error('Error saving score to database:', error.message);
      return {
        success: false,
        error: `Database error: ${error.message}`,
        errorCode: error.code || 'DATABASE_ERROR',
      };
    }
    return { success: true };
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : 'Unknown error occurred';
    console.error('Error saving score:', errorMsg);
    return {
      success: false,
      error: `Network error: ${errorMsg}`,
      errorCode: 'NETWORK_ERROR',
    };
  }
}

export function generateDeviceId(): string {
  try {
    return 'device_' + Math.random().toString(36).substring(2, 15);
  } catch (e) {
    // Fallback in case of any unexpected error
    console.error('Error generating device ID, using fallback:', e);
    return 'device_' + Date.now().toString(36);
  }
}
