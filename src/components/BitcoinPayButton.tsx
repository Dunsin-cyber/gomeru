'use client';
import { Invoice, LightningAddress } from '@getalby/lightning-tools';
import React from 'react';
import dynamic from 'next/dynamic';
import { useClient } from '@/context';
import SWHandler from 'smart-widget-handler';



const Button = dynamic(
    () => import('@getalby/bitcoin-connect-react').then((mod) => mod.Payment),
    {
        ssr: false,
    }
);

export function BitcoinPayWrapper({ LNURL, SATS, widgetId }: { LNURL: string, SATS: number, widgetId:string }) {
    const [invoice, setInvoice] = React.useState<Invoice | undefined>(undefined);
    const [preimage, setPreimage] = React.useState<string | undefined>(undefined);
    const { setPaid , userMetadata} = useClient();

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
                        await invoice.verifyPayment();
                        if (invoice.preimage) {
                            setPaid(true);
                            setPreimage(invoice.preimage);
                            clearInterval(checkPaymentInterval);
                            // Optional: send signed nostr event
                            if (userMetadata) {
                                SWHandler.client.requestEventPublish(
                                    {
                                        kind: 1,
                                        content: `${userMetadata.name} just unlocked widget ${widgetId}`,
                                        tags: [['t', 'yakihonne-unlock']],
                                    },
                                    window.location.ancestorOrigins[0]
                                );
          }

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
