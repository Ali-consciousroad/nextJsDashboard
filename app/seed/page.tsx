'use client';

import { useState } from 'react';

export default function SeedPage() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSeed = async () => {
    try {
      const response = await fetch('/api/seed');
      const data = await response.json();
      
      if (response.ok) {
        setMessage(data.message);
        setError('');
      } else {
        setError(data.error);
        setMessage('');
      }
    } catch (err) {
      setError('Failed to seed database');
      setMessage('');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Database Seeding</h1>
      <button
        onClick={handleSeed}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Seed Database
      </button>
      {message && (
        <p className="mt-4 text-green-600">{message}</p>
      )}
      {error && (
        <p className="mt-4 text-red-600">{error}</p>
      )}
    </div>
  );
} 