"use client";
import React, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation"
import { IoIosArrowBack } from "react-icons/io";
import SWhandler from "smart-widget-handler";
import { useClient } from '@/context';

function Naviagtion() {
    const router = useRouter();
    const { userMetadata, setUserMetadata } = useClient();
    const [hostOrigin, setHostOrigin] = useState<string | null>(null);


    useEffect(() => {
        SWhandler.client.ready();
    }, []);

    // Listen for messages from host app.
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
                // setErrorMessage(event.data);
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

    return (
        <div className="flex flex-col gap-2 mx-9">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center p-4 bg-white dark:bg-[#121212] rounded-2xl shadow-md mb-4">

                {/* Top Centered Title */}
                <div className="w-full flex justify-center sm:justify-start items-center">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Gomeru
                    </h3>
                </div>

                {/* Navigation + Action */}
                <div className="flex justify-between items-center w-full sm:w-auto gap-4">
                    <IoIosArrowBack
                        className="text-orange-500 hover:text-orange-600 w-6 h-6 cursor-pointer transition-colors duration-200"
                        onClick={() => router.back()}
                    />

                    <button
                        onClick={() => router.push("create-content")}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition-all duration-200"
                    >
                        Create Content
                    </button>
                </div>

                {/* ✍🏽 Tagline / Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
                    Farm Bitcoin by sharing pay-to-unlock content. Built on VokiNonne Smart Widgets, it shows a preview and zaps unlock the rest — simple, direct, and monetized while you sleep.
                </p>

            </div>


            <div className="flex items-center gap-4">
                {userMetadata && (
                    <div className="flex items-center gap-4">
                        <div
                            className="w-10 h-10 rounded-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${userMetadata?.picture})` }}
                        ></div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <p className="text-white font-medium">{userMetadata?.display_name || userMetadata?.name}</p>
                                <div className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    <span className="text-green-500 text-sm">Connected</span>
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm">@{userMetadata?.name || userMetadata?.display_name}</p>
                        </div>
                    </div>
                )}
            </div>

        </div>
    )
}

export default Naviagtion