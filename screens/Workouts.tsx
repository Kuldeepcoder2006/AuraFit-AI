
import React, { useState, useRef, useEffect } from 'react';
import { DailyWorkout, UserProfile } from '../types';
import WorkoutCard from '../components/WorkoutCard';
import { Sparkles, Calendar, Search, Home as HomeIcon, Dumbbell, Send, X, Plus, Check } from 'lucide-react';
import { generateChatBasedWorkout } from '../services/geminiService';

interface WorkoutsProps {
  profile: UserProfile;
  workouts: DailyWorkout[];
  onSelectWorkout: (workout: DailyWorkout) => void;
  onSaveWorkouts: (workouts: DailyWorkout[]) => void;
  onDeleteWorkout: (id: string) => void;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

const Workouts: React.FC<WorkoutsProps> = ({ profile, workouts, onSelectWorkout, onSaveWorkouts, onDeleteWorkout, onUpdateProfile }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string; plan?: DailyWorkout[] }[]>([
    { role: 'bot', content: "Tell me what you need! For example: 'I want a 3-day split: Push, Pull, Legs using dumbbells.'" }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isGenerating) return;

    const userText = chatInput;
    setChatInput('');
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setIsGenerating(true);

    try {
      const plan = await generateChatBasedWorkout(userText, profile);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: `I've designed a ${plan.length}-day plan for you. Review it below:`,
        plan: plan 
      }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', content: "Sorry, I couldn't process that. Try being more specific about your equipment or split." }]);
    } finally {
      setIsGenerating(true); // Small delay feel
      setTimeout(() => setIsGenerating(false), 500);
    }
  };

  const handleSavePlan = (plan: DailyWorkout[]) => {
    const workoutsWithIds = plan.map(w => ({ ...w, id: Date.now() + Math.random().toString(), completed: false }));
    onSaveWorkouts(workoutsWithIds);
    setIsChatOpen(false);
    setMessages([{ role: 'bot', content: "Plan saved! Ready for another custom routine?" }]);
  };

  return (
    <div className="px-6 pt-12 pb-32 space-y-8 bg-gradient-aura min-h-screen relative">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Training Lab</h1>
          <p className="text-white/40 text-sm">Design your physical evolution</p>
        </div>
        <div className="glass p-3 rounded-2xl text-white/60">
          <Calendar size={20} />
        </div>
      </header>

      {/* Mode Switcher */}
      <section className="space-y-3">
        <div className="glass p-1.5 rounded-[24px] flex relative">
          <div 
            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-gradient-to-tr from-purple-500 to-indigo-600 rounded-[18px] transition-all duration-300 ease-out shadow-lg ${
              profile.workoutType === 'gym' ? 'translate-x-[100%]' : 'translate-x-0'
            }`}
          />
          <button 
            onClick={() => onUpdateProfile({ workoutType: 'home' })}
            className={`flex-1 py-3.5 flex items-center justify-center gap-2 z-10 font-bold transition-colors ${profile.workoutType === 'home' ? 'text-white' : 'text-white/40'}`}
          >
            <HomeIcon size={18} /> Home
          </button>
          <button 
            onClick={() => onUpdateProfile({ workoutType: 'gym' })}
            className={`flex-1 py-3.5 flex items-center justify-center gap-2 z-10 font-bold transition-colors ${profile.workoutType === 'gym' ? 'text-white' : 'text-white/40'}`}
          >
            <Dumbbell size={18} /> Gym
          </button>
        </div>
      </section>

      {/* Main AI Interaction Button */}
      {!isChatOpen && (
        <button 
          onClick={() => setIsChatOpen(true)}
          className="w-full h-20 rounded-[32px] bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-purple-500/30 flex items-center justify-between px-6 group active:scale-95 transition-all shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white neon-glow-purple">
              <Sparkles size={24} />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-lg">Smart AI Builder</h4>
              <p className="text-white/40 text-xs">Chat to generate custom plans</p>
            </div>
          </div>
          <Plus className="text-purple-400 group-hover:rotate-90 transition-transform" />
        </button>
      )}

      {/* AI Chat Builder Overlay */}
      {isChatOpen && (
        <div className="glass rounded-[32px] border-purple-500/30 h-[500px] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span className="font-bold text-sm text-purple-400 uppercase tracking-widest">Aura Builder</span>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-white/40 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-3xl ${
                  msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'glass text-white/90 rounded-tl-none border border-white/10'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
                
                {msg.plan && (
                  <div className="mt-3 w-full space-y-3">
                    <div className="grid grid-cols-1 gap-2">
                      {msg.plan.map((day, dIdx) => (
                        <div key={dIdx} className="glass p-3 rounded-2xl text-xs border-l-4 border-purple-500">
                          <span className="font-bold text-purple-400">Day {dIdx + 1}:</span> {day.title} ({day.duration})
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => handleSavePlan(msg.plan!)}
                      className="w-full py-3 bg-green-500/20 text-green-400 border border-green-500/30 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-green-500/30 transition-all"
                    >
                      <Check size={18} /> Save Day-wise Plan
                    </button>
                  </div>
                )}
              </div>
            ))}
            {isGenerating && (
              <div className="flex justify-start">
                <div className="glass p-4 rounded-3xl rounded-tl-none flex gap-2 animate-pulse">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white/5 flex gap-2">
            <input 
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="E.g. 4-day split, heavy legs..."
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-1 ring-purple-500 transition-all"
            />
            <button 
              onClick={handleSendMessage}
              disabled={isGenerating || !chatInput.trim()}
              className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white active:scale-90 transition-all disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Active Sessions List */}
      <section>
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="font-bold text-lg">Your Sessions</h3>
          <span className="text-purple-400 text-xs font-bold uppercase tracking-widest">See History</span>
        </div>
        <div className="space-y-4">
          {workouts.length > 0 ? (
            workouts.map(workout => (
              <WorkoutCard 
                key={workout.id} 
                workout={workout} 
                onClick={onSelectWorkout}
                onDelete={onDeleteWorkout} 
              />
            ))
          ) : (
            <div className="glass rounded-[32px] p-10 text-center border-dashed border-white/10">
              <p className="text-white/20 font-bold">No active sessions. Start the AI Builder to create your plan.</p>
            </div>
          )}
        </div>
      </section>

      {/* Static Trainer Tip */}
      <section className="glass rounded-[28px] p-6 bg-gradient-to-br from-indigo-900/20 to-transparent border border-white/5">
         <h4 className="text-white/40 text-xs font-bold uppercase tracking-wider mb-2">Trainer Tip</h4>
         <p className="text-white/80 text-sm italic">
           {profile.workoutType === 'home' 
             ? "Bodyweight training relies on tempo. Slower eccentrics (3 seconds down) will maximize muscle fiber recruitment."
             : "Consistency is your greatest tool. The AI adjusts to your pace, so keep checking in."}
         </p>
      </section>
    </div>
  );
};

export default Workouts;
