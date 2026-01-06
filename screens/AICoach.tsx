
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, DietPlan, Meal } from '../types';
import { Send, Bot, ChefHat, Sparkles, Utensils, Zap, Coffee, ChevronDown, ChevronUp, Save, Bookmark, Trash2, Scale, Target, ShoppingBag, TrendingDown, ArrowDownRight } from 'lucide-react';
import { getCoachAdvice, generateDietPlan } from '../services/geminiService';

interface AICoachProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

const AICoach: React.FC<AICoachProps> = ({ profile, onUpdateProfile }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: `Hello ${profile.name}! I'm Aura, your personalized AI coach. How can I help you crush your fitness goals today?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'diet'>('chat');
  
  // Diet Inputs
  const [customWeight, setCustomWeight] = useState(profile.weight);
  const [goalWeight, setGoalWeight] = useState(profile.weight - 5); 
  const [goalType, setGoalType] = useState('Fat Cut');
  const [veg, setVeg] = useState(false);
  const [availableIngredients, setAvailableIngredients] = useState('');
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [expandedMeal, setExpandedMeal] = useState<number | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    try {
      const response = await getCoachAdvice(userMsg, profile);
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: "I'm having a bit of a workout fatigue. Let's try again in a moment!" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDiet = async () => {
    setLoading(true);
    try {
      const plan = await generateDietPlan(profile, customWeight, goalWeight, goalType, veg, availableIngredients);
      setDietPlan({ ...plan, id: Date.now().toString(), dateGenerated: new Date().toISOString() });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const saveDiet = () => {
    if (!dietPlan) return;
    const currentSaved = profile.savedDiets || [];
    if (currentSaved.find(d => d.id === dietPlan.id)) return;
    onUpdateProfile({ savedDiets: [dietPlan, ...currentSaved] });
  };

  const deleteSavedDiet = (id: string) => {
    const nextSaved = (profile.savedDiets || []).filter(d => d.id !== id);
    onUpdateProfile({ savedDiets: nextSaved });
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-aura">
      {/* Header Tabs */}
      <div className="px-6 pt-12 pb-4 flex gap-4">
        <button 
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'chat' ? 'bg-purple-500 text-white shadow-lg' : 'glass text-white/40'}`}
        >
          <Bot size={20} /> Coach
        </button>
        <button 
          onClick={() => setActiveTab('diet')}
          className={`flex-1 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'diet' ? 'bg-indigo-500 text-white shadow-lg' : 'glass text-white/40'}`}
        >
          <ChefHat size={20} /> Diet
        </button>
      </div>

      {activeTab === 'chat' ? (
        <div className="flex-1 flex flex-col overflow-hidden pb-32">
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 space-y-4 no-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-3xl ${m.role === 'user' ? 'bg-purple-600 text-white rounded-tr-none' : 'glass text-white/90 rounded-tl-none'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="glass p-4 rounded-3xl rounded-tl-none flex gap-2">
                  <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>
          
          <div className="px-6 py-4">
            <div className="glass h-16 rounded-[28px] flex items-center px-5 gap-3 group focus-within:ring-2 ring-purple-500/50 transition-all">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Aura anything..." 
                className="bg-transparent border-none outline-none text-white w-full placeholder:text-white/20"
              />
              <button 
                onClick={handleSend}
                disabled={loading}
                className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white active:scale-90 transition-all"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-6 pb-32 no-scrollbar space-y-6">
          <section className="glass rounded-[32px] p-6 space-y-6 relative overflow-hidden border border-white/5">
            <div className="flex flex-col items-center justify-center space-y-2 text-center">
              <div className="w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 neon-glow-blue animate-float relative">
                <ChefHat size={32} />
                <Sparkles size={16} className="absolute -top-1 -right-1 text-purple-400" />
              </div>
              <h2 className="text-2xl font-black tracking-tight">AI Diet Architect</h2>
              <p className="text-white/40 text-[10px] uppercase tracking-[3px] font-bold">Scientific Meal Planning</p>
            </div>
            
            <div className="space-y-4">
              {/* Weight & Goal Weight Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-white/30 tracking-widest px-1">Weight (kg)</label>
                  <div className="glass rounded-2xl h-14 flex items-center px-4 gap-2 border border-white/5">
                    <Scale size={18} className="text-white/20" />
                    <input 
                      type="number" 
                      value={customWeight} 
                      onChange={(e) => setCustomWeight(Number(e.target.value))}
                      className="bg-transparent w-full text-base font-bold outline-none text-white"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-white/30 tracking-widest px-1">Goal Weight (kg)</label>
                  <div className="glass rounded-2xl h-14 flex items-center px-4 gap-2 border border-white/5">
                    <ArrowDownRight size={18} className="text-indigo-400" />
                    <input 
                      type="number" 
                      value={goalWeight} 
                      onChange={(e) => setGoalWeight(Number(e.target.value))}
                      className="bg-transparent w-full text-base font-bold outline-none text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Goal Selection */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-white/30 tracking-widest px-1">Primary Objective</label>
                <div className="glass rounded-2xl h-14 flex items-center px-4 gap-2 border border-white/5 relative">
                  <Target size={18} className="text-white/20" />
                  <select 
                    value={goalType} 
                    onChange={(e) => setGoalType(e.target.value)}
                    className="bg-transparent w-full text-sm font-bold outline-none appearance-none pr-4 text-white"
                  >
                    <option className="bg-[#0f172a]" value="Fat Cut">Aggressive Fat Cut</option>
                    <option className="bg-[#0f172a]" value="Cut">Standard Cut</option>
                    <option className="bg-[#0f172a]" value="Bulk">Lean Bulk</option>
                    <option className="bg-[#0f172a]" value="Maintain">Maintenance</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-4 text-white/20 pointer-events-none" />
                </div>
              </div>

              {/* Veg / Non-Veg Toggle */}
              <div className="flex items-center gap-3 bg-white/5 p-1 rounded-2xl border border-white/5">
                <button onClick={() => setVeg(true)} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${veg ? 'bg-green-500 text-white shadow-lg' : 'text-white/40'}`}>Veg Only</button>
                <button onClick={() => setVeg(false)} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!veg ? 'bg-indigo-500 text-white shadow-lg' : 'text-white/40'}`}>Non-Veg</button>
              </div>

              {/* Ingredients (Optional) */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-end px-1">
                    <label className="text-[10px] font-black uppercase text-white/30 tracking-widest">Available at Home</label>
                    <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-tighter bg-indigo-500/10 px-1.5 rounded">Optional</span>
                </div>
                <div className="glass rounded-2xl p-4 gap-2 border border-white/5 group focus-within:border-indigo-500/30 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingBag size={14} className="text-white/20" />
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-tight">Budget staples suggested if blank</span>
                  </div>
                  <textarea 
                    value={availableIngredients}
                    onChange={(e) => setAvailableIngredients(e.target.value)}
                    placeholder="e.g. Daliya, Paneer, Milk, Eggs..."
                    className="bg-transparent w-full text-sm outline-none h-16 no-scrollbar resize-none placeholder:text-white/10 text-white"
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={handleGenerateDiet}
              disabled={loading}
              className="w-full h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[24px] font-black text-xs uppercase tracking-[3px] neon-glow-blue active:scale-95 disabled:opacity-50 transition-all shadow-xl"
            >
              {loading ? 'Analyzing Macro-Matrix...' : 'Architect Diet Plan'}
            </button>
          </section>

          {dietPlan && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-500">
              {/* Macros Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="glass p-5 rounded-[28px] text-center border-b-4 border-indigo-500 shadow-xl bg-indigo-500/5">
                   <div className="text-indigo-400 font-black text-2xl">{dietPlan.macros.protein}g</div>
                   <div className="text-[8px] uppercase text-white/30 font-black tracking-widest">Protein</div>
                </div>
                <div className="glass p-5 rounded-[28px] text-center border-b-4 border-purple-500 shadow-xl bg-purple-500/5">
                   <div className="text-purple-400 font-black text-2xl">{dietPlan.macros.carbs}g</div>
                   <div className="text-[8px] uppercase text-white/30 font-black tracking-widest">Carbs</div>
                </div>
                <div className="glass p-5 rounded-[28px] text-center border-b-4 border-pink-500 shadow-xl bg-pink-500/5">
                   <div className="text-pink-400 font-black text-2xl">{dietPlan.macros.fats}g</div>
                   <div className="text-[8px] uppercase text-white/30 font-black tracking-widest">Fats</div>
                </div>
              </div>

              {/* Meal Cards */}
              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                   <h3 className="font-black text-sm uppercase tracking-widest text-white/40">Daily Sequence</h3>
                   <button onClick={saveDiet} className="flex items-center gap-2 text-[10px] font-black uppercase text-indigo-400 hover:text-indigo-300 transition-colors">
                     <Save size={14} /> Save Plan
                   </button>
                </div>
                <div className="space-y-3">
                  {dietPlan.meals.map((meal, idx) => {
                    const isExpanded = expandedMeal === idx;
                    const Icon = meal.type === 'Breakfast' ? Coffee : meal.type === 'Snacks' ? Zap : Utensils;
                    const themeColor = meal.type === 'Breakfast' ? 'text-orange-400' : meal.type === 'Snacks' ? 'text-yellow-400' : 'text-green-400';
                    const themeBg = meal.type === 'Breakfast' ? 'bg-orange-500/10' : meal.type === 'Snacks' ? 'bg-yellow-500/10' : 'bg-green-500/10';

                    return (
                      <div key={idx} className="glass rounded-[32px] overflow-hidden border border-white/5 transition-all">
                        <button 
                          onClick={() => setExpandedMeal(isExpanded ? null : idx)}
                          className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-all text-left"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl ${themeBg} flex items-center justify-center ${themeColor} shadow-inner`}>
                              <Icon size={24} />
                            </div>
                            <div>
                              <p className="text-[9px] font-black text-white/20 uppercase tracking-[2px] mb-0.5">{meal.type}</p>
                              <h4 className="font-bold text-white text-lg">{meal.dish}</h4>
                            </div>
                          </div>
                          <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                            <ChevronDown size={20} className="text-white/20" />
                          </div>
                        </button>
                        
                        {isExpanded && (
                          <div className="px-6 pb-8 space-y-6 animate-in slide-in-from-top duration-300">
                            <div className="h-[1px] w-full bg-white/5" />
                            <div className="space-y-3">
                              <h5 className="text-[10px] font-black uppercase text-indigo-400 tracking-widest flex items-center gap-2">
                                <ShoppingBag size={12} /> Ingredients
                              </h5>
                              <ul className="grid grid-cols-1 gap-2">
                                {meal.recipe.ingredients.map((ing, i) => (
                                  <li key={i} className="text-xs text-white/60 flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" /> {ing}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="space-y-3">
                              <h5 className="text-[10px] font-black uppercase text-indigo-400 tracking-widest flex items-center gap-2">
                                <TrendingDown size={12} /> Instructions
                              </h5>
                              <ol className="space-y-4">
                                {meal.recipe.instructions.map((inst, i) => (
                                  <li key={i} className="text-xs text-white/80 leading-relaxed pl-2 border-l-2 border-indigo-500/20">
                                    <span className="font-black text-indigo-500 text-[10px] mr-2">{i+1}</span> {inst}
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                <div className="glass rounded-[28px] p-6 bg-gradient-to-r from-indigo-900/10 to-transparent border border-white/5 flex justify-between items-center shadow-2xl">
                  <div>
                    <span className="text-white/30 font-black text-[10px] uppercase tracking-widest block mb-1">Total Net Calorie Matrix</span>
                    <span className="text-3xl font-black text-white tracking-tighter">{dietPlan.calories} <span className="text-xs text-indigo-400 ml-1">KCAL</span></span>
                  </div>
                  <div className="w-12 h-12 rounded-full border-2 border-indigo-500/30 flex items-center justify-center text-indigo-400 animate-pulse">
                     <Target size={20} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Saved Blueprints */}
          {profile.savedDiets && profile.savedDiets.length > 0 && (
            <section className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between px-2">
                <h3 className="font-black text-sm uppercase tracking-widest text-white/20">Saved Blueprints</h3>
                <Bookmark size={18} className="text-white/10" />
              </div>
              <div className="space-y-3">
                {profile.savedDiets.map((saved) => (
                  <div key={saved.id} className="glass rounded-[28px] p-5 flex items-center justify-between group active:scale-[0.98] transition-all border border-white/5 hover:bg-white/5 cursor-pointer" onClick={() => { setDietPlan(saved); setExpandedMeal(null); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
                    <div className="flex-1">
                       <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">{new Date(saved.dateGenerated).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</p>
                       <h4 className="font-bold text-white text-base">{saved.meals[0].dish}...</h4>
                       <div className="flex gap-4 mt-2">
                          <span className="text-[9px] font-black text-indigo-400/80 uppercase">{saved.calories} kcal</span>
                          <span className="text-[9px] font-black text-purple-400/80 uppercase">{saved.macros.protein}g Protein</span>
                       </div>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteSavedDiet(saved.id); }} 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white/10 hover:text-red-500 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default AICoach;
