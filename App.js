import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import Svg, {
  Circle,
  Path,
  G,
  Ellipse,
  Rect,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from 'react-native-svg';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  FadeIn,
  FadeOut,
  FadeInUp,
  FadeInDown,
  SlideInRight,
  SlideOutLeft,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// ============ TYPES ============
const SkullExpressions = ['neutral', 'happy', 'cringe', 'crown', 'clown', 'glasses', 'sunglasses'];

// ============ QUESTIONS DATA ============
const fallbackQuestions = [
  {
    id: 1,
    word_id: 1,
    question_text: 'What does "rizz" mean?',
    correct_answer: 'Charisma or charm, especially romantic',
    wrong_answers: ['A type of rice dish', 'Being extremely tired', 'A dance move'],
  },
  {
    id: 2,
    word_id: 2,
    question_text: 'What does "no cap" mean?',
    correct_answer: "I'm not lying / for real",
    wrong_answers: ['No hat required', 'Without a limit', 'Feeling down'],
  },
  {
    id: 3,
    word_id: 3,
    question_text: 'What does "slay" mean?',
    correct_answer: 'To do something exceptionally well',
    wrong_answers: ['To defeat an enemy', 'To sleep all day', 'To be lazy'],
  },
  {
    id: 4,
    word_id: 4,
    question_text: 'What does "bussin" mean?',
    correct_answer: 'Really good, especially food',
    wrong_answers: ['Taking the bus', 'Being busy', 'Breaking something'],
  },
  {
    id: 5,
    word_id: 5,
    question_text: 'What does "bet" mean as a response?',
    correct_answer: 'Okay / agreement / sounds good',
    wrong_answers: ['Making a wager', "I don't believe you", 'Maybe'],
  },
  {
    id: 6,
    word_id: 6,
    question_text: 'What does "lowkey" mean?',
    correct_answer: 'Secretly or somewhat',
    wrong_answers: ['A musical term', 'Being sad', 'Speaking quietly'],
  },
  {
    id: 7,
    word_id: 7,
    question_text: 'What does "highkey" mean?',
    correct_answer: 'Openly or very much',
    wrong_answers: ['A musical note', 'Being happy', 'Shouting'],
  },
  {
    id: 8,
    word_id: 8,
    question_text: 'What does "stan" mean?',
    correct_answer: 'An extremely devoted fan',
    wrong_answers: ["A person's name", 'To stand up', 'Standard'],
  },
  {
    id: 9,
    word_id: 9,
    question_text: 'What does "sus" mean?',
    correct_answer: 'Suspicious or shady',
    wrong_answers: ['Sustainable', 'A type of sushi', 'Sister'],
  },
  {
    id: 10,
    word_id: 10,
    question_text: 'What does "vibe check" mean?',
    correct_answer: "Assessing someone's mood or energy",
    wrong_answers: ['Checking vibrations', 'A sound test', 'Measuring temperature'],
  },
];

// ============ UTILITY FUNCTIONS ============
function shuffleAnswers(question) {
  const allAnswers = [question.correct_answer, ...question.wrong_answers];
  return allAnswers.sort(() => Math.random() - 0.5);
}

function getRandomQuestions(count = 10) {
  const shuffled = [...fallbackQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function getTier(score, total) {
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

function getPercentage(score, total) {
  return Math.round((score / total) * 100);
}

// ============ SKULL MASCOT COMPONENT ============
const AnimatedView = Animated.createAnimatedComponent(View);

function SkullMascot({ expression = 'neutral', size = 120, animate = false }) {
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (animate) {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-10, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      rotation.value = withRepeat(
        withSequence(
          withTiming(3, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(-3, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    }
  }, [animate]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const renderEyes = () => {
    switch (expression) {
      case 'happy':
        return (
          <G>
            <Path d="M35 45 Q40 35 45 45" stroke="#1a1a1a" strokeWidth="4" fill="none" strokeLinecap="round" />
            <Path d="M55 45 Q60 35 65 45" stroke="#1a1a1a" strokeWidth="4" fill="none" strokeLinecap="round" />
            <Path d="M30 30 L32 35 L27 33 L32 31 Z" fill="#FFD700" />
            <Path d="M70 30 L68 35 L73 33 L68 31 Z" fill="#FFD700" />
          </G>
        );
      case 'cringe':
        return (
          <G>
            <Circle cx="40" cy="42" r="8" fill="#1a1a1a" />
            <Circle cx="42" cy="40" r="2" fill="#ffffff" />
            <Circle cx="60" cy="42" r="8" fill="#1a1a1a" />
            <Circle cx="62" cy="40" r="2" fill="#ffffff" />
            <Ellipse cx="75" cy="35" rx="4" ry="6" fill="#87CEEB" />
          </G>
        );
      case 'glasses':
        return (
          <G>
            <Circle cx="40" cy="42" r="6" fill="#1a1a1a" />
            <Circle cx="60" cy="42" r="6" fill="#1a1a1a" />
            <Circle cx="40" cy="42" r="12" stroke="#4a4a4a" strokeWidth="2" fill="none" />
            <Circle cx="60" cy="42" r="12" stroke="#4a4a4a" strokeWidth="2" fill="none" />
            <Path d="M52 42 L48 42" stroke="#4a4a4a" strokeWidth="2" />
            <Path d="M28 42 L20 40" stroke="#4a4a4a" strokeWidth="2" />
            <Path d="M72 42 L80 40" stroke="#4a4a4a" strokeWidth="2" />
          </G>
        );
      case 'sunglasses':
        return (
          <G>
            <Defs>
              <SvgLinearGradient id="shadeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#1a1a1a" />
                <Stop offset="100%" stopColor="#4a4a4a" />
              </SvgLinearGradient>
            </Defs>
            <Rect x="28" y="35" width="18" height="14" rx="3" fill="url(#shadeGrad)" />
            <Rect x="54" y="35" width="18" height="14" rx="3" fill="url(#shadeGrad)" />
            <Path d="M46 42 L54 42" stroke="#1a1a1a" strokeWidth="2" />
            <Path d="M28 40 L18 38" stroke="#1a1a1a" strokeWidth="2" />
            <Path d="M72 40 L82 38" stroke="#1a1a1a" strokeWidth="2" />
            <Path d="M32 38 L36 38" stroke="#ffffff" strokeWidth="1" opacity="0.5" />
            <Path d="M58 38 L62 38" stroke="#ffffff" strokeWidth="1" opacity="0.5" />
          </G>
        );
      default:
        return (
          <G>
            <Circle cx="40" cy="42" r="7" fill="#1a1a1a" />
            <Circle cx="60" cy="42" r="7" fill="#1a1a1a" />
          </G>
        );
    }
  };

  const renderMouth = () => {
    switch (expression) {
      case 'happy':
        return <Path d="M35 62 Q50 75 65 62" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" />;
      case 'cringe':
        return <Path d="M35 65 Q40 60 45 65 Q50 70 55 65 Q60 60 65 65" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" />;
      default:
        return <Path d="M40 60 Q50 68 60 60" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" />;
    }
  };

  const renderAccessory = () => {
    switch (expression) {
      case 'crown':
        return (
          <G>
            <Path d="M25 15 L30 5 L40 12 L50 0 L60 12 L70 5 L75 15 L75 22 L25 22 Z" fill="#FFD700" stroke="#DAA520" strokeWidth="1" />
            <Circle cx="50" cy="10" r="3" fill="#FF4B4B" />
            <Circle cx="35" cy="14" r="2" fill="#4ECDC4" />
            <Circle cx="65" cy="14" r="2" fill="#4ECDC4" />
          </G>
        );
      case 'clown':
        return <Circle cx="50" cy="55" r="8" fill="#FF4B4B" />;
      default:
        return null;
    }
  };

  const renderBlush = () => {
    if (expression === 'happy') {
      return (
        <G>
          <Ellipse cx="30" cy="55" rx="6" ry="4" fill="#FFB6C1" opacity="0.6" />
          <Ellipse cx="70" cy="55" rx="6" ry="4" fill="#FFB6C1" opacity="0.6" />
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
            <Stop offset="100%" stopColor="#F5F5F5" />
          </SvgLinearGradient>
        </Defs>
        <Ellipse cx="50" cy="50" rx="40" ry="42" fill="url(#skullGrad)" stroke="#E0E0E0" strokeWidth="1" />
        {renderAccessory()}
        {renderEyes()}
        {renderBlush()}
        {expression !== 'clown' && <Path d="M48 52 Q50 50 52 52 Q50 55 48 52" fill="#E8E8E8" />}
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

// ============ BUTTON COMPONENT ============
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function Button({ title, onPress, variant = 'primary', style }) {
  const scale = useSharedValue(1);

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100 });
  };

  const handlePress = () => {
    triggerHaptic();
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (variant === 'ghost') {
    return (
      <AnimatedPressable style={[buttonStyles.ghostButton, animatedStyle, style]} onPress={handlePress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <Text style={buttonStyles.ghostText}>{title}</Text>
      </AnimatedPressable>
    );
  }

  if (variant === 'secondary') {
    return (
      <AnimatedPressable style={[buttonStyles.secondaryButton, animatedStyle, style]} onPress={handlePress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <Text style={buttonStyles.secondaryText}>{title}</Text>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable style={[animatedStyle, style]} onPress={handlePress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <LinearGradient colors={['#8B5CF6', '#EC4899']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={buttonStyles.primaryButton}>
        <Text style={buttonStyles.primaryText}>{title}</Text>
      </LinearGradient>
    </AnimatedPressable>
  );
}

const buttonStyles = StyleSheet.create({
  primaryButton: {
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 30,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  secondaryText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
    color: '#8B5CF6',
    textAlign: 'center',
  },
  ghostButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  ghostText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});

// ============ PROGRESS BAR COMPONENT ============
function ProgressBar({ current, total }) {
  const progress = current / total;

  const animatedStyle = useAnimatedStyle(() => ({
    width: withTiming(`${progress * 100}%`, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    }),
  }));

  return (
    <View style={progressStyles.container}>
      <View style={progressStyles.barContainer}>
        <Animated.View style={[progressStyles.fill, animatedStyle]} />
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
  barContainer: {
    flex: 1,
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 6,
  },
  text: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    color: '#374151',
    minWidth: 45,
    textAlign: 'right',
  },
});

// ============ ANSWER BUTTON COMPONENT ============
function AnswerButton({ text, onPress, disabled = false, state = 'default' }) {
  const scale = useSharedValue(1);
  const shakeX = useSharedValue(0);

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withTiming(0.97, { duration: 100 });
      triggerHaptic();
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      scale.value = withTiming(1, { duration: 100 });
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateX: shakeX.value }],
  }));

  const getBackgroundColor = () => {
    switch (state) {
      case 'correct':
      case 'revealed':
        return '#84CC16';
      case 'wrong':
        return '#FF4B4B';
      default:
        return '#FFFFFF';
    }
  };

  const getTextColor = () => {
    switch (state) {
      case 'correct':
      case 'wrong':
      case 'revealed':
        return '#FFFFFF';
      default:
        return '#374151';
    }
  };

  useEffect(() => {
    if (state === 'wrong') {
      shakeX.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    }
  }, [state]);

  return (
    <AnimatedPressable
      style={[answerStyles.button, animatedStyle, { backgroundColor: getBackgroundColor() }, disabled && answerStyles.disabled]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
    >
      <Text style={[answerStyles.text, { color: getTextColor() }]}>{text}</Text>
    </AnimatedPressable>
  );
}

const answerStyles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.7,
  },
});

// ============ CONFETTI COMPONENT ============
const COLORS = ['#8B5CF6', '#EC4899', '#84CC16', '#FFD700', '#4ECDC4', '#FF6B6B'];

function ConfettiPiece({ index }) {
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(Math.random() * width);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  const color = COLORS[index % COLORS.length];
  const size = 8 + Math.random() * 8;
  const delay = index * 30;
  const duration = 1500 + Math.random() * 500;

  useEffect(() => {
    translateY.value = withDelay(delay, withTiming(height + 50, { duration, easing: Easing.out(Easing.quad) }));
    translateX.value = withDelay(delay, withTiming(translateX.value + (Math.random() - 0.5) * 100, { duration, easing: Easing.inOut(Easing.ease) }));
    rotate.value = withDelay(delay, withTiming(360 * (2 + Math.random() * 2), { duration, easing: Easing.linear }));
    opacity.value = withDelay(delay + duration * 0.7, withTiming(0, { duration: duration * 0.3 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { translateX: translateX.value }, { rotate: `${rotate.value}deg` }],
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
          borderRadius: Math.random() > 0.5 ? size / 2 : 2,
        },
      ]}
    />
  );
}

function Confetti({ count = 30 }) {
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
      <View style={homeStyles.content}>
        <View style={homeStyles.mascotContainer}>
          <SkullMascot expression="neutral" size={150} animate />
        </View>

        <Text style={homeStyles.title}>How Gen Z Are You?</Text>
        <Text style={homeStyles.subtitle}>10 questions. No cap.</Text>

        <View style={homeStyles.buttonContainer}>
          <Button title="Start Quiz" onPress={onStartQuiz} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  mascotContainer: {
    marginBottom: 40,
  },
  title: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 32,
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 48,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
});

// ============ QUIZ SCREEN ============
function QuizScreen({ onComplete }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = () => {
    setLoading(true);
    const fetchedQuestions = getRandomQuestions(10);
    setQuestions(fetchedQuestions);
    setupQuestion(fetchedQuestions[0]);
    setLoading(false);
  };

  const setupQuestion = (question) => {
    const shuffled = shuffleAnswers(question);
    setAnswers(shuffled.map((text) => ({ text, state: 'default' })));
    setAnswered(false);
    setIsCorrect(false);
    setShowConfetti(false);
  };

  const handleAnswer = useCallback(
    (selectedIndex) => {
      if (answered || questions.length === 0) return;

      const currentQuestion = questions[currentIndex];
      const selectedAnswer = answers[selectedIndex].text;
      const correct = selectedAnswer === currentQuestion.correct_answer;

      setIsCorrect(correct);
      setAnswered(true);

      setAnswers((prev) =>
        prev.map((answer, i) => {
          if (answer.text === currentQuestion.correct_answer) {
            return { ...answer, state: correct ? 'correct' : 'revealed' };
          }
          if (i === selectedIndex && !correct) {
            return { ...answer, state: 'wrong' };
          }
          return answer;
        })
      );

      if (correct) {
        setScore((prev) => prev + 1);
        setShowConfetti(true);
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      } else {
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
      }

      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          const nextIndex = currentIndex + 1;
          setCurrentIndex(nextIndex);
          setupQuestion(questions[nextIndex]);
        } else {
          onComplete(correct ? score + 1 : score, questions.length);
        }
      }, 1500);
    },
    [answered, answers, currentIndex, questions, score, onComplete]
  );

  if (loading) {
    return (
      <SafeAreaView style={quizStyles.container}>
        <View style={quizStyles.loadingContainer}>
          <SkullMascot expression="neutral" size={100} animate />
          <Text style={quizStyles.loadingText}>Loading questions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (questions.length === 0) {
    return (
      <SafeAreaView style={quizStyles.container}>
        <View style={quizStyles.loadingContainer}>
          <SkullMascot expression="cringe" size={100} />
          <Text style={quizStyles.loadingText}>Failed to load questions</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <SafeAreaView style={quizStyles.container}>
      <View style={quizStyles.header}>
        <ProgressBar current={currentIndex + 1} total={questions.length} />
      </View>

      {showConfetti && <Confetti count={40} />}

      {answered && (
        <Animated.View
          style={[quizStyles.feedbackOverlay, { backgroundColor: isCorrect ? 'rgba(132, 204, 22, 0.1)' : 'rgba(255, 75, 75, 0.1)' }]}
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
        >
          {!isCorrect && <Text style={quizStyles.cringeText}>CRINGE</Text>}
        </Animated.View>
      )}

      <Animated.View key={currentIndex} style={quizStyles.questionContainer} entering={SlideInRight.duration(300)} exiting={SlideOutLeft.duration(200)}>
        <Text style={quizStyles.question}>{currentQuestion.question_text}</Text>

        <View style={quizStyles.answersContainer}>
          {answers.map((answer, index) => (
            <AnswerButton key={`${currentIndex}-${index}`} text={answer.text} state={answer.state} onPress={() => handleAnswer(index)} disabled={answered} />
          ))}
        </View>
      </Animated.View>

      <View style={quizStyles.cornerSkull}>
        <SkullMascot expression={answered ? (isCorrect ? 'happy' : 'cringe') : 'neutral'} size={60} />
      </View>
    </SafeAreaView>
  );
}

const quizStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  header: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
  },
  questionContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  question: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 24,
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 32,
  },
  answersContainer: {
    gap: 12,
  },
  feedbackOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    pointerEvents: 'none',
  },
  cringeText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 48,
    color: '#FF4B4B',
    opacity: 0.8,
    transform: [{ rotate: '-15deg' }],
  },
  cornerSkull: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    opacity: 0.9,
  },
});

