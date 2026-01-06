
import React, { useMemo, useState, useEffect } from 'react';
import { UserProfile, HabitStats } from '../types';
import { Flame, Droplets, Footprints, ChevronRight, Sparkles as SparklesIcon, Calendar as CalendarIcon, X, ChevronLeft, Plus } from 'lucide-react';

interface HomeProps {
  profile: UserProfile;
  stats: HabitStats;
  onUpdateStats: (updates: Partial<HabitStats>) => void;
}

const Home: React.FC<HomeProps> = ({ profile, stats, onUpdateStats }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());

  // Constants for targets
  const WATER_TARGET = 8;
  const STEPS_TARGET = 10000;

  // Real-time Steps Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) { 
        onUpdateStats({ steps: stats.steps + Math.floor(Math.random() * 3) + 1 });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [stats.steps, onUpdateStats]);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Calculate Overall Daily Progress (Workout + Water + Steps)
  const dailyProgress = useMemo(() => {
    const workoutDone = profile.completionHistory?.includes(todayStr) ? 1 : 0;
    const waterScore = Math.min(stats.water / WATER_TARGET, 1);
    const stepsScore = Math.min(stats.steps / STEPS_TARGET, 1);
    
    // Average of the three components
    return ((workoutDone + waterScore + stepsScore) / 3);
  }, [profile.completionHistory, stats.water, stats.steps, todayStr]);

  // Calculate Current Streak
  const currentStreak = useMemo(() => {
    const history = profile.completionHistory || [];
    if (history.length === 0) return 0;
    
    const sortedDates = [...history].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    let streak = 0;
    let checkDate = new Date();
    
    const ts = checkDate.toISOString().split('T')[0];
    checkDate.setDate(checkDate.getDate() - 1);
    const ys = checkDate.toISOString().split('T')[0];
    
    if (!history.includes(ts) && !history.includes(ys)) return 0;

    let targetDate = new Date(history.includes(ts) ? ts : ys);
    
    for (let i = 0; i < 365; i++) {
      const dateStr = targetDate.toISOString().split('T')[0];
      if (history.includes(dateStr)) {
        streak++;
        targetDate.setDate(targetDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }, [profile.completionHistory]);

  // Calendar Helper Logic
  const monthData = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const dateObj = new Date(year, month, i);
      const dateStr = dateObj.toISOString().split('T')[0];
      days.push({
        day: i,
        date: dateStr,
        active: profile.completionHistory?.includes(dateStr) || false,
        isToday: dateStr === todayStr
      });
    }
    return days;
  }, [viewDate, profile.completionHistory, todayStr]);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  const isCurrentMonth = viewDate.getMonth() === new Date().getMonth() && viewDate.getFullYear() === new Date().getFullYear();

  const handleAddWater = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateStats({ water: Math.min(stats.water + 1, 15) });
  };

  const handleManualSteps = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateStats({ steps: stats.steps + 500 });
  };

  return (
    <div className="px-6 pt-12 pb-32 space-y-8 bg-gradient-aura min-h-screen">
      <header className="flex justify-between items-center">
        <div>
          <h4 className="text-white/50 text-sm font-medium">Welcome back,</h4>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">{profile.name}</h1>
        </div>
        <div className="w-12 h-12 rounded-full border-2 border-purple-500/50 p-1">
          <img src={`https://picsum.photos/seed/${profile.name}/100/100`} className="w-full h-full rounded-full object-cover" alt="profile" />
        </div>
      </header>

      {/* Dynamic Streak Badge */}
      <section 
        onClick={() => setShowCalendar(true)}
        className="glass rounded-[32px] p-6 relative overflow-hidden border border-white/5 shadow-2xl active:scale-95 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center text-orange-500 neon-glow-purple group-hover:scale-110 transition-transform">
              <Flame size={28} fill="currentColor" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-black">{currentStreak} Day Streak</h3>
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              </div>
              <p className="text-white/30 text-[10px] uppercase tracking-[2px] font-bold">Tap to view Monthly Grid</p>
            </div>
          </div>
          <div className="w-10 h-10 glass rounded-full flex items-center justify-center text-white/40">
             <CalendarIcon size={18} />
          </div>
        </div>
      </section>

      {/* Calendar Overlay */}
      {showCalendar && (
        <div className="fixed inset-0 z-[100] bg-[#050505]/98 backdrop-blur-2xl animate-in fade-in slide-in-from-bottom duration-300 flex flex-col p-6 overflow-y-auto no-scrollbar">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400">
                  <CalendarIcon size={20} />
               </div>
               <div>
                 <h2 className="text-xl font-black text-white">Evolution Calendar</h2>
                 <p className="text-white/40 text-[10px] uppercase tracking-widest font-black">History & Persistence</p>
               </div>
            </div>
            <button onClick={() => { setShowCalendar(false); setViewDate(new Date()); }} className="w-12 h-12 glass rounded-full flex items-center justify-center text-white/60">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 space-y-6">
            <div className="glass rounded-[32px] p-6 flex items-center justify-between border-l-4 border-orange-500 bg-orange-500/5">
                <div className="flex items-center gap-4">
                  <Flame size={32} className="text-orange-500" fill="currentColor" />
                  <div>
                    <h3 className="text-2xl font-black">{currentStreak} Days</h3>
                    <p className="text-white/40 font-bold uppercase tracking-widest text-[9px]">Consistency Streak</p>
                  </div>
                </div>
            </div>

            <div className="glass rounded-[32px] p-6 space-y-6">
               <div className="flex justify-between items-center mb-2 px-2">
                  <button onClick={handlePrevMonth} className="p-2 glass rounded-xl text-white/40 hover:text-white"><ChevronLeft size={18} /></button>
                  <div className="text-center">
                    <h4 className="text-lg font-black text-white">{monthNames[viewDate.getMonth()]}</h4>
                    <p className="text-[10px] text-white/30 uppercase tracking-[2px] font-bold">{viewDate.getFullYear()}</p>
                  </div>
                  <button onClick={handleNextMonth} disabled={isCurrentMonth} className={`p-2 glass rounded-xl ${isCurrentMonth ? 'opacity-0' : 'text-white/40'}`}><ChevronRight size={18} /></button>
               </div>

               <div className="grid grid-cols-7 gap-2 text-center">
                 {weekDays.map(day => (<span key={day} className="text-[10px] font-black text-white/20 uppercase">{day}</span>))}
               </div>
               
               <div className="grid grid-cols-7 gap-3">
                  {monthData.map((day, idx) => {
                    if (!day) return <div key={`empty-${idx}`} className="aspect-square" />;
                    return (
                      <div key={day.date} className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all ${day.active ? 'bg-purple-600 shadow-[0_0_12px_rgba(168,85,247,0.5)] border border-purple-400/50' : 'bg-white/5'} ${day.isToday ? 'ring-2 ring-orange-500/50' : ''}`}>
                        <span className={`text-xs font-bold ${day.active ? 'text-white' : 'text-white/40'}`}>{day.day}</span>
                        {day.active && <div className="w-1 h-1 bg-white rounded-full mt-1" />}
                      </div>
                    );
                  })}
               </div>
            </div>
          </div>
          <button onClick={() => { setShowCalendar(false); setViewDate(new Date()); }} className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-xs text-white/60 mt-8">Dismiss Analytics</button>
        </div>
      )}

      {/* Rings & Interactive Stats Section */}
      <section className="grid grid-cols-2 gap-4">
        <div className="glass rounded-[32px] p-5 flex flex-col items-center justify-center aspect-square relative group">
          <svg className="w-full h-full -rotate-90">
            <circle cx="50%" cy="50%" r="40%" className="stroke-white/5 fill-none stroke-[10]" />
            <circle 
              cx="50%" cy="50%" r="40%" 
              className="stroke-purple-500 fill-none stroke-[10] group-hover:stroke-purple-400 transition-all duration-500" 
              strokeDasharray="251.2" 
              strokeDashoffset={251.2 * (1 - dailyProgress)} 
              strokeLinecap="round" 
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Flame className={`mb-1 transition-colors duration-500 ${dailyProgress >= 1 ? 'text-orange-500 scale-125' : 'text-purple-500'}`} size={24} />
            <span className="text-2xl font-black">{Math.round(dailyProgress * 100)}%</span>
            <span className="text-white/40 text-[10px] uppercase tracking-widest font-black">Today</span>
          </div>
        </div>

        <div className="grid grid-rows-2 gap-4">
          {/* Water Tracker Card */}
          <div 
            onClick={handleAddWater}
            className="glass rounded-[28px] p-4 flex items-center justify-between group active:scale-95 transition-all cursor-pointer border border-white/5 hover:border-blue-500/30"
          >
             <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${stats.water >= WATER_TARGET ? 'bg-blue-500 text-white shadow-lg' : 'bg-blue-500/20 text-blue-400'}`}>
                  <Droplets size={20} fill={stats.water > 0 ? "currentColor" : "none"} />
                </div>
                <div>
                  <h4 className="text-lg font-bold">{stats.water} <span className="text-white/30 text-xs font-medium">/ {WATER_TARGET}</span></h4>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Glasses</p>
                </div>
             </div>
             <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-blue-500 group-hover:text-white transition-all">
               <Plus size={16} />
             </div>
          </div>

          {/* Steps Tracker Card */}
          <div 
            onClick={handleManualSteps}
            className="glass rounded-[28px] p-4 flex items-center justify-between group active:scale-95 transition-all cursor-pointer border border-white/5 hover:border-pink-500/30"
          >
             <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${stats.steps >= STEPS_TARGET ? 'bg-pink-500 text-white shadow-lg' : 'bg-pink-500/20 text-pink-400'}`}>
                  <Footprints size={20} />
                </div>
                <div>
                  <h4 className="text-lg font-bold">{stats.steps >= 1000 ? (stats.steps / 1000).toFixed(1) + 'k' : stats.steps}</h4>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Today's Steps</p>
                </div>
             </div>
             <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-pink-500 group-hover:text-white transition-all">
               <Plus size={16} />
             </div>
          </div>
        </div>
      </section>

      {/* AI Insight */}
      <section className="glass rounded-[32px] p-6 border-l-4 border-l-indigo-500 relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-indigo-500/20 rounded-full flex items-center justify-center">
              <SparklesIcon size={14} className="text-indigo-400" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Evolution Analytics</h4>
          </div>
          <p className="text-white/80 text-sm leading-relaxed">
            {dailyProgress >= 1 
              ? "Ultimate Daily Goal Achieved! Your biological optimization is at peak capacity. Rest and recover well." 
              : `You're ${Math.round(dailyProgress * 100)}% through today's evolution. ${!profile.completionHistory?.includes(todayStr) ? 'Complete your workout session' : (stats.water < WATER_TARGET ? 'Hydrate more' : 'Hit your step goal')} to reach 100%.`}
          </p>
        </div>
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      </section>
    </div>
  );
};

export default Home;
