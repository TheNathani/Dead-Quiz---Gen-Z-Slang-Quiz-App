import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Share,
  Platform,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import Svg, { Circle, Path, G, Ellipse, Rect, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  withSpring,
  Easing,
  FadeIn,
  FadeOut,
  FadeInUp,
  FadeInDown,
  SlideInRight,
  SlideOutLeft,
  ZoomIn,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// ============ QUESTIONS DATA ============
const questions = [
  { id: 1, word: "Aura", question: "If you trip in public and people say you 'lost 1,000 aura,' what happened?", correct: "You lost your 'cool' factor", wrong: ["You lost your wallet", "You are glowing", "You need a doctor"], parent_tip: "Aura is like an invisible scoreboard. Doing cool things adds points; being embarrassing takes them away.", cringe_level: 4 },
  { id: 2, word: "Locked in", question: "What does a teen mean when they say they are 'locked in'?", correct: "Completely focused and determined", wrong: ["They are stuck in a room", "They lost their keys", "They are going to sleep"], parent_tip: "The ultimate state of focus. If your kid is 'locked in' on a task, don't interrupt them.", cringe_level: 2 },
  { id: 3, word: "Glazing", question: "If your kid tells you to 'stop glazing the teacher,' what are you doing?", correct: "Over-complimenting or 'sucking up'", wrong: ["Making donuts", "Cleaning the windows", "Helping with chores"], parent_tip: "Modern version of being a 'brown-noser.' It's considered very cringe to glaze someone too hard.", cringe_level: 6 },
  { id: 4, word: "Crash out", question: "What is someone doing if they 'crash out' over a bad grade?", correct: "Having a total meltdown or overreacting", wrong: ["Going to sleep", "Leaving the room quietly", "Studying harder"], parent_tip: "Used for extreme reactions. 'He really crashed out' means he lost his cool completely.", cringe_level: 5 },
  { id: 5, word: "IJBOL", question: "If someone texts you 'IJBOL,' what are they doing?", correct: "Laughing out loud suddenly", wrong: ["Asking for help", "Saying goodbye", "Complaining about food"], parent_tip: "Stands for 'I Just Burst Out Laughing.' It's the 2026 upgrade to 'LOL.'", cringe_level: 3 },
  { id: 6, word: "Bffr", question: "What is someone asking when they say 'Bffr'?", correct: "Be for real / Stop lying", wrong: ["Best friends forever", "Buy food for real", "Be friends first"], parent_tip: "Use this when your kid tells you a story that sounds 100% fake.", cringe_level: 4 },
  { id: 7, word: "Unc", question: "If a teen calls you 'Unc,' what are they implying?", correct: "You are old or out of touch", wrong: ["You are their favorite uncle", "You are very rich", "You are a professional athlete"], parent_tip: "Short for 'Uncle.' It's a playful (but sharp) jab at your age. 'It's time for bed, Unc.'", cringe_level: 7 },
  { id: 8, word: "AI Slop", question: "What does Gen Z call low-quality, fake-looking AI videos?", correct: "AI Slop", wrong: ["Cyber Junk", "Robot Trash", "Digital Dust"], parent_tip: "They have a high 'BS' meter for AI. If a video looks lazy or generated, it's 'slop.'", cringe_level: 2 },
  { id: 9, word: "Mewing", question: "Why would a teen put a finger to their lips and point to their jaw?", correct: "They are doing a jawline exercise", wrong: ["They have a toothache", "They are telling you to be quiet", "They are hungry"], parent_tip: "If they do this, they can't talk because it 'breaks their streak.' It's a viral jawline meme.", cringe_level: 8 },
  { id: 10, word: "Brainrot", question: "What is 'Brainrot' content?", correct: "Mindless, low-quality internet memes", wrong: ["Educational videos", "Classic literature", "Medical news"], parent_tip: "The fast-paced, nonsensical videos that make you feel like your brain is melting.", cringe_level: 3 },
  { id: 11, word: "Fanum Tax", question: "What is a 'Fanum Tax'?", correct: "Stealing a bite of a friend's food", wrong: ["A new app fee", "A TikTok dance", "A government tax"], parent_tip: "If your kid takes one of your fries, they just 'taxed' you.", cringe_level: 9 },
  { id: 12, word: "Gyatt", question: "What is 'Gyatt' usually an exclamation for?", correct: "Shock or admiration of someone's physique", wrong: ["A type of hat", "A bad grade", "A healthy vegetable"], parent_tip: "Short for 'God Damn.' Usually shouted when someone with a certain 'physique' walks by.", cringe_level: 9 },
  { id: 13, word: "Sigma", question: "What does it mean to be a 'Sigma'?", correct: "An independent, 'lone wolf' leader", wrong: ["A math symbol", "A Greek food", "Someone who is lazy"], parent_tip: "Usually a compliment for someone who is cool and doesn't follow the crowd.", cringe_level: 7 },
  { id: 14, word: "Skibidi", question: "How is the word 'Skibidi' most commonly used in 2026?", correct: "As a nonsense word for anything weird or bad", wrong: ["To mean 'expensive'", "To describe a fast car", "As a greeting"], parent_tip: "The ultimate 'brainrot' word. It doesn't really mean anything specific anymore.", cringe_level: 10 },
  { id: 15, word: "Rizz", question: "What does it mean if someone has 'Rizz'?", correct: "They have charisma or charm", wrong: ["They are good at cooking", "They are tired", "They have a cold"], parent_tip: "Short for 'charisma.' If you have rizz, you're a smooth talker.", cringe_level: 8 },
  { id: 16, word: "Cooked", question: "If someone says 'We're cooked,' they mean:", correct: "They are in big trouble or done for", wrong: ["The food is ready", "They are feeling hot", "They are excited"], parent_tip: "The 2026 version of saying 'We're toast.'", cringe_level: 2 },
  { id: 17, word: "Ohio", question: "If someone says a situation is 'Only in Ohio,' what do they mean?", correct: "It is weird, chaotic, or bizarre", wrong: ["It is very peaceful", "It is in the Midwest", "It is very cold"], parent_tip: "Ohio is the internet's 'weird' state. Anything bizarre is 'so Ohio.'", cringe_level: 9 },
  { id: 18, word: "6-7", question: "What does it mean if a kid shouts '6-7' while dancing?", correct: "Nothing; it's a nonsensical exclamation", wrong: ["They are talking about their height", "It's a math answer", "They are leaving at 6:07"], parent_tip: "Dictionary.com's 2025 Word of the Year. It literally means nothing. It's just a vibe.", cringe_level: 10 },
  { id: 19, word: "Chicken Jockey", question: "What is a 'Chicken Jockey' in 2026 pop culture?", correct: "A meme from the Minecraft movie", wrong: ["A chef", "A horse rider", "A type of gamer"], parent_tip: "A viral meme from the Minecraft movie. It's often shouted for no reason.", cringe_level: 9 },
  { id: 20, word: "Aura farming", question: "What is 'Aura farming'?", correct: "Trying too hard to look cool for points", wrong: ["Growing plants", "Playing video games", "Studying for a test"], parent_tip: "When someone is being a 'poser' just to get people to think they are cool.", cringe_level: 6 },
  { id: 21, word: "Looksmaxxing", question: "If a teen is 'Looksmaxxing,' they are:", correct: "Trying to maximize their physical attractiveness", wrong: ["Looking for a job", "Watching too many movies", "Painting their room"], parent_tip: "The process of self-improvement (gym, skin care, style) to look their best.", cringe_level: 5 },
  { id: 22, word: "Mogging", question: "If your kid says they are 'mogging' someone, they are:", correct: "Looking better or more dominant than them", wrong: ["Sharing snacks", "Cleaning the floor", "Taking a nap"], parent_tip: "A physical competition of who looks 'more alpha' or stylish.", cringe_level: 5 },
  { id: 23, word: "Beige flag", question: "What is a 'Beige flag' in dating?", correct: "A trait that is just weird or boring", wrong: ["A dangerous trait", "A great trait", "A flag from a small country"], parent_tip: "Not a dealbreaker (Red) and not a win (Green). Just... odd. Like 'he eats pizza with a fork.'", cringe_level: 3 },
  { id: 24, word: "Girl math", question: "What is 'Girl math'?", correct: "Using playful logic to justify spending", wrong: ["Hard calculus", "Math done by girls", "Saving money"], parent_tip: "Example: 'If I pay in cash, it's free because the money is already gone.'", cringe_level: 4 },
  { id: 25, word: "Soft launch", question: "What is a 'Soft launch' on social media?", correct: "Subtly hinting at a new relationship", wrong: ["Launching a rocket", "Quitting a job", "Posting a selfie"], parent_tip: "Posting a photo of a new partner's elbow or hand before showing their face.", cringe_level: 2 },
  { id: 26, word: "Algorithm fatigue", question: "If someone has 'Algorithm fatigue,' they are:", correct: "Bored with their social media feed", wrong: ["Tired from math class", "Broken their phone", "Sleepy"], parent_tip: "When you've scrolled so much that nothing on your 'For You' page is interesting anymore.", cringe_level: 2 },
  { id: 27, word: "Out of pocket", question: "If a comment is 'Out of pocket,' it is:", correct: "Wild, inappropriate, or uncalled for", wrong: ["Very cheap", "Missing", "In a pocket"], parent_tip: "Used when someone says something way too blunt or rude.", cringe_level: 3 },
  { id: 28, word: "Fit Check", question: "What is a 'Fit Check'?", correct: "Showing off or rating an outfit", wrong: ["Checking gym health", "Checking if a key fits", "A medical exam"], parent_tip: "Short for 'Outfit Check.' Usually a video of someone showing what they are wearing.", cringe_level: 4 },
  { id: 29, word: "It's giving...", question: "The phrase 'It's giving...' is used to:", correct: "Describe the vibe or impression of something", wrong: ["Donate to charity", "Hand over a gift", "Ask for money"], parent_tip: "Example: 'It's giving main character' means you're acting like the star.", cringe_level: 6 },
  { id: 30, word: "Tea", question: "If someone says 'Spill the tea,' they want to:", correct: "Share some juicy gossip", wrong: ["Make a drink", "Clean the floor", "Go to a cafe"], parent_tip: "Tea = Gossip. 'What's the tea?' is a great way to get them talking.", cringe_level: 5 },
  { id: 31, word: "Sus", question: "If a person is acting 'Sus,' they are being:", correct: "Suspicious or shady", wrong: ["Successful", "Super", "Sustainable"], parent_tip: "Short for 'suspicious.' A classic that isn't going away.", cringe_level: 4 },
  { id: 32, word: "Slay", question: "What does it mean to 'Slay'?", correct: "To do something exceptionally well", wrong: ["To be lazy", "To sleep all day", "To be mean"], parent_tip: "Used for anything impressive. 'You slayed that presentation.'", cringe_level: 7 },
  { id: 33, word: "Periodt", question: "Adding 'Periodt' to a sentence means:", correct: "The discussion is final", wrong: ["I'm joking", "I'm confused", "Wait for me"], parent_tip: "An intense version of 'Period.' Usually involves a hand clap.", cringe_level: 8 },
  { id: 34, word: "Simp", question: "What is a 'Simp'?", correct: "Someone who does too much for their crush", wrong: ["A simple person", "A genius", "A gamer"], parent_tip: "An insult for someone who is being overly desperate for attention from a crush.", cringe_level: 7 },
  { id: 35, word: "Vibe check", question: "A 'Vibe check' is:", correct: "Assessing the mood or energy", wrong: ["A medical test", "A bank check", "A sound test"], parent_tip: "If you walk into a room and it feels awkward, the vibe check failed.", cringe_level: 5 },
  { id: 36, word: "Finna", question: "What does 'Finna' mean?", correct: "Fixing to / Going to", wrong: ["Finally", "Finding", "Finish"], parent_tip: "Example: 'I'm finna go to the store.'", cringe_level: 3 },
  { id: 37, word: "G.O.A.T.", question: "What does G.O.A.T. stand for?", correct: "Greatest Of All Time", wrong: ["Go Out And Travel", "Get On A Train", "Green Oats And Toast"], parent_tip: "The ultimate compliment for an athlete or musician.", cringe_level: 2 },
  { id: 38, word: "Ick", question: "Getting 'The Ick' means:", correct: "A sudden disgust for someone you liked", wrong: ["Catching a cold", "Being happy", "Finding a bug"], parent_tip: "Once you get the 'ick,' there is usually no turning back in a relationship.", cringe_level: 5 },
  { id: 39, word: "L", question: "What does it mean to 'Take an L'?", correct: "To suffer a loss or failure", wrong: ["To take a lunch", "To be lucky", "To learn something"], parent_tip: "L = Loss. 'That's a major L' means that was a huge failure.", cringe_level: 2 },
  { id: 40, word: "W", question: "What does 'Taking a W' mean?", correct: "Winning or having a success", wrong: ["Walking", "Working", "Waiting"], parent_tip: "W = Win. Also known as 'Taking the dub.'", cringe_level: 2 },
  { id: 41, word: "Menty B", question: "What is a 'Menty B'?", correct: "A mental breakdown", wrong: ["A type of candy", "A Monday morning", "A mountain bike"], parent_tip: "Used jokingly for being stressed. 'I'm having a total menty b.'", cringe_level: 7 },
  { id: 42, word: "Rent free", question: "If something is living 'Rent free' in your head:", correct: "You can't stop thinking about it", wrong: ["You forgot it", "You are being paid", "It's a secret"], parent_tip: "Usually used for an annoying song or an embarrassing memory.", cringe_level: 3 },
  { id: 43, word: "Sending me", question: "If a video is 'Sending me,' it is:", correct: "Making you laugh uncontrollably", wrong: ["Making you angry", "Very boring", "Being mailed"], parent_tip: "Short for 'sending me to heaven' because I'm dying of laughter.", cringe_level: 6 },
  { id: 44, word: "Shook", question: "If you are 'Shook,' you are:", correct: "Shocked or surprised", wrong: ["Cold", "Exercising", "Asleep"], parent_tip: "Usually used for something surprising. 'I am shook by that news.'", cringe_level: 4 },
  { id: 45, word: "Snatched", question: "If an outfit is 'Snatched,' it looks:", correct: "Perfect and well-fitted", wrong: ["Broken", "Stolen", "Hidden"], parent_tip: "A high compliment for style. 'Your waist is snatched.'", cringe_level: 7 },
  { id: 46, word: "Valid", question: "If an opinion is 'Valid,' it is:", correct: "Relatable or understandable", wrong: ["A lie", "Too expensive", "Illegal"], parent_tip: "Used to show agreement. 'That's a valid point.'", cringe_level: 2 },
  { id: 47, word: "We outside", question: "Saying 'We outside' means:", correct: "We are out having fun / living life", wrong: ["The door is locked", "It is raining", "We are lost"], parent_tip: "Celebratory phrase for being out at an event or party.", cringe_level: 6 },
  { id: 48, word: "Zesty", question: "Calling someone 'Zesty' usually implies:", correct: "They are being flamboyant or 'extra'", wrong: ["They are spicy", "They like lemons", "They are fast"], parent_tip: "Often used as a playful label for a very energetic personality.", cringe_level: 8 },
  { id: 49, word: "Pookie", question: "Who is your 'Pookie'?", correct: "A best friend or partner", wrong: ["A pet dog", "An enemy", "A celebrity you hate"], parent_tip: "A super-sweet term of endearment. 'You're my pookie.'", cringe_level: 7 },
  { id: 50, word: "Based", question: "If an opinion is 'Based,' it is:", correct: "Confidently true, even if controversial", wrong: ["Found on the floor", "A lie", "Boring"], parent_tip: "Used to respect someone for saying what they really think.", cringe_level: 5 },
];

const { width, height } = Dimensions.get('window');

// ============ DESIGN TOKENS ============
const COLORS = {
  primary: '#8B5CF6',
  secondary: '#EC4899',
  background: '#FAFAF9',
  white: '#FFFFFF',
  black: '#0F172A',
  gray: '#64748B',
  lightGray: '#E2E8F0',
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',
};

const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
};

