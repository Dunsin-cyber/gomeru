"use client";
import React, { useState, useEffect } from 'react';
import SWHandler from 'smart-widget-handler';

function WidgetApp() {
    const [user, setUser] = useState<any>(null);
    const [signedEvents, setSignedEvents] = useState<any[]>([]);
    const [content, setContent] = useState('');

    useEffect(() => {
        // Notify parent we're ready
        SWHandler.client.ready();

        // Set up listener for parent messages
        const listener = SWHandler.client.listen((data) => {
            console.log('Received message from parent:', data);

            if (data.kind === 'user-metadata') {
                setUser(data.data.user);
            } else if (data.kind === 'nostr-event' && data.data.status === 'success') {
                console.log('Received signed event:', data.data.event);
                // Add the signed event to our list
                setSignedEvents(prev => [...prev, data.data.event]);
            }
        });

        // Clean up on unmount
        return () => listener.close();
    }, []);

    const handlePublish = () => {
        if (!content.trim()) return;

        SWHandler.client.requestEventPublish(
            {
                content,
                tags: [],
                kind: 1
            },
            window.location.ancestorOrigins[0]
        );

        // Clear the input
        setContent('');
    };

    if (!user) {
        return <div>Loading user data...</div>;
    }

    return (
        <div className="widget-container">
            <div className="user-info">
                <img src={user.picture} alt={user.name} width="50" height="50" />
                <h2>{user?.display_name || user.name}</h2>
            </div>

            <div className="publish-form">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind?"
                    rows={4}
                />
                <button onClick={handlePublish}>Publish Note</button>
            </div>

            {signedEvents.length > 0 && (
                <div className="events-list">
                    <h3>Your Notes</h3>
                    {signedEvents.map((event) => (
                        <div key={event.id} className="event-card">
                            <p>{event.content}</p>
                            <small>
                                {new Date(event.created_at * 1000).toLocaleString()}
                            </small>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default WidgetApp;
