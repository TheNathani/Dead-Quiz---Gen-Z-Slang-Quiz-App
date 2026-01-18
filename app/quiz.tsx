import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';

import {
  SkullMascot,
  ProgressBar,
  AnswerButton,
  Confetti,
  DefinitionCard,
} from '../components';
import { Question, getRandomQuestions, shuffleAnswers } from '../lib/questions';

// Conditionally import ads for native only
let loadInterstitialAd: () => void = () => {};
let showInterstitialAd: () => Promise<boolean> = async () => false;

if (Platform.OS !== 'web') {
  try {
    const ads = require('../lib/ads');
    loadInterstitialAd = ads.loadInterstitialAd;
    showInterstitialAd = ads.showInterstitialAd;
  } catch (e) {
    console.log('Ads not available');
  }
}

type AnswerState = 'default' | 'correct' | 'wrong' | 'revealed';

interface AnswerOption {
  text: string;
  state: AnswerState;
}

export default function QuizScreen() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerOption[]>([]);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDefinition, setShowDefinition] = useState(false);

  // Use ref to track score to avoid stale closure issues
  const scoreRef = useRef(0);
  const [displayScore, setDisplayScore] = useState(0);

  // Load questions and interstitial ad on mount
  useEffect(() => {
    loadQuestions();
    // Preload interstitial ad for showing after quiz
    loadInterstitialAd();
  }, []);

  const loadQuestions = () => {
    setLoading(true);
    try {
      const fetchedQuestions = getRandomQuestions(10);
      setQuestions(fetchedQuestions);
      if (fetchedQuestions.length > 0) {
        setupQuestion(fetchedQuestions[0]);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
    }
    setLoading(false);
  };

  const setupQuestion = (question: Question) => {
    const shuffled = shuffleAnswers(question);
    setAnswers(shuffled.map((text) => ({ text, state: 'default' })));
    setAnswered(false);
    setIsCorrect(false);
    setShowConfetti(false);
    setShowDefinition(false);
  };

  const handleAnswer = useCallback(
    (selectedIndex: number) => {
      if (answered || questions.length === 0) return;

      const currentQuestion = questions[currentIndex];
      const selectedAnswer = answers[selectedIndex].text;
      const correct = selectedAnswer === currentQuestion.correct;

      setIsCorrect(correct);
      setAnswered(true);

      // Update answer states
      setAnswers((prev) =>
        prev.map((answer, i) => {
          if (answer.text === currentQuestion.correct) {
            return { ...answer, state: correct ? 'correct' : 'revealed' };
          }
          if (i === selectedIndex && !correct) {
            return { ...answer, state: 'wrong' };
          }
          return answer;
        })
      );

      if (correct) {
        // Update score using ref to avoid stale closure
        scoreRef.current += 1;
        setDisplayScore(scoreRef.current);
        setShowConfetti(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }

      // Show definition card after a short delay
      setTimeout(() => {
        setShowDefinition(true);
      }, 500);

      // Auto-advance after showing definition
      setTimeout(async () => {
        if (currentIndex < questions.length - 1) {
          const nextIndex = currentIndex + 1;
          setCurrentIndex(nextIndex);
          setupQuestion(questions[nextIndex]);
        } else {
          // Quiz complete - show interstitial ad before results
          try {
            await showInterstitialAd();
          } catch (e) {
            console.log('Could not show interstitial ad');
          }

          // Navigate to results using ref for accurate score
          router.replace({
            pathname: '/results',
            params: {
              score: scoreRef.current.toString(),
              total: questions.length.toString(),
            },
          });
        }
      }, 3000);
    },
    [answered, answers, currentIndex, questions]
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <SkullMascot expression="neutral" size={100} animate />
          <Text style={styles.loadingText}>Loading questions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (questions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <SkullMascot expression="cringe" size={100} />
          <Text style={styles.loadingText}>Failed to load questions</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.header}>
        <ProgressBar current={currentIndex + 1} total={questions.length} />
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{displayScore}/{currentIndex + (answered ? 1 : 0)}</Text>
        </View>
      </View>

      {/* Confetti on correct answer */}
      {showConfetti && <Confetti count={40} />}

      {/* Feedback overlay */}
      {answered && (
        <Animated.View
          style={[
            styles.feedbackOverlay,
            { backgroundColor: isCorrect ? 'rgba(132, 204, 22, 0.15)' : 'rgba(255, 75, 75, 0.15)' },
          ]}
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          pointerEvents="none"
        >
          {!isCorrect && (
            <Text style={styles.cringeText}>CRINGE</Text>
          )}
        </Animated.View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Question Card */}
        <Animated.View
          key={currentIndex}
          style={styles.questionCard}
          entering={SlideInRight.duration(300)}
          exiting={SlideOutLeft.duration(200)}
        >
          {/* Word Badge */}
          <View style={styles.wordBadge}>
            <Text style={styles.wordBadgeText}>{currentQuestion.word}</Text>
          </View>

          <Text style={styles.question}>{currentQuestion.question}</Text>

          <View style={styles.answersContainer}>
            {answers.map((answer, index) => (
              <AnswerButton
                key={`${currentIndex}-${index}`}
                text={answer.text}
                state={answer.state}
                onPress={() => handleAnswer(index)}
                disabled={answered}
              />
            ))}
          </View>
        </Animated.View>

        {/* Definition Card - shows after answering */}
        {showDefinition && (
          <DefinitionCard
            word={currentQuestion.word}
            parentTip={currentQuestion.parent_tip}
            cringeLevel={currentQuestion.cringe_level}
            isCorrect={isCorrect}
          />
        )}
      </ScrollView>

      {/* Skull mascot in corner */}
      <View style={styles.cornerSkull}>
        <SkullMascot
          expression={answered ? (isCorrect ? 'happy' : 'cringe') : 'neutral'}
          size={60}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  header: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scoreContainer: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#0F172A',
    // Neubrutalist shadow
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  scoreText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 14,
    color: '#FFFFFF',
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#0F172A',
    borderRadius: 16,
    padding: 20,
    // Neubrutalist shadow
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  wordBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EC4899',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#0F172A',
    marginBottom: 16,
    // Neubrutalist shadow
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  wordBadgeText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 14,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  question: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 22,
    color: '#0F172A',
    marginBottom: 24,
    lineHeight: 30,
  },
  answersContainer: {
    gap: 12,
  },
  feedbackOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  cringeText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 56,
    color: '#FF4B4B',
    opacity: 0.9,
    transform: [{ rotate: '-15deg' }],
    textShadowColor: '#0F172A',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
  },
  cornerSkull: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    opacity: 0.9,
  },
});