// ============ FISHER-YATES SHUFFLE ============
function fisherYatesShuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ============ SCORE TIERS ============
function getTier(score, total) {
  const percent = (score / total) * 100;
  if (percent >= 90) return { tier: 'Main Character', emoji: '👑', description: "You're giving main character energy fr fr. Your kids fear you.", color: '#FFD700' };
  if (percent >= 70) return { tier: 'Lowkey Slay', emoji: '😎', description: "You understood most of the assignment. Not bad for an Unc.", color: '#8B5CF6' };
  if (percent >= 50) return { tier: 'Undercover Millennial', emoji: '🥸', description: "You're trying to blend in. We see you, bestie.", color: '#3B82F6' };
  if (percent >= 30) return { tier: "You're Trying", emoji: '😬', description: "At least you're making an effort. Touch some grass.", color: '#F59E0B' };
  return { tier: 'Certified Boomer', emoji: '💀', description: "Open TikTok immediately. This is an intervention.", color: '#EF4444' };
}

// ============ TEXT MESSAGE GENERATOR ============
function generateTextMessage(score, total) {
  const percent = (score / total) * 100;
  if (percent >= 90) {
    return `yo I just got ${score}/${total} on the Dead Quiz 💀 I literally have more rizz than you now. Your fit today better be bussin or I'm collecting a Fanum tax on your snacks. no cap fr fr`;
  }
  if (percent >= 70) {
    return `just took the Dead Quiz and got ${score}/${total} 😎 lowkey slayed it. might start saying 'skibidi' unironically now. you've been warned bestie`;
  }
  if (percent >= 50) {
    return `ok so I got ${score}/${total} on the Dead Quiz... I'm not cooked but I'm definitely on medium heat 🍳 bffr tho some of these words are unhinged`;
  }
  if (percent >= 30) {
    return `I got ${score}/${total} on the Dead Quiz 😬 apparently I'm giving "unc energy" whatever that means. explain yourself immediately`;
  }
  return `HELP I got ${score}/${total} on the Dead Quiz 💀💀💀 I am fully cooked. I thought "mewing" was about cats?? we need to talk`;
}

