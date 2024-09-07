/* eslint-disable import/no-anonymous-default-export */
import type { IProvider } from "@web3auth/base";
import { ethers } from "ethers";
import { contractABI } from "@/utils/contractABI";

const getChainId = async (provider: IProvider): Promise<any> => {
  try {
    const ethersProvider = new ethers.BrowserProvider(provider);
    // Get the connected Chain's ID
    const networkDetails = await ethersProvider.getNetwork();
    return networkDetails.chainId.toString();
  } catch (error) {
    return error;
  }
};

const getAccounts = async (provider: IProvider): Promise<any> => {
  try {
    const ethersProvider = new ethers.BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();

    // Get user's Ethereum public address
    const address = signer.getAddress();

    return await address;
  } catch (error) {
    return error;
  }
};

const getBalance = async (provider: IProvider): Promise<string> => {
  try {
    const ethersProvider = new ethers.BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();

    // Get user's Ethereum public address
    const address = signer.getAddress();

    // Get user's balance in ether
    const balance = ethers.formatEther(
      await ethersProvider.getBalance(address) // Balance is in wei
    );
    return balance;
  } catch (error) {
    return error as string;
  }
};

const getSigner = async (provider: IProvider): Promise<any> => {
  try {
    const ethersProvider = new ethers.BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();

    return signer;
  } catch (error) {
    return error as string;
  }
};

const sendTransaction = async (provider: IProvider): Promise<any> => {
  try {
    const ethersProvider = new ethers.BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();

    const destination = "0x40e1c367Eca34250cAF1bc8330E9EddfD403fC56";

    const amount = ethers.parseEther("0.001");

    // Submit transaction to the blockchain
    const tx = await signer.sendTransaction({
      to: destination,
      value: amount,
      maxPriorityFeePerGas: "5000000000", // Max priority fee per gas
      maxFeePerGas: "6000000000000", // Max fee per gas
    });

    // Wait for transaction to be mined
    const receipt = await tx.wait();

    return receipt;
  } catch (error) {
    return error as string;
  }
};

const signMessage = async (provider: IProvider, message: any): Promise<any> => {
  try {
    // For ethers v5
    // const ethersProvider = new ethers.providers.Web3Provider(provider);
    const ethersProvider = new ethers.BrowserProvider(provider);

    // For ethers v5
    // const signer = ethersProvider.getSigner();
    const signer = await ethersProvider.getSigner();
    // const originalMessage = "YOUR_MESSAGE";

    // Sign the message
    const signedMessage = await signer.signMessage(JSON.stringify(message));

    console.log("Signed Message: ", signedMessage);

    return signedMessage;
  } catch (error) {
    return error as string;
  }
};

const getPrivateKey = async (provider: IProvider): Promise<any> => {
  try {
    const privateKey = await provider.request({
      method: "eth_private_key",
    });

    return privateKey;
  } catch (error) {
    return error as string;
  }
};

const readContract = async (provider: IProvider): Promise<any> => {
  try {
    const signer = await getSigner(provider);

    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
    const contract = new ethers.Contract(
      contractAddress,
      JSON.parse(JSON.stringify(contractABI)),
      signer
    );

    // Read message from smart contract
    const message = await contract.message();
    return message;
  } catch (error) {
    return error as string;
  }
};

const writeContract = async (provider: IProvider, args: any): Promise<any> => {
  try {
    const signer = await getSigner(provider);

    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
    const contract = new ethers.Contract(
      contractAddress,
      JSON.parse(JSON.stringify(contractABI)),
      signer
    );
    // Generate random number between 1000 and 9000

    const tx = await contract.mintVehicle(args);
    // Wait for transaction to finish
    const receipt = await tx.wait();
    return receipt;
  } catch (error) {
    return error as string;
  }
};

export default {
  getChainId,
  getAccounts,
  getBalance,
  getSigner,
  sendTransaction,
  signMessage,
  getPrivateKey,
  readContract,
  writeContract,
};
