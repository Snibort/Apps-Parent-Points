import React, { useState, useEffect } from 'react';
import { Kid, Tab, KID_COLORS, HistoryItem } from './types';
import { KidCard } from './components/KidCard';
import { StatsView } from './components/StatsView';
import { PlusCircle, Trophy, Home, Settings, Trash2, Check, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

function App() {
  // --- State ---
  const [kids, setKids] = useState<Kid[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('track');
  const [isAddingKid, setIsAddingKid] = useState(false);
  const [newKidName, setNewKidName] = useState('');
  const [selectedColor, setSelectedColor] = useState(KID_COLORS[0]);
  const [isInitialized, setIsInitialized] = useState(false);

  // --- Effects ---
  useEffect(() => {
    const saved = localStorage.getItem('parent-points-data');
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        // Migrate old data if necessary (ensure history array exists)
        const migratedData = parsedData.map((k: any) => ({
          ...k,
          history: Array.isArray(k.history) ? k.history : []
        }));
        setKids(migratedData);
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    } else {
        // Default demo data with Harvey and Freya
        setKids([
            { id: '1', name: 'Harvey', points: 5, color: 'blue', history: [] },
            { id: '2', name: 'Freya', points: 8, color: 'pink', history: [] }
        ]);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('parent-points-data', JSON.stringify(kids));
    }
  }, [kids, isInitialized]);

  // --- Handlers ---
  const handleAddPoint = (id: string, note: string = 'Good behavior') => {
    setKids(prev => prev.map(kid => {
      if (kid.id !== id) return kid;
      
      const newHistoryItem: HistoryItem = {
        id: uuidv4(),
        timestamp: Date.now(),
        amount: 1,
        note: note
      };

      return { 
        ...kid, 
        points: kid.points + 1,
        history: [newHistoryItem, ...kid.history] 
      };
    }));
  };

  const handleRemovePoint = (id: string) => {
    setKids(prev => prev.map(kid => {
      if (kid.id !== id) return kid;

      const newHistoryItem: HistoryItem = {
        id: uuidv4(),
        timestamp: Date.now(),
        amount: -1,
        note: 'Point removed'
      };

      return { 
        ...kid, 
        points: Math.max(0, kid.points - 1),
        history: [newHistoryItem, ...kid.history]
      };
    }));
  };

  const handleAddKid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKidName.trim()) return;

    const newKid: Kid = {
      id: uuidv4(),
      name: newKidName.trim(),
      points: 0,
      color: selectedColor,
      history: []
    };

    setKids([...kids, newKid]);
    setNewKidName('');
    setIsAddingKid(false);
    // Cycle random color for next time to add variety by default
    const nextColorIndex = Math.floor(Math.random() * KID_COLORS.length);
    setSelectedColor(KID_COLORS[nextColorIndex]);
  };

  const handleDeleteKid = (id: string) => {
    if (window.confirm("Are you sure you want to remove this kid?")) {
      setKids(prev => prev.filter(k => k.id !== id));
    }
  };

  // --- Render ---
  return (
    <div className="min-h-screen pb-24 bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-2 rounded-xl">
              <Trophy className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Parent Points</h1>
          </div>
          <button 
            onClick={() => setIsAddingKid(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-slate-800 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Kid</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        
        {/* Add Kid Modal/Form Overlay */}
        {isAddingKid && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">Add New Kid</h3>
                <button onClick={() => setIsAddingKid(false)} className="p-2 hover:bg-slate-100 rounded-full">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              
              <form onSubmit={handleAddKid}>
                <div className="mb-4">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={newKidName}
                    onChange={(e) => setNewKidName(e.target.value)}
                    placeholder="Enter name..."
                    className="w-full text-lg p-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-0 outline-none transition-colors"
                    autoFocus
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Color</label>
                  <div className="flex flex-wrap gap-2">
                    {KID_COLORS.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform ${selectedColor === color ? 'border-slate-800 scale-110' : 'border-transparent hover:scale-105'}`}
                        style={{ backgroundColor: `var(--tw-color-${color}-400)`, background: color /* Fallback if var fails, though tailwind needs classes usually */}}
                      >
                         <span className={`block w-full h-full rounded-full bg-${color}-400 pointer-events-none`} />
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!newKidName.trim()}
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
                >
                  Create Profile
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'track' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {kids.length === 0 ? (
               <div className="col-span-full text-center py-20 opacity-50">
                  <div className="bg-slate-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PlusCircle className="w-10 h-10 text-slate-400" />
                  </div>
                  <p className="text-xl font-bold text-slate-500">No kids added yet!</p>
                  <p className="text-slate-400">Tap "Add Kid" to get started.</p>
               </div>
            ) : (
              kids.map(kid => (
                <KidCard
                  key={kid.id}
                  kid={kid}
                  onAddPoint={handleAddPoint}
                  onRemovePoint={handleRemovePoint}
                  onDelete={handleDeleteKid}
                />
              ))
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <StatsView kids={kids} />
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold mb-6">Manage Kids</h2>
            <div className="space-y-4">
              {kids.map(kid => (
                <div key={kid.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-12 rounded-full bg-${kid.color}-500`}></div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">{kid.name}</h3>
                      <p className="text-sm text-slate-500">{kid.points} points</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteKid(kid.id)}
                    className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {kids.length === 0 && <p className="text-slate-400 text-center">No profiles to manage.</p>}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe">
        <div className="max-w-md mx-auto flex justify-around p-2">
          <button
            onClick={() => setActiveTab('track')}
            className={`flex flex-col items-center p-3 rounded-2xl w-24 transition-colors ${activeTab === 'track' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Home className="w-6 h-6 mb-1" />
            <span className="text-xs font-bold">Track</span>
          </button>
          
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex flex-col items-center p-3 rounded-2xl w-24 transition-colors ${activeTab === 'stats' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Trophy className="w-6 h-6 mb-1" />
            <span className="text-xs font-bold">Totals</span>
          </button>

          <button
             onClick={() => setActiveTab('settings')}
             className={`flex flex-col items-center p-3 rounded-2xl w-24 transition-colors ${activeTab === 'settings' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Settings className="w-6 h-6 mb-1" />
            <span className="text-xs font-bold">Manage</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;