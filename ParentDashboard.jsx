import React, { useState, useEffect } from 'react';

const ParentDashboard = () => {
  // Mock data that would eventually come from your database
  const [studentData] = useState({
    name: "Leo",
    workingRange: [5, 6, 7],
    assignedGames: [
      { id: 'gb1', title: 'Grab Bag Subtraction', videoId: 'sample-vid-1' },
      { id: 'tb1', title: 'The Tub Game', videoId: 'sample-vid-2' },
      { id: 'ns1', title: 'Number Shapes', videoId: 'sample-vid-3' }
    ]
  });

  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Logic to reset the 'Played' status daily
  useEffect(() => {
    const lastPlayedDate = localStorage.getItem('lastPlayedDate');
    const today = new Date().toLocaleDateString();
    
    if (lastPlayedDate !== today) {
      setIsCompleted(false);
    } else {
      setIsCompleted(true);
    }
  }, []);

  const handleComplete = () => {
    const today = new Date().toLocaleDateString();
    localStorage.setItem('lastPlayedDate', today);
    setIsCompleted(true);
    alert("Great job! Teacher notified.");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-blue-900">The Bridge</h1>
        <p className="text-gray-600">Learning with {studentData.name}</p>
      </header>

      {/* Game Selection */}
      {!selectedGame ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold italic">Choose a game to play today:</h2>
          {studentData.assignedGames.map(game => (
            <button 
              key={game.id}
              onClick={() => setSelectedGame(game)}
              className="w-full bg-white p-4 rounded-xl shadow-sm border-2 border-transparent hover:border-blue-400 flex items-center justify-between"
            >
              <span className="text-xl font-medium">{game.title}</span>
              <span className="text-blue-500">Play →</span>
            </button>
          ))}
        </div>
      ) : (
        /* Active Game View */
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          <button onClick={() => setSelectedGame(null)} className="text-sm text-blue-600 font-bold">← Back to Games</button>
          
          <h2 className="text-2xl font-bold">{selectedGame.title}</h2>
          
          {/* Working Number Choice */}
          <div>
            <p className="text-sm font-bold text-gray-500 mb-2 uppercase">Pick your number:</p>
            <div className="flex gap-4">
              {studentData.workingRange.map(num => (
                <button 
                  key={num}
                  onClick={() => setSelectedNumber(num)}
                  className={`flex-1 py-3 rounded-lg text-2xl font-bold border-2 transition-all ${selectedNumber === num ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-100'}`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Video Placeholder */}
          <div className="aspect-video bg-gray-200 rounded-xl flex items-center justify-center">
             <p className="text-gray-500 text-center px-4">Video Playback for {selectedGame.title}<br/>(Number Focus: {selectedNumber || '?'})</p>
          </div>

          {/* Prompt Section */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <h3 className="font-bold text-blue-800 mb-2">Questions to ask:</h3>
            <ul className="list-disc ml-4 text-blue-900 space-y-2 text-sm italic">
              <li>"How many are hiding in the bag?"</li>
              <li>"Before you count, what do you think it will be?"</li>
              <li>"How many more do you need to get to {selectedNumber || '___'}?"</li>
            </ul>
          </div>

          {/* Completion Button */}
          <button 
            disabled={!selectedNumber || isCompleted}
            onClick={handleComplete}
            className={`w-full py-4 rounded-xl text-xl font-bold shadow-md transition-all ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-green-500 text-white hover:bg-green-600'}`}
          >
            {isCompleted ? "✓ Played for Today" : "I Played This!"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;