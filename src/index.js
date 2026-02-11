import React from 'react';
import ReactDOM from 'react-dom/client';
import Assessment from './Assessment'; // This is your assessment code
import ParentDashboard from './ParentDashboard'; // This is your parent code

const root = ReactDOM.createRoot(document.getElementById('root'));

// For now, we are showing the Assessment. 
// Later, we will add "Routing" so parents see one thing and teachers see another.
root.render(
  <React.StrictMode>
    <Assessment />
  </React.StrictMode>
);
