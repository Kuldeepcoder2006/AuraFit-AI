
import React from 'react';
import { AppTab } from '../types';
import { Home, Dumbbell, Sparkles, LineChart, Settings } from 'lucide-react';

interface NavigationProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: AppTab.HOME, icon: Home, label: 'Home' },
    { id: AppTab.WORKOUTS, icon: Dumbbell, label: 'Train' },
    { id: AppTab.AI, icon: Sparkles, label: 'AI', isMain: true },
    { id: AppTab.PROGRESS, icon: LineChart, label: 'Stats' },
    { id: AppTab.SETTINGS, icon: Settings, label: 'User' },
  ];

  return (
    <nav className="fixed bottom-6 left-6 right-6 z-50">
      <div className="glass-dark h-20 rounded-[32px] flex items-center justify-around px-4 relative overflow-visible">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isMain) {
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative -top-8 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-tr from-purple-500 via-indigo-500 to-pink-500 neon-glow-purple scale-110 shadow-xl' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <Icon size={28} className={isActive ? 'text-white' : 'text-white/70'} />
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center space-y-1 transition-all"
            >
              <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-white/10 text-purple-400' : 'text-white/40'}`}>
                <Icon size={24} />
              </div>
              {isActive && <div className="w-1 h-1 bg-purple-500 rounded-full" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
