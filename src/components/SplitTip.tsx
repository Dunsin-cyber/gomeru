"use client";
import React, { useState } from 'react';

const SPLIT_RECIPIENTS = [
  { name: 'Dunsin', wallet: 'walletA' },
  { name: 'Co-founder', wallet: 'walletB' },
];

function SplitTip() {
  const [invoice, setInvoice] = useState('');
  const [paid, setPaid] = useState(false);

  const handleTip = async () => {
    const response = await fetch('/api/split', {
      method: 'POST',
      body: JSON.stringify({ amount: 500, recipients: SPLIT_RECIPIENTS }),
    });
    const data = await response.json();
    setInvoice(data.payment_request);

    const statusInterval = setInterval(async () => {
      const status = await fetch(`/api/status/${data.id}`).then(res => res.json());
      if (status.paid) {
        setPaid(true);
        clearInterval(statusInterval);
      }
    }, 3000);
  };

  if (paid) return <p className="text-green-400">Thanks for your tip!</p>;

  return (
    <div>
      <button onClick={handleTip} className="bg-purple-600 text-white px-4 py-2 rounded">
        Tip 500 sats (split)
      </button>
      {invoice && (
        <div className="mt-2 text-sm">
          <code>{invoice}</code>
          <p className="text-yellow-300">Waiting for payment...</p>
        </div>
      )}
    </div>
  );
}

export default SplitTip;
