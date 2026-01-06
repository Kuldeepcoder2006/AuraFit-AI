
import React from 'react';
import { DailyWorkout } from '../types';
import { Play, CheckCircle2, Clock, Zap, Trash2 } from 'lucide-react';

interface WorkoutCardProps {
  workout: DailyWorkout;
  onClick: (workout: DailyWorkout) => void;
  onDelete?: (id: string) => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onClick, onDelete }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete(workout.id);
  };

  return (
    <div 
      onClick={() => onClick(workout)}
      className="glass rounded-[24px] p-5 mb-4 active:scale-95 transition-all duration-300 relative overflow-hidden group border border-white/5"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">{workout.title}</h3>
          <div className="flex space-x-3 text-white/50 text-sm">
            <span className="flex items-center gap-1"><Clock size={14} /> {workout.duration}</span>
            <span className="flex items-center gap-1"><Zap size={14} /> {workout.calories} kcal</span>
          </div>
        </div>
        <div className="flex gap-2">
          {onDelete && (
            <button 
              onClick={handleDelete}
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all"
            >
              <Trash2 size={18} />
            </button>
          )}
          {workout.completed ? (
            <CheckCircle2 className="text-green-400 self-center" size={24} />
          ) : (
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
              <Play size={18} />
            </div>
          )}
        </div>
      </div>
      
      <div className="flex -space-x-2">
        {workout.exercises.slice(0, 3).map((ex, i) => (
          <div key={i} className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[10px] font-bold text-white/80">
            {ex.name.charAt(0)}
          </div>
        ))}
        {workout.exercises.length > 3 && (
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/20 flex items-center justify-center text-[10px] font-bold text-white/40">
            +{workout.exercises.length - 3}
          </div>
        )}
      </div>

      {/* Decorative gradient blob */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-purple-600/10 rounded-full blur-2xl group-hover:bg-purple-600/20 transition-all duration-500" />
    </div>
  );
};

export default WorkoutCard;
