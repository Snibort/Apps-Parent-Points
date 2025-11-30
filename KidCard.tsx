import React, { useState } from 'react';
import { Kid } from '../types';
import { Plus, Minus, Gift, Sparkles, Loader2, History, Send, Calendar } from 'lucide-react';
import { generateRewardIdeas } from '../services/geminiService';

interface KidCardProps {
  kid: Kid;
  onAddPoint: (id: string, note?: string) => void;
  onRemovePoint: (id: string) => void;
  onDelete: (id: string) => void;
}

export const KidCard: React.FC<KidCardProps> = ({ kid, onAddPoint, onRemovePoint, onDelete }) => {
  const [showRewards, setShowRewards] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [rewardIdea, setRewardIdea] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  // State for custom note
  const [customNote, setCustomNote] = useState('');

  // Dynamic Tailwind classes based on kid.color
  const bgClass = `bg-${kid.color}-100`;
  const borderClass = `border-${kid.color}-200`;
  const textClass = `text-${kid.color}-700`;
  const buttonBgClass = `bg-${kid.color}-500`;
  const buttonHoverClass = `hover:bg-${kid.color}-600`;

  const handleGetReward = async () => {
    if (showHistory) setShowHistory(false);
    
    if (rewardIdea && !showRewards) {
      setShowRewards(true);
      return;
    }
    if (showRewards) {
        setShowRewards(false);
        return;
    }
    
    setIsLoading(true);
    setShowRewards(true);
    try {
      const ideas = await generateRewardIdeas(kid.name, kid.points);
      setRewardIdea(ideas);
    } catch (e) {
      setRewardIdea("Couldn't get ideas right now.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleHistory = () => {
    if (showRewards) setShowRewards(false);
    setShowHistory(!showHistory);
  };

  const handleAddWithNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (customNote.trim()) {
      onAddPoint(kid.id, customNote.trim());
      setCustomNote('');
    } else {
        onAddPoint(kid.id);
    }
  };

  return (
    <div className={`relative p-6 rounded-3xl shadow-sm border-2 ${bgClass} ${borderClass} transition-all duration-300 hover:shadow-md`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className={`text-3xl font-bold ${textClass} mb-1`}>{kid.name}</h3>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Score</p>
        </div>
        <div className="text-right">
          <span className={`text-5xl font-black ${textClass}`}>{kid.points}</span>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => onAddPoint(kid.id)}
          className={`flex-1 ${buttonBgClass} ${buttonHoverClass} text-white rounded-2xl py-6 flex items-center justify-center transition-transform active:scale-95 shadow-sm group`}
          aria-label={`Add point to ${kid.name}`}
        >
          <Plus className="w-10 h-10 group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>
      
      <div className="flex gap-2 justify-between items-center">
         <button
          onClick={() => onRemovePoint(kid.id)}
          className="text-slate-400 hover:text-red-500 p-2 rounded-full hover:bg-white/50 transition-colors"
          title="Remove Point"
        >
          <Minus className="w-5 h-5" />
        </button>

        <div className="flex gap-2">
            <button
            onClick={toggleHistory}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold shadow-sm hover:shadow transition-all ${showHistory ? 'bg-slate-800 text-white' : `bg-white text-${kid.color}-600`}`}
            >
            <History className="w-4 h-4" />
            {showHistory ? 'Close' : 'History'}
            </button>

            <button
            onClick={handleGetReward}
            className={`flex items-center gap-2 px-4 py-2 rounded-full bg-white text-${kid.color}-600 text-sm font-bold shadow-sm hover:shadow transition-all`}
            >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {showRewards ? 'Hide' : 'Rewards'}
            </button>
        </div>
      </div>

      {showRewards && (
        <div className="mt-4 bg-white/80 backdrop-blur-sm rounded-xl p-4 text-slate-700 text-sm animate-in fade-in slide-in-from-top-2">
           <div className="flex items-center gap-2 mb-2 font-bold text-slate-900">
             <Gift className="w-4 h-4 text-purple-500" />
             <span>AI Suggestions for {kid.points} pts:</span>
           </div>
           {isLoading ? (
             <div className="space-y-2">
               <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4"></div>
               <div className="h-4 bg-slate-200 rounded animate-pulse w-1/2"></div>
               <div className="h-4 bg-slate-200 rounded animate-pulse w-5/6"></div>
             </div>
           ) : (
             <div className="whitespace-pre-wrap leading-relaxed">{rewardIdea}</div>
           )}
        </div>
      )}

      {showHistory && (
         <div className="mt-4 bg-white/80 backdrop-blur-sm rounded-xl p-4 text-slate-700 text-sm animate-in fade-in slide-in-from-top-2">
            
            <form onSubmit={handleAddWithNote} className="mb-4 flex gap-2">
                <input 
                    type="text" 
                    placeholder="Reason (optional)..."
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-slate-400"
                />
                <button type="submit" className={`bg-slate-800 text-white p-2 rounded-lg hover:bg-slate-700`}>
                    <Send className="w-4 h-4" />
                </button>
            </form>

            <div className="max-h-48 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                {kid.history.length === 0 ? (
                    <p className="text-slate-400 text-center py-2">No history yet</p>
                ) : (
                    kid.history.map(item => (
                        <div key={item.id} className="flex items-start justify-between border-b border-slate-100 pb-2 last:border-0">
                            <div>
                                <div className="text-xs text-slate-400 flex items-center gap-1 mb-0.5">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div className="text-slate-700 font-medium">{item.note}</div>
                            </div>
                            <span className={`font-bold ${item.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                {item.amount > 0 ? '+' : ''}{item.amount}
                            </span>
                        </div>
                    ))
                )}
            </div>
         </div>
      )}
    </div>
  );
};