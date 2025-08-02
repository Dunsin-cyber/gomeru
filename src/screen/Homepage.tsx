"use client";
import React, { useState, useEffect } from 'react'
import Card from "@/components/Card";
import supabase from "@/utils/supabase";

type ContentT = {
    content: string;
    created_at: string;
    id: string;
    lud16: string;
    price: number;
    title: string;
    views: number;
    preview_content: string;
}


function Homepage() {
    const [content, setContent] = useState<ContentT[] | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch content from Supabase or any other source
    const fetchContent = async () => {
        try {
            setLoading(true);

            setContent(null);

            const { data, error } = await supabase
                .from('paywall_content')
                .select('*');

            if (error) {
                console.error("Error fetching content:", error);
            } else {
                setContent(data);
            }
        } catch (error) {
            console.error("Error fetching content:", error);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchContent();
    }, [])

 
    return (
        <div className="flex flex-col justify-center gap-3 mx-[5%]">
            {loading && (
                <div className="text-center text-gray-500">
                    Loading content...
                </div>
            )}

            {!loading && content && content?.length > 0 ? (
                content.map((item) => (
                    <Card
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        previewContent={item.preview_content}
                        fullContent={item.content}
                        price={item.price}
                        lud16={item.lud16}
                        views={item.views}
                    />
                ))
            ) : !loading && content && content?.length === 0 ? (
                <div className="text-center text-gray-500">
                    No content available. Please check back later.
                </div>
            ) : null}

           
        </div>
    )
}

export default Homepage


