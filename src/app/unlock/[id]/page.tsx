'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BitcoinPayWrapper } from '@/components/BitcoinPayButton';
import { useClient } from '@/context';


export default function UnlockPage() {
    const { id } = useParams();
    const [data, setData] = useState<any>(null);
    const { paid } = useClient();




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



    if (!data) return <p>Loading...</p>;

    return (
        <div className="p-4 max-w-lg mx-auto">
            <h2 className="font-bold text-xl mb-2">Unlock Content</h2>

            <BitcoinPayWrapper SATS={data.price} LNURL={data.lud16} widgetId={id! as string} />

            {paid && (
                <div className="p-4 mt-4 rounded">
                    ✅ Unlocked Content:
                    <pre className="whitespace-pre-wrap mt-2">{data.content}</pre>
                </div>
            )}
        </div>
    );
}
