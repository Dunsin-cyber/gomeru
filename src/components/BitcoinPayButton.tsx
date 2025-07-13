'use client';
import { Invoice, LightningAddress } from '@getalby/lightning-tools';
import React from 'react';
import dynamic from 'next/dynamic';
const Button = dynamic(
    () => import('@getalby/bitcoin-connect-react').then((mod) => mod.Payment),
    {
        ssr: false,
    }
);

export function BitcoinPayWrapper({ LNURL, SATS }: { LNURL: string, SATS: number }) {
    const [invoice, setInvoice] = React.useState<Invoice | undefined>(undefined);
    const [preimage, setPreimage] = React.useState<string | undefined>(undefined);

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
                            setPreimage(invoice.preimage);
                            clearInterval(checkPaymentInterval);
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
                    }}
                    payment={paymentResponse}
                />
            )}
        </>
    );
}