// ============ RESULTS SCREEN ============
function ResultsScreen({ score, total, onPlayAgain, onGoHome }) {
  const percentage = getPercentage(score, total);
  const { tier, accessory, description } = getTier(score, total);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, []);

  return (
    <View style={resultsStyles.container}>
      <LinearGradient colors={['#8B5CF6', '#EC4899']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={resultsStyles.gradient}>
        <SafeAreaView style={resultsStyles.safeArea}>
          <View style={resultsStyles.content}>
            <Animated.View entering={FadeInDown.delay(200).duration(500)}>
              <SkullMascot expression={accessory} size={120} />
            </Animated.View>

            <Animated.Text style={resultsStyles.percentage} entering={FadeInUp.delay(400).duration(500)}>
              {percentage}%
            </Animated.Text>

            <Animated.View style={resultsStyles.tierBadge} entering={FadeInUp.delay(600).duration(500)}>
              <Text style={resultsStyles.tierText}>{tier}</Text>
            </Animated.View>

            <Animated.Text style={resultsStyles.description} entering={FadeInUp.delay(800).duration(500)}>
              {description}
            </Animated.Text>

            <Animated.View style={resultsStyles.buttonsContainer} entering={FadeInUp.delay(1000).duration(500)}>
              <Button title="Play Again" onPress={onPlayAgain} variant="secondary" style={resultsStyles.playAgainButton} />
              <Button title="Home" onPress={onGoHome} variant="ghost" />
            </Animated.View>
          </View>
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  percentage: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 80,
    color: '#FFFFFF',
    marginTop: 24,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tierBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 16,
  },
  tierText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 24,
    color: '#FFFFFF',
  },
  description: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
  },
  buttonsContainer: {
    marginTop: 48,
    alignItems: 'center',
    gap: 16,
  },
  playAgainButton: {
    minWidth: 200,
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
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FAF9F6', justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
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
      <StatusBar style="dark" />
      {screen === 'home' && <HomeScreen onStartQuiz={handleStartQuiz} />}
      {screen === 'quiz' && <QuizScreen onComplete={handleQuizComplete} />}
      {screen === 'results' && <ResultsScreen score={quizScore} total={quizTotal} onPlayAgain={handlePlayAgain} onGoHome={handleGoHome} />}
    </SafeAreaProvider>
  );
}
