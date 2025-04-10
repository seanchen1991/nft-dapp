import type { Metadata } from "next";
import { Header } from "@/modules/common/components/Header";
import { WalletProvider } from "@/modules/wagmi/components/WalletProvider";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nftx",
  description:
    "A Demo app for minting and transferring NFTs. Built with Wagmi and Rainbowkit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          <Header />
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
