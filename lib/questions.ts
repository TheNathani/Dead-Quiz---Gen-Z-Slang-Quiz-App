import questionsData from './questions.json';

// Question type matching our JSON structure
export interface Question {
  id: number;
  word: string;
  question: string;
  correct: string;
  wrong: string[];
  parent_tip: string;
  cringe_level: number;
}

// Fisher-Yates Shuffle - true randomization
function fisherYatesShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get random questions from the pool
export function getRandomQuestions(count: number = 10): Question[] {
  const shuffled = fisherYatesShuffle(questionsData as Question[]);
  return shuffled.slice(0, count);
}

// Shuffle answers for a question using Fisher-Yates
export function shuffleAnswers(question: Question): string[] {
  const allAnswers = [question.correct, ...question.wrong];
  return fisherYatesShuffle(allAnswers);
}

// All questions available for reference
export const allQuestions: Question[] = questionsData as Question[];
