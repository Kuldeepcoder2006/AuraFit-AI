
import React, { useState, useEffect } from 'react';
import { DailyWorkout } from '../types';
import { ChevronLeft, Clock, Zap, CheckCircle2, Play, Pause, RotateCcw } from 'lucide-react';

interface WorkoutDetailProps {
  workout: DailyWorkout;
  onBack: () => void;
  onComplete: (id: string) => void;
}

const WorkoutDetail: React.FC<WorkoutDetailProps> = ({ workout, onBack, onComplete }) => {
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());

  useEffect(() => {
    let interval: number;
    if (isTimerRunning && timerSeconds > 0) {
      interval = window.setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const toggleExercise = (index: number) => {
    const next = new Set(completedExercises);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setCompletedExercises(next);
  };

  const progress = (completedExercises.size / workout.exercises.length) * 100;

  return (
    <div className="fixed inset-0 z-[60] bg-[#050505] overflow-y-auto no-scrollbar flex flex-col">
      <div className="fixed top-0 left-0 right-0 h-64 bg-gradient-to-b from-purple-600/20 to-transparent pointer-events-none" />
      
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 p-6 flex items-center justify-between glass-dark">
        <button onClick={onBack} className="w-12 h-12 rounded-full glass flex items-center justify-center text-white">
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <h2 className="text-lg font-bold truncate max-w-[200px]">{workout.title}</h2>
          <p className="text-purple-400 text-xs font-bold uppercase tracking-widest">{Math.round(progress)}% Complete</p>
        </div>
        <div className="w-12 h-12" /> {/* Spacer */}
      </header>

      <div className="px-6 py-8 space-y-6 flex-1">
        {/* Stats Row */}
        <div className="flex gap-4">
          <div className="flex-1 glass rounded-3xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] text-white/30 font-bold uppercase">Time</p>
              <h4 className="font-bold">{workout.duration}</h4>
            </div>
          </div>
          <div className="flex-1 glass rounded-3xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center text-pink-400">
              <Zap size={20} />
            </div>
            <div>
              <p className="text-[10px] text-white/30 font-bold uppercase">Target</p>
              <h4 className="font-bold">{workout.calories} kcal</h4>
            </div>
          </div>
        </div>

        {/* Exercises List */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white/40 uppercase tracking-[2px] px-2">Circuit Sequence</h3>
          {workout.exercises.map((ex, i) => (
            <div 
              key={i} 
              onClick={() => toggleExercise(i)}
              className={`glass rounded-[28px] p-5 flex items-center justify-between border-l-4 transition-all duration-300 ${
                completedExercises.has(i) ? 'border-l-green-500 opacity-60' : 'border-l-purple-500'
              }`}
            >
              <div className="flex gap-4 items-center">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${
                  completedExercises.has(i) ? 'bg-green-500 text-white' : 'bg-white/5 text-white/40'
                }`}>
                  {completedExercises.has(i) ? <CheckCircle2 size={24} /> : i + 1}
                </div>
                <div>
                  <h4 className="font-bold text-lg">{ex.name}</h4>
                  <p className="text-white/40 text-sm">{ex.sets} Sets × {ex.reps} {ex.weight ? `(${ex.weight}kg)` : ''}</p>
                </div>
              </div>
              <button className="text-white/20">
                <RotateCcw size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Timer & Actions */}
      <div className="sticky bottom-0 p-6 glass-dark border-t border-white/5 space-y-4 pb-12">
        <div className="flex items-center justify-between glass rounded-[24px] p-4 bg-white/5">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12">
                <svg className="w-full h-full -rotate-90">
                    <circle cx="50%" cy="50%" r="45%" className="stroke-white/10 fill-none stroke-2" />
                    <circle 
                        cx="50%" cy="50%" r="45%" 
                        className="stroke-purple-500 fill-none stroke-2 transition-all duration-1000" 
                        strokeDasharray="100" 
                        strokeDashoffset={100 - (timerSeconds / 60) * 100}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold font-mono">
                    {timerSeconds}s
                </div>
            </div>
            <div>
              <p className="text-[10px] text-white/40 font-bold uppercase">Rest Timer</p>
              <p className="text-sm font-bold">Optimal Recovery</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
                onClick={() => setTimerSeconds(60)} 
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/60 active:scale-90 transition-all"
            >
                <RotateCcw size={18} />
            </button>
            <button 
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-white active:scale-90 transition-all ${isTimerRunning ? 'bg-pink-500' : 'bg-purple-600'}`}
            >
                {isTimerRunning ? <Pause size={18} /> : <Play size={18} />}
            </button>
          </div>
        </div>

        <button 
          onClick={() => onComplete(workout.id)}
          className="w-full h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-[24px] font-extrabold text-lg flex items-center justify-center gap-3 shadow-2xl neon-glow-purple active:scale-95 transition-all"
        >
          <CheckCircle2 size={24} /> Finish Session
        </button>
      </div>
    </div>
  );
};

export default WorkoutDetail;
