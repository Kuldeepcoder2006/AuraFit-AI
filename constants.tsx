
import React from 'react';
import { UserProfile, DailyWorkout } from './types';

export const COLORS = {
  primary: '#a855f7', // Purple
  secondary: '#3b82f6', // Blue
  accent: '#ec4899', // Pink
  background: '#050505',
  card: 'rgba(255, 255, 255, 0.03)',
};

export const INITIAL_PROFILE: UserProfile = {
  name: 'Alex Rivera',
  age: 28,
  height: 175,
  weight: 72,
  gender: 'male',
  goal: 'muscle_gain',
  workoutType: 'gym',
  experienceLevel: 'intermediate',
  completionHistory: [],
};

export const INITIAL_WORKOUTS: DailyWorkout[] = [
  {
    id: '1',
    title: 'Power Push Day',
    duration: '45 min',
    calories: 320,
    completed: false,
    exercises: [
      { name: 'Bench Press', sets: 4, reps: '8-10', weight: 60 },
      { name: 'Overhead Press', sets: 3, reps: '10-12', weight: 40 },
      { name: 'Lateral Raises', sets: 3, reps: '15', weight: 8 },
      { name: 'Tricep Pushdowns', sets: 3, reps: '12', weight: 20 },
    ]
  },
  {
    id: '2',
    title: 'HIIT Core Flow',
    duration: '25 min',
    calories: 210,
    completed: true,
    exercises: [
      { name: 'Mountain Climbers', sets: 3, reps: '45s' },
      { name: 'Plank Holds', sets: 3, reps: '60s' },
      { name: 'Russian Twists', sets: 3, reps: '20' },
    ]
  }
];

export const GRADIENTS = {
  primary: 'from-purple-500 via-indigo-500 to-blue-500',
  secondary: 'from-pink-500 to-rose-500',
  glass: 'bg-white/5 border border-white/10 backdrop-blur-md',
};
