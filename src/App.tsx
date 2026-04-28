import React from 'react';

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 space-y-4">
        <h1 className="text-2xl font-serif text-center font-bold">Vibe Poster</h1>
        <p className="text-center text-gray-500 text-sm font-mono">Just you and the ocean.</p>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
          <p className="text-gray-500 font-medium">Click or drag image here</p>
        </div>
      </div>
    </div>
  );
}

export default App;