// ============ ADMOB PLACEHOLDER COMPONENTS ============
function BannerAdPlaceholder() {
  return (
    <View style={adStyles.bannerContainer}>
      <View style={adStyles.bannerInner}>
        <Text style={adStyles.bannerText}>AD SPACE</Text>
        <Text style={adStyles.bannerSubtext}>Banner Ad Placeholder</Text>
      </View>
    </View>
  );
}

function showInterstitialAd() {
  // Placeholder for AdMob interstitial
  console.log('🎬 Interstitial Ad would show here');
  // In production: await interstitial.show();
  return new Promise((resolve) => setTimeout(resolve, 100));
}

const adStyles = StyleSheet.create({
  bannerContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  bannerInner: {
    backgroundColor: COLORS.lightGray,
    borderWidth: 2,
    borderColor: COLORS.black,
    borderStyle: 'dashed',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 8,
  },
  bannerText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    color: COLORS.gray,
    letterSpacing: 2,
  },
  bannerSubtext: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 10,
    color: COLORS.gray,
    marginTop: 2,
  },
});

// ============ SKULL MASCOT ============
const AnimatedView = Animated.createAnimatedComponent(View);

function SkullMascot({ expression = 'neutral', size = 120, animate = false }) {
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (animate) {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-8, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      rotation.value = withRepeat(
        withSequence(
          withTiming(2, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(-2, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    }
  }, [animate]);

  useEffect(() => {
    if (expression === 'happy') {
      scale.value = withSequence(
        withSpring(1.15, { damping: 8 }),
        withSpring(1, { damping: 10 })
      );
    } else if (expression === 'cringe') {
      scale.value = withSequence(
        withTiming(0.9, { duration: 100 }),
        withSpring(1, { damping: 8 })
      );
    }
  }, [expression]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
  }));

  const renderEyes = () => {
    switch (expression) {
      case 'happy':
        return (
          <G>
            <Path d="M32 42 Q38 32 44 42" stroke={COLORS.black} strokeWidth="4" fill="none" strokeLinecap="round" />
            <Path d="M56 42 Q62 32 68 42" stroke={COLORS.black} strokeWidth="4" fill="none" strokeLinecap="round" />
          </G>
        );
      case 'cringe':
        return (
          <G>
            <G>
              <Circle cx="38" cy="40" r="8" fill={COLORS.black} />
              <Circle cx="40" cy="38" r="3" fill={COLORS.white} />
            </G>
            <G>
              <Circle cx="62" cy="40" r="8" fill={COLORS.black} />
              <Circle cx="64" cy="38" r="3" fill={COLORS.white} />
            </G>
            <Ellipse cx="78" cy="36" rx="5" ry="8" fill="#87CEEB" opacity={0.8} />
          </G>
        );
      default:
        return (
          <G>
            <Circle cx="38" cy="42" r="7" fill={COLORS.black} />
            <Circle cx="62" cy="42" r="7" fill={COLORS.black} />
          </G>
        );
    }
  };

  const renderMouth = () => {
    switch (expression) {
      case 'happy':
        return <Path d="M35 60 Q50 75 65 60" stroke={COLORS.black} strokeWidth="3" fill="none" strokeLinecap="round" />;
      case 'cringe':
        return <Path d="M32 62 Q38 58 44 62 Q50 66 56 62 Q62 58 68 62" stroke={COLORS.black} strokeWidth="3" fill="none" strokeLinecap="round" />;
      default:
        return <Path d="M38 58 Q50 66 62 58" stroke={COLORS.black} strokeWidth="3" fill="none" strokeLinecap="round" />;
    }
  };

  const renderAccessory = () => {
    if (expression === 'happy') {
      return (
        <G>
          <Path d="M25 12 L30 2 L40 10 L50 -2 L60 10 L70 2 L75 12 L75 20 L25 20 Z" fill="#FFD700" stroke="#DAA520" strokeWidth="2" />
          <Circle cx="50" cy="8" r="4" fill="#EF4444" />
          <Circle cx="35" cy="12" r="3" fill="#3B82F6" />
          <Circle cx="65" cy="12" r="3" fill="#22C55E" />
        </G>
      );
    }
    return null;
  };

  const renderBlush = () => {
    if (expression === 'happy') {
      return (
        <G>
          <Ellipse cx="26" cy="52" rx="8" ry="5" fill="#FFB6C1" opacity={0.7} />
          <Ellipse cx="74" cy="52" rx="8" ry="5" fill="#FFB6C1" opacity={0.7} />
        </G>
      );
    }
    return null;
  };

  return (
    <AnimatedView style={[skullStyles.container, animate && animatedStyle, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <SvgLinearGradient id="skullGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="100%" stopColor="#F1F5F9" />
          </SvgLinearGradient>
        </Defs>
        <Ellipse cx="50" cy="50" rx="42" ry="44" fill="url(#skullGrad)" stroke={COLORS.black} strokeWidth="3" />
        {renderAccessory()}
        {renderEyes()}
        {renderBlush()}
        <Path d="M48 50 Q50 48 52 50 Q50 54 48 50" fill="#E2E8F0" />
        {renderMouth()}
      </Svg>
    </AnimatedView>
  );
}

const skullStyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// ============ NEUBRUTALIST BUTTON ============
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function Button({ title, onPress, variant = 'primary', size = 'medium', style, disabled = false }) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handlePressIn = () => {
    translateX.value = withTiming(4, { duration: 100 });
    translateY.value = withTiming(4, { duration: 100 });
  };

  const handlePressOut = () => {
    translateX.value = withTiming(0, { duration: 100 });
    translateY.value = withTiming(0, { duration: 100 });
  };

  const handlePress = () => {
    if (disabled) return;
    triggerHaptic();
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const sizeStyles = {
    small: { paddingVertical: 10, paddingHorizontal: 20, fontSize: 14 },
    medium: { paddingVertical: 16, paddingHorizontal: 32, fontSize: 16 },
    large: { paddingVertical: 20, paddingHorizontal: 48, fontSize: 18 },
  };

  const currentSize = sizeStyles[size];

  if (variant === 'secondary') {
    return (
      <View style={[buttonStyles.shadowBox, style]}>
        <AnimatedPressable
          style={[buttonStyles.secondaryButton, animatedStyle, { paddingVertical: currentSize.paddingVertical, paddingHorizontal: currentSize.paddingHorizontal }, disabled && buttonStyles.disabled]}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled}
        >
          <Text style={[buttonStyles.secondaryText, { fontSize: currentSize.fontSize }]}>{title}</Text>
        </AnimatedPressable>
      </View>
    );
  }

  if (variant === 'ghost') {
    return (
      <Pressable style={[buttonStyles.ghostButton, style]} onPress={handlePress} disabled={disabled}>
        <Text style={[buttonStyles.ghostText, { fontSize: currentSize.fontSize }]}>{title}</Text>
      </Pressable>
    );
  }

  return (
    <View style={[buttonStyles.shadowBox, style]}>
      <AnimatedPressable
        style={[animatedStyle, disabled && buttonStyles.disabled]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[buttonStyles.primaryButton, { paddingVertical: currentSize.paddingVertical, paddingHorizontal: currentSize.paddingHorizontal }]}
        >
          <Text style={[buttonStyles.primaryText, { fontSize: currentSize.fontSize }]}>{title}</Text>
        </LinearGradient>
      </AnimatedPressable>
    </View>
  );
}

const buttonStyles = StyleSheet.create({
  shadowBox: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  primaryButton: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.black,
  },
  primaryText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    color: COLORS.white,
    textAlign: 'center',
  },
  secondaryButton: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.black,
    backgroundColor: COLORS.white,
  },
  secondaryText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    color: COLORS.black,
    textAlign: 'center',
  },
  ghostButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  ghostText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: COLORS.gray,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});

