'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BitcoinPayWrapper } from '@/components/BitcoinPayButton';


export default function UnlockPage() {
    const { id } = useParams();
    const [data, setData] = useState<any>(null);
    const [paid, setPaid] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/content?id=${id}`);

                if (!res.ok) {
                    throw new Error(`API Error: ${res.status}`);
                }

                const data = await res.json();
                setData(data.data);
            } catch (error) {
                console.error('Fetch failed:', error);
                // Optionally set an error state
            }
        };

        fetchData();
    }, [id]);

 

    const pollForPayment = (hash: string) => {
        const interval = setInterval(async () => {
            const res = await fetch(`/api/check-payment?hash=${hash}`);
            const { paid } = await res.json();
            if (paid) {
                setPaid(true);
                clearInterval(interval);
            }
        }, 3000);
    };

    if (!data) return <p>Loading...</p>;

    return (
        <div className="p-4 max-w-lg mx-auto">
            <h2 className="font-bold text-xl mb-2">Unlock Content</h2>

            <BitcoinPayWrapper SATS={data.price} LNURL={data.lud16}/>

            {!paid && (
                <div className="mt-4">

                    {/* <p className="break-all text-sm mt-2">{invoice}</p> */}
                </div>
            )}

            {paid && (
                <div className="bg-green-100 p-4 mt-4 rounded">
                    ✅ Unlocked Content:
                    <pre className="whitespace-pre-wrap mt-2">{data.content}</pre>
                </div>
            )}
        </div>
    );
}
