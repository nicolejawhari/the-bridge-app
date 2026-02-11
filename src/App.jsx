import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ChevronLeft, 
  Send, 
  CheckCircle, 
  MessageCircle, 
  ClipboardCheck, 
  Home, 
  Video, 
  HelpCircle,
  Users,
  Settings,
  MoreVertical,
  Plus,
  ArrowRight,
  Star,
  BookOpen
} from 'lucide-react';

/**
 * THE BRIDGE: CORE CONFIGURATION
 * Maps Kathy Richardson strategies to instructional levels.
 */
const ASSESSMENT_CONFIG = {
  strategies: [
    { id: 'A', label: 'Knows quickly / No errors', level: 'A', status: 'Ready to Apply' },
    { id: 'P+', label: 'Knows all but 1 quickly / Uses relationships', level: 'P+', status: 'Needs Practice' },
    { id: 'P', label: 'Figures out 2 or more / Counts on or back', level: 'P', status: 'Needs Practice' },
    { id: 'P-', label: 'Counts all for up to half / May have 1 error', level: 'P-', status: 'Needs Practice' },
    { id: 'I', label: 'Counts all for more than half / 2 errors', level: 'I', status: 'Needs Instruction' },
    { id: 'N', label: '3+ errors / Guessing / No answer', level: 'N', status: 'Needs Prerequisite' }
  ],
  activities: [
    { id: '2:3-7', title: 'Grab Bag Subtraction', type: 'P', description: 'Using a paper bag and counters to find missing parts.' },
    { id: '2:3-8', title: 'The Tub Game', type: 'I', description: 'Hiding counters under a tub to describe parts.' },
    { id: '2:3-12', title: 'Number Shapes', type: 'N', description: 'Foundational subitizing and group recognition.' }
  ]
};

// --- VIEWS ---