// ============ PROGRESS BAR ============
function ProgressBar({ current, total }) {
  const progress = current / total;

  const animatedWidth = useAnimatedStyle(() => ({
    width: withTiming(`${progress * 100}%`, { duration: 400, easing: Easing.out(Easing.cubic) }),
  }));

  return (
    <View style={progressStyles.container}>
      <View style={progressStyles.barOuter}>
        <Animated.View style={[progressStyles.barFill, animatedWidth]}>
          <LinearGradient colors={[COLORS.primary, COLORS.secondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={progressStyles.gradient} />
        </Animated.View>
      </View>
      <Text style={progressStyles.text}>{current}/{total}</Text>
    </View>
  );
}

const progressStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
  },
  barOuter: {
    flex: 1,
    height: 16,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.black,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
  },
  text: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 18,
    color: COLORS.black,
    minWidth: 50,
    textAlign: 'right',
  },
});

// ============ ANSWER BUTTON ============
function AnswerButton({ text, onPress, disabled = false, state = 'default', index }) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const shakeX = useSharedValue(0);

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressIn = () => {
    if (!disabled) {
      translateX.value = withTiming(4, { duration: 80 });
      translateY.value = withTiming(4, { duration: 80 });
      triggerHaptic();
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      translateX.value = withTiming(0, { duration: 80 });
      translateY.value = withTiming(0, { duration: 80 });
    }
  };

  useEffect(() => {
    if (state === 'wrong') {
      shakeX.value = withSequence(
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    }
  }, [state]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value + shakeX.value },
      { translateY: translateY.value },
    ],
  }));

  const getBackgroundColor = () => {
    switch (state) {
      case 'correct':
      case 'revealed':
        return COLORS.success;
      case 'wrong':
        return COLORS.error;
      default:
        return COLORS.white;
    }
  };

  const getTextColor = () => {
    switch (state) {
      case 'correct':
      case 'wrong':
      case 'revealed':
        return COLORS.white;
      default:
        return COLORS.black;
    }
  };

  const labels = ['A', 'B', 'C', 'D'];

  return (
    <Animated.View entering={FadeInUp.delay(index * 80).duration(300)} style={answerStyles.wrapper}>
      <View style={answerStyles.shadowBox}>
        <AnimatedPressable
          style={[answerStyles.button, animatedStyle, { backgroundColor: getBackgroundColor() }, disabled && state === 'default' && answerStyles.disabled]}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled}
        >
          <View style={[answerStyles.label, { backgroundColor: state === 'default' ? COLORS.primary : 'rgba(255,255,255,0.3)' }]}>
            <Text style={answerStyles.labelText}>{labels[index]}</Text>
          </View>
          <Text style={[answerStyles.text, { color: getTextColor() }]} numberOfLines={3}>{text}</Text>
        </AnimatedPressable>
      </View>
    </Animated.View>
  );
}

