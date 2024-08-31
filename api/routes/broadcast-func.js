import { ethers } from "ethers";
import { Client } from "@xmtp/xmtp-js";
import "dotenv/config";

// Function to send a broadcast message to a list of recipients
export async function sendBroadcastMessage(recipients, message) {
  // In a real application, use the user's wallet
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY || "");
  const xmtp = await Client.create(signer, {
    env: "production",
  });

  // Iterate over each recipient to send the message
  for (const recipient of recipients) {
    // Check if the recipient is activated on the XMTP network
    if (await xmtp.canMessage(recipient)) {
      const conversation = await xmtp.conversations.newConversation(recipient);
      await conversation.send(message);
      console.log(`Message successfully sent to ${recipient}`);
    } else {
      console.log(
        `Recipient ${recipient} is not activated on the XMTP network.`
      );
    }
  }
}

// Example usage
const recipients = ["0x245c7e7038cc9Fc3b76fce773d24ff70C72753a8"];
const message = "Private key test!"; // Your broadcast message
sendBroadcastMessage(recipients, message);
