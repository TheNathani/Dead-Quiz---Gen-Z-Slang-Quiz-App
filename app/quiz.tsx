import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
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
} from '../components';
import { Question } from '../lib/supabase';
import { getRandomQuestions, shuffleAnswers, fallbackQuestions, QuestionFetchError } from '../lib/questions';

const { width } = Dimensions.get('window');

type AnswerState = 'default' | 'correct' | 'wrong' | 'revealed';

interface AnswerOption {
  text: string;
  state: AnswerState;
}

export default function QuizScreen() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<AnswerOption[]>([]);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load questions on mount
  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const fetchedQuestions = await getRandomQuestions(10);
      if (fetchedQuestions.length > 0) {
        setQuestions(fetchedQuestions);
        setupQuestion(fetchedQuestions[0]);
      } else {
        // Use fallback questions - should not happen with new error handling
        console.warn('loadQuestions: Received empty questions array, using fallback');
        setQuestions(fallbackQuestions);
        setupQuestion(fallbackQuestions[0]);
      }
    } catch (error) {
      // Handle specific error types
      if (error instanceof QuestionFetchError) {
        console.error(`loadQuestions: ${error.code} - ${error.message}`);
        if (error.code === 'NETWORK_ERROR') {
          console.warn('loadQuestions: Network error, using offline fallback questions');
        } else if (error.code === 'NO_DATA') {
          console.warn('loadQuestions: No questions in database, using fallback questions');
        } else if (error.code === 'INVALID_FORMAT') {
          console.warn('loadQuestions: Invalid question format from server, using fallback questions');
        }
      } else {
        console.error('loadQuestions: Unexpected error:', error);
      }
      // Use fallback questions for any error
      setQuestions(fallbackQuestions);
      setupQuestion(fallbackQuestions[0]);
    }
    setLoading(false);
  };

  const setupQuestion = (question: Question) => {
    if (!question) {
      console.error('setupQuestion: Received null/undefined question');
      return;
    }

    const shuffled = shuffleAnswers(question);

    if (!shuffled || shuffled.length === 0) {
      console.error('setupQuestion: shuffleAnswers returned empty array for question:', question.id);
      // Create minimal answer set as fallback
      setAnswers([{ text: question.correct_answer || 'Error loading answers', state: 'default' }]);
    } else {
      setAnswers(shuffled.map((text) => ({ text, state: 'default' })));
    }

    setAnswered(false);
    setIsCorrect(false);
    setShowConfetti(false);
  };

  const handleAnswer = useCallback(
    (selectedIndex: number) => {
      if (answered || questions.length === 0) return;

      const currentQuestion = questions[currentIndex];
      const selectedAnswer = answers[selectedIndex].text;
      const correct = selectedAnswer === currentQuestion.correct_answer;

      setIsCorrect(correct);
      setAnswered(true);

      // Update answer states
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
        // Haptic feedback with error handling
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch((error) => {
          console.warn('handleAnswer: Haptic feedback (success) not available:', error);
        });
      } else {
        // Haptic feedback with error handling
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch((error) => {
          console.warn('handleAnswer: Haptic feedback (error) not available:', error);
        });
      }

      // Auto-advance after delay
      setTimeout(() => {
        try {
          if (currentIndex < questions.length - 1) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            setupQuestion(questions[nextIndex]);
          } else {
            // Quiz complete - navigate to results
            router.replace({
              pathname: '/results',
              params: {
                score: (correct ? score + 1 : score).toString(),
                total: questions.length.toString(),
              },
            });
          }
        } catch (error) {
          console.error('handleAnswer: Navigation error:', error);
        }
      }, 1500);
    },
    [answered, answers, currentIndex, questions, score]
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
      </View>

      {/* Confetti on correct answer */}
      {showConfetti && <Confetti count={40} />}

      {/* Feedback overlay */}
      {answered && (
        <Animated.View
          style={[
            styles.feedbackOverlay,
            { backgroundColor: isCorrect ? 'rgba(132, 204, 22, 0.1)' : 'rgba(255, 75, 75, 0.1)' },
          ]}
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
        >
          {!isCorrect && (
            <Text style={styles.cringeText}>CRINGE</Text>
          )}
        </Animated.View>
      )}

      {/* Question Card */}
      <Animated.View
        key={currentIndex}
        style={styles.questionContainer}
        entering={SlideInRight.duration(300)}
        exiting={SlideOutLeft.duration(200)}
      >
        <Text style={styles.question}>{currentQuestion.question_text}</Text>

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