const answerStyles = StyleSheet.create({
  wrapper: {
    marginVertical: 6,
  },
  shadowBox: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    paddingLeft: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.black,
    gap: 12,
  },
  label: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 14,
    color: COLORS.white,
  },
  text: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 15,
    flex: 1,
  },
  disabled: {
    opacity: 0.6,
  },
});

// ============ CRINGE METER ============
function CringeMeter({ level }) {
  const bars = 10;

  const getBarColor = (index) => {
    if (index >= level) return COLORS.lightGray;
    if (index < 3) return COLORS.success;
    if (index < 6) return COLORS.warning;
    return COLORS.error;
  };

  return (
    <View style={cringeStyles.container}>
      <Text style={cringeStyles.label}>Cringe Level</Text>
      <View style={cringeStyles.barsContainer}>
        {Array.from({ length: bars }).map((_, i) => (
          <Animated.View
            key={i}
            entering={FadeIn.delay(i * 50)}
            style={[cringeStyles.bar, { backgroundColor: getBarColor(i), height: 12 + i * 2 }]}
          />
        ))}
      </View>
      <Text style={cringeStyles.levelText}>{level}/10</Text>
    </View>
  );
}

const cringeStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  label: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 12,
    color: COLORS.gray,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
  },
  bar: {
    width: 8,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  levelText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 14,
    color: COLORS.black,
  },
});

