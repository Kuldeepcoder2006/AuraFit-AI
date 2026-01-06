
export enum AppTab {
  HOME = 'home',
  WORKOUTS = 'workouts',
  AI = 'ai',
  PROGRESS = 'progress',
  SETTINGS = 'settings'
}

export interface CompletedSession {
  date: string;
  calories: number;
  workoutId: string;
}

export interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string[];
}

export interface Meal {
  type: 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner';
  dish: string;
  recipe: Recipe;
}

export interface DietPlan {
  id: string;
  title: string;
  meals: Meal[];
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  dateGenerated: string;
}

export interface UserProfile {
  name: string;
  age: number;
  height: number;
  weight: number;
  gender: 'male' | 'female' | 'other';
  goal: 'fat_loss' | 'muscle_gain' | 'maintain';
  workoutType: 'home' | 'gym';
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  completionHistory: string[]; 
  sessionHistory?: CompletedSession[];
  savedDiets?: DietPlan[];
}

export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: string;
  weight?: number;
  notes?: string;
}

export interface DailyWorkout {
  id: string;
  title: string;
  duration: string;
  calories: number;
  exercises: WorkoutExercise[];
  completed: boolean;
}

export interface HabitStats {
  water: number; 
  sleep: number; 
  steps: number;
}
