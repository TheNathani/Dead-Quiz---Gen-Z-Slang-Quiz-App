import { supabase, Question } from './supabase';

export async function getRandomQuestions(count: number = 10): Promise<Question[]> {
  const { data, error } = await supabase
    .from('questions')
    .select('*, words(*)')
    .limit(count * 2); // Fetch more to allow for randomization

  if (error) {
    console.error('Error fetching questions:', error);
    return [];
  }

  // Shuffle and return the requested count
  const shuffled = (data || []).sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function shuffleAnswers(question: Question): string[] {
  const allAnswers = [question.correct_answer, ...question.wrong_answers];
  return allAnswers.sort(() => Math.random() - 0.5);
}

// Fallback questions if Supabase fails
export const fallbackQuestions: Question[] = [
  {
    id: 1,
    word_id: 1,
    question_text: 'What does "rizz" mean?',
    correct_answer: 'Charisma or charm, especially romantic',
    wrong_answers: ['A type of rice dish', 'Being extremely tired', 'A dance move'],
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    word_id: 2,
    question_text: 'What does "no cap" mean?',
    correct_answer: "I'm not lying / for real",
    wrong_answers: ['No hat required', 'Without a limit', 'Feeling down'],
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    word_id: 3,
    question_text: 'What does "slay" mean?',
    correct_answer: 'To do something exceptionally well',
    wrong_answers: ['To defeat an enemy', 'To sleep all day', 'To be lazy'],
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    word_id: 4,
    question_text: 'What does "bussin" mean?',
    correct_answer: 'Really good, especially food',
    wrong_answers: ['Taking the bus', 'Being busy', 'Breaking something'],
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    word_id: 5,
    question_text: 'What does "bet" mean as a response?',
    correct_answer: 'Okay / agreement / sounds good',
    wrong_answers: ['Making a wager', "I don't believe you", 'Maybe'],
    created_at: new Date().toISOString(),
  },
  {
    id: 6,
    word_id: 6,
    question_text: 'What does "lowkey" mean?',
    correct_answer: 'Secretly or somewhat',
    wrong_answers: ['A musical term', 'Being sad', 'Speaking quietly'],
    created_at: new Date().toISOString(),
  },
  {
    id: 7,
    word_id: 7,
    question_text: 'What does "highkey" mean?',
    correct_answer: 'Openly or very much',
    wrong_answers: ['A musical note', 'Being happy', 'Shouting'],
    created_at: new Date().toISOString(),
  },
  {
    id: 8,
    word_id: 8,
    question_text: 'What does "stan" mean?',
    correct_answer: 'An extremely devoted fan',
    wrong_answers: ["A person's name", 'To stand up', 'Standard'],
    created_at: new Date().toISOString(),
  },
  {
    id: 9,
    word_id: 9,
    question_text: 'What does "sus" mean?',
    correct_answer: 'Suspicious or shady',
    wrong_answers: ['Sustainable', 'A type of sushi', 'Sister'],
    created_at: new Date().toISOString(),
  },
  {
    id: 10,
    word_id: 10,
    question_text: 'What does "vibe check" mean?',
    correct_answer: "Assessing someone's mood or energy",
    wrong_answers: ['Checking vibrations', 'A sound test', 'Measuring temperature'],
    created_at: new Date().toISOString(),
  },
];