// ============ PARENT TIP CARD ============
function ParentTipCard({ word, tip, cringeLevel }) {
  return (
    <Animated.View entering={FadeInUp.delay(300).duration(400)} style={tipStyles.container}>
      <View style={tipStyles.card}>
        <View style={tipStyles.header}>
          <View style={tipStyles.wordBadge}>
            <Text style={tipStyles.wordText}>{word}</Text>
          </View>
          <Text style={tipStyles.headerLabel}>Parent Decoder</Text>
        </View>
        <Text style={tipStyles.tipText}>{tip}</Text>
        <CringeMeter level={cringeLevel} />
      </View>
    </Animated.View>
  );
}

const tipStyles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FEF9C3',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.black,
    padding: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  wordBadge: {
    backgroundColor: COLORS.black,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  wordText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 14,
    color: COLORS.white,
  },
  headerLabel: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 12,
    color: COLORS.gray,
  },
  tipText: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 14,
    color: COLORS.black,
    lineHeight: 22,
  },
});

// ============ CONFETTI ============
const CONFETTI_COLORS = [COLORS.primary, COLORS.secondary, COLORS.success, '#FFD700', '#4ECDC4', '#FF6B6B'];

function ConfettiPiece({ index }) {
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(Math.random() * width);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  const size = 10 + Math.random() * 10;
  const delay = index * 25;
  const duration = 1800 + Math.random() * 600;

  useEffect(() => {
    translateY.value = withDelay(delay, withTiming(height + 50, { duration, easing: Easing.out(Easing.quad) }));
    translateX.value = withDelay(delay, withTiming(translateX.value + (Math.random() - 0.5) * 150, { duration, easing: Easing.inOut(Easing.ease) }));
    rotate.value = withDelay(delay, withTiming(360 * (3 + Math.random() * 3), { duration, easing: Easing.linear }));
    opacity.value = withDelay(delay + duration * 0.7, withTiming(0, { duration: duration * 0.3 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        confettiStyles.piece,
        animatedStyle,
        {
          backgroundColor: color,
          width: size,
          height: size,
          borderRadius: Math.random() > 0.5 ? size / 2 : 3,
          borderWidth: 1,
          borderColor: COLORS.black,
        },
      ]}
    />
  );
}

function Confetti({ count = 40 }) {
  return (
    <View style={confettiStyles.container} pointerEvents="none">
      {Array.from({ length: count }).map((_, i) => (
        <ConfettiPiece key={i} index={i} />
      ))}
    </View>
  );
}

const confettiStyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  piece: {
    position: 'absolute',
  },
});

