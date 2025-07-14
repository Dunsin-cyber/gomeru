'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import SWhandler from "smart-widget-handler";
import { useClient } from '@/context';

export default function CreatePage() {
    const [content, setContent] = useState('');
    const [price, setPrice] = useState('');
    const [lud16, setLud16] = useState('');
    const [successId, setSuccessId] = useState<string | null>(null);
    // const [userMetadata, setUserMetadata] = useState<any>(null);
    const [hostOrigin, setHostOrigin] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { userMetadata, setUserMetadata } = useClient();
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

    const handleSubmit = async () => {
        if(userMetadata === null) return
        const id = uuidv4();

        const res = await fetch('/api/create', {
            method: 'POST',
            body: JSON.stringify({
                id,
                content,
                price: parseInt(price),
                creator: userMetadata?.pubkey,
                lud16,
            }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (res.ok) {
            setSuccessId(id);
        }
    };

    return (
        <div className="p-4 max-w-lg mx-auto">
            <h2 className="font-bold text-xl mb-2">Create Locked Content</h2>
            <textarea placeholder="Secret..." className="w-full border p-2 mb-2" rows={4} value={content} onChange={(e) => setContent(e.target.value)} />
            <input placeholder="Price in sats" className="w-full border p-2 mb-2" value={price} onChange={(e) => setPrice(e.target.value)} />
            <input placeholder="Your LN Address (e.g. dunsin@getalby.com)" className="w-full border p-2 mb-4" value={lud16} onChange={(e) => setLud16(e.target.value)} />
            <button onClick={handleSubmit} className="bg-black text-white px-4 py-2 rounded">Submit</button>

            {successId && (
                <div className="mt-4">
                    ✅ Created! Share: <code>{`${window.location.origin}/unlock/${successId}`}</code>
                </div>
            )}
        </div>
    );
}
