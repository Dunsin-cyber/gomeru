'use client';

import { useState, useEffect } from 'react';
import SWHandler from "smart-widget-handler";
import { useClient } from '@/context';
import { useRouter } from 'next/navigation';
import supabase from "@/utils/supabase";
import { IoIosArrowBack } from 'react-icons/io';

export default function CreatePage() {
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const { userMetadata, setUserMetadata } = useClient();
    const [lud16, setLud16] = useState(userMetadata?.nip05 || '');
    const [previewContent, setPreviewContent] = useState("")
    const [successId, setSuccessId] = useState<string | null>(null);
    // const [userMetadata, setUserMetadata] = useState<any>(null);
    const [hostOrigin, setHostOrigin] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Initialize communication with host app
    useEffect(() => {
        SWHandler.client.ready();
    }, []);

    console.log("userMetadata", userMetadata)

    // Listen for messages from host app
    useEffect(() => {
        let listener = SWHandler.client.listen((event) => {
            //? this can also be
            //(event.data.user.kind === 0) to check if it's a user metadata event
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
        setLoading(true)
        try {
            console.log("was clicked")
            if (userMetadata === null) return


            if (!content || !price || !lud16) {
                setErrorMessage("Please fill in all fields.");
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('paywall_content')
                .insert([
                    { content, price: parseInt(price), creator: userMetadata?.pubkey, lud16, views: 0, title, preview_content: previewContent },
                ])
                .select()

            // console.log("data", data, "error", error)
            if (error) {
                setErrorMessage(error.message);
            }

            if (data) {
                setSuccessId(data[0].id);
                // if (userMetadata) {
                const parentOrigin =
                    window.location.ancestorOrigins?.[0] || 'https://yakihonne.com';

                 SWHandler.client.requestEventPublish(
                    {
                        kind: 1,
                        content: `Created new content with id ${data[0].id}`,
                        tags: [['t', 'yakihonne-unlock']],
                    },
                    parentOrigin
                );
            }
        } catch (err) {
            console.error("Error creating content:", err);
            // setErrorMessage("Failed to create content. Please try again.");
        } finally {
            setLoading(false)
        }
    };



    useEffect(() => {
        const listener = SWHandler.host.listen((data) => {
            console.log('Received message from iframe:', data);

            if (data.kind === 'sign-event') {
                // Handle sign request
                // ...
            }
        });

        return () => listener.close();
    }, []);


    return (
        <div className="p-6 max-w-2xl mx-auto bg-white dark:bg-[#121212] shadow-lg rounded-2xl space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Locked Content</h2>

            {/* Title */}
            <input
                placeholder="Title..."
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            {/* Preview */}
            <input
                placeholder="Preview Content"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                value={previewContent}
                onChange={(e) => setPreviewContent(e.target.value)}
            />

            {/* Secret Content */}
            <textarea
                placeholder="Secret..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />

            {/* Price */}
            <input
                type="number"
                placeholder="Price in sats"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
            />

            {/* LN Address */}
            <input
                placeholder="Your LN Address (e.g. dunsin@getalby.com)"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                value={lud16}
                onChange={(e) => setLud16(e.target.value)}
            />

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-xl transition-all duration-200 shadow-md"
            >
                {loading ? "Loading..." : "Submit"}
            </button>

            {/* Error Message */}
            {errorMessage && (
                <p className="text-red-500 text-sm">{errorMessage}</p>
            )}

            {/* Success */}
            {successId && (
                <div className="mt-6 space-y-3 text-sm text-green-600 dark:text-green-400">
                    <div
                        className="cursor-pointer"
                        onClick={() => router.push("/unlock/" + successId)}
                    >
                        ✅ Created!
    
                    </div>

                    {/* Return Home */}
                    <button
                        onClick={() => router.push("/")}
                        className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                    >
                        <IoIosArrowBack className="w-4 h-4" />
                        <span>Return to Home</span>
                    </button>
                </div>
            )}
        </div>
    );

}
