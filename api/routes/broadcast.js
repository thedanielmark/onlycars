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

// Vehicle created
router.post("/vehicle-created", async (req, res) => {
  const { address, name, make, model, year, chargerType, connectorType } =
    req.body;

  // Call the sendBroadcastMessage function with the address and message
  // sendBroadcastMessage(address, message);
  // In a real application, use the user's wallet
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY || "");
  const xmtp = await Client.create(signer, {
    env: "production",
  });

  // Check if the recipient is activated on the XMTP network
  if (await xmtp.canMessage(address)) {
    const conversation = await xmtp.conversations.newConversation(address);
    await conversation.send(
      `You have successfully registered your DIMO enabled ${make} ${model} ${year} under the name - ${name}, on the OnlyCars network.\n\nYour charger configuration is as follows:\n\nCharger Type: ${chargerType}\nConnector Type: ${connectorType}\n\nYou can now start using your vehicle and pay for charging services on the OnlyCars network.\n\nYou will receive regular notifications about your vehicle's status and charging activities enabled via DIMO protocol.\n\nThank you for choosing OnlyCars!`
    );
    console.log(`Message successfully sent to ${address}`);
    res.status(200).json({ success: true });
  } else {
    console.log(`Recipient ${address} is not activated on the XMTP network.`);
  }
});

// Charging station created
router.post("/station-created", async (req, res) => {
  const {
    address: locationAddress,
    name,
    currentWalletAddress,
    latitude,
    longitude,
  } = req.body;

  const signer = new ethers.Wallet(process.env.PRIVATE_KEY || "");
  const xmtp = await Client.create(signer, {
    env: "production",
  });

  // Check if the recipient is activated on the XMTP network
  if (await xmtp.canMessage(currentWalletAddress)) {
    const conversation = await xmtp.conversations.newConversation(
      currentWalletAddress
    );
    await conversation.send(
      `You have successfully registered your EV charging station located at ${locationAddress} under the name - ${name}, on the OnlyCars network.\n\nYour charger configuration is as follows:\n\nAddress: ${locationAddress}\nLatitude: ${latitude}\nLongitude: ${longitude}\n\nOther drivers can now start using your charging station and pay for charging services on the OnlyCars network.\n\nYou will receive regular notifications about your charger's status and charging activities.\n\nThank you for choosing OnlyCars!`
    );
    console.log(`Message successfully sent to ${currentWalletAddress}`);
    res.status(200).json({ success: true });
  } else {
    console.log(`Recipient is not activated on the XMTP network.`);
  }
});

// Charge successful
router.post("/charge-successful", async (req, res) => {
  const { address, name, make, model, year } = req.body;

  const signer = new ethers.Wallet(process.env.PRIVATE_KEY || "");
  const xmtp = await Client.create(signer, {
    env: "production",
  });

  // Check if the recipient is activated on the XMTP network
  if (await xmtp.canMessage(address)) {
    const conversation = await xmtp.conversations.newConversation(address);
    await conversation.send(
      `Payment successful!\n\nWe have received your payment of 0.0001 ETH for your ${make} ${model} ${year} under the name - ${name}.\n\nThank you for choosing OnlyCars! Drive safe!`
    );
    console.log(`Message successfully sent to ${address}`);
    res.status(200).json({ success: true });
  } else {
    console.log(`Recipient ${address} is not activated on the XMTP network.`);
  }
});

// Charge failed
router.post("/charge-failed", async (req, res) => {
  const { address, name, make, model, year } = req.body;

  const signer = new ethers.Wallet(process.env.PRIVATE_KEY || "");
  const xmtp = await Client.create(signer, {
    env: "production",
  });

  // Check if the recipient is activated on the XMTP network
  if (await xmtp.canMessage(address)) {
    const conversation = await xmtp.conversations.newConversation(address);
    await conversation.send(
      `Payment failed!\n\nThere was a transaction failure while attempting to charge your OnlyCars wallet for the amount of 0.0001 ETH towards charging services for your ${make} ${model} ${year} under the name - ${name}.\n\nPlease make sure your wallet has sufficient balance before attempting to charge your vehicle!\n\nThank you!`
    );
    console.log(`Message successfully sent to ${address}`);
    res.status(200).json({ success: true });
  } else {
    console.log(`Recipient ${address} is not activated on the XMTP network.`);
  }
});

module.exports = router;
