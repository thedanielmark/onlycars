const express = require("express");
// const { sendBroadcastMessage } = require("./broadcast-func");
const { ethers } = require("ethers");
const { Client } = require("@xmtp/xmtp-js");

const router = express.Router();

router.post("/broadcast", async (req, res) => {
  const { address, message } = req.body;

  // Call the sendBroadcastMessage function with the address and message
  // sendBroadcastMessage(address, message);
  // In a real application, use the user's wallet
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY || "");
  const xmtp = await Client.create(signer, {
    env: "production",
  });

  // Iterate over each recipient to send the message
  // for (const recipient of recipients) {
  // Check if the recipient is activated on the XMTP network
  if (await xmtp.canMessage(address)) {
    const conversation = await xmtp.conversations.newConversation(address);
    await conversation.send(message);
    console.log(`Message successfully sent to ${address}`);
    res.status(200).json({ success: true });
  } else {
    console.log(`Recipient ${recipient} is not activated on the XMTP network.`);
  }
  // }
});

module.exports = router;
