const ethers = require("ethers");
const { Client } = require("@xmtp/xmtp-js");
require("dotenv").config();

/**
 * Checks if an address is on the XMTP network.
 *
 * @param {string} address - The address to check.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating if the address is on the XMTP network.
 */
async function isAddressOnXmtpNetwork(address) {
  try {
    // Initialize the XMTP client with the user's wallet
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY || "");
    const xmtp = await Client.create(signer, {
      env: "production",
    });

    // Check if the address can receive messages
    const canMessage = await xmtp.canMessage(address);

    return canMessage;
  } catch (error) {
    console.error("Error checking XMTP network:", error);
    throw new Error("Failed to check address on XMTP network");
  }
}

module.exports = { isAddressOnXmtpNetwork };
