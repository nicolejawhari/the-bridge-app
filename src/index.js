import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import Assessment from '../Assessment';
import ParentDashboard from '../ParentDashboard';
import ChatHub from '../ChatHub';

const App = () => {
  const [view, setView] = useState('assessment'); // State to switch views

  return (
    <div>
      {/* Simple Navigation Menu for Testing */}
      <nav style={{ padding: '10px', background: '#eee', display: 'flex', gap: '10px' }}>
        <button onClick={() => setView('assessment')}>Teacher Assessment</button>
        <button onClick={() => setView('parent')}>Parent Dashboard</button>
        <button onClick={() => setView('chat')}>Chat Hub</button>
      </nav>

      {/* Logic to show the selected view */}
      {view === 'assessment' && <Assessment />}
      {view === 'parent' && <ParentDashboard />}
      {view === 'chat' && <ChatHub />}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
