"use client";
import React, { useState } from 'react';

function PayToUnlock() {
  const [paid, setPaid] = useState(false);
  const [invoice, setInvoice] = useState('');
  const [paymentChecking, setPaymentChecking] = useState(false);

  const content = 'This is the secret content revealed after payment.';

  const handleUnlock = async () => {
    const response = await fetch('/api/invoice', {
      method: 'POST',
      body: JSON.stringify({ amount: 200 }), // sats
    });
    const data = await response.json();
    setInvoice(data.payment_request);

    // Optional: start checking invoice status...
    setPaymentChecking(true);
    const statusInterval = setInterval(async () => {
      const status = await fetch(`/api/status/${data.id}`).then(res => res.json());
      if (status.paid) {
        setPaid(true);
        clearInterval(statusInterval);
      }
    }, 3000);
  };

  if (paid) return <div className="mt-4">{content}</div>;

  return (
    <div>
      <button onClick={handleUnlock} className="bg-green-600 text-white px-4 py-2 rounded">
        Pay 200 sats to unlock
      </button>

      {invoice && (
        <div className="mt-2">
          <code className="text-xs">{invoice}</code>
          {paymentChecking && <p className="text-sm text-yellow-300">Waiting for payment...</p>}
        </div>
      )}
    </div>
  );
}

export default PayToUnlock;
