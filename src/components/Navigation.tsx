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
        <div className="flex flex-col gap-2">
            <div className="flex justify-center items-center">

                {/* title */}
                <h1>
                    Gomeru
                </h1>
            </div>
            <div className="flex justify-between items-center">
                {/* back arrow */}
                <IoIosArrowBack className="cursor-pointer hover:green text-orange" onClick={() => router.back()} />
                {/* create paywall content */}
                <button onClick={() => router.push("create-content")} className="cursor-pointer bg-orange text-white rounded-sm border-1 p-3">create content</button>
            </div>

            <div className="flex flex-col justify-center items-center gap-3">

                <p>user - {userMetadata?.display_name}</p>
                {/* show connectde user */}

                <p>
                    Earn Bitcoin by sharing pay-to-unlock content. Built on YakiHonne Smart Widgets, it shows a preview and zaps unlock the rest — simple, direct, and monetized while you sleep.
                </p>
            </div>
        </div>
    )
}

export default Naviagtion