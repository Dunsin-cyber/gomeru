import React, { useState } from "react";
import { Lock } from "lucide-react";
import { BitcoinPayWrapper } from '@/components/BitcoinPayButton';
import { useClient } from '@/context';


type CardProps = {
    id: string;
    title: string;
    previewContent: string;
    fullContent: string;
    price: number;
    lud16: string;
    views: number;
};

const Card = ({
    id,
    title,
    previewContent,
    fullContent,
    price,
    lud16,
    views,
}: CardProps) => {
    const { paid } = useClient();
    const [showPayButton, setShowPayButton] = useState(false)

    const handleZap = () => {
        setShowPayButton(true);
        // pay one sats to the lud16
        // ad one viw to this id on supabase
        // set the zap logic to true
        // setUnlocked(true);
    };

    return (
        <div id={id} className="border border-gray-300 dark:border-gray-700 p-4 rounded-2xl shadow-md bg-white dark:bg-[#1a1a1a]">
            <h2 className="text-xl font-semibold mb-2">{title}</h2>

            <p className="text-gray-700 dark:text-gray-300">{previewContent}</p>

            {!paid && (
                <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-md text-center text-gray-500 dark:text-gray-400">
                    <Lock className="inline-block w-5 h-5 mb-1" />
                    <p className="text-sm">Unlock to view full content</p>
                </div>
            )}

            {paid && (
                <div className="mt-2 p-3 bg-green-50 dark:bg-green-900 rounded-md text-gray-800 dark:text-gray-100">
                    {fullContent}
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-3">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    💰 <strong>{price} sats</strong> &middot; ⚡ {lud16} <br />
                    👁️ {views} views
                </div>

                {!paid ? (
                    <>
                        {showPayButton ? (

                            <BitcoinPayWrapper SATS={price} LNURL={lud16} widgetId={id} />
                        ) : (
                            <button
                                onClick={handleZap}
                                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900"
                            >
                                Zap to Unlock
                            </button>
                        )}
                    </>


                ) : (
                    <button
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        onClick={() => alert("Already unlocked.")}
                    >
                        View Full Content
                    </button>
                )}
            </div>
        </div>
    );
};

export default Card;
