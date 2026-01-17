import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ljquuywajchhlpjpptxh.supabase.co';
const supabaseAnonKey = 'sb_publishable_TT8E-1fjMOWQxFi8jmlsdw_jSPD9Wgx';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface Word {
  id: number;
  term: string;
  definition: string;
  example: string;
  created_at: string;
}

export interface Question {
  id: number;
  word_id: number;
  question_text: string;
  correct_answer: string;
  wrong_answers: string[];
  created_at: string;
  words?: Word;
}

export interface Score {
  id: number;
  device_id: string;
  score: number;
  tier: string;
  created_at: string;
}
