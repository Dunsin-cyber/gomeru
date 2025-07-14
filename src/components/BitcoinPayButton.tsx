'use client';
import { Invoice, LightningAddress } from '@getalby/lightning-tools';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useClient } from '@/context';
import SWHandler from 'smart-widget-handler';



const Button = dynamic(
    () => import('@getalby/bitcoin-connect-react').then((mod) => mod.Payment),
    {
        ssr: false,
    }
);

export function BitcoinPayWrapper({ LNURL, SATS, widgetId }: { LNURL: string, SATS: number, widgetId: string }) {
    const [invoice, setInvoice] = React.useState<Invoice | undefined>(undefined);
    const [preimage, setPreimage] = React.useState<string | undefined>(undefined);
    const { setPaid, userMetadata, setUserMetadata } = useClient();
    
    // Initialize communication with host app
    useEffect(() => {
        SWHandler.client.ready();
    }, []);

    // Listen for messages from host app
    useEffect(() => {
        let listener = SWHandler.client.listen((event) => {
            if (event.kind === "user-metadata") {
                // Handle user metadata
                setUserMetadata(event.data?.user);
                console.log(event.data?.user);
                // setHostOrigin(event.data?.host_origin);
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
    }, [])



    React.useEffect(() => {
        (async () => {
            try {

                const ln = new LightningAddress(LNURL);
                await ln.fetch();
                const invoice = await ln.requestInvoice({
                    satoshi: SATS,
                    comment: 'Gomeru Payment',
                });
                setInvoice(invoice);

                const checkPaymentInterval = setInterval(async () => {
                    try {
                        const parentOrigin =
                            window.location.ancestorOrigins?.[0] || 'https://yakihonne.com';

                        await invoice.verifyPayment();
                        if (invoice.preimage) {
                            setPaid(true);
                            setPreimage(invoice.preimage);
                            clearInterval(checkPaymentInterval);
                            // Optional: send signed nostr event
                            console.log("Origin:", parentOrigin);
                            console.log("userMetadata", userMetadata)

                            // if (userMetadata) {
                                const result = SWHandler.client.requestEventPublish(
                                    {
                                        kind: 1,
                                        content: `user just unlocked widget ${widgetId}`,
                                        tags: [['t', 'yakihonne-unlock']],
                                    },
                                    parentOrigin
                                );

                                console.log('Event published:', result);
                            // }

                        }
                    } catch (error) {
                        console.error(error);
                    }
                }, 1000);
                return () => {
                    clearInterval(checkPaymentInterval);
                };
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

    const paymentResponse = React.useMemo(
        () => (preimage ? { preimage } : undefined),
        [preimage]
    );

    return (
        <>
            {invoice && (
                <Button
                    invoice={invoice.paymentRequest}
                    onPaid={(response) => {
                        setPreimage(response.preimage);
                        setPaid(true);
                    }}
                    payment={paymentResponse}
                />
            )}
        </>
    );
}
