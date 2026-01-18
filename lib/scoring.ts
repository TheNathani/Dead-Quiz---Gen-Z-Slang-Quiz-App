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

// Generate slang-heavy message for "Text my Kid" feature
export function generateSlangMessage(score: number, total: number): string {
  const percent = (score / total) * 100;

  if (percent === 100) {
    return `I just got 100% on the Dead Quiz. Your fit today is bussin, no cap. I'm lowkey the main character now. IJBOL at how cooked you thought I was. Periodt.`;
  }
  if (percent >= 90) {
    return `Ayo I just scored ${score}/${total} on the Dead Quiz. That's giving main character energy fr fr. Your parent has rizz now, no cap. Stay locked in bestie.`;
  }
  if (percent >= 70) {
    return `Just took the Dead Quiz and got ${score}/${total}. Lowkey slay tbh. I'm not cooked anymore. Bffr, I understood the assignment. W parent moment.`;
  }
  if (percent >= 50) {
    return `OK so I got ${score}/${total} on the Dead Quiz. Mid performance but I'm learning the brainrot. Not an L, not a W. We move. IJBOL.`;
  }
  if (percent >= 30) {
    return `Your parent just got ${score}/${total} on the Dead Quiz. I'm a little cooked ngl. But I'm locked in on learning this skibidi sigma Ohio brainrot. Bffr with me.`;
  }
  return `Help I just got ${score}/${total} on the Dead Quiz. I'm absolutely cooked. Certified unc behavior. That's a major L. Please teach me before I crash out. This is so Ohio.`;
}
