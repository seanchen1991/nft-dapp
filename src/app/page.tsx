"use client";

import { useEffect, useState } from "react";
import { type Address } from "viem";
import {
  useAccount,
  useBalance,
  usePublicClient,
  useReadContract,
  useWalletClient,
} from "wagmi";
import { sepolia } from "viem/chains";
import NFT_ABI from "../modules/wagmi/abi/ArtyNFT";
import styles from "./page.module.css";

const nftContractAddress = "0x04fb34223Fb055c92eEDCf5A3988822ce0518f8F";
const tokenURI = "https://gateway.pinata.cloud/ipfs/bafkreih34fzsbejw4swpav5zdfrpyshdzkzmitpmv3rkjmnth2o2ic57gy";

export default function Home(): JSX.Element {
  const [txDetails, setTxDetails] = useState<string>("");
  const { address: walletAddress } = useAccount();

  const chainId = sepolia.id;

  const { data: walletClient } = useWalletClient({
    chainId,
    account: walletAddress,
  });

  const publicClient = usePublicClient({
    chainId,
  });

  const [isPending, setIsPending] = useState(false);
  const { data: balance } = useBalance({
    address: walletAddress,
    chainId,
  });
  const isBalanceZero = balance?.value.toString() === "0";

  const { data, isFetched, refetch } = useReadContract({
    abi: NFT_ABI,
    address: nftContractAddress,
    functionName: "balanceOf",
    args: [walletAddress as Address],
  });

  async function mintNft(): Promise<void> {
    if (!walletClient || !publicClient || !walletAddress) return;

    try {
      setIsPending(true);
      setTxDetails("");

      const tx = {
        account: walletAddress as Address,
        address: nftContractAddress as Address,
        abi: NFT_ABI,
        functionName: "safeMint",
        args: [walletAddress, tokenURI],
      } as const;

      const { request } = await publicClient.simulateContract(tx);
      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });

      setTxDetails(`https://sepolia.etherscan.io/tx/${hash}`);

      await refetch();
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  }

  function textNftBalances(bal: string): string {
    const balance = Number(bal);

    if (balance > 1) {
      return `You have ${balance} NFTs`;
    } else if (balance === 1) {
      return `You have ${balance} NFT`;
    } else {
      return `You don't own any NFTs yet`;
    }
  }

  useEffect(() => {
    setTxDetails("");
  }, [walletAddress]);

  return !isFetched ? (
    <div />
  ) : (
    <div className={styles.container}>
      <div className={styles.rowBalance}>
        {walletAddress && (
          <span>{textNftBalances(data?.toString() || "0")}</span>
        )}
      </div>
      <br />

      <button
        disabled={
          isPending || !walletAddress || isBalanceZero
        }
        className={styles.buttonAction}
        onClick={mintNft}
        type="button"
      >
        {isPending ? "Confirming..." : "Mint NFT"}
      </button>

      {walletAddress && isBalanceZero && (
        <div className={styles.rowChecker}>
          <span className={styles.textError}>
            You don't have enough ETH to mint an NFT!
          </span>
        </div>
      )}
    </div>
  );
}