// ============ HOME SCREEN ============
function HomeScreen({ onStartQuiz }) {
  return (
    <SafeAreaView style={homeStyles.container}>
      <ScrollView contentContainerStyle={homeStyles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={homeStyles.content}>
          <Animated.View entering={FadeInDown.delay(100).duration(500)} style={homeStyles.mascotContainer}>
            <SkullMascot expression="neutral" size={160} animate />
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(200).duration(500)} style={homeStyles.titleContainer}>
            <View style={homeStyles.deadBadge}>
              <Text style={homeStyles.deadText}>DEAD</Text>
            </View>
            <Text style={homeStyles.title}>Gen Z Slang Quiz</Text>
            <Text style={homeStyles.subtitle}>Are you cooked? Or main character? Find out, Unc.</Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(400).duration(500)} style={homeStyles.statsContainer}>
            <View style={homeStyles.statBox}>
              <Text style={homeStyles.statNumber}>50</Text>
              <Text style={homeStyles.statLabel}>Questions</Text>
            </View>
            <View style={homeStyles.statDivider} />
            <View style={homeStyles.statBox}>
              <Text style={homeStyles.statNumber}>10</Text>
              <Text style={homeStyles.statLabel}>Per Quiz</Text>
            </View>
            <View style={homeStyles.statDivider} />
            <View style={homeStyles.statBox}>
              <Text style={homeStyles.statNumber}>2026</Text>
              <Text style={homeStyles.statLabel}>Slang</Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(600).duration(500)} style={homeStyles.buttonContainer}>
            <Button title="Start Quiz" onPress={onStartQuiz} size="large" />
          </Animated.View>

          <BannerAdPlaceholder />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  mascotContainer: {
    marginBottom: 24,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  deadBadge: {
    backgroundColor: COLORS.black,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
    transform: [{ rotate: '-2deg' }],
  },
  deadText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 14,
    color: COLORS.white,
    letterSpacing: 3,
  },
  title: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 32,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.black,
    padding: 20,
    marginBottom: 32,
    shadowColor: COLORS.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  statBox: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statNumber: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 24,
    color: COLORS.primary,
  },
  statLabel: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  statDivider: {
    width: 2,
    backgroundColor: COLORS.lightGray,
  },
  buttonContainer: {
    marginBottom: 24,
  },
});

