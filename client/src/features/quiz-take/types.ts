export interface Option {
  id: number;
  option_text: string;
}

export interface Question {
  id: number;
  question_text: string;
  points: number;
  options: Option[];
}

export interface Answer {
  question_id: number;
  selected_option_id: number;
}