'use client';

import { useState } from 'react';
import PayToUnlock from '@/components/PayToUnlock';
import SplitTip from '@/components/SplitTip';

export default function Home() {
  const [mode, setMode] = useState<'unlock' | 'split'>('unlock');

  return (
    <main className="p-4 max-w-sm mx-auto text-white bg-gray-900 rounded-xl shadow-md">
      <div className="flex justify-between mb-4">
        <button
          className={`px-3 py-1 rounded ${mode === 'unlock' ? 'bg-blue-600' : 'bg-gray-700'}`}
          onClick={() => setMode('unlock')}
        >
          Pay-to-Unlock
        </button>
        <button
          className={`px-3 py-1 rounded ${mode === 'split' ? 'bg-blue-600' : 'bg-gray-700'}`}
          onClick={() => setMode('split')}
        >
          Split-Tip
        </button>
      </div>

      {mode === 'unlock' ? <PayToUnlock /> : <SplitTip />}
    </main>
  );
}