// ============ QUIZ SCREEN ============
function QuizScreen({ onComplete }) {
  const [gameState, setGameState] = useState({
    questions: [],
    currentIndex: 0,
    score: 0,
    userAnswer: null,
    isAnswered: false,
    isCorrect: false,
    showTip: false,
  });
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeQuiz();
  }, []);

  const initializeQuiz = () => {
    setLoading(true);
    const shuffledQuestions = fisherYatesShuffle(questions).slice(0, 10);
    setGameState({
      questions: shuffledQuestions,
      currentIndex: 0,
      score: 0,
      userAnswer: null,
      isAnswered: false,
      isCorrect: false,
      showTip: false,
    });
    setupAnswers(shuffledQuestions[0]);
    setLoading(false);
  };

  const setupAnswers = (question) => {
    const allAnswers = [question.correct, ...question.wrong];
    setShuffledAnswers(fisherYatesShuffle(allAnswers));
  };

  const handleAnswer = useCallback(async (selectedAnswer) => {
    if (gameState.isAnswered) return;

    const currentQuestion = gameState.questions[gameState.currentIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct;

    // Update state atomically
    setGameState(prev => ({
      ...prev,
      userAnswer: selectedAnswer,
      isAnswered: true,
      isCorrect: isCorrect,
      score: isCorrect ? prev.score + 1 : prev.score,
      showTip: true,
    }));

    // Haptic feedback
    if (Platform.OS !== 'web') {
      if (isCorrect) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }

    // Wait then move to next or finish
    setTimeout(async () => {
      const nextIndex = gameState.currentIndex + 1;

      if (nextIndex >= gameState.questions.length) {
        // Show interstitial ad before results
        await showInterstitialAd();

        const finalScore = isCorrect ? gameState.score + 1 : gameState.score;
        onComplete(finalScore, gameState.questions.length);
      } else {
        // Move to next question
        setGameState(prev => ({
          ...prev,
          currentIndex: nextIndex,
          userAnswer: null,
          isAnswered: false,
          isCorrect: false,
          showTip: false,
        }));
        setupAnswers(gameState.questions[nextIndex]);
      }
    }, 2500);
  }, [gameState, onComplete]);

  const getAnswerState = (answer) => {
    if (!gameState.isAnswered) return 'default';
    const currentQuestion = gameState.questions[gameState.currentIndex];
    if (answer === currentQuestion.correct) {
      return gameState.isCorrect ? 'correct' : 'revealed';
    }
    if (answer === gameState.userAnswer && !gameState.isCorrect) {
      return 'wrong';
    }
    return 'default';
  };

  if (loading || gameState.questions.length === 0) {
    return (
      <SafeAreaView style={quizStyles.container}>
        <View style={quizStyles.loadingContainer}>
          <SkullMascot expression="neutral" size={100} animate />
          <Text style={quizStyles.loadingText}>Loading questions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentQuestion = gameState.questions[gameState.currentIndex];

  return (
    <SafeAreaView style={quizStyles.container}>
      <View style={quizStyles.header}>
        <ProgressBar current={gameState.currentIndex + 1} total={gameState.questions.length} />
      </View>

      {gameState.isAnswered && gameState.isCorrect && <Confetti count={50} />}

      <ScrollView contentContainerStyle={quizStyles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View
          key={gameState.currentIndex}
          entering={SlideInRight.duration(300)}
          style={quizStyles.questionContainer}
        >
          <View style={quizStyles.questionCard}>
            <View style={quizStyles.questionHeader}>
              <View style={quizStyles.wordTag}>
                <Text style={quizStyles.wordTagText}>{currentQuestion.word}</Text>
              </View>
            </View>
            <Text style={quizStyles.question}>{currentQuestion.question}</Text>
          </View>

          <View style={quizStyles.answersContainer}>
            {shuffledAnswers.map((answer, index) => (
              <AnswerButton
                key={`${gameState.currentIndex}-${index}`}
                text={answer}
                state={getAnswerState(answer)}
                onPress={() => handleAnswer(answer)}
                disabled={gameState.isAnswered}
                index={index}
              />
            ))}
          </View>

          {gameState.showTip && (
            <ParentTipCard
              word={currentQuestion.word}
              tip={currentQuestion.parent_tip}
              cringeLevel={currentQuestion.cringe_level}
            />
          )}
        </Animated.View>
      </ScrollView>

      <View style={quizStyles.mascotCorner}>
        <SkullMascot
          expression={gameState.isAnswered ? (gameState.isCorrect ? 'happy' : 'cringe') : 'neutral'}
          size={70}
        />
      </View>

      {gameState.isAnswered && !gameState.isCorrect && (
        <Animated.View entering={ZoomIn.duration(300)} style={quizStyles.feedbackBadge}>
          <Text style={quizStyles.feedbackText}>CRINGE</Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const quizStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 16,
  },
  questionContainer: {
    paddingHorizontal: 20,
  },
  questionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.black,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  questionHeader: {
    marginBottom: 12,
  },
  wordTag: {
    backgroundColor: COLORS.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.black,
  },
  wordTagText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    color: COLORS.white,
  },
  question: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 20,
    color: COLORS.black,
    lineHeight: 28,
  },
  answersContainer: {
    gap: 4,
  },
  mascotCorner: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  feedbackBadge: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    backgroundColor: COLORS.error,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: COLORS.black,
    transform: [{ rotate: '-12deg' }],
    shadowColor: COLORS.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  feedbackText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 32,
    color: COLORS.white,
  },
});

// ============ RESULTS SCREEN ============
function ResultsScreen({ score, total, onPlayAgain, onGoHome }) {
  const percentage = Math.round((score / total) * 100);
  const { tier, emoji, description, color } = getTier(score, total);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, []);

  const handleTextKid = async () => {
    const message = generateTextMessage(score, total);
    try {
      await Share.share({
        message: message,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <View style={resultsStyles.container}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={resultsStyles.gradient}
      >
        <SafeAreaView style={resultsStyles.safeArea}>
          <ScrollView contentContainerStyle={resultsStyles.scrollContent} showsVerticalScrollIndicator={false}>
            <Animated.View entering={FadeInDown.delay(200).duration(500)}>
              <SkullMascot expression={percentage >= 50 ? 'happy' : 'cringe'} size={130} />
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(400).duration(500)} style={resultsStyles.scoreCard}>
              <Text style={resultsStyles.percentageText}>{percentage}%</Text>
              <Text style={resultsStyles.scoreText}>{score} out of {total}</Text>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(600).duration(500)} style={[resultsStyles.tierBadge, { backgroundColor: color }]}>
              <Text style={resultsStyles.tierEmoji}>{emoji}</Text>
              <Text style={resultsStyles.tierText}>{tier}</Text>
            </Animated.View>

            <Animated.Text entering={FadeInUp.delay(800).duration(500)} style={resultsStyles.description}>
              {description}
            </Animated.Text>

            <Animated.View entering={FadeInUp.delay(1000).duration(500)} style={resultsStyles.buttonsContainer}>
              <Button title="Text My Kid" onPress={handleTextKid} variant="secondary" size="medium" style={resultsStyles.textButton} />
              <Button title="Play Again" onPress={onPlayAgain} size="medium" />
              <Button title="Home" onPress={onGoHome} variant="ghost" />
            </Animated.View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const resultsStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  scoreCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: COLORS.black,
    paddingHorizontal: 40,
    paddingVertical: 24,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: COLORS.black,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  percentageText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 72,
    color: COLORS.black,
  },
  scoreText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 18,
    color: COLORS.gray,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: COLORS.black,
    marginTop: 24,
    shadowColor: COLORS.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  tierEmoji: {
    fontSize: 28,
  },
  tierText: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 22,
    color: COLORS.white,
  },
  description: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
    color: COLORS.white,
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  buttonsContainer: {
    marginTop: 40,
    alignItems: 'center',
    gap: 12,
  },
  textButton: {
    marginBottom: 8,
  },
});

// ============ MAIN APP ============
export default function App() {
  const [screen, setScreen] = useState('home');
  const [quizScore, setQuizScore] = useState(0);
  const [quizTotal, setQuizTotal] = useState(10);

  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={appStyles.loadingContainer}>
        <Text style={appStyles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const handleStartQuiz = () => {
    setScreen('quiz');
    setQuizScore(0);
  };

  const handleQuizComplete = (score, total) => {
    setQuizScore(score);
    setQuizTotal(total);
    setScreen('results');
  };

  const handlePlayAgain = () => {
    setScreen('quiz');
    setQuizScore(0);
  };

  const handleGoHome = () => {
    setScreen('home');
    setQuizScore(0);
  };

  return (
    <SafeAreaProvider>
      <StatusBar style={screen === 'results' ? 'light' : 'dark'} />
      {screen === 'home' && <HomeScreen onStartQuiz={handleStartQuiz} />}
      {screen === 'quiz' && <QuizScreen onComplete={handleQuizComplete} />}
      {screen === 'results' && (
        <ResultsScreen
          score={quizScore}
          total={quizTotal}
          onPlayAgain={handlePlayAgain}
          onGoHome={handleGoHome}
        />
      )}
    </SafeAreaProvider>
  );
}

const appStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
    color: COLORS.gray,
  },
});
