'use client';

import { useState, useEffect } from 'react';
import PayToUnlock from '@/components/PayToUnlock';
import SplitTip from '@/components/SplitTip';
import Example from '@/components/Example';
import SWhandler from "smart-widget-handler";

export default function Home() {
  const [mode, setMode] = useState<'unlock' | 'split'>('unlock');
  const [userMetadata, setUserMetadata] = useState<any>(null);
  const [hostOrigin, setHostOrigin] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize communication with host app
  useEffect(() => {
    SWhandler.client.ready();
  }, []);

  // Listen for messages from host app
  useEffect(() => {
    let listener = SWhandler.client.listen((event) => {
      if (event.kind === "user-metadata") {
        // Handle user metadata
        setUserMetadata(event.data?.user);
        console.log(event.data?.user);
        setHostOrigin(event.data?.host_origin);
      }
      if (event.kind === "err-msg") {
        // Handle error messages
        setErrorMessage(event.data);
      }
      if (event.kind === "nostr-event") {
        // Handle Nostr events
        const { pubkey, id } = event.data?.event || {};
        // Process event data
      }
    });

    return () => {
      // Clean up listener when component unmounts
      listener?.close();
    }
  }, []);

  const sendDataToHost = (data: string) => {
    if (hostOrigin) {
      // Send context data back to the host app
      SWhandler.client.sendContext(data, hostOrigin);
    }
  };

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

      <div>
        {userMetadata ? (
          <div>
            <h1>Hello, {userMetadata.display_name || userMetadata.name}</h1>
            <button onClick={() => sendDataToHost("This is data from the tool mini app")}>
              Send Data to Host
            </button>
          </div>
        ) : (
          <div>Loading user data...</div>
        )}
      </div>

      <Example />
    </main>
  );
}
