
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Award, TrendingUp, Target, Zap } from 'lucide-react';
import { UserProfile } from '../types';

const weightData = [
  { day: 'Mon', weight: 74.5 },
  { day: 'Tue', weight: 74.2 },
  { day: 'Wed', weight: 74.3 },
  { day: 'Thu', weight: 73.8 },
  { day: 'Fri', weight: 73.5 },
  { day: 'Sat', weight: 73.2 },
  { day: 'Sun', weight: 73.0 },
];

interface ProgressProps {
  profile: UserProfile;
}

const Progress: React.FC<ProgressProps> = ({ profile }) => {
  // Calculate Monthly KCAL Burnt
  const monthlyKcal = useMemo(() => {
    if (!profile.sessionHistory) return 0;
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return profile.sessionHistory.reduce((total, session) => {
      const sessionDate = new Date(session.date);
      if (sessionDate.getMonth() === currentMonth && sessionDate.getFullYear() === currentYear) {
        return total + session.calories;
      }
      return total;
    }, 0);
  }, [profile.sessionHistory]);

  // Dynamic Rank based on workout count
  const rankInfo = useMemo(() => {
    const count = profile.completionHistory?.length || 0;
    if (count > 20) return { name: 'Platinum', color: 'text-blue-400', bg: 'bg-blue-500/20' };
    if (count > 10) return { name: 'Gold', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    if (count > 5) return { name: 'Silver', color: 'text-gray-300', bg: 'bg-gray-500/20' };
    return { name: 'Bronze', color: 'text-orange-400', bg: 'bg-orange-500/20' };
  }, [profile.completionHistory]);

  return (
    <div className="px-6 pt-12 pb-32 space-y-8 bg-gradient-aura min-h-screen">
      <header>
        <h1 className="text-3xl font-extrabold text-white">Journey Analytics</h1>
        <p className="text-white/40 text-sm">Real-time physiological progress</p>
      </header>

      {/* Main Graph Card */}
      <section className="glass rounded-[32px] p-6 h-80 relative overflow-hidden">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold">Weight Tracker</h3>
            <p className="text-white/30 text-xs">Past 7 days</p>
          </div>
          <div className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <TrendingUp size={12} /> -1.5kg
          </div>
        </div>
        
        <div className="w-full h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weightData}>
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="weight" stroke="#a855f7" fillOpacity={1} fill="url(#colorWeight)" strokeWidth={3} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 12}} />
              <Tooltip 
                contentStyle={{backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px'}}
                itemStyle={{color: '#fff'}}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass rounded-[28px] p-5 space-y-2">
          <div className={`w-10 h-10 ${rankInfo.bg} rounded-xl flex items-center justify-center ${rankInfo.color}`}>
            <Award size={20} />
          </div>
          <h4 className="text-2xl font-bold">{rankInfo.name}</h4>
          <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Rank Level</p>
        </div>
        <div className="glass rounded-[28px] p-5 space-y-2 border border-pink-500/10">
          <div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center text-pink-400">
            <Zap size={20} />
          </div>
          <h4 className="text-2xl font-bold">{monthlyKcal.toLocaleString()}</h4>
          <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Monthly KCAL Burnt</p>
        </div>
      </div>

      {/* Badges / Milestones */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg px-2">Milestones</h3>
          <span className="text-purple-400 text-xs font-bold uppercase tracking-widest">View All</span>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
          {[
            { id: 1, label: 'Early Riser' },
            { id: 2, label: 'Kcal Crusher' },
            { id: 3, label: 'Streak King' },
            { id: 4, label: 'Heavy Lifter' }
          ].map(m => (
            <div key={m.id} className="min-w-[110px] aspect-square glass rounded-[24px] flex flex-col items-center justify-center gap-2 group active:scale-95 transition-all border border-white/5">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400/20 to-orange-500/20 border border-yellow-500/30 flex items-center justify-center text-yellow-500 group-hover:scale-110 transition-transform shadow-lg shadow-yellow-500/10">
                <Target size={24} />
              </div>
              <span className="text-[10px] font-bold text-white/50 text-center uppercase tracking-widest px-2">{m.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Plateau Alert (AI Insight) */}
      <section className="glass rounded-[28px] p-6 border border-pink-500/20 bg-pink-500/5 relative overflow-hidden group">
        <div className="flex items-center gap-3 mb-2 relative z-10">
          <div className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
          <h4 className="text-pink-400 font-bold text-xs uppercase tracking-widest">Aura Performance Alert</h4>
        </div>
        <p className="text-white/70 text-sm relative z-10 leading-relaxed">
          {monthlyKcal > 5000 
            ? "Your high-intensity output this month is exceptional. Consider a deload week starting Monday to prevent central nervous system fatigue." 
            : "Your metabolic momentum is building. Completing 2 more sessions this week will trigger a new baseline for fat oxidation."}
        </p>
        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-pink-500/5 rounded-full blur-2xl group-hover:bg-pink-500/10 transition-all" />
      </section>
    </div>
  );
};

export default Progress;
