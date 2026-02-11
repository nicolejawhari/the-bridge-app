import React, { useState } from 'react';

const HidingAssessment = () => {
  const [stage, setStage] = useState('setup'); // setup, prompt, result
  const [targetNum, setTargetNum] = useState(6);
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [studentResponse, setStudentResponse] = useState('');
  
  // These prompts would eventually be randomly generated or pulled from your guide
  const prompts = [
    { show: 2, hide: targetNum - 2 },
    { show: 4, hide: targetNum - 4 },
    { show: 1, hide: targetNum - 1 }
  ];

  const strategies = [
    { label: "Knows Quickly (A)", level: "A", class: "bg-green-100" },
    { label: "Related Combinations (P+)", level: "P+", class: "bg-blue-100" },
    { label: "Counts On/Back (P)", level: "P", class: "bg-yellow-100" },
    { label: "Counts All (I)", level: "I", class: "bg-orange-100" },
    { label: "No Answer/Guess (N)", level: "N", class: "bg-red-100" }
  ];

  const handleNext = (level) => {
    if (currentPrompt < prompts.length - 1) {
      setCurrentPrompt(currentPrompt + 1);
      setStudentResponse('');
    } else {
      setStage('result');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md font-sans">
      <h2 className="text-xl font-bold mb-4">The Bridge: Hiding Assessment</h2>

      {stage === 'setup' && (
        <div>
          <p className="mb-4 text-lg">"Can you hand me {targetNum} counters?"</p>
          <button 
            onClick={() => setStage('prompt')}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold"
          >
            Confirmed: Start Assessment
          </button>
        </div>
      )}

      {stage === 'prompt' && (
        <div className="space-y-4">
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-500 uppercase">Teacher Action</p>
            <p className="text-xl font-semibold">"I am showing you {prompts[currentPrompt].show} counters."</p>
            <p className="text-lg mt-2 italic text-blue-600 font-bold">"How many are hiding?"</p>
          </div>

          <input 
            type="number" 
            placeholder="Student said..." 
            className="w-full border-2 p-2 rounded-md text-center text-xl"
            value={studentResponse}
            onChange={(e) => setStudentResponse(e.target.value)}
          />

          <p className="text-sm font-bold text-gray-600">Select Strategy:</p>
          <div className="grid grid-cols-1 gap-2">
            {strategies.map((s) => (
              <button 
                key={s.level}
                onClick={() => handleNext(s.level)}
                className={`${s.class} p-3 rounded-md text-left border border-gray-200 hover:shadow-inner`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {stage === 'result' && (
        <div className="text-center">
          <div className="text-5xl mb-4">✅</div>
          <h3 className="text-2xl font-bold">Assessment Complete</h3>
          <p className="mt-2 text-gray-600">Suggested Action:</p>
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="font-bold text-green-800 underline">Assigned Activity:</p>
            <p className="text-green-700">Grab Bag Subtraction (Range: 5, 6, 7)</p>
          </div>
          <button className="mt-6 text-blue-600 font-bold">Send to Parent Dashboard</button>
        </div>
      )}
    </div>
  );
};

export default HidingAssessment;