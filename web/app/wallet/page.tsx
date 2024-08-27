"use client";

import { useEffect } from "react";
import { useWeb3Auth } from "@web3auth/no-modal-react-hooks";
import { useWalletServicesPlugin } from "@web3auth/wallet-services-plugin-react-hooks";
// import { WalletServicesPlugin } from "@web3auth/wallet-services-plugin";
// import { useAuth } from "@/providers/AuthProvider";

function WalletPage() {
  // const { web3auth } = useAuth();
  // const { isConnected } = useWeb3Auth();
  const { isPluginConnected, showCheckout } = useWalletServicesPlugin();
  // const walletServicesPlugin = new WalletServicesPlugin();

  useEffect(() => {
    async function funk() {
      console.log("WalletPage useEffect");
      // web3auth && (await web3auth.init());
      // await walletServicesPlugin.showCheckout();

      await showCheckout();
    }

    isPluginConnected && funk();
  }, [isPluginConnected]);

  return <>Wallet</>;
}

export default WalletPage;
