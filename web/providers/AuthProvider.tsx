/* eslint-disable no-console */
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth } from "@web3auth/modal";

import RPC from "@/utils/ethersRPC";

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || "";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xAA36A7",
  rpcTarget:
    "https://eth-sepolia.g.alchemy.com/v2/4aXwWgRAyOxgQdQftRqG7yJ5LMumJwmP",
  displayName: "Ethereum Sepolia Testnet",
  blockExplorerUrl: "https://sepolia.etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
});

interface AuthContextProps {
  provider: IProvider | null;
  status: string;
  loggedIn: boolean;
  user: any | null;
  address: string;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getUserInfo: () => Promise<void>;
  getAccounts: () => Promise<void>;
  getBalance: () => Promise<void> | any;
  getSigner: () => Promise<void> | any;
  signMessage: (message: any) => Promise<void | any>;
  sendTransaction: () => Promise<void>;
  getPrivateKey: () => Promise<void> | any;
  readContract: () => Promise<void>;
  writeContract: (data: any) => Promise<void> | any;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [status, setStatus] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [address, setAddress] = useState<string | any>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal();
        console.log(web3auth.status);
        setStatus(web3auth.status);
        setProvider(web3auth.provider);

        if (web3auth.connected) {
          getUserInfo();
          getAccounts();
          getPrivateKey();
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 0xf48C5aBD5596d6F80abb0c3a8F061A0BaB29ee5f
  // 0xf48C5aBD5596d6F80abb0c3a8F061A0BaB29ee5f

  const login = async () => {
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    if (web3auth.connected) {
      getUserInfo();
      getAccounts();
      setLoggedIn(true);
    }
  };

  const logout = async () => {
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
    uiConsole("logged out");
  };

  const getUserInfo = async () => {
    const user = await web3auth.getUserInfo();
    setUser(user);
    console.log(user);
    uiConsole(user);
  };

  const getAccounts = async () => {
    if (!provider) {
      const web3authProvider = await web3auth.connect();
      if (web3authProvider !== null) {
        const addressFromProvider = await RPC.getAccounts(web3authProvider);
        setAddress(addressFromProvider);
        uiConsole("Line 115", addressFromProvider);
      }
      uiConsole("hehe fix provider not initialized yet");
      return;
    }
    const address = await RPC.getAccounts(provider);
    uiConsole(address);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const balance = await RPC.getBalance(provider);
    return balance;
  };

  const getSigner = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const signer = await RPC.getSigner(provider);
    uiConsole(signer);
    return signer;
  };

  const signMessage = async (message: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    console.log(message);
    const signedMessage = await RPC.signMessage(provider, message);
    uiConsole(signedMessage);
    return signedMessage;
  };

  const sendTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    uiConsole("Sending Transaction...");
    const transactionReceipt = await RPC.sendTransaction(provider);
    uiConsole(transactionReceipt);
  };

  const getPrivateKey = async () => {
    if (!provider) {
      const web3authProvider = await web3auth.connect();
      if (web3authProvider !== null) {
        const privateKeyFromProvider = await RPC.getPrivateKey(
          web3authProvider
        );
        setAddress(privateKeyFromProvider);
        uiConsole("Line 177", privateKeyFromProvider);
      }
      uiConsole("Provider not initialized yet");
      return;
    }
    const privateKeyFromProvider = await RPC.getPrivateKey(provider);
    uiConsole(privateKeyFromProvider);
  };

  const readContract = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const message = await RPC.readContract(provider);
    uiConsole(message);
  };

  const writeContract = async (data: any) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const receipt = await RPC.writeContract(provider, data);
    uiConsole(receipt);
    if (receipt) {
      setTimeout(async () => {
        await readContract();
      }, 10000);
    }
  };

  function uiConsole(...args: any[]): void {
    console.log(...args);
  }

  return (
    <AuthContext.Provider
      value={{
        provider,
        status,
        user,
        address,
        loggedIn,
        login,
        logout,
        getUserInfo,
        getAccounts,
        getBalance,
        getSigner,
        signMessage,
        sendTransaction,
        getPrivateKey,
        readContract,
        writeContract,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
