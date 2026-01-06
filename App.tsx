
import React, { useState, useEffect, useCallback } from 'react';
import { AppTab, UserProfile, DailyWorkout, HabitStats } from './types';
import { INITIAL_PROFILE, INITIAL_WORKOUTS } from './constants';
import Navigation from './components/Navigation';
import Home from './screens/Home';
import Workouts from './screens/Workouts';
import AICoach from './screens/AICoach';
import Progress from './screens/Progress';
import Settings from './screens/Settings';
import WorkoutDetail from './screens/WorkoutDetail';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [workouts, setWorkouts] = useState<DailyWorkout[]>(INITIAL_WORKOUTS);
  const [stats, setStats] = useState<HabitStats>({ water: 0, sleep: 0, steps: 0 });
  const [selectedWorkout, setSelectedWorkout] = useState<DailyWorkout | null>(null);

  // Persistence & Daily Reset Logic
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    
    // Load Profile
    const savedProfile = localStorage.getItem('aurafit_profile');
    if (savedProfile) setProfile(JSON.parse(savedProfile));
    
    // Load Workouts
    const savedWorkouts = localStorage.getItem('aurafit_workouts');
    if (savedWorkouts) setWorkouts(JSON.parse(savedWorkouts));

    // Load Stats with Daily Reset check
    const savedStats = localStorage.getItem('aurafit_stats');
    const lastUpdateDate = localStorage.getItem('aurafit_last_update');

    if (savedStats && lastUpdateDate === today) {
      setStats(JSON.parse(savedStats));
    } else {
      // New day: Reset water and steps, keep a default sleep if preferred or 0
      const resetStats = { water: 0, sleep: 7, steps: 0 };
      setStats(resetStats);
      localStorage.setItem('aurafit_stats', JSON.stringify(resetStats));
      localStorage.setItem('aurafit_last_update', today);
    }
  }, []);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => {
        const next = { ...prev, ...updates };
        localStorage.setItem('aurafit_profile', JSON.stringify(next));
        return next;
    });
  };

  const updateStats = useCallback((updates: Partial<HabitStats>) => {
    setStats(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem('aurafit_stats', JSON.stringify(next));
      return next;
    });
  }, []);

  const saveNewWorkouts = (newWorkouts: DailyWorkout[]) => {
    setWorkouts(prev => {
      const next = [...newWorkouts, ...prev];
      localStorage.setItem('aurafit_workouts', JSON.stringify(next));
      return next;
    });
  };

  const handleDeleteWorkout = (id: string) => {
    setWorkouts(prev => {
      const next = prev.filter(w => w.id !== id);
      localStorage.setItem('aurafit_workouts', JSON.stringify(next));
      return next;
    });
  };

  const handleCompleteWorkout = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    const targetWorkout = workouts.find(w => w.id === id);
    const calories = targetWorkout?.calories || 0;
    
    setWorkouts(prev => {
      const next = prev.map(w => w.id === id ? { ...w, completed: true } : w);
      localStorage.setItem('aurafit_workouts', JSON.stringify(next));
      return next;
    });

    setProfile(prev => {
      const history = prev.completionHistory || [];
      const sessionHistory = prev.sessionHistory || [];
      
      const nextHistory = history.includes(today) ? history : [...history, today];
      const nextSessionHistory = [...sessionHistory, { date: today, calories, workoutId: id }];
      
      const next = { 
        ...prev, 
        completionHistory: nextHistory,
        sessionHistory: nextSessionHistory
      };
      
      localStorage.setItem('aurafit_profile', JSON.stringify(next));
      return next;
    });

    setSelectedWorkout(null);
    setActiveTab(AppTab.PROGRESS);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case AppTab.HOME:
        return <Home profile={profile} stats={stats} onUpdateStats={updateStats} />;
      case AppTab.WORKOUTS:
        return (
          <Workouts 
            profile={profile}
            workouts={workouts} 
            onSelectWorkout={(w) => setSelectedWorkout(w)} 
            onSaveWorkouts={saveNewWorkouts}
            onDeleteWorkout={handleDeleteWorkout}
            onUpdateProfile={updateProfile}
          />
        );
      case AppTab.AI:
        return <AICoach profile={profile} onUpdateProfile={updateProfile} />;
      case AppTab.PROGRESS:
        return <Progress profile={profile} />;
      case AppTab.SETTINGS:
        return <Settings profile={profile} onUpdateProfile={updateProfile} />;
      default:
        return <Home profile={profile} stats={stats} onUpdateStats={updateStats} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden relative">
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <main className="max-w-md mx-auto min-h-screen pb-10">
        {renderScreen()}
      </main>

      {!selectedWorkout && <Navigation activeTab={activeTab} onTabChange={setActiveTab} />}

      {selectedWorkout && (
        <WorkoutDetail 
          workout={selectedWorkout} 
          onBack={() => setSelectedWorkout(null)} 
          onComplete={handleCompleteWorkout}
        />
      )}
    </div>
  );
};

export default App;