const ChatView = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'teacher', text: "Hi! How did the Grab Bag game go today?", time: '10:00 AM' },
    { id: 2, sender: 'parent', text: "Leo loved it! He's getting much faster with his 6 combinations.", time: '2:15 PM' }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    setMessages([...messages, { 
      id: Date.now(), 
      sender: 'teacher', 
      text: input, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.sender === 'teacher' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-3xl shadow-sm ${m.sender === 'teacher' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border rounded-tl-none'}`}>
              <p className="text-sm leading-relaxed font-medium">{m.text}</p>
              <span className="text-[10px] opacity-60 mt-2 block font-bold uppercase tracking-widest">{m.time}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-24 left-4 right-4 bg-white border border-slate-100 rounded-3xl p-2 shadow-xl flex gap-2 z-10">
        <input 
          className="flex-1 px-4 py-3 text-sm focus:outline-none" 
          placeholder="Message Leo's family..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && send()}
        />
        <button onClick={send} className="bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100">
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

const AssessmentView = ({ onComplete }) => {
  const [step, setStep] = useState('select'); // select, verify, test, summary
  const [target, setTarget] = useState(6);
  const [promptIdx, setPromptIdx] = useState(0);
  const [history, setHistory] = useState([]);
  const [typedAnswer, setTypedAnswer] = useState('');

  const currentHiding = useMemo(() => {
    const combos = [[2, target-2], [4, target-4], [1, target-1], [3, target-3]];
    return combos[promptIdx % combos.length];
  }, [target, promptIdx]);

  const handleStrategy = (strat) => {
    const newEntry = { target, prompt: currentHiding, strategy: strat };
    const newHistory = [...history, newEntry];
    setHistory(newHistory);

    if (strat.level === 'A') {
      if (promptIdx < 2) {
        setPromptIdx(promptIdx + 1);
        setTypedAnswer('');
      } else {
        setStep('summary');
      }
    } else if (['P+', 'P', 'P-'].includes(strat.level)) {
      setStep('summary');
    } else {
      setTarget(Math.max(3, target - 1));
      setPromptIdx(0);
      setTypedAnswer('');
      setStep('verify');
    }
  };

  if (step === 'select') {
    return (
      <div className="p-6 space-y-8 animate-in fade-in duration-500">
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Hiding Assessment</h2>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Kathy Richardson Framework</p>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[3,4,5,6,7,8,9,10].map(n => (
            <button 
              key={n} 
              onClick={() => {setTarget(n); setStep('verify');}} 
              className="aspect-square rounded-[2rem] border-4 border-slate-50 bg-white hover:border-blue-500 hover:bg-blue-50 text-2xl font-black text-slate-700 shadow-sm transition-all active:scale-90"
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === 'verify') {
    return (
      <div className="p-8 text-center space-y-10 animate-in zoom-in duration-300">
        <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-[2.5rem] flex items-center justify-center mx-auto text-5xl font-black shadow-2xl shadow-blue-200">
          {target}
        </div>
        <div className="space-y-4">
          <p className="text-2xl font-bold text-slate-900 px-4">"Can you hand me {target} counters?"</p>
          <p className="text-xs text-slate-400 font-black uppercase tracking-widest bg-slate-100 py-2 px-4 rounded-full inline-block">Wait for student response</p>
        </div>
        <div className="space-y-4 pt-4">
            <button 
            onClick={() => setStep('test')} 
            className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-lg shadow-2xl active:scale-95 transition-all"
            >
            Student has {target}
            </button>
            <button onClick={() => setStep('select')} className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-blue-600">Change Starting Number</button>
        </div>
      </div>
    );
  }

  if (step === 'test') {
    return (
      <div className="p-4 space-y-4 animate-in slide-in-from-bottom-4 duration-300">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
          <p className="text-[10px] text-blue-400 uppercase tracking-[0.3em] font-black mb-4">Diagnostic Prompt {promptIdx + 1}</p>
          <p className="text-xl font-medium text-slate-300">"I'm showing you <span className="text-white font-black px-3 py-1 bg-white/10 rounded-xl">{currentHiding[0]}</span>."</p>
          <p className="text-3xl font-black mt-6 text-white leading-tight">"How many are hiding?"</p>
        </div>

        <div className="px-6">
           <input 
            type="number" 
            className="w-full text-center text-5xl font-black py-6 border-b-8 border-slate-100 focus:outline-none focus:border-blue-600 transition-all text-slate-900" 
            placeholder="?"
            autoFocus
            value={typedAnswer}
            onChange={e => setTypedAnswer(e.target.value)}
          />
        </div>

        <div className="grid gap-2 pt-2">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest ml-2 mb-2">Strategy Used:</p>
          {ASSESSMENT_CONFIG.strategies.map(s => (
            <button 
              key={s.id}
              onClick={() => handleStrategy(s)}
              className="flex justify-between items-center p-4 rounded-2xl border-2 border-slate-50 bg-white hover:border-blue-100 active:scale-[0.98] transition-all text-left group shadow-sm"
            >
              <div className="flex-1">
                <span className="block text-sm font-black text-slate-800 group-hover:text-blue-600">{s.label}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{s.status}</span>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs border-2 
                ${s.level === 'A' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 
                  s.level.startsWith('P') ? 'bg-amber-50 border-amber-100 text-amber-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                {s.level}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === 'summary') {
    const finalResult = history[history.length - 1];
    const isPractice = finalResult.strategy.level.startsWith('P');
    const isMastered = finalResult.strategy.level === 'A';

    return (
      <div className="p-6 space-y-6 text-center animate-in zoom-in-95 duration-500">
        <div className="bg-white p-8 rounded-[3rem] border-4 border-emerald-100 shadow-xl shadow-emerald-50 relative overflow-hidden">
          <div className="absolute -left-4 -top-4 w-20 h-20 bg-emerald-50 rounded-full" />
          <div className="w-20 h-20 bg-emerald-500 text-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-200">
            <CheckCircle size={40} />
          </div>
          <h3 className="text-2xl font-black text-slate-900">Diagnosis Complete</h3>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">Home bridge established</p>
        </div>

        <div className="grid grid-cols-2 gap-4 px-2">
          <div className="bg-slate-900 p-5 rounded-[2rem] shadow-xl">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Fluency</p>
            <p className="text-4xl font-black text-white">{isPractice || isMastered ? (isMastered ? target : target - 1) : 'N/A'}</p>
          </div>
          <div className="bg-blue-600 p-5 rounded-[2rem] shadow-xl">
            <p className="text-[10px] text-blue-200 font-black uppercase tracking-widest mb-1">Practice</p>
            <p className="text-4xl font-black text-white">{target-1}-{target+1}</p>
          </div>
        </div>

        <div className="bg-white border-4 border-slate-50 rounded-[2.5rem] p-6 text-left shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Assigned Activity</p>
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center shadow-inner">
              <ClipboardCheck size={32} />
            </div>
            <div>
              <p className="font-black text-xl text-slate-900 leading-tight">Grab Bag Subtraction</p>
              <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-tight">Working with Number {target}</p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => onComplete({ target, level: finalResult.strategy.level })}
          className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black text-xl shadow-2xl shadow-blue-200 active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          Send to Family Dashboard <ArrowRight size={24} />
        </button>
      </div>
    );
  }
};

const ParentDashboard = ({ studentData }) => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [activeNumber, setActiveNumber] = useState(studentData.workingNum);
  const [playedToday, setPlayedToday] = useState(false);

  useEffect(() => {
    const key = `played_${new Date().toLocaleDateString()}`;
    if (localStorage.getItem(key)) setPlayedToday(true);
  }, []);

  const handleFinish = () => {
    const key = `played_${new Date().toLocaleDateString()}`;
    localStorage.setItem(key, 'true');
    setPlayedToday(true);
  };

  if (selectedGame) {
    return (
      <div className="p-4 space-y-6 animate-in slide-in-from-right duration-500 pb-32">
        <button onClick={() => setSelectedGame(null)} className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] bg-white border border-slate-100 px-4 py-2 rounded-full shadow-sm">
          <ChevronLeft size={14}/> Back to Games
        </button>

        <div className="space-y-2 px-2">
          <h2 className="text-3xl font-black text-slate-900 leading-tight tracking-tight">{selectedGame.title}</h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Home Practice Session</p>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] border-2 border-slate-50 shadow-sm space-y-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Step 1: Pick your number</p>
          <div className="flex gap-4">
            {[activeNumber-1, activeNumber, activeNumber+1].map(n => (
              <button 
                key={n} 
                onClick={() => setActiveNumber(n)}
                className={`flex-1 py-5 rounded-[1.5rem] text-3xl font-black border-4 transition-all shadow-sm
                ${activeNumber === n ? 'bg-blue-600 border-blue-100 text-white scale-110 rotate-2' : 'bg-slate-50 border-white text-slate-300'}`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="relative aspect-video bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl group border-8 border-white">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl scale-110 active:scale-95 transition-transform">
               <Video className="text-white fill-white" size={32} />
            </div>
          </div>
          <div className="absolute bottom-6 left-6 text-white text-[10px] font-black bg-slate-900/60 px-5 py-2 rounded-full backdrop-blur-md border border-white/20 uppercase tracking-widest">
            Game Demo: Working with {activeNumber}
          </div>
        </div>

        <div className="bg-blue-50 border-4 border-white rounded-[2.5rem] p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-3 text-blue-900 font-black text-sm uppercase tracking-[0.1em]">
            <HelpCircle size={24} className="text-blue-500"/> Parent Prompts:
          </div>
          <ul className="space-y-5">
            <li className="flex gap-4">
              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0">1</span>
              <p className="text-sm text-blue-900/80 font-medium italic">"We have {activeNumber} counters in the bag. If I take out 2, how many are hiding?"</p>
            </li>
            <li className="flex gap-4">
              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0">2</span>
              <p className="text-sm text-blue-900/80 font-medium italic">"Before you look, what do you think it will be?"</p>
            </li>
          </ul>
        </div>

        <button 
          onClick={handleFinish}
          disabled={playedToday}
          className={`w-full py-6 rounded-[2rem] text-2xl font-black shadow-2xl transition-all active:scale-95
          ${playedToday ? 'bg-slate-100 text-slate-300 border border-slate-200' : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-200'}`}
        >
          {playedToday ? '✓ Completed Today' : 'I Played This!'}
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-10 pb-32 animate-in fade-in duration-700">
      <div className="flex justify-between items-center px-2">
        <div className="space-y-2">
          <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.3em]">Home Station</p>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Hi, Leo!</h1>
        </div>
        <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-3xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-100 border-4 border-white rotate-3">L</div>
      </div>

      <div className="bg-slate-900 p-8 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl group-hover:scale-110 transition-transform" />
        <p className="text-[10px] opacity-40 font-black uppercase tracking-[0.3em] mb-3">Your Working Number</p>
        <h2 className="text-4xl font-black mb-8 tracking-tighter">{studentData.workingNum}</h2>
        <div className="flex gap-3">
          {[1,2,3,4,5].map(day => (
            <div key={day} className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xs font-black border-2 transition-all shadow-sm
              ${day <= (playedToday ? 3 : 2) ? 'bg-white text-slate-900 border-white scale-110 rotate-6 shadow-xl' : 'bg-white/5 border-white/10 text-white/20'}`}>
              {day <= (playedToday ? 3 : 2) ? <Star size={20} fill="currentColor" /> : day}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center px-4">
          <h3 className="font-black text-slate-900 uppercase text-[10px] tracking-[0.2em]">Weekly Activities</h3>
          <span className="bg-slate-100 text-slate-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">Teacher Curated</span>
        </div>
        <div className="grid gap-4">
          {ASSESSMENT_CONFIG.activities.map(game => (
            <button 
              key={game.id} 
              onClick={() => setSelectedGame(game)}
              className="bg-white p-6 rounded-[2.5rem] shadow-sm border-2 border-slate-50 flex items-center gap-6 text-left active:scale-[0.96] transition-all hover:border-blue-100 group"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-4xl shadow-inner group-hover:rotate-6 transition-transform">
                {game.title.includes('Bag') ? '🎒' : game.title.includes('Tub') ? '🛁' : '🔳'}
              </div>
              <div className="flex-1">
                <p className="font-black text-slate-800 text-lg group-hover:text-blue-600 transition-colors leading-tight">{game.title}</p>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mt-1">{game.description}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 text-slate-200 group-hover:text-blue-600 transition-colors">
                 <ArrowRight size={20} strokeWidth={3} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- APP ENTRY ---

export default function App() {
  const [activeTab, setActiveTab] = useState('assessment');
  const [studentLevel, setStudentLevel] = useState({ name: 'Leo', workingNum: 6 });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 max-w-md mx-auto border-x border-slate-200 shadow-2xl flex flex-col relative overflow-hidden select-none">
      
      <main className="flex-1 overflow-y-auto bg-white">
        {activeTab === 'assessment' && (
          <AssessmentView onComplete={(res) => {
            setStudentLevel({...studentLevel, workingNum: res.target});
            setActiveTab('parent');
          }} />
        )}
        
        {activeTab === 'parent' && (
          <ParentDashboard studentData={studentLevel} />
        )}

        {activeTab === 'chat' && (
          <ChatView />
        )}

        {activeTab === 'rosters' && (
          <div className="p-8 space-y-10 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Class</h2>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">Roster Sync</p>
              </div>
              <button className="bg-slate-100 text-slate-400 p-4 rounded-3xl hover:text-slate-900 transition-colors">
                 <Settings size={24} />
              </button>
            </div>
            <div className="space-y-4">
              {['Leo A.', 'Sarah M.', 'James T.', 'Mia R.'].map(name => (
                <div key={name} className="flex items-center justify-between p-6 bg-white rounded-[2rem] border-2 border-slate-50 shadow-sm transition-all hover:border-blue-200 active:scale-[0.98]">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center font-black text-blue-600 shadow-inner text-lg">{name[0]}</div>
                    <div>
                      <p className="font-black text-slate-800 text-lg leading-none">{name}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">Active now</p>
                    </div>
                  </div>
                  <button className="p-2 text-slate-200 hover:text-slate-400"><MoreVertical size={20} /></button>
                </div>
              ))}
              <div className="pt-6">
                <button className="w-full bg-slate-100 border-4 border-dashed border-slate-200 p-8 rounded-[3rem] flex flex-col items-center justify-center gap-3 text-slate-300 font-black uppercase text-[10px] tracking-[0.3em] hover:text-blue-300 hover:border-blue-100 transition-all active:scale-95 group">
                  <Plus size={32} className="group-hover:rotate-90 transition-transform" />
                  Sync with Clever
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-2xl border-t border-slate-100 h-24 flex items-center justify-around px-6 z-50 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
        <NavBtn active={activeTab === 'assessment'} icon={<ClipboardCheck />} label="Assess" onClick={() => setActiveTab('assessment')} />
        <NavBtn active={activeTab === 'parent'} icon={<Home />} label="Play" onClick={() => setActiveTab('parent')} />
        <NavBtn active={activeTab === 'chat'} icon={<MessageCircle />} label="Chat" onClick={() => setActiveTab('chat')} />
        <NavBtn active={activeTab === 'rosters'} icon={<Users />} label="Class" onClick={() => setActiveTab('rosters')} />
      </nav>
    </div>
  );
}

const NavBtn = ({ active, icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-2 transition-all group ${active ? 'text-blue-600' : 'text-slate-300 hover:text-slate-400'}`}
  >
    <div className={`p-3 rounded-2xl transition-all ${active ? 'bg-blue-50 scale-125 shadow-inner' : 'group-hover:scale-110'}`}>
      {React.cloneElement(icon, { size: 22, strokeWidth: active ? 3 : 2 })}
    </div>
    <span className={`text-[9px] font-black uppercase tracking-[0.2em] transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`}>{label}</span>
  </button>
);
