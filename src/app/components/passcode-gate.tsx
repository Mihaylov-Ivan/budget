'use client';

import { useState, useEffect } from 'react';

export default function PasscodeGate({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated (stored in localStorage)
    const authStatus = localStorage.getItem('budget_app_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Get passcode from environment variable (client-side)
    const correctPasscode = process.env.NEXT_PUBLIC_PASSCODE || '';

    if (!correctPasscode) {
      setError('Passcode not configured. Please set NEXT_PUBLIC_PASSCODE in your environment variables.');
      return;
    }

    if (passcode === correctPasscode) {
      localStorage.setItem('budget_app_authenticated', 'true');
      setIsAuthenticated(true);
    } else {
      setError('Incorrect passcode. Please try again.');
      setPasscode('');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans flex items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-[var(--background)] border border-[var(--foreground)]/20 rounded-lg p-8 shadow-lg">
            <h1 className="text-3xl font-bold mb-2 text-center">Budget Tracker</h1>
            <p className="text-center text-[var(--foreground)]/70 mb-6">Enter passcode to continue</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter passcode"
                  className="w-full px-4 py-3 rounded-lg border border-[var(--foreground)]/20 bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Enter
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
