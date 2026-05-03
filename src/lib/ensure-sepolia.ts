/**
 * Ensures MetaMask is connected to the Sepolia test network.
 * If not, it will prompt the user to switch (and add the network if needed).
 * Returns true if on Sepolia, false if user rejected the switch.
 */
export async function ensureSepolia(): Promise<boolean> {
  if (typeof window === "undefined" || !window.ethereum) return false;

  const SEPOLIA_CHAIN_ID = "0xaa36a7"; // 11155111 in hex

  try {
    const currentChainId: string = await window.ethereum.request({ method: "eth_chainId" });

    if (currentChainId.toLowerCase() === SEPOLIA_CHAIN_ID) {
      return true; // Already on Sepolia
    }

    // Try to switch to Sepolia
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
      return true;
    } catch (switchError: any) {
      // If Sepolia isn't added to MetaMask, add it
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: SEPOLIA_CHAIN_ID,
              chainName: "Sepolia Testnet",
              nativeCurrency: { name: "SepoliaETH", symbol: "ETH", decimals: 18 },
              rpcUrls: ["https://rpc.sepolia.org"],
              blockExplorerUrls: ["https://sepolia.etherscan.io"],
            },
          ],
        });
        return true;
      }
      throw switchError;
    }
  } catch (error) {
    console.error("Failed to switch to Sepolia:", error);
    return false;
  }
}
