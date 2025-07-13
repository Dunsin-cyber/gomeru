import type { Metadata } from "next";
import "./font.css";
import "./globals.css";
import { UserContextProvider } from "@/context";


export const metadata: Metadata = {
  title: "Gomeru",
  description: "A Nostr MiniApp (Tool Widget) that enables lightweight, embeddable Bitcoin-powered monetization inside Nostr posts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <UserContextProvider>
        <body
          className={`antialiased`}
        >
          {children}
        </body>
      </UserContextProvider>
    </html>
  );
}
