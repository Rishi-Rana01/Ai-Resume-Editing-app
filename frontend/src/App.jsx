import React, { useState } from 'react';
import ResumeEditor from './components/ResumeEditor';

export default function App() {
  return (
    <div className="min-h-screen bg-primary text-white flex flex-col items-center py-8 transition-colors duration-500">
      <h1 className="text-4xl font-bold mb-6 text-accent animate-fade-in">Resume Editor</h1>
      <ResumeEditor />
    </div>
  );
}
