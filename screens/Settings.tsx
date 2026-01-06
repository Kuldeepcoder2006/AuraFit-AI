
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Shield, Bell, HelpCircle, LogOut, ChevronRight, Scale, Ruler, Activity, Edit2, Check, X } from 'lucide-react';

interface SettingsProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

const Settings: React.FC<SettingsProps> = ({ profile, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: profile.name,
    weight: profile.weight,
    height: profile.height,
  });

  const menuItems = [
    { label: 'Security', icon: Shield, color: 'text-blue-400' },
    { label: 'Notifications', icon: Bell, color: 'text-yellow-400' },
    { label: 'Support', icon: HelpCircle, color: 'text-purple-400' },
  ];

  const handleSave = () => {
    if (editForm.name.trim() === '') return;
    onUpdateProfile({
      name: editForm.name,
      weight: Number(editForm.weight),
      height: Number(editForm.height),
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      name: profile.name,
      weight: profile.weight,
      height: profile.height,
    });
    setIsEditing(false);
  };

  const startEditing = () => {
    setEditForm({
      name: profile.name,
      weight: profile.weight,
      height: profile.height,
    });
    setIsEditing(true);
  };

  return (
    <div className="px-6 pt-12 pb-32 space-y-8 bg-gradient-aura min-h-screen">
      <header className="flex flex-col items-center text-center space-y-4">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full border-4 border-purple-500/30 p-1">
            <img 
              src={`https://picsum.photos/seed/${profile.name}/200/200`} 
              className="w-full h-full rounded-full object-cover shadow-2xl" 
              alt="profile" 
            />
          </div>
          <div className="absolute bottom-0 right-0 w-10 h-10 bg-purple-600 rounded-full border-4 border-[#050505] flex items-center justify-center text-white shadow-lg">
            <Activity size={18} />
          </div>
        </div>
        
        <div className="w-full">
          {isEditing ? (
            <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-300">
              <input 
                type="text"
                value={editForm.name}
                autoFocus
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="bg-white/5 border border-purple-500/50 rounded-2xl px-4 py-2 text-2xl font-extrabold text-white text-center w-full focus:outline-none focus:ring-2 ring-purple-500/20"
                placeholder="Name"
              />
              <div className="flex gap-2">
                <button 
                  onClick={handleSave}
                  className="bg-green-500/20 text-green-400 px-4 py-2 rounded-xl flex items-center gap-2 font-bold border border-green-500/30 active:scale-90 transition-all"
                >
                  <Check size={18} /> Save
                </button>
                <button 
                  onClick={handleCancel}
                  className="bg-white/5 text-white/50 px-4 py-2 rounded-xl flex items-center gap-2 font-bold border border-white/10 active:scale-90 transition-all"
                >
                  <X size={18} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="group flex flex-col items-center cursor-pointer" onClick={startEditing}>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-extrabold text-white tracking-tight">{profile.name}</h1>
                <Edit2 size={18} className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-white/40 text-sm font-medium tracking-wide uppercase mt-1">Premium Athlete</p>
            </div>
          )}
        </div>
      </header>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4">
        <div 
          onClick={!isEditing ? startEditing : undefined}
          className={`glass rounded-[28px] p-5 flex items-center justify-between group transition-all duration-300 ${isEditing ? 'border-purple-500/50 bg-purple-500/5' : 'hover:border-white/20'}`}
        >
          <div className="flex items-center gap-3 w-full">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Scale size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Weight</p>
              {isEditing ? (
                <div className="flex items-center gap-1">
                  <input 
                    type="number"
                    value={editForm.weight}
                    onChange={(e) => setEditForm({ ...editForm, weight: Number(e.target.value) })}
                    className="bg-transparent w-full font-bold text-white outline-none border-b border-white/10 focus:border-blue-400 transition-colors"
                  />
                  <span className="text-xs text-white/30 font-bold">kg</span>
                </div>
              ) : (
                <h4 className="font-bold text-lg truncate">{profile.weight} kg</h4>
              )}
            </div>
          </div>
        </div>
        
        <div 
          onClick={!isEditing ? startEditing : undefined}
          className={`glass rounded-[28px] p-5 flex items-center justify-between group transition-all duration-300 ${isEditing ? 'border-purple-500/50 bg-purple-500/5' : 'hover:border-white/20'}`}
        >
          <div className="flex items-center gap-3 w-full">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Ruler size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Height</p>
              {isEditing ? (
                <div className="flex items-center gap-1">
                  <input 
                    type="number"
                    value={editForm.height}
                    onChange={(e) => setEditForm({ ...editForm, height: Number(e.target.value) })}
                    className="bg-transparent w-full font-bold text-white outline-none border-b border-white/10 focus:border-purple-400 transition-colors"
                  />
                  <span className="text-xs text-white/30 font-bold">cm</span>
                </div>
              ) : (
                <h4 className="font-bold text-lg truncate">{profile.height} cm</h4>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Menu */}
      <section className="glass rounded-[32px] overflow-hidden border border-white/5">
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <button key={i} className={`w-full flex items-center justify-between p-6 hover:bg-white/5 transition-all active:bg-white/[0.02] ${i !== menuItems.length - 1 ? 'border-b border-white/5' : ''}`}>
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl bg-white/5 ${item.color} shadow-inner`}>
                  <Icon size={20} />
                </div>
                <span className="font-bold text-white/80">{item.label}</span>
              </div>
              <ChevronRight size={18} className="text-white/20" />
            </button>
          );
        })}
      </section>

      {/* Danger Zone */}
      <button className="w-full glass rounded-[24px] p-6 flex items-center justify-center gap-3 text-red-500 font-bold active:scale-95 transition-all bg-red-500/5 border border-red-500/20 hover:bg-red-500/10">
        <LogOut size={20} />
        Sign Out Session
      </button>

      {/* Footer Info */}
      <footer className="text-center pt-4">
        <p className="text-white/20 text-[10px] font-black tracking-[4px] uppercase">AuraFit AI v3.1.2 Premium</p>
      </footer>
    </div>
  );
};

export default Settings;
