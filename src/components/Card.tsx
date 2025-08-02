import React, { useEffect, useState } from "react";
import { CheckCircle, Lock } from "lucide-react";
import { BitcoinPayWrapper } from '@/components/BitcoinPayButton';
import { useClient } from '@/context';
import supabase from "@/utils/supabase"


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
    const { paid, setPaid, userMetadata } = useClient();
    const [showPayButton, setShowPayButton] = useState(false)
    const [paid_, setPaid_] = useState(false)
    const [realtimeView, setRealtimeView] = useState(views)

    const handleZap = async () => {
        setShowPayButton(true);

    };

    useEffect(() => {
        const updateViewCount = async () => {
            //increase the views and add user to list of viewers once payment is made
            if (paid) {
                const newval = views + 1
                const { data: data2, error: err2 } = await supabase
                    .from("paywall_content")
                    .update({
                        views: newval,
                        viewers: userMetadata.pubkey,
                    })
                    .eq("id", id);
                setRealtimeView(newval)


                console.log("data2", data2, err2)
                setPaid(false)
                await checkIfUserPaid()
            }
        }
        updateViewCount()
    }, [paid])

    const checkIfUserPaid = async () => {
        try {
            const { data, error } = await supabase
                .from("paywall_content")
                .select("viewers")
                .eq("id", id);

            if (data) {

                const isPaid = data.some(
                    (viewer) => viewer.viewers === userMetadata.pubkey
                );

                if (isPaid) setPaid_(true);
            }
            if (error) {
                console.log("ERROR", error)
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        checkIfUserPaid()

    }, [])

    return (
        <div
            id={id}
            className="border border-gray-200 dark:border-gray-700 p-6 rounded-2xl shadow-lg bg-white dark:bg-[#1a1a1a] transition-all duration-300"
        >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {title}
            </h2>

            <p className="text-gray-700 dark:text-gray-300 mb-3">{previewContent}</p>

            {!paid_ && (
                <div className="mt-2 px-4 py-3 bg-gray-100 dark:bg-gray-800/50 rounded-xl text-center text-gray-500 dark:text-gray-400">
                    <Lock className="inline-block w-5 h-5 mb-1" />
                    <p className="text-sm font-medium">Unlock to view full content</p>
                </div>
            )}

            {paid_ && (
                <div className="mt-4 border border-orange-300 dark:border-orange-400 bg-white/90 dark:bg-[#1e1e1e] backdrop-blur-md px-5 py-4 rounded-2xl shadow-inner transition-all duration-300">

                    {/* Optional unlocked indicator */}
                    <div className="flex items-center gap-2 mb-3 text-orange-500 text-sm font-medium">
                        <CheckCircle className="w-4 h-4" />
                        <span>Content Unlocked</span>
                    </div>

                    {/* Full content */}
                    <p className="text-gray-800 dark:text-gray-100 leading-relaxed text-base">
                        {fullContent}
                    </p>
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 gap-4">
                <div className="text-sm text-gray-500 dark:text-gray-400 leading-snug">
                    💰 <strong>{price} sats</strong> &middot; ⚡ {lud16} <br />
                    👁️ {realtimeView} views
                </div>

                {showPayButton ? (
                    <BitcoinPayWrapper SATS={price} LNURL={lud16} widgetId={id} />
                ) : (
                    !paid_ && (
                        <button
                            onClick={handleZap}
                            className="bg-black text-white px-5 py-2 rounded-xl hover:bg-gray-900 transition-all duration-200"
                        >
                            Zap to Unlock
                        </button>
                    )
                )}
            </div>
        </div>
    );

};

export default Card;
