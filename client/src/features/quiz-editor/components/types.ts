// --- Interfaces para las opciones de respuesta ---
export interface Option {
  id: number;
  option_text: string;
  is_correct: boolean;
}

// Para una opción que aún no ha sido guardada en la BD
export interface NewOption {
  id?: undefined;
  option_text: string;
  is_correct: boolean;
}

// --- Interfaces para las preguntas ---
export interface Question {
  id: number;
  question_text: string;
  points: number;
  options: (Option | NewOption)[];
}

// Para una pregunta que aún no ha sido guardada en la BD
export interface NewQuestion {
  id?: undefined;
  question_text: string;
  points: number;
  options: (Option | NewOption)[];
}