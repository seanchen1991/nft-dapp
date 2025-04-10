import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia, soneiumMinato } from "viem/chains";

const reownProjectId = process.env.NEXT_PUBLIC_REOWN_PROJECT;

const minato = {
  ...soneiumMinato,
  name: "Soneium Minato",
};

export const WAGMI_CONFIG = getDefaultConfig({
    appName: "Nft-Dapp",
    projectId: reownProjectId as string,
    chains: [minato, sepolia],
    ssr: true,
});
